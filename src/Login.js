import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from './api';

const Login = ({ onAuthChange }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email') setEmail(value);
        if (name === 'password') setPassword(value);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const data = await authApi.login({ email, password });
            setSuccess(`Welcome back, ${data.name ?? data.user?.name ?? data.email ?? email}.`);
            setEmail('');
            setPassword('');
            onAuthChange?.();
            const role = (data.roleType || data.user?.roleType || '').toLowerCase();
            if (role === 'admin') {
              navigate('/admin/cafeowners');
            } else if (role === 'cafeowner') {
              navigate('/cafeowner/staff');
            } else {
              navigate('/');
            }
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Login failed.';
            setError(msg);
        }
    };

    return (
        <>
            <div className="section-label">Sign In</div>
            <h3 className="section-title mb-4">Login to your account</h3>

            {authApi.isLoggedIn() ? (
                <div className="text-center py-4">
                    <p className="text-success mb-3">
                        <i className="fas fa-check-circle me-2"></i>
                        You are already signed in as <strong>{authApi.getUser()?.name ?? authApi.getUser()?.email ?? 'User'}</strong>
                    </p>
                    <p className="text-muted small mb-3">Go to your account to sign out.</p>
                    <Link to="/account" className="btn btn-primary">
                        <i className="fas fa-user me-2"></i> Go to Account / Sign out
                    </Link>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            placeholder="Your Email"
                            value={email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            className="form-control"
                            placeholder="Your Password"
                            value={password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    {error && <div className="alert alert-danger py-2 small">{error}</div>}
                    {success && <div className="alert alert-success py-2 small">{success}</div>}
                    <button type="submit" className="btn btn-primary w-100 py-2">
                        <i className="fas fa-sign-in-alt me-2"></i> Login
                    </button>
                </form>
            )}
        </>
    );
};

export default Login;
