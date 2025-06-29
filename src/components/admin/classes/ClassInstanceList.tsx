
import { ClassInstanceItem } from './ClassInstanceItem';

interface ClassInstance {
  id: string;
  class_id: string;
  instance_date: string;
  instance_time: string;
  is_cancelled: boolean;
  cancelled_at: string | null;
  cancelled_by: string | null;
  cancellation_reason: string | null;
  created_at: string;
  updated_at: string;
  classes: {
    title: string;
    instructor_name: string;
    duration: number;
    zoom_link: string | null;
  };
}

interface ClassInstanceListProps {
  instances: ClassInstance[];
  onCancel: (instance: ClassInstance) => void;
  onUncancel: (instance: ClassInstance) => void;
  onJoinZoom: (zoomLink: string) => void;
}

export const ClassInstanceList = ({ instances, onCancel, onUncancel, onJoinZoom }: ClassInstanceListProps) => {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        Found {instances.length} class instances
      </div>
      {instances.map((instance) => (
        <ClassInstanceItem
          key={instance.id}
          instance={instance}
          onCancel={onCancel}
          onUncancel={onUncancel}
          onJoinZoom={onJoinZoom}
        />
      ))}
    </div>
  );
};
