
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserPlus } from 'lucide-react';
import { useUserManagement } from './users/useUserManagement';
import UserSearch from './users/UserSearch';
import UserRow from './users/UserRow';
import UserListLoading from './users/UserListLoading';
import AddUserModal from './users/AddUserModal';
import EditUserModal from './users/EditUserModal';
import { UserProfile } from './users/types';

const AdminUsers = () => {
  const {
    filteredUsers,
    searchTerm,
    setSearchTerm,
    isLoading,
    makeAdmin,
    removeAdmin,
    deleteUser,
    fetchUsers
  } = useUserManagement();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const handleEditUser = (user: UserProfile) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUserAdded = () => {
    fetchUsers();
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  if (isLoading) {
    return <UserListLoading />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setIsAddModalOpen(true)}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Users ({filteredUsers.length})</CardTitle>
              <CardDescription>Complete list of registered users</CardDescription>
            </div>
            <UserSearch searchTerm={searchTerm} onSearchChange={setSearchTerm} />
          </div>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? 'No users found matching your search.' : 'No users found.'}
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Membership</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <UserRow
                    key={user.id}
                    user={user}
                    onMakeAdmin={makeAdmin}
                    onRemoveAdmin={removeAdmin}
                    onDeleteUser={deleteUser}
                    onEditUser={handleEditUser}
                  />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onUserAdded={handleUserAdded}
      />

      {selectedUser && (
        <EditUserModal
          user={selectedUser}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleUserUpdated}
        />
      )}
    </div>
  );
};

export default AdminUsers;
