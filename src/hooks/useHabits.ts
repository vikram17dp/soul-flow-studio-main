
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { HabitStats, Habit, HabitEntry, DailyHabitData } from '@/types/habits';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export const useHabits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all active habits
  const { data: habits = [], isLoading: habitsLoading } = useQuery({
    queryKey: ['habits'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('is_active', true)
        .order('created_at');
      
      if (error) throw error;
      return data as Habit[];
    },
  });

  // Fetch today's habit entries for the current user
  const { data: todaysEntries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['habit-entries', user?.id, new Date().toDateString()],
    queryFn: async () => {
      if (!user) return [];
      
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('habit_entries')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', today);
      
      if (error) throw error;
      return data as HabitEntry[];
    },
    enabled: !!user,
  });

  // Fetch habit stats for the current user
  const { data: habitStats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['habit-stats', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase.rpc('get_user_habit_stats', {
        _user_id: user.id,
      });
      
      if (error) throw error;
      return data as HabitStats[];
    },
    enabled: !!user,
  });

  // Toggle habit completion
  const toggleHabitMutation = useMutation({
    mutationFn: async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      if (!user) throw new Error('User not authenticated');
      
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('habit_entries')
        .upsert({
          user_id: user.id,
          habit_id: habitId,
          entry_date: today,
          completed,
          completed_at: completed ? new Date().toISOString() : null,
        }, {
          onConflict: 'user_id,habit_id,entry_date'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['habit-entries'] });
      queryClient.invalidateQueries({ queryKey: ['habit-stats'] });
      
      const habit = habits.find(h => h.id === variables.habitId);
      if (habit) {
        toast({
          title: variables.completed ? "Habit Completed! 🎉" : "Habit Unchecked",
          description: variables.completed 
            ? `Great work on "${habit.name}"! You earned ${habit.points_per_completion} points.`
            : `Unchecked "${habit.name}"`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update habit. Please try again.",
        variant: "destructive",
      });
      console.error('Error toggling habit:', error);
    },
  });

  // Create a wrapper function that matches the expected signature
  const toggleHabit = (habitId: string, completed: boolean) => {
    toggleHabitMutation.mutate({ habitId, completed });
  };

  // Combine habits with today's entries for easy access
  const dailyHabits: DailyHabitData[] = habits.map(habit => {
    const entry = todaysEntries.find(e => e.habit_id === habit.id);
    const stats = habitStats.find(s => s.habit_id === habit.id);
    
    return {
      habit,
      entry: entry || null,
      streak: stats ? {
        id: '',
        user_id: user?.id || '',
        habit_id: habit.id,
        current_streak: stats.current_streak,
        best_streak: stats.best_streak,
        last_completed_date: null,
        created_at: '',
        updated_at: '',
      } : null,
    };
  });

  // Calculate daily progress
  const completedToday = todaysEntries.filter(e => e.completed).length;
  const totalHabits = habits.length;
  const dailyProgress = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0;
  const allHabitsCompleted = completedToday === totalHabits && totalHabits > 0;

  return {
    habits,
    dailyHabits,
    habitStats,
    todaysEntries,
    completedToday,
    totalHabits,
    dailyProgress,
    allHabitsCompleted,
    isLoading: habitsLoading || entriesLoading || statsLoading,
    toggleHabit,
    isToggling: toggleHabitMutation.isPending,
  };
};
