import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CreditCard, HandCoins } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = resolve;
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.head.appendChild(script);
});

const PaymentMethodDialog = ({ open, onOpenChange, sheetLoading }) => {
  const [loading, setLoading] = useState(false);

  const { user, refetchUser } = useAuth();
  const { clearCartCache } = useCart();
  
  const paymentMethods = [
    {
      id: 'online',
      name: 'Online Payment',
      description: 'Pay using Card, UPI, Net Banking, or Wallets',
      icon: CreditCard,
      color: 'bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-blue-200 dark:border-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      description: 'Pay when you receive your order',
      icon: HandCoins,
      color: 'bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border-green-200 dark:border-green-800',
      iconColor: 'text-green-600 dark:text-green-400'
    }
  ];

  const handlePaymentMethodSelect = async (method) => {
    onOpenChange(false);
    
    if (method === 'online') {
      handleRazorpayPayment();
    } else if (method === 'cod') {
      handleCODPayment();
    }
  }

  // Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    setLoading(true);
    try {
      // Load Razorpay SDK only when user clicks "Online Payment"
      await loadRazorpayScript();

      // Step 0: get the user data
      const result = await refetchUser();
      const freshUser = result.data?.user ?? user;

      const { name, email, phone } = freshUser ?? {};

      // Step 1: Create order on backend
      const orderResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/create-order`,
        {},
        { withCredentials: true }
      );

      const { razorpayOrder, checkoutSessionId, key } = orderResponse.data;

      // Step 2: Configure Razorpay options
      const options = {
        key: key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Ecobazar",
        description: "Product Purchase",
        order_id: razorpayOrder.id,
        
        // Success handler
        handler: async function (response) {
          try {
            // Step 3: Verify payment on backend
            const verifyResponse = await axios.post(
              `${import.meta.env.VITE_API_URL}/order/verify-payment`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                checkoutSessionId: checkoutSessionId
              },
              { withCredentials: true }
            );

            if (verifyResponse.data.success) {
              toast.success('Payment successful!');
              clearCartCache();
              onOpenChange(false);
            }
          } catch (error) {
            toast.error('Payment verification failed');
            console.error('Verification error:', error);
          }
        },

        // Prefill user details
        prefill: {
          name: name,
          email: email,
          contact: phone
        },

        // Theme customization
        theme: {
          color: "#22c55e"
        },

        // Modal settings
        modal: {
          ondismiss: async function() {
            // Handle payment cancellation
            try {
              await axios.post(
                `${import.meta.env.VITE_API_URL}/order/payment-failure`,
                { checkoutSessionId: checkoutSessionId },
                { withCredentials: true }
              );
              toast.error('Payment cancelled');
            } catch (error) {
              console.error('Error recording cancellation:', error);
            }
          }
        }
      };

      // Step 4: Open Razorpay checkout
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.response?.data?.error || 'Failed to initiate payment');
    } finally {
      setLoading(false);
      sheetLoading(false);
    }
  };

  const handleCODPayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/order/cod-order`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        toast.success('Order placed successfully!', {
          description: 'You can pay when your order is delivered',
          duration: 4000
        });
        
        // Clear cart and close sidebar
        clearCartCache()
        onOpenChange(false);
      }
    } catch (error) {
      console.error('COD order error:', error);
      toast.error(error.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
      sheetLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className='text-xl font-bold'>Select Payment Method</DialogTitle>
          <DialogDescription>
            Choose how you'd like to pay for your order
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-3 mt-4'>
          {paymentMethods.map((method) => {
            const Icon = method.icon
            return (
              <button
                key={method.id}
                onClick={() => handlePaymentMethodSelect(method.id)}
                disabled={loading}
                className={`w-full p-4 border-2 rounded-lg transition-all duration-200 flex items-start gap-4 ${method.color} hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className={`p-3 rounded-full bg-white dark:bg-gray-800 ${method.iconColor}`}>
                  <Icon className='w-6 h-6' />
                </div>
                <div className='flex-1 text-left'>
                  <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    {method.name}
                  </h3>
                  <p className='text-sm text-gray-600 dark:text-gray-400'>
                    {method.description}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        <div className='mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg'>
          <p className='text-xs text-yellow-800 dark:text-yellow-200'>
            💡 <strong>Note:</strong> COD orders may have additional delivery charges
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentMethodDialog