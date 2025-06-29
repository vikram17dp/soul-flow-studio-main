
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, BarChart3, CheckSquare, Trophy } from 'lucide-react';
import { useHabits } from '@/hooks/useHabits';
import { useAuth } from '@/contexts/AuthContext';
import { SubscriptionRequiredModal } from '@/components/SubscriptionRequiredModal';
import HabitCheckbox from './HabitCheckbox';
import HabitProgress from './HabitProgress';
import HabitCalendar from './HabitCalendar';
import HabitStats from './HabitStats';

const HabitTracker = () => {
  const { profile } = useAuth();
  const {
    dailyHabits,
    habitStats,
    completedToday,
    totalHabits,
    dailyProgress,
    allHabitsCompleted,
    isLoading,
    toggleHabit,
    isToggling,
  } = useHabits();

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  // Check if user has premium membership
  const hasPremiumMembership = profile?.membership_type === 'premium';

  const handleToggleHabit = (habitId: string, completed: boolean) => {
    if (!hasPremiumMembership) {
      setShowSubscriptionModal(true);
      return;
    }
    toggleHabit(habitId, completed);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your habits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Habits</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Build healthy eating habits and earn points! Complete all 5 habits daily for bonus rewards. 🌟
          {!hasPremiumMembership && (
            <span className="block mt-2 text-purple-600 font-medium">
              Upgrade to Premium to track your habit progress!
            </span>
          )}
        </p>
      </div>

      <Tabs defaultValue="today" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today" className="flex items-center space-x-2">
            <CheckSquare className="h-4 w-4" />
            <span>Today</span>
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center space-x-2">
            <Trophy className="h-4 w-4" />
            <span>Progress</span>
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Calendar</span>
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Stats</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          <HabitProgress
            completedToday={completedToday}
            totalHabits={totalHabits}
            dailyProgress={dailyProgress}
            allHabitsCompleted={allHabitsCompleted}
          />
          
          <div className="space-y-3">
            <h2 className="font-semibold text-gray-900">Today's Habits</h2>
            <p className="text-sm text-gray-600 mb-4">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
            
            {dailyHabits.map((habitData) => (
              <HabitCheckbox
                key={habitData.habit.id}
                habitData={habitData}
                onToggle={handleToggleHabit}
                disabled={isToggling || !hasPremiumMembership}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <HabitProgress
            completedToday={completedToday}
            totalHabits={totalHabits}
            dailyProgress={dailyProgress}
            allHabitsCompleted={allHabitsCompleted}
          />
        </TabsContent>

        <TabsContent value="calendar">
          <HabitCalendar />
        </TabsContent>

        <TabsContent value="stats">
          <HabitStats habitStats={habitStats} />
        </TabsContent>
      </Tabs>

      {/* Subscription Required Modal */}
      <SubscriptionRequiredModal 
        isOpen={showSubscriptionModal} 
        onClose={() => setShowSubscriptionModal(false)} 
      />
    </div>
  );
};

export default HabitTracker;
