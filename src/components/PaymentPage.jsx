import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PaymentPage = () => {
  const [loading, setLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [error, setError] = useState('');
  const [orderDetails, setOrderDetails] = useState({
    amount: 50000, // Amount in paise (500 INR * 100)
    currency: 'INR',
    receipt: 'order_' + Date.now()
  });

  // Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createOrder = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Call backend API to create order
      const response = await axios.post('http://localhost:8080/api/payment/create-order', {
        amount: orderDetails.amount,
        currency: orderDetails.currency,
        receipt: orderDetails.receipt
      });

      return response.data.orderId;
    } catch (err) {
      console.error('Error creating order:', err);
      setError('Failed to create payment order. Please try again.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const openRazorpayCheckout = async (orderId) => {
    const options = {
      key: 'rzp_test_1DP5mmOlF5G1ag', // Razorpay test key
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: 'Digital Cafe',
      description: 'Food Order Payment',
      order_id: orderId,
      image: 'https://picsum.photos/seed/digitalcafe/200/200.jpg',
      handler: function (response) {
        // Payment successful
        setPaymentId(response.razorpay_payment_id);
        setPaymentSuccess(true);
        console.log('Payment successful:', response);
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999'
      },
      notes: {
        address: 'Digital Cafe, Main Street',
        order_type: 'Food Order'
      },
      theme: {
        color: '#6B46C1'
      },
      modal: {
        ondismiss: function () {
          console.log('Payment modal closed');
          setError('Payment was cancelled. Please try again.');
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handlePayment = async () => {
    try {
      const orderId = await createOrder();
      await openRazorpayCheckout(orderId);
    } catch (err) {
      console.error('Payment error:', err);
    }
  };

  const resetPayment = () => {
    setPaymentSuccess(false);
    setPaymentId('');
    setError('');
    setOrderDetails({
      ...orderDetails,
      receipt: 'order_' + Date.now()
    });
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(circle_at_top,_#a855f7,_transparent_60%),_radial-gradient(circle_at_bottom,_#4f46e5,_transparent_60%)]" />

          <div className="relative">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h2>
              <p className="text-gray-600 mb-4">Your payment has been processed successfully</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Payment ID</div>
              <div className="font-mono text-sm md:text-base text-gray-800 break-all">{paymentId}</div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Amount Paid</div>
                <div className="text-2xl font-bold text-purple-700">₹{orderDetails.amount / 100}</div>
              </div>
              <div className="flex items-center text-xs text-purple-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Securely processed
              </div>
            </div>
            
            <button
              onClick={resetPayment}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
            >
              Make Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative overflow-hidden">
        {/* Secure lock overlay while processing (like Razorpay UI) */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
            <div className="w-14 h-14 rounded-full border-2 border-purple-200 flex items-center justify-center mb-4 bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="10" width="14" height="9" rx="2" fill="currentColor" />
                <path
                  d="M8 10V8.5C8 5.46 9.79 4 12 4C14.21 4 16 5.46 16 8.5V10"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-800 mb-1">Processing your payment securely</p>
            <p className="text-xs text-gray-500 mb-4">Do not refresh or close this window</p>
            <div className="flex items-center text-xs text-gray-500">
              <span className="mr-2 inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Protected by Razorpay • Test Mode
            </div>
          </div>
        )}

        <div className="relative text-center mb-8">
          <div className="mb-4">
            <img 
              src="https://picsum.photos/seed/digitalcafe/100/100.jpg" 
              alt="Digital Cafe" 
              className="w-20 h-20 rounded-full mx-auto border-4 border-purple-100"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Digital Cafe</h1>
          <p className="text-gray-600">Secure Payment Checkout</p>
        </div>

        <div className="bg-purple-50 rounded-lg p-6 mb-6 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-24 h-24 rounded-full bg-purple-500/10" />
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Order Amount</span>
            <span className="text-2xl font-bold text-purple-700">₹{orderDetails.amount / 100}</span>
          </div>
          
          <div className="border-t border-purple-200 pt-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>Order ID</span>
              <span className="font-mono">{orderDetails.receipt}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
              <span>Currency</span>
              <span>{orderDetails.currency}</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              Secure Payment
            </div>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-1a1 1 0 100-2h1a4 4 0 014 4v6a4 4 0 01-4 4H6a4 4 0 01-4-4V7a4 4 0 014-4z" clipRule="evenodd" />
              </svg>
              Razorpay Protected
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              Pay Now
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Powered by Razorpay • Test Environment
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
