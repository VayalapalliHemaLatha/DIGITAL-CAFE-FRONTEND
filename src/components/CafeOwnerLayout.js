import React from 'react';
import { authApi } from '../api';
import CafeOwnerSidebar from './CafeOwnerSidebar';
import '../styles/AdminDashboard.css';

function CafeOwnerLayout({ title, subtitle, children, cafeName }) {
  const user = authApi.getUser();
  return (
    <div className="admin-layout">
      <CafeOwnerSidebar cafeName={cafeName || 'My Cafe'} />
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button type="button" className="admin-header-icon" aria-label="Menu">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="admin-header-title">{title}</h1>
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
            <h2 className="admin-page-title">{title}</h2>
            {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default CafeOwnerLayout;
