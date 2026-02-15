import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import { authApi } from '../api';
import {
  getAdminDashboardSummary,
  getAdminDashboardCafeLocations,
  getAdminDashboardDailyStats,
} from '../api';

const getDefaultDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  return {
    startDate: start.toISOString().slice(0, 10),
    endDate: end.toISOString().slice(0, 10),
  };
};

function AdminDashboardPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';

  const [summary, setSummary] = useState(null);
  const [cafeLocations, setCafeLocations] = useState([]);
  const [dailyStats, setDailyStats] = useState({ period: '', dailyStats: [] });
  const [dateRange, setDateRange] = useState(getDefaultDateRange);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchAll = useCallback(() => {
    setError('');
    setLoading(true);
    const params = { startDate: dateRange.startDate, endDate: dateRange.endDate };
    Promise.all([
      getAdminDashboardSummary(params),
      getAdminDashboardCafeLocations(),
      getAdminDashboardDailyStats(params),
    ])
      .then(([sum, locations, daily]) => {
        setSummary(sum || null);
        setCafeLocations(Array.isArray(locations) ? locations : []);
        setDailyStats(daily || { period: '', dailyStats: [] });
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load dashboard.');
      })
      .finally(() => setLoading(false));
  }, [dateRange.startDate, dateRange.endDate, handleAuthFailure]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    fetchAll();
  }, [isAdmin, navigate, fetchAll]);

  const ordersByStatus = summary?.ordersByStatus || {};
  const totalOrdersVal = summary?.totalOrders || 0;
  const served = ordersByStatus.served ?? 0;
  const placed = ordersByStatus.placed ?? 0;
  const preparing = ordersByStatus.preparing ?? 0;
  const ready = ordersByStatus.ready ?? 0;

  if (!isAdmin) return null;

  return (
    <div className="admin-dashboard" style={{ minHeight: '100vh', background: '#1a1d29', color: '#e4e6eb' }}>
      <div className="container-fluid py-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
          <div>
            <nav className="mb-1">
              <ol className="breadcrumb mb-0" style={{ background: 'transparent' }}>
                <li className="breadcrumb-item"><Link to="/" className="text-decoration-none" style={{ color: '#20c997' }}>Home</Link></li>
                <li className="breadcrumb-item text-white-50 active">Dashboard</li>
              </ol>
            </nav>
            <h1 className="h4 mb-0 fw-bold text-white">Dashboard</h1>
          </div>
          <div className="d-flex align-items-center gap-2">
            <input
              type="date"
              className="form-control form-control-sm bg-dark border-secondary text-white"
              style={{ maxWidth: 150 }}
              value={dateRange.startDate}
              onChange={(e) => setDateRange((p) => ({ ...p, startDate: e.target.value }))}
            />
            <span className="text-white-50">to</span>
            <input
              type="date"
              className="form-control form-control-sm bg-dark border-secondary text-white"
              style={{ maxWidth: 150 }}
              value={dateRange.endDate}
              onChange={(e) => setDateRange((p) => ({ ...p, endDate: e.target.value }))}
            />
            <button type="button" className="btn btn-sm text-white" style={{ background: '#20c997' }} onClick={fetchAll}>
              Update
            </button>
          </div>
        </div>

        {error && <div className="alert alert-danger py-2 small">{error}</div>}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-info" role="status"><span className="visually-hidden">Loading...</span></div>
          </div>
        ) : (
          <>
            {/* Summary cards */}
            <div className="row g-3 mb-4">
              <div className="col-6 col-lg-3">
                <div className="rounded p-3 h-100" style={{ background: '#252836' }}>
                  <div className="small text-white-50 mb-1">Registered customers</div>
                  <div className="h4 mb-0 fw-bold" style={{ color: '#20c997' }}>{summary?.totalCustomers ?? 0}</div>
                  <div className="small text-white-50">On your platform</div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="rounded p-3 h-100" style={{ background: '#252836' }}>
                  <div className="small text-white-50 mb-1">Total cafes</div>
                  <div className="h4 mb-0 fw-bold text-white">{summary?.totalCafes ?? 0}</div>
                  <div className="small text-white-50">Locations</div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="rounded p-3 h-100" style={{ background: '#252836' }}>
                  <div className="small text-white-50 mb-1">Total orders</div>
                  <div className="h4 mb-0 fw-bold text-white">{summary?.totalOrders ?? 0}</div>
                  <div className="small text-white-50">All time in range</div>
                </div>
              </div>
              <div className="col-6 col-lg-3">
                <div className="rounded p-3 h-100" style={{ background: '#252836' }}>
                  <div className="small text-white-50 mb-1">Total sales</div>
                  <div className="h4 mb-0 fw-bold" style={{ color: '#20c997' }}>
                    {summary?.totalSales != null ? Number(summary.totalSales).toFixed(2) : '0.00'}
                  </div>
                  <div className="small text-white-50">Revenue</div>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              {/* Users / Orders activity chart */}
              <div className="col-lg-8">
                <div className="rounded p-3 h-100" style={{ background: '#252836' }}>
                  <h6 className="mb-3 text-white">Orders & sales (daily)</h6>
                  {dailyStats.dailyStats && dailyStats.dailyStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={dailyStats.dailyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3d4152" />
                        <XAxis dataKey="date" stroke="#8a8d9a" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="left" stroke="#8a8d9a" tick={{ fontSize: 11 }} />
                        <YAxis yAxisId="right" orientation="right" stroke="#8a8d9a" tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: '#252836', border: '1px solid #3d4152' }} labelStyle={{ color: '#20c997' }} />
                        <Legend />
                        <Bar yAxisId="left" dataKey="orderCount" name="Orders" fill="#20c997" radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="sales" name="Sales" fill="#6c5ce7" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-white-50 small mb-0 py-4 text-center">No daily data for selected period.</p>
                  )}
                </div>
              </div>
              {/* Orders by status */}
              <div className="col-lg-4">
                <div className="rounded p-3 h-100" style={{ background: '#252836' }}>
                  <h6 className="mb-3 text-white">Orders by status</h6>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between small mb-1"><span>Placed</span><span>{placed}</span></div>
                    <div className="progress" style={{ height: 8, background: '#3d4152' }}>
                      <div className="progress-bar bg-secondary" role="progressbar" style={{ width: totalOrdersVal ? (placed / totalOrdersVal * 100) : 0 }} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between small mb-1"><span>Preparing</span><span>{preparing}</span></div>
                    <div className="progress" style={{ height: 8, background: '#3d4152' }}>
                      <div className="progress-bar bg-info" role="progressbar" style={{ width: totalOrdersVal ? (preparing / totalOrdersVal * 100) : 0 }} />
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between small mb-1"><span>Ready</span><span>{ready}</span></div>
                    <div className="progress" style={{ height: 8, background: '#3d4152' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: totalOrdersVal ? (ready / totalOrdersVal * 100) : 0, background: '#6c5ce7' }} />
                    </div>
                  </div>
                  <div className="mb-0">
                    <div className="d-flex justify-content-between small mb-1"><span>Served</span><span>{served}</span></div>
                    <div className="progress" style={{ height: 8, background: '#3d4152' }}>
                      <div className="progress-bar" role="progressbar" style={{ width: totalOrdersVal ? (served / totalOrdersVal * 100) : 0, background: '#20c997' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-3 mb-4">
              {/* Sales trend line chart */}
              <div className="col-lg-8">
                <div className="rounded p-3 h-100" style={{ background: '#252836' }}>
                  <h6 className="mb-3 text-white">Sales & orders trend</h6>
                  {dailyStats.dailyStats && dailyStats.dailyStats.length > 0 ? (
                    <ResponsiveContainer width="100%" height={260}>
                      <LineChart data={dailyStats.dailyStats} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#3d4152" />
                        <XAxis dataKey="date" stroke="#8a8d9a" tick={{ fontSize: 11 }} />
                        <YAxis stroke="#8a8d9a" tick={{ fontSize: 11 }} />
                        <Tooltip contentStyle={{ background: '#252836', border: '1px solid #3d4152' }} />
                        <Legend />
                        <Line type="monotone" dataKey="sales" name="Sales" stroke="#20c997" strokeWidth={2} dot={{ fill: '#20c997' }} />
                        <Line type="monotone" dataKey="orderCount" name="Orders" stroke="#6c5ce7" strokeWidth={2} dot={{ fill: '#6c5ce7' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-white-50 small mb-0 py-4 text-center">No data for selected period.</p>
                  )}
                </div>
              </div>
              {/* Cafe locations */}
              <div className="col-lg-4">
                <div className="rounded p-3 h-100" style={{ background: '#252836' }}>
                  <h6 className="mb-3 text-white">Cafe locations</h6>
                  {cafeLocations.length === 0 ? (
                    <p className="text-white-50 small mb-0">No cafes.</p>
                  ) : (
                    <ul className="list-unstyled mb-0">
                      {cafeLocations.map((c) => (
                        <li key={c.id} className="mb-3 pb-3 border-bottom border-secondary">
                          <div className="fw-medium text-white">{c.name}</div>
                          {c.address && <div className="small text-white-50">{c.address}</div>}
                          {c.phone && <div className="small text-white-50">{c.phone}</div>}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Link to="/admin/cafes" className="btn btn-sm mt-2 text-dark" style={{ background: '#20c997' }}>Manage cafés</Link>
                </div>
              </div>
            </div>

            {/* Quick links */}
            <div className="row g-3">
              <div className="col-12">
                <div className="rounded p-3" style={{ background: '#252836' }}>
                  <h6 className="mb-2 text-white">Quick links</h6>
                  <div className="d-flex flex-wrap gap-2">
                    <Link to="/admin/cafes" className="btn btn-sm btn-outline-secondary">Cafes</Link>
                    <Link to="/admin/cafeowners" className="btn btn-sm btn-outline-secondary">Cafe owners</Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboardPage;
