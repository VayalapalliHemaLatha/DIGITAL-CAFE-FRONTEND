import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';

function AccountPage({ onAuthChange }) {
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const isLoggedIn = authApi.isLoggedIn();
  const user = authApi.getUser();

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await authApi.logout();
      onAuthChange?.();
      navigate('/', { replace: true });
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item text-white">Pages</li>
              <li className="breadcrumb-item text-white active" aria-current="page">Account</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Your Account</h1>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="auth-card p-5 text-center">
              {isLoggedIn ? (
                <>
                  <div className="mb-4">
                    <div className="rounded-circle bg-primary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                      <i className="fas fa-user fa-3x text-primary"></i>
                    </div>
                    <h2 className="section-title mb-2">You are signed in</h2>
                    <p className="text-muted mb-0">
                      Logged in as <strong className="text-dark">{user?.name ?? user?.email ?? 'User'}</strong>
                      {user?.roleType && (
                        <span className="text-muted"> ({user.roleType})</span>
                      )}
                    </p>
                    {user?.email && user?.name && (
                      <p className="text-muted small mt-1">{user.email}</p>
                    )}
                  </div>
                  <p className="text-muted mb-4">
                    Click the button below to sign out of your account. You can sign in again anytime.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg px-5 py-3"
                    onClick={handleLogout}
                    disabled={loggingOut}
                  >
                    {loggingOut ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing out...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-out-alt me-2"></i>
                        Sign out
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <div className="mb-4">
                    <div className="rounded-circle bg-secondary bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3" style={{ width: 80, height: 80 }}>
                      <i className="fas fa-user fa-3x text-secondary"></i>
                    </div>
                    <h2 className="section-title mb-2">You are not signed in</h2>
                    <p className="text-muted mb-4">
                      Sign in to your account to manage your profile and sign out when you’re done.
                    </p>
                    <Link to="/login" className="btn btn-primary btn-lg px-5 py-3">
                      <i className="fas fa-sign-in-alt me-2"></i> Go to Sign in
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountPage;
