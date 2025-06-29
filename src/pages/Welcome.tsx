import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useWeightTracking } from '@/hooks/useWeightTracking';
import { useHabits } from '@/hooks/useHabits';
import { useUpcomingClasses } from '@/hooks/useUpcomingClasses';
import Navigation from '@/components/Navigation';
import WelcomeHeader from '@/components/welcome/WelcomeHeader';
import MembershipStats from '@/components/welcome/MembershipStats';
import LeaderboardPreview from '@/components/welcome/LeaderboardPreview';
import CompactWeightTracker from '@/components/welcome/CompactWeightTracker';
import CompactHabitTracker from '@/components/welcome/CompactHabitTracker';
import ClassesCarousel from '@/components/welcome/ClassesCarousel';
import MotivationalFooter from '@/components/welcome/MotivationalFooter';
import CompactPointsDisplay from '@/components/points/CompactPointsDisplay';

const Welcome = () => {
  const { user, profile } = useAuth();
  const { leaderboardData, isLoading: isLeaderboardLoading } = useLeaderboard('overall', 30);
  const { weightEntries, weightGoal, achievements } = useWeightTracking();
  const { dailyHabits, completedToday, totalHabits, dailyProgress, allHabitsCompleted, toggleHabit } = useHabits();
  const { classInstances } = useUpcomingClasses();

  // Get current user's position in leaderboard
  const userPosition = leaderboardData.findIndex(entry => entry.user_id === user?.id) + 1;
  const topThree = leaderboardData.slice(0, 3);

  // Filter classes to show only future classes from current time
  const now = new Date();
  const futureClasses = classInstances.filter(classInstance => {
    const classDateTime = new Date(`${classInstance.instance_date}T${classInstance.instance_time}`);
    return classDateTime > now;
  });

  const handleHabitToggle = (habitId: string, completed: boolean) => {
    toggleHabit(habitId, completed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <Navigation />
      
      {/* Points Display */}
      <div className="container mx-auto px-4 pt-4">
        <div className="flex justify-end">
          <CompactPointsDisplay />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        <WelcomeHeader userName={profile?.full_name || 'Friend'} />

        <MembershipStats 
          membershipType={profile?.membership_type || 'Basic'}
          achievementsCount={achievements.length}
          userPosition={userPosition}
        />

        <LeaderboardPreview 
          topThree={topThree}
          isLoading={isLeaderboardLoading}
        />

        <CompactWeightTracker 
          weightGoal={weightGoal}
          weightEntries={weightEntries}
        />

        <CompactHabitTracker 
          dailyHabits={dailyHabits}
          completedToday={completedToday}
          totalHabits={totalHabits}
          dailyProgress={dailyProgress}
          allHabitsCompleted={allHabitsCompleted}
          onToggleHabit={handleHabitToggle}
        />

        <ClassesCarousel upcomingClasses={futureClasses} />

        <MotivationalFooter />
      </div>
    </div>
  );
};

export default Welcome;
