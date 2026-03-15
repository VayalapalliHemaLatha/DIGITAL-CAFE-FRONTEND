import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { authApi } from '../api';

const Navigation = () => {
  const location = useLocation();
  const { getTotalItems } = useCart();
  const user = authApi.getUser();
  const totalItems = getTotalItems();

  console.log('Navigation component mounted, current path:', location.pathname);

  const navItems = [
    { path: '/menu', label: 'Menu', icon: '🍽️' },
    { path: '/cart', label: 'Cart', icon: '🛒' },
    { path: '/orders', label: 'Orders', icon: '📋' }
  ];

  // Add admin dashboard for admin users
  if (user?.roleType === 'ADMIN' || user?.roleType === 'CAFE_OWNER') {
    navItems.push({ path: '/admin', label: 'Admin', icon: '⚙️' });
  }

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    authApi.logout();
    window.location.href = '/login';
  };

  return (
    <nav style={{
      backgroundColor: '#007bff',
      padding: '1rem 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: '0',
      zIndex: '1000'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/menu" style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          ☕ Digital Cafe
        </Link>

        {/* Navigation Items */}
        <div style={{
          display: 'flex',
          gap: '20px',
          alignItems: 'center'
        }}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                color: 'white',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '20px',
                backgroundColor: isActive(item.path) ? 'rgba(255,255,255,0.2)' : 'transparent',
                transition: 'background-color 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '14px',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.1)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.backgroundColor = 'transparent';
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
              {item.path === '/cart' && totalItems > 0 && (
                <span style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  position: 'absolute',
                  top: '-5px',
                  right: '-5px'
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* User Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          {user ? (
            <>
              <span style={{
                color: 'white',
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                👤 {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.3)',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  transition: 'background-color 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 12px',
                borderRadius: '15px',
                cursor: 'pointer',
                fontSize: '12px',
                textDecoration: 'none',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
