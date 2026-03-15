import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './api';
import './styles/AuthPages.css';

function Login({ onAuthChange }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authApi.login({ email, password });
      const user = authApi.getUser();
      if (user) {
        localStorage.setItem('email', user.email);
        localStorage.setItem('name', user.name);
      }
      onAuthChange?.();
      const role = (data.roleType ?? user?.roleType ?? '').toUpperCase();
      if (role === 'ADMIN') navigate('/admin/dashboard', { replace: true });
      else if (role === 'CAFE_OWNER') navigate('/cafeowner/dashboard', { replace: true });
      else if (role === 'CHEF') navigate('/chef/dashboard', { replace: true });
      else if (role === 'WAITER' || role === 'STAFF') navigate('/waiter/dashboard', { replace: true });
      else navigate('/cafes', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(msg || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-card-modern">
      <div className="auth-card-head">
        <div className="auth-logo" aria-hidden="true">
          <i className="fas fa-mug-hot" />
        </div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your Digital Cafe account</p>
      </div>
      <div className="auth-card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div className="auth-form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <div className="auth-form-actions">
            <label className="d-flex align-items-center gap-2 small text-muted mb-0">
              <input type="checkbox" className="form-check-input" /> Remember me
            </label>
            <Link to="/forgot-password" className="auth-link">
              Forgot password?
            </Link>
          </div>
          {error && <div className="auth-form-error" role="alert">{error}</div>}
          <button type="submit" className="auth-btn-primary" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="auth-switch-link">
          <span className="text-muted small">Don&apos;t have an account? </span>
          <Link to="/register" className="auth-link">Create account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
