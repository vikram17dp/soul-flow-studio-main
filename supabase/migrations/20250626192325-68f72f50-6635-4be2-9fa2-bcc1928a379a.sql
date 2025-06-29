
-- Update the handle_new_user function to better extract names from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, email, phone)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name', 
      NEW.raw_user_meta_data->>'name',
      CASE 
        WHEN NEW.raw_user_meta_data->>'phone' IS NOT NULL 
        THEN 'Phone User'
        ELSE 'User'
      END
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$;
