
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Package, PaymentStatus } from './types';

export const useRazorpayPayment = (
  selectedPackage: Package | null,
  onClose: () => void,
  onSuccess: () => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('idle');
  const { toast } = useToast();

  const initializePayment = async () => {
    if (!selectedPackage) return;

    setIsProcessing(true);
    setPaymentStatus('processing');

    // Close the confirmation modal immediately when payment starts
    onClose();

    try {
      // Load Razorpay script
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      // Create Razorpay order
      const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
        body: { packageId: selectedPackage.id }
      });

      if (orderError) throw orderError;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Yoga Studio',
        description: `Payment for ${selectedPackage.name}`,
        order_id: orderData.orderId,
        handler: async (response: any) => {
          try {
            // Verify payment
            const { data: verifyData, error: verifyError } = await supabase.functions.invoke('verify-razorpay-payment', {
              body: {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              }
            });

            if (verifyError) throw verifyError;

            setPaymentStatus('success');
            toast({
              title: 'Payment Successful!',
              description: `Your ${selectedPackage.name} subscription is now active.`,
            });
            
            setTimeout(() => {
              onSuccess();
            }, 2000);

          } catch (error) {
            console.error('Payment verification failed:', error);
            setPaymentStatus('failed');
            toast({
              title: 'Payment Verification Failed',
              description: 'Please contact support if amount was deducted.',
              variant: 'destructive'
            });
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          package_id: selectedPackage.id,
          package_name: selectedPackage.name
        },
        theme: {
          color: '#7c3aed'
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            setPaymentStatus('idle');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error('Payment initialization failed:', error);
      setPaymentStatus('failed');
      toast({
        title: 'Payment Failed',
        description: 'Unable to initialize payment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    paymentStatus,
    initializePayment
  };
};
