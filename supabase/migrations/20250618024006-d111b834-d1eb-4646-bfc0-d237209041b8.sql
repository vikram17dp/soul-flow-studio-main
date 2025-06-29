
-- Add instructor profile table
CREATE TABLE public.instructors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  bio TEXT,
  experience_years INTEGER,
  specializations TEXT[],
  profile_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add class tags table
CREATE TABLE public.class_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add junction table for class-tag relationships
CREATE TABLE public.class_tag_assignments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.class_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(class_id, tag_id)
);

-- Add new columns to classes table
ALTER TABLE public.classes 
ADD COLUMN instructor_id UUID REFERENCES public.instructors(id),
ADD COLUMN class_level TEXT CHECK (class_level IN ('Beginner', 'Intermediate', 'Advanced')) DEFAULT 'Beginner',
ADD COLUMN featured_image_url TEXT;

-- Remove max_capacity column from classes table
ALTER TABLE public.classes DROP COLUMN IF EXISTS max_capacity;

-- Also remove max_capacity from class_instances table since it's not needed
ALTER TABLE public.class_instances DROP COLUMN IF EXISTS max_capacity;

-- Update default timezone to Asia/Kolkata (India)
ALTER TABLE public.classes ALTER COLUMN timezone SET DEFAULT 'Asia/Kolkata';

-- Insert some sample instructors
INSERT INTO public.instructors (name, bio, experience_years, specializations) VALUES
('Priya Sharma', 'Certified yoga instructor with expertise in Hatha and Vinyasa yoga', 5, ARRAY['Hatha Yoga', 'Vinyasa Flow']),
('Rajesh Kumar', 'Senior yoga teacher specializing in traditional Ashtanga practice', 8, ARRAY['Ashtanga Yoga', 'Power Yoga']),
('Meera Patel', 'Gentle yoga specialist focusing on restorative and therapeutic practices', 3, ARRAY['Restorative Yoga', 'Yin Yoga']);

-- Insert some sample class tags
INSERT INTO public.class_tags (name, color) VALUES
('Morning Flow', '#10b981'),
('Power Session', '#f59e0b'),
('Relaxation', '#8b5cf6'),
('Beginner Friendly', '#06b6d4'),
('Advanced Practice', '#ef4444'),
('Meditation Focus', '#6366f1');
