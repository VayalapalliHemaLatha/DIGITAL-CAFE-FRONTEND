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

      {/* Chef Profile Mock Widget */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-2 text-uppercase text-center">Active Chef</div>
        <div className="d-flex align-items-center mb-0">
          <img src="https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" alt="Chef Profile" className="rounded-circle me-3 border border-2 border-primary shadow-sm" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
          <div>
            <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Chef Marco</div>
            <div className="text-secondary" style={{ fontSize: '0.75rem' }}><i className="fas fa-circle text-success me-1" style={{ fontSize: '8px' }}></i>Executive Chef</div>
          </div>
        </div>
      </div>

      {/* Kitchen Status Mock Widget */}
      <div className="mt-auto mx-3 mb-3 p-3 bg-white rounded shadow-sm border" style={{ fontSize: '0.85rem' }}>
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Kitchen Status</div>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between text-muted small mb-1">
            <span>Grill Station</span>
            <span className="text-warning fw-bold">Busy</span>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div className="progress-bar bg-warning" role="progressbar" style={{ width: '85%' }} aria-valuenow="85" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between text-muted small mb-1">
            <span>Prep Station</span>
            <span className="text-success fw-bold">Optimal</span>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div className="progress-bar bg-success" role="progressbar" style={{ width: '45%' }} aria-valuenow="45" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        </div>

      {/* Prep List Progress Widget */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Daily Prep Progress</div>
        <div className="mb-2">
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>Vegetables</span>
            <span>80%</span>
          </div>
          <div className="progress" style={{ height: '4px' }}>
            <div className="progress-bar bg-success" style={{ width: '80%' }}></div>
          </div>
        </div>
        <div className="mb-2">
          <div className="d-flex justify-content-between small text-muted mb-1">
            <span>Sauces & Bases</span>
            <span>45%</span>
          </div>
          <div className="progress" style={{ height: '4px' }}>
            <div className="progress-bar bg-warning" style={{ width: '45%' }}></div>
          </div>
        </div>
      </div>

      {/* Recently Completed Items Widget */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Recently Ready</div>
        <div className="d-flex align-items-center mb-2 p-1 bg-light rounded">
          <i className="fas fa-check-circle text-success me-2 ms-1"></i>
          <span style={{ fontSize: '0.8rem' }} className="fw-bold text-dark">Paneer Tikka Pizza</span>
        </div>
        <div className="d-flex align-items-center mb-2 p-1 bg-light rounded">
          <i className="fas fa-check-circle text-success me-2 ms-1"></i>
          <span style={{ fontSize: '0.8rem' }} className="fw-bold text-dark">Classic Cold Coffee</span>
        </div>
      </div>

      <div className="fw-bold text-dark small mb-2 text-uppercase text-center border-bottom pb-2 pt-2">Low Stock Alerts</div>
      <div className="d-flex align-items-center mb-2 mt-2">
        <img src="https://images.unsplash.com/photo-1596489396264-a621746fce4f?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&q=80" alt="Tomatoes" className="rounded shadow-sm me-2" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />
        <div className="flex-grow-1">
          <div className="fw-bold text-dark" style={{ fontSize: '0.75rem' }}>Fresh Tomatoes</div>
        </div>
        <span className="badge bg-danger text-white rounded-pill" style={{ fontSize: '0.65rem' }}>2 kg left</span>
      </div>
      </div>
      <Link to="/" className="chef-waiter-back-home mt-0 mx-3 mb-3 btn btn-outline-danger">
        <i className="fas fa-sign-out-alt me-2"></i> Sign Out
      </Link>
    </aside>
  );
}

export default ChefSidebar;
