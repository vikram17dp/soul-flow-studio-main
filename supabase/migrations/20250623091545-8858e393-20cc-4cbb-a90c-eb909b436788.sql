
-- Create weight_goals table
CREATE TABLE public.weight_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  start_weight DECIMAL(5,2) NOT NULL,
  target_weight DECIMAL(5,2),
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create weight_entries table
CREATE TABLE public.weight_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  weight DECIMAL(5,2) NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weight_achievements table
CREATE TABLE public.weight_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL,
  weight_lost DECIMAL(5,2) NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 0,
  achieved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.weight_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for weight_goals
CREATE POLICY "Users can view their own weight goals" 
  ON public.weight_goals 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weight goals" 
  ON public.weight_goals 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight goals" 
  ON public.weight_goals 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight goals" 
  ON public.weight_goals 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for weight_entries
CREATE POLICY "Users can view their own weight entries" 
  ON public.weight_entries 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weight entries" 
  ON public.weight_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weight entries" 
  ON public.weight_entries 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weight entries" 
  ON public.weight_entries 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create RLS policies for weight_achievements
CREATE POLICY "Users can view their own weight achievements" 
  ON public.weight_achievements 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own weight achievements" 
  ON public.weight_achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to automatically award points for weight entries
CREATE OR REPLACE FUNCTION public.award_weight_entry_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Award 5 points for each weight entry
  PERFORM public.award_points(
    NEW.user_id,
    'class_attendance'::public.point_activity_type, -- Using existing activity type
    NEW.id,
    'weight_entry',
    NULL,
    5,
    'Weight entry recorded'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER weight_entry_points_trigger
  AFTER INSERT ON public.weight_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.award_weight_entry_points();

-- Create trigger to check for achievements
CREATE OR REPLACE FUNCTION public.check_weight_achievements()
RETURNS TRIGGER AS $$
DECLARE
  goal_record RECORD;
  weight_lost DECIMAL;
  achievement_type TEXT;
  points_to_award INTEGER;
BEGIN
  -- Get the user's weight goal
  SELECT * INTO goal_record
  FROM public.weight_goals
  WHERE user_id = NEW.user_id;
  
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;
  
  -- Calculate weight lost
  weight_lost := goal_record.start_weight - NEW.weight;
  
  -- Check for achievements
  IF weight_lost >= 1 AND NOT EXISTS (
    SELECT 1 FROM public.weight_achievements 
    WHERE user_id = NEW.user_id AND achievement_type = 'first_kg'
  ) THEN
    achievement_type := 'first_kg';
    points_to_award := 50;
  ELSIF weight_lost >= 5 AND NOT EXISTS (
    SELECT 1 FROM public.weight_achievements 
    WHERE user_id = NEW.user_id AND achievement_type = '5kg_milestone'
  ) THEN
    achievement_type := '5kg_milestone';
    points_to_award := 100;
  ELSIF weight_lost >= 10 AND NOT EXISTS (
    SELECT 1 FROM public.weight_achievements 
    WHERE user_id = NEW.user_id AND achievement_type = '10kg_milestone'
  ) THEN
    achievement_type := '10kg_milestone';
    points_to_award := 200;
  ELSIF weight_lost >= 25 AND NOT EXISTS (
    SELECT 1 FROM public.weight_achievements 
    WHERE user_id = NEW.user_id AND achievement_type = '25kg_milestone'
  ) THEN
    achievement_type := '25kg_milestone';
    points_to_award := 500;
  ELSIF weight_lost >= 50 AND NOT EXISTS (
    SELECT 1 FROM public.weight_achievements 
    WHERE user_id = NEW.user_id AND achievement_type = '50kg_milestone'
  ) THEN
    achievement_type := '50kg_milestone';
    points_to_award := 1000;
  END IF;
  
  -- Insert achievement if one was earned
  IF achievement_type IS NOT NULL THEN
    INSERT INTO public.weight_achievements (
      user_id,
      achievement_type,
      weight_lost,
      points_awarded
    ) VALUES (
      NEW.user_id,
      achievement_type,
      weight_lost,
      points_to_award
    );
    
    -- Award points
    PERFORM public.award_points(
      NEW.user_id,
      'class_attendance'::public.point_activity_type, -- Using existing activity type
      NEW.id,
      'weight_achievement',
      NULL,
      points_to_award,
      'Weight loss achievement: ' || achievement_type
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER weight_achievement_trigger
  AFTER INSERT ON public.weight_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.check_weight_achievements();
