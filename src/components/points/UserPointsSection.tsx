
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, History } from 'lucide-react';
import { useUserPoints } from '@/hooks/points/useUserPoints';
import PointsDisplay from './PointsDisplay';
import PointsHistory from './PointsHistory';

const UserPointsSection = () => {
  const { userPoints, transactions, isLoading } = useUserPoints();
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Trophy className="h-6 w-6 mr-2 text-yellow-600" />
            Your Points
          </h2>
          <p className="text-gray-600">Earn points for participating in yoga classes and activities</p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowHistory(!showHistory)}
          className="flex items-center"
        >
          <History className="h-4 w-4 mr-2" />
          {showHistory ? 'Hide' : 'Show'} History
        </Button>
      </div>

      <PointsDisplay userPoints={userPoints} isLoading={isLoading} />

      {showHistory && (
        <PointsHistory transactions={transactions} isLoading={isLoading} />
      )}

      {!showHistory && (
        <Card>
          <CardHeader>
            <CardTitle>How to Earn Points</CardTitle>
            <CardDescription>Ways to earn points in our yoga community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-purple-600 mb-2">Class Activities</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Attend a class: 10 points</li>
                  <li>• Book a class: 5 points</li>
                  <li>• Submit a review: 15 points</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-purple-600 mb-2">Community</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Refer a friend: 50 points</li>
                  <li>• Weekly streak: 25 points</li>
                  <li>• Monthly streak: 100 points</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default UserPointsSection;
