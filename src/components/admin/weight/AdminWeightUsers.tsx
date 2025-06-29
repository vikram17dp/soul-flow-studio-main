
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Users, Search, TrendingDown, Calendar } from 'lucide-react';

interface UserWeightData {
  user_id: string;
  full_name: string;
  start_weight: number;
  latest_weight?: number;
  weight_lost: number;
  entries_count: number;
  goal_created: string;
  last_entry_date?: string;
}

const AdminWeightUsers = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWeightData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.rpc('get_weight_loss_leaderboard', {
        days_filter: 0 // All time
      });

      if (error) throw error;

      // Get additional user data
      const userIds = data?.map((user: any) => user.user_id) || [];
      
      if (userIds.length > 0) {
        const { data: goals } = await (supabase as any)
          .from('weight_goals')
          .select('user_id, start_weight, created_at')
          .in('user_id', userIds);

        const { data: lastEntries } = await (supabase as any)
          .from('weight_entries')
          .select('user_id, entry_date')
          .in('user_id', userIds)
          .order('entry_date', { ascending: false });

        const usersWithData = data?.map((user: any) => {
          const goal = goals?.find((g: any) => g.user_id === user.user_id);
          const lastEntry = lastEntries?.find((e: any) => e.user_id === user.user_id);
          
          return {
            user_id: user.user_id,
            full_name: user.full_name,
            start_weight: user.start_weight,
            latest_weight: user.latest_weight,
            weight_lost: parseFloat(user.total_weight_lost),
            entries_count: parseInt(user.entries_count),
            goal_created: goal?.created_at || '',
            last_entry_date: lastEntry?.entry_date || null
          };
        }) || [];

        setUsers(usersWithData);
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user weight data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading user weight data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Weight Loss Users</CardTitle>
          <CardDescription>
            Manage and monitor all users participating in weight loss tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.user_id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                      <Badge variant="outline" className="text-green-600 border-green-200">
                        {user.weight_lost.toFixed(1)} kg lost
                      </Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Start Weight:</span>
                        <p>{user.start_weight} kg</p>
                      </div>
                      <div>
                        <span className="font-medium">Current Weight:</span>
                        <p>{user.latest_weight ? `${user.latest_weight} kg` : 'No entries'}</p>
                      </div>
                      <div>
                        <span className="font-medium">Total Entries:</span>
                        <p>{user.entries_count}</p>
                      </div>
                      <div>
                        <span className="font-medium">Last Entry:</span>
                        <p>{user.last_entry_date ? new Date(user.last_entry_date).toLocaleDateString() : 'Never'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingDown className="h-5 w-5 text-green-600" />
                    <span className="text-lg font-bold text-green-600">
                      {user.weight_lost.toFixed(1)} kg
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No users found matching your search.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminWeightUsers;
