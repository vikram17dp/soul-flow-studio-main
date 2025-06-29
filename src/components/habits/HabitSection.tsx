
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Target } from 'lucide-react';
import HabitTracker from './HabitTracker';

const HabitSection = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <Heart className="h-8 w-8 text-red-500" />
          <Target className="h-8 w-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Healthy Habit Tracker</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Transform your relationship with food through 5 essential daily habits. 
          Earn points, build streaks, and create lasting change! 🚀
        </p>
      </div>

      <HabitTracker />
    </div>
  );
};

export default HabitSection;
