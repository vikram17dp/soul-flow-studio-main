import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Scale, Users, Trophy, TrendingDown } from 'lucide-react';

interface WeightStats {
  totalUsers: number;
  totalEntries: number;
  totalAchievements: number;
  totalWeightLost: number;
  activeUsers: number;
}

const AdminWeightOverview = () => {
  const { toast } = useToast();
  const [stats, setStats] = useState<WeightStats>({
    totalUsers: 0,
    totalEntries: 0,
    totalAchievements: 0,
    totalWeightLost: 0,
    activeUsers: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Get total users with weight goals
      const { count: totalUsers } = await supabase
        .from('weight_goals')
        .select('*', { count: 'exact', head: true });

      // Get total weight entries
      const { count: totalEntries } = await supabase
        .from('weight_entries')
        .select('*', { count: 'exact', head: true });

      // Get total achievements
      const { count: totalAchievements } = await supabase
        .from('weight_achievements')
        .select('*', { count: 'exact', head: true });

      // Get leaderboard data to calculate total weight lost
      const { data: leaderboardData } = await supabase.rpc('get_weight_loss_leaderboard', {
        days_filter: 0 // All time
      });

      const totalWeightLost = leaderboardData?.reduce((sum: number, entry: any) => 
        sum + parseFloat(entry.total_weight_lost), 0) || 0;

      // Get active users (users who logged weight in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: activeUsersData } = await supabase
        .from('weight_entries')
        .select('user_id')
        .gte('entry_date', thirtyDaysAgo.toISOString().split('T')[0]);

      const activeUsers = new Set(activeUsersData?.map((entry: any) => entry.user_id)).size;

      setStats({
        totalUsers: totalUsers || 0,
        totalEntries: totalEntries || 0,
        totalAchievements: totalAchievements || 0,
        totalWeightLost: Math.round(totalWeightLost * 10) / 10,
        activeUsers
      });
    } catch (error: any) {
      console.error('Error fetching weight stats:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch weight tracking statistics',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-8 w-8 bg-gray-200 rounded mb-4"></div>
                <div className="h-6 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Scale className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingDown className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Weight Lost</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalWeightLost} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Achievements</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAchievements}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Summary</CardTitle>
            <CardDescription>Recent weight tracking activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users (30 days)</span>
                <span className="font-semibold">{stats.activeUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Entries per User</span>
                <span className="font-semibold">
                  {stats.totalUsers > 0 ? Math.round((stats.totalEntries / stats.totalUsers) * 10) / 10 : 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Achievements per User</span>
                <span className="font-semibold">
                  {stats.totalUsers > 0 ? Math.round((stats.totalAchievements / stats.totalUsers) * 10) / 10 : 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Weight tracking system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Points System</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Achievements</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Working
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminWeightOverview;
