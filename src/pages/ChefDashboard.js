import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChefDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaidOrders();
  }, []);

  const fetchPaidOrders = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/orders?payment_status=PAID');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPreparing = async (orderId) => {
    try {
      await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, { status: 'PREPARING' });
      // Refresh orders list
      fetchPaidOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading orders...</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>Chef Dashboard</h1>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <p style={{ color: '#666' }}>No paid orders available for preparation</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{ 
              backgroundColor: 'white', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <div>
                  <h3 style={{ margin: '0', color: '#333' }}>Order #{order.id}</h3>
                  <p style={{ margin: '5px 0', color: '#666' }}>Customer: {order.customerName}</p>
                  <p style={{ margin: '5px 0', color: '#666' }}>Total: ${order.total?.toFixed(2) || '0.00'}</p>
                </div>
                <button
                  onClick={() => handleStartPreparing(order.id)}
                  style={{
                    backgroundColor: '#ff6b35',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  Start Preparing
                </button>
              </div>
              
              <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Items:</h4>
                {order.items?.map((item, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    marginBottom: '5px',
                    color: '#666'
                  }}>
                    <span>{item.name} x{item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChefDashboard;
