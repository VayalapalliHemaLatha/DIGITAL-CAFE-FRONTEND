import React, { useState } from 'react';
import WaiterSidebar from '../components/WaiterSidebar';
import '../styles/ChefWaiterDashboard.css';

function WaiterTablesPage() {
  const [tables] = useState([
    { id: 1, name: 'T-1', capacity: 2, status: 'occupied', customer: 'John Doe', orders: 2 },
    { id: 2, name: 'T-2', capacity: 4, status: 'available', customer: '', orders: 0 },
    { id: 3, name: 'T-3', capacity: 2, status: 'cleaning', customer: '', orders: 0 },
    { id: 4, name: 'T-4', capacity: 6, status: 'reserved', customer: 'Arun Kumar', orders: 0 },
    { id: 5, name: 'T-5', capacity: 4, status: 'occupied', customer: 'Sarah S.', orders: 1 },
    { id: 6, name: 'T-6', capacity: 2, status: 'available', customer: '', orders: 0 },
    { id: 7, name: 'T-7', capacity: 4, status: 'occupied', customer: 'David W.', orders: 3 },
    { id: 8, name: 'T-8', capacity: 8, status: 'occupied', customer: 'Corporate Group', orders: 5 },
    { id: 9, name: 'T-9', capacity: 2, status: 'available', customer: '', orders: 0 },
    { id: 10, name: 'T-10', capacity: 4, status: 'cleaning', customer: '', orders: 0 },
    { id: 11, name: 'T-11', capacity: 2, status: 'reserved', customer: 'Priya M.', orders: 0 },
    { id: 12, name: 'T-12', capacity: 4, status: 'available', customer: '', orders: 0 },
  ]);

  return (
    <div className="chef-waiter-layout">
      <WaiterSidebar />
      <div className="chef-waiter-main">
        <header className="chef-waiter-header">
          <div>
            <h1 className="chef-waiter-header-title">Table Management</h1>
            <p className="chef-waiter-header-subtitle">Monitor and manage table occupancy</p>
          </div>
          <div className="d-flex gap-3">
             <div className="d-flex align-items-center"><i className="fas fa-circle text-success me-1"></i> Available</div>
             <div className="d-flex align-items-center"><i className="fas fa-circle text-danger me-1"></i> Occupied</div>
             <div className="d-flex align-items-center"><i className="fas fa-circle text-warning me-1"></i> Reserved</div>
             <div className="d-flex align-items-center"><i className="fas fa-circle text-info me-1"></i> Cleaning</div>
          </div>
        </header>

        <div className="chef-waiter-content">
          <div className="row g-4">
            {tables.map(table => (
              <div key={table.id} className="col-lg-3 col-md-4 col-sm-6">
                <div className={`admin-chart-card p-0 overflow-hidden border-0 shadow-sm h-100 ${table.status === 'occupied' ? 'border-start border-4 border-danger' : table.status === 'reserved' ? 'border-start border-4 border-warning' : table.status === 'cleaning' ? 'border-start border-4 border-info' : 'border-start border-4 border-success'}`}>
                  <div className="p-3">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h4 className="fw-bold mb-0">{table.name}</h4>
                        <small className="text-muted"><i className="fas fa-users me-1"></i> Capacity: {table.capacity}</small>
                      </div>
                      <span className={`badge ${table.status === 'occupied' ? 'bg-danger' : table.status === 'reserved' ? 'bg-warning text-dark' : table.status === 'cleaning' ? 'bg-info' : 'bg-success'}`}>
                        {table.status.toUpperCase()}
                      </span>
                    </div>
                    
                    {table.status === 'occupied' ? (
                      <div className="bg-light p-2 rounded mb-3 small">
                        <div className="fw-bold text-dark"><i className="fas fa-user me-2"></i>{table.customer}</div>
                        <div className="text-muted"><i className="fas fa-receipt me-2"></i>{table.orders} active orders</div>
                      </div>
                    ) : table.status === 'reserved' ? (
                        <div className="bg-light p-2 rounded mb-3 small">
                            <div className="fw-bold text-dark text-truncate"><i className="fas fa-calendar-check me-2"></i>{table.customer}</div>
                            <div className="text-muted"><i className="far fa-clock me-2"></i>Today, 19:30</div>
                        </div>
                    ) : (
                      <div className="text-center py-2 mb-3 text-muted small">
                        <i className="fas fa-couch fa-2x opacity-25 mb-2"></i>
                        <div>{table.status === 'cleaning' ? 'Table being sanitized' : 'Ready for guests'}</div>
                      </div>
                    )}
                    
                    <div className="d-grid gap-2">
                        {table.status === 'available' ? (
                            <button className="btn btn-outline-success btn-sm fw-bold">ASSIGN GUESTS</button>
                        ) : table.status === 'occupied' ? (
                            <button className="btn btn-outline-danger btn-sm fw-bold">VIEW ORDERS</button>
                        ) : (
                            <button className="btn btn-outline-secondary btn-sm fw-bold">MANAGE TABLE</button>
                        )}
                    </div>
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

export default WaiterTablesPage;
