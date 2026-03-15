import React from 'react';

const TestPage = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>🎉 Test Page Working!</h1>
      <p>If you can see this, the routing is working correctly.</p>
      <div style={{ marginTop: '20px' }}>
        <h3>Your Complete Digital Cafe Features:</h3>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li>🍽️ Menu Page - Browse food items</li>
          <li>🛒 Cart Page - Manage your order</li>
          <li>💳 Checkout Page - Razorpay payment</li>
          <li>📋 Order History - Track orders</li>
          <li>⚙️ Admin Dashboard - Manage orders</li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage;
