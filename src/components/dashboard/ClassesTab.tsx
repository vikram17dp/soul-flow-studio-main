
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useUpcomingClasses } from '@/hooks/useUpcomingClasses';
import { ClassSection } from './classes/ClassSection';
import { LoadingState } from './classes/LoadingState';
import { EmptyState } from './classes/EmptyState';

const ClassesTab = () => {
  const [visibleClasses, setVisibleClasses] = useState(12);
  const { classInstances, isLoading, getClassesForDate } = useUpcomingClasses();

  const loadMoreClasses = () => {
    setVisibleClasses(prev => prev + 12);
  };

  const isClassLive = (instanceDate: string, instanceTime: string) => {
    const now = new Date();
    const classDateTime = new Date(`${instanceDate}T${instanceTime}`);
    const timeDiffMinutes = Math.floor((classDateTime.getTime() - now.getTime()) / (1000 * 60));
    return timeDiffMinutes <= 5 && timeDiffMinutes >= -60;
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const todayClasses = getClassesForDate('Today');
  const tomorrowClasses = getClassesForDate('Tomorrow');
  const allUpcomingClasses = [...todayClasses, ...tomorrowClasses];

  if (allUpcomingClasses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Classes</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join our expertly crafted yoga sessions designed to elevate your practice and nurture your well-being.
          </p>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upcoming Classes</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Join our expertly crafted yoga sessions designed to elevate your practice and nurture your well-being.
        </p>
      </div>

      <ClassSection
        title="Today's Classes"
        classes={todayClasses}
        visibleCount={visibleClasses}
        isClassLive={isClassLive}
      />

      <ClassSection
        title="Tomorrow's Classes"
        classes={tomorrowClasses}
        visibleCount={Math.max(0, visibleClasses - todayClasses.length)}
        isClassLive={isClassLive}
      />

      {visibleClasses < allUpcomingClasses.length && (
        <div className="text-center">
          <Button 
            onClick={loadMoreClasses}
            variant="outline"
            className="border-purple-600 text-purple-600 hover:bg-purple-50"
          >
            Load More Classes
          </Button>
        </div>
      )}
    </div>
  );
};

export default ClassesTab;
