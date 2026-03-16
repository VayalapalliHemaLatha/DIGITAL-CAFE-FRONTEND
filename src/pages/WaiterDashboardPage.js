import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getWaiterOrdersReady, getWaiterOrders, updateWaiterOrderStatus } from '../api';
import WaiterSidebar from '../components/WaiterSidebar';
import '../styles/ChefWaiterDashboard.css';
import '../styles/AdminDashboard.css';

const REFRESH_EVENT = 'orders-refresh';

function WaiterDashboardPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isWaiter = roleType === 'waiter';

  const [readyList, setReadyList] = useState([]);
  const [allList, setAllList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState(null);

  const handleAuthFailure = useCallback(() => {
    authApi.setToken(null);
    authApi.setUser(null);
    onAuthChange?.();
    navigate('/login', { replace: true });
  }, [navigate, onAuthChange]);

  const fetchData = useCallback(() => {
    setError('');
    setLoading(true);
    Promise.all([getWaiterOrdersReady(), getWaiterOrders()])
      .then(([ready, all]) => {
        setReadyList(Array.isArray(ready) ? ready : []);
        setAllList(Array.isArray(all) ? all : []);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          handleAuthFailure();
          return;
        }
        setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load orders.');
      })
      .finally(() => setLoading(false));
  }, [handleAuthFailure]);

  useEffect(() => {
    if (!isWaiter) {
      navigate('/', { replace: true });
      return;
    }
    fetchData();
  }, [isWaiter, navigate, fetchData]);

  useEffect(() => {
    const onRefresh = () => fetchData();
    window.addEventListener(REFRESH_EVENT, onRefresh);
    return () => window.removeEventListener(REFRESH_EVENT, onRefresh);
  }, [fetchData]);

  const handleServed = async (orderId) => {
    setUpdatingId(orderId);
    setError('');
    try {
      await updateWaiterOrderStatus(orderId, { status: 'served' });
      window.dispatchEvent(new CustomEvent(REFRESH_EVENT));
      fetchData();
    } catch (err) {
      if (err.response?.status === 401) handleAuthFailure();
      else setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update.');
    } finally {
      setUpdatingId(null);
    }
  };

  const activeCount = allList.filter((o) => ['placed', 'preparing', 'ready'].includes((o.status || '').toLowerCase())).length;
  const servedTodayCount = allList.filter((o) => {
    if ((o.status || '').toLowerCase() !== 'served') return false;
    const today = new Date().toISOString().slice(0, 10);
    return (o.orderDate || o.servedAt || '').slice(0, 10) === today;
  }).length;

  if (!isWaiter) return null;

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
            <input type="text" className="form-control form-control-sm" placeholder="Search..." style={{ maxWidth: 200 }} />
            <button type="button" className="btn btn-sm btn-outline-secondary" aria-label="Notifications">
              <i className="fas fa-bell"></i>
            </button>
            <div className="chef-waiter-user">
              <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Waiter Avatar" className="rounded-circle me-2" style={{ width: '32px', height: '32px', objectFit: 'cover' }} onError={(e) => { e.target.onerror = null; e.target.style.display = 'none'; e.target.nextSibling.style.display = 'inline-block'; }} />
              <i className="fas fa-user-circle fa-lg shadow-sm" style={{ color: '#2563eb', display: 'none' }}></i>
              <span className="fw-medium">{user?.email ?? 'waiter@demo.com'}</span>
            </div>
          </div>
        </header>

        <div className="chef-waiter-content">
          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : (
            <>
              <div className="row g-3 mb-4">
                <div className="col-6 col-md-4">
                  <div className="chef-waiter-summary-card">
                    <div className="chef-waiter-summary-icon red"><i className="fas fa-utensils"></i></div>
                    <div>
                      <div className="chef-waiter-summary-value">{readyList.length}</div>
                      <div className="chef-waiter-summary-label">Ready to Serve</div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="chef-waiter-summary-card">
                    <div className="chef-waiter-summary-icon orange"><i className="fas fa-clipboard-list"></i></div>
                    <div>
                      <div className="chef-waiter-summary-value">{activeCount}</div>
                      <div className="chef-waiter-summary-label">Active Orders</div>
                    </div>
                  </div>
                </div>
                <div className="col-6 col-md-4">
                  <div className="chef-waiter-summary-card">
                    <div className="chef-waiter-summary-icon green"><i className="fas fa-check-circle"></i></div>
                    <div>
                      <div className="chef-waiter-summary-value">{servedTodayCount}</div>
                      <div className="chef-waiter-summary-label">Served Today</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h5 className="mb-1"><i className="fas fa-info-circle text-info me-2"></i>Ready Orders</h5>
                <p className="text-muted small mb-3">Orders prepared by the kitchen - serve immediately</p>
                {readyList.length === 0 ? (
                  <div className="empty-state-box">No orders ready to serve.</div>
                ) : (
                  <div className="row g-3">
                    {readyList.length > 0 ? (
                      readyList.map((o) => (
                        <div key={o.id} className="col-lg-6">
                           <div className="chef-waiter-order-card ready shadow-sm border-0" style={{ borderLeft: '4px solid #10b981' }}>
                             <div className="d-flex justify-content-between align-items-start mb-2">
                               <div>
                                  <span className="chef-waiter-order-id fw-bold text-dark me-2">#{o.id}</span>
                                  <span className="badge bg-success shadow-sm"><i className="fas fa-check-circle me-1"></i>READY</span>
                               </div>
                               <span className="text-muted small"><i className="far fa-clock me-1"></i>Just now</span>
                             </div>
                             <div className="chef-waiter-order-meta text-muted small mb-3">
                               <i className="fas fa-user me-1"></i> {o.userName || o.userId} • <i className="fas fa-chair ms-2 me-1"></i> {o.tableNumber ? `Table ${o.tableNumber}` : 'Takeaway'}
                             </div>
                             <ul className="chef-waiter-order-items list-unstyled bg-light p-3 rounded mb-3">
                               {(o.items || []).map((item, i) => (
                                 <li key={i} className="mb-2 pb-2 border-bottom d-flex align-items-center">
                                   <span className="badge bg-secondary me-2">{item.quantity}x</span>
                                   <div className="flex-grow-1 fw-medium text-dark">{item.itemName}</div>
                                   <div className="fw-bold text-secondary">₹{item.unitPrice != null ? Number(item.unitPrice).toFixed(0) : '0'}</div>
                                 </li>
                               ))}
                             </ul>
                             {o.note && <div className="alert alert-warning py-2 mb-3 small"><i className="fas fa-comment-alt me-2"></i>{o.note}</div>}
                             <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                               <div>
                                 <div className="text-muted small mb-1">Total Amount</div>
                                 <div className="fw-bold fs-5 text-dark">₹{o.totalAmount != null ? Number(o.totalAmount).toFixed(2) : '0.00'}</div>
                               </div>
                               <button
                                 type="button"
                                 className="btn btn-success shadow-sm px-4 py-2"
                                 onClick={() => handleServed(o.id)}
                                 disabled={updatingId === o.id}
                               >
                                 {updatingId === o.id ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="fas fa-concierge-bell me-2"></i>}
                                 SERVE NOW
                               </button>
                             </div>
                           </div>
                        </div>
                      ))
                    ) : (
                      // Mock Realistic Data
                      [
                         { id: '1043', customer: 'John Doe', table: '4 (Window Seat)', loc: 'Main Floor', total: '849.00', time: '5m', items: [{ q: 1, name: 'Double Cheese Margherita', img: '1565299624946-b28f40a0ae38', price: '499', desc: 'Extra crispy crust' }, { q: 2, name: 'Cold Coffee with Ice Cream', img: '1461023058943-07fc0e6974fc', price: '175', desc: 'Less sugar' }] },
                         { id: '1042', customer: 'Sarah Smith', table: '7 (Booth)', loc: 'Premium Area', total: '1250.00', time: '12m', items: [{ q: 2, name: 'Grilled Chicken Sandwich', img: '1475090169767-40ed8d18f67d', price: '350', desc: 'No mayo' }, { q: 1, name: 'Avocado Caesar Salad', img: '1512621776951-a57141f2eefd', price: '250', desc: 'Dressing on side' }, { q: 2, name: 'Lemon Iced Tea', img: '1556881286-fc6915169721', price: '150', desc: '' }] },
                         { id: '1040', customer: 'Mike Johnson', table: '12', loc: 'Patio Outdoors', total: '920.00', time: '18m', items: [{ q: 1, name: 'Spicy Pepperoni Pizza', img: '1628840042765-356cda07504e', price: '550', desc: 'Extra cheese' }, { q: 1, name: 'Berry Smoothie', img: '1556881286-fc6915169721', price: '370', desc: '' }] }
                      ].map((o, idx) => (
                        <div key={idx} className="col-lg-6">
                           <div className="chef-waiter-order-card ready shadow-sm border-0" style={{ borderLeft: '4px solid #10b981' }}>
                             <div className="d-flex justify-content-between align-items-start mb-2">
                               <div>
                                 <span className="chef-waiter-order-id fw-bold text-dark me-2">#{o.id}</span>
                                 <span className="badge bg-success shadow-sm"><i className="fas fa-check-circle me-1"></i>READY TO SERVE</span>
                               </div>
                               <span className="text-danger fw-bold small"><i className="far fa-clock me-1"></i>WAITING {o.time}</span>
                             </div>
                             <div className="chef-waiter-order-meta d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded border">
                               <div>
                                 <div className="fw-bold text-dark"><i className="fas fa-chair text-primary me-2"></i>Table {o.table}</div>
                                 <div className="small text-muted">{o.loc}</div>
                               </div>
                               <div className="text-end">
                                 <div className="fw-medium text-dark"><i className="fas fa-user-circle text-secondary me-2"></i>{o.customer}</div>
                               </div>
                             </div>
                             <ul className="chef-waiter-order-items list-unstyled mb-3">
                               {o.items.map((item, i) => (
                                 <li key={i} className="mb-3 pb-3 border-bottom d-flex align-items-center">
                                   <div className="position-relative me-3">
                                     <img src={`https://images.unsplash.com/photo-${item.img}?ixlib=rb-1.2.1&auto=format&fit=crop&w=80&q=80`} alt={item.name} className="rounded shadow-sm" style={{ width: '56px', height: '56px', objectFit: 'cover' }} />
                                     <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow">{item.q}</span>
                                   </div>
                                   <div className="flex-grow-1">
                                     <div className="fw-bold text-dark">{item.name}</div>
                                     {item.desc && <div className="small text-warning fw-medium"><i className="fas fa-exclamation-triangle me-1"></i>{item.desc}</div>}
                                   </div>
                                   <div className="fw-bold text-secondary">₹{item.price}</div>
                                 </li>
                               ))}
                             </ul>
                             <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                               <div>
                                 <div className="text-muted small mb-1">Total Bill</div>
                                 <div className="fw-bold fs-4 text-success">₹{o.total}</div>
                               </div>
                               <button
                                 type="button"
                                 className="btn btn-success btn-lg shadow px-4 fw-bold"
                                 disabled={updatingId === o.id}
                               >
                                 <i className="fas fa-concierge-bell me-2"></i>
                                 SERVE ORDER
                               </button>
                             </div>
                           </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Table Map Visual Section */}
              <div className="mt-5 mb-5">
                <div className="d-flex justify-content-between align-items-end mb-3">
                  <div>
                    <h5 className="mb-1 fw-bold"><i className="fas fa-th text-primary me-2"></i>Table Layout</h5>
                    <p className="text-muted small mb-0">Floor plan & current table occupancy</p>
                  </div>
                  <div className="small d-flex gap-3">
                    <span><i className="fas fa-square text-success me-1"></i>Free</span>
                    <span><i className="fas fa-square text-warning me-1"></i>Reserved</span>
                    <span><i className="fas fa-square text-danger me-1"></i>Occupied</span>
                  </div>
                </div>
                <div className="admin-chart-card p-4 shadow-sm border-0 bg-white rounded">
                  <div className="row g-4 justify-content-center">
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                      <div key={num} className="col-auto">
                        <div className={`p-4 rounded-3 d-flex flex-column align-items-center justify-content-center shadow-sm border border-2 ${[1,4,7,10].includes(num) ? 'bg-danger bg-opacity-10 border-danger' : [2,5,8,11].includes(num) ? 'bg-warning bg-opacity-10 border-warning' : 'bg-success bg-opacity-10 border-success'}`} style={{ width: '100px', height: '100px', cursor: 'pointer' }}>
                          <span className="fw-bold text-dark fs-4">T-{num}</span>
                          <span className="small text-muted" style={{ fontSize: '0.7rem' }}>{num % 2 === 0 ? '4 Seats' : '2 Seats'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Menu Categories Visual Section */}
              <div className="mt-5 mb-5">
                <h5 className="mb-1 fw-bold"><i className="fas fa-utensils text-warning me-2"></i>Popular Categories</h5>
                <p className="text-muted small mb-4">Quick access to main menu sections</p>
                <div className="row g-3">
                  {[
                    { name: 'Breakfast Items', img: '1504753793613-22f1b3ff91f9', count: 12 },
                    { name: 'Specialty Pizzas', img: '1513104890138-7c749659a591', count: 8 },
                    { name: 'Fresh Beverages', img: '1547592166-23ac45744acd', count: 15 },
                    { name: 'Main Course', img: '1504674900247-0877df9cc836', count: 24 }
                  ].map((cat, idx) => (
                    <div key={idx} className="col-md-3 col-6">
                      <div className="position-relative rounded shadow-sm overflow-hidden" style={{ height: '120px' }}>
                        <img src={`https://images.unsplash.com/photo-${cat.img}?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80`} className="w-100 h-100" style={{ objectFit: 'cover' }} alt={cat.name} />
                        <div className="position-absolute bottom-0 start-0 w-100 p-2" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
                          <div className="text-white fw-bold small mb-0">{cat.name}</div>
                          <div className="text-white-50" style={{ fontSize: '0.65rem' }}>{cat.count} Items Available</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaiterDashboardPage;
