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
        <Link to="/admin/users" className={location.pathname === '/admin/users' ? 'active' : ''}>
          <i className="fas fa-users"></i> User Management
        </Link>
        <Link to="/admin/cafeowners" className={location.pathname === '/admin/cafeowners' ? 'active' : ''}>
          <i className="fas fa-user-tie"></i> Cafe Owners
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
      {/* Top Performing Cafe Mock Widget */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Top Performer</div>
        <div className="position-relative mb-2">
          <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Top Cafe" className="rounded w-100 shadow-sm" style={{ height: '100px', objectFit: 'cover' }} />
          <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', borderBottomLeftRadius: '0.375rem', borderBottomRightRadius: '0.375rem' }}>
            <div className="fw-bold text-white" style={{ fontSize: '0.8rem' }}>Downtown Grind</div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="text-muted" style={{ fontSize: '0.7rem' }}><i className="fas fa-chart-line text-success me-1"></i>+24% Growth</div>
          <div className="fw-bold text-primary" style={{ fontSize: '0.8rem' }}>₹85,420</div>
        </div>
      </div>

      {/* Platform Overview Mock Widget */}
      <div className="mt-2 mx-3 mb-4 p-3 bg-white rounded shadow-sm border" style={{ fontSize: '0.85rem' }}>
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Platform Status</div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px' }}>
              <i className="fas fa-users" style={{ fontSize: '0.7rem' }}></i>
            </div>
            <div>
              <div className="fw-bold text-dark" style={{ lineHeight: '1.2' }}>4,289</div>
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>Active Users</div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px' }}>
              <i className="fas fa-store" style={{ fontSize: '0.7rem' }}></i>
            </div>
            <div>
              <div className="fw-bold text-dark" style={{ lineHeight: '1.2' }}>142</div>
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>Active Cafes</div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '28px', height: '28px' }}>
              <i className="fas fa-chart-line" style={{ fontSize: '0.7rem' }}></i>
            </div>
            <div>
              <div className="fw-bold text-dark" style={{ lineHeight: '1.2' }}>₹1.2M</div>
              <div className="text-muted" style={{ fontSize: '0.7rem' }}>Today's Volume</div>
            </div>
          </div>
        </div>
        <div className="text-center mt-3 pt-2 border-top">
          <span className="badge bg-success bg-opacity-10 text-success border border-success w-100 rounded-pill py-2">
            <i className="fas fa-check-circle me-1"></i> All Systems Operational
          </span>
        </div>
      </div>

      {/* Admin Alerts & Growth Widget */}
      <div className="mt-2 mx-3 mb-4 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">System Insight</div>
        <div className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="text-muted small fw-bold">LATENCY</span>
                <span className="text-success small fw-bold">140ms</span>
            </div>
            <div className="progress" style={{ height: '4px' }}>
                <div className="progress-bar bg-success" style={{ width: '92%' }}></div>
            </div>
        </div>
        <div className="bg-light p-2 rounded mb-2 border-start border-3 border-warning">
            <div className="fw-bold text-dark small" style={{ fontSize: '0.75rem' }}>Storage Warning</div>
            <div className="text-muted" style={{ fontSize: '0.7rem' }}>Cache DB at 85% capacity</div>
        </div>
        <div className="bg-light p-2 rounded mb-0 border-start border-3 border-info">
            <div className="fw-bold text-dark small" style={{ fontSize: '0.75rem' }}>Daily Backup</div>
            <div className="text-muted" style={{ fontSize: '0.7rem' }}>Completed successfully</div>
        </div>
      </div>

      {/* Strategic Forecast Widget */}
      <div className="mt-2 mx-3 mb-4 p-3 bg-dark rounded shadow-sm border border-secondary">
        <div className="fw-bold text-light small mb-3 text-uppercase text-center border-bottom border-secondary pb-2">Revenue Forecast</div>
        <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-secondary small">PROJECTION</span>
            <span className="text-info fw-bold small">₹2.4M</span>
        </div>
        <div className="d-flex align-items-end mb-2" style={{ height: '30px' }}>
            <div className="bg-info bg-opacity-25 w-100 me-1" style={{ height: '40%' }}></div>
            <div className="bg-info bg-opacity-50 w-100 me-1" style={{ height: '60%' }}></div>
            <div className="bg-info bg-opacity-75 w-100 me-1" style={{ height: '80%' }}></div>
            <div className="bg-info w-100" style={{ height: '95%' }}></div>
        </div>
        <div className="text-secondary text-center" style={{ fontSize: '0.6rem' }}>Next 30 days based on current growth</div>
      </div>
    </aside>
  );
}

export default AdminSidebar;
