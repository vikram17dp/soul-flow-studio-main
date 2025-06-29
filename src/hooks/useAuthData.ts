
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from '@/types/auth';

export const useAuthData = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        // Type cast the membership_type to ensure it matches our interface
        const profileData: UserProfile = {
          ...data,
          membership_type: (data.membership_type || 'basic') as 'basic' | 'premium' | 'unlimited'
        };
        console.log('Profile fetched successfully:', profileData.full_name);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const refreshProfile = async (userId: string) => {
    console.log('Refreshing profile data for user:', userId);
    await fetchUserProfile(userId);
  };

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log('Checking admin status for user:', userId);
      
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: 'admin'
      });

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        console.log('Admin status:', data || false);
        setIsAdmin(data || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    }
  };

  const clearUserData = () => {
    console.log('Clearing user data');
    setProfile(null);
    setIsAdmin(false);
  };

  return {
    profile,
    isAdmin,
    setProfile,
    setIsAdmin,
    fetchUserProfile,
    refreshProfile,
    checkAdminStatus,
    clearUserData
  };
};
