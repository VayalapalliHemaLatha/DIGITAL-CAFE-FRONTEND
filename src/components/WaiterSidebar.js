import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function WaiterSidebar() {
  const location = useLocation();

  return (
    <aside className="chef-waiter-sidebar waiter-sidebar">
      <div className="chef-waiter-sidebar-brand">
        <i className="fas fa-concierge-bell"></i>
        Digital Cafe
      </div>
      <div className="chef-waiter-portal-label">WAITER PORTAL</div>
      <nav className="chef-waiter-sidebar-nav">
        <Link to="/waiter/dashboard" className={location.pathname === '/waiter/dashboard' ? 'active' : ''}>
          <i className="fas fa-th-large"></i> Dashboard
        </Link>
        <Link to="/waiter/orders" className={location.pathname === '/waiter/orders' ? 'active' : ''}>
          <i className="fas fa-clipboard-list"></i> Orders
        </Link>
        <Link to="/waiter/profile" className={location.pathname === '/waiter/profile' ? 'active' : ''}>
          <i className="fas fa-user"></i> My Profile
        </Link>
      </nav>
      <Link to="/" className="chef-waiter-back-home">
        <i className="fas fa-arrow-left me-2"></i> Back to Home
      </Link>
    </aside>
  );
}

export default WaiterSidebar;
