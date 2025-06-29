
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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

interface CancelInstanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInstance: ClassInstance | null;
  cancellationReason: string;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export const CancelInstanceDialog = ({
  open,
  onOpenChange,
  selectedInstance,
  cancellationReason,
  onReasonChange,
  onConfirm,
  onCancel
}: CancelInstanceDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Class Instance</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>Are you sure you want to cancel this class instance?</p>
          {selectedInstance && (
            <div className="bg-gray-50 p-3 rounded">
              <p><strong>Date:</strong> {format(new Date(selectedInstance.instance_date), 'PPP')}</p>
              <p><strong>Time:</strong> {selectedInstance.instance_time}</p>
            </div>
          )}
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Cancellation Reason (optional)
            </label>
            <Textarea
              id="reason"
              value={cancellationReason}
              onChange={(e) => onReasonChange(e.target.value)}
              placeholder="Enter reason for cancellation..."
              rows={3}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
