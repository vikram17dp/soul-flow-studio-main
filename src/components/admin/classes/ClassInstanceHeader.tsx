
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, RefreshCw } from 'lucide-react';

interface ClassInstanceHeaderProps {
  className: string;
  onRefresh: () => void;
  onGenerateMore: () => void;
}

export const ClassInstanceHeader = ({ className, onRefresh, onGenerateMore }: ClassInstanceHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Class Instances for "{className}"</span>
          </CardTitle>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            className="flex items-center space-x-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button
            onClick={onGenerateMore}
            size="sm"
            className="flex items-center space-x-1"
          >
            <Calendar className="h-4 w-4" />
            <span>Generate More</span>
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};
