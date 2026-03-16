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
      {/* Today's Summary Mock Widget */}
      <div className="mt-auto mx-3 mb-4 p-3 bg-white rounded shadow-sm border" style={{ fontSize: '0.85rem' }}>
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Today's Summary</div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="text-center w-50 border-end">
            <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>ACTIVE TABLES</div>
            <div className="fw-bold text-primary fs-5 mt-1">12</div>
          </div>
          <div className="text-center w-50">
            <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 'bold' }}>PENDING</div>
            <div className="fw-bold text-warning fs-5 mt-1">8</div>
          </div>
        </div>
      <div className="fw-bold text-dark small mb-2 text-uppercase text-center border-bottom pb-2 pt-2">Trending Item</div>
        <div className="d-flex align-items-center mb-1 mt-3">
          <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&q=80" alt="Margherita Pizza" className="rounded shadow-sm me-3" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
          <div>
            <div className="fw-bold text-dark" style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>Margherita Pizza</div>
            <div className="text-muted mt-1" style={{ fontSize: '0.7rem' }}><i className="fas fa-arrow-up text-success me-1"></i>24 Orders today</div>
          </div>
        </div>
      </div>

      {/* Active Staff Widget */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Currently Working</div>
        <div className="d-flex align-items-center mb-2">
          <div className="bg-success rounded-circle me-3" style={{ width: '8px', height: '8px' }}></div>
          <div className="flex-grow-1" style={{ fontSize: '0.8rem' }}>
            <div className="fw-bold text-dark">Michael R. (Waiter)</div>
            <div className="text-muted small">Clocked in: 09:00 AM</div>
          </div>
        </div>
        <div className="d-flex align-items-center mb-2">
          <div className="bg-success rounded-circle me-3" style={{ width: '8px', height: '8px' }}></div>
          <div className="flex-grow-1" style={{ fontSize: '0.8rem' }}>
            <div className="fw-bold text-dark">Chef Marco (Kitchen)</div>
            <div className="text-muted small">Clocked in: 08:30 AM</div>
          </div>
        </div>
        <div className="d-flex align-items-center mb-0">
          <div className="bg-warning rounded-circle me-3" style={{ width: '8px', height: '8px' }}></div>
          <div className="flex-grow-1" style={{ fontSize: '0.8rem' }}>
            <div className="fw-bold text-dark">Sarah J. (Waiter)</div>
            <div className="text-muted small">On Break</div>
          </div>
        </div>
      </div>

      {/* Large Order Alert Widget */}
      <div className="mt-3 mx-3 p-2 bg-primary bg-opacity-10 rounded border border-primary border-opacity-25 border-dashed">
        <div className="d-flex align-items-center">
          <div className="badge bg-primary rounded-circle p-2 me-2">
            <i className="fas fa-receipt text-white" style={{ fontSize: '0.8rem' }}></i>
          </div>
          <div>
            <div className="fw-bold text-primary" style={{ fontSize: '0.75rem' }}>Large Order Alert!</div>
            <div className="text-dark fw-medium" style={{ fontSize: '0.7rem' }}>Table #8 • ₹4,250</div>
          </div>
        </div>
      </div>

      {/* Customer Feedback Snippet */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-2 text-uppercase text-center border-bottom pb-2">Recent Review</div>
        <div className="small italic text-muted mb-2">"Amazing food and even better service! The new Waiter Michael was great."</div>
        <div className="d-flex justify-content-center text-warning" style={{ fontSize: '0.7rem' }}>
            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i>
        </div>
      </div>

      <div className="cafeowner-portal-label mt-3 mb-3">VIEW CAFE PORTAL</div>
    </aside>
  );
}

export default CafeOwnerSidebar;
