import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    
    // Calculate totals
    const subtotal = getTotalPrice();
    const tax = subtotal * 0.05;
    const delivery = 20;
    const total = subtotal + tax + delivery;
    
    // Store payment data and go directly to payment
    const paymentData = {
      amount: Math.max(100, Math.round(total * 100)), // Minimum 100 paise (₹1)
      items: items,
      subtotal: subtotal,
      tax: tax,
      delivery: delivery,
      total: total
    };
    localStorage.setItem('paymentData', JSON.stringify(paymentData));
    navigate('/checkout'); // This will show payment directly
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: '#666', marginBottom: '20px' }}>Your cart is empty</h3>
          <button
            onClick={() => navigate('/menu')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div style={{ marginBottom: '30px' }}>
            {items.map(item => (
              <div key={item.id} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                marginBottom: '10px',
                backgroundColor: 'white'
              }}>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginRight: '15px'
                    }}
                  />
                )}
                
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>{item.name}</h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                    ₹{item.price} each
                  </p>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginRight: '15px'
                }}>
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: '1px solid #ddd',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    -
                  </button>
                  
                  <span style={{
                    minWidth: '30px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      border: '1px solid #ddd',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer',
                      fontSize: '16px'
                    }}
                  >
                    +
                  </button>
                </div>
                
                <div style={{
                  textAlign: 'right',
                  marginRight: '15px',
                  minWidth: '80px'
                }}>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
                
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    padding: '5px 10px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '20px',
            backgroundColor: '#f8f9fa'
          }}>
            <div style={{ marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Total Items:</span>
                <span style={{ fontWeight: 'bold' }}>{totalItems}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Subtotal:</span>
                <span style={{ fontWeight: 'bold' }}>₹{totalPrice.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Tax (5%):</span>
                <span style={{ fontWeight: 'bold' }}>₹{(totalPrice * 0.05).toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span>Delivery Fee:</span>
                <span style={{ fontWeight: 'bold' }}>₹20.00</span>
              </div>
              
              <hr style={{ margin: '15px 0' }} />
              
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total:</span>
                <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#007bff' }}>
                  ₹{(totalPrice * 1.05 + 20).toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleCheckout}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }}
              >
                Proceed to Payment
              </button>
              
              <button
                onClick={clearCart}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <button
              onClick={() => navigate('/menu')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              ← Continue Shopping
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
