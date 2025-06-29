
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '../types';

export const userFetchingService = {
  async checkAdminStatus(userId: string): Promise<boolean> {
    console.log('Checking admin status for user:', userId);
    
    const { data: isAdminData, error: adminError } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin'
    });

    if (adminError) {
      console.error('Error checking admin status:', adminError);
      throw adminError;
    }

    console.log('Is admin:', isAdminData);
    
    if (!isAdminData) {
      throw new Error('Admin privileges required to view users');
    }

    return isAdminData;
  },

  async fetchAllUsers(): Promise<UserProfile[]> {
    console.log('Fetching all users using database function...');
    
    // Use the existing database function that handles admin permissions
    const { data: users, error } = await supabase.rpc('get_all_users_for_admin');
    
    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    console.log('Users fetched from database function:', users?.length || 0);
    
    // Transform the data to match UserProfile interface
    const userProfiles: UserProfile[] = (users || []).map(user => ({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      membership_type: user.membership_type || 'basic',
      join_date: user.join_date,
      avatar_url: user.avatar_url,
      roles: user.roles || []
    }));

    return userProfiles;
  }
};
