import React, { useState, useEffect } from 'react';
import { authApi } from '../api';
import { getAdminCafes } from '../api';

const CreateUserModal = ({ show, onClose, onSuccess, roleType, title }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
    cafeId: '',
  });
  const [cafes, setCafes] = useState([]);
  const [cafesLoading, setCafesLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const showPhoneAddress = roleType === 'waiter' || roleType === 'chef';
  const isCafeOwner = roleType === 'cafeowner';

  useEffect(() => {
    if (show) {
      setForm({ email: '', password: '', name: '', phone: '', address: '', cafeId: '' });
      setError('');
      setSuccess('');
    }
  }, [show, roleType]);

  useEffect(() => {
    if (show && isCafeOwner) {
      setCafesLoading(true);
      getAdminCafes()
        .then((data) => setCafes(Array.isArray(data) ? data : []))
        .catch(() => setCafes([]))
        .finally(() => setCafesLoading(false));
    }
  }, [show, isCafeOwner]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const payload = {
        email: form.email,
        password: form.password,
        name: form.name,
        roleType,
      };
      if (isCafeOwner) {
        const cafeId = form.cafeId ? parseInt(form.cafeId, 10) : null;
        if (!cafeId) {
          setError('Please select a cafe.');
          setSubmitting(false);
          return;
        }
        payload.cafeId = cafeId;
        if (form.phone) payload.phone = form.phone;
        if (form.address) payload.address = form.address;
      } else if (showPhoneAddress) {
        if (form.phone) payload.phone = form.phone;
        if (form.address) payload.address = form.address;
      }
      await authApi.createUser(payload);
      setSuccess('User created successfully.');
      if (isCafeOwner) {
        window.dispatchEvent(new CustomEvent('admin-cafeowners-refresh'));
      }
      if (roleType === 'chef' || roleType === 'waiter') {
        window.dispatchEvent(new CustomEvent('cafeowner-staff-refresh'));
      }
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to create user.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button type="button" className="btn-close" aria-label="Close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="email@example.com"
                  value={form.email}
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
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {isCafeOwner && (
                <div className="mb-3">
                  <label className="form-label">Cafe <span className="text-danger">*</span></label>
                  <select
                    name="cafeId"
                    className="form-select"
                    value={form.cafeId}
                    onChange={handleChange}
                    required
                    disabled={cafesLoading}
                  >
                    <option value="">Select cafe</option>
                    {cafes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} {c.address ? `(${c.address})` : ''}</option>
                    ))}
                  </select>
                  {cafesLoading && <span className="small text-muted">Loading cafes...</span>}
                  {!cafesLoading && cafes.length === 0 && <span className="small text-warning">No cafes yet. Create a cafe first from Admin → Cafes.</span>}
                </div>
              )}
              {(isCafeOwner || showPhoneAddress) && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Phone <span className="text-muted small">(optional)</span></label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control"
                      placeholder="+1-555-0199"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address <span className="text-muted small">(optional)</span></label>
                    <input
                      type="text"
                      name="address"
                      className="form-control"
                      placeholder="Cafe address"
                      value={form.address}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {success && <div className="alert alert-success py-2 small">{success}</div>}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
                    Creating...
                  </>
                ) : (
                  'Create'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUserModal;
