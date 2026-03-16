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
              <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Chef Avatar" className="rounded-circle me-2" style={{ width: '32px', height: '32px', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }} />
              <i className="fas fa-user-circle fa-lg shadow-sm" style={{ color: '#f97316', display: 'none' }}></i>
              <span className="fw-medium">{user?.email ?? 'chef@user.com'}</span>
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
            // Realistic Mock Orders when empty
            <div className="row g-3">
              {[
                { id: '1046', table: '4 (Window Seat)', loc: 'Main Floor', status: 'placed', time: 'Just now', items: [{ q: 2, name: 'Truffle Mushroom Burger', img: '1568901346375-23c9450c58cd', note: 'No onions' }, { q: 1, name: 'Sweet Potato Fries', img: '1576458088443-04a19bb13da6', note: '' }] },
                { id: '1047', table: '12 (Patio)', loc: 'Outdoors', status: 'placed', time: '3m ago', items: [{ q: 1, name: 'Vegan Caesar Salad', img: '1512621776951-a57141f2eefd', note: 'Dressing on side' }] },
                { id: '1048', table: '2 (Bar)', loc: 'Lounge', status: 'placed', time: '5m ago', items: [{ q: 3, name: 'Iced Caramel Latte', img: '1461023058943-07fc0e6974fc', note: '' }, { q: 2, name: 'Blueberry Muffin', img: '1606890737304-57a1ca8a5b62', note: 'Warm it up' }] },
                { id: '1044', table: '8 (Booth)', loc: 'Premium Area', status: 'preparing', time: '12m ago', items: [{ q: 1, name: 'Margherita Pizza', img: '1565299624946-b28f40a0ae38', note: 'Extra crispy' }, { q: 2, name: 'Garlic Bread', img: '1573140247632-f8fd74997d5c', note: '' }] },
                { id: '1045', table: '3 (Main)', loc: 'Center', status: 'preparing', time: '18m ago', items: [{ q: 2, name: 'Spicy Chicken Wings', img: '1569058251540-dfa3b83b3e23', note: 'Extra spicy dip' }] },
                { id: '1043', table: '4 (Window Seat)', loc: 'Main Floor', status: 'ready', time: 'Ready 2m ago', items: [{ q: 1, name: 'Double Cheese Margherita', img: '1565299624946-b28f40a0ae38', note: '' }] }
              ].filter(o => {
                 if (filter === 'all') return true;
                 return o.status === filter;
              }).map((o, idx) => {
                const isPlaced = o.status === 'placed';
                const isPreparing = o.status === 'preparing';
                return (
                  <div key={idx} className="col-md-6 col-lg-4">
                    <div className={`chef-waiter-order-card shadow-sm border-0 ${isPlaced ? 'pending' : isPreparing ? 'preparing' : 'ready'}`} style={{ borderLeft: `4px solid ${isPlaced ? '#f97316' : isPreparing ? '#0ea5e9' : '#10b981'}` }}>
                      <div className="d-flex justify-content-between mb-2 align-items-center">
                        <div>
                          <span className="chef-waiter-order-id fw-bold text-dark fs-5 me-2">#{o.id}</span>
                          <span className={`badge ${isPlaced ? 'bg-warning text-dark' : isPreparing ? 'bg-info text-dark' : 'bg-success'}`}>
                            {isPlaced ? <><i className="far fa-clock me-1"></i>WAITING</> : isPreparing ? <><i className="fas fa-blender me-1"></i>PREPARING</> : <><i className="fas fa-check-circle me-1"></i>READY</>}
                          </span>
                        </div>
                        <span className={`small fw-bold ${isPlaced ? 'text-danger' : isPreparing ? 'text-primary' : 'text-success'}`}>{o.time}</span>
                      </div>
                      <div className="chef-waiter-order-meta d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded border-bottom">
                         <div>
                           <div className="fw-bold text-dark small"><i className="fas fa-chair text-primary me-2"></i>Table {o.table}</div>
                           <div className="text-muted" style={{ fontSize: '0.75rem' }}>{o.loc}</div>
                         </div>
                      </div>
                      <ul className="chef-waiter-order-items list-unstyled mb-3">
                        {o.items.map((item, i) => (
                          <li key={i} className="mb-3 pb-3 border-bottom d-flex align-items-center">
                            <div className="position-relative me-3">
                              <img src={`https://images.unsplash.com/photo-${item.img}?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80`} alt={item.name} className="rounded shadow-sm" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow">{item.q}</span>
                            </div>
                            <div className="flex-grow-1">
                              <div className="fw-bold text-dark small">{item.name}</div>
                              {item.note && <div className="text-warning fw-medium mt-1" style={{ fontSize: '0.75rem' }}><i className="fas fa-exclamation-triangle me-1"></i>{item.note}</div>}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="d-flex gap-2 mt-auto pt-2">
                        {isPlaced && (
                          <button type="button" className="btn btn-primary shadow-sm flex-grow-1 fw-bold"><i className="fas fa-fire me-2"></i>START PREPARING</button>
                        )}
                        {(isPlaced || isPreparing) && (
                          <button type="button" className="btn btn-success shadow-sm flex-grow-1 fw-bold"><i className="fas fa-check-double me-2"></i>MARK READY</button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="row g-3">
              {filteredList.map((o) => {
                const status = (o.status || '').toLowerCase();
                const isPlaced = status === 'placed';
                const isPreparing = status === 'preparing';
                return (
                  <div key={o.id} className="col-md-6 col-lg-4">
                    <div className={`chef-waiter-order-card shadow-sm border-0 ${isPlaced ? 'pending' : isPreparing ? 'preparing' : 'ready'}`} style={{ borderLeft: `4px solid ${isPlaced ? '#f97316' : isPreparing ? '#0ea5e9' : '#10b981'}` }}>
                      <div className="d-flex justify-content-between mb-2">
                        <span className="chef-waiter-order-id fw-bold text-dark">#ORD{o.id}</span>
                        <span className={`badge ${isPlaced ? 'bg-warning text-dark' : isPreparing ? 'bg-info text-dark' : 'bg-success'}`}>
                          {status.toUpperCase()}
                        </span>
                      </div>
                      <div className="chef-waiter-order-meta text-muted small mb-3">Today | <i className="fas fa-chair ms-1 me-1"></i>Table {o.tableNumber || o.tableId}</div>
                      <ul className="chef-waiter-order-items list-unstyled bg-light p-2 rounded mb-3">
                        {(o.items || []).map((item, i) => (
                          <li key={i} className="mb-2 pb-2 border-bottom d-flex align-items-center">
                            <div className="position-relative me-2">
                              {item.image ? (
                                <img src={item.image} alt={item.itemName || item.name} className="rounded" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                              ) : (
                                <div className="bg-secondary rounded d-flex align-items-center justify-content-center text-white small" style={{ width: '40px', height: '40px' }}><i className="fas fa-utensils"></i></div>
                              )}
                              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light" style={{ fontSize: '0.65rem' }}>{item.quantity}</span>
                            </div>
                            <div className="flex-grow-1 ms-2">
                               <div className="fw-medium text-dark small">{item.itemName || item.name}</div>
                               {item.note && <div className="text-warning" style={{ fontSize: '0.65rem' }}><i className="fas fa-sticky-note me-1"></i>{item.note}</div>}
                            </div>
                          </li>
                        ))}
                      </ul>
                      <div className="d-flex gap-2 mt-2">
                        {isPlaced && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm flex-grow-1 shadow-sm"
                            onClick={() => handleStatus(o.id, 'preparing')}
                            disabled={updatingId === o.id}
                          >
                            {updatingId === o.id ? <span className="spinner-border spinner-border-sm" /> : <><i className="fas fa-fire me-1"></i>Start</>}
                          </button>
                        )}
                        {(isPlaced || isPreparing) && (
                          <button
                            type="button"
                            className="btn btn-success btn-sm flex-grow-1 shadow-sm"
                            onClick={() => handleStatus(o.id, 'ready')}
                            disabled={updatingId === o.id}
                          >
                            {updatingId === o.id ? <span className="spinner-border spinner-border-sm" /> : <><i className="fas fa-check me-1"></i>Ready</>}
                          </button>
                        )}
                      </div>
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
