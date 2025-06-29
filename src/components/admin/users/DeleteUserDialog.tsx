
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle } from 'lucide-react';
import { UserProfile } from './types';

interface DeleteUserDialogProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting: boolean;
}

const DeleteUserDialog = ({ user, isOpen, onClose, onConfirm, isDeleting }: DeleteUserDialogProps) => {
  if (!user) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <AlertDialogTitle>Delete User Account</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>
              Are you sure you want to delete <strong>{user.full_name || user.email}</strong>'s account?
            </p>
            <div className="bg-red-50 p-3 rounded-md text-sm text-red-800">
              <p className="font-medium mb-2">This action will permanently delete:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>User profile and personal information</li>
                <li>All class bookings and attendance history</li>
                <li>Points and transaction history</li>
                <li>Weight tracking data and achievements</li>
                <li>Habit tracking entries and streaks</li>
                <li>Active subscriptions</li>
              </ul>
            </div>
            <p className="text-red-600 font-medium">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete User'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
