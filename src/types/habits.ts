
import { Database } from '@/integrations/supabase/types';

export type HabitType = Database['public']['Enums']['habit_type'];

export interface Habit {
  id: string;
  habit_type: HabitType;
  name: string;
  description: string | null;
  icon: string;
  points_per_completion: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface HabitEntry {
  id: string;
  user_id: string;
  habit_id: string;
  entry_date: string;
  completed: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitStreak {
  id: string;
  user_id: string;
  habit_id: string;
  current_streak: number;
  best_streak: number;
  last_completed_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface HabitStats {
  habit_id: string;
  habit_name: string;
  habit_icon: string;
  current_streak: number;
  best_streak: number;
  completion_rate: number;
  total_completions: number;
}

export interface DailyHabitData {
  habit: Habit;
  entry: HabitEntry | null;
  streak: HabitStreak | null;
}
