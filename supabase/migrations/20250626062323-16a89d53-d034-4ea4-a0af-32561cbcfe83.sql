
-- Update the packages table to only have basic and premium categories
UPDATE public.packages 
SET category = 'premium' 
WHERE category != 'basic' AND category != 'premium';

-- Update existing user profiles to only use basic or premium
UPDATE public.profiles 
SET membership_type = 'basic' 
WHERE membership_type NOT IN ('basic', 'premium');

-- Create a function to automatically update membership status based on active subscriptions
CREATE OR REPLACE FUNCTION public.update_membership_status()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update users with active subscriptions to premium
  UPDATE public.profiles 
  SET membership_type = 'premium'
  WHERE id IN (
    SELECT DISTINCT user_id 
    FROM public.user_subscriptions 
    WHERE status = 'active' 
    AND expires_at > now()
  );
  
  -- Update users without active subscriptions to basic
  UPDATE public.profiles 
  SET membership_type = 'basic'
  WHERE id NOT IN (
    SELECT DISTINCT user_id 
    FROM public.user_subscriptions 
    WHERE status = 'active' 
    AND expires_at > now()
  );
END;
$$;

-- Create a function to update user membership when subscription changes
CREATE OR REPLACE FUNCTION public.handle_subscription_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If subscription becomes active, set user to premium
  IF NEW.status = 'active' AND NEW.expires_at > now() THEN
    UPDATE public.profiles 
    SET membership_type = 'premium'
    WHERE id = NEW.user_id;
  -- If subscription expires or becomes inactive, check if user has other active subscriptions
  ELSIF NEW.status != 'active' OR NEW.expires_at <= now() THEN
    -- Check if user has any other active subscriptions
    IF NOT EXISTS (
      SELECT 1 FROM public.user_subscriptions 
      WHERE user_id = NEW.user_id 
      AND status = 'active' 
      AND expires_at > now()
      AND id != NEW.id
    ) THEN
      UPDATE public.profiles 
      SET membership_type = 'basic'
      WHERE id = NEW.user_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger to automatically update membership when subscription changes
DROP TRIGGER IF EXISTS subscription_membership_update ON public.user_subscriptions;
CREATE TRIGGER subscription_membership_update
  AFTER INSERT OR UPDATE ON public.user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_subscription_change();

-- Run the function to update existing memberships
SELECT public.update_membership_status();
