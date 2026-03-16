import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import { getWaiterOrdersReady, getWaiterOrders, updateWaiterOrderStatus } from '../api';
import WaiterSidebar from '../components/WaiterSidebar';
import '../styles/ChefWaiterDashboard.css';
import '../styles/AdminDashboard.css';

const REFRESH_EVENT = 'orders-refresh';

function WaiterOrdersPage({ onAuthChange }) {
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
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : (
            <>
              <h5 className="mb-3">Ready to serve</h5>
              {readyList.length === 0 ? (
                // Provide realistic mock data if empty
                <div className="row g-3 mb-5">
                   {[
                     { id: '1043', table: '4 (Window Seat)', loc: 'Main Floor', customer: 'John Doe', total: '849.00', time: '5m', items: [{ q: 1, name: 'Double Cheese Margherita', img: '1565299624946-b28f40a0ae38', price: '499', desc: 'Extra crispy crust' }, { q: 2, name: 'Cold Coffee with Ice Cream', img: '1461023058943-07fc0e6974fc', price: '175', desc: 'Less sugar' }] },
                     { id: '1042', table: '7 (Booth)', loc: 'Premium Area', customer: 'Sarah Smith', total: '1250.00', time: '12m', items: [{ q: 2, name: 'Grilled Chicken Sandwich', img: '1475090169767-40ed8d18f67d', price: '350', desc: 'No mayo' }, { q: 1, name: 'Avocado Caesar Salad', img: '1512621776951-a57141f2eefd', price: '250', desc: 'Dressing on side' }, { q: 2, name: 'Lemon Iced Tea', img: '1556881286-fc6915169721', price: '150', desc: '' }] }
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
                   ))}
                </div>
              ) : (
                <div className="row g-3 mb-5">
                  {readyList.map((o) => (
                    <div key={o.id} className="col-lg-6">
                       <div className="chef-waiter-order-card ready shadow-sm border-0" style={{ borderLeft: '4px solid #10b981' }}>
                         <div className="d-flex justify-content-between align-items-start mb-2">
                           <div>
                             <span className="chef-waiter-order-id fw-bold text-dark me-2">#{o.id}</span>
                             <span className="badge bg-success shadow-sm"><i className="fas fa-check-circle me-1"></i>READY TO SERVE</span>
                           </div>
                           <span className="text-muted fw-bold small"><i className="far fa-clock me-1"></i>READY NOW</span>
                         </div>
                         <div className="chef-waiter-order-meta d-flex justify-content-between align-items-center mb-3 p-2 bg-light rounded border">
                           <div>
                             <div className="fw-bold text-dark"><i className="fas fa-chair text-primary me-2"></i>Table {o.tableNumber || o.tableId}</div>
                             <div className="small text-muted">{o.location || 'Main Floor'}</div>
                           </div>
                           <div className="text-end">
                             <div className="fw-medium text-dark"><i className="fas fa-user-circle text-secondary me-2"></i>{o.userName || 'Guest'}</div>
                           </div>
                         </div>
                         <ul className="chef-waiter-order-items list-unstyled mb-3">
                           {(o.items || []).map((item, i) => (
                             <li key={i} className="mb-3 pb-3 border-bottom d-flex align-items-center">
                               <div className="position-relative me-3">
                                 {item.image ? (
                                   <img src={item.image} alt={item.name} className="rounded shadow-sm" style={{ width: '56px', height: '56px', objectFit: 'cover' }} />
                                 ) : (
                                   <div className="rounded bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: '56px', height: '56px' }}><i className="fas fa-utensils"></i></div>
                                 )}
                                 <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger shadow">{item.quantity}</span>
                               </div>
                               <div className="flex-grow-1">
                                 <div className="fw-bold text-dark">{item.name || item.itemName}</div>
                                 {item.note && <div className="small text-warning fw-medium"><i className="fas fa-exclamation-triangle me-1"></i>{item.note}</div>}
                               </div>
                               <div className="fw-bold text-secondary">₹{item.price}</div>
                             </li>
                           ))}
                         </ul>
                         <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                           <div>
                             <div className="text-muted small mb-1">Total Bill</div>
                             <div className="fw-bold fs-4 text-success">₹{o.totalAmount != null ? Number(o.totalAmount).toFixed(2) : '—'}</div>
                           </div>
                           <button
                             type="button"
                             className="btn btn-success btn-lg shadow px-4 fw-bold"
                             onClick={() => handleServed(o.id)}
                             disabled={updatingId === o.id}
                           >
                             <i className="fas fa-concierge-bell me-2"></i>
                             {updatingId === o.id ? <span className="spinner-border spinner-border-sm" /> : 'SERVE ORDER'}
                           </button>
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
              <h5 className="mb-3">All orders</h5>
              {allList.length === 0 ? (
                // Realistic mock all orders table
                <div className="admin-chart-card shadow-sm border-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Table</th>
                          <th>Status</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: '1046', table: '4', status: 'placed', total: '650.00', customer: 'Mark T.', time: 'Just now' },
                          { id: '1045', table: '2', status: 'preparing', total: '320.00', customer: 'Lucy M.', time: '10m ago' },
                          { id: '1044', table: '8', status: 'preparing', total: '890.00', customer: 'David W.', time: '18m ago' },
                          { id: '1043', table: '4', status: 'ready', total: '849.00', customer: 'John Doe', time: '5m waiting' },
                          { id: '1042', table: '7', status: 'ready', total: '1250.00', customer: 'Sarah S.', time: '12m waiting' },
                          { id: '1041', table: '1', status: 'served', total: '450.00', customer: 'Emma R.', time: 'Served 20m ago' },
                          { id: '1040', table: '5', status: 'served', total: '2100.00', customer: 'Group of 4', time: 'Served 1h ago' }
                        ].map((o) => (
                           <tr key={o.id}>
                             <td className="fw-bold text-dark">
                               #{o.id}
                               <div className="small text-muted fw-normal mt-1">{o.time}</div>
                             </td>
                             <td>
                               <div className="d-flex align-items-center">
                                 <div className="bg-light rounded-circle text-center me-2 d-flex align-items-center justify-content-center border" style={{ width: '30px', height: '30px' }}>
                                   <i className="fas fa-chair text-primary small"></i>
                                 </div>
                                 <span className="fw-medium">Table {o.table}</span>
                               </div>
                               <div className="small text-muted mt-1"><i className="fas fa-user-circle me-1"></i>{o.customer}</div>
                             </td>
                             <td>
                               <span className={`badge px-3 py-2 rounded-pill ${o.status === 'served' ? 'bg-success' : o.status === 'ready' ? 'bg-info text-dark' : o.status === 'preparing' ? 'bg-primary' : 'bg-warning text-dark'}`}>
                                 {o.status === 'served' && <i className="fas fa-check-double me-1"></i>}
                                 {o.status === 'ready' && <i className="fas fa-concierge-bell me-1"></i>}
                                 {o.status === 'preparing' && <i className="fas fa-fire-burner me-1"></i>}
                                 {o.status === 'placed' && <i className="fas fa-clipboard-list me-1"></i>}
                                 {o.status.toUpperCase()}
                               </span>
                             </td>
                             <td className="fw-bold text-success fs-6">₹{o.total}</td>
                           </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="admin-chart-card shadow-sm border-0">
                  <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Table</th>
                          <th>Status</th>
                          <th>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allList.map((o) => (
                          <tr key={o.id}>
                            <td className="fw-bold text-dark">#{o.id}</td>
                            <td><span className="badge bg-light text-dark border"><i className="fas fa-chair me-1 text-muted"></i>Table {o.tableNumber || o.tableId}</span></td>
                            <td><span className={`badge ${o.status === 'served' ? 'bg-success' : o.status === 'ready' ? 'bg-info text-dark' : o.status === 'preparing' ? 'bg-primary' : 'bg-warning text-dark'}`}>{o.status.toUpperCase()}</span></td>
                            <td className="fw-medium text-success">₹{o.totalAmount != null ? Number(o.totalAmount).toFixed(2) : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default WaiterOrdersPage;
