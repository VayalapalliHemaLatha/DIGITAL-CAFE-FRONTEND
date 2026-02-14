import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getChefOrders, updateChefOrderStatus } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';
const REFRESH_EVENT = 'orders-refresh';

function ChefOrdersPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isChef = roleType === 'chef';

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchList = useCallback(() => {
    setError('');
    setLoading(true);
    getChefOrders()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load orders.');
      })
      .finally(() => setLoading(false));
  }, [handleAuthFailure]);

  useEffect(() => {
    if (!isChef) {
      navigate('/', { replace: true });
      return;
    }
    fetchList();
  }, [isChef, navigate, fetchList]);

  useEffect(() => {
    const onRefresh = () => fetchList();
    window.addEventListener(REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(REFRESH_EVENT, onRefresh);
  }, [fetchList]);

  const handleStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    setError('');
    try {
      await updateChefOrderStatus(orderId, { status });
      window.dispatchEvent(new CustomEvent(REFRESH_EVENT));
      fetchList();
    } catch (err) {
      if (err.response?.status === 401) handleAuthFailure();
      else setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isChef) return null;

  return (
    <>
      <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Orders to prepare</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Orders to prepare</h1>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="auth-card p-4 p-lg-5">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
              ) : list.length === 0 ? (
                <p className="text-muted mb-0">No orders to prepare.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Table</th>
                        <th>Status</th>
                        <th>Items</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((o) => (
                        <tr key={o.id}>
                          <td>{o.id}</td>
                          <td>{o.userName || '—'}</td>
                          <td>{o.tableNumber || o.tableId}</td>
                          <td><span className={`badge ${o.status === 'ready' ? 'bg-success' : o.status === 'preparing' ? 'bg-info' : 'bg-secondary'}`}>{o.status}</span></td>
                          <td className="small">
                            {(o.items || []).map((item, i) => `${item.itemName} x${item.quantity}`).join(', ') || '—'}
                          </td>
                          <td className="text-end">
                            {o.status === 'placed' && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-info me-1"
                                onClick={() => handleStatus(o.id, 'preparing')}
                                disabled={updatingId === o.id}
                              >
                                {updatingId === o.id ? <span className="spinner-border spinner-border-sm" /> : 'Mark preparing'}
                              </button>
                            )}
                            {(o.status === 'placed' || o.status === 'preparing') && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleStatus(o.id, 'ready')}
                                disabled={updatingId === o.id}
                              >
                                {updatingId === o.id ? <span className="spinner-border spinner-border-sm" /> : 'Mark ready'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChefOrdersPage;
