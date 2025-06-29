
import { useState } from 'react';
import { CancelInstanceDialog } from './CancelInstanceDialog';

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

interface ClassInstanceActionsProps {
  onCancel: (instanceId: string, reason: string) => void;
  onUncancel: (instanceId: string) => void;
  onJoinZoom: (zoomLink: string) => void;
}

export const ClassInstanceActions = ({ 
  onCancel, 
  onUncancel, 
  onJoinZoom 
}: ClassInstanceActionsProps) => {
  const [selectedInstance, setSelectedInstance] = useState<ClassInstance | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const handleCancelClick = (instance: ClassInstance) => {
    setSelectedInstance(instance);
    setShowCancelDialog(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedInstance) return;

    await onCancel(selectedInstance.id, cancellationReason);
    
    setShowCancelDialog(false);
    setCancellationReason('');
    setSelectedInstance(null);
  };

  const handleCancelDialogClose = () => {
    setShowCancelDialog(false);
    setCancellationReason('');
    setSelectedInstance(null);
  };

  const handleUncancelClick = (instance: ClassInstance) => {
    onUncancel(instance.id);
  };

  const handleJoinZoomClick = (zoomLink: string) => {
    onJoinZoom(zoomLink);
  };

  return {
    showCancelDialog,
    selectedInstance,
    cancellationReason,
    handleCancelClick,
    handleUncancelClick,
    handleJoinZoomClick,
    handleCancelConfirm,
    handleCancelDialogClose,
    setCancellationReason,
    CancelDialog: () => (
      <CancelInstanceDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        selectedInstance={selectedInstance}
        cancellationReason={cancellationReason}
        onReasonChange={setCancellationReason}
        onConfirm={handleCancelConfirm}
        onCancel={handleCancelDialogClose}
      />
    )
  };
};
