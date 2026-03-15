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
            <h1 className="admin-header-title">System Settings</h1>
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
            <h2 className="admin-page-title">System Configuration</h2>
            <p className="admin-page-subtitle">Manage platform settings, preferences, and system configurations</p>
          </div>

          <div className="row g-4">
            {/* General Settings */}
            <div className="col-lg-6">
              <div className="admin-chart-card">
                <h6 className="admin-chart-title mb-3">
                  <i className="fas fa-cog me-2 text-primary"></i>
                  General Settings
                </h6>
                <p className="admin-chart-subtitle mb-4">Basic platform configuration options</p>

                <div className="mb-4">
                  <label className="form-label fw-medium">
                    <i className="fas fa-sync-alt me-2 text-info"></i>
                    Auto Refresh Interval (seconds)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    style={{ maxWidth: 120 }}
                    min={5}
                    max={300}
                    value={settings.autoRefreshSeconds}
                    onChange={(e) => handleChange('autoRefreshSeconds', parseInt(e.target.value, 10) || 15)}
                  />
                  <small className="text-muted">Set dashboard data refresh frequency</small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">
                    <i className="fas fa-list me-2 text-warning"></i>
                    Items per page
                  </label>
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
                  <small className="text-muted">Number of items displayed in tables</small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">
                    <i className="fas fa-calendar me-2 text-success"></i>
                    Date Format
                  </label>
                  <select
                    className="form-select"
                    style={{ maxWidth: 200 }}
                    value={settings.dateFormat}
                    onChange={(e) => handleChange('dateFormat', e.target.value)}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                  <small className="text-muted">Display format for dates across the platform</small>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">
                    <i className="fas fa-tachometer-alt me-2 text-purple"></i>
                    Default dashboard view
                  </label>
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
                  <small className="text-muted">Landing page when accessing admin panel</small>
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="col-lg-6">
              <div className="admin-chart-card">
                <h6 className="admin-chart-title mb-3">
                  <i className="fas fa-bell me-2 text-warning"></i>
                  Notification Settings
                </h6>
                <p className="admin-chart-subtitle mb-4">Configure alerts and notifications</p>

                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="enableToast"
                      checked={settings.enableToastNotifications}
                      onChange={(e) => handleChange('enableToastNotifications', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="enableToast">
                      <div className="fw-medium">Enable toast notifications</div>
                      <small className="text-muted">Show real-time notifications for system events</small>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="enableEmailAlerts"
                      checked={settings.enableEmailAlerts}
                      onChange={(e) => handleChange('enableEmailAlerts', e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="enableEmailAlerts">
                      <div className="fw-medium">Enable email alerts</div>
                      <small className="text-muted">Receive email notifications for critical events</small>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="enableSmsAlerts"
                      defaultChecked={true}
                    />
                    <label className="form-check-label" htmlFor="enableSmsAlerts">
                      <div className="fw-medium">Enable SMS alerts</div>
                      <small className="text-muted">Get SMS notifications for urgent issues</small>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="enablePushNotifications"
                      defaultChecked={false}
                    />
                    <label className="form-check-label" htmlFor="enablePushNotifications">
                      <div className="fw-medium">Enable push notifications</div>
                      <small className="text-muted">Browser push notifications for live updates</small>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div className="col-lg-6">
              <div className="admin-chart-card">
                <h6 className="admin-chart-title mb-3">
                  <i className="fas fa-shield-alt me-2 text-success"></i>
                  Security Settings
                </h6>
                <p className="admin-chart-subtitle mb-4">Platform security and access control</p>

                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="enableTwoFactor"
                      defaultChecked={true}
                    />
                    <label className="form-check-label" htmlFor="enableTwoFactor">
                      <div className="fw-medium">Two-factor authentication</div>
                      <small className="text-muted">Require 2FA for admin accounts</small>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="enableSessionTimeout"
                      defaultChecked={true}
                    />
                    <label className="form-check-label" htmlFor="enableSessionTimeout">
                      <div className="fw-medium">Session timeout</div>
                      <small className="text-muted">Auto-logout after inactivity</small>
                    </label>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-medium">
                    <i className="fas fa-clock me-2 text-info"></i>
                    Session duration (minutes)
                  </label>
                  <select className="form-select" style={{ maxWidth: 150 }} defaultValue="30">
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                  </select>
                  <small className="text-muted">Auto-logout after this period</small>
                </div>

                <div className="mb-4">
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="enableAuditLog"
                      defaultChecked={true}
                    />
                    <label className="form-check-label" htmlFor="enableAuditLog">
                      <div className="fw-medium">Enable audit logging</div>
                      <small className="text-muted">Track all admin actions and changes</small>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* System Information */}
            <div className="col-lg-6">
              <div className="admin-chart-card">
                <h6 className="admin-chart-title mb-3">
                  <i className="fas fa-info-circle me-2 text-info"></i>
                  System Information
                </h6>
                <p className="admin-chart-subtitle mb-4">Platform details and version information</p>

                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="fw-medium">Platform Version</span>
                    <span className="badge bg-primary">v2.1.0</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="fw-medium">Database Version</span>
                    <span className="badge bg-success">MySQL 8.0</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="fw-medium">API Version</span>
                    <span className="badge bg-info">v1.5.2</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2 border-bottom">
                    <span className="fw-medium">Last Updated</span>
                    <span className="badge bg-warning">Jan 15, 2024</span>
                  </div>
                  <div className="d-flex justify-content-between align-items-center py-2">
                    <span className="fw-medium">System Status</span>
                    <span className="badge bg-success">
                      <i className="fas fa-circle me-1"></i>
                      Healthy
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="btn btn-outline-primary btn-sm me-2">
                    <i className="fas fa-download me-1"></i>
                    Download Logs
                  </button>
                  <button className="btn btn-outline-info btn-sm">
                    <i className="fas fa-sync-alt me-1"></i>
                    Check Updates
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="admin-chart-card mt-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="mb-1">Save Changes</h6>
                <p className="text-muted small mb-0">Apply your settings changes to the system</p>
              </div>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                  <i className="fas fa-undo me-2"></i>
                  Reset Defaults
                </button>
                <button type="button" className="btn btn-primary" onClick={handleSave} disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : saved ? (
                    <>
                      <i className="fas fa-check me-2"></i>
                      Saved!
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminSettingsPage;
