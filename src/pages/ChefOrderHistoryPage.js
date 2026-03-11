import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getChefOrders } from '../api';
import ChefSidebar from '../components/ChefSidebar';
import '../styles/ChefWaiterDashboard.css';
import '../styles/AdminDashboard.css';

function ChefOrderHistoryPage({ onAuthChange }) {
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

  if (!isChef) return null;

  return (
    <div className="chef-waiter-layout">
      <ChefSidebar />
      <div className="chef-waiter-main">
        <header className="chef-waiter-header">
          <div>
            <h1 className="chef-waiter-header-title">Chef Dashboard</h1>
            <p className="chef-waiter-header-subtitle">Order history</p>
          </div>
          <div className="chef-waiter-header-right">
            <div className="chef-waiter-user">
              <i className="fas fa-user-circle fa-lg" style={{ color: '#f97316' }}></i>
              <span>{user?.email ?? 'chef@user.com'}</span>
            </div>
          </div>
        </header>
        <div className="chef-waiter-content">
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
          ) : list.length === 0 ? (
            <div className="empty-state-box">No order history.</div>
          ) : (
            <div className="admin-chart-card">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Table</th>
                      <th>Status</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((o) => (
                      <tr key={o.id}>
                        <td>#{o.id}</td>
                        <td>{o.tableNumber || o.tableId}</td>
                        <td><span className={`badge ${o.status === 'ready' || o.status === 'served' ? 'bg-success' : 'bg-secondary'}`}>{o.status}</span></td>
                        <td className="small">{(o.items || []).map((i) => `${i.quantity}x ${i.itemName}`).join(', ') || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChefOrderHistoryPage;
