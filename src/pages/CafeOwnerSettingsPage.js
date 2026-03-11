import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import CafeOwnerSidebar from '../components/CafeOwnerSidebar';
import '../styles/AdminDashboard.css';

function CafeOwnerSettingsPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isCafeOwner = roleType === 'cafeowner';

  useEffect(() => {
    if (!isCafeOwner) {
      navigate('/', { replace: true });
    }
  }, [isCafeOwner, navigate]);

  if (!isCafeOwner) return null;

  return (
    <div className="admin-layout">
      <CafeOwnerSidebar />
      <div className="admin-main">
        <header className="admin-header">
          <h1 className="admin-header-title">Settings</h1>
          <div className="admin-header-right">
            <div className="admin-header-user">
              <i className="fas fa-user-circle fa-2x" style={{ color: '#6B46C1' }}></i>
              <span>{user?.email ?? 'owner@cafe.com'}</span>
            </div>
          </div>
        </header>
        <div className="admin-content">
          <div className="admin-page-header">
            <h2 className="admin-page-title">Settings</h2>
            <p className="admin-page-subtitle">Manage your cafe preferences</p>
          </div>
          <div className="admin-chart-card">
            <p className="text-muted mb-0">Cafe owner settings coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CafeOwnerSettingsPage;
