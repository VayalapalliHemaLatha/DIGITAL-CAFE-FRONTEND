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
      { id: 1, timestamp: new Date().toISOString(), level: 'INFO', message: 'Admin dashboard loaded successfully', source: 'frontend', user: 'John Smith', avatar: 'https://picsum.photos/seed/user1/30/30.jpg', ip: '192.168.1.100' },
      { id: 2, timestamp: new Date(Date.now() - 60000).toISOString(), level: 'INFO', message: 'User login successful', source: 'auth', user: 'Emily Davis', avatar: 'https://picsum.photos/seed/user2/30/30.jpg', ip: '192.168.1.101' },
      { id: 3, timestamp: new Date(Date.now() - 120000).toISOString(), level: 'WARN', message: 'High latency detected on /api/cafes endpoint', source: 'api', user: 'System', avatar: 'https://picsum.photos/seed/system/30/30.jpg', ip: '192.168.1.1' },
      { id: 4, timestamp: new Date(Date.now() - 180000).toISOString(), level: 'ERROR', message: 'Failed to fetch cafe owners - Database connection timeout', source: 'api', user: 'System', avatar: 'https://picsum.photos/seed/system/30/30.jpg', ip: '192.168.1.1' },
      { id: 5, timestamp: new Date(Date.now() - 300000).toISOString(), level: 'INFO', message: 'CSV export completed successfully', source: 'reports', user: 'Admin User', avatar: 'https://picsum.photos/seed/admin1/30/30.jpg', ip: '192.168.1.50' },
      { id: 6, timestamp: new Date(Date.now() - 420000).toISOString(), level: 'INFO', message: 'New user registration completed', source: 'auth', user: 'Michael Chen', avatar: 'https://picsum.photos/seed/user3/30/30.jpg', ip: '192.168.1.102' },
      { id: 7, timestamp: new Date(Date.now() - 540000).toISOString(), level: 'WARN', message: 'Unusual login pattern detected for user', source: 'security', user: 'Sarah Johnson', avatar: 'https://picsum.photos/seed/user4/30/30.jpg', ip: '192.168.1.103' },
      { id: 8, timestamp: new Date(Date.now() - 660000).toISOString(), level: 'ERROR', message: 'Payment processing failed - Gateway timeout', source: 'payment', user: 'Robert Brown', avatar: 'https://picsum.photos/seed/user5/30/30.jpg', ip: '192.168.1.104' },
      { id: 9, timestamp: new Date(Date.now() - 780000).toISOString(), level: 'INFO', message: 'Database backup completed successfully', source: 'system', user: 'System', avatar: 'https://picsum.photos/seed/system/30/30.jpg', ip: '192.168.1.1' },
      { id: 10, timestamp: new Date(Date.now() - 900000).toISOString(), level: 'WARN', message: 'Memory usage exceeding 80% threshold', source: 'system', user: 'System', avatar: 'https://picsum.photos/seed/system/30/30.jpg', ip: '192.168.1.1' },
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
            <h1 className="admin-header-title">System Logs</h1>
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
            <h2 className="admin-page-title">Activity Logs</h2>
            <p className="admin-page-subtitle">Monitor system events, user actions, and platform activities</p>
          </div>

          {/* Log Statistics */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="admin-chart-card text-center">
                <div className="mb-2">
                  <i className="fas fa-list fa-2x text-primary"></i>
                </div>
                <h5 className="text-primary mb-1">{logs.length}</h5>
                <p className="text-muted mb-0 small">Total Logs</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="admin-chart-card text-center">
                <div className="mb-2">
                  <i className="fas fa-exclamation-triangle fa-2x text-warning"></i>
                </div>
                <h5 className="text-warning mb-1">{logs.filter(l => l.level === 'WARN').length}</h5>
                <p className="text-muted mb-0 small">Warnings</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="admin-chart-card text-center">
                <div className="mb-2">
                  <i className="fas fa-times-circle fa-2x text-danger"></i>
                </div>
                <h5 className="text-danger mb-1">{logs.filter(l => l.level === 'ERROR').length}</h5>
                <p className="text-muted mb-0 small">Errors</p>
              </div>
            </div>
            <div className="col-md-3">
              <div className="admin-chart-card text-center">
                <div className="mb-2">
                  <i className="fas fa-check-circle fa-2x text-success"></i>
                </div>
                <h5 className="text-success mb-1">{logs.filter(l => l.level === 'INFO').length}</h5>
                <p className="text-muted mb-0 small">Info</p>
              </div>
            </div>
          </div>

          <div className="admin-chart-card mb-3">
            <div className="admin-logs-toolbar">
              <div className="admin-logs-filters">
                <div className="d-flex align-items-center gap-2">
                  <label className="text-muted small mb-0">Filter:</label>
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
                  <button type="button" className="btn btn-sm btn-outline-success">
                    <i className="fas fa-download me-1"></i> Export
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-danger">
                    <i className="fas fa-trash me-1"></i> Clear
                  </button>
                </div>
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
                      <th>User</th>
                      <th>Source</th>
                      <th>Message</th>
                      <th>IP Address</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((log, i) => (
                      <tr key={log.id ?? i}>
                        <td className="admin-log-ts">
                          <div className="small">{formatTimestamp(log.timestamp)}</div>
                        </td>
                        <td>
                          <span className={`badge ${levelClass(log.level)}`}>
                            <i className={`fas ${
                              log.level === 'ERROR' ? 'fa-times-circle' : 
                              log.level === 'WARN' ? 'fa-exclamation-triangle' : 
                              'fa-info-circle'
                            } me-1`}></i>
                            {log.level}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={log.avatar || 'https://picsum.photos/seed/default/30/30.jpg'} 
                              alt={log.user}
                              className="rounded-circle me-2"
                              style={{ width: '24px', height: '24px', objectFit: 'cover' }}
                            />
                            <div className="small">{log.user || 'System'}</div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge bg-${
                            log.source === 'auth' ? 'primary' : 
                            log.source === 'api' ? 'info' : 
                            log.source === 'system' ? 'success' : 
                            log.source === 'security' ? 'danger' : 
                            'secondary'
                          }`}>
                            {log.source || 'unknown'}
                          </span>
                        </td>
                        <td className="admin-log-msg">
                          <div className="small" title={log.message}>
                            {log.message && log.message.length > 50 ? 
                              log.message.substring(0, 50) + '...' : 
                              log.message || '—'
                            }
                          </div>
                        </td>
                        <td>
                          <div className="small text-muted">{log.ip || '—'}</div>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-warning" title="Export Log">
                              <i className="fas fa-download"></i>
                            </button>
                          </div>
                        </td>
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
