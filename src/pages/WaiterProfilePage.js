import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getProfile } from '../api';
import WaiterSidebar from '../components/WaiterSidebar';
import '../styles/ChefWaiterDashboard.css';
import '../styles/AdminDashboard.css';

function WaiterProfilePage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isWaiter = roleType === 'waiter';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isWaiter) {
      navigate('/', { replace: true });
      return;
    }
    getProfile()
      .then((data) => setProfile(data || {}))
      .catch(() => setProfile({}))
      .finally(() => setLoading(false));
  }, [isWaiter, navigate]);

  if (!isWaiter) return null;

  const displayName = profile?.firstName || profile?.name || user?.name || 'Waiter';
  const email = profile?.email || user?.email || '';
  const initial = (displayName || 'W').charAt(0).toUpperCase();

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
            <div className="chef-waiter-user">
              <i className="fas fa-user-circle fa-lg" style={{ color: '#2563eb' }}></i>
              <span>{user?.email ?? 'waiter@demo.com'}</span>
            </div>
          </div>
        </header>
        <div className="chef-waiter-content">
          <div className="mb-3">
            <h2 className="h5 mb-1">My Profile</h2>
            <p className="text-muted small mb-0">Manage your account details and security</p>
          </div>
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
          ) : (
            <div className="row g-4">
              <div className="col-md-5">
                <div className="admin-chart-card text-center">
                  <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80, fontSize: '2rem', color: '#2563eb' }}>
                    {initial}
                  </div>
                  <h5 className="mb-1">{displayName}</h5>
                  <p className="text-muted small mb-3">WAITER</p>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between small mb-1"><span>Profile completed</span><span>100%</span></div>
                    <div className="progress" style={{ height: 6 }}>
                      <div className="progress-bar bg-success" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="d-flex justify-content-center gap-2 small text-muted mb-3">
                    <span>0 Ready</span>
                    <span>0 Served Today</span>
                  </div>
                  <Link to="/profile" className="btn btn-primary btn-sm me-2">Edit Profile</Link>
                  <Link to="/forgot-password" className="btn btn-outline-secondary btn-sm">Change Password</Link>
                </div>
              </div>
              <div className="col-md-7">
                <div className="admin-chart-card">
                  <h6 className="mb-3">Account Details</h6>
                  <table className="table table-sm table-borderless mb-0">
                    <tbody>
                      <tr><td className="text-muted" style={{ width: 160 }}>Username</td><td>{user?.email?.split('@')[0] || '—'}</td></tr>
                      <tr><td className="text-muted">Email Address</td><td>{email || '—'}</td></tr>
                      <tr><td className="text-muted">Display Name</td><td>{displayName}</td></tr>
                      <tr><td className="text-muted">Assigned Cafe</td><td>{profile?.cafeName || '—'}</td></tr>
                      <tr><td className="text-muted">Role</td><td>WAITER</td></tr>
                      <tr><td className="text-muted">Last Login</td><td>—</td></tr>
                      <tr><td className="text-muted">Work Information</td><td>—</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaiterProfilePage;
