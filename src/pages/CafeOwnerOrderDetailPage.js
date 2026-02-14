import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../api';
import { getCafeOwnerOrderById } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';
const REFRESH_EVENT = 'orders-refresh';

function CafeOwnerOrderDetailPage({ onAuthChange }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isCafeOwner = roleType === 'cafeowner';
  const orderId = id ? parseInt(id, 10) : null;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchOrder = useCallback(() => {
    if (!orderId) return;
    setError('');
    setLoading(true);
    getCafeOwnerOrderById(orderId)
      .then(setOrder)
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load order.');
      })
      .finally(() => setLoading(false));
  }, [orderId, handleAuthFailure]);

  useEffect(() => {
    if (!isCafeOwner) {
      navigate('/', { replace: true });
      return;
    }
    if (!orderId) {
      navigate('/cafeowner/orders', { replace: true });
      return;
    }
    fetchOrder();
  }, [isCafeOwner, orderId, navigate, fetchOrder]);

  useEffect(() => {
    const onRefresh = () => fetchOrder();
    window.addEventListener(REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(REFRESH_EVENT, onRefresh);
  }, [fetchOrder]);

  if (!isCafeOwner) return null;

  if (loading || !order) {
    return (
      <>
        <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
          <div className="container py-4">
            <h1 className="display-6 text-white fw-bold mb-0">Order</h1>
          </div>
        </div>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item text-white">Cafe Owner</li>
              <li className="breadcrumb-item"><Link to="/cafeowner/orders" className="text-primary">Orders</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Order #{order.id}</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Order #{order.id}</h1>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="auth-card p-4 p-lg-5">
              {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}
              <p><strong>Status:</strong> <span className={`badge ${order.status === 'served' ? 'bg-success' : order.status === 'ready' ? 'bg-info' : 'bg-secondary'}`}>{order.status}</span></p>
              <p><strong>Customer:</strong> {order.userName || `User #${order.userId}`}</p>
              <p><strong>Cafe:</strong> {order.cafeName || order.cafeId}</p>
              <p><strong>Table:</strong> {order.tableNumber || order.tableId}</p>
              {order.orderDate && <p><strong>Date & time:</strong> {order.orderDate} {order.orderTime}</p>}
              {order.items && order.items.length > 0 && (
                <>
                  <h6 className="mt-3">Items</h6>
                  <table className="table table-sm">
                    <thead><tr><th>Item</th><th>Qty</th><th>Unit price</th><th>Subtotal</th></tr></thead>
                    <tbody>
                      {order.items.map((item, i) => (
                        <tr key={item.id || i}>
                          <td>{item.itemName}</td>
                          <td>{item.quantity}</td>
                          <td>{item.unitPrice != null ? Number(item.unitPrice).toFixed(2) : '—'}</td>
                          <td>{item.subtotal != null ? Number(item.subtotal).toFixed(2) : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              <p className="mb-0"><strong>Total:</strong> {order.totalAmount != null ? Number(order.totalAmount).toFixed(2) : '—'}</p>
              <Link to="/cafeowner/orders" className="btn btn-outline-primary mt-3">Back to orders</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CafeOwnerOrderDetailPage;
