
-- Create function to get leaderboard data (fixed version)
CREATE OR REPLACE FUNCTION public.get_weight_loss_leaderboard(
  days_filter INTEGER DEFAULT 30
)
RETURNS TABLE (
  user_id UUID,
  full_name TEXT,
  total_weight_lost DECIMAL,
  latest_weight DECIMAL,
  start_weight DECIMAL,
  entries_count BIGINT,
  rank BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH user_stats AS (
    SELECT 
      wg.user_id,
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
        user_id,
        COUNT(*) as count
      FROM public.weight_entries
      WHERE days_filter = 0 OR entry_date >= CURRENT_DATE - (days_filter || ' days')::INTERVAL
      GROUP BY user_id
    ) entry_count ON entry_count.user_id = wg.user_id
    WHERE wg.start_weight - COALESCE(latest_entry.weight, wg.start_weight) > 0
  )
  SELECT 
    us.user_id,
    COALESCE(p.full_name, 'Anonymous User') as full_name,
    us.weight_lost,
    us.latest_weight,
    us.start_weight,
    us.entries_count,
    ROW_NUMBER() OVER (ORDER BY us.weight_lost DESC, us.entries_count DESC) as rank
  FROM user_stats us
  LEFT JOIN public.profiles p ON p.id = us.user_id
  WHERE us.weight_lost > 0
  ORDER BY us.weight_lost DESC, us.entries_count DESC;
END;
$$;
