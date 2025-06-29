export type PointTransactionType = 'earned' | 'redeemed' | 'bonus' | 'penalty' | 'adjustment';

export type PointActivityType = 
  | 'class_attendance'
  | 'class_booking'
  | 'referral'
  | 'signup_bonus'
  | 'weekly_streak'
  | 'monthly_streak'
  | 'review_submission'
  | 'profile_completion'
  | 'admin_adjustment'
  | 'habit_completion'
  | 'daily_habit_bonus'
  | 'habit_streak_bonus'
  | 'class_join';

export interface UserPoints {
  id: string;
  user_id: string;
  total_points: number;
  lifetime_earned: number;
  lifetime_redeemed: number;
  created_at: string;
  updated_at: string;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  transaction_type: PointTransactionType;
  activity_type: PointActivityType;
  points: number;
  description: string | null;
  reference_id: string | null;
  reference_type: string | null;
  admin_id: string | null;
  created_at: string;
  metadata: any;
}

export interface PointRule {
  id: string;
  activity_type: PointActivityType;
  points_awarded: number;
  is_active: boolean;
  description: string | null;
  conditions: any;
  created_at: string;
  updated_at: string;
}
