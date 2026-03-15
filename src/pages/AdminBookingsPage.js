import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api';
import AdminSidebar from '../components/AdminSidebar';
import '../styles/AdminDashboard.css';

function AdminBookingsPage({ onAuthChange }) {
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
    const mockBookings = [
      {
        id: 2001,
        customerName: 'John Smith',
        customerEmail: 'john@example.com',
        customerPhone: '+1234567890',
        customerAvatar: 'https://picsum.photos/seed/customer1/40/40.jpg',
        cafeName: 'Coffee Paradise',
        cafeImage: 'https://picsum.photos/seed/cafe1/40/40.jpg',
        cafeAddress: '123 Main Street, Downtown',
        tableNumber: 'T12',
        bookingDate: '2024-01-20',
        bookingTime: '14:00',
        guests: 4,
        status: 'CONFIRMED',
        specialRequests: 'Window seat preferred, celebrating anniversary',
        createdAt: '2024-01-15T10:30:00Z',
        totalAmount: 0.00
      },
      {
        id: 2002,
        customerName: 'Emily Davis',
        customerEmail: 'emily@example.com',
        customerPhone: '+1234567891',
        customerAvatar: 'https://picsum.photos/seed/customer2/40/40.jpg',
        cafeName: 'Brew & Bites',
        cafeImage: 'https://picsum.photos/seed/cafe2/40/40.jpg',
        cafeAddress: '456 Oak Avenue, Uptown',
        tableNumber: 'T08',
        bookingDate: '2024-01-21',
        bookingTime: '19:00',
        guests: 2,
        status: 'PENDING',
        specialRequests: 'Vegetarian options needed',
        createdAt: '2024-01-15T11:45:00Z',
        totalAmount: 0.00
      },
      {
        id: 2003,
        customerName: 'Michael Chen',
        customerEmail: 'michael@example.com',
        customerPhone: '+1234567892',
        customerAvatar: 'https://picsum.photos/seed/customer3/40/40.jpg',
        cafeName: 'The Daily Grind',
        cafeImage: 'https://picsum.photos/seed/cafe3/40/40.jpg',
        cafeAddress: '789 Pine Road, Midtown',
        tableNumber: 'T15',
        bookingDate: '2024-01-22',
        bookingTime: '18:30',
        guests: 6,
        status: 'CONFIRMED',
        specialRequests: 'Birthday celebration, need cake arrangement',
        createdAt: '2024-01-15T12:15:00Z',
        totalAmount: 150.00
      },
      {
        id: 2004,
        customerName: 'Sarah Johnson',
        customerEmail: 'sarah@example.com',
        customerPhone: '+1234567893',
        customerAvatar: 'https://picsum.photos/seed/customer4/40/40.jpg',
        cafeName: 'Coffee Paradise',
        cafeImage: 'https://picsum.photos/seed/cafe1/40/40.jpg',
        cafeAddress: '123 Main Street, Downtown',
        tableNumber: 'T03',
        bookingDate: '2024-01-23',
        bookingTime: '12:00',
        guests: 3,
        status: 'CANCELLED',
        specialRequests: 'Business meeting',
        createdAt: '2024-01-15T13:30:00Z',
        totalAmount: 0.00
      },
      {
        id: 2005,
        customerName: 'Robert Brown',
        customerEmail: 'robert@example.com',
        customerPhone: '+1234567894',
        customerAvatar: 'https://picsum.photos/seed/customer5/40/40.jpg',
        cafeName: 'Brew & Bites',
        cafeImage: 'https://picsum.photos/seed/cafe2/40/40.jpg',
        cafeAddress: '456 Oak Avenue, Uptown',
        tableNumber: 'T21',
        bookingDate: '2024-01-24',
        bookingTime: '20:00',
        guests: 8,
        status: 'CONFIRMED',
        specialRequests: 'Corporate event, need separate area',
        createdAt: '2024-01-15T14:00:00Z',
        totalAmount: 300.00
      }
    ];
    
    setTimeout(() => {
      setList(mockBookings);
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
            <h1 className="admin-header-title">Booking Management</h1>
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
            <h2 className="admin-page-title">All Bookings</h2>
            <p className="admin-page-subtitle">Manage and track all customer reservations across cafes</p>
          </div>

          {error && <div className="alert alert-danger py-2 small">{error}</div>}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
            </div>
          ) : list.length === 0 ? (
            <div className="admin-chart-card">
              <div className="text-center py-5">
                <i className="fas fa-calendar-alt fa-3x text-muted mb-3 d-block"></i>
                <h5 className="text-muted">No bookings found</h5>
                <p className="text-muted">Bookings will appear here when customers make reservations</p>
              </div>
            </div>
          ) : (
            <div className="admin-chart-card">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Booking Details</th>
                      <th>Customer</th>
                      <th>Cafe</th>
                      <th>Reservation</th>
                      <th>Special Requests</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((booking) => (
                      <tr key={booking.id}>
                        <td>
                          <div className="d-flex flex-column">
                            <div className="fw-bold text-primary">#{booking.id}</div>
                            <div className="small text-muted">{booking.bookingDate}</div>
                            <div className="small text-muted">{booking.bookingTime}</div>
                            <div className="small text-muted">{booking.guests} guests</div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={booking.customerAvatar} 
                              alt={booking.customerName}
                              className="rounded-circle me-2"
                              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-medium">{booking.customerName}</div>
                              <div className="small text-muted">{booking.customerEmail}</div>
                              <div className="small text-muted">{booking.customerPhone}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={booking.cafeImage} 
                              alt={booking.cafeName}
                              className="rounded me-2"
                              style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-medium">{booking.cafeName}</div>
                              <div className="small text-muted">{booking.cafeAddress}</div>
                              <div className="small text-muted">Table {booking.tableNumber}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-column">
                            <div className="fw-medium">{booking.guests} Guests</div>
                            <div className="small text-muted">{booking.tableNumber}</div>
                            {booking.totalAmount > 0 && (
                              <div className="small text-success fw-bold">₹{booking.totalAmount.toFixed(2)}</div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="small">
                            {booking.specialRequests ? (
                              <div className="text-truncate" style={{ maxWidth: '150px' }} title={booking.specialRequests}>
                                {booking.specialRequests}
                              </div>
                            ) : (
                              <span className="text-muted">No special requests</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className={`badge ${
                            booking.status === 'CONFIRMED' ? 'bg-success' : 
                            booking.status === 'PENDING' ? 'bg-warning' : 
                            booking.status === 'CANCELLED' ? 'bg-danger' : 
                            'bg-secondary'
                          }`}>
                            <i className={`fas ${
                              booking.status === 'CONFIRMED' ? 'fa-check-circle' : 
                              booking.status === 'PENDING' ? 'fa-clock' : 
                              booking.status === 'CANCELLED' ? 'fa-times-circle' : 
                              'fa-question-circle'
                            } me-1`}></i>
                            {booking.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary" title="View Details">
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-success" title="Confirm">
                              <i className="fas fa-check"></i>
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

export default AdminBookingsPage;
