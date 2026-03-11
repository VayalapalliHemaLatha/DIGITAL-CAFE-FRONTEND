import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';

const ADMIN_SETTINGS_KEY = 'admin_settings';

const DEFAULT_SETTINGS = {
  autoRefreshSeconds: 15,
  enableToastNotifications: false,
  dateFormat: 'DD/MM/YYYY',
  itemsPerPage: 10,
  enableEmailAlerts: false,
  defaultDashboardView: 'overview',
};

function getStoredSettings() {
  try {
    const stored = localStorage.getItem(ADMIN_SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch (_) {}
  return { ...DEFAULT_SETTINGS };
}

function AdminSettingsPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSettings(getStoredSettings());
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = useCallback(() => {
    setLoading(true);
    try {
      localStorage.setItem(ADMIN_SETTINGS_KEY, JSON.stringify(settings));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setLoading(false);
    }
  }, [settings]);

  const handleReset = useCallback(() => {
    setSettings({ ...DEFAULT_SETTINGS });
    setSaved(false);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
  }, [isAdmin, navigate]);

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
            <h2 className="admin-page-title">Settings</h2>
            <p className="admin-page-subtitle">Manage your digital cafe platform</p>
          </div>

          <div className="admin-chart-card">
            <h6 className="admin-chart-title mb-2">Preferences</h6>
            <p className="admin-chart-subtitle mb-4">Customize admin experience and dashboard behavior.</p>

            <div className="mb-4">
              <label className="form-label fw-medium">Auto Refresh Interval (seconds)</label>
              <input
                type="number"
                className="form-control"
                style={{ maxWidth: 120 }}
                min={5}
                max={300}
                value={settings.autoRefreshSeconds}
                onChange={(e) => handleChange('autoRefreshSeconds', parseInt(e.target.value, 10) || 15)}
              />
            </div>

            <div className="mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="enableToast"
                  checked={settings.enableToastNotifications}
                  onChange={(e) => handleChange('enableToastNotifications', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="enableToast">
                  Enable toast notifications
                </label>
              </div>
            </div>

            <div className="mb-4">
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="enableEmailAlerts"
                  checked={settings.enableEmailAlerts}
                  onChange={(e) => handleChange('enableEmailAlerts', e.target.checked)}
                />
                <label className="form-check-label" htmlFor="enableEmailAlerts">
                  Enable email alerts for critical events
                </label>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Items per page</label>
              <select
                className="form-select"
                style={{ maxWidth: 120 }}
                value={settings.itemsPerPage}
                onChange={(e) => handleChange('itemsPerPage', parseInt(e.target.value, 10))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label fw-medium">Default dashboard view</label>
              <select
                className="form-select"
                style={{ maxWidth: 200 }}
                value={settings.defaultDashboardView}
                onChange={(e) => handleChange('defaultDashboardView', e.target.value)}
              >
                <option value="overview">Overview</option>
                <option value="analytics">Analytics</option>
                <option value="reports">Reports</option>
              </select>
            </div>

            <div className="d-flex gap-2 justify-content-end">
              <button type="button" className="btn btn-secondary" onClick={handleReset}>
                Reset Defaults
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSave} disabled={loading}>
                {saved ? 'Saved!' : 'Save Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettingsPage;
