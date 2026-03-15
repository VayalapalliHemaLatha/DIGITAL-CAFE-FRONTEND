import React from 'react';
import { Link } from 'react-router-dom';
import Register from '../Register';

const PAGE_BG = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1920';

function RegisterPage({ onAuthChange }) {
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
              <li className="breadcrumb-item active" aria-current="page">Create account</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Create account</h1>
          <p className="text-white-50 small mb-0 mt-1">Register to order food and book tables</p>
        </div>
      </div>
      <div className="auth-page-wrap">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-6">
              <Register onAuthChange={onAuthChange} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterPage;
