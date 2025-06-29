
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';

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

interface ClassInstanceItemProps {
  instance: ClassInstance;
  onCancel: (instance: ClassInstance) => void;
  onUncancel: (instance: ClassInstance) => void;
  onJoinZoom: (zoomLink: string) => void;
}

export const ClassInstanceItem = ({ instance, onCancel, onUncancel, onJoinZoom }: ClassInstanceItemProps) => {
  return (
    <div
      className={`border rounded-lg p-4 ${
        instance.is_cancelled ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium">
                {format(new Date(instance.instance_date), 'PPP')}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{instance.instance_time}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{instance.classes.duration} min</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant={instance.is_cancelled ? 'destructive' : 'default'}>
              {instance.is_cancelled ? 'Cancelled' : 'Active'}
            </Badge>
            {instance.classes.zoom_link && !instance.is_cancelled && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onJoinZoom(instance.classes.zoom_link!)}
                className="flex items-center space-x-1"
              >
                <ExternalLink className="h-3 w-3" />
                <span>Join Now</span>
              </Button>
            )}
          </div>

          {instance.is_cancelled && instance.cancellation_reason && (
            <div className="text-sm text-gray-600">
              <strong>Reason:</strong> {instance.cancellation_reason}
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          {instance.is_cancelled ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUncancel(instance)}
            >
              Restore
            </Button>
          ) : (
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onCancel(instance)}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
