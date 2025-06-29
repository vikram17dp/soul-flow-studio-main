
import { ClassCardItem } from './ClassCardItem';

interface ClassInstance {
  id: string;
  instance_date: string;
  instance_time: string;
  is_cancelled: boolean;
  cancellation_reason: string | null;
}

interface ClassWithInstances {
  id: string;
  title: string;
  instructor_name: string;
  duration: number;
  class_type: string;
  class_level: string;
  description: string | null;
  timezone: string;
  featured_image_url: string | null;
  image_url: string | null;
  price: number | null;
  recurrence_type: string | null;
  recurrence_days: string[] | null;
  zoom_link: string | null;
  instances: ClassInstance[];
  tags: {
    id: string;
    name: string;
    color: string;
  }[];
}

interface ClassesGridProps {
  filteredClasses: ClassWithInstances[];
}

export const ClassesGrid = ({ filteredClasses }: ClassesGridProps) => {
  return (
    <section className="py-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredClasses.length > 0 ? (
          <div className="space-y-4 sm:space-y-6">
            {filteredClasses.map((classItem) => (
              <ClassCardItem key={classItem.id} classItem={classItem} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4">🧘‍♀️</div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No classes found</h3>
            <p className="text-sm sm:text-base text-gray-500 px-4">
              Try adjusting your filters to see more classes.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};
