
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  points: number;
  rank: number;
}

type LeaderboardCategory = 'overall' | 'class_joining' | 'weight_tracker' | 'habit_tracker';
type TimePeriod = 7 | 30 | 90 | 0; // 0 means all time

export const useLeaderboard = (category: LeaderboardCategory, timePeriod: TimePeriod) => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchLeaderboard = async () => {
    try {
      setIsLoading(true);
      
      // Use the new database function to get leaderboard data
      const { data, error } = await supabase.rpc('get_points_leaderboard', {
        category_filter: category,
        days_filter: timePeriod
      });

      if (error) throw error;

      // Transform the data to match our interface
      const leaderboardEntries: LeaderboardEntry[] = (data || []).map((entry: any) => ({
        user_id: entry.user_id,
        full_name: entry.full_name || 'Anonymous User',
        points: Number(entry.points),
        rank: Number(entry.rank)
      }));

      setLeaderboardData(leaderboardEntries);
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch leaderboard data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [category, timePeriod]);

  return {
    leaderboardData,
    isLoading,
    refetch: fetchLeaderboard
  };
};
