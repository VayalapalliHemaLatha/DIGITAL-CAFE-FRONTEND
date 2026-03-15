import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import RazorpayCheckout from '../components/RazorpayCheckout';
import { createOrderFromCart } from '../api';

const CheckoutPage = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [paymentError, setPaymentError] = useState('');
  const [creatingOrder, setCreatingOrder] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('paymentData');
    const savedOrderId = localStorage.getItem('checkoutOrderId');
    if (savedData && savedOrderId) {
      try {
        JSON.parse(savedData);
        setOrderId(savedOrderId);
        setShowPayment(true);
      } catch (_) {
        localStorage.removeItem('paymentData');
        localStorage.removeItem('checkoutOrderId');
      }
    } else if (items.length === 0 && !savedData) {
      navigate('/cart', { replace: true });
    }
  }, [items.length, navigate]);

  const handlePaymentComplete = () => {
    clearCart();
    localStorage.removeItem('paymentData');
    localStorage.removeItem('checkoutOrderId');
    navigate('/orders');
  };

  const proceedToPayment = async () => {
    if (items.length === 0) {
      setPaymentError('Cart is empty.');
      return;
    }
    const subtotalVal = getTotalPrice();
    const taxVal = subtotalVal * 0.05;
    const deliveryVal = 20;
    const totalVal = subtotalVal + taxVal + deliveryVal;
    setPaymentError('');
    setCreatingOrder(true);
    try {
      const now = new Date();
      const orderDate = now.toISOString().slice(0, 10);
      const orderTime = now.toTimeString().slice(0, 5);
      // Cart item id must be the menu item id from GET /api/menu (menuItemId in from-cart).
      const payload = {
        items: items.map((i) => ({
          menuItemId: i.id,
          quantity: i.quantity,
        })),
        orderDate,
        orderTime,
      };
      const order = await createOrderFromCart(payload);
      const backendOrderId = order?.id;
      if (backendOrderId == null) {
        setPaymentError('Could not create order. Please try again.');
        return;
      }
      const totalAmountPaise = Math.max(100, Math.round(totalVal * 100));
      const data = {
        amount: totalAmountPaise,
        items,
        subtotal: subtotalVal,
        tax: taxVal,
        delivery: deliveryVal,
        total: totalVal,
      };
      localStorage.setItem('paymentData', JSON.stringify(data));
      localStorage.setItem('checkoutOrderId', String(backendOrderId));
      setOrderId(String(backendOrderId));
      setShowPayment(true);
    } catch (err) {
      setPaymentError(err.response?.data?.message || err.message || 'Failed to create order. Please try again.');
    } finally {
      setCreatingOrder(false);
    }
  };

  if (showPayment && orderId) {
    return (
      <RazorpayCheckout
        orderId={orderId}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  const subtotal = getTotalPrice();
  const tax = subtotal * 0.05;
  const delivery = 20;
  const total = subtotal + tax + delivery;

  return (
    <div className="min-vh-100 bg-light py-4">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="h4 mb-0 fw-bold text-dark">Checkout</h1>
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0"
                onClick={() => navigate('/cart')}
                aria-label="Back to cart"
              >
                <i className="fas fa-arrow-left me-1" /> Back to cart
              </button>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h2 className="h6 text-uppercase text-muted mb-3">Order summary</h2>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="d-flex align-items-center py-3 border-bottom border-light"
                  >
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded me-3"
                        style={{ width: 56, height: 56, objectFit: 'cover' }}
                      />
                    )}
                    <div className="flex-grow-1">
                      <div className="fw-semibold">{item.name}</div>
                      <small className="text-muted">Rs {item.price} x {item.quantity}</small>
                    </div>
                    <div className="fw-semibold">Rs {(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body p-4">
                <h2 className="h6 text-uppercase text-muted mb-3">Payment details</h2>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal</span>
                  <span>Rs {subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tax (5%)</span>
                  <span>Rs {tax.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery fee</span>
                  <span>Rs {delivery.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span className="text-primary">Rs {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {paymentError && (
              <div className="alert alert-danger py-2 mb-3" role="alert">
                {paymentError}
              </div>
            )}

            <div className="card border-0 shadow-sm bg-primary bg-opacity-10 mb-3">
              <div className="card-body p-4">
                <button
                  type="button"
                  className="btn btn-primary btn-lg w-100 py-3 fw-semibold"
                  onClick={proceedToPayment}
                  disabled={creatingOrder}
                >
                  {creatingOrder ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Creating order...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-lock me-2" aria-hidden="true" />
                      Proceed to payment — Rs {total.toFixed(2)}
                    </>
                  )}
                </button>
                <p className="small text-muted text-center mt-2 mb-0">
                  You will pay securely via Razorpay (UPI, cards, netbanking)
                </p>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={clearCart}
            >
              <i className="fas fa-trash-alt me-1" /> Clear cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
