import React, { useState, useEffect } from 'react';
import { getCustomerOrders } from '../api';
import { authApi } from '../api';

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const user = authApi.getUser();
      const customerId = user?.id || 1; // Default to 1 for demo
      
      const ordersData = await getCustomerOrders(customerId);
      setOrders(ordersData);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'placed':
        return '#ffc107';
      case 'preparing':
        return '#17a2b8';
      case 'ready':
        return '#28a745';
      case 'served':
        return '#6c757d';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'failed':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading your orders...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>{error}</h2>
        <button onClick={fetchOrders} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Order History</h1>
      
      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ color: '#666', marginBottom: '20px' }}>No orders found</h3>
          <p style={{ color: '#666', marginBottom: '20px' }}>You haven't placed any orders yet.</p>
          <button
            onClick={() => window.location.href = '/menu'}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {orders.map(order => (
            <div key={order.id} style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '20px',
              backgroundColor: 'white',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              {/* Order Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                paddingBottom: '15px',
                borderBottom: '1px solid #eee'
              }}>
                <div>
                  <h3 style={{ margin: '0 0 5px 0', color: '#333' }}>Order #{order.id}</h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                    {new Date(order.orderDate).toLocaleDateString()} at {new Date(order.orderDate).toLocaleTimeString()}
                  </p>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getStatusColor(order.status),
                    marginBottom: '5px'
                  }}>
                    {order.status?.toUpperCase() || 'UNKNOWN'}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: 'white',
                    backgroundColor: getPaymentStatusColor(order.paymentStatus),
                    marginLeft: '5px'
                  }}>
                    {order.paymentStatus?.toUpperCase() || 'UNKNOWN'}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>Items:</h4>
                {order.items && order.items.length > 0 ? (
                  <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px' }}>
                    {order.items.map((item, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '5px',
                        paddingBottom: '5px',
                        borderBottom: index < order.items.length - 1 ? '1px solid #ddd' : 'none'
                      }}>
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span style={{ fontWeight: 'bold' }}>
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>No items details available</p>
                )}
              </div>

              {/* Order Summary */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                    <strong>Total Amount:</strong> ₹{order.total?.toFixed(2) || '0.00'}
                  </p>
                  {order.cafeName && (
                    <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                      <strong>Cafe:</strong> {order.cafeName}
                    </p>
                  )}
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <button
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                    onClick={() => alert(`Order details for Order #${order.id} would be shown here`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
