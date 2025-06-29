
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Medal, Award, TrendingDown, Users } from 'lucide-react';
import { useWeightLeaderboard } from '@/hooks/useWeightTracking';
import { LeaderboardPeriod } from '@/types/weight';

const WeightLeaderboard = () => {
  const { leaderboard, isLoading, period, setPeriod } = useWeightLeaderboard();

  const periodOptions: { value: LeaderboardPeriod; label: string }[] = [
    { value: 7, label: 'Last 7 Days' },
    { value: 30, label: 'Last 30 Days' },
    { value: 90, label: 'Last 90 Days' },
    { value: 0, label: 'All Time' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center py-8">
            <TrendingDown className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading leaderboard...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <TrendingDown className="h-5 w-5 mr-2 text-purple-600" />
          Weight Loss Leaderboard
        </CardTitle>
        <CardDescription>
          See how you rank among our weight loss champions!
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Period Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {periodOptions.map((option) => (
            <Button
              key={option.value}
              variant={period === option.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPeriod(option.value)}
              className={period === option.value ? 'bg-purple-600 hover:bg-purple-700' : ''}
            >
              {option.label}
            </Button>
          ))}
        </div>

        {/* Leaderboard */}
        {leaderboard.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No weight loss data for this period yet.</p>
            <p className="text-sm mt-2">Be the first to start logging your weight!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.user_id}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                  entry.rank <= 3 
                    ? 'border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Badge className={`px-3 py-1 ${getRankBadgeColor(entry.rank)}`}>
                      <span className="flex items-center space-x-1">
                        {getRankIcon(entry.rank)}
                      </span>
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {entry.full_name}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>Current: {entry.latest_weight} kg</span>
                      <span>•</span>
                      <span>{entry.entries_count} entries</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">
                    -{entry.total_weight_lost} kg
                  </div>
                  <div className="text-sm text-gray-500">
                    {((entry.total_weight_lost / entry.start_weight) * 100).toFixed(1)}% lost
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Motivational Footer */}
        {leaderboard.length > 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-center">
            <p className="text-sm text-purple-800 font-medium">
              🎉 Amazing work everyone! Keep up the fantastic progress! 🎉
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WeightLeaderboard;
