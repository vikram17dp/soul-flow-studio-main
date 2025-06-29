
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Trophy, Medal } from 'lucide-react';

interface MembershipStatsProps {
  membershipType: string;
  achievementsCount: number;
  userPosition: number;
}

const MembershipStats = ({ membershipType, achievementsCount, userPosition }: MembershipStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Membership</p>
              <p className="text-xl font-bold capitalize">{membershipType}</p>
            </div>
            <Crown className="h-8 w-8 opacity-80" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Achievements</p>
              <p className="text-xl font-bold text-purple-600">{achievementsCount}</p>
            </div>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Leaderboard Rank</p>
              <p className="text-xl font-bold text-green-600">#{userPosition || 'Unranked'}</p>
            </div>
            <Medal className="h-8 w-8 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipStats;
