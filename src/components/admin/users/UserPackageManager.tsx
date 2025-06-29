
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Package, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from './types';

interface Package {
  id: string;
  name: string;
  price: number;
  duration_months: number;
  class_credits: number | null;
  is_active: boolean;
}

interface UserPackageManagerProps {
  user: UserProfile;
  onUpdate: () => void;
}

const UserPackageManager = ({ user, onUpdate }: UserPackageManagerProps) => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [customExpiry, setCustomExpiry] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const { toast } = useToast();

  const fetchPackages = async () => {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('id, name, price, duration_months, class_credits, is_active')
        .eq('is_active', true)
        .order('price');

      if (error) throw error;
      setPackages(data || []);
      setShowPackages(true);
    } catch (error) {
      console.error('Error fetching packages:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch packages',
        variant: 'destructive'
      });
    }
  };

  const assignPackage = async () => {
    if (!selectedPackage) {
      toast({
        title: 'Error',
        description: 'Please select a package',
        variant: 'destructive'
      });
      return;
    }

    setIsLoading(true);
    try {
      const selectedPkg = packages.find(p => p.id === selectedPackage);
      if (!selectedPkg) throw new Error('Package not found');

      // Calculate expiry date
      const startDate = new Date();
      const expiryDate = customExpiry 
        ? new Date(customExpiry)
        : new Date(startDate.getTime() + (selectedPkg.duration_months * 30 * 24 * 60 * 60 * 1000));

      // Create subscription
      const { error } = await supabase
        .from('user_subscriptions')
        .insert({
          user_id: user.id,
          package_id: selectedPackage,
          starts_at: startDate.toISOString(),
          expires_at: expiryDate.toISOString(),
          credits_remaining: selectedPkg.class_credits,
          status: 'active'
        });

      if (error) throw error;

      // Update user membership type
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ membership_type: 'premium' })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: 'Success',
        description: `Package "${selectedPkg.name}" assigned to ${user.full_name}`,
      });

      setSelectedPackage('');
      setCustomExpiry('');
      onUpdate();
    } catch (error: any) {
      console.error('Error assigning package:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to assign package',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!showPackages) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Package Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchPackages} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Assign Package
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Package className="h-5 w-5" />
          <span>Assign Package to {user.full_name}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Package</Label>
          <Select value={selectedPackage} onValueChange={setSelectedPackage}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a package" />
            </SelectTrigger>
            <SelectContent>
              {packages.map((pkg) => (
                <SelectItem key={pkg.id} value={pkg.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{pkg.name}</span>
                    <Badge variant="outline">₹{pkg.price}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPackage && (
          <div className="p-3 bg-gray-50 rounded-lg">
            {(() => {
              const pkg = packages.find(p => p.id === selectedPackage);
              return pkg ? (
                <div className="space-y-1">
                  <p className="font-medium">{pkg.name}</p>
                  <p className="text-sm text-gray-600">
                    Duration: {pkg.duration_months} months
                  </p>
                  <p className="text-sm text-gray-600">
                    Credits: {pkg.class_credits ? `${pkg.class_credits} classes` : 'Unlimited'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Price: ₹{pkg.price}
                  </p>
                </div>
              ) : null;
            })()}
          </div>
        )}

        <div className="space-y-2">
          <Label>Custom Expiry Date (Optional)</Label>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <Input
              type="date"
              value={customExpiry}
              onChange={(e) => setCustomExpiry(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          <p className="text-xs text-gray-500">
            Leave empty to use package default duration
          </p>
        </div>

        <div className="flex space-x-2">
          <Button 
            onClick={assignPackage} 
            disabled={isLoading || !selectedPackage}
            className="flex-1"
          >
            {isLoading ? 'Assigning...' : 'Assign Package'}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowPackages(false)}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserPackageManager;
