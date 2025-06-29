
-- Create a function to get leaderboard data that bypasses RLS for aggregated public data
CREATE OR REPLACE FUNCTION public.get_points_leaderboard(
  category_filter text DEFAULT 'overall',
  days_filter integer DEFAULT 30
)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  points bigint,
  rank bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  activity_types text[];
  start_date timestamp with time zone;
BEGIN
  -- Set activity types based on category
  CASE category_filter
    WHEN 'class_joining' THEN
      activity_types := ARRAY['class_attendance', 'class_booking', 'class_join'];
    WHEN 'weight_tracker' THEN
      activity_types := ARRAY['class_attendance']; -- Placeholder - will need proper weight activity types
    WHEN 'habit_tracker' THEN
      activity_types := ARRAY['habit_completion', 'daily_habit_bonus', 'habit_streak_bonus'];
    ELSE
      activity_types := NULL; -- NULL means all activity types
  END CASE;
  
  -- Calculate start date if time filter is specified
  IF days_filter > 0 THEN
    start_date := CURRENT_TIMESTAMP - (days_filter || ' days')::INTERVAL;
  ELSE
    start_date := NULL; -- NULL means all time
  END IF;
  
  RETURN QUERY
  WITH user_points_summary AS (
    SELECT 
      pt.user_id,
      SUM(
        CASE 
          WHEN pt.transaction_type IN ('earned', 'bonus') THEN pt.points
          WHEN pt.transaction_type IN ('redeemed', 'penalty') THEN -pt.points
          ELSE pt.points
        END
      ) as total_points
    FROM public.point_transactions pt
    WHERE 
      (start_date IS NULL OR pt.created_at >= start_date)
      AND (activity_types IS NULL OR pt.activity_type = ANY(activity_types))
    GROUP BY pt.user_id
    HAVING SUM(
      CASE 
        WHEN pt.transaction_type IN ('earned', 'bonus') THEN pt.points
        WHEN pt.transaction_type IN ('redeemed', 'penalty') THEN -pt.points
        ELSE pt.points
      END
    ) > 0
  )
  SELECT 
    ups.user_id,
    COALESCE(p.full_name, 'Anonymous User') as full_name,
    GREATEST(ups.total_points, 0) as points,
    ROW_NUMBER() OVER (ORDER BY ups.total_points DESC) as rank
  FROM user_points_summary ups
  LEFT JOIN public.profiles p ON p.id = ups.user_id
  ORDER BY ups.total_points DESC;
END;
$$;
