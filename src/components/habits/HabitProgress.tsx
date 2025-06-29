
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Flame } from 'lucide-react';

interface HabitProgressProps {
  completedToday: number;
  totalHabits: number;
  dailyProgress: number;
  allHabitsCompleted: boolean;
}

const HabitProgress = ({ 
  completedToday, 
  totalHabits, 
  dailyProgress, 
  allHabitsCompleted 
}: HabitProgressProps) => {
  return (
    <div className="space-y-4">
      {/* Daily Progress */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Today's Progress</h3>
          </div>
          <span className="text-2xl font-bold text-purple-600">
            {completedToday}/{totalHabits}
          </span>
        </div>
        
        <Progress value={dailyProgress} className="mb-2" />
        
        <p className="text-sm text-gray-600">
          {allHabitsCompleted 
            ? "🎉 Amazing! You've completed all habits today!" 
            : `${totalHabits - completedToday} more to go for your daily bonus!`
          }
        </p>
      </div>

      {/* Bonus Points Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <Trophy className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-green-800">Complete All 5</p>
          <p className="text-xs text-green-600">+50 bonus points</p>
        </div>
        
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <Flame className="h-6 w-6 text-orange-600 mx-auto mb-2" />
          <p className="text-sm font-medium text-orange-800">Keep Streaks</p>
          <p className="text-xs text-orange-600">+30 to +100 points</p>
        </div>
      </div>
    </div>
  );
};

export default HabitProgress;
