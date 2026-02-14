import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import {
  getCafeOwnerMenu,
  addCafeOwnerMenuItem,
  updateCafeOwnerMenuItem,
  deleteCafeOwnerMenuItem,
} from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';
const CATEGORIES = ['beverage', 'food', 'dessert', 'snack'];

function CafeOwnerMenuPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isCafeOwner = roleType === 'cafeowner';

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ show: false, item: null });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'beverage', available: true });

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchList = useCallback(() => {
    setError('');
    setLoading(true);
    getCafeOwnerMenu()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load menu.');
      })
      .finally(() => setLoading(false));
  }, [handleAuthFailure]);

  useEffect(() => {
    if (!isCafeOwner) {
      navigate('/', { replace: true });
      return;
    }
    fetchList();
  }, [isCafeOwner, navigate, fetchList]);

  const openAdd = () => {
    setForm({ name: '', description: '', price: '', category: 'beverage', available: true });
    setModal({ show: true, item: null });
    setError('');
  };
  const openEdit = (item) => {
    setForm({
      name: item.name ?? '',
      description: item.description ?? '',
      price: item.price ?? '',
      category: item.category ?? 'beverage',
      available: item.available !== false,
    });
    setModal({ show: true, item });
    setError('');
  };
  const closeModal = () => setModal({ show: false, item: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      setError('Price must be a number greater than 0.');
      return;
    }
    setError('');
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        price: priceNum,
        category: form.category,
        available: form.available,
      };
      if (modal.item) {
        const updated = await updateCafeOwnerMenuItem(modal.item.id, payload);
        setList((prev) => prev.map((m) => (m.id === modal.item.id ? updated : m)));
      } else {
        const created = await addCafeOwnerMenuItem(payload);
        setList((prev) => [...prev, created]);
      }
      closeModal();
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
    if (!window.confirm('Remove this menu item?')) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteCafeOwnerMenuItem(id);
      setList((prev) => prev.filter((m) => m.id !== id));
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

  if (!isCafeOwner) return null;

  return (
    <>
      <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item text-white">Cafe Owner</li>
              <li className="breadcrumb-item text-white active" aria-current="page">Menu</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Menu</h1>
          <p className="text-white-50 mb-0 mt-1">Manage your menu items</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="auth-card p-4 p-lg-5">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="mb-0">Menu items</h5>
                <button type="button" className="btn btn-primary" onClick={openAdd}>Add item</button>
              </div>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
              ) : list.length === 0 ? (
                <p className="text-muted mb-0">No menu items yet. Add one to get started.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Available</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-medium">{item.name}</td>
                          <td className="text-muted small">{item.description || '—'}</td>
                          <td>{typeof item.price === 'number' ? item.price.toFixed(2) : item.price}</td>
                          <td><span className="badge bg-secondary">{item.category}</span></td>
                          <td>
                            <span className={`badge ${item.available ? 'bg-success' : 'bg-secondary'}`}>
                              {item.available ? 'Yes' : 'No'}
                            </span>
                          </td>
                          <td className="text-end">
                            <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(item)}>Edit</button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(item.id)}
                              disabled={deletingId === item.id}
                            >
                              {deletingId === item.id ? <span className="spinner-border spinner-border-sm" /> : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {modal.show && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{modal.item ? 'Edit menu item' : 'Add menu item'}</h5>
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
                    <label className="form-label">Description</label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.description}
                      onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price <span className="text-danger">*</span></label>
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      className="form-control"
                      value={form.price}
                      onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category <span className="text-danger">*</span></label>
                    <select
                      className="form-select"
                      value={form.category}
                      onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="available"
                        checked={form.available}
                        onChange={(e) => setForm((p) => ({ ...p, available: e.target.checked }))}
                      />
                      <label className="form-check-label" htmlFor="available">Available</label>
                    </div>
                  </div>
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    {modal.item ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CafeOwnerMenuPage;
