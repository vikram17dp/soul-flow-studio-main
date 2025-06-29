
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogOverlay } from '@/components/ui/dialog';
import { CreditCard } from 'lucide-react';
import { RazorpayPaymentProps } from './payment/types';
import { useRazorpayPayment } from './payment/useRazorpayPayment';
import PackageDetails from './payment/PackageDetails';
import PaymentStatusIndicator from './payment/PaymentStatusIndicator';

const RazorpayPayment = ({ selectedPackage, onClose, onSuccess }: RazorpayPaymentProps) => {
  const { isProcessing, paymentStatus, initializePayment } = useRazorpayPayment(
    selectedPackage,
    onClose,
    onSuccess
  );

  const formatPrice = (price: number, currency: string = 'INR') => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
    }).format(price);
  };

  if (!selectedPackage) return null;

  return (
    <Dialog open={!!selectedPackage} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/50 z-[9998]" />
      <DialogContent className="sm:max-w-md z-[9999] pointer-events-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Complete Payment</span>
          </DialogTitle>
          <DialogDescription>
            You're purchasing {selectedPackage.name}
          </DialogDescription>
        </DialogHeader>

        <PackageDetails package={selectedPackage} />

        <PaymentStatusIndicator status={paymentStatus} />

        <div className="mt-6 space-y-3">
          <Button 
            onClick={initializePayment}
            disabled={isProcessing || paymentStatus === 'processing' || paymentStatus === 'success'}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? 'Processing...' : `Pay ${formatPrice(selectedPackage.price, selectedPackage.currency || 'INR')}`}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onClose}
            disabled={paymentStatus === 'processing'}
            className="w-full"
          >
            Cancel
          </Button>
        </div>

        <p className="text-xs text-gray-500 mt-3 text-center">
          Secure payment powered by Razorpay
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default RazorpayPayment;
