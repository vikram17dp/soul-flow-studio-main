
-- Fix the ambiguous column reference in the check_weight_achievements function
CREATE OR REPLACE FUNCTION public.check_weight_achievements()
RETURNS TRIGGER AS $$
DECLARE
  goal_record RECORD;
  weight_lost DECIMAL;
  achievement_type_var TEXT;
  points_to_award INTEGER;
BEGIN
  -- Get the user's weight goal
  SELECT * INTO goal_record
  FROM public.weight_goals
  WHERE user_id = NEW.user_id;
  
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;
  
  -- Calculate weight lost
  weight_lost := goal_record.start_weight - NEW.weight;
  
  -- Check for achievements
  IF weight_lost >= 1 AND NOT EXISTS (
    SELECT 1 FROM public.weight_achievements 
    WHERE user_id = NEW.user_id AND achievement_type = 'first_kg'
  ) THEN
    achievement_type_var := 'first_kg';
    points_to_award := 50;
  ELSIF weight_lost >= 5 AND NOT EXISTS (
    SELECT 1 FROM public.weight_achievements 
    WHERE user_id = NEW.user_id AND achievement_type = '5kg_milestone'
  ) THEN
    achievement_type_var := '5kg_milestone';
    points_to_award := 100;
  ELSIF weight_lost >= 10 AND NOT EXISTS (
    SELECT 1 FROM public.weight_achievements 
    WHERE user_id = NEW.user_id AND achievement_type = '10kg_milestone'
  ) THEN
    achievement_type_var := '10kg_milestone';
    points_to_award := 200;
  ELSIF weight_lost >= 25 AND NOT EXISTS (
    SELECT 1 FROM public.weight_achievements 
    WHERE user_id = NEW.user_id AND achievement_type = '25kg_milestone'
  ) THEN
    achievement_type_var := '25kg_milestone';
    points_to_award := 500;
  ELSIF weight_lost >= 50 AND NOT EXISTS (
    SELECT 1 FROM public.weight_achievements 
    WHERE user_id = NEW.user_id AND achievement_type = '50kg_milestone'
  ) THEN
    achievement_type_var := '50kg_milestone';
    points_to_award := 1000;
  END IF;
  
  -- Insert achievement if one was earned
  IF achievement_type_var IS NOT NULL THEN
    INSERT INTO public.weight_achievements (
      user_id,
      achievement_type,
      weight_lost,
      points_awarded
    ) VALUES (
      NEW.user_id,
      achievement_type_var,
      weight_lost,
      points_to_award
    );
    
    -- Award points
    PERFORM public.award_points(
      NEW.user_id,
      'class_attendance'::public.point_activity_type, -- Using existing activity type
      NEW.id,
      'weight_achievement',
      NULL,
      points_to_award,
      'Weight loss achievement: ' || achievement_type_var
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also fix the get_weight_loss_leaderboard function that has similar ambiguity issues
CREATE OR REPLACE FUNCTION public.get_weight_loss_leaderboard(days_filter integer DEFAULT 30)
 RETURNS TABLE(user_id uuid, full_name text, total_weight_lost numeric, latest_weight numeric, start_weight numeric, entries_count bigint, rank bigint)
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT 
      wg.user_id as stats_user_id,
      wg.start_weight,
      COALESCE(latest_entry.weight, wg.start_weight) as latest_weight,
      wg.start_weight - COALESCE(latest_entry.weight, wg.start_weight) as weight_lost,
      COALESCE(entry_count.count, 0) as entries_count
    FROM public.weight_goals wg
    LEFT JOIN LATERAL (
      SELECT weight
      FROM public.weight_entries we
      WHERE we.user_id = wg.user_id
        AND (days_filter = 0 OR we.entry_date >= CURRENT_DATE - (days_filter || ' days')::INTERVAL)
      ORDER BY entry_date DESC, created_at DESC
      LIMIT 1
    ) latest_entry ON true
    LEFT JOIN (
      SELECT 
        we2.user_id,
        COUNT(*) as count
      FROM public.weight_entries we2
      WHERE days_filter = 0 OR we2.entry_date >= CURRENT_DATE - (days_filter || ' days')::INTERVAL
      GROUP BY we2.user_id
    ) entry_count ON entry_count.user_id = wg.user_id
    WHERE wg.start_weight - COALESCE(latest_entry.weight, wg.start_weight) > 0
  )
  SELECT 
    us.stats_user_id,
    COALESCE(p.full_name, 'Anonymous User') as full_name,
    us.weight_lost,
    us.latest_weight,
    us.start_weight,
    us.entries_count,
    ROW_NUMBER() OVER (ORDER BY us.weight_lost DESC, us.entries_count DESC) as rank
  FROM user_stats us
  LEFT JOIN public.profiles p ON p.id = us.stats_user_id
  WHERE us.weight_lost > 0
  ORDER BY us.weight_lost DESC, us.entries_count DESC;
END;
$function$
