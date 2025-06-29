
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Trash2, Edit } from 'lucide-react';
import { UserProfile } from './types';
import DeleteUserDialog from './DeleteUserDialog';

interface UserManagementActionsProps {
  user: UserProfile;
  onMakeAdmin: (userId: string, email: string) => void;
  onRemoveAdmin: (userId: string, email: string) => void;
  onDeleteUser: (userId: string, email: string) => void;
  onEditUser: (user: UserProfile) => void;
}

const UserManagementActions = ({ 
  user, 
  onMakeAdmin, 
  onRemoveAdmin, 
  onDeleteUser,
  onEditUser 
}: UserManagementActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const isAdmin = user.roles?.includes('admin');

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDeleteUser(user.id, user.email || '');
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEditUser(user)}
          className="text-blue-600 hover:text-blue-700"
        >
          <Edit className="h-3 w-3 mr-1" />
          Edit
        </Button>
        
        {isAdmin ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemoveAdmin(user.id, user.email || '')}
            className="text-orange-600 hover:text-orange-700"
          >
            <Crown className="h-3 w-3 mr-1" />
            Remove Admin
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMakeAdmin(user.id, user.email || '')}
            className="text-purple-600 hover:text-purple-700"
          >
            <Shield className="h-3 w-3 mr-1" />
            Make Admin
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDeleteClick}
          className="text-red-600 hover:text-red-700"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete
        </Button>
      </div>

      <DeleteUserDialog
        user={user}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
};

export default UserManagementActions;
