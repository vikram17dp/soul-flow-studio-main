
import { Card, CardContent } from '@/components/ui/card';
import { ClassInstanceHeader } from './classes/ClassInstanceHeader';
import { ClassInstanceList } from './classes/ClassInstanceList';
import { EmptyInstancesState } from './classes/EmptyInstancesState';
import { ClassInstanceLoadingState } from './classes/ClassInstanceLoadingState';
import { ClassInstanceActions } from './classes/ClassInstanceActions';
import { useClassInstanceManagement } from './classes/useClassInstanceManagement';

interface ClassInstanceManagerProps {
  classId: string;
  className: string;
}

const ClassInstanceManager = ({ classId, className }: ClassInstanceManagerProps) => {
  const {
    instances,
    isLoading,
    fetchInstances,
    generateMoreInstances,
    cancelInstance,
    uncancelInstance
  } = useClassInstanceManagement(classId);

  const {
    handleCancelClick,
    handleUncancelClick,
    handleJoinZoomClick,
    CancelDialog
  } = ClassInstanceActions({
    onCancel: cancelInstance,
    onUncancel: uncancelInstance,
    onJoinZoom: (zoomLink: string) => {
      if (zoomLink) {
        window.open(zoomLink, '_blank');
      }
    }
  });

  if (isLoading) {
    return <ClassInstanceLoadingState />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <ClassInstanceHeader
          className={className}
          onRefresh={fetchInstances}
          onGenerateMore={generateMoreInstances}
        />
        <CardContent>
          {instances.length === 0 ? (
            <EmptyInstancesState onGenerateInstances={generateMoreInstances} />
          ) : (
            <ClassInstanceList
              instances={instances}
              onCancel={handleCancelClick}
              onUncancel={handleUncancelClick}
              onJoinZoom={handleJoinZoomClick}
            />
          )}
        </CardContent>
      </Card>

      <CancelDialog />
    </div>
  );
};

export default ClassInstanceManager;
