import React, { useState } from 'react';
import RazorpayCheckout from './RazorpayCheckout';

const CartPage = () => {
  const [cart, setCart] = useState([
    { id: 1, name: 'Coffee', price: 120, quantity: 2, image: 'https://picsum.photos/seed/coffee/80/80.jpg' },
    { id: 2, name: 'Sandwich', price: 150, quantity: 1, image: 'https://picsum.photos/seed/sandwich/80/80.jpg' },
    { id: 3, name: 'Cake', price: 200, quantity: 1, image: 'https://picsum.photos/seed/cake/80/80.jpg' }
  ]);

  const [showBill, setShowBill] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const updateQuantity = (id, quantity) => {
    if (quantity === 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const proceedToBill = () => {
    setShowBill(true);
  };

  const proceedToPayment = () => {
    setShowPayment(true);
  };

  const resetCart = () => {
    setCart([]);
    setShowBill(false);
    setShowPayment(false);
  };

  if (showPayment) {
    return <RazorpayCheckout onPaymentComplete={resetCart} />;
  }

  if (showBill) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Digital Cafe - Bill</h1>
              <button 
                onClick={() => setShowBill(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Bill Details */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div className="flex items-center">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded mr-3" />
                        <div>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-gray-500">₹{item.price} × {item.quantity}</div>
                        </div>
                      </div>
                      <div className="font-semibold">₹{item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (5%)</span>
                      <span>₹{totalAmount * 0.05}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>₹40</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span className="text-purple-700">₹{totalAmount + (totalAmount * 0.05) + 40}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
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
                onClick={() => setShowBill(false)}
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
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
            <div className="text-gray-500">
              {cart.length} items
            </div>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
              <p className="text-gray-500 mb-4">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center p-4 border rounded-lg">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg mr-4" />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-purple-600 text-white hover:bg-purple-700 flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                    <div className="ml-6 text-right">
                      <div className="font-bold text-lg">₹{item.price * item.quantity}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-700">Total: ₹{totalAmount}</div>
                    <p className="text-gray-500">Including all taxes</p>
                  </div>
                  <button 
                    onClick={proceedToBill}
                    disabled={cart.length === 0}
                    className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    Generate Bill
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
