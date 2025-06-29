
-- Update the handle_new_user function to properly extract user metadata
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
        WHEN NEW.email LIKE '%@phone.local' 
        THEN 'Phone User'
        ELSE 'User'
      END
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'phone',
      CASE 
        WHEN NEW.email LIKE '%@phone.local' 
        THEN REPLACE(NEW.email, '@phone.local', '')
        ELSE NULL
      END
    )
  );
  RETURN NEW;
END;
$$;
