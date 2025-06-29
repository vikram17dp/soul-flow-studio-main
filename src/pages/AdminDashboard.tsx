
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Calendar, 
  Package, 
  BookOpen, 
  Settings,
  BarChart3,
  Shield,
  Heart,
  LogOut,
  Trophy,
  Scale,
  UserCog
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminUsers from '@/components/admin/AdminUsers';
import AdminClasses from '@/components/admin/AdminClasses';
import AdminPackages from '@/components/admin/AdminPackages';
import AdminBookings from '@/components/admin/AdminBookings';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminPoints from '@/components/admin/AdminPoints';
import AdminWeightManagement from '@/components/admin/AdminWeightManagement';

const AdminDashboard = () => {
  const { isAdmin, isLoading } = useAdminAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Checking your permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have admin privileges to access this page.</p>
          <Button onClick={() => navigate('/dashboard')} className="bg-purple-600 hover:bg-purple-700">
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Heart className="h-8 w-8 text-purple-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Soul Flow Studio</h1>
                <p className="text-sm text-gray-600">Admin Panel</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/user-packages')}
                className="border-purple-600 text-purple-600 hover:bg-purple-50 flex items-center space-x-2"
              >
                <UserCog className="h-4 w-4" />
                <span>User Packages</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="border-purple-600 text-purple-600 hover:bg-purple-50"
              >
                User View
              </Button>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="classes" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Classes</span>
            </TabsTrigger>
            <TabsTrigger value="packages" className="flex items-center space-x-2">
              <Package className="h-4 w-4" />
              <span>Packages</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="points" className="flex items-center space-x-2">
              <Trophy className="h-4 w-4" />
              <span>Points</span>
            </TabsTrigger>
            <TabsTrigger value="weight" className="flex items-center space-x-2">
              <Scale className="h-4 w-4" />
              <span>Weight</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminOverview />
          </TabsContent>

          <TabsContent value="users">
            <AdminUsers />
          </TabsContent>

          <TabsContent value="classes">
            <AdminClasses />
          </TabsContent>

          <TabsContent value="packages">
            <AdminPackages />
          </TabsContent>

          <TabsContent value="bookings">
            <AdminBookings />
          </TabsContent>

          <TabsContent value="points">
            <AdminPoints />
          </TabsContent>

          <TabsContent value="weight">
            <AdminWeightManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
