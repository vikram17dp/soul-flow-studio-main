
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Crown, Medal, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LeaderboardEntry {
  user_id: string;
  full_name: string;
  points: number;
}

interface LeaderboardPreviewProps {
  topThree: LeaderboardEntry[];
  isLoading: boolean;
}

const LeaderboardPreview = ({ topThree, isLoading }: LeaderboardPreviewProps) => {
  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-4 w-4 text-gray-400" />;
    if (rank === 3) return <Award className="h-4 w-4 text-amber-600" />;
    return <span className="text-sm font-bold text-gray-600">#{rank}</span>;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Top Performers
          </span>
          <Link to="/leaderboard">
            <Button variant="outline" size="sm">
              View Full Leaderboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-500">Loading leaderboard...</p>
          </div>
        ) : (
          <div className="space-y-2">
            {topThree.map((user, index) => (
              <div key={user.user_id} className="flex items-center gap-3 p-2 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50">
                <div className="flex-shrink-0">
                  {getRankIcon(index + 1)}
                </div>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                    {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm">{user.full_name}</p>
                </div>
                <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  {user.points}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardPreview;
