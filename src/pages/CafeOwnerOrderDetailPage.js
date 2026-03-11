import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../api';
import { getCafeOwnerOrderById } from '../api';
import CafeOwnerLayout from '../components/CafeOwnerLayout';
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
      <CafeOwnerLayout title="Order">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </CafeOwnerLayout>
    );
  }

  return (
    <CafeOwnerLayout title={`Order #${order.id}`} subtitle="Order details">
      <div className="admin-chart-card">
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
    </CafeOwnerLayout>
  );
}

export default CafeOwnerOrderDetailPage;
