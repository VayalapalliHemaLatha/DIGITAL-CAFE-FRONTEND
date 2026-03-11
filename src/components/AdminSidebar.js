import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-brand">
        <i className="fas fa-coffee"></i>
        Digital Cafe
      </div>
      <nav className="admin-sidebar-nav">
        <Link to="/admin/dashboard" className={location.pathname === '/admin/dashboard' ? 'active' : ''}>
          <i className="fas fa-th-large"></i> Dashboard
        </Link>
        <Link to="/admin/cafeowners" className={location.pathname === '/admin/cafeowners' ? 'active' : ''}>
          <i className="fas fa-users"></i> User Management
        </Link>
        <Link to="/admin/cafes" className={location.pathname === '/admin/cafes' ? 'active' : ''}>
          <i className="fas fa-store"></i> Cafe Management
        </Link>
        <Link to="/admin/orders" className={location.pathname.startsWith('/admin/orders') ? 'active' : ''}>
          <i className="fas fa-clipboard-list"></i> Orders
        </Link>
        <Link to="/admin/bookings" className={location.pathname === '/admin/bookings' ? 'active' : ''}>
          <i className="fas fa-calendar-alt"></i> Bookings
        </Link>
        <Link to="/admin/analytics" className={location.pathname === '/admin/analytics' ? 'active' : ''}>
          <i className="fas fa-chart-line"></i> Analytics
        </Link>
        <Link to="/admin/reports" className={location.pathname === '/admin/reports' ? 'active' : ''}>
          <i className="fas fa-file-alt"></i> Reports
        </Link>
        <Link to="/admin/settings" className={location.pathname === '/admin/settings' ? 'active' : ''}>
          <i className="fas fa-cog"></i> Settings
        </Link>
        <Link to="/admin/logs" className={location.pathname === '/admin/logs' ? 'active' : ''}>
          <i className="fas fa-file"></i> Logs
        </Link>
      </nav>
    </aside>
  );
}

export default AdminSidebar;
