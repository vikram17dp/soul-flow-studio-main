
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CheckSquare, TrendingUp } from 'lucide-react';
import { DailyHabitData } from '@/types/habits';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionRequiredModal } from '@/components/SubscriptionRequiredModal';
import { useNavigate } from 'react-router-dom';

interface CompactHabitTrackerProps {
  dailyHabits: DailyHabitData[];
  completedToday: number;
  totalHabits: number;
  dailyProgress: number;
  allHabitsCompleted: boolean;
  onToggleHabit: (habitId: string, completed: boolean) => void;
}

const CompactHabitTracker = ({ 
  dailyHabits, 
  completedToday, 
  totalHabits, 
  dailyProgress, 
  allHabitsCompleted,
  onToggleHabit 
}: CompactHabitTrackerProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [isHabitsDialogOpen, setIsHabitsDialogOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Check if user has premium membership
  const hasPremiumMembership = profile?.membership_type === 'premium';

  const handleHabitToggle = (habitId: string, completed: boolean) => {
    if (!hasPremiumMembership) {
      setShowSubscriptionModal(true);
      return;
    }
    onToggleHabit(habitId, completed);
  };

  const handleUpdateHabitsClick = () => {
    if (!hasPremiumMembership) {
      setShowSubscriptionModal(true);
      return;
    }
    setIsHabitsDialogOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-green-600" />
            Today's Habits
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedToday}/{totalHabits}</div>
                <div className="text-sm text-gray-500">Completed Today</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{Math.round(dailyProgress)}%</div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>
            </div>
            
            <Progress value={dailyProgress} className="h-2" />
            
            {allHabitsCompleted && (
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-3 rounded-lg text-center">
                <p className="text-green-800 font-medium">🎉 All habits completed! Bonus points earned!</p>
              </div>
            )}
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate('/habit-progress')}
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                View Progress
              </Button>
              <Button 
                size="sm" 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleUpdateHabitsClick}
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Update Habits
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription Required Modal */}
      <SubscriptionRequiredModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)} 
      />

      {/* Habits Dialog - Only allow habit updates for premium users */}
      <Dialog open={isHabitsDialogOpen} onOpenChange={setIsHabitsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Today's Habits</DialogTitle>
            <DialogDescription>
              {hasPremiumMembership 
                ? "Mark your habits as completed for today. Each completion earns you points!"
                : "View your daily habits. Upgrade to premium to track your progress!"
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {dailyHabits.map((dailyHabit) => (
              <div 
                key={dailyHabit.habit.id} 
                className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={dailyHabit.entry?.completed || false}
                  onChange={(e) => handleHabitToggle(dailyHabit.habit.id, e.target.checked)}
                  disabled={!hasPremiumMembership}
                  className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 disabled:opacity-50"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{dailyHabit.habit.icon}</span>
                    <span className="font-medium text-sm">{dailyHabit.habit.name}</span>
                  </div>
                  {dailyHabit.habit.description && (
                    <p className="text-xs text-gray-600 mt-1">{dailyHabit.habit.description}</p>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  +{dailyHabit.habit.points_per_completion}
                </Badge>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => setIsHabitsDialogOpen(false)}
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CompactHabitTracker;
