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
        <Link to="/waiter/tables" className={location.pathname === '/waiter/tables' ? 'active' : ''}>
          <i className="fas fa-table"></i> Table Management
        </Link>
        <Link to="/waiter/menu" className={location.pathname === '/waiter/menu' ? 'active' : ''}>
          <i className="fas fa-utensils"></i> Menu Items
        </Link>
        <Link to="/waiter/kitchen" className={location.pathname === '/waiter/kitchen' ? 'active' : ''}>
          <i className="fas fa-fire"></i> Kitchen Status
        </Link>
        <Link to="/waiter/reports" className={location.pathname === '/waiter/reports' ? 'active' : ''}>
          <i className="fas fa-chart-bar"></i> Reports
        </Link>
        <Link to="/waiter/profile" className={location.pathname === '/waiter/profile' ? 'active' : ''}>
          <i className="fas fa-user"></i> My Profile
        </Link>
      </nav>
      {/* Mock Widget for realism */}
      <div className="mt-4 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-2 text-uppercase text-center">Active Shift</div>
        <div className="d-flex align-items-center mb-3">
          <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=80&h=80&q=80" alt="Waiter Profile" className="rounded-circle me-3 border border-2 border-success shadow-sm" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
          <div>
            <div className="fw-bold text-dark" style={{ fontSize: '0.9rem' }}>Michael Ross</div>
            <div className="text-secondary" style={{ fontSize: '0.75rem' }}><i className="fas fa-circle text-success me-1" style={{ fontSize: '8px' }}></i>On Duty (Main Floor)</div>
          </div>
        </div>
        <div className="d-flex justify-content-between align-items-center border-top pt-3 mt-1">
            <div className="text-center w-50 border-end">
              <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>ACTIVE TABLES</div>
              <div className="fw-bold text-primary fs-5 mt-1">8</div>
            </div>
            <div className="text-center w-50">
              <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>TIPS EARNED</div>
              <div className="fw-bold text-success fs-5 mt-1">₹1,450</div>
            </div>
        </div>
      </div>

      {/* Chef's Specials Items */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Chef's Specials</div>
        <div className="mb-3 d-flex align-items-center">
          <img src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80" alt="Burger Deluxe" className="rounded shadow-sm me-3" style={{ width: '56px', height: '56px', objectFit: 'cover' }} />
          <div className="flex-grow-1">
            <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Truffle Beef Burger</div>
            <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>₹449 • <span className="text-warning fw-medium"><i className="fas fa-star" style={{fontSize: '10px'}}></i> 4.9</span></div>
          </div>
        </div>
        <div className="mb-3 d-flex align-items-center">
          <img src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80" alt="Pasta Special" className="rounded shadow-sm me-3" style={{ width: '56px', height: '56px', objectFit: 'cover' }} />
          <div className="flex-grow-1">
            <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Creamy Pesto Pasta</div>
            <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>₹389 • <span className="text-warning fw-medium"><i className="fas fa-star" style={{fontSize: '10px'}}></i> 4.8</span></div>
          </div>
        </div>
        <div className="mb-1 d-flex align-items-center">
          <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=120&q=80" alt="Steak" className="rounded shadow-sm me-3" style={{ width: '56px', height: '56px', objectFit: 'cover' }} />
          <div className="flex-grow-1">
            <div className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>Grilled Ribeye Steak</div>
            <div className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>₹899 • <span className="text-warning fw-medium"><i className="fas fa-star" style={{fontSize: '10px'}}></i> 5.0</span></div>
          </div>
        </div>
      </div>

      {/* Upcoming Reservations Widget */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Upcoming Table Bookings</div>
        <div className="mb-2 d-flex align-items-center justify-content-between p-2 rounded bg-light border-start border-3 border-primary">
          <div style={{ fontSize: '0.8rem' }}>
            <div className="fw-bold text-dark">Table #4</div>
            <div className="text-muted">Mr. Sharma • 4 Guests</div>
          </div>
          <div className="fw-bold text-primary" style={{ fontSize: '0.75rem' }}>18:30</div>
        </div>
        <div className="mb-2 d-flex align-items-center justify-content-between p-2 rounded bg-light border-start border-3 border-info">
          <div style={{ fontSize: '0.8rem' }}>
            <div className="fw-bold text-dark">Table #12</div>
            <div className="text-muted">Ms. Gupta • 2 Guests</div>
          </div>
          <div className="fw-bold text-info" style={{ fontSize: '0.75rem' }}>19:15</div>
        </div>
        <div className="text-center mt-2">
            <Link to="/waiter/tables" className="text-decoration-none small fw-bold text-primary">View All Bookings →</Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">My Performance</div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <div className="text-center">
            <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>PENDING</div>
            <div className="fw-bold text-warning fs-5">4</div>
          </div>
          <div className="text-center border-start border-end px-3">
            <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>SERVED</div>
            <div className="fw-bold text-success fs-5">32</div>
          </div>
          <div className="text-center">
            <div className="text-muted" style={{ fontSize: '0.65rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>AVG TIME</div>
            <div className="fw-bold text-primary fs-5">12m</div>
          </div>
        </div>
        <div className="small text-muted text-center mb-2" style={{ fontSize: '0.7rem' }}>Service Efficiency: 94%</div>
        <div className="progress shadow-sm" style={{ height: '8px', borderRadius: '4px' }}>
          <div className="progress-bar bg-success" role="progressbar" style={{ width: '88%' }} aria-valuenow="88" aria-valuemin="0" aria-valuemax="100"></div>
          <div className="progress-bar bg-warning" role="progressbar" style={{ width: '12%' }} aria-valuenow="12" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>

      {/* Live Table Map Widget */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Live Table Status</div>
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
            <div key={num} className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold shadow-sm ${[1,4,7,10].includes(num) ? 'bg-danger' : [2,5,8,11].includes(num) ? 'bg-warning' : 'bg-success'}`} style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>
              {num}
            </div>
          ))}
        </div>
        <div className="d-flex justify-content-around small text-muted border-top pt-2" style={{ fontSize: '0.65rem' }}>
          <span><i className="fas fa-circle text-success me-1"></i>Free</span>
          <span><i className="fas fa-circle text-warning me-1"></i>Reserved</span>
          <span><i className="fas fa-circle text-danger me-1"></i>Occupied</span>
        </div>
      </div>

      {/* Popular Categories Widget */}
      <div className="mt-3 mx-3 p-3 bg-white rounded shadow-sm border">
        <div className="fw-bold text-dark small mb-3 text-uppercase text-center border-bottom pb-2">Top Categories</div>
        <div className="row g-2">
          <div className="col-6 text-center">
            <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" className="rounded shadow-sm mb-1 w-100" style={{ height: '50px', objectFit: 'cover' }} alt="Pizza" />
            <div className="fw-bold text-dark" style={{ fontSize: '0.7rem' }}>Pizzas</div>
          </div>
          <div className="col-6 text-center">
            <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" className="rounded shadow-sm mb-1 w-100" style={{ height: '50px', objectFit: 'cover' }} alt="Drinks" />
            <div className="fw-bold text-dark" style={{ fontSize: '0.7rem' }}>Beverages</div>
          </div>
          <div className="col-6 text-center">
            <img src="https://images.unsplash.com/photo-1551024601-bec78aea704b?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" className="rounded shadow-sm mb-1 w-100" style={{ height: '50px', objectFit: 'cover' }} alt="Desserts" />
            <div className="fw-bold text-dark" style={{ fontSize: '0.7rem' }}>Desserts</div>
          </div>
          <div className="col-6 text-center">
            <img src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80" className="rounded shadow-sm mb-1 w-100" style={{ height: '50px', objectFit: 'cover' }} alt="Salads" />
            <div className="fw-bold text-dark" style={{ fontSize: '0.7rem' }}>Healthy</div>
          </div>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="mt-3 mx-3 mb-4 p-3 bg-white rounded shadow-sm border">
        <div className="mb-3 position-relative">
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80" alt="Restaurant Interior" className="rounded w-100 shadow-sm" style={{ height: '110px', objectFit: 'cover' }} />
          <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', borderBottomLeftRadius: '0.375rem', borderBottomRightRadius: '0.375rem' }}>
             <div className="fw-bold text-white fs-6">The Digital Cafe</div>
          </div>
        </div>
        <div className="d-flex align-items-center text-muted mb-2 px-1" style={{ fontSize: '0.8rem' }}>
          <i className="far fa-clock me-3 text-primary" style={{ width: '16px', textAlign: 'center' }}></i> 09:00 AM - 11:30 PM
        </div>
        <div className="d-flex align-items-center text-muted mb-2 px-1" style={{ fontSize: '0.8rem' }}>
          <i className="fas fa-map-marker-alt me-3 text-danger" style={{ width: '16px', textAlign: 'center' }}></i> 123 Culinary Ave, Metro
        </div>
        <div className="d-flex align-items-center text-muted px-1" style={{ fontSize: '0.8rem' }}>
          <i className="fas fa-phone-alt me-3 text-success" style={{ width: '16px', textAlign: 'center' }}></i> +91 98765 43210
        </div>
      </div>

      <Link to="/" className="chef-waiter-back-home mt-auto mx-3 mb-3 btn btn-outline-danger">
        <i className="fas fa-sign-out-alt me-2"></i> Sign Out
      </Link>
    </aside>
  );
}

export default WaiterSidebar;
