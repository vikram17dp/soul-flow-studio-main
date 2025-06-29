
import { Calendar } from "lucide-react";
import { ClassCard } from './ClassCard';

interface ClassInstance {
  id: string;
  instance_date: string;
  instance_time: string;
  is_cancelled: boolean;
  cancellation_reason: string | null;
  classes: {
    id: string;
    title: string;
    instructor_name: string;
    duration: number;
    class_type: string;
    class_level: string;
    description: string | null;
    timezone: string;
    image_url: string | null;
    featured_image_url: string | null;
    zoom_link: string | null;
  };
}

interface ClassSectionProps {
  title: string;
  classes: ClassInstance[];
  visibleCount: number;
  isClassLive: (instanceDate: string, instanceTime: string) => boolean;
}

export const ClassSection = ({ title, classes, visibleCount, isClassLive }: ClassSectionProps) => {
  if (classes.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
        <Calendar className="h-5 w-5 mr-2 text-purple-600" />
        {title}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.slice(0, visibleCount).map((instance) => (
          <ClassCard 
            key={instance.id} 
            instance={instance} 
            isLive={isClassLive(instance.instance_date, instance.instance_time)}
          />
        ))}
      </div>
    </div>
  );
};
