import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getCafeOwners, updateCafeOwnerStatus } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';

function AdminCafeOwnersPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchList = useCallback(() => {
    setError('');
    setLoading(true);
    getCafeOwners()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load cafe owners.');
      })
      .finally(() => setLoading(false));
  }, [handleAuthFailure]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    fetchList();
  }, [isAdmin, navigate, fetchList]);

  const handleToggleStatus = async (owner) => {
    const newActive = !owner.active;
    setTogglingId(owner.id);
    setError('');
    try {
      const updated = await updateCafeOwnerStatus(owner.id, { active: newActive });
      setList((prev) => prev.map((o) => (o.id === owner.id ? { ...o, ...updated } : o)));
    } catch (err) {
      if (err.response?.status === 401) {
        handleAuthFailure();
        return;
      }
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update status.');
    } finally {
      setTogglingId(null);
    }
  };

  if (!isAdmin) return null;

  return (
    <>
      <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item text-white">Admin</li>
              <li className="breadcrumb-item text-white active" aria-current="page">Cafe Owners</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Manage Cafe Owners</h1>
          <p className="text-white-50 mb-0 mt-1">Activate or deactivate cafe owner accounts</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="auth-card p-4 p-lg-5">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
              ) : list.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">No cafe owners found.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Status</th>
                        <th className="text-end">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((owner) => (
                        <tr key={owner.id}>
                          <td className="fw-medium">{owner.name || '—'}</td>
                          <td>{owner.email || '—'}</td>
                          <td>{owner.phone || '—'}</td>
                          <td className="text-muted small" style={{ maxWidth: 200 }}>{owner.address || '—'}</td>
                          <td>
                            <span className={`badge ${owner.active ? 'bg-success' : 'bg-secondary'}`}>
                              {owner.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="text-end">
                            <button
                              type="button"
                              className={`btn btn-sm ${owner.active ? 'btn-outline-warning' : 'btn-outline-success'}`}
                              onClick={() => handleToggleStatus(owner)}
                              disabled={togglingId === owner.id}
                            >
                              {togglingId === owner.id ? (
                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                              ) : owner.active ? (
                                'Deactivate'
                              ) : (
                                'Activate'
                              )}
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
    </>
  );
}

export default AdminCafeOwnersPage;
