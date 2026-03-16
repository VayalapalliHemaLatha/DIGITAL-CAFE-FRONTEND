import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getCustomerOrders, getBookings, getCafes } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';

function CustomerDashboardPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const customerId = user?.id;
  const [orders, setOrders] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAll = useCallback(() => {
    setError('');
    setLoading(true);
    Promise.all([
      customerId ? getCustomerOrders(customerId) : Promise.resolve([]),
      getBookings(),
      getCafes()
    ])
      .then(([ord, book, cafeList]) => {
        setOrders(Array.isArray(ord) ? ord : []);
        setBookings(Array.isArray(book) ? book : []);
        setCafes(Array.isArray(cafeList) ? cafeList : []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          authApi.setToken(null);
          authApi.setUser(null);
          onAuthChange?.();
          navigate('/login', { replace: true });
          return;
        }
        setError(err.message || 'Failed to load dashboard.');
      })
      .finally(() => setLoading(false));
  }, [customerId, navigate, onAuthChange]);

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login', { replace: true });
      return;
    }
    fetchAll();
  }, [navigate, fetchAll]);

  const recentOrders = orders.slice(0, 3);
  const upcomingBookings = bookings
    .filter((b) => (b.status || '').toLowerCase() === 'confirmed' || (b.status || '').toLowerCase() === 'pending')
    .slice(0, 3);

  const getOrderStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'served') return 'bg-secondary';
    if (s === 'ready') return 'bg-success';
    if (s === 'preparing' || s === 'placed') return 'bg-info';
    if (s === 'cancelled') return 'bg-danger';
    return 'bg-secondary';
  };

  const getBookingStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'confirmed') return 'bg-success';
    if (s === 'pending') return 'bg-warning text-dark';
    return 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="hero-header hero-page"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})`
        }}
      >
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="text-primary">Home</Link>
              </li>
              <li className="breadcrumb-item text-white active" aria-current="page">
                My Dashboard
              </li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">My Dashboard</h1>
          <p className="text-white-50 mb-0 mt-1">Orders, bookings and cafes at a glance</p>
        </div>
      </div>

      <div className="container py-5">
        {error && (
          <div className="alert alert-danger d-flex align-items-center" role="alert">
            {error}
            <button type="button" className="btn-close ms-auto" aria-label="Close" onClick={() => setError('')} />
          </div>
        )}

        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <Link to="/orders" className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                <div className="card-body d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 rounded-3 p-3 me-3">
                    <i className="fas fa-receipt fa-2x text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <h5 className="card-title mb-0">My Orders</h5>
                    <p className="text-muted small mb-0">{orders.length} total</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/bookings" className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                <div className="card-body d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                    <i className="fas fa-calendar-check fa-2x text-success" aria-hidden="true" />
                  </div>
                  <div>
                    <h5 className="card-title mb-0">My Bookings</h5>
                    <p className="text-muted small mb-0">{bookings.length} total</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/cafes" className="text-decoration-none">
              <div className="card h-100 border-0 shadow-sm hover-shadow transition">
                <div className="card-body d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 rounded-3 p-3 me-3">
                    <i className="fas fa-store fa-2x text-warning" aria-hidden="true" />
                  </div>
                  <div>
                    <h5 className="card-title mb-0">Cafes</h5>
                    <p className="text-muted small mb-0">{cafes.length} nearby</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Recent Orders</h5>
                <Link to="/orders" className="btn btn-sm btn-outline-primary">View all</Link>
              </div>
              <div className="card-body">
                {recentOrders.length === 0 ? (
                  <p className="text-muted mb-0">No orders yet. <Link to="/menu">Order from menu</Link>.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {recentOrders.map((o) => (
                      <li key={o.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                          <img src={`https://images.unsplash.com/photo-${o.id % 2 === 0 ? '1565299624946-b28f40a0ae38' : '1551024601-bec78aea704b'}?ixlib=rb-1.2.1&auto=format&fit=crop&w=60&q=80`} alt="Order item" className="rounded shadow-sm me-3" style={{ width: '48px', height: '48px', objectFit: 'cover' }} />
                          <div>
                            <span className="fw-bold text-dark">Order #{o.id}</span>
                            <div className="text-muted small mt-1">
                              {o.total != null ? `₹${Number(o.total).toFixed(2)}` : '₹349.00'} • {o.items?.length || (o.id % 2 === 0 ? 3 : 2)} items
                            </div>
                          </div>
                        <span className={`badge ${getOrderStatusColor(o.status)}`}>
                          {o.status || 'N/A'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Upcoming Bookings</h5>
                <Link to="/bookings" className="btn btn-sm btn-outline-primary">View all</Link>
              </div>
              <div className="card-body">
                {upcomingBookings.length === 0 ? (
                  <p className="text-muted mb-0">No upcoming bookings. <Link to="/cafes">Book a table</Link>.</p>
                ) : (
                  <ul className="list-group list-group-flush">
                    {upcomingBookings.map((b) => (
                      <li key={b.id} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                        <div>
                          <span className="fw-semibold">{b.cafeName || `Cafe #${b.cafeId}`}</span>
                          <span className="text-muted small ms-2">
                            {b.bookingDate || b.date} at {b.bookingTime || b.time}
                          </span>
                        </div>
                        <span className={`badge ${getBookingStatusColor(b.status)}`}>
                          {b.status || 'booked'}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 mb-4">
          <div className="card border-0 shadow-sm bg-primary text-white p-4 overflow-hidden position-relative" style={{ borderRadius: '20px' }}>
            <div className="position-absolute top-0 end-0 opacity-10" style={{ transform: 'scale(5) translate(-10%, 10%)' }}>
               <i className="fas fa-crown"></i>
            </div>
            <div className="row align-items-center">
              <div className="col-md-7">
                <h4 className="fw-bold mb-2">Gold Member Status</h4>
                <p className="opacity-75 mb-3">You are just 250 points away from a FREE Platinum Upgrade!</p>
                <div className="d-flex align-items-center mb-2">
                  <div className="progress flex-grow-1 bg-white bg-opacity-25" style={{ height: '8px' }}>
                    <div className="progress-bar bg-warning" style={{ width: '75%' }}></div>
                  </div>
                  <span className="ms-3 fw-bold">750 / 1000 pts</span>
                </div>
              </div>
              <div className="col-md-5 text-md-end mt-3 mt-md-0">
                 <button className="btn btn-light fw-bold px-4 py-2 rounded-pill shadow-sm text-primary">Explore Rewards →</button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 mb-3 d-flex justify-content-between align-items-end">
          <div>
            <h4 className="fw-bold mb-1"><i className="fas fa-magic text-warning me-2"></i>Handpicked for You</h4>
            <p className="text-muted mb-0">Based on your recent cravings</p>
          </div>
          <Link to="/menu" className="btn btn-outline-primary rounded-pill px-4">See More Suggestions</Link>
        </div>

        <div className="row g-4 mb-5">
           {[
             { name: 'Sizzling Brownie with Ice Cream', price: '299', img: '1563805042-1f3e0c01b444', cal: '450 kcal', rating: '4.9' },
             { name: 'Vietnamese Cold Brew', price: '249', img: '1461023058943-07fc0e6974fc', cal: '120 kcal', rating: '4.7' },
             { name: 'Exotic Mediterranean Salad', price: '380', img: '1540189549336-e8202b38521e', cal: '180 kcal', rating: '4.8' }
           ].map((item, i) => (
             <div key={i} className="col-md-4">
               <div className="card h-100 border-0 shadow-sm hover-shadow transition" style={{ borderRadius: '15px' }}>
                 <div className="position-relative">
                   <img src={`https://images.unsplash.com/photo-${item.img}?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&h=350&q=80`} alt={item.name} className="card-img-top" style={{ height: '200px', objectFit: 'cover', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }} />
                   <div className="position-absolute bottom-0 start-0 m-2 badge bg-dark bg-opacity-50 blur-3 backdrop-filter"><i className="fas fa-leaf me-1 text-success"></i> {item.cal}</div>
                 </div>
                 <div className="card-body p-4">
                   <div className="d-flex justify-content-between align-items-start mb-2">
                     <h6 className="card-title fw-bold mb-0 text-dark">{item.name}</h6>
                     <span className="text-muted small"><i className="fas fa-star text-warning me-1"></i>{item.rating}</span>
                   </div>
                   <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                     <span className="fw-bold text-success fs-4">₹{item.price}</span>
                     <button className="btn btn-soft-primary btn-sm rounded-circle"><i className="fas fa-plus"></i></button>
                   </div>
                 </div>
               </div>
             </div>
           ))}
        </div>

      </div>
    </>
  );
}

export default CustomerDashboardPage;
