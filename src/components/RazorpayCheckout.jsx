import React, { useEffect, useState } from 'react';
import PaymentSuccess from './PaymentSuccess';

const RazorpayCheckout = ({ onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [userContact, setUserContact] = useState('');

  // Get payment data and user from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('paymentData');
    if (savedData) {
      const data = JSON.parse(savedData);
      setPaymentData(data);
    } else {
      setPaymentData({
        amount: 50000,
        items: [{ name: 'Coffee', price: 120, quantity: 2, image: 'https://picsum.photos/seed/coffee/80/80.jpg' }],
        subtotal: 240,
        tax: 12,
        delivery: 20,
        total: 272
      });
    }
    const email = localStorage.getItem('email') || 'john@example.com';
    const phone = localStorage.getItem('phone') || '9791160548';
    setUserContact(phone && phone.length >= 10 ? `+91 ${phone.slice(-10).replace(/(\d{5})(\d{5})/, '$1 $2')}` : email);
  }, []);

  // Load Razorpay script and mark when ready
  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayReady(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayReady(true);
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) document.body.removeChild(script);
    };
  }, []);

  const resetPayment = () => {
    setPaymentId('');
    setLoading(false);
    setPaymentProcessed(false);
    setOrderDetails(null);
  };

  const openRazorpay = () => {
    if (!paymentData || !razorpayReady) {
      alert('Payment is loading. Please wait a moment and try again.');
      return;
    }
    const validAmount = Math.max(100, parseInt(paymentData.amount, 10) || 100);
    setLoading(true);

    const options = {
      key: 'rzp_test_1DP5mmOlF5G5ag',
      amount: validAmount,
      currency: 'INR',
      name: 'Digital Cafe',
      description: 'Food Order Payment',
      image: 'https://picsum.photos/seed/digitalcafe/100/100.jpg',
      handler: function (response) {
        setPaymentId(response.razorpay_payment_id);
        setLoading(false);
        setPaymentProcessed(true);
        setOrderDetails({
          items: paymentData?.items || [],
          subtotal: paymentData?.subtotal || 0,
          tax: paymentData?.tax || 0,
          delivery: paymentData?.delivery || 0,
          total: paymentData?.total || 0
        });
        if (onPaymentComplete) onPaymentComplete(response.razorpay_payment_id);
      },
      prefill: {
        name: localStorage.getItem('name') || 'Customer',
        email: localStorage.getItem('email') || 'john@example.com',
        contact: (localStorage.getItem('phone') || '9999999999').replace(/\D/g, '').slice(-10)
      },
      notes: { address: 'Digital Cafe', order_type: 'Food Order' },
      theme: { color: '#F97316' },
      modal: { ondismiss: () => setLoading(false) }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay open error:', err);
      setLoading(false);
      alert('Could not open payment. Check console or try again.');
    }
  };

  if (paymentProcessed && orderDetails) {
    return (
      <div className="razorpay-checkout-wrap">
        <PaymentSuccess
          paymentId={paymentId}
          orderDetails={orderDetails}
          onNewPayment={resetPayment}
        />
      </div>
    );
  }

  const totalRs = paymentData?.total != null ? Number(paymentData.total).toFixed(2) : '0.00';

  return (
    <div className="razorpay-checkout-wrap">
      <div className="rzp-test-ribbon">Test Mode</div>

      <div className="rzp-checkout-card">
        {/* Left: Price Summary (orange) */}
        <div className="rzp-summary-panel">
          <h2 className="rzp-merchant-name">Digital Cafe</h2>
          <h3 className="rzp-summary-title">Price Summary</h3>
          <p className="rzp-amount">₹{totalRs}</p>
          <p className="rzp-using-as">Using as {userContact}</p>
          <div className="rzp-illustration" aria-hidden="true">
            <div className="rzp-bag rzp-bag-1" />
            <div className="rzp-bag rzp-bag-2" />
          </div>
          <p className="rzp-secured">Secured by Razorpay</p>
        </div>

        {/* Right: Payment Options (white) */}
        <div className="rzp-options-panel">
          <h3 className="rzp-options-title">Payment Options</h3>

          <div className="rzp-option-group">
            <span className="rzp-option-label">Recommended</span>
            <div className="rzp-upi-qr-block">
              <div className="rzp-qr-placeholder" />
              <p className="rzp-scan-text">Scan the QR using any UPI app</p>
              <div className="rzp-upi-apps">
                <span className="rzp-app-dot" title="Google Pay" />
                <span className="rzp-app-dot" title="PhonePe" />
                <span className="rzp-app-dot" title="Paytm" />
                <span className="rzp-app-dot" title="BHIM" />
                <span className="rzp-app-dot" title="Amazon Pay" />
              </div>
            </div>
            <button type="button" className="rzp-method-row rzp-recommended" onClick={openRazorpay} disabled={!razorpayReady || loading}>
              <span className="rzp-method-name">UPI - PhonePe</span>
              <span className="rzp-arrow">→</span>
            </button>
          </div>

          {['UPI', 'Cards', 'EMI', 'Netbanking', 'Wallet', 'Pay Later'].map((label) => (
            <button type="button" key={label} className="rzp-method-row" onClick={openRazorpay} disabled={!razorpayReady || loading}>
              <span className="rzp-method-name">{label}</span>
              <span className="rzp-arrow">→</span>
            </button>
          ))}

          <div className="rzp-pay-footer">
            <button type="button" className="rzp-pay-btn" onClick={openRazorpay} disabled={!razorpayReady || loading}>
              {loading ? 'Opening secure payment...' : `Pay ₹${totalRs}`}
            </button>
            <p className="rzp-secured-bottom">Secured by Razorpay</p>
          </div>
        </div>
      </div>

      <style>{`
        .razorpay-checkout-wrap { min-height: 100vh; background: #f1f5f9; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; }
        .rzp-test-ribbon { position: fixed; top: 0; right: 0; background: #dc2626; color: #fff; font-size: 12px; font-weight: 600; padding: 6px 14px; z-index: 10; }
        .rzp-checkout-card { display: flex; max-width: 900px; width: 100%; border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); }
        .rzp-summary-panel { background: linear-gradient(180deg, #ea580c 0%, #c2410c 100%); color: #fff; padding: 32px; width: 42%; min-height: 420px; display: flex; flex-direction: column; }
        .rzp-merchant-name { margin: 0 0 8px 0; font-size: 1.5rem; font-weight: 700; }
        .rzp-summary-title { margin: 16px 0 8px 0; font-size: 1rem; font-weight: 600; opacity: 0.95; }
        .rzp-amount { margin: 0; font-size: 2rem; font-weight: 800; }
        .rzp-using-as { margin: 12px 0 0 0; font-size: 0.875rem; opacity: 0.9; }
        .rzp-illustration { margin: auto 0 16px 0; display: flex; gap: 12px; align-items: flex-end; }
        .rzp-bag { width: 48px; height: 56px; background: rgba(255,255,255,0.25); border-radius: 8px; }
        .rzp-bag-2 { height: 40px; }
        .rzp-secured { margin: 0; font-size: 0.75rem; opacity: 0.85; }
        .rzp-options-panel { background: #fff; padding: 28px; flex: 1; min-height: 420px; display: flex; flex-direction: column; }
        .rzp-options-title { margin: 0 0 20px 0; font-size: 1.25rem; font-weight: 700; color: #1e293b; }
        .rzp-option-group { margin-bottom: 16px; }
        .rzp-option-label { font-size: 0.75rem; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
        .rzp-upi-qr-block { text-align: center; margin: 12px 0 16px 0; padding: 16px; background: #f8fafc; border-radius: 12px; }
        .rzp-qr-placeholder { width: 160px; height: 160px; margin: 0 auto 10px; background: repeating-linear-gradient(0deg, #000 0px, #000 4px, #fff 4px, #fff 8px), repeating-linear-gradient(90deg, #000 0px, #000 4px, #fff 4px, #fff 8px); border-radius: 8px; }
        .rzp-scan-text { margin: 0 0 10px 0; font-size: 0.8125rem; color: #64748b; }
        .rzp-upi-apps { display: flex; justify-content: center; gap: 8px; }
        .rzp-app-dot { width: 28px; height: 28px; border-radius: 6px; background: #e2e8f0; }
        .rzp-method-row { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; margin-bottom: 8px; border: 1px solid #e2e8f0; border-radius: 10px; background: #fff; cursor: pointer; font-size: 1rem; color: #1e293b; transition: all 0.2s; }
        .rzp-method-row:hover:not(:disabled) { border-color: #F97316; background: #fff7ed; }
        .rzp-method-row:disabled { opacity: 0.7; cursor: not-allowed; }
        .rzp-method-row.rzp-recommended { border-color: #22c55e; background: #f0fdf4; }
        .rzp-arrow { color: #94a3b8; font-weight: 700; }
        .rzp-pay-footer { margin-top: auto; padding-top: 20px; }
        .rzp-pay-btn { width: 100%; padding: 14px 20px; background: #F97316; color: #fff; border: none; border-radius: 10px; font-size: 1rem; font-weight: 600; cursor: pointer; }
        .rzp-pay-btn:hover:not(:disabled) { background: #ea580c; }
        .rzp-pay-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .rzp-secured-bottom { margin: 10px 0 0 0; font-size: 0.75rem; color: #94a3b8; text-align: center; }
        @media (max-width: 700px) { .rzp-checkout-card { flex-direction: column; } .rzp-summary-panel { width: 100%; min-height: 240px; } }
      `}</style>
    </div>
  );
};

export default RazorpayCheckout;
