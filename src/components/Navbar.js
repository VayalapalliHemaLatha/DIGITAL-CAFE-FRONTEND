import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authApi } from '../api';
import CreateUserModal from './CreateUserModal';

function Navbar({ isLoggedIn }) {
  const location = useLocation();
  const user = authApi.getUser();
  const roleType = (user?.roleType || '').toLowerCase();
  const isAdmin = roleType === 'admin';
  const isCafeOwner = roleType === 'cafeowner';
  const showProfileDropdown = isAdmin || isCafeOwner;

  const [createModal, setCreateModal] = useState({ show: false, roleType: null, title: '' });

  const openCreateModal = (roleType, title) => {
    setCreateModal({ show: true, roleType, title });
  };
  const closeCreateModal = () => setCreateModal({ show: false, roleType: null, title: '' });

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark navbar-restoran sticky-top">
        <div className="container">
          <Link to="/" className="navbar-brand">
            <i className="fas fa-utensils me-2 text-primary"></i>
            Digital Cafe
          </Link>
          <button className="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav align-items-lg-center">
              <li className="nav-item">
                <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#about">About</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#service">Service</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#menu">Menu</a>
              </li>
              <li className="nav-item dropdown">
                <button type="button" className="nav-link dropdown-toggle border-0 bg-transparent text-inherit" id="pagesDropdown" data-bs-toggle="dropdown" aria-expanded="false">Pages</button>
                <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="pagesDropdown">
                  <li><Link to="/login" className="dropdown-item">Login</Link></li>
                  <li><Link to="/register" className="dropdown-item">Sign Up</Link></li>
                  <li><Link to="/account" className="dropdown-item">Account / Sign out</Link></li>
                </ul>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/#contact">Contact</a>
              </li>
              {isLoggedIn ? (
                <li className="nav-item" id="profilesection">
                  {showProfileDropdown ? (
                    <div className="dropdown">
                      <button
                        type="button"
                        className="nav-link py-0 d-flex align-items-center dropdown-toggle border-0 bg-transparent text-inherit"
                        id="profileDropdown"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fas fa-user me-2 text-primary"></i>
                        {user?.name ?? user?.email ?? 'User'}
                      </button>
                      <ul className="dropdown-menu dropdown-menu-dark dropdown-menu-end" aria-labelledby="profileDropdown">
                        <li><Link to="/account" className="dropdown-item">Account</Link></li>
                        {isAdmin && (
                          <li>
                            <button type="button" className="dropdown-item" onClick={() => openCreateModal('cafeowner', 'Create Cafe Owner')}>
                              Create Cafe Owner
                            </button>
                          </li>
                        )}
                        {isCafeOwner && (
                          <>
                            <li><hr className="dropdown-divider" /></li>
                            <li><span className="dropdown-item-text small text-muted">Create staff</span></li>
                            <li>
                              <button type="button" className="dropdown-item" onClick={() => openCreateModal('chef', 'Create Chef')}>
                                Create Chef
                              </button>
                            </li>
                            <li>
                              <button type="button" className="dropdown-item" onClick={() => openCreateModal('waiter', 'Create Waiter')}>
                                Create Waiter
                              </button>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  ) : (
                    <Link to="/account" className="nav-link py-0 d-flex align-items-center">
                      <i className="fas fa-user me-2 text-primary"></i>
                      {user?.name ?? user?.email ?? 'User'}
                    </Link>
                  )}
                </li>
              ) : (
                <li className="nav-item">
                  <Link to="/login" className="nav-link btn btn-book rounded-0 ms-lg-3">Sign In</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <CreateUserModal
        show={createModal.show}
        roleType={createModal.roleType}
        title={createModal.title}
        onClose={closeCreateModal}
        onSuccess={() => {}}
      />
    </>
  );
}

export default Navbar;
