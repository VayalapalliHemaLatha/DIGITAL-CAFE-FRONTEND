import React from 'react';

const PaymentSuccess = ({ paymentId, orderDetails, onNewPayment }) => {
  const orderNumber = 'ORD' + Date.now().toString().slice(-8);
  const orderDate = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Thank you for your order. Your payment has been processed successfully.</p>
        </div>

        {/* Order Details */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Order #{orderNumber}</h3>
              <p className="text-sm text-gray-600">{orderDate}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Payment ID</div>
              <div className="font-mono text-sm text-purple-700">{paymentId}</div>
            </div>
          </div>
        </div>

        {/* Bill Details */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill Details</h3>
          
          {/* Order Items */}
          <div className="space-y-3 mb-4">
            {orderDetails?.items?.map((item, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
                <div className="flex items-center">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg mr-3 object-cover" />
                  )}
                  <div>
                    <div className="font-medium text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</div>
                  </div>
                </div>
                <div className="font-semibold text-purple-700">₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          {/* Price Summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>₹{orderDetails?.subtotal?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tax (5%)</span>
              <span>₹{orderDetails?.tax?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Delivery Fee</span>
              <span>₹{orderDetails?.delivery?.toFixed(2) || '0.00'}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span className="text-purple-700">Total Paid</span>
              <span className="text-purple-700">₹{orderDetails?.total?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <h4 className="font-semibold text-gray-800 mb-2">Customer Details</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Name:</span>
              <span className="ml-2 font-medium">John Doe</span>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <span className="ml-2 font-medium">9999999999</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-600">Address:</span>
              <span className="ml-2 font-medium">123 Main Street, City</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button 
            onClick={() => window.print()}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path>
            </svg>
            Print Bill
          </button>
          
          <button 
            onClick={onNewPayment}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
            </svg>
            New Order
          </button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Digital Cafe • Order Confirmation • {orderDate}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
