import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

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
      // Main login endpoint
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const data = response.data; // AuthResponse(token, userId, email, name, roleType)

      // Persist auth info
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('email', data.email);
      localStorage.setItem('name', data.name);
      localStorage.setItem('role', data.roleType);

      // Let the rest of the app know auth changed
      onAuthChange?.();

      // Role-based navigation (adapted to your existing routes)
      switch (data.roleType) {
        case 'ADMIN':
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'CAFE_OWNER':
          navigate('/cafeowner/dashboard', { replace: true });
          break;
        case 'CHEF':
          navigate('/chef/dashboard', { replace: true });
          break;
        case 'WAITER':
        case 'STAFF':
          navigate('/waiter/dashboard', { replace: true });
          break;
        default: // CUSTOMER or anything else
          navigate('/cafes', { replace: true });
          break;
      }
    } catch (err) {
      const backendMessage =
        err.response?.data?.message || err.response?.data?.error;
      setError(backendMessage || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Digital Cafe Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
        </div>
        <div style={{ marginTop: '4px', marginBottom: '8px', textAlign: 'right' }}>
          <Link to="/forgot-password" style={{ fontSize: '0.85rem', color: '#2563eb' }}>
            Forgot password?
          </Link>
        </div>
        {error && (
          <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
