
-- Insert admin role for the user sumit_204@yahoo.com
-- First, we need to find the user ID from the auth.users table and insert the admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role
FROM auth.users 
WHERE email = 'sumit_204@yahoo.com'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.users.id AND role = 'admin'
);
