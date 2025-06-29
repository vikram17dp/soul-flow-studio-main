
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Mail, Crown, Shield, Phone } from 'lucide-react';
import { UserProfile } from './types';
import UserManagementActions from './UserManagementActions';

interface UserRowProps {
  user: UserProfile;
  onMakeAdmin: (userId: string, email: string) => void;
  onRemoveAdmin: (userId: string, email: string) => void;
  onDeleteUser: (userId: string, email: string) => void;
  onEditUser: (user: UserProfile) => void;
}

const getMembershipColor = (type: string | null) => {
  switch (type) {
    case 'premium': return 'bg-purple-100 text-purple-800';
    case 'unlimited': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const UserRow = ({ user, onMakeAdmin, onRemoveAdmin, onDeleteUser, onEditUser }: UserRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-purple-600 font-medium text-sm">
              {user.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {user.full_name || 'No name set'}
            </div>
            <div className="text-sm text-gray-500">
              ID: {user.id.slice(0, 8)}...
            </div>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Mail className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{user.email || 'No email'}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2">
          <Phone className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">{user.phone || 'No phone'}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getMembershipColor(user.membership_type)}>
          {user.membership_type?.charAt(0).toUpperCase() + user.membership_type?.slice(1) || 'Basic'}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex space-x-1">
          {user.roles?.map((role) => (
            <Badge key={role} variant="outline" className="text-xs">
              {role === 'admin' ? <Crown className="h-3 w-3 mr-1" /> : <Shield className="h-3 w-3 mr-1" />}
              {role}
            </Badge>
          ))}
          {(!user.roles || user.roles.length === 0) && (
            <Badge variant="outline" className="text-xs">user</Badge>
          )}
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm text-gray-600">
          {user.join_date ? new Date(user.join_date).toLocaleDateString() : 'N/A'}
        </span>
      </TableCell>
      <TableCell>
        <UserManagementActions
          user={user}
          onMakeAdmin={onMakeAdmin}
          onRemoveAdmin={onRemoveAdmin}
          onDeleteUser={onDeleteUser}
          onEditUser={onEditUser}
        />
      </TableCell>
    </TableRow>
  );
};

export default UserRow;
