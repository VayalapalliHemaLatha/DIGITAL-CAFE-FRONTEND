import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getChefOrders } from '../api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
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
              <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Chef Avatar" className="rounded-circle me-2" style={{ width: '32px', height: '32px', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }} />
              <i className="fas fa-user-circle fa-lg shadow-sm" style={{ color: '#f97316', display: 'none' }}></i>
              <span className="fw-medium">{user?.email ?? 'chef@user.com'}</span>
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
                    {pending.length > 0 ? pending.slice(0, 4).map((o) => (
                      <div key={o.id} className="col-md-6 col-lg-4">
                        <div className="chef-waiter-order-card pending">
                          <div className="chef-waiter-order-id">#{o.id}</div>
                          <div className="chef-waiter-order-meta">Table {o.tableNumber || o.tableId}</div>
                          <ul className="chef-waiter-order-items list-unstyled">
                            {(o.items || []).map((item, i) => (
                              <li key={i} className="mb-2 pb-2 border-bottom d-flex align-items-center">
                                <span className="badge bg-secondary me-2">{item.quantity}x</span>
                                <div className="flex-grow-1 fw-medium">{item.itemName}</div>
                              </li>
                            ))}
                          </ul>
                          <Link to="/chef/orders" className="btn btn-sm btn-primary w-100 mt-2 shadow-sm">Start Preparing</Link>
                        </div>
                      </div>
                    )) : (
                      // Mock Realistic Data
                      [
                        { id: '1046', table: '4', items: [{ q: 2, name: 'Truffle Mushroom Burger', img: '1568901346375-23c9450c58cd' }, { q: 1, name: 'Sweet Potato Fries', img: '1576458088443-04a19bb13da6' }] },
                        { id: '1047', table: '12', items: [{ q: 1, name: 'Vegan Caesar Salad', img: '1512621776951-a57141f2eefd' }] },
                        { id: '1048', table: '2', items: [{ q: 3, name: 'Iced Caramel Latte', img: '1461023058943-07fc0e6974fc' }, { q: 2, name: 'Blueberry Muffin', img: '1606890737304-57a1ca8a5b62' }] }
                      ].map((o, idx) => (
                        <div key={idx} className="col-md-6 col-lg-4">
                          <div className="chef-waiter-order-card pending shadow-sm border-0" style={{ borderLeft: '4px solid #f97316' }}>
                            <div className="d-flex justify-content-between mb-2">
                              <span className="chef-waiter-order-id fw-bold text-dark">#{o.id}</span>
                              <span className="badge bg-warning text-dark"><i className="far fa-clock me-1"></i>{(idx + 1) * 3}m ago</span>
                            </div>
                            <div className="chef-waiter-order-meta text-muted small mb-3"><i className="fas fa-chair me-1"></i>Table {o.table}</div>
                            <ul className="chef-waiter-order-items list-unstyled mb-3">
                              {o.items.map((item, i) => (
                                <li key={i} className="mb-2 pb-2 border-bottom d-flex align-items-center">
                                  <img src={`https://images.unsplash.com/photo-${item.img}?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&q=80`} alt={item.name} className="rounded me-3" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                                  <span className="badge bg-secondary me-2">{item.q}x</span>
                                  <div className="flex-grow-1 fw-medium text-dark">{item.name}</div>
                                </li>
                              ))}
                            </ul>
                            <Link to="/chef/orders" className="btn btn-sm btn-primary w-100 mt-2 shadow-sm"><i className="fas fa-fire me-1"></i>Start Preparing</Link>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="row g-4 mb-4">
                <div className="col-lg-8">
                  <div className="admin-chart-card shadow-sm border-0">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h6 className="admin-chart-title mb-1">Kitchen Efficiency Index</h6>
                        <p className="text-muted small mb-0">Order volume vs. Avg. Prep Time (Last 7 Days)</p>
                      </div>
                      <div className="badge bg-soft-success text-success px-3 py-2">
                        <i className="fas fa-bolt me-1"></i> Efficiency: 94%
                      </div>
                    </div>
                    <ResponsiveContainer width="100%" height={260}>
                      <BarChart data={[
                        { day: 'Mon', orders: 45, time: 12 },
                        { day: 'Tue', orders: 52, time: 10 },
                        { day: 'Wed', orders: 38, time: 15 },
                        { day: 'Thu', orders: 65, time: 9 },
                        { day: 'Fri', orders: 85, time: 11 },
                        { day: 'Sat', orders: 120, time: 14 },
                        { day: 'Sun', orders: 110, time: 13 },
                      ]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Legend iconType="circle" />
                        <Bar dataKey="orders" name="Orders Handled" fill="#f97316" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="time" name="Avg Prep Time (min)" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="card shadow-sm border-0 h-100" style={{ borderRadius: '16px' }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-3 d-flex align-items-center">
                        <i className="fas fa-exclamation-triangle text-danger me-2"></i> Low Stock Alerts
                      </h6>
                      <div className="list-group list-group-flush">
                        {[
                          { item: 'Avocado (Premium)', stock: '3 units', img: '1512621776951-a57141f2eefd', status: 'Critical' },
                          { item: 'Truffle Oil', stock: '250ml', img: '1568901346375-23c9450c58cd', status: 'Warning' },
                          { item: 'Mozzarella Cheese', stock: '1.2kg', img: '1565299624946-b28f40a0ae38', status: 'Low' }
                        ].map((s, i) => (
                          <div key={i} className="list-group-item px-0 py-3 border-bottom d-flex align-items-center">
                            <img src={`https://images.unsplash.com/photo-${s.img}?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&h=40&q=80`} alt="" className="rounded shadow-sm me-3" style={{ width: '40px', height: '40px', objectFit: 'cover' }} />
                            <div className="flex-grow-1">
                              <div className="fw-bold small text-dark">{s.item}</div>
                              <div className="text-muted" style={{ fontSize: '0.7rem' }}>Only {s.stock} left</div>
                            </div>
                            <span className={`badge rounded-pill ${s.status === 'Critical' ? 'bg-danger' : 'bg-warning text-dark'}`} style={{ fontSize: '0.6rem' }}>{s.status}</span>
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-outline-primary btn-sm w-100 mt-3 rounded-pill">View Inventory</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-end mb-3">
                  <div>
                    <h5 className="mb-1 fw-bold"><i className="fas fa-history text-secondary me-2"></i>Recently Prepared</h5>
                    <p className="text-muted small mb-0">Orders that just left the kitchen</p>
                  </div>
                  <Link to="/chef/order-history" className="btn btn-sm btn-link text-primary text-decoration-none">View History →</Link>
                </div>
                <div className="row g-3">
                  {[
                    { id: '1041', name: 'Grill Chicken Platter', img: '1475090169767-40ed8d18f67d', time: '2m ago' },
                    { id: '1039', name: 'Pasta Carbonara', img: '1546069901-ba9599a7e63c', time: '8m ago' },
                    { id: '1038', name: 'Fresh Fruit Parfait', img: '1497034825429-c343d7c6a68f', time: '15m ago' },
                    { id: '1037', name: 'Cold Pressed Juice', img: '1556881286-fc6915169721', time: '22m ago' }
                  ].map((h, i) => (
                    <div key={i} className="col-6 col-md-3">
                      <div className="card shadow-sm border-0 h-100 p-2" style={{ borderRadius: '12px' }}>
                        <img src={`https://images.unsplash.com/photo-${h.img}?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&h=200&q=80`} className="card-img-top rounded shadow-sm" alt="" style={{ height: '100px', objectFit: 'cover' }} />
                        <div className="card-body p-2 mt-2 text-center">
                          <div className="fw-bold small text-truncate">{h.name}</div>
                          <div className="text-muted x-small mt-1"><i className="far fa-clock me-1"></i>{h.time}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChefDashboardPage;
