
-- Create enum for days of the week
CREATE TYPE public.day_of_week AS ENUM ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');

-- Create enum for recurrence types
CREATE TYPE public.recurrence_type AS ENUM ('weekly', 'never_ending');

-- Add columns to classes table for recurring schedules
ALTER TABLE public.classes 
ADD COLUMN recurrence_type recurrence_type DEFAULT NULL,
ADD COLUMN recurrence_days day_of_week[] DEFAULT NULL,
ADD COLUMN start_date DATE DEFAULT NULL,
ADD COLUMN end_date DATE DEFAULT NULL,
ADD COLUMN timezone TEXT DEFAULT 'UTC';

-- Create table for class instances (individual occurrences of recurring classes)
CREATE TABLE public.class_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE NOT NULL,
    instance_date DATE NOT NULL,
    instance_time TIME NOT NULL,
    is_cancelled BOOLEAN DEFAULT FALSE,
    cancellation_reason TEXT DEFAULT NULL,
    cancelled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    cancelled_by UUID DEFAULT NULL,
    max_capacity INTEGER DEFAULT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(class_id, instance_date)
);

-- Enable RLS on class_instances
ALTER TABLE public.class_instances ENABLE ROW LEVEL SECURITY;

-- RLS Policies for class_instances
CREATE POLICY "Admins can manage class instances"
ON public.class_instances
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view active class instances"
ON public.class_instances
FOR SELECT
TO authenticated
USING (is_cancelled = false OR public.has_role(auth.uid(), 'admin'));

-- Update bookings table to reference class instances instead of just classes
ALTER TABLE public.bookings 
ADD COLUMN class_instance_id UUID REFERENCES public.class_instances(id) ON DELETE CASCADE DEFAULT NULL;

-- Create function to generate class instances for recurring classes
CREATE OR REPLACE FUNCTION public.generate_class_instances(
    p_class_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE,
    p_end_date DATE DEFAULT CURRENT_DATE + INTERVAL '3 months'
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    class_record RECORD;
    iter_date DATE;
    day_name TEXT;
    instances_created INTEGER := 0;
BEGIN
    -- Get class details
    SELECT * INTO class_record 
    FROM public.classes 
    WHERE id = p_class_id AND is_active = true;
    
    IF NOT FOUND THEN
        RETURN 0;
    END IF;
    
    -- Only process classes with recurrence
    IF class_record.recurrence_type IS NULL OR class_record.recurrence_days IS NULL THEN
        RETURN 0;
    END IF;
    
    iter_date := GREATEST(p_start_date, COALESCE(class_record.start_date, p_start_date));
    
    -- Generate instances up to end_date or p_end_date
    WHILE iter_date <= LEAST(
        p_end_date, 
        COALESCE(class_record.end_date, p_end_date)
    ) LOOP
        -- Get the day name for current date
        day_name := LOWER(TO_CHAR(iter_date, 'Day'));
        day_name := TRIM(day_name);
        
        -- Check if this day is in the recurrence pattern
        IF day_name::day_of_week = ANY(class_record.recurrence_days) THEN
            -- Insert class instance if it doesn't exist
            INSERT INTO public.class_instances (
                class_id,
                instance_date,
                instance_time,
                max_capacity
            )
            VALUES (
                p_class_id,
                iter_date,
                class_record.schedule_time,
                class_record.max_capacity
            )
            ON CONFLICT (class_id, instance_date) DO NOTHING;
            
            instances_created := instances_created + 1;
        END IF;
        
        iter_date := iter_date + INTERVAL '1 day';
    END LOOP;
    
    RETURN instances_created;
END;
$$;

-- Create trigger to automatically generate instances when a recurring class is created/updated
CREATE OR REPLACE FUNCTION public.auto_generate_class_instances()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    IF NEW.recurrence_type IS NOT NULL AND NEW.recurrence_days IS NOT NULL THEN
        PERFORM public.generate_class_instances(NEW.id);
    END IF;
    RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_auto_generate_class_instances
    AFTER INSERT OR UPDATE OF recurrence_type, recurrence_days, start_date, end_date
    ON public.classes
    FOR EACH ROW
    EXECUTE FUNCTION public.auto_generate_class_instances();

-- Insert sample recurring classes
INSERT INTO public.classes (title, description, instructor_name, class_type, duration, schedule_time, recurrence_type, recurrence_days, start_date, timezone) VALUES
('Morning Flow Recurring', 'Daily energizing vinyasa flow', 'Elena Martinez', 'Vinyasa Flow', 60, '07:00:00', 'weekly', ARRAY['monday', 'wednesday', 'friday']::day_of_week[], CURRENT_DATE, 'America/New_York'),
('Evening Power Yoga', 'Build strength and endurance', 'Michael Chen', 'Power Yoga', 75, '18:00:00', 'never_ending', ARRAY['tuesday', 'thursday']::day_of_week[], CURRENT_DATE, 'Europe/London');
