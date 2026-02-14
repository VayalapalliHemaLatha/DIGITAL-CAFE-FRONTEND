import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import {
  getCafeOwnerTables,
  addCafeOwnerTable,
  updateCafeOwnerTable,
  updateCafeOwnerTableStatus,
  deleteCafeOwnerTable,
} from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';
const STATUSES = ['available', 'booked'];

function CafeOwnerTablesPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isCafeOwner = roleType === 'cafeowner';

  const [data, setData] = useState({ tables: [], availableCount: 0, bookedCount: 0, totalCount: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modal, setModal] = useState({ show: false, table: null });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState({ tableNumber: '', capacity: 4, status: 'available' });

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchData = useCallback(() => {
    setError('');
    setLoading(true);
    getCafeOwnerTables()
      .then((res) => {
        const tables = res?.tables ?? [];
        setData({
          tables: Array.isArray(tables) ? tables : [],
          availableCount: res?.availableCount ?? 0,
          bookedCount: res?.bookedCount ?? 0,
          totalCount: res?.totalCount ?? tables.length,
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load tables.');
      })
      .finally(() => setLoading(false));
  }, [handleAuthFailure]);

  useEffect(() => {
    if (!isCafeOwner) {
      navigate('/', { replace: true });
      return;
    }
    fetchData();
  }, [isCafeOwner, navigate, fetchData]);

  const openAdd = () => {
    setForm({ tableNumber: '', capacity: 4, status: 'available' });
    setModal({ show: true, table: null });
    setError('');
  };
  const openEdit = (table) => {
    setForm({
      tableNumber: table.tableNumber ?? '',
      capacity: table.capacity ?? 4,
      status: table.status ?? 'available',
    });
    setModal({ show: true, table });
    setError('');
  };
  const closeModal = () => setModal({ show: false, table: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = {
        tableNumber: form.tableNumber.trim(),
        capacity: parseInt(form.capacity, 10) || 4,
        status: form.status,
      };
      if (modal.table) {
        await updateCafeOwnerTable(modal.table.id, payload);
      } else {
        await addCafeOwnerTable(payload);
      }
      closeModal();
      fetchData();
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

  const handleStatusChange = async (table, newStatus) => {
    setError('');
    try {
      await updateCafeOwnerTableStatus(table.id, { status: newStatus });
      fetchData();
    } catch (err) {
      if (err.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this table?')) return;
    setDeletingId(id);
    setError('');
    try {
      await deleteCafeOwnerTable(id);
      fetchData();
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
              <li className="breadcrumb-item text-white active" aria-current="page">Tables</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Tables</h1>
          <p className="text-white-50 mb-0 mt-1">Manage your tables</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="auth-card p-4 p-lg-5">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
                <h5 className="mb-0">Tables</h5>
                <button type="button" className="btn btn-primary" onClick={openAdd}>Add table</button>
              </div>
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
              ) : (
                <>
                  <div className="row g-2 mb-4">
                    <div className="col-auto">
                      <span className="badge bg-success me-2">Available: {data.availableCount}</span>
                    </div>
                    <div className="col-auto">
                      <span className="badge bg-warning text-dark me-2">Booked: {data.bookedCount}</span>
                    </div>
                    <div className="col-auto">
                      <span className="badge bg-secondary">Total: {data.totalCount}</span>
                    </div>
                  </div>
                  {data.tables.length === 0 ? (
                    <p className="text-muted mb-0">No tables yet. Add one to get started.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Table number</th>
                            <th>Capacity</th>
                            <th>Status</th>
                            <th className="text-end">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.tables.map((table) => (
                            <tr key={table.id}>
                              <td className="fw-medium">{table.tableNumber}</td>
                              <td>{table.capacity}</td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  style={{ width: 'auto' }}
                                  value={table.status}
                                  onChange={(e) => handleStatusChange(table, e.target.value)}
                                >
                                  {STATUSES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                  ))}
                                </select>
                              </td>
                              <td className="text-end">
                                <button type="button" className="btn btn-sm btn-outline-primary me-1" onClick={() => openEdit(table)}>Edit</button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => handleDelete(table.id)}
                                  disabled={deletingId === table.id}
                                >
                                  {deletingId === table.id ? <span className="spinner-border spinner-border-sm" /> : 'Delete'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </>
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
                <h5 className="modal-title">{modal.table ? 'Edit table' : 'Add table'}</h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Table number <span className="text-danger">*</span></label>
                    <input
                      type="text"
                      className="form-control"
                      value={form.tableNumber}
                      onChange={(e) => setForm((p) => ({ ...p, tableNumber: e.target.value }))}
                      placeholder="T10"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Capacity</label>
                    <input
                      type="number"
                      min="1"
                      className="form-control"
                      value={form.capacity}
                      onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={form.status}
                      onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  {error && <div className="alert alert-danger py-2 small">{error}</div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                    {modal.table ? 'Update' : 'Add'}
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

export default CafeOwnerTablesPage;
