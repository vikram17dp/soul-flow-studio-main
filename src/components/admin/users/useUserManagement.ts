
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from './types';
import { userFetchingService } from './services/userFetchingService';
import { userActionsService } from './services/userActionsService';
import { useUserSearch } from './hooks/useUserSearch';

export const useUserManagement = () => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const { searchTerm, setSearchTerm, filteredUsers } = useUserSearch(users);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      console.log('Fetching all users...');
      
      // First check if user is admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user found');
        throw new Error('Authentication required');
      }

      console.log('Current user ID:', user.id);

      // Check admin status
      await userFetchingService.checkAdminStatus(user.id);

      // Fetch all users using the database function
      const allUsers = await userFetchingService.fetchAllUsers();

      console.log('Users fetched successfully:', allUsers.length);
      setUsers(allUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: `Failed to fetch users: ${error.message || 'Please check your admin permissions.'}`,
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const makeAdmin = async (userId: string, email: string) => {
    try {
      await userActionsService.makeAdmin(userId);

      toast({
        title: 'Success',
        description: `${email} has been made an admin`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error making user admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to make user admin',
        variant: 'destructive'
      });
    }
  };

  const removeAdmin = async (userId: string, email: string) => {
    try {
      await userActionsService.removeAdmin(userId);

      toast({
        title: 'Success',
        description: `Admin privileges removed from ${email}`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error removing admin:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to remove admin privileges',
        variant: 'destructive'
      });
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    try {
      await userActionsService.deleteUser(userId);
      
      toast({
        title: 'Success',
        description: `User ${email} has been permanently deleted from all systems`,
      });

      fetchUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user completely. Some data may remain.',
        variant: 'destructive'
      });
    }
  };

  return {
    users,
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isLoading,
    makeAdmin,
    removeAdmin,
    deleteUser,
    fetchUsers
  };
};
