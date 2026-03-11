import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getCafeOwnerWaiters, getCafeOwnerChefs } from '../api';
import CafeOwnerLayout from '../components/CafeOwnerLayout';

function CafeOwnerStaffPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isCafeOwner = roleType === 'cafeowner';

  const [waiters, setWaiters] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchData = useCallback(() => {
    setError('');
    setLoading(true);
    Promise.all([getCafeOwnerWaiters(), getCafeOwnerChefs()])
      .then(([waitersData, chefsData]) => {
        setWaiters(Array.isArray(waitersData) ? waitersData : []);
        setChefs(Array.isArray(chefsData) ? chefsData : []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load staff.');
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

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener('cafeowner-staff-refresh', onRefresh);
    return () => window.removeEventListener('cafeowner-staff-refresh', onRefresh);
  }, [fetchData]);

  if (!isCafeOwner) return null;

  const StaffTable = ({ title, list, emptyMessage }) => (
    <div className="mb-5">
      <h5 className="mb-3">{title}</h5>
      {list.length === 0 ? (
        <p className="text-muted mb-0">{emptyMessage}</p>
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
              </tr>
            </thead>
            <tbody>
              {list.map((row) => (
                <tr key={row.id}>
                  <td className="fw-medium">{row.name || '—'}</td>
                  <td>{row.email || '—'}</td>
                  <td>{row.phone || '—'}</td>
                  <td className="text-muted small" style={{ maxWidth: 200 }}>{row.address || '—'}</td>
                  <td>
                    <span className={`badge ${row.active ? 'bg-success' : 'bg-secondary'}`}>
                      {row.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <CafeOwnerLayout title="Staff" subtitle="View your waiters and chefs">
      <div className="admin-chart-card">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
              ) : (
                <>
                  <StaffTable title="Waiters" list={waiters} emptyMessage="No waiters found." />
                  <StaffTable title="Chefs" list={chefs} emptyMessage="No chefs found." />
                </>
              )}
      </div>
    </CafeOwnerLayout>
  );
}

export default CafeOwnerStaffPage;
