
-- Create enum for point transaction types
CREATE TYPE public.point_transaction_type AS ENUM (
  'earned',
  'redeemed',
  'bonus',
  'penalty',
  'adjustment'
);

-- Create enum for point earning activities
CREATE TYPE public.point_activity_type AS ENUM (
  'class_attendance',
  'class_booking',
  'referral',
  'signup_bonus',
  'weekly_streak',
  'monthly_streak',
  'review_submission',
  'profile_completion',
  'admin_adjustment'
);

-- Create user_points table to track total points for each user
CREATE TABLE public.user_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  lifetime_earned INTEGER NOT NULL DEFAULT 0,
  lifetime_redeemed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create point_transactions table to track all point activities
CREATE TABLE public.point_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type public.point_transaction_type NOT NULL,
  activity_type public.point_activity_type NOT NULL,
  points INTEGER NOT NULL,
  description TEXT,
  reference_id UUID, -- Can reference class_id, booking_id, etc.
  reference_type TEXT, -- 'class', 'booking', 'referral', etc.
  admin_id UUID REFERENCES auth.users(id), -- If transaction was created by admin
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB -- For storing additional data about the transaction
);

-- Create point_rules table for configurable point earning rules
CREATE TABLE public.point_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  activity_type public.point_activity_type NOT NULL UNIQUE,
  points_awarded INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT,
  conditions JSONB, -- For storing complex conditions
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.user_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.point_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_points
CREATE POLICY "Users can view their own points" 
  ON public.user_points 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all user points" 
  ON public.user_points 
  FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update user points" 
  ON public.user_points 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert user points" 
  ON public.user_points 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for point_transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.point_transactions 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions" 
  ON public.point_transactions 
  FOR SELECT 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert transactions" 
  ON public.point_transactions 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert transactions" 
  ON public.point_transactions 
  FOR INSERT 
  WITH CHECK (true);

-- RLS Policies for point_rules
CREATE POLICY "Everyone can view point rules" 
  ON public.point_rules 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage point rules" 
  ON public.point_rules 
  FOR ALL 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Insert default point rules
INSERT INTO public.point_rules (activity_type, points_awarded, description) VALUES
  ('class_attendance', 10, 'Points for attending a yoga class'),
  ('class_booking', 5, 'Points for booking a yoga class'),
  ('referral', 50, 'Points for referring a new user'),
  ('signup_bonus', 100, 'Welcome bonus points for new users'),
  ('weekly_streak', 25, 'Points for maintaining a weekly practice streak'),
  ('monthly_streak', 100, 'Points for maintaining a monthly practice streak'),
  ('review_submission', 15, 'Points for submitting a class review'),
  ('profile_completion', 20, 'Points for completing user profile'),
  ('admin_adjustment', 0, 'Manual point adjustment by admin');

-- Function to update user points when transactions are added
CREATE OR REPLACE FUNCTION public.update_user_points()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert or update user_points record
  INSERT INTO public.user_points (user_id, total_points, lifetime_earned, lifetime_redeemed)
  VALUES (
    NEW.user_id,
    CASE 
      WHEN NEW.transaction_type IN ('earned', 'bonus') THEN NEW.points
      WHEN NEW.transaction_type IN ('redeemed', 'penalty') THEN -NEW.points
      ELSE NEW.points
    END,
    CASE WHEN NEW.transaction_type IN ('earned', 'bonus') THEN NEW.points ELSE 0 END,
    CASE WHEN NEW.transaction_type IN ('redeemed', 'penalty') THEN ABS(NEW.points) ELSE 0 END
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_points = user_points.total_points + 
      CASE 
        WHEN NEW.transaction_type IN ('earned', 'bonus') THEN NEW.points
        WHEN NEW.transaction_type IN ('redeemed', 'penalty') THEN -NEW.points
        ELSE NEW.points
      END,
    lifetime_earned = user_points.lifetime_earned + 
      CASE WHEN NEW.transaction_type IN ('earned', 'bonus') THEN NEW.points ELSE 0 END,
    lifetime_redeemed = user_points.lifetime_redeemed + 
      CASE WHEN NEW.transaction_type IN ('redeemed', 'penalty') THEN ABS(NEW.points) ELSE 0 END,
    updated_at = now();
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update user points
CREATE TRIGGER update_user_points_trigger
  AFTER INSERT ON public.point_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_user_points();

-- Function to award points (can be called from application)
CREATE OR REPLACE FUNCTION public.award_points(
  _user_id UUID,
  _activity_type public.point_activity_type,
  _reference_id UUID DEFAULT NULL,
  _reference_type TEXT DEFAULT NULL,
  _admin_id UUID DEFAULT NULL,
  _custom_points INTEGER DEFAULT NULL,
  _description TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  _points INTEGER;
  _rule_description TEXT;
  _transaction_id UUID;
BEGIN
  -- Get points from rules table or use custom points
  IF _custom_points IS NOT NULL THEN
    _points := _custom_points;
  ELSE
    SELECT points_awarded, description INTO _points, _rule_description
    FROM public.point_rules 
    WHERE activity_type = _activity_type AND is_active = true;
    
    IF NOT FOUND THEN
      RAISE EXCEPTION 'No active rule found for activity type: %', _activity_type;
    END IF;
  END IF;
  
  -- Insert transaction
  INSERT INTO public.point_transactions (
    user_id, 
    transaction_type, 
    activity_type, 
    points, 
    description, 
    reference_id, 
    reference_type, 
    admin_id
  )
  VALUES (
    _user_id,
    CASE WHEN _points >= 0 THEN 'earned'::public.point_transaction_type ELSE 'penalty'::public.point_transaction_type END,
    _activity_type,
    ABS(_points),
    COALESCE(_description, _rule_description),
    _reference_id,
    _reference_type,
    _admin_id
  )
  RETURNING id INTO _transaction_id;
  
  RETURN _transaction_id;
END;
$$;
