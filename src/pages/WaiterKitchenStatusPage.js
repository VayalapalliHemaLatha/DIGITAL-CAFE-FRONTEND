import React from 'react';
import WaiterSidebar from '../components/WaiterSidebar';
import '../styles/ChefWaiterDashboard.css';

function WaiterKitchenStatusPage() {
  const kitchenOrders = [
    { id: '1046', table: '4', items: ['Cold Coffee', 'Sandwich'], status: 'Preparing', progress: 40, chef: 'Chef Marco', time: '12m ago' },
    { id: '1043', table: '7', items: ['Margherita Pizza', 'Pasta'], status: 'Ready', progress: 100, chef: 'Chef Luigi', time: '5m ago' },
    { id: '1045', table: '2', items: ['Garlic Bread', 'Salad'], status: 'Preparing', progress: 85, chef: 'Chef Marco', time: '15m ago' },
    { id: '1048', table: '10', items: ['Burger Deluxe', 'Coke'], status: 'Preparing', progress: 20, chef: 'Chef Luigi', time: '2m ago' },
  ];

  return (
    <div className="chef-waiter-layout">
      <WaiterSidebar />
      <div className="chef-waiter-main">
        <header className="chef-waiter-header">
          <div>
            <h1 className="chef-waiter-header-title">Kitchen Status</h1>
            <p className="chef-waiter-header-subtitle">Real-time status of orders in preparation</p>
          </div>
          <div className="badge bg-success bg-opacity-10 text-success border border-success p-2 px-3 rounded-pill fw-bold">
            <i className="fas fa-fire me-2"></i> Kitchen is Active
          </div>
        </header>

        <div className="chef-waiter-content">
          <div className="row g-4">
            {kitchenOrders.map(order => (
              <div key={order.id} className="col-12 col-lg-6">
                <div className="admin-chart-card shadow-sm border-0 h-100">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary text-white rounded p-2 me-3 shadow-sm d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                         <i className="fas fa-receipt fa-lg"></i>
                      </div>
                      <div>
                        <h6 className="mb-0 fw-bold text-dark">Order #{order.id}</h6>
                        <small className="text-muted"><i className="fas fa-chair me-1"></i> Table {order.table} • {order.time}</small>
                      </div>
                    </div>
                    <span className={`badge px-3 py-2 rounded-pill ${order.status === 'Ready' ? 'bg-success shadow' : 'bg-primary'}`}>
                      {order.status === 'Ready' ? <i className="fas fa-check-circle me-1"></i> : <i className="fas fa-spinner fa-spin me-1"></i>}
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <label className="text-muted small fw-bold mb-2">PROGRESS</label>
                    <div className="progress shadow-sm" style={{ height: '10px', borderRadius: '5px' }}>
                      <div className={`progress-bar ${order.status === 'Ready' ? 'bg-success' : 'progress-bar-striped progress-bar-animated'}`} role="progressbar" style={{ width: `${order.progress}%` }}></div>
                    </div>
                    <div className="text-end text-muted small mt-1 fw-bold">{order.progress}% Completed</div>
                  </div>
                  
                  <div className="bg-light p-3 rounded border">
                    <div className="fw-bold text-dark small mb-2"><i className="fas fa-utensils me-2 text-primary"></i>ITEMS IN PREP:</div>
                    <div className="d-flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="badge bg-white text-dark border p-2 px-3 rounded shadow-sm">{item}</span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-top d-flex justify-content-between align-items-center">
                    <div className="small text-muted"><i className="fas fa-user-tie me-2"></i>Assigned Chef: <span className="text-dark fw-bold">{order.chef}</span></div>
                    {order.status === 'Ready' && <button className="btn btn-success btn-sm px-4 fw-bold shadow">LOCATE & SERVE</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WaiterKitchenStatusPage;
