import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCustomerOrders } from '../api';
import { authApi } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';

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
      const customerId = user?.id ?? 1;
      const ordersData = await getCustomerOrders(customerId);
      setOrders(Array.isArray(ordersData) ? ordersData : []);
    } catch (err) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'placed') return 'bg-warning text-dark';
    if (s === 'preparing') return 'bg-info';
    if (s === 'ready') return 'bg-primary';
    if (s === 'served') return 'bg-secondary';
    if (s === 'cancelled') return 'bg-danger';
    return 'bg-secondary';
  };

  const getPaymentBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'paid') return 'bg-success';
    if (s === 'pending') return 'bg-warning text-dark';
    if (s === 'failed') return 'bg-danger';
    return 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="min-vh-50 d-flex align-items-center justify-content-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="hero-header hero-page"
        style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}
      >
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">My Orders</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">My Orders</h1>
          <p className="text-white-50 mb-0 mt-1">View and track your order history</p>
        </div>
      </div>

      <div className="container py-5">
        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            {error}
            <button type="button" className="btn-close ms-auto" aria-label="Close" onClick={fetchOrders} />
          </div>
        )}

        {orders.length === 0 ? (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <h3 className="text-muted">No orders yet</h3>
              <p className="text-muted mb-4">Place an order from the menu to see it here.</p>
              <Link to="/menu" className="btn btn-primary">Browse Menu</Link>
            </div>
          </div>
        ) : (
          <div className="row g-4">
            {orders.map((order) => (
              <div key={order.id} className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">
                      <div>
                        <h5 className="card-title mb-1">Order #{order.id}</h5>
                        <p className="text-muted small mb-0">
                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleString()
                            : 'Date not available'}
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <span className={`badge ${getStatusBadge(order.status)}`}>
                          {order.status?.toUpperCase() || 'N/A'}
                        </span>
                        <span className={`badge ${getPaymentBadge(order.paymentStatus)}`}>
                          {order.paymentStatus?.toUpperCase() || 'N/A'}
                        </span>
                      </div>
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="bg-light rounded p-3 mb-3">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="d-flex justify-content-between small"
                          >
                            <span>{item.name} x{item.quantity}</span>
                            <span className="fw-semibold">
                              Rs {(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="small">
                        <span className="fw-semibold">Total: Rs {order.total?.toFixed(2) || '0.00'}</span>
                        {order.cafeName && (
                          <span className="text-muted ms-2"> at {order.cafeName}</span>
                        )}
                      </div>
                      <Link to={`/orders/${order.id}`} className="btn btn-outline-primary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistoryPage;
