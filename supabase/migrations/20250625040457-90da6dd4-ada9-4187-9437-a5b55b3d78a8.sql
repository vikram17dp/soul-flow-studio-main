
-- First, add the new activity type for class joining
ALTER TYPE public.point_activity_type ADD VALUE IF NOT EXISTS 'class_join';
