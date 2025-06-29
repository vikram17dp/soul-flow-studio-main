
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Trophy, Users, BarChart3 } from 'lucide-react';
import AdminWeightOverview from './weight/AdminWeightOverview';
import AdminWeightUsers from './weight/AdminWeightUsers';
import AdminWeightAchievements from './weight/AdminWeightAchievements';

const AdminWeightManagement = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Weight Loss Management</h2>
        <p className="text-gray-600">
          Manage weight tracking, view user progress, and monitor achievements
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Users</span>
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Achievements</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminWeightOverview />
        </TabsContent>

        <TabsContent value="users">
          <AdminWeightUsers />
        </TabsContent>

        <TabsContent value="achievements">
          <AdminWeightAchievements />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminWeightManagement;
