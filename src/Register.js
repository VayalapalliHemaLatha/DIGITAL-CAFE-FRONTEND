import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from './api';

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

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        try {
            const data = await authApi.signup({
                email: user.email,
                password: user.password,
                name: user.name,
                phone: user.phone || undefined,
                address: user.address || undefined,
            });
            const displayName = data.name ?? data.user?.name ?? user.name;
            setSuccess(`Account created! Welcome, ${displayName}. You are logged in.`);
            setUser({ name: '', email: '', password: '', phone: '', address: '' });
            onAuthChange?.();
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Registration failed.';
            setError(msg);
        }
    };

    return (
        <>
            <div className="section-label">Create Account</div>
            <h3 className="section-title mb-4">Register</h3>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Your Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        placeholder="Your Name"
                        value={user.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Your Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Your Email"
                        value={user.email}
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
                        value={user.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="+1-555-0100"
                        value={user.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                        type="text"
                        name="address"
                        className="form-control"
                        placeholder="123 Main St"
                        value={user.address}
                        onChange={handleChange}
                    />
                </div>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                {success && <div className="alert alert-success py-2 small">{success}</div>}
                <button type="submit" className="btn btn-primary w-100 py-2">
                    <i className="fas fa-user-plus me-2"></i> Register
                </button>
            </form>
        </>
    );
};

export default Register;
