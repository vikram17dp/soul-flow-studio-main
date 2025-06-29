
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

interface EmptyInstancesStateProps {
  onGenerateInstances: () => void;
}

export const EmptyInstancesState = ({ onGenerateInstances }: EmptyInstancesStateProps) => {
  return (
    <div className="text-center py-8">
      <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No Class Instances Found</h3>
      <p className="text-gray-500 mb-4">
        This class doesn't have any scheduled instances yet.
      </p>
      <Button onClick={onGenerateInstances} className="bg-purple-600 hover:bg-purple-700">
        Generate Instances
      </Button>
    </div>
  );
};
