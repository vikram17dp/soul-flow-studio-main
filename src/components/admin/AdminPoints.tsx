
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePointsAdmin } from '@/hooks/usePoints';
import AdminPointsOverview from './points/AdminPointsOverview';
import AdminPointRules from './points/AdminPointRules';
import AdminAwardPoints from './points/AdminAwardPoints';

const AdminPoints = () => {
  const { allUserPoints, pointRules, isLoading, updatePointRule, awardPoints, refetch } = usePointsAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Points System Management</h2>
        <p className="text-gray-600">Manage user points, rules, and award points manually</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rules">Point Rules</TabsTrigger>
          <TabsTrigger value="award">Award Points</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <AdminPointsOverview userPoints={allUserPoints} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="rules">
          <AdminPointRules 
            rules={pointRules} 
            isLoading={isLoading}
            onUpdateRule={updatePointRule}
          />
        </TabsContent>

        <TabsContent value="award">
          <AdminAwardPoints 
            users={allUserPoints}
            onAwardPoints={awardPoints}
            onComplete={refetch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPoints;
