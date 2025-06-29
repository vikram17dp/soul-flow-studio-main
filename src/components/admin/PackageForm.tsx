import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Package {
  id?: string;
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
}

interface PackageFormProps {
  package?: Package;
  onSuccess: () => void;
  onCancel: () => void;
}

const PackageForm = ({ package: editPackage, onSuccess, onCancel }: PackageFormProps) => {
  const [formData, setFormData] = useState<Package>({
    name: editPackage?.name || '',
    description: editPackage?.description || '',
    price: editPackage?.price || 0,
    original_price: editPackage?.original_price || null,
    duration_months: editPackage?.duration_months || 1,
    class_credits: editPackage?.class_credits || null,
    features: editPackage?.features || [],
    is_active: editPackage?.is_active ?? true,
    is_popular: editPackage?.is_popular ?? false,
    currency: editPackage?.currency || 'INR',
    category: editPackage?.category || 'premium',
  });

  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: keyof Package, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = formData.features || [];
      setFormData(prev => ({
        ...prev,
        features: [...currentFeatures, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = formData.features || [];
    setFormData(prev => ({
      ...prev,
      features: currentFeatures.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const packageData = {
        ...formData,
        price: Number(formData.price),
        original_price: formData.original_price ? Number(formData.original_price) : null,
        duration_months: Number(formData.duration_months),
        class_credits: formData.class_credits ? Number(formData.class_credits) : null,
      };

      if (editPackage?.id) {
        const { error } = await supabase
          .from('packages')
          .update(packageData)
          .eq('id', editPackage.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Package updated successfully',
        });
      } else {
        const { error } = await supabase
          .from('packages')
          .insert([packageData]);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Package created successfully',
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving package:', error);
      toast({
        title: 'Error',
        description: 'Failed to save package',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{editPackage ? 'Edit Package' : 'Create New Package'}</CardTitle>
        <CardDescription>
          {editPackage ? 'Update package details' : 'Create a new membership package'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Basic Plan"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category || 'premium'} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what's included in this package"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="original_price">Original Price (INR)</Label>
              <Input
                id="original_price"
                type="number"
                value={formData.original_price || ''}
                onChange={(e) => handleInputChange('original_price', e.target.value || null)}
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration_months">Duration (Months) *</Label>
              <Input
                id="duration_months"
                type="number"
                value={formData.duration_months}
                onChange={(e) => handleInputChange('duration_months', e.target.value)}
                placeholder="1"
                min="1"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="class_credits">Class Credits (leave empty for unlimited)</Label>
            <Input
              id="class_credits"
              type="number"
              value={formData.class_credits || ''}
              onChange={(e) => handleInputChange('class_credits', e.target.value || null)}
              placeholder="e.g., 10"
              min="0"
            />
          </div>

          <div className="space-y-4">
            <Label>Package Features</Label>
            <div className="flex space-x-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add a feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.features || []).map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                  <span>{feature}</span>
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeFeature(index)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active || false}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_popular"
                checked={formData.is_popular || false}
                onCheckedChange={(checked) => handleInputChange('is_popular', checked)}
              />
              <Label htmlFor="is_popular">Mark as Popular</Label>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? 'Saving...' : (editPackage ? 'Update Package' : 'Create Package')}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PackageForm;
