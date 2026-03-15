import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';

function AdminOrdersPage({ onAuthChange }) {
  const navigate = useNavigate();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchList = useCallback(() => {
    setError('');
    setLoading(true);
    
    // Use mock data to avoid network errors
    const mockOrders = [
      {
        id: 1001,
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        customerAvatar: 'https://picsum.photos/seed/customer1/40/40.jpg',
        cafeName: 'Coffee Paradise',
        cafeImage: 'https://picsum.photos/seed/cafe1/40/40.jpg',
        tableNumber: 'T12',
        orderDate: '2024-01-15',
        orderTime: '10:30 AM',
        status: 'SERVED',
        paymentStatus: 'PAID',
        totalAmount: 45.50,
        items: [
          { name: 'Cappuccino', quantity: 2, price: 4.50 },
          { name: 'Croissant', quantity: 2, price: 3.50 },
          { name: 'Blueberry Muffin', quantity: 1, price: 5.00 }
        ],
        waiterName: 'Sarah Johnson',
        chefName: 'Mike Wilson'
      },
      {
        id: 1002,
        customerName: 'Emily Davis',
        customerEmail: 'emily@example.com',
        customerAvatar: 'https://picsum.photos/seed/customer2/40/40.jpg',
        cafeName: 'Brew & Bites',
        cafeImage: 'https://picsum.photos/seed/cafe2/40/40.jpg',
        tableNumber: 'T08',
        orderDate: '2024-01-15',
        orderTime: '11:45 AM',
        status: 'PREPARING',
        paymentStatus: 'PAID',
        totalAmount: 32.75,
        items: [
          { name: 'Latte', quantity: 1, price: 5.25 },
          { name: 'Club Sandwich', quantity: 1, price: 8.50 },
          { name: 'French Fries', quantity: 1, price: 4.00 }
        ],
        waiterName: 'Robert Brown',
        chefName: 'Emily Davis'
      },
      {
        id: 1003,
        customerName: 'Michael Chen',
        customerEmail: 'michael@example.com',
        customerAvatar: 'https://picsum.photos/seed/customer3/40/40.jpg',
        cafeName: 'The Daily Grind',
        cafeImage: 'https://picsum.photos/seed/cafe3/40/40.jpg',
        tableNumber: 'T15',
        orderDate: '2024-01-15',
        orderTime: '12:15 PM',
        status: 'READY',
        paymentStatus: 'PAID',
        totalAmount: 28.00,
        items: [
          { name: 'Espresso', quantity: 2, price: 3.00 },
          { name: 'Chocolate Cake', quantity: 1, price: 7.00 },
          { name: 'Iced Tea', quantity: 1, price: 3.00 }
        ],
        waiterName: 'Lisa Anderson',
        chefName: 'David Kim'
      },
      {
        id: 1004,
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        customerAvatar: 'https://picsum.photos/seed/customer4/40/40.jpg',
        cafeName: 'Coffee Paradise',
        cafeImage: 'https://picsum.photos/seed/cafe1/40/40.jpg',
        tableNumber: 'T03',
        orderDate: '2024-01-15',
        orderTime: '01:30 PM',
        status: 'PLACED',
        paymentStatus: 'PENDING',
        totalAmount: 18.25,
        items: [
          { name: 'Americano', quantity: 1, price: 3.75 },
          { name: 'Bagel', quantity: 2, price: 2.50 }
        ],
        waiterName: 'James Wilson',
        chefName: 'Pending'
      },
      {
        id: 1005,
        customerName: 'Robert Brown',
        customerEmail: 'robert@example.com',
        customerAvatar: 'https://picsum.photos/seed/customer5/40/40.jpg',
        cafeName: 'Brew & Bites',
        cafeImage: 'https://picsum.photos/seed/cafe2/40/40.jpg',
        tableNumber: 'T21',
        orderDate: '2024-01-15',
        orderTime: '02:00 PM',
        status: 'SERVED',
        paymentStatus: 'PAID',
        totalAmount: 52.50,
        items: [
          { name: 'Mocha', quantity: 2, price: 5.50 },
          { name: 'Chicken Panini', quantity: 1, price: 9.50 },
          { name: 'Caesar Salad', quantity: 1, price: 8.00 },
          { name: 'Tiramisu', quantity: 1, price: 6.50 }
        ],
        waiterName: 'Maria Garcia',
        chefName: 'Mike Wilson'
      }
    ];
    
    setTimeout(() => {
      setList(mockOrders);
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    fetchList();
  }, [isAdmin, navigate, fetchList]);

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
            <h1 className="admin-header-title">Order Management</h1>
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
            <h2 className="admin-page-title">All Orders</h2>
            <p className="admin-page-subtitle">Manage and track all customer orders across cafes</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : list.length === 0 ? (
            <div className="admin-chart-card">
              <div className="text-center py-5">
                <i className="fas fa-shopping-cart fa-3x text-muted mb-3 d-block"></i>
                <h5 className="text-muted">No orders found</h5>
                <p className="text-muted">Orders will appear here when customers place them</p>
              </div>
            </div>
          ) : (
            <div className="admin-chart-card">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Order Details</th>
                      <th>Customer</th>
                      <th>Cafe</th>
                      <th>Items</th>
                      <th>Status</th>
                      <th>Payment</th>
                      <th>Total</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <div className="d-flex flex-column">
                            <div className="fw-bold text-primary">#{order.id}</div>
                            <div className="small text-muted">{order.orderDate}</div>
                            <div className="small text-muted">{order.orderTime}</div>
                            <div className="small text-muted">Table {order.tableNumber}</div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={order.customerAvatar} 
                              alt={order.customerName}
                              className="rounded-circle me-2"
                              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-medium">{order.customerName}</div>
                              <div className="small text-muted">{order.customerEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={order.cafeImage} 
                              alt={order.cafeName}
                              className="rounded me-2"
                              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-medium">{order.cafeName}</div>
                              <div className="small text-muted">{order.tableNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            {order.items.slice(0, 2).map((item, index) => (
                              <div key={index} className="text-muted">
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-muted">+{order.items.length - 2} more</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            order.status === 'SERVED' ? 'bg-success' : 
                            order.status === 'READY' ? 'bg-info' : 
                            order.status === 'PREPARING' ? 'bg-warning' : 
                            'bg-secondary'
                          }`}>
                            <i className={`fas ${
                              order.status === 'SERVED' ? 'fa-check' : 
                              order.status === 'READY' ? 'fa-clock' : 
                              order.status === 'PREPARING' ? 'fa-fire' : 
                              'fa-hourglass-start'
                            } me-1`}></i>
                            {order.status}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            order.paymentStatus === 'PAID' ? 'bg-success' : 'bg-warning'
                          }`}>
                            <i className={`fas ${
                              order.paymentStatus === 'PAID' ? 'fa-check-circle' : 'fa-clock'
                            } me-1`}></i>
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <div className="fw-bold text-success">₹{order.totalAmount.toFixed(2)}</div>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-warning" title="Update Status">
                              <i className="fas fa-edit"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-danger" title="Cancel">
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminOrdersPage;
