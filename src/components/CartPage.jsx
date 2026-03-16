import React, { useState } from 'react';
import RazorpayCheckout from './RazorpayCheckout';
import { useCart } from '../contexts/CartContext';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { items: cart, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const navigate = useNavigate();

  const [showBill, setShowBill] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const totalAmount = getTotalPrice();
  const tax = totalAmount * 0.05;
  const deliveryFee = 40;
  const finalTotal = totalAmount + tax + deliveryFee;

  const proceedToBill = () => {
    setShowBill(true);
  };

  const proceedToPayment = () => {
    setShowPayment(true);
  };

  const resetCart = () => {
    // Note: clearCart is handled by onPaymentComplete or context
    setShowBill(false);
    setShowPayment(false);
  };

  if (showPayment) {
    return <RazorpayCheckout onPaymentComplete={resetCart} />;
  }

  if (showBill) {
    return (
      <div className="bg-dashboard-canvas min-vh-100 py-5">
        <div className="container py-5">
          <div className="dashboard-glass-card p-5 border-0 shadow-2xl mx-auto" style={{ maxWidth: '900px' }}>
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <div className="badge-premium mb-2">Order Confirmed</div>
                <h1 className="fw-bold text-dark mb-0">Digital Cafe - Final Bill</h1>
              </div>
              <button 
                onClick={() => setShowBill(false)}
                className="btn btn-light rounded-circle shadow-sm"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
 
            <div className="row g-5">
              <div className="col-lg-7">
                <h4 className="fw-bold text-dark mb-4 pb-2 border-bottom">Order Details</h4>
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="d-flex justify-content-between align-items-center p-3 bg-white bg-opacity-50 rounded-4 border mb-3 shadow-sm hover-up transition-all">
                      <div className="d-flex align-items-center">
                        <img src={item.image} alt={item.name} className="rounded-3 shadow-sm me-3" style={{ width: '64px', height: '64px', objectFit: 'cover' }} />
                        <div>
                          <div className="fw-bold text-dark">{item.name}</div>
                          <div className="small text-muted">Rs {item.price} × {item.quantity}</div>
                        </div>
                      </div>
                      <div className="fw-bold text-primary">Rs {item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>
              </div>
 
              <div className="col-lg-5">
                <h4 className="fw-bold text-dark mb-4 pb-2 border-bottom">Payment Summary</h4>
                <div className="bg-primary bg-opacity-10 p-4 rounded-4 border border-primary border-opacity-20 mb-4 shadow-sm">
                  <div className="space-y-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Subtotal</span>
                      <span className="fw-medium text-dark">Rs {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="text-muted">Tax (5%)</span>
                      <span className="fw-medium text-dark">Rs {tax.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <span className="text-muted">Delivery Fee</span>
                      <span className="fw-medium text-dark">Rs {deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="pt-3 border-top d-flex justify-content-between align-items-center">
                      <span className="h5 fw-bold text-dark mb-0">Total</span>
                      <span className="h4 fw-bold text-primary mb-0">Rs {finalTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
 
                <div className="space-y-3">
                  <div className="p-3 bg-white bg-opacity-75 rounded-4 border shadow-sm mb-3">
                    <label className="small fw-bold text-uppercase tracking-wider text-muted mb-2 d-block">Customer Name</label>
                    <input type="text" className="form-control border-0 bg-transparent p-0 fw-medium" placeholder="Guest Customer" />
                  </div>
                  <div className="p-3 bg-white bg-opacity-75 rounded-4 border shadow-sm mb-3">
                    <label className="small fw-bold text-uppercase tracking-wider text-muted mb-2 d-block">Phone Number</label>
                    <input type="tel" className="form-control border-0 bg-transparent p-0 fw-medium" placeholder="+91 00000 00000" />
                  </div>
                  <div className="p-3 bg-white bg-opacity-75 rounded-4 border shadow-sm mb-3">
                    <label className="small fw-bold text-uppercase tracking-wider text-muted mb-2 d-block">Delivery Address</label>
                    <textarea className="form-control border-0 bg-transparent p-0 fw-medium" rows="2" placeholder="Table Number or Address"></textarea>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
              <button 
                onClick={() => setShowBill(false)}
                className="btn btn-outline-dark px-5 py-3 rounded-pill fw-bold"
              >
                Back to Cart
              </button>
              <button 
                onClick={proceedToPayment}
                className="btn btn-premium px-5 py-3 rounded-pill fw-bold shadow-lg"
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-dashboard-canvas min-vh-100 py-5" style={{ isolation: 'isolate' }}>
      <div className="container py-5">
        <div className="dashboard-glass-card p-5 border-0 shadow-2xl">
          <div className="d-flex justify-content-between align-items-center mb-5">
             <div>
                <div className="badge-premium mb-2">Curated Selection</div>
                <h1 className="display-4 fw-bold text-dark mb-0">Epicurean <span className="text-primary">Cart</span></h1>
             </div>
             <div className="text-end">
                <div className="h4 fw-bold text-primary mb-0">{cart.length}</div>
                <div className="small text-muted text-uppercase tracking-widest">Masterpieces</div>
             </div>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <i className="fas fa-shopping-basket display-1 text-muted opacity-25"></i>
              </div>
              <h3 className="fw-bold text-dark mb-3">Your cart is an empty canvas</h3>
              <p className="text-muted mb-5 lead">Explore our culinary universe and find your next obsession.</p>
              <Link to="/menu" className="btn btn-premium px-5 py-3 rounded-pill fw-bold shadow-lg">
                Explore Menu
              </Link>
            </div>
          ) : (
            <div className="row g-5">
              <div className="col-lg-8">
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="d-flex align-items-center p-4 bg-white bg-opacity-40 rounded-5 border mb-4 shadow-sm hover-up transition-all">
                      <div className="position-relative me-4">
                         <img src={item.image} alt={item.name} className="rounded-4 shadow-lg" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                         <div className="position-absolute top-0 end-0 m-n2">
                            <span className="badge rounded-pill bg-danger shadow-sm border border-white px-3 py-2">{item.quantity}</span>
                         </div>
                      </div>
                      
                      <div className="flex-grow-1">
                        <div className="badge bg-primary bg-opacity-10 text-primary small text-uppercase fw-bold px-2 py-1 rounded mb-2">{item.category}</div>
                        <h4 className="fw-bold text-dark mb-1">{item.name}</h4>
                        <p className="text-muted small mb-0 pe-4 line-clamp-2">{item.description}</p>
                      </div>
                      
                      <div className="d-flex flex-column align-items-end justify-content-between h-100 py-2">
                        <div className="h4 fw-bold text-primary mb-4">Rs {item.price * item.quantity}</div>
                        <div className="d-flex align-items-center bg-white rounded-pill p-1 shadow-sm border">
                          <button 
                            onClick={() => {
                              if (item.quantity <= 1) removeFromCart(item.id);
                              else updateQuantity(item.id, item.quantity - 1);
                            }}
                            className="btn btn-sm btn-light rounded-circle border-0 shadow-sm"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <i className="fas fa-minus small"></i>
                          </button>
                          <span className="fw-bold px-3 text-dark">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="btn btn-sm btn-primary rounded-circle border-0 shadow-sm"
                            style={{ width: '32px', height: '32px' }}
                          >
                            <i className="fas fa-plus small"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="dashboard-glass-card shadow-2xl p-4 border-primary border-opacity-25 sticky-top" style={{ top: '100px', backgroundColor: 'rgba(255,255,255,0.7)' }}>
                  <h4 className="fw-bold text-dark mb-4 border-bottom pb-3">Cart Summary</h4>
                  <div className="space-y-3 mb-4">
                    <div className="d-flex justify-content-between text-muted mb-2">
                      <span>Subtotal</span>
                      <span className="fw-bold text-dark">Rs {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted mb-2">
                      <span>Platform Fee</span>
                      <span className="fw-bold text-dark">Rs 10.00</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted">
                      <span>Service Level</span>
                      <span className="badge bg-success bg-opacity-10 text-success">Premium</span>
                    </div>
                  </div>
                  
                  <div className="border-top pt-4 mb-4">
                    <div className="d-flex justify-content-between align-items-end">
                      <div>
                        <div className="text-muted small mb-1">Final Investment</div>
                        <div className="h2 fw-extrabold text-primary mb-0">Rs {totalAmount.toFixed(2)}</div>
                      </div>
                      <div className="text-end">
                         <div className="text-muted xsmall mb-1">Tax Incl.</div>
                         <i className="fas fa-shield-alt text-primary opacity-50"></i>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={proceedToBill}
                    disabled={cart.length === 0}
                    className="btn btn-premium w-100 py-3 rounded-pill fw-bold shadow-lg transition-all hover-up mb-3"
                  >
                    <i className="fas fa-file-invoice me-2"></i>
                    Review Bill & Pay
                  </button>
                  <p className="xsmall text-muted text-center mb-0 px-3">
                    Secure 256-bit encrypted transaction processed by Razorpay Network.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Back to Menu Action */}
        <div className="text-center mt-5">
           <Link to="/menu" className="btn btn-link text-dark opacity-50 hover-opacity-100 transition-all text-decoration-none fw-bold">
              <i className="fas fa-chevron-left me-2"></i> Continue Exploring Flavors
           </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
