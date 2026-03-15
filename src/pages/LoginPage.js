import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../Login';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';

function LoginPage({ onAuthChange }) {
  return (
    <>
      <div
        className="hero-header hero-page auth-hero-auth"
        style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .92), rgba(15, 23, 43, .92)), url(${PAGE_BG})` }}
      >
        <div className="container py-4">
          <nav className="mb-2" aria-label="Breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/">Home</Link></li>
              <li className="breadcrumb-item">Pages</li>
              <li className="breadcrumb-item active" aria-current="page">Sign in</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Sign in</h1>
          <p className="text-white-50 small mb-0 mt-1">Access your account to order and book tables</p>
        </div>
      </div>
      <div className="auth-page-wrap">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-6">
              <Login onAuthChange={onAuthChange} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
