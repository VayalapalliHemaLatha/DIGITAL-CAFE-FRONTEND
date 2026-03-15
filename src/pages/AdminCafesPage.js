import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import {
  getAdminCafes,
  createAdminCafe,
  updateAdminCafe,
  deleteAdminCafe,
} from '../api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';

function AdminCafesPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ show: false, cafe: null });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' });

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchList = useCallback(() => {
    setError('');
    setLoading(true);
    
    // Add timeout to ensure loading state is visible
    setTimeout(() => {
      getAdminCafes()
        .then((data) => {
          setList(Array.isArray(data) ? data : []);
          setError(''); // Clear any previous errors
        })
        .catch((err) => {
          console.error('Cafes fetch error:', err);
          if (err.response?.status === 401) {
            handleAuthFailure();
            return;
          }
          setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load cafes.');
        })
        .finally(() => setLoading(false));
    }, 100);
  }, [handleAuthFailure]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    fetchList();
  }, [isAdmin, navigate, fetchList]);

  const openAdd = () => {
    setForm({ name: '', address: '', phone: '', email: '' });
    setModal({ show: true, cafe: null });
    setError('');
  };
  const openEdit = (cafe) => {
    setForm({
      name: cafe.name ?? '',
      address: cafe.address ?? '',
      phone: cafe.phone ?? '',
      email: cafe.email ?? '',
    });
    setModal({ show: true, cafe });
    setError('');
  };
  const closeModal = () => setModal({ show: false, cafe: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        address: form.address.trim() || undefined,
        phone: form.phone.trim() || undefined,
        email: form.email.trim() || undefined,
      };
      if (modal.cafe) {
        await updateAdminCafe(modal.cafe.id, payload);
      } else {
        await createAdminCafe(payload);
      }
      closeModal();
      fetchList();
    } catch (err) {
      if (err.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this cafe? This may affect linked cafe owners.')) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteAdminCafe(id);
      fetchList();
    } catch (err) {
      if (err.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete.');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch(status?.toUpperCase()) {
      case 'ACTIVE': return 'bg-success';
      case 'INACTIVE': return 'bg-secondary';
      case 'SUSPENDED': return 'bg-danger';
      default: return 'bg-success';
    }
  };

  const getRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-warning"></i>);
    }
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-warning"></i>);
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-muted"></i>);
    }
    return stars;
  };

  if (!isAdmin) return null;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button type="button" className="admin-header-icon" aria-label="Menu">
              <i className="fas fa-bars"></i>
            </button>
            <h1 className="admin-header-title">Cafe Management</h1>
          </div>
          <div className="admin-header-right">
            <button type="button" className="admin-header-icon" aria-label="Notifications">
              <i className="fas fa-bell"></i>
            </button>
            <button type="button" className="admin-header-icon" aria-label="Settings">
              <i className="fas fa-cog"></i>
            </button>
            <button type="button" className="btn btn-primary" onClick={openAdd}>
              <i className="fas fa-plus me-2"></i> Add Cafe
            </button>
            <button type="button" className="admin-refresh-btn" onClick={fetchList} disabled={loading}>
              <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
              Refresh
            </button>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-header">
            <h2 className="admin-page-title">All Cafes</h2>
            <p className="admin-page-subtitle">Manage and monitor all cafe locations in the system</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {list.length > 0 ? (
                list.map((cafe) => (
                  <div key={cafe.id} className="col-lg-4 col-md-6">
                    <div className="admin-chart-card h-100">
                      <div className="position-relative">
                        <img 
                          src={cafe.image || `https://picsum.photos/seed/cafe${cafe.id}/400/250.jpg`} 
                          alt={cafe.name}
                          className="card-img-top rounded-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                        />
                        <div className="position-absolute top-0 end-0 m-2">
                          <span className={`badge ${getStatusBadgeColor(cafe.status)}`}>
                            {cafe.status || 'ACTIVE'}
                          </span>
                        </div>
                      </div>
                      <div className="card-body">
                        <h5 className="card-title fw-bold">{cafe.name || 'Unnamed Cafe'}</h5>
                        <div className="mb-2">
                          <div className="d-flex align-items-center mb-1">
                            <i className="fas fa-map-marker-alt text-muted me-2 small"></i>
                            <span className="small text-muted">{cafe.address || 'Address not provided'}</span>
                          </div>
                          <div className="d-flex align-items-center mb-1">
                            <i className="fas fa-phone text-muted me-2 small"></i>
                            <span className="small text-muted">{cafe.phone || 'Phone not provided'}</span>
                          </div>
                          <div className="d-flex align-items-center mb-1">
                            <i className="fas fa-envelope text-muted me-2 small"></i>
                            <span className="small text-muted">{cafe.email || 'Email not provided'}</span>
                          </div>
                          <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-user text-muted me-2 small"></i>
                            <span className="small text-muted">Owner: {cafe.ownerName || 'Not assigned'}</span>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <div className="d-flex align-items-center">
                            {getRatingStars(cafe.rating || 4.0)}
                            <span className="ms-2 small text-muted">({cafe.rating || 4.0})</span>
                          </div>
                        </div>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary flex-fill" onClick={() => openEdit(cafe)}>
                            <i className="fas fa-edit me-1"></i> Edit
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(cafe.id)}
                            disabled={deletingId === cafe.id}
                          >
                            {deletingId === cafe.id ? (
                              <span className="spinner-border spinner-border-sm" />
                            ) : (
                              <><i className="fas fa-trash me-1"></i> Delete</>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-12">
                  <div className="text-center py-5">
                    <div className="admin-chart-card">
                      <div className="text-muted">
                        <i className="fas fa-store fa-3x mb-3 d-block"></i>
                        <h5>No cafes found</h5>
                        <p>Start by adding your first cafe location</p>
                        <button className="btn btn-primary" onClick={openAdd}>
                          <i className="fas fa-plus me-2"></i> Add First Cafe
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {modal.show && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modal.cafe ? 'Edit cafe' : 'Add cafe'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.address}
                      onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))}
                      placeholder="123 Main St, New York"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      value={form.phone}
                      onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                      placeholder="+1-555-1000"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={form.email}
                      onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                      placeholder="contact@cafe.com"
                    />
                  </div>
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    {modal.cafe ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCafesPage;
