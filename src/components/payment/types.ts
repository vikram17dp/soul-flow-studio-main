
export interface Package {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string | null;
  duration_months: number;
}

export interface RazorpayPaymentProps {
  selectedPackage: Package | null;
  onClose: () => void;
  onSuccess: () => void;
}

export type PaymentStatus = 'idle' | 'processing' | 'success' | 'failed';

declare global {
  interface Window {
    Razorpay: any;
  }
}
