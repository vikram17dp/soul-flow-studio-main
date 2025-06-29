
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Clock, Heart } from 'lucide-react';

interface ClassCountdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  instanceDate: string;
  instanceTime: string;
  zoomLink: string | null;
  onJoinClass?: () => Promise<void>;
}

export const ClassCountdownModal = ({ 
  isOpen, 
  onClose, 
  instanceDate, 
  instanceTime, 
  zoomLink,
  onJoinClass 
}: ClassCountdownModalProps) => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [canJoinNow, setCanJoinNow] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const updateCountdown = () => {
      const now = new Date();
      const classDateTime = new Date(`${instanceDate}T${instanceTime}`);
      const timeDiff = classDateTime.getTime() - now.getTime();

      if (timeDiff <= 0) {
        setTimeRemaining('Class is live now!');
        setCanJoinNow(true);
        return;
      }

      const timeDiffMinutes = Math.floor(timeDiff / (1000 * 60));
      
      if (timeDiffMinutes <= 5) {
        setCanJoinNow(true);
        setTimeRemaining(`Starting in ${timeDiffMinutes} minute${timeDiffMinutes !== 1 ? 's' : ''}!`);
      } else {
        setCanJoinNow(false);
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 0) {
          setTimeRemaining(`${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`);
        } else {
          setTimeRemaining(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
        }
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isOpen, instanceDate, instanceTime]);

  const formatClassTime = () => {
    const classDateTime = new Date(`${instanceDate}T${instanceTime}`);
    return classDateTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatClassDate = () => {
    const classDateTime = new Date(`${instanceDate}T${instanceTime}`);
    return classDateTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleJoinNow = async () => {
    if (onJoinClass) {
      await onJoinClass();
    }
    
    if (zoomLink) {
      window.open(zoomLink, '_blank');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-center justify-center">
            {canJoinNow ? (
              <>
                <Heart className="h-5 w-5 text-pink-500" />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Ready to Transform! 🌟
                </span>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Get Ready to Shine! ✨
                </span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-center">
            {canJoinNow ? (
              <span className="text-green-600 font-medium">
                🎉 Your class is ready! Time to unleash your inner strength and shine bright!
              </span>
            ) : (
              <span>
                Your amazing wellness journey continues in <strong>{timeRemaining}</strong>! 
                <br />
                <span className="text-sm text-gray-600 mt-2 block">
                  We'll see you on <strong>{formatClassDate()}</strong> at <strong>{formatClassTime()}</strong>
                </span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 mt-6">
          <div className={`text-center p-4 rounded-lg ${canJoinNow ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200'}`}>
            <div className={`text-2xl font-bold mb-2 ${canJoinNow ? 'text-green-600' : 'text-purple-600'}`}>
              {timeRemaining}
            </div>
            {!canJoinNow && (
              <div className="text-sm text-gray-600">
                Class starts at {formatClassTime()} on {formatClassDate()}
              </div>
            )}
            <div className="text-xs text-gray-500 mt-2">
              {canJoinNow ? '💪 Your transformation awaits!' : '⏰ Mark your calendar and get ready to glow!'}
            </div>
          </div>
          
          <div className="flex space-x-3">
            {canJoinNow && zoomLink ? (
              <Button 
                onClick={handleJoinNow}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium"
              >
                🚀 Join Class Now!
              </Button>
            ) : canJoinNow ? (
              <Button 
                disabled
                className="flex-1 bg-gray-400 text-white cursor-not-allowed"
              >
                No Zoom Link Available
              </Button>
            ) : (
              <Button 
                onClick={onClose}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                ✨ Got it! See you there
              </Button>
            )}
            
            {!canJoinNow && (
              <Button variant="outline" onClick={onClose} className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50">
                Close
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
