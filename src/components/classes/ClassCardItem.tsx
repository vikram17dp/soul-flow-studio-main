
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { formatTimeInTimezone, getUserTimezone } from '@/utils/dateUtils';
import JoinClassButton from '@/components/JoinClassButton';

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

interface ClassCardItemProps {
  classItem: ClassWithInstances;
}

const getClassAttributes = (classType: string, classLevel: string) => {
  const attributes = {
    intensity: "Low",
    stretching: "Low", 
    relaxation: "Low"
  };

  if (classLevel === "Advanced") {
    attributes.intensity = "High";
  } else if (classLevel === "Intermediate") {
    attributes.intensity = "Medium";
  }

  return attributes;
};

export const ClassCardItem = ({ classItem }: ClassCardItemProps) => {
  // Get next upcoming instance that's not cancelled and is in the future
  const now = new Date();
  const nextInstance = classItem.instances
    .filter(instance => {
      if (instance.is_cancelled) return false;
      const instanceDateTime = new Date(`${instance.instance_date}T${instance.instance_time}`);
      return instanceDateTime > now;
    })
    .sort((a, b) => {
      const dateA = new Date(`${a.instance_date}T${a.instance_time}`);
      const dateB = new Date(`${b.instance_date}T${b.instance_time}`);
      return dateA.getTime() - dateB.getTime();
    })[0];
  
  if (!nextInstance) {
    return null;
  }

  const attributes = getClassAttributes(classItem.class_type, classItem.class_level);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row">
        {/* Class Image */}
        <div className="w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
          <img 
            src={classItem.featured_image_url || classItem.image_url || '/placeholder.svg'} 
            alt={classItem.title}
            className="w-full h-full object-cover rounded-t-xl sm:rounded-l-xl sm:rounded-t-none"
          />
        </div>
        
        {/* Class Info */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 space-y-3 sm:space-y-0">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 line-clamp-2">
                {classItem.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-2">
                with {classItem.instructor_name}
              </p>
              
              <div className="flex items-center gap-2 mb-3">
                <Badge 
                  variant="outline" 
                  className="bg-orange-50 text-orange-700 border-orange-200 text-xs"
                >
                  📊 {classItem.class_level}
                </Badge>
              </div>
            </div>
            
            {/* Join Button - Full width on mobile */}
            <div className="w-full sm:w-auto">
              <JoinClassButton
                classId={classItem.id}
                instanceId={nextInstance.id}
                instanceDate={nextInstance.instance_date}
                instanceTime={nextInstance.instance_time}
                zoomLink={classItem.zoom_link}
                className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors text-sm sm:text-base"
              />
            </div>
          </div>

          {/* Class Time */}
          <div className="flex items-center gap-4 sm:gap-6 mb-4">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatTimeInTimezone(nextInstance.instance_time, classItem.timezone)}
              </div>
              <div className="text-xs sm:text-sm text-gray-500">
                {classItem.duration} minute class
              </div>
            </div>
          </div>

          {/* Class Attributes - Responsive grid */}
          <div className="flex flex-wrap gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-xs sm:text-sm">Intensity</span>
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                {attributes.intensity}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-xs sm:text-sm">Stretching</span>
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                {attributes.stretching}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-gray-600 text-xs sm:text-sm">Relaxation</span>
              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                {attributes.relaxation}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
