
-- Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create classes table
CREATE TABLE public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    instructor_name TEXT NOT NULL,
    class_type TEXT NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    max_capacity INTEGER DEFAULT 20,
    price DECIMAL(10,2) DEFAULT 0.00,
    image_url TEXT,
    schedule_day TEXT, -- 'monday', 'tuesday', etc.
    schedule_time TIME,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create packages table
CREATE TABLE public.packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_months INTEGER NOT NULL,
    class_credits INTEGER, -- null for unlimited
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    booking_date DATE NOT NULL,
    status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, class_id, booking_date)
);

-- Enable RLS on all tables
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Classes: admins can manage, users can view active classes
CREATE POLICY "Admins can manage classes"
ON public.classes
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view active classes"
ON public.classes
FOR SELECT
TO authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

-- Packages: admins can manage, users can view active packages
CREATE POLICY "Admins can manage packages"
ON public.packages
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view active packages"
ON public.packages
FOR SELECT
TO authenticated
USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

-- Bookings: users can manage their own, admins can manage all
CREATE POLICY "Users can manage their own bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all bookings"
ON public.bookings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- User roles: only admins can manage roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert some sample data
INSERT INTO public.classes (title, description, instructor_name, class_type, duration, schedule_day, schedule_time) VALUES
('Morning Flow', 'Start your day with energizing vinyasa flow', 'Elena Martinez', 'Vinyasa Flow', 60, 'monday', '07:00:00'),
('Power Yoga', 'Build strength and endurance', 'Michael Chen', 'Power Yoga', 75, 'tuesday', '18:00:00'),
('Gentle Stretch', 'Relaxing restorative practice', 'Sarah Williams', 'Restorative', 45, 'wednesday', '20:00:00'),
('Hot Yoga', 'Challenging practice in heated room', 'David Kumar', 'Hot Yoga', 90, 'thursday', '19:00:00'),
('Meditation & Mindfulness', 'Find inner peace and clarity', 'Lisa Thompson', 'Meditation', 30, 'friday', '08:00:00');

INSERT INTO public.packages (name, description, price, duration_months, class_credits) VALUES
('Basic Monthly', 'Perfect for beginners', 89.00, 1, 8),
('Premium Monthly', 'For regular practitioners', 149.00, 1, 16),
('Unlimited Monthly', 'Unlimited classes per month', 199.00, 1, null),
('Annual Basic', 'Best value for committed yogis', 890.00, 12, 96),
('Annual Unlimited', 'Ultimate yoga experience', 1990.00, 12, null);

-- Create the admin user with email sumit_204@yahoo.com
-- Note: The user will need to sign up first, then we'll assign admin role
