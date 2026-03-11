import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getWaiterOrdersReady, getWaiterOrders, updateWaiterOrderStatus } from '../api';
import WaiterSidebar from '../components/WaiterSidebar';
import '../styles/ChefWaiterDashboard.css';
import '../styles/AdminDashboard.css';

const REFRESH_EVENT = 'orders-refresh';

function WaiterDashboardPage({ onAuthChange }) {
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

  const activeCount = allList.filter((o) => ['placed', 'preparing', 'ready'].includes((o.status || '').toLowerCase())).length;
  const servedTodayCount = allList.filter((o) => {
    if ((o.status || '').toLowerCase() !== 'served') return false;
    const today = new Date().toISOString().slice(0, 10);
    return (o.orderDate || o.servedAt || '').slice(0, 10) === today;
  }).length;

  if (!isWaiter) return null;

  return (
    <div className="chef-waiter-layout waiter-dashboard">
      <WaiterSidebar />
      <div className="chef-waiter-main">
        <header className="chef-waiter-header">
          <div>
            <h1 className="chef-waiter-header-title">Waiter Dashboard</h1>
            <p className="chef-waiter-header-subtitle">Table service & order delivery</p>
          </div>
          <div className="chef-waiter-header-right">
            <input type="text" className="form-control form-control-sm" placeholder="Search..." style={{ maxWidth: 200 }} />
            <button type="button" className="btn btn-sm btn-outline-secondary" aria-label="Notifications">
              <i className="fas fa-bell"></i>
            </button>
            <div className="chef-waiter-user">
              <i className="fas fa-user-circle fa-lg" style={{ color: '#2563eb' }}></i>
              <span>{user?.email ?? 'waiter@demo.com'}</span>
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
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-4">
                  <div className="chef-waiter-summary-card">
                    <div className="chef-waiter-summary-icon red"><i className="fas fa-utensils"></i></div>
                    <div>
                      <div className="chef-waiter-summary-value">{readyList.length}</div>
                      <div className="chef-waiter-summary-label">Ready to Serve</div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="chef-waiter-summary-card">
                    <div className="chef-waiter-summary-icon orange"><i className="fas fa-clipboard-list"></i></div>
                    <div>
                      <div className="chef-waiter-summary-value">{activeCount}</div>
                      <div className="chef-waiter-summary-label">Active Orders</div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="chef-waiter-summary-card">
                    <div className="chef-waiter-summary-icon green"><i className="fas fa-check-circle"></i></div>
                    <div>
                      <div className="chef-waiter-summary-value">{servedTodayCount}</div>
                      <div className="chef-waiter-summary-label">Served Today</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="mb-1"><i className="fas fa-info-circle text-info me-2"></i>Ready Orders</h5>
                <p className="text-muted small mb-3">Orders prepared by the kitchen - serve immediately</p>
                {readyList.length === 0 ? (
                  <div className="empty-state-box">No orders ready to serve.</div>
                ) : (
                  <div className="row g-3">
                    {readyList.map((o) => (
                      <div key={o.id} className="col-lg-6">
                        <div className="chef-waiter-order-card ready">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <span className="chef-waiter-order-id">#{o.id}</span>
                            <span className="badge bg-success">READY</span>
                          </div>
                          <div className="chef-waiter-order-meta">Customer {o.userName || o.userId} • in 20m ago</div>
                          <ul className="chef-waiter-order-items">
                            {(o.items || []).map((item, i) => (
                              <li key={i}>{item.quantity}x {item.itemName} (₹{item.unitPrice != null ? Number(item.unitPrice).toFixed(0) : '0'} each)</li>
                            ))}
                          </ul>
                          {o.note && <p className="small text-muted mb-2">Note: {o.note}</p>}
                          <div className="chef-waiter-order-total">Total: ₹{o.totalAmount != null ? Number(o.totalAmount).toFixed(2) : '0.00'}</div>
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => handleServed(o.id)}
                            disabled={updatingId === o.id}
                          >
                            {updatingId === o.id ? <span className="spinner-border spinner-border-sm me-1" /> : <i className="fas fa-check me-1"></i>}
                            Mark As Served
                          </button>
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

export default WaiterDashboardPage;
