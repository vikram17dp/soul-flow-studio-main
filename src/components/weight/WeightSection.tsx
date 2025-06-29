
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Scale, Trophy } from 'lucide-react';
import WeightTracker from './WeightTracker';
import WeightLeaderboard from './WeightLeaderboard';

const WeightSection = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Weight Loss Journey</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Track your progress, earn points, and compete with others on your weight loss journey. 
          Every step counts towards a healthier you! 🌟
        </p>
      </div>

      <Tabs defaultValue="tracker" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tracker" className="flex items-center space-x-2">
            <Scale className="h-4 w-4" />
            <span>My Progress</span>
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Leaderboard</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracker">
          <WeightTracker />
        </TabsContent>

        <TabsContent value="leaderboard">
          <WeightLeaderboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WeightSection;
