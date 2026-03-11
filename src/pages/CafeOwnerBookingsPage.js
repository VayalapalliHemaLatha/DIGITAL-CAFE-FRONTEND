import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getCafeOwnerBookings } from '../api';
import CafeOwnerLayout from '../components/CafeOwnerLayout';

function CafeOwnerBookingsPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isCafeOwner = roleType === 'cafeowner';

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchList = useCallback(() => {
    setError('');
    setLoading(true);
    getCafeOwnerBookings()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load bookings.');
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

  if (!isCafeOwner) return null;

  return (
    <CafeOwnerLayout title="Bookings" subtitle="All bookings for your cafe">
      <div className="admin-chart-card">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
              ) : list.length === 0 ? (
                <p className="text-muted mb-0">No bookings.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Cafe</th>
                        <th>Table</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((b) => (
                        <tr key={b.id}>
                          <td>{b.id}</td>
                          <td>{b.userName || `User #${b.userId}`}</td>
                          <td>{b.cafeName || `#${b.cafeId}`}</td>
                          <td>{b.tableNumber || `#${b.tableId}`}</td>
                          <td>{b.bookingDate}</td>
                          <td>{b.bookingTime}</td>
                          <td><span className={`badge ${b.status === 'booked' ? 'bg-primary' : b.status === 'completed' ? 'bg-success' : 'bg-secondary'}`}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
      </div>
    </CafeOwnerLayout>
  );
}

export default CafeOwnerBookingsPage;
