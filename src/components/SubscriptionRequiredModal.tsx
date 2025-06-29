
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SubscriptionRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SubscriptionRequiredModal = ({ isOpen, onClose }: SubscriptionRequiredModalProps) => {
  const navigate = useNavigate();

  const handleGetPlan = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">🌟 Premium Feature Required</DialogTitle>
          <DialogDescription className="text-center space-y-3">
                {/* <div className="text-base">
              Hey there! 👋 Weight tracking is a premium feature designed to help you achieve your fitness goals.
            </div> */}
            <div className="text-sm text-gray-600">
              🎯 Track your progress<br/>
              📊 View detailed analytics<br/>
              🏆 Earn achievement badges<br/>
              📈 Compare with community leaderboard
            </div>
            <div className="text-sm font-medium text-purple-600">
              Unlock this feature with any of our membership plans! 💪
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col space-y-4 mt-6">
          <Button onClick={handleGetPlan} className="bg-purple-600 hover:bg-purple-700">
            🚀 View Pricing Plans
          </Button>
          <Button variant="outline" onClick={onClose}>
            Maybe Later 😊
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
