import React, { useEffect, useState } from 'react';
import PaymentSuccess from './PaymentSuccess';
import { createOrderPayment, verifyOrderPayment } from '../api';

const RazorpayCheckout = ({ orderId, onPaymentComplete }) => {
  const [loading, setLoading] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [razorpayReady, setRazorpayReady] = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem('paymentData');
    if (savedData) {
      try {
        setPaymentData(JSON.parse(savedData));
      } catch (_) {
        setPaymentData({ total: 0, items: [], subtotal: 0, tax: 0, delivery: 0 });
      }
    } else {
      setPaymentData({ total: 0, items: [], subtotal: 0, tax: 0, delivery: 0 });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Razorpay) {
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
    setPayError('');
  };

  const openRazorpay = async () => {
    if (!paymentData || !razorpayReady) {
      setPayError('Payment is loading. Please wait and try again.');
      return;
    }
    if (!orderId) {
      setPayError('Invalid checkout. Please start from cart.');
      return;
    }
    setPayError('');
    setLoading(true);
    try {
      // API: POST /api/orders/{orderId}/payment/create (returns keyId, razorpayOrderId, amountPaise, currency, companyName). "Order not found" comes from this if orderId is invalid.
      const data = await createOrderPayment(orderId);
      const keyId = data.keyId;
      const razorpayOrderId = data.razorpayOrderId;
      const amountPaise = data.amountPaise != null ? Number(data.amountPaise) : Math.max(100, parseInt(paymentData.amount, 10) || 100);
      const currency = data.currency || 'INR';
      const companyName = data.companyName || 'Digital Cafe';

      const options = {
        key: keyId,
        currency,
        name: companyName,
        description: 'Order payment',
        image: 'https://picsum.photos/seed/digitalcafe/100/100.jpg',
        ...(razorpayOrderId ? { order_id: razorpayOrderId } : { amount: amountPaise }),
        handler: function (response) {
          // API: POST /api/orders/{orderId}/payment/verify (after Razorpay success)
          verifyOrderPayment(orderId, {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature
          })
            .then(() => {
              setPaymentId(response.razorpay_payment_id);
              setLoading(false);
              setPaymentProcessed(true);
              setOrderDetails({
                items: paymentData?.items || [],
                subtotal: paymentData?.subtotal ?? 0,
                tax: paymentData?.tax ?? 0,
                delivery: paymentData?.delivery ?? 0,
                total: paymentData?.total ?? 0
              });
            })
            .catch((err) => {
              setLoading(false);
              setPayError(err.response?.data?.message || err.message || 'Payment verification failed.');
            });
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

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function () {
        setLoading(false);
        setPayError('Payment failed or was cancelled.');
      });
      rzp.open();
    } catch (err) {
      setLoading(false);
      setPayError(err.response?.data?.message || err.message || 'Could not start payment. Please try again.');
    }
  };

  if (paymentProcessed && orderDetails) {
    const handleDone = () => {
      resetPayment();
      if (onPaymentComplete) onPaymentComplete();
    };
    return (
      <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
        <PaymentSuccess
          paymentId={paymentId}
          orderDetails={orderDetails}
          onNewPayment={handleDone}
        />
      </div>
    );
  }

  const totalRs = paymentData?.total != null ? Number(paymentData.total).toFixed(2) : '0.00';

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: 420 }}>
        <div className="card border-0 shadow-sm overflow-hidden">
          <div className="card-body p-4 p-lg-5">
            <div className="text-center mb-4">
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)', color: '#fff' }}
              >
                <i className="fas fa-mug-hot fa-lg" aria-hidden="true" />
              </div>
              <h2 className="h5 fw-bold mb-1">Pay securely</h2>
              <p className="text-muted small mb-0">Choose UPI, card, netbanking or wallet in the next step</p>
            </div>

            <div className="bg-light rounded-3 p-4 mb-4">
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Amount to pay</span>
                <span className="fs-4 fw-bold text-dark">Rs {totalRs}</span>
              </div>
            </div>

            {payError && (
              <div className="alert alert-danger py-2 small mb-3" role="alert">
                {payError}
              </div>
            )}

            <button
              type="button"
              className="btn btn-success btn-lg w-100 py-3 fw-semibold"
              onClick={openRazorpay}
              disabled={!razorpayReady || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                  Opening payment...
                </>
              ) : (
                <>
                  <i className="fas fa-wallet me-2" aria-hidden="true" />
                  Pay Rs {totalRs}
                </>
              )}
            </button>

            <p className="small text-muted text-center mt-3 mb-0">
              <i className="fas fa-lock me-1" aria-hidden="true" />
              Secured by Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayCheckout;
