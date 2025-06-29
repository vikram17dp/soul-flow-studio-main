
export interface WeightEntry {
  id: string;
  user_id: string;
  weight: number;
  entry_date: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WeightGoal {
  id: string;
  user_id: string;
  start_weight: number;
  target_weight?: number;
  start_date: string;
  created_at: string;
  updated_at: string;
}

export interface WeightAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  weight_lost: number;
  points_awarded: number;
  achieved_at: string;
  created_at: string;
}

export interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  total_weight_lost: number;
  latest_weight: number;
  start_weight: number;
  entries_count: number;
  rank: number;
}

export type LeaderboardPeriod = 7 | 30 | 90 | 0; // 0 means forever
