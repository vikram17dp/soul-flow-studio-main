
import { supabase } from '@/integrations/supabase/client';

export const userActionsService = {
  async makeAdmin(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .insert([{ user_id: userId, role: 'admin' }]);

    if (error) throw error;
  },

  async removeAdmin(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role', 'admin');

    if (error) throw error;
  },

  async deleteUser(userId: string): Promise<void> {
    console.log('Starting user data deletion process for:', userId);

    // Delete all user-related data in the correct order (due to foreign key constraints)
    
    // 1. Delete habit entries first
    const { error: habitEntriesError } = await supabase
      .from('habit_entries')
      .delete()
      .eq('user_id', userId);
    if (habitEntriesError) {
      console.error('Error deleting habit entries:', habitEntriesError);
      throw habitEntriesError;
    }

    // 2. Delete habit streaks
    const { error: habitStreaksError } = await supabase
      .from('habit_streaks')
      .delete()
      .eq('user_id', userId);
    if (habitStreaksError) {
      console.error('Error deleting habit streaks:', habitStreaksError);
      throw habitStreaksError;
    }

    // 3. Delete weight entries
    const { error: weightEntriesError } = await supabase
      .from('weight_entries')
      .delete()
      .eq('user_id', userId);
    if (weightEntriesError) {
      console.error('Error deleting weight entries:', weightEntriesError);
      throw weightEntriesError;
    }

    // 4. Delete weight goals
    const { error: weightGoalsError } = await supabase
      .from('weight_goals')
      .delete()
      .eq('user_id', userId);
    if (weightGoalsError) {
      console.error('Error deleting weight goals:', weightGoalsError);
      throw weightGoalsError;
    }

    // 5. Delete weight achievements
    const { error: weightAchievementsError } = await supabase
      .from('weight_achievements')
      .delete()
      .eq('user_id', userId);
    if (weightAchievementsError) {
      console.error('Error deleting weight achievements:', weightAchievementsError);
      throw weightAchievementsError;
    }

    // 6. Delete class joins
    const { error: classJoinsError } = await supabase
      .from('class_joins')
      .delete()
      .eq('user_id', userId);
    if (classJoinsError) {
      console.error('Error deleting class joins:', classJoinsError);
      throw classJoinsError;
    }

    // 7. Delete bookings
    const { error: bookingsError } = await supabase
      .from('bookings')
      .delete()
      .eq('user_id', userId);
    if (bookingsError) {
      console.error('Error deleting bookings:', bookingsError);
      throw bookingsError;
    }

    // 8. Delete point transactions
    const { error: pointTransactionsError } = await supabase
      .from('point_transactions')
      .delete()
      .eq('user_id', userId);
    if (pointTransactionsError) {
      console.error('Error deleting point transactions:', pointTransactionsError);
      throw pointTransactionsError;
    }

    // 9. Delete user points
    const { error: userPointsError } = await supabase
      .from('user_points')
      .delete()
      .eq('user_id', userId);
    if (userPointsError) {
      console.error('Error deleting user points:', userPointsError);
      throw userPointsError;
    }

    // 10. Delete payments
    const { error: paymentsError } = await supabase
      .from('payments')
      .delete()
      .eq('user_id', userId);
    if (paymentsError) {
      console.error('Error deleting payments:', paymentsError);
      throw paymentsError;
    }

    // 11. Delete user subscriptions
    const { error: subscriptionsError } = await supabase
      .from('user_subscriptions')
      .delete()
      .eq('user_id', userId);
    if (subscriptionsError) {
      console.error('Error deleting user subscriptions:', subscriptionsError);
      throw subscriptionsError;
    }

    // 12. Delete user roles
    const { error: userRolesError } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId);
    if (userRolesError) {
      console.error('Error deleting user roles:', userRolesError);
      throw userRolesError;
    }

    // 13. Finally, delete the profile (this should cascade properly now)
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', userId);
    if (profileError) {
      console.error('Error deleting profile:', profileError);
      throw profileError;
    }

    console.log('User data deletion completed successfully');
    
    // Note: We cannot delete from auth.users using client-side code
    // The auth user will remain but all application data is removed
  }
};
