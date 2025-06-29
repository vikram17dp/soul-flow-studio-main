
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { Search, Plus, Edit, Trash2, DollarSign, Calendar, CreditCard, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PackageForm from './PackageForm';

interface Package {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  duration_months: number;
  class_credits: number | null;
  features: string[] | null;
  is_active: boolean | null;
  is_popular: boolean | null;
  currency: string | null;
  category: string | null;
  created_at: string;
}

const AdminPackages = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchPackages();
  }, []);

  useEffect(() => {
    const filtered = packages.filter(pkg => 
      pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pkg.category && pkg.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPackages(filtered);
  }, [packages, searchTerm]);

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPackages(data || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch packages',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePackageStatus = async (packageId: string, currentStatus: boolean | null) => {
    try {
      const { error } = await supabase
        .from('packages')
        .update({ is_active: !currentStatus })
        .eq('id', packageId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Package ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
      });

      fetchPackages();
    } catch (error) {
      console.error('Error updating package status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update package status',
        variant: 'destructive'
      });
    }
  };

  const deletePackage = async (packageId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const { error } = await supabase
        .from('packages')
        .delete()
        .eq('id', packageId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Package "${name}" deleted successfully`,
      });

      fetchPackages();
    } catch (error) {
      console.error('Error deleting package:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete package',
        variant: 'destructive'
      });
    }
  };

  const formatPrice = (price: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingPackage(null);
    fetchPackages();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingPackage(null);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <PackageForm
        package={editingPackage || undefined}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Package Management</h2>
          <p className="text-gray-600">Manage membership packages and pricing for Razorpay</p>
        </div>
        <Button 
          className="bg-purple-600 hover:bg-purple-700"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Package
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>All Packages ({filteredPackages.length})</CardTitle>
              <CardDescription>Complete list of membership packages</CardDescription>
            </div>
            <div className="relative w-72">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search packages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Package</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg) => (
                <TableRow key={pkg.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{pkg.name}</span>
                        {pkg.is_popular && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {pkg.description || 'No description'}
                      </div>
                      {pkg.category && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {pkg.category}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium">
                          {formatPrice(pkg.price, pkg.currency || 'INR')}
                        </span>
                      </div>
                      {pkg.original_price && pkg.original_price > pkg.price && (
                        <div className="text-xs text-gray-500 line-through">
                          {formatPrice(pkg.original_price, pkg.currency || 'INR')}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">
                        {pkg.duration_months} {pkg.duration_months === 1 ? 'month' : 'months'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <CreditCard className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">
                        {pkg.class_credits ? `${pkg.class_credits} credits` : 'Unlimited'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-32">
                      {pkg.features && pkg.features.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {pkg.features.slice(0, 2).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature.length > 15 ? `${feature.substring(0, 15)}...` : feature}
                            </Badge>
                          ))}
                          {pkg.features.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{pkg.features.length - 2} more
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">No features</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Badge className={pkg.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {pkg.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      {pkg.is_popular && (
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Popular
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(pkg)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePackageStatus(pkg.id, pkg.is_active)}
                        className={pkg.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {pkg.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deletePackage(pkg.id, pkg.name)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPackages;
