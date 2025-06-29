
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, Calendar, Package, BookOpen, TrendingUp, DollarSign } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalClasses: number;
  totalPackages: number;
  totalBookings: number;
  activeClasses: number;
  recentBookings: number;
}

const AdminOverview = () => {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalClasses: 0,
    totalPackages: 0,
    totalBookings: 0,
    activeClasses: 0,
    recentBookings: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, classesRes, packagesRes, bookingsRes] = await Promise.all([
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('classes').select('id, is_active', { count: 'exact' }),
          supabase.from('packages').select('id', { count: 'exact', head: true }),
          supabase.from('bookings').select('id, created_at', { count: 'exact' })
        ]);

        const activeClasses = classesRes.data?.filter(c => c.is_active).length || 0;
        const recentBookings = bookingsRes.data?.filter(b => {
          const bookingDate = new Date(b.created_at);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return bookingDate >= weekAgo;
        }).length || 0;

        setStats({
          totalUsers: usersRes.count || 0,
          totalClasses: classesRes.count || 0,
          totalPackages: packagesRes.count || 0,
          totalBookings: bookingsRes.count || 0,
          activeClasses,
          recentBookings
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered members',
      color: 'text-blue-600'
    },
    {
      title: 'Active Classes',
      value: stats.activeClasses,
      icon: Calendar,
      description: `${stats.totalClasses} total classes`,
      color: 'text-green-600'
    },
    {
      title: 'Packages',
      value: stats.totalPackages,
      icon: Package,
      description: 'Available packages',
      color: 'text-purple-600'
    },
    {
      title: 'Total Bookings',
      value: stats.totalBookings,
      icon: BookOpen,
      description: `${stats.recentBookings} this week`,
      color: 'text-orange-600'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Key metrics and statistics for Soul Flow Studio</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Recent Activity
            </CardTitle>
            <CardDescription>Latest updates across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-sm text-gray-600">{stats.recentBookings} new bookings this week</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <p className="text-sm text-gray-600">{stats.activeClasses} classes currently active</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <p className="text-sm text-gray-600">{stats.totalUsers} total registered users</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-600" />
              Quick Actions
            </CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Add New Class</div>
                <div className="text-sm text-gray-600">Create a new yoga class</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">Manage Users</div>
                <div className="text-sm text-gray-600">View and edit user accounts</div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="font-medium text-gray-900">View Bookings</div>
                <div className="text-sm text-gray-600">Check recent reservations</div>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
