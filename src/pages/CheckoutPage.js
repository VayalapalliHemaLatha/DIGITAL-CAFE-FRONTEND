import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import RazorpayCheckout from '../components/RazorpayCheckout';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const savedData = localStorage.getItem('paymentData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setPaymentData(data);
        setShowPayment(true);
      } catch (_) {
        localStorage.removeItem('paymentData');
      }
    } else if (items.length === 0) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, navigate]);

  const handlePaymentComplete = (paymentId) => {
    clearCart();
    localStorage.removeItem('paymentData'); // Clear payment data
    navigate('/orders');
  };

  const proceedToPayment = () => {
    const subtotalVal = getTotalPrice();
    const taxVal = subtotalVal * 0.05;
    const deliveryVal = 20;
    const totalVal = subtotalVal + taxVal + deliveryVal;
    const totalAmount = Math.max(100, Math.round(totalVal * 100));
    const data = {
      amount: totalAmount,
      items: items,
      subtotal: subtotalVal,
      tax: taxVal,
      delivery: deliveryVal,
      total: totalVal
    };
    localStorage.setItem('paymentData', JSON.stringify(data));
    setPaymentData(data);
    setShowPayment(true);
  };

  if (showPayment) {
    return <RazorpayCheckout onPaymentComplete={handlePaymentComplete} />;
  }

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.05;
  const delivery = 20;
  const total = subtotal + tax + delivery;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>
            <button 
              onClick={() => navigate('/cart')}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Order Summary */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                {items.map(item => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg mr-3 object-cover" />
                      )}
                      <div>
                        <div className="font-semibold text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-600">₹{item.price} × {item.quantity}</div>
                      </div>
                    </div>
                    <div className="font-bold text-purple-700">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>
              
              {/* Clear Cart Button */}
              <div className="mt-4">
                <button 
                  onClick={clearCart}
                  className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Payment Details */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (5%)</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span>₹{delivery.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-purple-700">₹{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded">
                  <label className="block text-sm font-medium mb-2">Customer Name</label>
                  <input type="text" className="w-full p-2 border rounded" placeholder="John Doe" />
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input type="tel" className="w-full p-2 border rounded" placeholder="9999999999" />
                </div>
                <div className="p-3 bg-gray-50 rounded">
                  <label className="block text-sm font-medium mb-2">Delivery Address</label>
                  <textarea className="w-full p-2 border rounded" rows="2" placeholder="123 Main Street, City"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button 
              onClick={() => navigate('/cart')}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Back to Cart
            </button>
            <button 
              onClick={proceedToPayment}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
              </svg>
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
