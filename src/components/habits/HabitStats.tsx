
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Target } from 'lucide-react';
import { HabitStats as HabitStatsType } from '@/types/habits';

interface HabitStatsProps {
  habitStats: HabitStatsType[];
}

const HabitStats = ({ habitStats }: HabitStatsProps) => {
  const averageCompletion = habitStats.length > 0
    ? Math.round(habitStats.reduce((sum, stat) => sum + stat.completion_rate, 0) / habitStats.length)
    : 0;

  const totalStreaks = habitStats.reduce((sum, stat) => sum + stat.current_streak, 0);
  const bestStreak = Math.max(...habitStats.map(stat => stat.best_streak), 0);

  const chartData = habitStats.map(stat => ({
    name: stat.habit_icon + ' ' + stat.habit_name.split(' ').slice(0, 2).join(' '),
    completion: stat.completion_rate,
    streak: stat.current_streak,
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-blue-800">{averageCompletion}%</p>
          <p className="text-xs text-blue-600">Average Completion</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <Award className="h-6 w-6 text-orange-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-orange-800">{totalStreaks}</p>
          <p className="text-xs text-orange-600">Active Streaks</p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
          <p className="text-2xl font-bold text-purple-800">{bestStreak}</p>
          <p className="text-xs text-purple-600">Best Streak</p>
        </div>
      </div>

      {/* Completion Rate Chart */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">Weekly Completion Rates</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'completion' ? `${value}%` : `${value} days`,
                  name === 'completion' ? 'Completion Rate' : 'Current Streak'
                ]}
              />
              <Bar dataKey="completion" fill="#10b981" name="completion" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Individual Habit Stats */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Habit Details</h3>
        {habitStats.map(stat => (
          <div key={stat.habit_id} className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{stat.habit_icon}</span>
                <div>
                  <h4 className="font-medium text-gray-900">{stat.habit_name}</h4>
                  <p className="text-sm text-gray-600">
                    {stat.total_completions} completions this week
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">{stat.completion_rate}%</p>
                <p className="text-xs text-gray-500">
                  🔥 {stat.current_streak} days (best: {stat.best_streak})
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HabitStats;
