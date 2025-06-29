
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SubscriptionRequiredModal } from './SubscriptionRequiredModal';
import { ClassCountdownModal } from './ClassCountdownModal';

interface JoinClassButtonProps {
  classId: string;
  instanceId: string;
  instanceDate: string;
  instanceTime: string;
  zoomLink: string | null;
  className?: string;
}

const JoinClassButton = ({ 
  classId, 
  instanceId, 
  instanceDate, 
  instanceTime, 
  zoomLink,
  className = ""
}: JoinClassButtonProps) => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClassJoin = async () => {
    if (!user) return;

    try {
      // Record class join and award points (only once per user per class instance)
      const { error: joinError } = await supabase
        .from('class_joins')
        .insert({
          user_id: user.id,
          class_instance_id: instanceId,
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
            _reference_id: instanceId,
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
    if (!user) {
      setShowSubscriptionModal(true);
      return;
    }

    setIsLoading(true);
    
    try {
      // Check user's membership type directly from profile
      const userMembershipType = profile?.membership_type || 'basic';
      
      console.log('User membership type:', userMembershipType);
      
      // If user has basic membership, show subscription modal
      if (userMembershipType === 'basic') {
        setShowSubscriptionModal(true);
        setIsLoading(false);
        return;
      }

      // Calculate time difference
      const now = new Date();
      const classDateTime = new Date(`${instanceDate}T${instanceTime}`);
      const timeDiffMinutes = Math.floor((classDateTime.getTime() - now.getTime()) / (1000 * 60));

      console.log('Class time check:', { now, classDateTime, timeDiffMinutes });

      if (timeDiffMinutes <= 5) {
        // Record the class join and award points
        await handleClassJoin();
        
        // Class is live or starting soon - redirect to Zoom
        if (zoomLink) {
          window.open(zoomLink, '_blank');
        } else {
          toast({
            title: 'No Zoom Link',
            description: 'This class does not have a Zoom link configured.',
            variant: 'destructive'
          });
        }
      } else if (timeDiffMinutes > 5) {
        // Show countdown modal
        setShowCountdownModal(true);
      }

    } catch (error) {
      console.error('Error checking membership:', error);
      toast({
        title: 'Error',
        description: 'Failed to check membership status',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button 
        onClick={handleJoinClass}
        disabled={isLoading}
        className={`${className} bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700`}
      >
        {isLoading ? 'Checking...' : 'Join Class'}
      </Button>

      <SubscriptionRequiredModal 
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
      />

      <ClassCountdownModal
        isOpen={showCountdownModal}
        onClose={() => setShowCountdownModal(false)}
        instanceDate={instanceDate}
        instanceTime={instanceTime}
        zoomLink={zoomLink}
        onJoinClass={handleClassJoin}
      />
    </>
  );
};

export default JoinClassButton;
