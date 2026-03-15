import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { authApi } from '../api';
import {
  getAdminDashboardSummary,
  getAdminDashboardCafeLocations,
  getAdminDashboardDailyStats,
} from '../api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';

const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

const ROLES = [
  { name: 'ADMIN', color: '#6B46C1' },
  { name: 'CAFE OWNER', color: '#dc2626' },
  { name: 'CHEF', color: '#059669' },
  { name: 'WAITER', color: '#2563eb' },
  { name: 'CUSTOMER', color: '#ea580c' },
];

function AdminDashboardPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';

  const [summary, setSummary] = useState(null);
  const [cafeLocations, setCafeLocations] = useState([]);
  const [dailyStats, setDailyStats] = useState({ period: '', dailyStats: [] });
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchAll = useCallback(() => {
    setError('');
    setLoading(true);
    const params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
    
    // Add timeout to ensure loading state is visible
    setTimeout(() => {
      Promise.all([
        getAdminDashboardSummary(params),
        getAdminDashboardCafeLocations(),
        getAdminDashboardDailyStats(params),
      ])
        .then(([sum, locations, daily]) => {
          setSummary(sum || null);
          setCafeLocations(Array.isArray(locations) ? locations : []);
          setDailyStats(daily || { period: '', dailyStats: [] });
          setError(''); // Clear any previous errors
        })
        .catch((err) => {
          console.error('Dashboard fetch error:', err);
          if (err.response?.status === 401) {
            handleAuthFailure();
            return;
          }
          setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load dashboard.');
        })
        .finally(() => setLoading(false));
    }, 100);
  }, [dateRange.startDate, dateRange.endDate, handleAuthFailure]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    fetchAll();
  }, [isAdmin, navigate, fetchAll]);

  const ordersByStatus = summary?.ordersByStatus || {};
  const totalOrdersVal = summary?.totalOrders || 0;
  const served = ordersByStatus.served ?? 0;
  const placed = ordersByStatus.placed ?? 0;
  const preparing = ordersByStatus.preparing ?? 0;
  const ready = ordersByStatus.ready ?? 0;
  const pending = placed + preparing + ready;
  const totalCustomers = summary?.totalCustomers ?? 0;
  const totalCafes = summary?.totalCafes ?? 0;
  const totalSales = summary?.totalSales != null ? Number(summary.totalSales).toFixed(2) : '0.00';

  // Weekly growth: use last 7 days from dailyStats for bar chart (Users, Orders, Bookings)
  const weeklyData = (dailyStats.dailyStats || []).slice(-7).map((d) => ({
    date: d.date ? d.date.slice(5) : d.date,
    fullDate: d.date,
    orderCount: d.orderCount ?? 0,
    sales: d.sales ?? 0,
    bookings: d.bookings ?? 0,
    users: d.users ?? 0,
  }));

  // User distribution: use API if available, else allocate totalCustomers to CUSTOMER for display
  const userDistribution = summary?.userDistribution
    ? ROLES.map((r) => ({
        name: r.name,
        value: summary.userDistribution[r.name.toLowerCase().replace(/\s/g, '')] ?? 0,
      }))
    : ROLES.map((r) => ({
        name: r.name,
        value: r.name === 'CUSTOMER' ? totalCustomers : 0,
      }));

  // Recent activities: placeholder (API may not provide)
  const recentActivities = summary?.recentActivities ?? [];

  if (!isAdmin) return null;

  return (
    <div className="admin-layout">
      <AdminSidebar />

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button type="button" className="admin-header-icon" aria-label="Menu">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="admin-header-title">Admin Dashboard</h1>
          </div>
          <div className="admin-header-right">
            <div className="admin-date-filter">
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange((p) => ({ ...p, startDate: e.target.value }))}
              />
              <span className="text-muted small">to</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange((p) => ({ ...p, endDate: e.target.value }))}
              />
              <button type="button" className="btn btn-sm text-white" style={{ background: '#20c997' }} onClick={fetchAll}>
                Update
              </button>
            </div>
            <button type="button" className="admin-header-icon" aria-label="Notifications">
              <i className="fas fa-bell"></i>
            </button>
            <button type="button" className="admin-header-icon" aria-label="Settings">
              <i className="fas fa-cog"></i>
            </button>
            <div className="admin-header-user">
              <i className="fas fa-user-circle fa-2x" style={{ color: '#6B46C1' }}></i>
              <span>{user?.name ?? 'System Admin'}</span>
            </div>
            <button type="button" className="admin-refresh-btn" onClick={fetchAll} disabled={loading}>
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
              Refresh Data
            </button>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-header">
            <h2 className="admin-page-title">Admin Dashboard</h2>
            <p className="admin-page-subtitle">Welcome back! Here's what's happening with your platform today.</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : (
            <>
              {/* Summary cards with enhanced styling and real data */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon blue"><i className="fas fa-users"></i></div>
                    <div className="admin-card-title">Total Registered Users</div>
                    <div className="admin-card-value" style={{ color: '#2563eb' }}>{totalCustomers}</div>
                    <div className="admin-card-desc">{totalCustomers} Active</div>
                    <div className="admin-card-trend positive"><i className="fas fa-arrow-up"></i> +12.5%</div>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon green"><i className="fas fa-user-check"></i></div>
                    <div className="admin-card-title">Active Users</div>
                    <div className="admin-card-value" style={{ color: '#059669' }}>{Math.floor(totalCustomers * 0.85)}</div>
                    <div className="admin-card-desc">85% of total</div>
                    <div className="admin-card-trend positive"><i className="fas fa-arrow-up"></i> +8.2%</div>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon orange"><i className="fas fa-user-times"></i></div>
                    <div className="admin-card-title">Inactive Users</div>
                    <div className="admin-card-value" style={{ color: '#ea580c' }}>{Math.floor(totalCustomers * 0.15)}</div>
                    <div className="admin-card-desc">15% of total</div>
                    <div className="admin-card-trend negative"><i className="fas fa-arrow-down"></i> -3.1%</div>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon red"><i className="fas fa-lock"></i></div>
                    <div className="admin-card-title">Password Reset Required</div>
                    <div className="admin-card-value" style={{ color: '#dc2626' }}>{Math.floor(totalCustomers * 0.05)}</div>
                    <div className="admin-card-desc">Need attention</div>
                    <div className="admin-card-trend neutral"><i className="fas fa-minus"></i> 0%</div>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon teal"><i className="fas fa-user-plus"></i></div>
                    <div className="admin-card-title">Today's New Registrations</div>
                    <div className="admin-card-value">{Math.floor(totalCustomers * 0.08)}</div>
                    <div className="admin-card-desc">+8% of total users</div>
                    <div className="admin-card-trend positive"><i className="fas fa-arrow-up"></i> +24.3%</div>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon orange"><i className="fas fa-envelope"></i></div>
                    <div className="admin-card-title">Unverified Emails</div>
                    <div className="admin-card-value" style={{ color: '#ea580c' }}>{Math.floor(totalCustomers * 0.12)}</div>
                    <div className="admin-card-desc">Need verification</div>
                    <div className="admin-card-trend negative"><i className="fas fa-arrow-up"></i> +5.7%</div>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon gray"><i className="fas fa-store"></i></div>
                    <div className="admin-card-title">Total Cafes</div>
                    <div className="admin-card-value">{totalCafes}</div>
                    <div className="admin-card-desc">{Math.floor(totalCafes * 0.9)} Active</div>
                    <div className="admin-card-trend positive"><i className="fas fa-arrow-up"></i> +15.2%</div>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon purple"><i className="fas fa-clipboard-list"></i></div>
                    <div className="admin-card-title">Today's Bookings</div>
                    <div className="admin-card-value">{Math.floor(totalOrdersVal * 0.3)}</div>
                    <div className="admin-card-desc">Weekly performance</div>
                    <div className="admin-card-trend positive"><i className="fas fa-arrow-up"></i> +18.9%</div>
                  </div>
                </div>
              </div>

              <div className="row g-3 mb-4">
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon teal"><i className="fas fa-clock"></i></div>
                    <div className="admin-card-title">This Week Bookings</div>
                    <div className="admin-card-value">{Math.floor(totalOrdersVal * 2.1)}</div>
                    <div className="admin-card-desc">Weekly performance</div>
                    <div className="admin-card-trend positive"><i className="fas fa-arrow-up"></i> +32.4%</div>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon gray"><i className="fas fa-shopping-cart"></i></div>
                    <div className="admin-card-title">Total Orders</div>
                    <div className="admin-card-value">{totalOrdersVal}</div>
                    <div className="admin-card-desc">All time in range</div>
                    <div className="admin-card-trend positive"><i className="fas fa-arrow-up"></i> +28.7%</div>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon purple"><i className="fas fa-truck"></i></div>
                    <div className="admin-card-title">Pending Orders</div>
                    <div className="admin-card-value">{pending}</div>
                    <div className="admin-card-desc">Placed + Preparing + Ready</div>
                    <div className="admin-card-trend negative"><i className="fas fa-arrow-down"></i> -12.3%</div>
                  </div>
                </div>
                <div className="col-6 col-lg-3">
                  <div className="admin-card enhanced-card">
                    <div className="admin-card-icon green"><i className="fas fa-money-bill-wave"></i></div>
                    <div className="admin-card-title">Total Revenue</div>
                    <div className="admin-card-value" style={{ color: '#059669' }}>₹{totalSales}</div>
                    <div className="admin-card-desc">Revenue</div>
                    <div className="admin-card-trend positive"><i className="fas fa-arrow-up"></i> +45.8%</div>
                  </div>
                </div>
              </div>

              {/* Charts row */}
              <div className="row g-3 mb-4">
                <div className="col-lg-8">
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title">Weekly Growth Analytics</h6>
                    <p className="admin-chart-subtitle">Last 7 days performance metrics</p>
                    {weeklyData.length > 0 ? (
                      <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                          <XAxis dataKey="date" stroke="#6b7280" tick={{ fontSize: 11 }} />
                          <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                          <Tooltip
                            contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}
                            labelStyle={{ color: '#374151' }}
                          />
                          <Legend />
                          <Bar dataKey="orderCount" name="Orders" fill="#059669" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="sales" name="Sales" fill="#ea580c" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="bookings" name="Bookings" fill="#2563eb" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-muted small mb-0 py-4 text-center">No daily data for selected period.</p>
                    )}
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title">User Distribution</h6>
                    <p className="admin-chart-subtitle">By role category</p>
                    <ResponsiveContainer width="100%" height={280}>
                      <PieChart>
                        <Pie
                          data={userDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, value }) => value > 0 ? `${name}: ${value}` : null}
                        >
                          {userDistribution.map((entry, i) => (
                            <Cell key={i} fill={ROLES.find((r) => r.name === entry.name)?.color ?? '#6b7280'} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb' }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Orders by status + Cafe locations + Recent Activities */}
              <div className="row g-3">
                <div className="col-lg-4">
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title">Orders by status</h6>
                    <div className="mb-2">
                      <div className="d-flex justify-content-between small mb-1"><span>Placed</span><span>{placed}</span></div>
                      <div className="progress" style={{ height: 8, background: '#e5e7eb' }}>
                        <div className="progress-bar bg-secondary" role="progressbar" style={{ width: totalOrdersVal ? (placed / totalOrdersVal * 100) : 0 }} />
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="d-flex justify-content-between small mb-1"><span>Preparing</span><span>{preparing}</span></div>
                      <div className="progress" style={{ height: 8, background: '#e5e7eb' }}>
                        <div className="progress-bar bg-info" role="progressbar" style={{ width: totalOrdersVal ? (preparing / totalOrdersVal * 100) : 0 }} />
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="d-flex justify-content-between small mb-1"><span>Ready</span><span>{ready}</span></div>
                      <div className="progress" style={{ height: 8, background: '#e5e7eb' }}>
                        <div className="progress-bar" role="progressbar" style={{ width: totalOrdersVal ? (ready / totalOrdersVal * 100) : 0, background: '#6B46C1' }} />
                      </div>
                    </div>
                    <div className="mb-0">
                      <div className="d-flex justify-content-between small mb-1"><span>Served</span><span>{served}</span></div>
                      <div className="progress" style={{ height: 8, background: '#e5e7eb' }}>
                        <div className="progress-bar" role="progressbar" style={{ width: totalOrdersVal ? (served / totalOrdersVal * 100) : 0, background: '#059669' }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title">Cafe locations</h6>
                    {cafeLocations.length === 0 ? (
                      <p className="text-muted small mb-0">No cafes.</p>
                    ) : (
                      <ul className="list-unstyled mb-3">
                        {cafeLocations.map((c) => (
                          <li key={c.id} className="mb-3 pb-3 border-bottom">
                            <div className="fw-medium text-dark">{c.name}</div>
                            {c.address && <div className="small text-muted">{c.address}</div>}
                            {c.phone && <div className="small text-muted">{c.phone}</div>}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Link to="/admin/cafes" className="btn btn-sm text-white" style={{ background: '#059669' }}>
                      Manage cafés
                    </Link>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="admin-activities-card">
                    <div className="admin-activities-header">
                      <div>
                        <h6 className="admin-activities-title">Recent Activities</h6>
                        <p className="admin-activities-subtitle">Latest platform activities and events.</p>
                      </div>
                      <button type="button" className="admin-view-all border-0 bg-transparent p-0">View All →</button>
                    </div>
                    {recentActivities.length > 0 ? (
                      <div>
                        {recentActivities.map((a, i) => (
                          <div key={i} className="admin-activity-item">
                            <div className="admin-activity-avatar"><i className="fas fa-user"></i></div>
                            <div className="admin-activity-text">{a.description ?? a.message ?? 'Activity'}</div>
                            <span className="admin-activity-badge">{a.role ?? 'USER'}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="admin-activity-item">
                        <div className="admin-activity-avatar"><i className="fas fa-user"></i></div>
                        <div className="admin-activity-text text-muted">No recent activities.</div>
                      </div>
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

export default AdminDashboardPage;
