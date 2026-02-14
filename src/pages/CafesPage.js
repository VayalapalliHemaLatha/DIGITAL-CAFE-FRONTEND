import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getCafes } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';

function CafesPage({ onAuthChange }) {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchList = useCallback(() => {
    setError('');
    setLoading(true);
    getCafes()
      .then((data) => setList(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.response?.status === 401) {
          authApi.setToken(null);
          authApi.setUser(null);
          onAuthChange?.();
          navigate('/login', { replace: true });
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load cafes.');
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
              <li className="breadcrumb-item text-white active" aria-current="page">Cafes</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">Our Cafes</h1>
          <p className="text-white-50 mb-0 mt-1">Choose a cafe to view menu, book a table, or place an order</p>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-12">
            <div className="auth-card p-4 p-lg-5">
              {error && <div className="alert alert-danger py-2 small">{error}</div>}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                </div>
              ) : list.length === 0 ? (
                <p className="text-muted mb-0">No cafes available.</p>
              ) : (
                <div className="row g-4">
                  {list.map((cafe) => (
                    <div key={cafe.id} className="col-md-6 col-lg-4">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">{cafe.name}</h5>
                          {cafe.address && <p className="card-text text-muted small mb-1">{cafe.address}</p>}
                          {cafe.phone && <p className="card-text text-muted small mb-3">{cafe.phone}</p>}
                          <Link to={`/cafes/${cafe.id}`} className="btn btn-primary btn-sm">
                            View menu & book
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CafesPage;
