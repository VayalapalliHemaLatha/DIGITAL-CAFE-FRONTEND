import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { authApi } from '../api';
import {
  getCafeOwnerTables,
  getCafeOwnerWaiters,
  getCafeOwnerChefs,
  getCafeOwnerOrders,
  getCafeOwnerBookings,
  getCafeOwnerMenu,
} from '../api';
import CafeOwnerSidebar from '../components/CafeOwnerSidebar';
import '../styles/AdminDashboard.css';
import '../styles/CafeOwnerDashboard.css';

function CafeOwnerDashboardPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isCafeOwner = roleType === 'cafeowner';

  const [tables, setTables] = useState([]);
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [menu, setMenu] = useState([]);
  const [waiters, setWaiters] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cafeName, setCafeName] = useState('My Cafe');

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchAll = useCallback(() => {
    setError('');
    setLoading(true);
    Promise.all([
      getCafeOwnerTables(),
      getCafeOwnerOrders(),
      getCafeOwnerBookings(),
      getCafeOwnerMenu(),
      getCafeOwnerWaiters(),
      getCafeOwnerChefs(),
    ])
      .then(([tbl, ord, book, mnu, w, c]) => {
        setTables(Array.isArray(tbl) ? tbl : (tbl?.tables ?? []));
        setOrders(Array.isArray(ord) ? ord : []);
        setBookings(Array.isArray(book) ? book : []);
        setMenu(Array.isArray(mnu) ? mnu : []);
        setWaiters(Array.isArray(w) ? w : []);
        setChefs(Array.isArray(c) ? c : []);
        if (book && book[0]?.cafeName) setCafeName(book[0].cafeName);
        else if (ord && ord[0]?.cafeName) setCafeName(ord[0].cafeName);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load dashboard.');
      })
      .finally(() => setLoading(false));
  }, [handleAuthFailure]);

  useEffect(() => {
    if (!isCafeOwner) {
      navigate('/', { replace: true });
      return;
    }
    fetchAll();
  }, [isCafeOwner, navigate, fetchAll]);

  const today = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.orderDate === today);
  const todayBookings = bookings.filter((b) => b.bookingDate === today);
  const totalTables = tables.length;
  const availableTables = tables.filter((t) => (t.status || '').toLowerCase() === 'available').length;
  const occupiedTables = totalTables - availableTables;
  const totalStaff = waiters.length + chefs.length;
  const activeStaff = [...waiters, ...chefs].filter((s) => s.active !== false).length;
  const pendingOrders = todayOrders.filter((o) => ['placed', 'preparing', 'ready'].includes((o.status || '').toLowerCase()));
  const completedOrders = todayOrders.filter((o) => (o.status || '').toLowerCase() === 'served');
  const confirmedBookings = todayBookings.filter((b) => (b.status || '').toLowerCase() === 'booked');

  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const revenueFormatted = totalRevenue >= 1000 ? `₹${(totalRevenue / 1000).toFixed(1)}K` : `₹${totalRevenue.toFixed(0)}`;

  const orderStatusData = [
    { name: 'Placed', value: todayOrders.filter((o) => (o.status || '').toLowerCase() === 'placed').length, color: '#2563eb' },
    { name: 'Preparing', value: todayOrders.filter((o) => (o.status || '').toLowerCase() === 'preparing').length, color: '#0ea5e9' },
    { name: 'Ready', value: todayOrders.filter((o) => (o.status || '').toLowerCase() === 'ready').length, color: '#6B46C1' },
    { name: 'Served', value: todayOrders.filter((o) => (o.status || '').toLowerCase() === 'served').length, color: '#059669' },
    { name: 'Cancelled', value: todayOrders.filter((o) => (o.status || '').toLowerCase() === 'cancelled').length, color: '#dc2626' },
  ].filter((d) => d.value > 0);

  if (orderStatusData.length === 0) orderStatusData.push({ name: 'No orders', value: 1, color: '#e5e7eb' });

  const tableAvailabilityData = [
    { name: 'Available', value: availableTables, color: '#059669' },
    { name: 'Occupied', value: occupiedTables, color: '#dc2626' },
  ].filter((d) => d.value > 0);

  if (tableAvailabilityData.length === 0) tableAvailabilityData.push({ name: 'No tables', value: 1, color: '#e5e7eb' });

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayOrders = orders.filter((o) => o.orderDate === dateStr);
    const rev = dayOrders.reduce((s, o) => s + (Number(o.totalAmount) || 0), 0);
    last7Days.push({
      date: d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', ''),
      revenue: rev,
    });
  }

  if (!isCafeOwner) return null;

  return (
    <div className="admin-layout">
      <CafeOwnerSidebar cafeName={cafeName} />

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button type="button" className="admin-header-icon" aria-label="Menu">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="admin-header-title">Dashboard</h1>
          </div>
          <div className="admin-header-right">
            <input type="text" className="form-control form-control-sm" placeholder="Search..." style={{ maxWidth: 200 }} />
            <button type="button" className="admin-header-icon" aria-label="Notifications">
              <i className="fas fa-bell"></i>
            </button>
            <button type="button" className="admin-header-icon" aria-label="Settings">
              <i className="fas fa-cog"></i>
            </button>
            <div className="admin-header-user">
              <i className="fas fa-user-circle fa-2x" style={{ color: '#6B46C1' }}></i>
              <span>{user?.email ?? 'owner@cafe.com'}</span>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-header">
            <h2 className="admin-page-title">Dashboard</h2>
            <p className="admin-page-subtitle">Overview of your cafe operations</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : (
            <>
              <div className="cafeowner-banner">
                <div>
                  <h3 className="cafeowner-banner-title">{cafeName}</h3>
                  <p className="cafeowner-banner-desc">Live overview of tables, staff, orders & reservations.</p>
                </div>
                <div className="cafeowner-banner-actions">
                  <button type="button" className="btn btn-light btn-sm">See raw data</button>
                  <button type="button" className="btn btn-light btn-sm" onClick={fetchAll} disabled={loading}>
                    <i className="fas fa-sync-alt me-1"></i> Refresh
                  </button>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6 col-lg-4">
                  <div className="cafeowner-kpi-card">
                    <div className="cafeowner-kpi-label">Total Tables</div>
                    <div className="cafeowner-kpi-value">{totalTables}</div>
                    <div className="cafeowner-kpi-desc">{availableTables} available • {occupiedTables} occupied</div>
                    <Link to="/cafeowner/tables" className="cafeowner-kpi-btn">Manage →</Link>
                  </div>
                </div>
                <div className="col-6 col-lg-4">
                  <div className="cafeowner-kpi-card">
                    <div className="cafeowner-kpi-label">Staff Members</div>
                    <div className="cafeowner-kpi-value">{totalStaff}</div>
                    <div className="cafeowner-kpi-desc">{activeStaff} active • {totalStaff - activeStaff} absent</div>
                    <Link to="/cafeowner/staff" className="cafeowner-kpi-btn">Manage →</Link>
                  </div>
                </div>
                <div className="col-6 col-lg-4">
                  <div className="cafeowner-kpi-card">
                    <div className="cafeowner-kpi-label">Today&apos;s Orders</div>
                    <div className="cafeowner-kpi-value">{todayOrders.length}</div>
                    <div className="cafeowner-kpi-desc">{pendingOrders.length} pending • {completedOrders.length} completed</div>
                    <Link to="/cafeowner/orders" className="cafeowner-kpi-btn">View →</Link>
                  </div>
                </div>
                <div className="col-6 col-lg-4">
                  <div className="cafeowner-kpi-card">
                    <div className="cafeowner-kpi-label">Today&apos;s Bookings</div>
                    <div className="cafeowner-kpi-value">{todayBookings.length}</div>
                    <div className="cafeowner-kpi-desc">{confirmedBookings.length} upcoming confirmed</div>
                    <Link to="/cafeowner/bookings" className="cafeowner-kpi-btn">View →</Link>
                  </div>
                </div>
                <div className="col-6 col-lg-4">
                  <div className="cafeowner-kpi-card">
                    <div className="cafeowner-kpi-label">Total Revenue</div>
                    <div className="cafeowner-kpi-value">{revenueFormatted}</div>
                    <div className="cafeowner-kpi-desc">for all orders</div>
                    <Link to="/cafeowner/orders" className="cafeowner-kpi-btn">Details →</Link>
                  </div>
                </div>
                <div className="col-6 col-lg-4">
                  <div className="cafeowner-kpi-card">
                    <div className="cafeowner-kpi-label">Popular Menu Items</div>
                    <div className="cafeowner-kpi-value">{menu.length}</div>
                    <div className="cafeowner-kpi-desc">items in menu</div>
                    <Link to="/cafeowner/menu" className="cafeowner-kpi-btn">Manage →</Link>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-lg-8">
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title">Revenue Trend</h6>
                    <p className="admin-chart-subtitle">Last 7 days</p>
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={last7Days} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                        <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#6B46C1" strokeWidth={2} dot={{ fill: '#6B46C1' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="admin-chart-card mb-3">
                    <h6 className="admin-chart-title">Order Status</h6>
                    <p className="admin-chart-subtitle">Today&apos;s Orders</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                        >
                          {orderStatusData.map((e, i) => (
                            <Cell key={i} fill={e.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title">Table Availability</h6>
                    <p className="admin-chart-subtitle">Current Occupancy</p>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={tableAvailabilityData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                        >
                          {tableAvailabilityData.map((e, i) => (
                            <Cell key={i} fill={e.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="row g-3 mt-0">
                <div className="col-lg-6">
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title">Popular Menu Items</h6>
                    <p className="admin-chart-subtitle">By order volume</p>
                    {menu.length === 0 ? (
                      <p className="text-muted small py-4 mb-0 text-center">No order activity yet</p>
                    ) : (
                      <ul className="list-unstyled mb-0">
                        {menu.slice(0, 5).map((m) => (
                          <li key={m.id} className="py-2 border-bottom">
                            <span className="fw-medium">{m.name}</span>
                            <span className="text-muted small ms-2">₹{Number(m.price || 0).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CafeOwnerDashboardPage;
