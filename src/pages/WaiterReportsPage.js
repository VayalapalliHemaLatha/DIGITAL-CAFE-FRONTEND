import React from 'react';
import WaiterSidebar from '../components/WaiterSidebar';
import '../styles/ChefWaiterDashboard.css';

function WaiterReportsPage() {
  const stats = [
    { label: 'Total Orders', value: '42', icon: 'fa-clipboard-list', color: 'primary' },
    { label: 'Avg. Rating', value: '4.8', icon: 'fa-star', color: 'warning' },
    { label: 'Total Sales', value: '₹18,450', icon: 'fa-shopping-cart', color: 'success' },
    { label: 'Tips Earned', value: '₹1,240', icon: 'fa-wallet', color: 'info' }
  ];

  return (
    <div className="chef-waiter-layout">
      <WaiterSidebar />
      <div className="chef-waiter-main">
        <header className="chef-waiter-header">
          <div>
            <h1 className="chef-waiter-header-title">My Performance Reports</h1>
            <p className="chef-waiter-header-subtitle">Analytics for your service shifts</p>
          </div>
          <div className="chef-waiter-header-right">
             <select className="form-select form-select-sm" style={{ width: '150px' }}>
                <option>Today</option>
                <option>This Week</option>
                <option>This Month</option>
             </select>
          </div>
        </header>

        <div className="chef-waiter-content">
          <div className="row g-4 mb-5">
            {stats.map((stat, idx) => (
              <div key={idx} className="col-lg-3 col-6">
                <div className="admin-chart-card shadow-sm border-0 d-flex align-items-center p-3">
                  <div className={`bg-${stat.color} bg-opacity-10 text-${stat.color} rounded-circle p-3 me-3 d-flex align-items-center justify-content-center shadow-sm`} style={{ width: '50px', height: '50px' }}>
                    <i className={`fas ${stat.icon} fa-lg`}></i>
                  </div>
                  <div>
                    <div className="text-muted small fw-bold text-uppercase">{stat.label}</div>
                    <div className="fw-bold fs-4 text-dark">{stat.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <div className="admin-chart-card shadow-sm border-0 h-100">
                <h6 className="fw-bold mb-4">Service Volume Trend</h6>
                <div className="bg-light rounded p-5 text-center d-flex flex-column align-items-center justify-content-center" style={{ height: '300px' }}>
                   <i className="fas fa-chart-area fa-4x text-muted opacity-25 mb-3"></i>
                   <p className="text-muted">Interactive Volume Chart will load here.</p>
                   <div className="d-flex align-items-end gap-2" style={{ height: '60px' }}>
                      <div className="bg-primary opacity-25" style={{ width: '20px', height: '30%' }}></div>
                      <div className="bg-primary opacity-50" style={{ width: '20px', height: '50%' }}></div>
                      <div className="bg-primary opacity-75" style={{ width: '20px', height: '80%' }}></div>
                      <div className="bg-primary" style={{ width: '20px', height: '60%' }}></div>
                      <div className="bg-primary opacity-50" style={{ width: '20px', height: '90%' }}></div>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="col-lg-4">
              <div className="admin-chart-card shadow-sm border-0 h-100">
                <h6 className="fw-bold mb-4">Top Selling Items (My Tables)</h6>
                <ul className="list-unstyled mb-0">
                  <li className="d-flex align-items-center mb-3">
                    <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&q=80" className="rounded me-3 border" alt="Item" />
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark small">Margherita Pizza</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>14 orders</div>
                    </div>
                    <span className="text-success fw-bold small">+₹6,860</span>
                  </li>
                  <li className="d-flex align-items-center mb-3">
                    <img src="https://images.unsplash.com/photo-1461023058943-07fc0e6974fc?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&q=80" className="rounded me-3 border" alt="Item" />
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark small">Cold Coffee</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>10 orders</div>
                    </div>
                    <span className="text-success fw-bold small">+₹1,800</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <img src="https://images.unsplash.com/photo-1547592166-23ac45744acd?ixlib=rb-1.2.1&auto=format&fit=crop&w=40&q=80" className="rounded me-3 border" alt="Item" />
                    <div className="flex-grow-1">
                      <div className="fw-bold text-dark small">Sandwiches</div>
                      <div className="text-muted" style={{ fontSize: '0.7rem' }}>6 orders</div>
                    </div>
                    <span className="text-success fw-bold small">+₹1,440</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaiterReportsPage;
