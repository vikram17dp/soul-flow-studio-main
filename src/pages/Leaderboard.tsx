
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Crown, TrendingUp, Calendar, Users, Dumbbell, Heart, Target } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import Navigation from '@/components/Navigation';

type LeaderboardCategory = 'overall' | 'class_joining' | 'weight_tracker' | 'habit_tracker';
type TimePeriod = 7 | 30 | 90 | 0; // 0 means all time

const Leaderboard = () => {
  const [category, setCategory] = useState<LeaderboardCategory>('overall');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>(30);
  
  const { leaderboardData, isLoading } = useLeaderboard(category, timePeriod);

  const getCategoryIcon = (cat: LeaderboardCategory) => {
    switch (cat) {
      case 'overall': return <Trophy className="h-4 w-4" />;
      case 'class_joining': return <Users className="h-4 w-4" />;
      case 'weight_tracker': return <Dumbbell className="h-4 w-4" />;
      case 'habit_tracker': return <Heart className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (cat: LeaderboardCategory) => {
    switch (cat) {
      case 'overall': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      case 'class_joining': return 'bg-gradient-to-r from-blue-400 to-purple-500';
      case 'weight_tracker': return 'bg-gradient-to-r from-green-400 to-emerald-500';
      case 'habit_tracker': return 'bg-gradient-to-r from-pink-400 to-red-500';
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-gray-600">#{rank}</span>;
  };

  const getTimePeriodLabel = (period: TimePeriod) => {
    switch (period) {
      case 7: return 'Last 7 Days';
      case 30: return 'Last 30 Days';
      case 90: return 'Last 90 Days';
      case 0: return 'All Time';
    }
  };

  const categories = [
    { key: 'overall' as const, label: 'Overall', description: 'Combined points from all activities' },
    { key: 'class_joining' as const, label: 'Classes', description: 'Points from joining yoga classes' },
    { key: 'weight_tracker' as const, label: 'Weight', description: 'Points from weight tracking' },
    { key: 'habit_tracker' as const, label: 'Habits', description: 'Points from daily habits' }
  ];

  const timePeriods: TimePeriod[] = [7, 30, 90, 0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Leaderboard
            </h1>
            <Trophy className="h-8 w-8 text-yellow-500" />
          </div>
          <p className="text-gray-600 text-lg">
            Celebrate your journey and compete with fellow wellness warriors!
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Category Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Category
              </CardTitle>
              <CardDescription>Choose what to track</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat.key}
                    variant={category === cat.key ? "default" : "outline"}
                    onClick={() => setCategory(cat.key)}
                    className={`h-auto p-3 flex flex-col items-center gap-1 ${
                      category === cat.key ? getCategoryColor(cat.key) + ' text-white' : ''
                    }`}
                  >
                    {getCategoryIcon(cat.key)}
                    <span className="text-sm font-medium">{cat.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Period Filter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Time Period
              </CardTitle>
              <CardDescription>Select timeframe</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {timePeriods.map((period) => (
                  <Button
                    key={period}
                    variant={timePeriod === period ? "default" : "outline"}
                    onClick={() => setTimePeriod(period)}
                    className={timePeriod === period ? 'bg-gradient-to-r from-indigo-500 to-purple-600' : ''}
                  >
                    {getTimePeriodLabel(period)}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Selection Display */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <Badge variant="secondary" className="text-sm px-4 py-2">
            {getCategoryIcon(category)}
            <span className="ml-2">{categories.find(c => c.key === category)?.label}</span>
          </Badge>
          <Badge variant="outline" className="text-sm px-4 py-2">
            <Calendar className="h-4 w-4 mr-2" />
            {getTimePeriodLabel(timePeriod)}
          </Badge>
        </div>

        {/* Leaderboard */}
        <Card className="overflow-hidden">
          <CardHeader className={`${getCategoryColor(category)} text-white`}>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {getCategoryIcon(category)}
                {categories.find(c => c.key === category)?.label} Leaderboard
              </span>
              <TrendingUp className="h-5 w-5" />
            </CardTitle>
            <CardDescription className="text-white/80">
              {categories.find(c => c.key === category)?.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Loading leaderboard...</p>
              </div>
            ) : leaderboardData.length === 0 ? (
              <div className="p-8 text-center">
                <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">No data available for this period</p>
                <p className="text-gray-400">Be the first to earn points!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {leaderboardData.map((user, index) => (
                  <div
                    key={user.user_id}
                    className={`p-6 flex items-center gap-4 hover:bg-gray-50 transition-colors ${
                      index < 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                    }`}
                  >
                    {/* Rank */}
                    <div className="flex-shrink-0 w-12 flex justify-center">
                      {getRankIcon(index + 1)}
                    </div>

                    {/* User Info */}
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                        {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {user.full_name || 'Anonymous User'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {user.points} points
                      </p>
                    </div>

                    {/* Points Badge */}
                    <Badge 
                      variant="secondary" 
                      className={`${getCategoryColor(category)} text-white px-4 py-2 text-lg font-bold`}
                    >
                      {user.points}
                    </Badge>

                    {/* Special Badges for Top 3 */}
                    {index === 0 && (
                      <Badge className="bg-yellow-500 text-white">
                        🏆 Champion
                      </Badge>
                    )}
                    {index === 1 && (
                      <Badge className="bg-gray-400 text-white">
                        🥈 Runner-up
                      </Badge>
                    )}
                    {index === 2 && (
                      <Badge className="bg-amber-600 text-white">
                        🥉 Third Place
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Fun Stats */}
        {!isLoading && leaderboardData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-600">
                  {leaderboardData.length}
                </div>
                <div className="text-sm text-gray-500">Active Participants</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {leaderboardData.reduce((sum, user) => sum + user.points, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Points Earned</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-orange-600">
                  {leaderboardData[0]?.points || 0}
                </div>
                <div className="text-sm text-gray-500">Highest Score</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
