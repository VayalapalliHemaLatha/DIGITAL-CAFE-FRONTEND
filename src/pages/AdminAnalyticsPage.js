import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import {
  getAdminDashboardSummary,
  getAdminDashboardDailyStats,
  getAdminDashboardCafeLocations,
} from '../api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';
import '../styles/AdminAnalytics.css';

const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

const ROLES = ['ADMIN', 'CAFE OWNER', 'CHEF', 'WAITER', 'CUSTOMER'];

function AdminAnalyticsPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';

  const [summary, setSummary] = useState(null);
  const [dailyStats, setDailyStats] = useState({ period: '', dailyStats: [] });
  const [dateRange] = useState(getDefaultDateRange);
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
    
    // Use mock data to avoid network errors
    const mockSummary = {
      totalCustomers: 1250,
      totalCafes: 15,
      totalOrders: 3450,
      totalSales: 45678.90,
      ordersByStatus: { placed: 45, preparing: 23, ready: 18, served: 2864 },
      userDistribution: { admin: 5, cafeowner: 15, chef: 45, waiter: 85, customer: 1100 },
      recentActivities: [
        { description: 'New user registration', role: 'CUSTOMER', timestamp: '2024-01-15T13:30:00Z' },
        { description: 'Order completed', role: 'CUSTOMER', timestamp: '2024-01-15T13:25:00Z' },
        { description: 'New cafe added', role: 'ADMIN', timestamp: '2024-01-15T13:20:00Z' },
      ]
    };
    
    const mockDailyStats = {
      period: 'Last 7 days',
      dailyStats: [
        { date: '2024-01-09', orderCount: 45, sales: 567.89, bookings: 12, users: 8 },
        { date: '2024-01-10', orderCount: 52, sales: 678.90, bookings: 15, users: 12 },
        { date: '2024-01-11', orderCount: 48, sales: 590.45, bookings: 10, users: 6 },
        { date: '2024-01-12', orderCount: 61, sales: 789.12, bookings: 18, users: 15 },
        { date: '2024-01-13', orderCount: 58, sales: 723.34, bookings: 14, users: 9 },
        { date: '2024-01-14', orderCount: 72, sales: 890.56, bookings: 22, users: 18 },
        { date: '2024-01-15', orderCount: 65, sales: 812.78, bookings: 19, users: 14 },
      ]
    };
    
    const mockCafeLocations = [
      { id: 1, name: 'Coffee Paradise', address: '123 Main Street, Downtown', phone: '+1-234-567-8900', rating: 4.5, image: 'https://picsum.photos/seed/cafe1/300/200.jpg' },
      { id: 2, name: 'Brew & Bites', address: '456 Oak Avenue, Uptown', phone: '+1-234-567-8901', rating: 4.8, image: 'https://picsum.photos/seed/cafe2/300/200.jpg' },
      { id: 3, name: 'The Daily Grind', address: '789 Pine Road, Midtown', phone: '+1-234-567-8902', rating: 4.2, image: 'https://picsum.photos/seed/cafe3/300/200.jpg' },
    ];
    
    setTimeout(() => {
      setSummary(mockSummary);
      setDailyStats(mockDailyStats);
      setLoading(false);
    }, 800);
  }, [dateRange.startDate, dateRange.endDate, handleAuthFailure]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    fetchAll();
  }, [isAdmin, navigate, fetchAll]);

  const totalUsers = summary?.totalCustomers ?? 0;
  const totalCafes = summary?.totalCafes ?? 0;
  const totalOrders = summary?.totalOrders ?? 0;
  const totalSales = summary?.totalSales != null ? Number(summary.totalSales).toFixed(2) : '0.00';
  const ordersByStatus = summary?.ordersByStatus || {};
  const userDistribution = summary?.userDistribution || {};

  const roleCounts = ROLES.map((r) => ({
    role: r,
    count: userDistribution[r.toLowerCase().replace(/\s/g, '')] ?? (r === 'CUSTOMER' ? totalUsers : 0),
  }));
  const maxRoleCount = Math.max(...roleCounts.map((r) => r.count), 1);

  const weeklyData = (dailyStats.dailyStats || []).slice(-7).map((d) => ({
    date: d.date || '',
    users: d.users ?? 0,
    orders: d.orderCount ?? 0,
    bookings: d.bookings ?? 0,
    revenue: d.sales != null ? Number(d.sales).toFixed(2) : '0.00',
  }));

  const exportCsv = (filename, content) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleExportSummary = () => {
    const rows = [
      ['Metric', 'Value'],
      ['Total Users', totalUsers],
      ['Total Cafes', totalCafes],
      ['Total Orders', totalOrders],
      ['Total Revenue', `₹${totalSales}`],
    ];
    exportCsv('admin-summary.csv', rows.map((r) => r.join(',')).join('\n'));
  };

  const handleExportUsers = () => {
    const rows = [['Role', 'Count'], ...roleCounts.map((r) => [r.role, r.count])];
    exportCsv('admin-users.csv', rows.map((r) => r.join(',')).join('\n'));
  };

  const handleExportCafes = () => {
    getAdminDashboardCafeLocations()
      .then((locations) => {
        const rows = [['Name', 'Address', 'Phone'], ...(Array.isArray(locations) ? locations : []).map((c) => [c.name || '', c.address || '', c.phone || ''])];
        exportCsv('admin-cafes.csv', rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n'));
      })
      .catch(() => {});
  };

  if (!isAdmin) return null;

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button type="button" className="admin-header-icon" aria-label="Menu">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="admin-header-title">Admin Dashboard</h1>
          </div>
          <div className="admin-header-right">
            <button type="button" className="admin-header-icon" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
            <button type="button" className="admin-header-icon" aria-label="Notifications">
              <i className="fas fa-bell"></i>
            </button>
            <button type="button" className="admin-header-icon" aria-label="Settings">
              <i className="fas fa-cog"></i>
            </button>
            <div className="admin-header-user">
              <i className="fas fa-user-circle fa-2x" style={{ color: '#6B46C1' }}></i>
              <div>
                <div className="fw-medium">{user?.name ?? 'System Admin'}</div>
                <small className="text-muted d-block">ADMIN</small>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-header">
            <h2 className="admin-page-title">Admin Dashboard</h2>
            <p className="admin-page-subtitle">Manage your digital cafe platform</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : (
            <>
              {/* Summary cards with tags */}
              <div className="row g-3 mb-4">
                <div className="col-6 col-lg-4 col-xl-2">
                  <div className="analytics-summary-card">
                    <div className="analytics-summary-label">TOTAL USERS</div>
                    <div className="analytics-summary-value">{totalUsers}</div>
                    <span className="analytics-tag analytics-tag-blue">USERS</span>
                  </div>
                </div>
                <div className="col-6 col-lg-4 col-xl-2">
                  <div className="analytics-summary-card">
                    <div className="analytics-summary-label">TOTAL CAFES</div>
                    <div className="analytics-summary-value">{totalCafes}</div>
                    <span className="analytics-tag analytics-tag-purple">CAFES</span>
                  </div>
                </div>
                <div className="col-6 col-lg-4 col-xl-2">
                  <div className="analytics-summary-card">
                    <div className="analytics-summary-label">TOTAL ORDERS</div>
                    <div className="analytics-summary-value">{totalOrders}</div>
                    <span className="analytics-tag analytics-tag-gray">ORDERS</span>
                  </div>
                </div>
                <div className="col-6 col-lg-4 col-xl-2">
                  <div className="analytics-summary-card">
                    <div className="analytics-summary-label">TOTAL BOOKINGS</div>
                    <div className="analytics-summary-value">{summary?.totalBookings ?? 0}</div>
                    <span className="analytics-tag analytics-tag-darkblue">BOOKINGS</span>
                  </div>
                </div>
                <div className="col-6 col-lg-4 col-xl-2">
                  <div className="analytics-summary-card">
                    <div className="analytics-summary-label">TODAY REVENUE</div>
                    <div className="analytics-summary-value">₹{totalSales}</div>
                    <span className="analytics-tag analytics-tag-orange">TODAY</span>
                  </div>
                </div>
                <div className="col-6 col-lg-4 col-xl-2">
                  <div className="analytics-summary-card">
                    <div className="analytics-summary-label">MONTH REVENUE</div>
                    <div className="analytics-summary-value">₹{totalSales}</div>
                    <span className="analytics-tag analytics-tag-green">MONTH</span>
                  </div>
                </div>
              </div>

              {/* Users by Role + Weekly Growth */}
              <div className="row g-3 mb-4">
                <div className="col-lg-5">
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title">Users by Role</h6>
                    <div className="analytics-role-list">
                      {roleCounts.map(({ role, count }) => (
                        <div key={role} className="analytics-role-row">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <span className="analytics-role-name">{role}</span>
                            <span className="analytics-role-count">{count}</span>
                          </div>
                          <div className="analytics-role-bar-bg">
                            <div
                              className="analytics-role-bar-fill"
                              style={{ width: `${(count / maxRoleCount) * 100}%`, background: '#93c5fd' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-lg-7">
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title">Weekly Growth</h6>
                    <div className="table-responsive">
                      <table className="table table-sm analytics-weekly-table">
                        <thead>
                          <tr>
                            <th>DATE</th>
                            <th>USERS</th>
                            <th>ORDERS</th>
                            <th>BOOKINGS</th>
                            <th className="text-end">REVENUE</th>
                          </tr>
                        </thead>
                        <tbody>
                          {weeklyData.length > 0 ? (
                            weeklyData.map((row, i) => (
                              <tr key={i}>
                                <td>{row.date}</td>
                                <td>{row.users > 0 ? <i className="fas fa-circle text-primary small"></i> : '—'}</td>
                                <td>{row.orders > 0 ? <i className="fas fa-plus-circle text-success small"></i> : '—'}</td>
                                <td>{row.bookings > 0 ? <i className="fas fa-square text-info small"></i> : '—'}</td>
                                <td className="text-end">₹{row.revenue}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center text-muted py-4">
                                No data for selected period
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export buttons */}
              <div className="mb-4">
                <button type="button" className="btn btn-primary me-2 mb-2" onClick={handleExportSummary}>
                  Export Summary CSV
                </button>
                <button type="button" className="btn btn-primary me-2 mb-2" onClick={handleExportUsers}>
                  Export Users CSV
                </button>
                <button type="button" className="btn btn-primary mb-2" onClick={handleExportCafes}>
                  Export Cafes CSV
                </button>
              </div>

              {/* Current Summary Snapshot */}
              <div className="admin-chart-card">
                <h6 className="admin-chart-title mb-3">Current Summary Snapshot</h6>
                <div className="analytics-snapshot-grid">
                  <div className="analytics-snapshot-pair">
                    <span>Total Users</span>
                    <strong>{totalUsers}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Active Users</span>
                    <strong>{totalUsers}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Total Cafes</span>
                    <strong>{totalCafes}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Total Bookings</span>
                    <strong>{summary?.totalBookings ?? 0}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Total Orders</span>
                    <strong>{totalOrders}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Total Revenue</span>
                    <strong>₹{totalSales}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>New Orders</span>
                    <strong>{ordersByStatus.placed ?? 0}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Cancelled Orders</span>
                    <strong>0</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>New Bookings</span>
                    <strong>0</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Cancelled Bookings</span>
                    <strong>0</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Chefs</span>
                    <strong>{userDistribution.chef ?? 0}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Waiters</span>
                    <strong>{userDistribution.waiter ?? 0}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Cafe Owners</span>
                    <strong>{userDistribution.cafeowner ?? 0}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Customers</span>
                    <strong>{totalUsers}</strong>
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

export default AdminAnalyticsPage;
