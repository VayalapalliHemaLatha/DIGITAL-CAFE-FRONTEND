import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getBookings } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';

function BookingsPage({ onAuthChange }) {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchList = useCallback(() => {
    setError('');
    setLoading(true);
    getBookings()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.response?.status === 401) {
          authApi.setToken(null);
          authApi.setUser(null);
          onAuthChange?.();
          navigate('/login', { replace: true });
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load bookings.');
      })
      .finally(() => setLoading(false));
  }, [navigate, onAuthChange]);

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login', { replace: true });
      return;
    }
    fetchList();
  }, [navigate, fetchList]);

  return (
    <>
      <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">My Bookings</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">My Bookings</h1>
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
                <p className="text-muted mb-0">No bookings. <Link to="/cafes">Book a table</Link>.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
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
                          <td>{b.cafeName || `Cafe #${b.cafeId}`}</td>
                          <td>{b.tableNumber || `Table #${b.tableId}`}</td>
                          <td>{b.bookingDate}</td>
                          <td>{b.bookingTime}</td>
                          <td><span className="badge bg-secondary">{b.status || 'booked'}</span></td>
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

export default BookingsPage;
