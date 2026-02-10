import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authApi } from '../api';

function Navbar({ isLoggedIn }) {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-restoran sticky-top">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <i className="fas fa-utensils me-2 text-primary"></i>
          Digital Cafe
        </Link>
        <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-lg-center">
            <li className="nav-item">
              <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#about">About</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#service">Service</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#menu">Menu</a>
            </li>
            <li className="nav-item dropdown">
              <button type="button" className="nav-link dropdown-toggle border-0 bg-transparent text-inherit" id="pagesDropdown" data-bs-toggle="dropdown" aria-expanded="false">Pages</button>
              <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="pagesDropdown">
                <li><Link to="/login" className="dropdown-item">Login</Link></li>
                <li><Link to="/register" className="dropdown-item">Sign Up</Link></li>
                <li><Link to="/account" className="dropdown-item">Account / Sign out</Link></li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#contact">Contact</a>
            </li>
            {isLoggedIn ? (
              <li className="nav-item">
                <Link to="/account" className="nav-link py-0 d-flex align-items-center">
                  <i className="fas fa-user me-2 text-primary"></i>
                  {authApi.getUser()?.name ?? authApi.getUser()?.email ?? 'User'}
                </Link>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link btn btn-book rounded-0 ms-lg-3">Sign In</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
