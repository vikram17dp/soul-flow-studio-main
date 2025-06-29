
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useHabits } from '@/hooks/useHabits';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  Flame, 
  Trophy, 
  Calendar,
  CheckCircle,
  ArrowLeft,
  Star,
  Award,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HabitProgress = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const {
    habits,
    dailyHabits,
    habitStats,
    completedToday,
    totalHabits,
    dailyProgress,
    allHabitsCompleted,
    isLoading
  } = useHabits();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your habit progress...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate overall stats
  const totalStreaks = habitStats.reduce((sum, stat) => sum + stat.current_streak, 0);
  const bestStreak = Math.max(...habitStats.map(stat => stat.best_streak), 0);
  const averageCompletion = habitStats.length > 0 
    ? Math.round(habitStats.reduce((sum, stat) => sum + stat.completion_rate, 0) / habitStats.length)
    : 0;

  // Get motivational messages
  const getMotivationalMessage = () => {
    if (allHabitsCompleted) {
      return { message: "🎉 Perfect day! You're crushing all your habits!", color: "text-green-600", bg: "bg-green-50" };
    } else if (dailyProgress >= 80) {
      return { message: "🔥 You're on fire! Almost there!", color: "text-orange-600", bg: "bg-orange-50" };
    } else if (dailyProgress >= 60) {
      return { message: "💪 Great progress! Keep pushing!", color: "text-blue-600", bg: "bg-blue-50" };
    } else if (dailyProgress >= 40) {
      return { message: "🌱 Good start! Every step counts!", color: "text-purple-600", bg: "bg-purple-50" };
    } else {
      return { message: "✨ New day, new opportunities!", color: "text-gray-600", bg: "bg-gray-50" };
    }
  };

  const motivationalMsg = getMotivationalMessage();

  // Get improvement suggestions
  const getImprovementSuggestions = () => {
    const suggestions = [];
    const incompleteHabits = dailyHabits.filter(h => !h.entry?.completed);
    
    if (incompleteHabits.length > 0) {
      suggestions.push(`Complete ${incompleteHabits[0].habit.name} to boost your progress`);
    }
    
    const lowStreakHabits = habitStats.filter(stat => stat.current_streak < 3);
    if (lowStreakHabits.length > 0) {
      suggestions.push(`Focus on building streaks for ${lowStreakHabits[0].habit_name}`);
    }
    
    if (averageCompletion < 70) {
      suggestions.push("Try setting reminders to maintain consistency");
    }
    
    return suggestions;
  };

  const improvements = getImprovementSuggestions();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Habit Journey</h1>
          <p className="text-gray-600">Track your progress and celebrate your wins! 🌟</p>
        </div>

        {/* Motivational Banner */}
        <Card className={`${motivationalMsg.bg} border-none`}>
          <CardContent className="p-6 text-center">
            <p className={`text-xl font-semibold ${motivationalMsg.color}`}>
              {motivationalMsg.message}
            </p>
          </CardContent>
        </Card>

        {/* Today's Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-green-600" />
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {completedToday}/{totalHabits}
              </div>
              <Progress value={dailyProgress} className="mb-2" />
              <p className="text-sm text-gray-600">{Math.round(dailyProgress)}% Complete</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame className="h-5 w-5 text-orange-600" />
                Active Streaks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-2">{totalStreaks}</div>
              <p className="text-sm text-gray-600">Days combined</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-purple-600" />
                Best Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">{bestStreak}</div>
              <p className="text-sm text-gray-600">Days in a row</p>
            </CardContent>
          </Card>
        </div>

        {/* Individual Habit Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Habit Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {habitStats.map((stat) => (
              <div key={stat.habit_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stat.habit_icon}</span>
                  <div>
                    <h3 className="font-medium">{stat.habit_name}</h3>
                    <p className="text-sm text-gray-600">
                      {stat.completion_rate.toFixed(1)}% completion rate
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span className="font-semibold">{stat.current_streak}</span>
                    </div>
                    <p className="text-xs text-gray-500">Current</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-semibold">{stat.best_streak}</span>
                    </div>
                    <p className="text-xs text-gray-500">Best</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Achievements & Encouragement */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What's Going Great */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                What's Going Great
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {allHabitsCompleted && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Trophy className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Perfect day achieved!</span>
                </div>
              )}
              {habitStats
                .filter(stat => stat.current_streak >= 3)
                .slice(0, 3)
                .map(stat => (
                  <div key={stat.habit_id} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{stat.habit_name}: {stat.current_streak} day streak!</span>
                  </div>
                ))}
              {averageCompletion >= 70 && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">Consistent performer - {averageCompletion}% average!</span>
                </div>
              )}
              {habitStats.filter(stat => stat.current_streak >= 3).length === 0 && averageCompletion < 70 && !allHabitsCompleted && (
                <div className="text-center py-4 text-gray-500">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Keep building those streaks!</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Target className="h-5 w-5" />
                Growth Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {improvements.map((suggestion, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                  <Zap className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">{suggestion}</span>
                </div>
              ))}
              {improvements.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                  <Trophy className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">You're doing amazing! Keep it up!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Weekly Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{averageCompletion}%</div>
                <p className="text-sm text-gray-600">Average Completion</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{habitStats.reduce((sum, stat) => sum + stat.total_completions, 0)}</div>
                <p className="text-sm text-gray-600">Total Completions</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-orange-600">{totalStreaks}</div>
                <p className="text-sm text-gray-600">Active Streaks</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{bestStreak}</div>
                <p className="text-sm text-gray-600">Longest Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Motivational Footer */}
        <div className="text-center py-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Remember: Progress, not perfection! 🌟
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Every habit you complete is a step towards a healthier, happier you. 
            Celebrate the small wins and keep building those positive routines!
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitProgress;
