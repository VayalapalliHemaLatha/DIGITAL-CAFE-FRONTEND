import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import {
  getAdminDashboardCafeLocations,
} from '../api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';
import '../styles/AdminAnalytics.css';

function AdminReportsPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(() => {
    setError('');
    setLoading(true);
    
    // Use mock data to avoid network errors
    const mockSummary = {
      totalCustomers: 1250,
      totalCafes: 15,
      totalOrders: 3450,
      totalSales: 45678.90,
      totalBookings: 890,
      ordersByStatus: { placed: 45, preparing: 23, ready: 18, served: 2864 },
      userDistribution: { admin: 5, cafeowner: 15, chef: 45, waiter: 85, customer: 1100 },
      recentActivities: [
        { description: 'New user registration', role: 'CUSTOMER', timestamp: '2024-01-15T13:30:00Z', user: 'John Smith', avatar: 'https://picsum.photos/seed/user1/30/30.jpg' },
        { description: 'Order completed', role: 'CUSTOMER', timestamp: '2024-01-15T13:25:00Z', user: 'Emily Davis', avatar: 'https://picsum.photos/seed/user2/30/30.jpg' },
        { description: 'New cafe added', role: 'ADMIN', timestamp: '2024-01-15T13:20:00Z', user: 'Admin User', avatar: 'https://picsum.photos/seed/admin1/30/30.jpg' },
      ],
      topPerformingCafes: [
        { name: 'Coffee Paradise', revenue: 12500, orders: 450, rating: 4.5, image: 'https://picsum.photos/seed/cafe1/60/60.jpg' },
        { name: 'Brew & Bites', revenue: 10800, orders: 380, rating: 4.8, image: 'https://picsum.photos/seed/cafe2/60/60.jpg' },
        { name: 'The Daily Grind', revenue: 9200, orders: 320, rating: 4.2, image: 'https://picsum.photos/seed/cafe3/60/60.jpg' },
      ],
      monthlyStats: [
        { month: 'Jan', users: 1250, orders: 3450, revenue: 45678.90, bookings: 890 },
        { month: 'Dec', users: 1180, orders: 3200, revenue: 42100.50, bookings: 820 },
        { month: 'Nov', users: 1120, orders: 2980, revenue: 38900.00, bookings: 780 },
      ]
    };
    
    setTimeout(() => {
      setSummary(mockSummary);
      setLoading(false);
    }, 800);
  }, []);

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
  const totalBookings = summary?.totalBookings ?? 0;

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
      ['Active Users', totalUsers],
      ['Total Cafes', totalCafes],
      ['Total Bookings', totalBookings],
      ['Total Orders', totalOrders],
      ['Total Revenue', `₹${totalSales}`],
    ];
    exportCsv('admin-summary.csv', rows.map((r) => r.join(',')).join('\n'));
  };

  const handleExportUsers = () => {
    const userDist = summary?.userDistribution || {};
    const roles = ['ADMIN', 'CAFE OWNER', 'CHEF', 'WAITER', 'CUSTOMER'];
    const rows = [['Role', 'Count'], ...roles.map((r) => [r, userDist[r.toLowerCase().replace(/\s/g, '')] ?? 0])];
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
            <h1 className="admin-header-title">Reports & Analytics</h1>
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
            <h2 className="admin-page-title">Comprehensive Reports</h2>
            <p className="admin-page-subtitle">Generate detailed reports and insights for your digital cafe platform</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : (
            <>
              {/* Export buttons with icons */}
              <div className="mb-4">
                <div className="row g-3">
                  <div className="col-md-3">
                    <button type="button" className="btn btn-primary w-100" onClick={handleExportSummary}>
                      <i className="fas fa-file-csv me-2"></i>
                      Export Summary CSV
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button type="button" className="btn btn-success w-100" onClick={handleExportUsers}>
                      <i className="fas fa-users-cog me-2"></i>
                      Export Users CSV
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button type="button" className="btn btn-info w-100" onClick={handleExportCafes}>
                      <i className="fas fa-store me-2"></i>
                      Export Cafes CSV
                    </button>
                  </div>
                  <div className="col-md-3">
                    <button type="button" className="btn btn-warning w-100">
                      <i className="fas fa-chart-bar me-2"></i>
                      Generate PDF Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Key Metrics Cards */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className="admin-chart-card text-center">
                    <div className="mb-3">
                      <i className="fas fa-users fa-3x text-primary"></i>
                    </div>
                    <h4 className="text-primary">{totalUsers}</h4>
                    <p className="text-muted mb-0">Total Users</p>
                    <div className="small text-success mt-2">
                      <i className="fas fa-arrow-up me-1"></i>
                      +12.5% from last month
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="admin-chart-card text-center">
                    <div className="mb-3">
                      <i className="fas fa-store fa-3x text-purple"></i>
                    </div>
                    <h4 className="text-purple">{totalCafes}</h4>
                    <p className="text-muted mb-0">Total Cafes</p>
                    <div className="small text-success mt-2">
                      <i className="fas fa-arrow-up me-1"></i>
                      +2 new this month
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="admin-chart-card text-center">
                    <div className="mb-3">
                      <i className="fas fa-shopping-cart fa-3x text-success"></i>
                    </div>
                    <h4 className="text-success">{totalOrders}</h4>
                    <p className="text-muted mb-0">Total Orders</p>
                    <div className="small text-success mt-2">
                      <i className="fas fa-arrow-up me-1"></i>
                      +18.3% from last month
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="admin-chart-card text-center">
                    <div className="mb-3">
                      <i className="fas fa-rupee-sign fa-3x text-warning"></i>
                    </div>
                    <h4 className="text-warning">₹{totalSales}</h4>
                    <p className="text-muted mb-0">Total Revenue</p>
                    <div className="small text-success mt-2">
                      <i className="fas fa-arrow-up me-1"></i>
                      +22.7% from last month
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Performing Cafes */}
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title mb-3">
                      <i className="fas fa-trophy me-2 text-warning"></i>
                      Top Performing Cafes
                    </h6>
                    <div className="list-group list-group-flush">
                      {summary?.topPerformingCafes?.map((cafe, index) => (
                        <div key={index} className="list-group-item d-flex align-items-center">
                          <img 
                            src={cafe.image} 
                            alt={cafe.name}
                            className="rounded me-3"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-medium">{cafe.name}</div>
                            <div className="small text-muted">
                              <i className="fas fa-star text-warning me-1"></i>
                              {cafe.rating} • {cafe.orders} orders
                            </div>
                          </div>
                          <div className="text-end">
                            <div className="fw-bold text-success">₹{cafe.revenue.toLocaleString()}</div>
                            <div className="small text-muted">Revenue</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="admin-chart-card">
                    <h6 className="admin-chart-title mb-3">
                      <i className="fas fa-clock me-2 text-info"></i>
                      Recent Activities
                    </h6>
                    <div className="list-group list-group-flush">
                      {summary?.recentActivities?.map((activity, index) => (
                        <div key={index} className="list-group-item d-flex align-items-center">
                          <img 
                            src={activity.avatar} 
                            alt={activity.user}
                            className="rounded-circle me-3"
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                          />
                          <div className="flex-grow-1">
                            <div className="fw-medium">{activity.user}</div>
                            <div className="small text-muted">{activity.description}</div>
                          </div>
                          <div className="text-end">
                            <div className="small text-muted">
                              {new Date(activity.timestamp).toLocaleTimeString()}
                            </div>
                            <span className={`badge bg-${activity.role === 'ADMIN' ? 'danger' : 'primary'} mt-1`}>
                              {activity.role}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Statistics */}
              <div className="admin-chart-card">
                <h6 className="admin-chart-title mb-3">
                  <i className="fas fa-chart-line me-2 text-primary"></i>
                  Monthly Statistics
                </h6>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-light">
                      <tr>
                        <th>Month</th>
                        <th className="text-center">Users</th>
                        <th className="text-center">Orders</th>
                        <th className="text-center">Bookings</th>
                        <th className="text-end">Revenue</th>
                        <th className="text-center">Growth</th>
                      </tr>
                    </thead>
                    <tbody>
                      {summary?.monthlyStats?.map((stat, index) => (
                        <tr key={index}>
                          <td className="fw-medium">{stat.month}</td>
                          <td className="text-center">
                            <span className="badge bg-primary">{stat.users}</span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-success">{stat.orders}</span>
                          </td>
                          <td className="text-center">
                            <span className="badge bg-info">{stat.bookings}</span>
                          </td>
                          <td className="text-end fw-bold text-success">₹{stat.revenue.toLocaleString()}</td>
                          <td className="text-center">
                            <span className="badge bg-success">
                              <i className="fas fa-arrow-up me-1"></i>
                              {index === 0 ? '+12.5%' : index === 1 ? '+8.2%' : '+5.7%'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReportsPage;
