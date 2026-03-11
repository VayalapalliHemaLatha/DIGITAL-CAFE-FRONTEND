import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getChefOrders } from '../api';
import ChefSidebar from '../components/ChefSidebar';
import '../styles/AdminDashboard.css';
import '../styles/ChefWaiterDashboard.css';

const REFRESH_EVENT = 'orders-refresh';

function ChefDashboardPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isChef = roleType === 'chef';

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const pending = list.filter((o) => (o.status || '').toLowerCase() === 'placed');
  const preparing = list.filter((o) => (o.status || '').toLowerCase() === 'preparing');
  const ready = list.filter((o) => (o.status || '').toLowerCase() === 'ready');

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  if (!isChef) return null;

  return (
    <div className="chef-waiter-layout">
      <ChefSidebar />
      <div className="chef-waiter-main">
        <header className="chef-waiter-header">
          <div>
            <h1 className="chef-waiter-header-title">Chef Dashboard</h1>
            <p className="chef-waiter-header-subtitle">New order management</p>
          </div>
          <div className="chef-waiter-header-right">
            <span className="chef-waiter-datetime">{dateStr} | {timeStr}</span>
            <div className="chef-waiter-user">
              <i className="fas fa-user-circle fa-lg" style={{ color: '#f97316' }}></i>
              <span>{user?.email ?? 'chef@user.com'}</span>
            </div>
          </div>
        </header>

        <div className="chef-waiter-content">
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
                <div className="row g-3 flex-grow-1">
                  <div className="col-6 col-md-3">
                    <div className="chef-waiter-summary-card">
                      <div className="chef-waiter-summary-icon orange"><i className="fas fa-clipboard-list"></i></div>
                      <div>
                        <div className="chef-waiter-summary-value">{pending.length}</div>
                        <div className="chef-waiter-summary-label">Pending Orders</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="chef-waiter-summary-card">
                      <div className="chef-waiter-summary-icon blue"><i className="fas fa-blender"></i></div>
                      <div>
                        <div className="chef-waiter-summary-value">{preparing.length}</div>
                        <div className="chef-waiter-summary-label">Preparing</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="chef-waiter-summary-card">
                      <div className="chef-waiter-summary-icon green"><i className="fas fa-check-circle"></i></div>
                      <div>
                        <div className="chef-waiter-summary-value">{ready.length}</div>
                        <div className="chef-waiter-summary-label">Ready to Serve</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-6 col-md-3">
                    <div className="chef-waiter-summary-card">
                      <div className="chef-waiter-summary-icon purple"><i className="fas fa-chart-line"></i></div>
                      <div>
                        <div className="chef-waiter-summary-value">{list.length}</div>
                        <div className="chef-waiter-summary-label">Total Orders</div>
                      </div>
                    </div>
                  </div>
                </div>
                <button type="button" className="btn btn-primary" onClick={fetchList}>
                  <i className="fas fa-sync-alt me-1"></i> Refresh
                </button>
              </div>

              <div className="mb-4">
                <h5 className="mb-2"><i className="fas fa-fire text-warning me-2"></i>Pending Orders</h5>
                {pending.length === 0 ? (
                  <div className="empty-state-box">
                    No pending orders. New orders will appear here in real-time.
                  </div>
                ) : (
                  <div className="row g-3">
                    {pending.slice(0, 4).map((o) => (
                      <div key={o.id} className="col-md-6 col-lg-4">
                        <div className="chef-waiter-order-card pending">
                          <div className="chef-waiter-order-id">#{o.id}</div>
                          <div className="chef-waiter-order-meta">Table {o.tableNumber || o.tableId}</div>
                          <ul className="chef-waiter-order-items">
                            {(o.items || []).map((item, i) => (
                              <li key={i}>{item.quantity}x {item.itemName}</li>
                            ))}
                          </ul>
                          <Link to="/chef/orders" className="btn btn-sm btn-primary">Start Preparing</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h5 className="mb-2"><i className="fas fa-fire text-warning me-2"></i>Now Preparing</h5>
                {preparing.length === 0 ? (
                  <div className="empty-state-box">
                    No orders being prepared.
                  </div>
                ) : (
                  <div className="row g-3">
                    {preparing.slice(0, 4).map((o) => (
                      <div key={o.id} className="col-md-6 col-lg-4">
                        <div className="chef-waiter-order-card preparing">
                          <div className="chef-waiter-order-id">#{o.id}</div>
                          <div className="chef-waiter-order-meta">Table {o.tableNumber || o.tableId}</div>
                          <ul className="chef-waiter-order-items">
                            {(o.items || []).map((item, i) => (
                              <li key={i}>{item.quantity}x {item.itemName}</li>
                            ))}
                          </ul>
                          <Link to="/chef/orders" className="btn btn-sm btn-success">Mark Ready</Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChefDashboardPage;
