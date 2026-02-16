import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showMatchError = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const showMatchOk = confirmPassword.length > 0 && newPassword === confirmPassword;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    if (name === 'newPassword') setNewPassword(value);
    if (name === 'confirmPassword') setConfirmPassword(value);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Password and Confirm password do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const data = await authApi.forgotPassword({
        email: email.trim(),
        newPassword,
      });
      setSuccess(data?.message || 'Password reset successfully. You can now login with your new password.');
      setEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to reset password.';
      setError(msg);
    } finally {
      setSubmitting(false);
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
              <li className="breadcrumb-item text-white active" aria-current="page">Forgot Password</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Forgot Password</h1>
          <p className="text-white-50 mb-0 mt-1">Reset your password</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6">
            <div className="auth-card p-4 p-lg-5">
              <div className="section-label">Reset password</div>
              <h3 className="section-title mb-4">Enter your email and new password</h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="user@example.com"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New password</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="form-control"
                    placeholder="At least 6 characters"
                    value={newPassword}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className={`form-control ${showMatchError ? 'is-invalid' : showMatchOk ? 'is-valid' : ''}`}
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  {showMatchError && <div className="invalid-feedback d-block">Passwords do not match.</div>}
                  {showMatchOk && <div className="valid-feedback d-block">Passwords match.</div>}
                </div>
                {error && <div className="alert alert-danger py-2 small">{error}</div>}
                {success && <div className="alert alert-success py-2 small">{success}</div>}
                <button type="submit" className="btn btn-primary w-100 py-2" disabled={submitting}>
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                      Resetting...
                    </>
                  ) : (
                    'Reset password'
                  )}
                </button>
              </form>

              <p className="text-center mt-3 mb-0 small text-muted">
                <Link to="/login" className="text-primary">Back to login</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordPage;
