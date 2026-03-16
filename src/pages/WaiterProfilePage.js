import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getProfile } from '../api';
import WaiterSidebar from '../components/WaiterSidebar';
import '../styles/ChefWaiterDashboard.css';
import '../styles/AdminDashboard.css';

function WaiterProfilePage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isWaiter = roleType === 'waiter';

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isWaiter) {
      navigate('/', { replace: true });
      return;
    }
    getProfile()
      .then((data) => setProfile(data || {}))
      .catch(() => setProfile({}))
      .finally(() => setLoading(false));
  }, [isWaiter, navigate]);

  if (!isWaiter) return null;

  const displayName = profile?.firstName || profile?.name || user?.name || 'Waiter';
  const email = profile?.email || user?.email || '';
  const initial = (displayName || 'W').charAt(0).toUpperCase();

  return (
    <div className="chef-waiter-layout waiter-dashboard">
      <WaiterSidebar />
      <div className="chef-waiter-main">
        <header className="chef-waiter-header">
          <div>
            <h1 className="chef-waiter-header-title">Waiter Dashboard</h1>
            <p className="chef-waiter-header-subtitle">Table service & order delivery</p>
          </div>
          <div className="chef-waiter-header-right">
            <div className="chef-waiter-user">
              <i className="fas fa-user-circle fa-lg" style={{ color: '#2563eb' }}></i>
              <span>{user?.email ?? 'waiter@demo.com'}</span>
            </div>
          </div>
        </header>
        <div className="chef-waiter-content">
          <div className="mb-4">
            <h2 className="h4 fw-bold mb-1 text-dark">My Profile</h2>
            <p className="text-muted small mb-0">Personal details and shift analytics</p>
          </div>
          
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-4">
                <div className="admin-chart-card text-center shadow-sm border-0">
                  <div className="position-relative d-inline-block mb-4">
                    <img src="https://images.unsplash.com/photo-1544148103-0773bf10d330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=150&h=150&q=80" alt="Profile" className="rounded-circle border border-4 border-white shadow" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
                    <span className="position-absolute bottom-0 end-0 bg-success border border-2 border-white rounded-circle" style={{ width: '20px', height: '20px' }}></span>
                  </div>
                  <h4 className="fw-bold mb-1">{displayName}</h4>
                  <p className="text-muted small fw-bold text-uppercase mb-4">Lead Waiter • Main Floor</p>
                  
                  <div className="bg-light p-3 rounded mb-4 text-start shadow-sm border">
                    <div className="d-flex justify-content-between small fw-bold text-muted mb-2">
                      <span>SHIFT COMPLETION</span>
                      <span>85%</span>
                    </div>
                    <div className="progress shadow-sm" style={{ height: '8px', borderRadius: '4px' }}>
                      <div className="progress-bar bg-primary" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div className="d-grid gap-2">
                    <Link to="/profile" className="btn btn-primary fw-bold shadow-sm">EDIT PROFILE</Link>
                    <Link to="/forgot-password" className="btn btn-outline-secondary btn-sm fw-bold">CHANGE PASSWORD</Link>
                  </div>
                </div>
              </div>
              
              <div className="col-lg-8">
                <div className="admin-chart-card shadow-sm border-0 mb-4">
                  <h6 className="fw-bold mb-4"><i className="fas fa-info-circle text-primary me-2"></i>Account Details</h6>
                  <div className="row g-4 text-start">
                    <div className="col-sm-6">
                      <div className="text-muted small fw-bold text-uppercase">USERNAME</div>
                      <div className="fw-bold text-dark">{user?.email?.split('@')[0] || 'mross_01'}</div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted small fw-bold text-uppercase">EMAIL ADDRESS</div>
                      <div className="fw-bold text-dark">{email || 'waiter@digitalcafe.com'}</div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted small fw-bold text-uppercase">CONTACT NUMBER</div>
                      <div className="fw-bold text-dark">+91 98765 43210</div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted small fw-bold text-uppercase">ASSIGNED CAFE</div>
                      <div className="fw-bold text-primary">{profile?.cafeName || 'The Digital Cafe - Metro'}</div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted small fw-bold text-uppercase">EMPLOYEE ID</div>
                      <div className="fw-bold text-dark">#EMP-2026-085</div>
                    </div>
                    <div className="col-sm-6">
                      <div className="text-muted small fw-bold text-uppercase">JOINED DATE</div>
                      <div className="fw-bold text-dark">Jan 12, 2025</div>
                    </div>
                  </div>
                </div>
                
                <div className="admin-chart-card shadow-sm border-0">
                   <h6 className="fw-bold mb-4"><i className="fas fa-certificate text-warning me-2"></i>Service Achievements</h6>
                   <div className="d-flex gap-4">
                      <div className="text-center">
                         <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
                            <i className="fas fa-medal fa-lg"></i>
                         </div>
                         <div className="small fw-bold">Top Waiter</div>
                      </div>
                      <div className="text-center">
                         <div className="bg-success bg-opacity-10 text-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
                            <i className="fas fa-star fa-lg"></i>
                         </div>
                         <div className="small fw-bold">5-Star Avg</div>
                      </div>
                      <div className="text-center">
                         <div className="bg-info bg-opacity-10 text-info rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '50px', height: '50px' }}>
                            <i className="fas fa-clock fa-lg"></i>
                         </div>
                         <div className="small fw-bold">Swift Service</div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaiterProfilePage;
