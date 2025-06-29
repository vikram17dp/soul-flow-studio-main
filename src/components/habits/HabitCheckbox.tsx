
import { useState } from 'react';
import { Check } from 'lucide-react';
import { DailyHabitData } from '@/types/habits';

interface HabitCheckboxProps {
  habitData: DailyHabitData;
  onToggle: (habitId: string, completed: boolean) => void;
  disabled?: boolean;
}

const HabitCheckbox = ({ habitData, onToggle, disabled }: HabitCheckboxProps) => {
  const { habit, entry, streak } = habitData;
  const isCompleted = entry?.completed || false;
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    if (disabled) return;
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    
    onToggle(habit.id, !isCompleted);
  };

  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <button
        onClick={handleToggle}
        disabled={disabled}
        className={`
          relative w-8 h-8 rounded-full border-2 flex items-center justify-center
          transition-all duration-300 touch-manipulation
          ${isCompleted 
            ? 'bg-green-500 border-green-500 text-white' 
            : 'border-gray-300 hover:border-green-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${isAnimating ? 'scale-110' : 'scale-100'}
        `}
      >
        {isCompleted && (
          <Check className="h-5 w-5" />
        )}
      </button>

      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{habit.icon}</span>
          <h3 className={`font-medium ${isCompleted ? 'text-green-700' : 'text-gray-900'}`}>
            {habit.name}
          </h3>
          {streak && streak.current_streak > 0 && (
            <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
              🔥 {streak.current_streak} day streak
            </span>
          )}
        </div>
        
        {habit.description && (
          <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
        )}
        
        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
          <span>+{habit.points_per_completion} points</span>
          {streak && streak.best_streak > 0 && (
            <span>Best streak: {streak.best_streak} days</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HabitCheckbox;
