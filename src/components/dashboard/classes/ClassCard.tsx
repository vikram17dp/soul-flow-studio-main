
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, ExternalLink, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { ClassRecurrenceDisplay } from "@/components/ClassRecurrenceDisplay";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface ClassCardProps {
  instance: ClassInstance;
  isLive?: boolean;
}

export const ClassCard = ({ instance, isLive = false }: ClassCardProps) => {
  const { classes: classData } = instance;
  const { user } = useAuth();
  const { toast } = useToast();

  const handleClassJoin = async () => {
    if (!user) return;

    try {
      // Record class join and award points (only once per user per class instance)
      const { error: joinError } = await supabase
        .from('class_joins')
        .insert({
          user_id: user.id,
          class_instance_id: instance.id,
          joined_at: new Date().toISOString(),
          points_awarded: true
        });

      // If join record already exists, that's fine - user already got points
      if (joinError && !joinError.message.includes('duplicate key')) {
        console.error('Error recording class join:', joinError);
      } else if (!joinError) {
        // Only award points if this is a new join record
        try {
          const { error: pointsError } = await supabase.rpc('award_points', {
            _user_id: user.id,
            _activity_type: 'class_join',
            _reference_id: instance.id,
            _reference_type: 'class_instance',
            _description: 'Points for joining a class'
          });

          if (pointsError) {
            console.error('Error awarding points:', pointsError);
          } else {
            toast({
              title: 'Points Earned!',
              description: 'You earned 5 points for joining this class!',
            });
          }
        } catch (pointsError) {
          console.error('Error awarding points:', pointsError);
        }
      }
    } catch (error) {
      console.error('Error handling class join:', error);
    }
  };

  const handleJoinClass = async () => {
    if (classData.zoom_link && !instance.is_cancelled) {
      // Record the class join and award points
      await handleClassJoin();
      
      // Open Zoom link
      window.open(classData.zoom_link, '_blank');
    }
  };

  return (
    <Card className={`h-full transition-all duration-200 hover:shadow-md ${
      instance.is_cancelled ? 'opacity-75 border-red-200 bg-red-50' : 
      isLive ? 'border-green-500 bg-green-50' : ''
    }`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="space-y-2 flex-1">
              <h3 className={`text-lg font-semibold ${
                instance.is_cancelled ? 'text-red-800' : 'text-gray-900'
              }`}>
                {classData.title}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>with {classData.instructor_name}</span>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="flex flex-col space-y-1">
              {instance.is_cancelled ? (
                <Badge variant="destructive" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Cancelled
                </Badge>
              ) : isLive ? (
                <Badge className="bg-green-600 hover:bg-green-700 text-xs">
                  🔴 Live Now
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs">
                  {classData.class_level}
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                {classData.class_type}
              </Badge>
            </div>
          </div>

          {/* Class Details */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(instance.instance_date), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{instance.instance_time}</span>
              </div>
            </div>
            
            <div className="text-sm text-gray-600">
              Duration: {classData.duration} minutes
            </div>
          </div>

          {/* Cancellation Reason */}
          {instance.is_cancelled && instance.cancellation_reason && (
            <div className="bg-red-100 border border-red-200 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-800">Class Cancelled</p>
                  <p className="text-sm text-red-700">{instance.cancellation_reason}</p>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {classData.description && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {classData.description}
            </p>
          )}

          {/* Action Button */}
          <div className="pt-2">
            {instance.is_cancelled ? (
              <Button disabled className="w-full" variant="outline">
                Class Cancelled
              </Button>
            ) : classData.zoom_link ? (
              <Button 
                onClick={handleJoinClass}
                className={`w-full ${
                  isLive 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                {isLive ? 'Join Live Class' : 'Join Class'}
              </Button>
            ) : (
              <Button disabled className="w-full" variant="outline">
                No Link Available
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
