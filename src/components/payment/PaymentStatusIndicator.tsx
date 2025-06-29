
import { CheckCircle, AlertCircle } from 'lucide-react';
import { PaymentStatus } from './types';

interface PaymentStatusIndicatorProps {
  status: PaymentStatus;
}

const PaymentStatusIndicator = ({ status }: PaymentStatusIndicatorProps) => {
  if (status === 'success') {
    return (
      <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center space-x-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        <span className="text-green-800 text-sm">Payment completed successfully!</span>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center space-x-2">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <span className="text-red-800 text-sm">Payment failed. Please try again.</span>
      </div>
    );
  }

  return null;
};

export default PaymentStatusIndicator;
