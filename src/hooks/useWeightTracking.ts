
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { WeightEntry, WeightGoal, WeightAchievement, LeaderboardEntry, LeaderboardPeriod } from '@/types/weight';

export const useWeightTracking = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [weightGoal, setWeightGoal] = useState<WeightGoal | null>(null);
  const [achievements, setAchievements] = useState<WeightAchievement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Use ref to prevent multiple simultaneous fetch attempts
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Only fetch data when user is authenticated and auth is not loading
    if (!authLoading && user && !isFetchingRef.current) {
      console.log('Fetching weight data for user:', user.id);
      fetchUserWeightData();
    } else if (!authLoading && !user) {
      // Clear data when user is not authenticated
      setWeightEntries([]);
      setWeightGoal(null);
      setAchievements([]);
      setIsLoading(false);
      setHasError(false);
    }
  }, [user, authLoading]);

  const fetchUserWeightData = async () => {
    if (!user || isFetchingRef.current) {
      console.log('Skipping fetch - no user or already fetching');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Starting weight data fetch for user:', user.id);
      isFetchingRef.current = true;
      setIsLoading(true);
      setHasError(false);

      // Fetch weight entries with proper error handling
      const { data: entries, error: entriesError } = await supabase
        .from('weight_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_date', { ascending: false });

      if (entriesError) {
        console.error('Error fetching weight entries:', entriesError);
        throw entriesError;
      }

      // Fetch weight goal with proper error handling
      const { data: goal, error: goalError } = await supabase
        .from('weight_goals')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (goalError && goalError.code !== 'PGRST116') {
        console.error('Error fetching weight goal:', goalError);
        throw goalError;
      }

      // Fetch achievements with proper error handling
      const { data: userAchievements, error: achievementsError } = await supabase
        .from('weight_achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('achieved_at', { ascending: false });

      if (achievementsError) {
        console.error('Error fetching weight achievements:', achievementsError);
        throw achievementsError;
      }

      console.log('Successfully fetched weight data:', {
        entries: entries?.length || 0,
        hasGoal: !!goal,
        achievements: userAchievements?.length || 0
      });

      setWeightEntries(entries || []);
      setWeightGoal(goal || null);
      setAchievements(userAchievements || []);
      setHasError(false);
    } catch (error: any) {
      console.error('Error fetching weight data:', error);
      setHasError(true);
      
      // Only show toast error if it's not a network connectivity issue
      if (error?.message !== 'Failed to fetch' && error?.message !== 'TypeError: Failed to fetch') {
        toast({
          title: 'Error',
          description: 'Failed to fetch weight tracking data',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  const createWeightGoal = async (startWeight: number, targetWeight?: number) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_goals')
        .upsert({
          user_id: user.id,
          start_weight: startWeight,
          target_weight: targetWeight,
        }, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) throw error;

      setWeightGoal(data);
      toast({
        title: 'Success',
        description: 'Weight goal updated successfully!'
      });
    } catch (error: any) {
      console.error('Error creating weight goal:', error);
      toast({
        title: 'Error',
        description: 'Failed to update weight goal',
        variant: 'destructive'
      });
    }
  };

  const addWeightEntry = async (weight: number, notes?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .insert({
          user_id: user.id,
          weight,
          notes,
        })
        .select()
        .single();

      if (error) throw error;

      setWeightEntries(prev => [data, ...prev]);
      toast({
        title: 'Success',
        description: 'Weight entry added successfully! +5 points earned! 🎉'
      });

      // Refresh data to get updated achievements
      fetchUserWeightData();
    } catch (error: any) {
      console.error('Error adding weight entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to add weight entry',
        variant: 'destructive'
      });
    }
  };

  const updateWeightEntry = async (id: string, weight: number, notes?: string) => {
    try {
      const { data, error } = await supabase
        .from('weight_entries')
        .update({ weight, notes })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setWeightEntries(prev => 
        prev.map(entry => entry.id === id ? data : entry)
      );

      toast({
        title: 'Success',
        description: 'Weight entry updated successfully!'
      });
    } catch (error: any) {
      console.error('Error updating weight entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to update weight entry',
        variant: 'destructive'
      });
    }
  };

  const deleteWeightEntry = async (id: string) => {
    try {
      const { error } = await supabase
        .from('weight_entries')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWeightEntries(prev => prev.filter(entry => entry.id !== id));
      toast({
        title: 'Success',
        description: 'Weight entry deleted successfully!'
      });
    } catch (error: any) {
      console.error('Error deleting weight entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete weight entry',
        variant: 'destructive'
      });
    }
  };

  return {
    weightEntries,
    weightGoal,
    achievements,
    isLoading: isLoading || authLoading,
    hasError,
    createWeightGoal,
    addWeightEntry,
    updateWeightEntry,
    deleteWeightEntry,
    refetch: fetchUserWeightData
  };
};

export const useWeightLeaderboard = () => {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<LeaderboardPeriod>(30);
  const isFetchingRef = useRef(false);

  useEffect(() => {
    // Only fetch leaderboard when auth is ready (regardless of user login status)
    if (!authLoading && !isFetchingRef.current) {
      fetchLeaderboard();
    }
  }, [period, authLoading]);

  const fetchLeaderboard = async () => {
    if (isFetchingRef.current) return;
    
    try {
      isFetchingRef.current = true;
      setIsLoading(true);
      console.log('Fetching weight leaderboard for period:', period);
      
      const { data, error } = await supabase.rpc('get_weight_loss_leaderboard', {
        days_filter: period
      });

      if (error) {
        console.error('Leaderboard RPC error:', error);
        throw error;
      }

      console.log('Leaderboard data fetched:', data?.length || 0, 'entries');
      setLeaderboard(data || []);
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      // Only show toast for non-network errors
      if (error?.message !== 'Failed to fetch' && error?.message !== 'TypeError: Failed to fetch') {
        toast({
          title: 'Error',
          description: 'Failed to fetch leaderboard data',
          variant: 'destructive'
        });
      }
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  return {
    leaderboard,
    isLoading: isLoading || authLoading,
    period,
    setPeriod,
    refetch: fetchLeaderboard
  };
};
