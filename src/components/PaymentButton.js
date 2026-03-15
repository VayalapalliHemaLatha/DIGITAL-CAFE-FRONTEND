import React, { useState } from 'react';
import axios from 'axios';

const PaymentButton = ({ orderId }) => {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`http://localhost:8080/api/payment/pay/${orderId}`);
      if (response.data) {
        alert('Payment Successful');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      style={{
        padding: '10px 20px',
        backgroundColor: loading ? '#cccccc' : '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '16px'
      }}
    >
      {loading ? 'Processing...' : 'Pay Now'}
    </button>
  );
};

export default PaymentButton;

