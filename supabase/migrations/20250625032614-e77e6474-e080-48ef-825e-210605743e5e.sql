
-- First, add the new enum values for habit tracking
ALTER TYPE public.point_activity_type ADD VALUE IF NOT EXISTS 'habit_completion';
ALTER TYPE public.point_activity_type ADD VALUE IF NOT EXISTS 'daily_habit_bonus';
ALTER TYPE public.point_activity_type ADD VALUE IF NOT EXISTS 'habit_streak_bonus';
