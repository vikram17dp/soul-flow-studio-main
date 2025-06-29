
-- Fix the generate_class_instances function to remove max_capacity reference
CREATE OR REPLACE FUNCTION public.generate_class_instances(p_class_id uuid, p_start_date date DEFAULT CURRENT_DATE, p_end_date date DEFAULT (CURRENT_DATE + '3 mons'::interval))
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
            -- Insert class instance if it doesn't exist (removed max_capacity)
            INSERT INTO public.class_instances (
                class_id,
                instance_date,
                instance_time
            )
            VALUES (
                p_class_id,
                iter_date,
                class_record.schedule_time
            )
            ON CONFLICT (class_id, instance_date) DO NOTHING;
            
            instances_created := instances_created + 1;
        END IF;
        
        iter_date := iter_date + INTERVAL '1 day';
    END LOOP;
    
    RETURN instances_created;
END;
$function$
