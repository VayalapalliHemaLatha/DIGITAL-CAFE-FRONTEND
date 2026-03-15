import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './api';
import './styles/AuthPages.css';

const Register = ({ onAuthChange }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const data = await authApi.signup({
        email: user.email,
        password: user.password,
        name: user.name,
        phone: user.phone || undefined,
        address: user.address || undefined,
      });
      const displayName = data.user?.name ?? data.name ?? user.name;
      setSuccess(`Account created! Welcome, ${displayName}. Redirecting...`);
      setUser({ name: '', email: '', password: '', phone: '', address: '' });
      onAuthChange?.();
      setTimeout(() => navigate('/cafes', { replace: true }), 1200);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (authApi.isLoggedIn()) {
    return (
      <div className="auth-card-modern">
        <div className="auth-card-head">
          <div className="auth-logo" aria-hidden="true">
            <i className="fas fa-mug-hot" />
          </div>
          <h1 className="auth-title">Already signed in</h1>
          <p className="auth-subtitle">You are logged in as {authApi.getUser()?.name ?? authApi.getUser()?.email ?? 'User'}</p>
        </div>
        <div className="auth-card-body text-center">
          <Link to="/account" className="auth-btn-primary d-inline-block w-100 text-center text-decoration-none mb-2" style={{ lineHeight: '2.5' }}>
            Account
          </Link>
          <Link to="/cafes" className="auth-link">Browse Cafes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-card-modern">
      <div className="auth-card-head">
        <div className="auth-logo" aria-hidden="true">
          <i className="fas fa-mug-hot" />
        </div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">Join Digital Cafe to order and book tables</p>
      </div>
      <div className="auth-card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-form-group">
            <label htmlFor="reg-name">Full name</label>
            <input
              id="reg-name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Your name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="reg-email">Email</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              type="password"
              name="password"
              autoComplete="new-password"
              placeholder="At least 6 characters"
              value={user.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="reg-phone">Phone (optional)</label>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              autoComplete="tel"
              placeholder="+1-555-0100"
              value={user.phone}
              onChange={handleChange}
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="reg-address">Address (optional)</label>
            <input
              id="reg-address"
              type="text"
              name="address"
              autoComplete="street-address"
              placeholder="City or full address"
              value={user.address}
              onChange={handleChange}
            />
          </div>
          {error && <div className="auth-form-error" role="alert">{error}</div>}
          {success && <div className="auth-form-success" role="status">{success}</div>}
          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
        <div className="auth-switch-link">
          <span className="text-muted small">Already have an account? </span>
          <Link to="/login" className="auth-link">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
