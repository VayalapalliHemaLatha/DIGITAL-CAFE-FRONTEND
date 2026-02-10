import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../Login';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';

function LoginPage({ onAuthChange }) {
  return (
    <>
      <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item text-white">Pages</li>
              <li className="breadcrumb-item text-white active" aria-current="page">Login</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Sign In</h1>
        </div>
      </div>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6">
            <div className="auth-card p-4 p-lg-5">
              <Login onAuthChange={onAuthChange} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
