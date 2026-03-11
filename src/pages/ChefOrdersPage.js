import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getChefOrders, updateChefOrderStatus } from '../api';
import ChefSidebar from '../components/ChefSidebar';
import '../styles/ChefWaiterDashboard.css';

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
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

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

  const filteredList = useMemo(() => {
    let result = list;
    const f = (filter || '').toLowerCase();
    if (f === 'pending' || f === 'placed') result = list.filter((o) => (o.status || '').toLowerCase() === 'placed');
    else if (f === 'preparing') result = list.filter((o) => (o.status || '').toLowerCase() === 'preparing');
    else if (f === 'ready') result = list.filter((o) => (o.status || '').toLowerCase() === 'ready');
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (o) =>
          String(o.id).toLowerCase().includes(q) ||
          String(o.tableNumber || o.tableId).toLowerCase().includes(q)
      );
    }
    return result;
  }, [list, filter, search]);

  const pendingCount = list.filter((o) => (o.status || '').toLowerCase() === 'placed').length;
  const preparingCount = list.filter((o) => (o.status || '').toLowerCase() === 'preparing').length;
  const readyCount = list.filter((o) => (o.status || '').toLowerCase() === 'ready').length;

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
            <div className="chef-waiter-user">
              <i className="fas fa-user-circle fa-lg" style={{ color: '#f97316' }}></i>
              <span>{user?.email ?? 'chef@user.com'}</span>
            </div>
          </div>
        </header>

        <div className="chef-waiter-content">
          <div className="mb-3">
            <h2 className="h5 mb-1">Active Orders</h2>
            <p className="text-muted small mb-0">Manage and track all kitchen orders</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}

          <div className="chef-waiter-tabs mb-3">
            <button type="button" className={`chef-waiter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
              All Orders ({list.length})
            </button>
            <button type="button" className={`chef-waiter-tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>
              Pending ({pendingCount})
            </button>
            <button type="button" className={`chef-waiter-tab ${filter === 'preparing' ? 'active' : ''}`} onClick={() => setFilter('preparing')}>
              Preparing ({preparingCount})
            </button>
            <button type="button" className={`chef-waiter-tab ${filter === 'ready' ? 'active' : ''}`} onClick={() => setFilter('ready')}>
              Ready ({readyCount})
            </button>
            <button type="button" className="btn btn-sm btn-outline-primary ms-auto" onClick={fetchList}>
              <i className="fas fa-sync-alt me-1"></i> Refresh
            </button>
          </div>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search by order number or table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ maxWidth: 320 }}
            />
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="empty-state-box">No orders found.</div>
          ) : (
            <div className="row g-3">
              {filteredList.map((o) => {
                const status = (o.status || '').toLowerCase();
                const isPlaced = status === 'placed';
                const isPreparing = status === 'preparing';
                return (
                  <div key={o.id} className="col-md-6 col-lg-4">
                    <div className={`chef-waiter-order-card ${isPlaced ? 'pending' : isPreparing ? 'preparing' : 'ready'}`}>
                      <div className="chef-waiter-order-id">#ORD{o.id}</div>
                      <div className="mb-2">
                        <span className={`badge ${isPlaced ? 'bg-warning' : isPreparing ? 'bg-info' : 'bg-success'}`}>
                          {status.toUpperCase()}
                        </span>
                      </div>
                      <div className="chef-waiter-order-meta">Today | Table {o.tableNumber || o.tableId}</div>
                      <ul className="chef-waiter-order-items">
                        {(o.items || []).map((item, i) => (
                          <li key={i}>{item.quantity}x {item.itemName}</li>
                        ))}
                      </ul>
                      {isPlaced && (
                        <button
                          type="button"
                          className="btn btn-primary btn-sm"
                          onClick={() => handleStatus(o.id, 'preparing')}
                          disabled={updatingId === o.id}
                        >
                          {updatingId === o.id ? <span className="spinner-border spinner-border-sm" /> : 'Start Preparing'}
                        </button>
                      )}
                      {(isPlaced || isPreparing) && (
                        <button
                          type="button"
                          className="btn btn-success btn-sm ms-2"
                          onClick={() => handleStatus(o.id, 'ready')}
                          disabled={updatingId === o.id}
                        >
                          {updatingId === o.id ? <span className="spinner-border spinner-border-sm" /> : 'Mark Ready'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChefOrdersPage;
