import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getWaiterOrdersReady, getWaiterOrders, updateWaiterOrderStatus } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';
const REFRESH_EVENT = 'orders-refresh';

function WaiterOrdersPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isWaiter = roleType === 'waiter';

  const [readyList, setReadyList] = useState([]);
  const [allList, setAllList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchData = useCallback(() => {
    setError('');
    setLoading(true);
    Promise.all([getWaiterOrdersReady(), getWaiterOrders()])
      .then(([ready, all]) => {
        setReadyList(Array.isArray(ready) ? ready : []);
        setAllList(Array.isArray(all) ? all : []);
      })
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
    if (!isWaiter) {
      navigate('/', { replace: true });
      return;
    }
    fetchData();
  }, [isWaiter, navigate, fetchData]);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener(REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(REFRESH_EVENT, onRefresh);
  }, [fetchData]);

  const handleServed = async (orderId) => {
    setUpdatingId(orderId);
    setError('');
    try {
      await updateWaiterOrderStatus(orderId, { status: 'served' });
      window.dispatchEvent(new CustomEvent(REFRESH_EVENT));
      fetchData();
    } catch (err) {
      if (err.response?.status === 401) handleAuthFailure();
      else setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update.');
    } finally {
      setUpdatingId(null);
    }
  };

  if (!isWaiter) return null;

  return (
    <>
      <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">Orders</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Orders</h1>
          <p className="text-white-50 mb-0 mt-1">Ready to serve &amp; all orders</p>
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
              ) : (
                <>
                  <h5 className="mb-3">Ready to serve</h5>
                  {readyList.length === 0 ? (
                    <p className="text-muted mb-4">No orders ready to serve.</p>
                  ) : (
                    <div className="table-responsive mb-5">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>ID</th>
                            <th>Table</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th className="text-end">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {readyList.map((o) => (
                            <tr key={o.id}>
                              <td>{o.id}</td>
                              <td>{o.tableNumber || o.tableId}</td>
                              <td>{o.userName || '—'}</td>
                              <td>{o.totalAmount != null ? Number(o.totalAmount).toFixed(2) : '—'}</td>
                              <td className="text-end">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleServed(o.id)}
                                  disabled={updatingId === o.id}
                                >
                                  {updatingId === o.id ? <span className="spinner-border spinner-border-sm" /> : 'Mark served'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <h5 className="mb-3">All orders</h5>
                  {allList.length === 0 ? (
                    <p className="text-muted mb-0">No orders.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>ID</th>
                            <th>Table</th>
                            <th>Status</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {allList.map((o) => (
                            <tr key={o.id}>
                              <td>{o.id}</td>
                              <td>{o.tableNumber || o.tableId}</td>
                              <td><span className={`badge ${o.status === 'served' ? 'bg-success' : o.status === 'ready' ? 'bg-info' : 'bg-secondary'}`}>{o.status}</span></td>
                              <td>{o.totalAmount != null ? Number(o.totalAmount).toFixed(2) : '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WaiterOrdersPage;
