import React from 'react';
import { Link } from 'react-router-dom';
import UserList from '../UserList';

const HERO_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';
const ABOUT_BG = 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800';

const services = [
  { icon: 'fa-user-tie', title: 'Master Chefs', text: 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam' },
  { icon: 'fa-utensils', title: 'Quality Food', text: 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam' },
  { icon: 'fa-cart-plus', title: 'Online Order', text: 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam' },
  { icon: 'fa-headset', title: '24/7 Service', text: 'Diam elitr kasd sed at elitr sed ipsum justo dolor sed clita amet diam' },
];

function HomePage({ isLoggedIn }) {
  return (
    <>
      {/* Hero - Enjoy Our Delicious Meal */}
      <div className="hero-header hero-home" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .85), rgba(15, 23, 43, .85)), url(${HERO_BG})` }}>
        <div className="container py-5">
          <div className="row align-items-center py-5">
            <div className="col-lg-6 text-white">
              <h1 className="display-4 fw-bold mb-3">Enjoy Our<br />Delicious Meal</h1>
              <p className="lead mb-4 opacity-90">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet.</p>
              <Link to="/login" className="btn btn-primary btn-lg rounded-0 px-4 py-3">Book A Table</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Service - 4 boxes */}
      <div id="service" className="container py-5">
        <div className="row g-4">
          {services.map((s, i) => (
            <div key={i} className="col-lg-3 col-md-6">
              <div className="service-item rounded p-4 text-center h-100">
                <i className={`fas ${s.icon} fa-2x text-primary mb-3`}></i>
                <h5 className="mb-2">{s.title}</h5>
                <p className="mb-0 small text-muted">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* About Us */}
      <div id="about" className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <div className="section-label">About Us</div>
              <h2 className="section-title text-start mb-3">Welcome to Digital Cafe</h2>
              <p className="text-muted">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos erat ipsum et lorem et sit, sed stet lorem sit.</p>
              <p className="text-muted">Tempor erat elitr rebum at clita. Diam dolor diam ipsum sit. Aliqu diam amet diam et eos. Clita erat ipsum et lorem et sit, sed stet lorem sit clita duo justo magna dolore erat amet.</p>
              <Link to="/login" className="btn btn-primary rounded-0 mt-2">Read More</Link>
            </div>
            <div className="col-lg-6">
              <div className="rounded overflow-hidden shadow" style={{ height: 300, background: `url(${ABOUT_BG}) center/cover` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Food Menu - Most Popular */}
      <div id="menu" className="container py-5">
        <div className="text-center mb-5">
          <div className="section-label">Food Menu</div>
          <h2 className="section-title text-center">Most Popular Items</h2>
        </div>
        <div className="row g-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="col-lg-4 col-md-6">
              <div className="auth-card p-4 d-flex align-items-center">
                <div className="flex-shrink-0 bg-primary bg-opacity-10 rounded p-3 me-3">
                  <i className="fas fa-coffee fa-2x text-primary"></i>
                </div>
                <div>
                  <h6 className="mb-1">Chicken Burger</h6>
                  <small className="text-muted">Ipsum ipsum clita erat amet dolor justo diam</small>
                  <p className="mb-0 mt-1 text-primary fw-bold">$115</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reservation CTA */}
      <div className="py-5" style={{ background: 'linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920) center/cover' }}>
        <div className="container text-center py-4">
          <div className="section-label text-primary">Reservation</div>
          <h2 className="text-white fw-bold mb-3">Book A Table Online</h2>
          <p className="text-white opacity-90 mb-4">Reserve your spot at Digital Cafe for the best experience.</p>
          <Link to="/login" className="btn btn-primary btn-lg rounded-0 px-4">Book Now</Link>
        </div>
      </div>

      {/* User List - only when logged in */}
      {isLoggedIn && (
        <div className="container py-5">
          <div className="text-center mb-4">
            <div className="section-label">Admin</div>
            <h2 className="section-title text-center">User List</h2>
          </div>
          <div className="auth-card p-4 p-lg-4">
            <UserList isLoggedIn={isLoggedIn} />
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
