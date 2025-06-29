
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Package } from './types';

interface PackageDetailsProps {
  package: Package;
}

const PackageDetails = ({ package: pkg }: PackageDetailsProps) => {
  const formatPrice = (price: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{pkg.name}</CardTitle>
        <CardDescription>{pkg.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="text-lg font-semibold text-purple-600">
              {formatPrice(pkg.price, pkg.currency || 'INR')}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Duration:</span>
            <span className="text-sm">
              {pkg.duration_months} {pkg.duration_months === 1 ? 'month' : 'months'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PackageDetails;
