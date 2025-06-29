
-- Insert point rule for class joining
INSERT INTO public.point_rules (activity_type, points_awarded, description, is_active)
VALUES ('class_join', 5, 'Points awarded for joining a class', true)
ON CONFLICT (activity_type) DO NOTHING;

-- Create a table to track class joins to prevent duplicate point awards
CREATE TABLE IF NOT EXISTS public.class_joins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    class_instance_id UUID NOT NULL,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    points_awarded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, class_instance_id)
);

-- Enable RLS on class_joins table
ALTER TABLE public.class_joins ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for class_joins
CREATE POLICY "Users can view their own class joins"
ON public.class_joins
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own class joins"
ON public.class_joins
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all class joins"
ON public.class_joins
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
