import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authApi } from '../api';
import { getCafeById, createBooking, createOrder, getBookings } from '../api';

const PAGE_BG = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1920';

function CafeDetailPage({ onAuthChange }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const cafeId = id ? parseInt(id, 10) : null;
  const [cafe, setCafe] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookForm, setBookForm] = useState({ tableId: '', bookingDate: '', bookingTime: '' });
  const [bookSubmitting, setBookSubmitting] = useState(false);
  const [orderForm, setOrderForm] = useState({ tableId: '', bookingId: '', orderDate: '', orderTime: '', items: {} });
  const [orderSubmitting, setOrderSubmitting] = useState(false);

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  useEffect(() => {
    if (!authApi.isLoggedIn()) {
      navigate('/login', { replace: true });
      return;
    }
    if (!cafeId) {
      navigate('/cafes', { replace: true });
      return;
    }
    setError('');
    setLoading(true);
    Promise.all([getCafeById(cafeId), getBookings()])
      .then(([cafeData, bookingsData]) => {
        setCafe(cafeData);
        setBookings(Array.isArray(bookingsData) ? bookingsData.filter((b) => b.cafeId === cafeId) : []);
        setBookForm({ tableId: '', bookingDate: '', bookingTime: '' });
        const menu = cafeData?.menu ?? [];
        setOrderForm({
          tableId: '',
          bookingId: '',
          orderDate: '',
          orderTime: '',
          items: menu.reduce((acc, m) => ({ ...acc, [m.id]: 0 }), {}),
        });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load cafe.');
      })
      .finally(() => setLoading(false));
  }, [cafeId, navigate, onAuthChange, handleAuthFailure]);

  const availableTables = (cafe?.tables ?? []).filter((t) => t.status === 'available');

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBookSubmitting(true);
    try {
      await createBooking({
        cafeId,
        tableId: parseInt(bookForm.tableId, 10),
        bookingDate: bookForm.bookingDate,
        bookingTime: bookForm.bookingTime,
      });
      const list = await getBookings();
      setBookings(Array.isArray(list) ? list.filter((b) => b.cafeId === cafeId) : []);
      setBookForm({ tableId: '', bookingDate: '', bookingTime: '' });
    } catch (err) {
      if (err.response?.status === 401) handleAuthFailure();
      else setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Booking failed.');
    } finally {
      setBookSubmitting(false);
    }
  };

  const handleOrderItemChange = (menuItemId, quantity) => {
    const q = parseInt(quantity, 10) || 0;
    setOrderForm((prev) => ({ ...prev, items: { ...prev.items, [menuItemId]: q } }));
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    const items = Object.entries(orderForm.items)
      .filter(([, q]) => q > 0)
      .map(([menuItemId, quantity]) => ({ menuItemId: parseInt(menuItemId, 10), quantity }));
    if (items.length === 0) {
      setError('Add at least one item.');
      return;
    }
    setError('');
    setOrderSubmitting(true);
    try {
      await createOrder({
        cafeId,
        tableId: parseInt(orderForm.tableId, 10),
        bookingId: orderForm.bookingId ? parseInt(orderForm.bookingId, 10) : undefined,
        orderDate: orderForm.orderDate,
        orderTime: orderForm.orderTime,
        items,
      });
      navigate('/orders');
    } catch (err) {
      if (err.response?.status === 401) handleAuthFailure();
      else setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Order failed.');
    } finally {
      setOrderSubmitting(false);
    }
  };

  if (loading || !cafe) {
    return (
      <>
        <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
          <div className="container py-4">
            <h1 className="display-6 text-white fw-bold mb-0">Cafe</h1>
          </div>
        </div>
        <div className="container py-5 text-center">
          <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="hero-header hero-page" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 43, .9), rgba(15, 23, 43, .9)), url(${PAGE_BG})` }}>
        <div className="container py-4">
          <nav className="mb-2">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item"><Link to="/" className="text-primary">Home</Link></li>
              <li className="breadcrumb-item"><Link to="/cafes" className="text-primary">Cafes</Link></li>
              <li className="breadcrumb-item text-white active" aria-current="page">{cafe.name}</li>
            </ol>
          </nav>
          <h1 className="display-6 text-white fw-bold mb-0">{cafe.name}</h1>
          {cafe.address && <p className="text-white-50 mb-0 mt-1">{cafe.address}</p>}
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="auth-card p-4 p-lg-5 mb-4">
              <h5 className="mb-3">Tables ({cafe.tableCount ?? (cafe.tables?.length ?? 0)} total)</h5>
              {(!cafe.tables || cafe.tables.length === 0) ? (
                <p className="text-muted mb-0">No tables.</p>
              ) : (
                <div className="row g-2">
                  {cafe.tables.map((t) => (
                    <div key={t.id} className="col-auto">
                      <span className={`badge ${t.status === 'available' ? 'bg-success' : 'bg-secondary'}`}>
                        {t.tableNumber} (capacity {t.capacity}) – {t.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="auth-card p-4 p-lg-5 mb-4">
              <h5 className="mb-3">Menu</h5>
              {(!cafe.menu || cafe.menu.length === 0) ? (
                <p className="text-muted mb-0">No menu items.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead><tr><th>Name</th><th>Description</th><th>Price</th><th>Category</th><th>Available</th></tr></thead>
                    <tbody>
                      {cafe.menu.map((m) => (
                        <tr key={m.id}>
                          <td>{m.name}</td>
                          <td className="text-muted small">{m.description || '—'}</td>
                          <td>{typeof m.price === 'number' ? m.price.toFixed(2) : m.price}</td>
                          <td><span className="badge bg-secondary">{m.category}</span></td>
                          <td>{m.available ? 'Yes' : 'No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            {error && <div className="alert alert-danger py-2 small mb-3">{error}</div>}

            <div className="auth-card p-4 mb-4">
              <h5 className="mb-3">Book a table</h5>
              <form onSubmit={handleBookSubmit}>
                <div className="mb-3">
                  <label className="form-label">Table</label>
                  <select
                    className="form-select"
                    value={bookForm.tableId}
                    onChange={(e) => setBookForm((p) => ({ ...p, tableId: e.target.value }))}
                    required
                  >
                    <option value="">Select</option>
                    {availableTables.map((t) => (
                      <option key={t.id} value={t.id}>{t.tableNumber} (capacity {t.capacity})</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={bookForm.bookingDate}
                    onChange={(e) => setBookForm((p) => ({ ...p, bookingDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={bookForm.bookingTime}
                    onChange={(e) => setBookForm((p) => ({ ...p, bookingTime: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={bookSubmitting}>
                  {bookSubmitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}Book table
                </button>
              </form>
            </div>

            <div className="auth-card p-4">
              <h5 className="mb-3">Place order</h5>
              <form onSubmit={handleOrderSubmit}>
                <div className="mb-3">
                  <label className="form-label">Table</label>
                  <select
                    className="form-select"
                    value={orderForm.tableId}
                    onChange={(e) => setOrderForm((p) => ({ ...p, tableId: e.target.value }))}
                    required
                  >
                    <option value="">Select</option>
                    {(cafe.tables ?? []).map((t) => (
                      <option key={t.id} value={t.id}>{t.tableNumber}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Booking (optional)</label>
                  <select
                    className="form-select"
                    value={orderForm.bookingId}
                    onChange={(e) => setOrderForm((p) => ({ ...p, bookingId: e.target.value }))}
                  >
                    <option value="">None</option>
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>{b.tableNumber} – {b.bookingDate} {b.bookingTime}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Order date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={orderForm.orderDate}
                    onChange={(e) => setOrderForm((p) => ({ ...p, orderDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Order time</label>
                  <input
                    type="time"
                    className="form-control"
                    value={orderForm.orderTime}
                    onChange={(e) => setOrderForm((p) => ({ ...p, orderTime: e.target.value }))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Items</label>
                  {(cafe.menu ?? []).filter((m) => m.available).map((m) => (
                    <div key={m.id} className="input-group input-group-sm mb-2">
                      <span className="input-group-text" style={{ minWidth: 120 }}>{m.name}</span>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={orderForm.items[m.id] ?? 0}
                        onChange={(e) => handleOrderItemChange(m.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
                <button type="submit" className="btn btn-primary w-100" disabled={orderSubmitting}>
                  {orderSubmitting ? <span className="spinner-border spinner-border-sm me-2" /> : null}Place order
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CafeDetailPage;
