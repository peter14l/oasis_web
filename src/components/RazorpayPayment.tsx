import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Loader2 } from 'lucide-react';

interface RazorpayPaymentProps {
  plan: string;
  amount: number;
  currency: string;
  onSuccess: () => void;
}

const RazorpayPayment = ({ plan, amount, currency, onSuccess }: RazorpayPaymentProps) => {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) return;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Create subscription on server
      const { data: subData, error: subError } = await supabase.functions.invoke('razorpay-create-order', {
        body: { plan }
      });

      if (subError) {
        console.error('Supabase Function Error:', subError);
        let detailedError = subError.message;
        
        // Try to parse the actual error message from the function response
        if (subError instanceof Error && 'context' in subError) {
          try {
            const response = (subError as any).context as Response;
            if (response && typeof response.json === 'function') {
              const errorBody = await response.json();
              detailedError = errorBody.error || detailedError;
            }
          } catch (e) {
            console.error('Failed to parse error body:', e);
          }
        }
        throw new Error(`Checkout failed: ${detailedError}`);
      }

      // 2. Open Razorpay Modal with explicit Key ID
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // This ensures Key ID is passed
        subscription_id: subData.id,
        name: 'Oasis',
        description: `Oasis ${plan} Subscription`,
        image: 'https://znsrloengevubwfuxnqd.supabase.co/storage/v1/object/public/assets/logo.png',
        handler: async (response: any) => {
          const { data: verifyData } = await supabase.functions.invoke('razorpay-verify', {
            body: {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_subscription_id: response.razorpay_subscription_id,
              razorpay_signature: response.razorpay_signature,
              plan
            }
          });
          if (verifyData?.success) onSuccess();
          else alert('Verification failed.');
        },
        prefill: {
          name: user?.user_metadata?.full_name || '',
          email: user?.email || '',
        },
        theme: { color: '#D0BCFF' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      console.error('Razorpay Error:', err);
      alert(err.message || 'Checkout failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={loading || !scriptLoaded}
      className="btn btn-primary"
      style={{ width: '100%', gap: '0.5rem', padding: '1.25rem' }}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : `Subscribe to ${plan} with Razorpay`}
    </button>
  );
};

export default RazorpayPayment;
