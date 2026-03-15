import React, { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus } from '../api';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const ordersData = await getAdminOrders();
      setOrders(ordersData || []);
    } catch (err) {
      setError('Failed to load orders');
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateOrderStatus(orderId, newStatus);
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      alert(`Order #${orderId} status updated to ${newStatus}`);
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
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

  const getStatusOptions = (currentStatus) => {
    const allStatuses = ['PLACED', 'PREPARING', 'READY', 'SERVED', 'CANCELLED'];
    return allStatuses.filter(status => status !== currentStatus?.toUpperCase());
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading admin dashboard...</h2>
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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Admin Dashboard</h1>
      
      {/* Dashboard Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: '#007bff',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Total Orders</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>{orders.length}</p>
        </div>
        
        <div style={{
          backgroundColor: '#28a745',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Paid Orders</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {orders.filter(order => order.paymentStatus === 'PAID').length}
          </p>
        </div>
        
        <div style={{
          backgroundColor: '#ffc107',
          color: 'black',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Pending</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {orders.filter(order => order.status === 'PLACED').length}
          </p>
        </div>
        
        <div style={{
          backgroundColor: '#17a2b8',
          color: 'white',
          padding: '20px',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Preparing</h3>
          <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold' }}>
            {orders.filter(order => order.status === 'PREPARING').length}
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ color: '#666' }}>No orders found</h3>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Order ID</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Items</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Amount</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Payment Status</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Order Status</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '15px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '15px' }}>
                    <strong>#{order.id}</strong>
                  </td>
                  <td style={{ padding: '15px' }}>
                    {order.customerName || 'Unknown'}
                  </td>
                  <td style={{ padding: '15px' }}>
                    {order.items && order.items.length > 0 ? (
                      <div>
                        {order.items.slice(0, 2).map((item, index) => (
                          <div key={index} style={{ fontSize: '12px', color: '#666' }}>
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                        {order.items.length > 2 && (
                          <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                            +{order.items.length - 2} more
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: '#666', fontStyle: 'italic' }}>No items</span>
                    )}
                  </td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>
                    ₹{order.total?.toFixed(2) || '0.00'}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: getPaymentStatusColor(order.paymentStatus)
                    }}>
                      {order.paymentStatus || 'UNKNOWN'}
                    </span>
                  </td>
                  <td style={{ padding: '15px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      color: 'white',
                      backgroundColor: getStatusColor(order.status)
                    }}>
                      {order.status || 'UNKNOWN'}
                    </span>
                  </td>
                  <td style={{ padding: '15px', fontSize: '12px', color: '#666' }}>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '15px' }}>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      disabled={updatingOrderId === order.id}
                      style={{
                        padding: '5px 10px',
                        borderRadius: '5px',
                        border: '1px solid #ddd',
                        fontSize: '12px',
                        cursor: updatingOrderId === order.id ? 'not-allowed' : 'pointer'
                      }}
                    >
                      {getStatusOptions(order.status).map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <button
          onClick={fetchOrders}
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
          Refresh Orders
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
