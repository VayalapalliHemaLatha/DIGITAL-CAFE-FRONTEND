import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';
import '../styles/AdminLogs.css';

const LOG_LEVELS = ['ALL', 'INFO', 'WARN', 'ERROR'];
const PAGE_SIZE = 20;

// Client-side log store for demo; backend can provide /api/admin/logs
const LOG_STORAGE_KEY = 'admin_client_logs';

function getStoredLogs() {
  try {
    const s = localStorage.getItem(LOG_STORAGE_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

// Seed sample logs for demo
function ensureSampleLogs() {
  const logs = getStoredLogs();
  if (logs.length === 0) {
    const samples = [
      { id: 1, timestamp: new Date().toISOString(), level: 'INFO', message: 'Admin dashboard loaded', source: 'frontend' },
      { id: 2, timestamp: new Date(Date.now() - 60000).toISOString(), level: 'INFO', message: 'User login successful', source: 'auth' },
      { id: 3, timestamp: new Date(Date.now() - 120000).toISOString(), level: 'WARN', message: 'High latency detected on /api/cafes', source: 'api' },
      { id: 4, timestamp: new Date(Date.now() - 180000).toISOString(), level: 'ERROR', message: 'Failed to fetch cafe owners', source: 'api' },
      { id: 5, timestamp: new Date(Date.now() - 300000).toISOString(), level: 'INFO', message: 'Export CSV completed', source: 'reports' },
    ];
    localStorage.setItem(LOG_STORAGE_KEY, JSON.stringify(samples));
  }
}

function AdminLogsPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';

  const [logs, setLogs] = useState([]);
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadLogs = useCallback(() => {
    setLoading(true);
    // In production, call: getAdminLogs({ level: levelFilter, search, page, limit: PAGE_SIZE })
    setTimeout(() => {
      let list = getStoredLogs();
      if (levelFilter !== 'ALL') {
        list = list.filter((l) => l.level === levelFilter);
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        list = list.filter((l) => (l.message || '').toLowerCase().includes(q) || (l.source || '').toLowerCase().includes(q));
      }
      setLogs(list);
      setLoading(false);
    }, 200);
  }, [levelFilter, search]);

  useEffect(() => {
    ensureSampleLogs();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
  }, [isAdmin, navigate]);

  const paginatedLogs = logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(logs.length / PAGE_SIZE));

  const formatTimestamp = (ts) => {
    if (!ts) return '—';
    const d = new Date(ts);
    return d.toLocaleString();
  };

  const levelClass = (level) => {
    if (level === 'ERROR') return 'log-level-error';
    if (level === 'WARN') return 'log-level-warn';
    return 'log-level-info';
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
            <h1 className="admin-header-title">Admin Dashboard</h1>
          </div>
          <div className="admin-header-right">
            <button type="button" className="admin-header-icon" aria-label="Search">
              <i className="fas fa-search"></i>
            </button>
            <button type="button" className="admin-header-icon" aria-label="Notifications">
              <i className="fas fa-bell"></i>
            </button>
            <button type="button" className="admin-header-icon" aria-label="Settings">
              <i className="fas fa-cog"></i>
            </button>
            <div className="admin-header-user">
              <i className="fas fa-user-circle fa-2x" style={{ color: '#6B46C1' }}></i>
              <div>
                <div className="fw-medium">{user?.name ?? 'System Admin'}</div>
                <small className="text-muted d-block">ADMIN</small>
              </div>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <div className="admin-page-header">
            <h2 className="admin-page-title">Logs</h2>
            <p className="admin-page-subtitle">View system and application logs</p>
          </div>

          <div className="admin-chart-card mb-3">
            <div className="admin-logs-toolbar">
              <div className="admin-logs-filters">
                <select
                  className="form-select form-select-sm"
                  style={{ width: 'auto' }}
                  value={levelFilter}
                  onChange={(e) => { setLevelFilter(e.target.value); setPage(1); }}
                >
                  {LOG_LEVELS.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Search logs..."
                  style={{ maxWidth: 220 }}
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                />
                <button type="button" className="btn btn-sm btn-outline-primary" onClick={loadLogs}>
                  <i className="fas fa-sync-alt me-1"></i> Refresh
                </button>
              </div>
            </div>
          </div>

          <div className="admin-chart-card">
            <div className="admin-logs-table-wrap">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : paginatedLogs.length === 0 ? (
                <p className="text-muted text-center py-4 mb-0">No logs found.</p>
              ) : (
                <table className="table table-sm admin-logs-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Level</th>
                      <th>Source</th>
                      <th>Message</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log, i) => (
                      <tr key={log.id ?? i}>
                        <td className="admin-log-ts">{formatTimestamp(log.timestamp)}</td>
                        <td><span className={`badge ${levelClass(log.level)}`}>{log.level}</span></td>
                        <td className="text-muted">{log.source || '—'}</td>
                        <td className="admin-log-msg">{log.message || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {totalPages > 1 && (
              <div className="admin-logs-pagination">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <span className="mx-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogsPage;
