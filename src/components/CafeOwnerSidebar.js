import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function CafeOwnerSidebar({ cafeName = 'My Cafe' }) {
  const location = useLocation();

  return (
    <aside className="admin-sidebar cafe-owner-sidebar">
      <div className="admin-sidebar-brand">
        <i className="fas fa-coffee"></i>
        Digital Cafe
      </div>
      <Link to="/" className="cafeowner-back-home">
        <i className="fas fa-arrow-left me-2"></i> Back to Home
      </Link>
      <div className="cafeowner-cafe-name">{cafeName}</div>
      <nav className="admin-sidebar-nav">
        <Link to="/cafeowner/dashboard" className={location.pathname === '/cafeowner/dashboard' ? 'active' : ''}>
          <i className="fas fa-th-large"></i> Dashboard
        </Link>
        <Link to="/cafeowner/tables" className={location.pathname === '/cafeowner/tables' ? 'active' : ''}>
          <i className="fas fa-store"></i> My Cafe
        </Link>
        <Link to="/cafeowner/tables" className={location.pathname === '/cafeowner/tables' ? 'active' : ''}>
          <i className="fas fa-chair"></i> Tables
        </Link>
        <Link to="/cafeowner/menu" className={location.pathname === '/cafeowner/menu' ? 'active' : ''}>
          <i className="fas fa-utensils"></i> Menu
        </Link>
        <Link to="/cafeowner/staff" className={location.pathname === '/cafeowner/staff' ? 'active' : ''}>
          <i className="fas fa-users"></i> Staff
        </Link>
        <Link to="/cafeowner/orders" className={location.pathname.startsWith('/cafeowner/orders') ? 'active' : ''}>
          <i className="fas fa-clipboard-list"></i> Orders
        </Link>
        <Link to="/cafeowner/bookings" className={location.pathname === '/cafeowner/bookings' ? 'active' : ''}>
          <i className="fas fa-calendar-alt"></i> Bookings
        </Link>
        <Link to="/cafeowner/settings" className={location.pathname === '/cafeowner/settings' ? 'active' : ''}>
          <i className="fas fa-cog"></i> Settings
        </Link>
      </nav>
      <div className="cafeowner-portal-label">VIEW CAFE PORTAL</div>
    </aside>
  );
}

export default CafeOwnerSidebar;
