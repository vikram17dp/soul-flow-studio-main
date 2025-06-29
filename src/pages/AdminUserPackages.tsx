
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Plus,
  ArrowLeft,
  Calendar,
  User,
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Heart
} from 'lucide-react';

interface UserSubscription {
  id: string;
  user_id: string;
  package_id: string;
  status: string;
  starts_at: string;
  expires_at: string;
  credits_remaining: number | null;
  created_at: string;
  user_profile: {
    full_name: string;
    email: string;
  } | null;
  package_details: {
    name: string;
    price: number;
    duration_months: number;
    class_credits: number | null;
  } | null;
}

interface PackageOption {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  class_credits: number | null;
}

const AdminUserPackages = () => {
  const { isAdmin, isLoading } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<UserSubscription[]>([]);
  const [packages, setPackages] = useState<PackageOption[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dataLoading, setDataLoading] = useState(true);
  
  // Edit/Add subscription state
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<UserSubscription | null>(null);
  const [editForm, setEditForm] = useState({
    package_id: '',
    expires_at: '',
    credits_remaining: '',
    status: 'active'
  });

  useEffect(() => {
    if (isAdmin) {
      fetchSubscriptions();
      fetchPackages();
    }
  }, [isAdmin]);

  useEffect(() => {
    let filtered = subscriptions;

    if (searchTerm) {
      filtered = filtered.filter(sub => 
        sub.user_profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.user_profile?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.package_details?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'expired') {
        filtered = filtered.filter(sub => new Date(sub.expires_at) < new Date());
      } else {
        filtered = filtered.filter(sub => sub.status === statusFilter);
      }
    }

    setFilteredSubscriptions(filtered);
  }, [subscriptions, searchTerm, statusFilter]);

  const fetchSubscriptions = async () => {
    try {
      // First get subscriptions with package details
      const { data: subscriptionsData, error: subscriptionsError } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          packages(name, price, duration_months, class_credits)
        `)
        .order('created_at', { ascending: false });

      if (subscriptionsError) throw subscriptionsError;

      // Then get user profiles separately
      const userIds = subscriptionsData?.map(sub => sub.user_id) || [];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Combine the data
      const combinedData = subscriptionsData?.map(subscription => ({
        ...subscription,
        user_profile: profilesData?.find(profile => profile.id === subscription.user_id) || null,
        package_details: subscription.packages
      })) || [];

      setSubscriptions(combinedData);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user subscriptions',
        variant: 'destructive'
      });
    } finally {
      setDataLoading(false);
    }
  };

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('id, name, price, duration_months, class_credits')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    }
  };

  const handleEditSubscription = (subscription: UserSubscription) => {
    setEditingSubscription(subscription);
    setEditForm({
      package_id: subscription.package_id,
      expires_at: subscription.expires_at.split('T')[0],
      credits_remaining: subscription.credits_remaining?.toString() || '',
      status: subscription.status
    });
    setShowEditDialog(true);
  };

  const handleSaveSubscription = async () => {
    if (!editingSubscription) return;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          package_id: editForm.package_id,
          expires_at: new Date(editForm.expires_at).toISOString(),
          credits_remaining: editForm.credits_remaining ? parseInt(editForm.credits_remaining) : null,
          status: editForm.status
        })
        .eq('id', editingSubscription.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Subscription updated successfully',
      });

      setShowEditDialog(false);
      setEditingSubscription(null);
      fetchSubscriptions();
    } catch (error) {
      console.error('Error updating subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to update subscription',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete the subscription for ${userName}?`)) return;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .delete()
        .eq('id', subscriptionId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Subscription deleted successfully',
      });

      fetchSubscriptions();
    } catch (error) {
      console.error('Error deleting subscription:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete subscription',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadge = (subscription: UserSubscription) => {
    const isExpired = new Date(subscription.expires_at) < new Date();
    
    if (isExpired) {
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Expired</Badge>;
    }
    
    if (subscription.status === 'active') {
      return <Badge variant="default" className="flex items-center gap-1 bg-green-100 text-green-800"><CheckCircle className="h-3 w-3" />Active</Badge>;
    }
    
    return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />{subscription.status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="h-12 w-12 text-purple-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Checking your permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have admin privileges to access this page.</p>
          <Button onClick={() => navigate('/admin')} className="bg-purple-600 hover:bg-purple-700">
            Go Back to Admin
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/admin')}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Admin</span>
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <Package className="h-6 w-6 text-purple-600" />
                <h1 className="text-xl font-bold text-gray-900">User Packages</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by user name, email, or package..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Subscriptions Table */}
          <Card>
            <CardHeader>
              <CardTitle>User Subscriptions ({filteredSubscriptions.length})</CardTitle>
              <CardDescription>
                Manage all user subscriptions and packages
              </CardDescription>
            </CardHeader>
            <CardContent>
              {dataLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Credits</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.map((subscription) => (
                      <TableRow key={subscription.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-gray-500" />
                            <div>
                              <div className="font-medium">{subscription.user_profile?.full_name || 'Unknown User'}</div>
                              <div className="text-sm text-gray-500">{subscription.user_profile?.email || 'No email'}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{subscription.package_details?.name || 'Unknown Package'}</div>
                            <div className="text-sm text-gray-500">
                              ₹{subscription.package_details?.price || 0} • {subscription.package_details?.duration_months || 0} months
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(subscription)}
                        </TableCell>
                        <TableCell>
                          {subscription.credits_remaining !== null ? (
                            <span className="text-sm">{subscription.credits_remaining} left</span>
                          ) : (
                            <span className="text-sm text-gray-500">Unlimited</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{formatDate(subscription.starts_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{formatDate(subscription.expires_at)}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditSubscription(subscription)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteSubscription(subscription.id, subscription.user_profile?.full_name || 'Unknown User')}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Subscription Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Subscription</DialogTitle>
            <DialogDescription>
              Update subscription details for {editingSubscription?.user_profile?.full_name || 'Unknown User'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Package</Label>
              <Select value={editForm.package_id} onValueChange={(value) => setEditForm({...editForm, package_id: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name} - ₹{pkg.price} ({pkg.duration_months} months)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Expires At</Label>
              <Input
                type="date"
                value={editForm.expires_at}
                onChange={(e) => setEditForm({...editForm, expires_at: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Credits Remaining</Label>
              <Input
                type="number"
                placeholder="Leave empty for unlimited"
                value={editForm.credits_remaining}
                onChange={(e) => setEditForm({...editForm, credits_remaining: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSaveSubscription} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUserPackages;
