import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function ChefSidebar() {
  const location = useLocation();

  return (
    <aside className="chef-waiter-sidebar">
      <div className="chef-waiter-sidebar-brand">
        <i className="fas fa-fire"></i>
        Digital Cafe
      </div>
      <div className="chef-waiter-portal-label">CHEF PORTAL</div>
      <nav className="chef-waiter-sidebar-nav">
        <Link to="/chef/dashboard" className={location.pathname === '/chef/dashboard' ? 'active' : ''}>
          <i className="fas fa-th-large"></i> Dashboard
        </Link>
        <Link to="/chef/orders" className={location.pathname === '/chef/orders' ? 'active' : ''}>
          <i className="fas fa-fire"></i> Active Orders
        </Link>
        <Link to="/chef/order-history" className={location.pathname === '/chef/order-history' ? 'active' : ''}>
          <i className="fas fa-clock"></i> Order History
        </Link>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
          <i className="fas fa-user"></i> My Profile
        </Link>
      </nav>
      <Link to="/" className="chef-waiter-back-home">
        <i className="fas fa-arrow-left me-2"></i> Back to Home
      </Link>
    </aside>
  );
}

export default ChefSidebar;
