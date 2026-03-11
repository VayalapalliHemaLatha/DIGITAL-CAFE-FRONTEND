import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import {
  getAdminDashboardSummary,
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
      getAdminDashboardSummary({}),
    ])
      .then(([sum]) => {
        setSummary(sum || null);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load reports.');
      })
      .finally(() => setLoading(false));
  }, [handleAuthFailure]);

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
                    <strong>{totalBookings}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Total Orders</span>
                    <strong>{totalOrders}</strong>
                  </div>
                  <div className="analytics-snapshot-pair">
                    <span>Total Revenue</span>
                    <strong>₹{totalSales}</strong>
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

export default AdminReportsPage;
