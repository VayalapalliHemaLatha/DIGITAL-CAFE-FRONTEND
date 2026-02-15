import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminCafesPage from './pages/AdminCafesPage';
import AdminCafeOwnersPage from './pages/AdminCafeOwnersPage';
import CafeOwnerStaffPage from './pages/CafeOwnerStaffPage';
import CafeOwnerMenuPage from './pages/CafeOwnerMenuPage';
import CafeOwnerTablesPage from './pages/CafeOwnerTablesPage';
import CafeOwnerBookingsPage from './pages/CafeOwnerBookingsPage';
import CafeOwnerOrdersPage from './pages/CafeOwnerOrdersPage';
import CafeOwnerOrderDetailPage from './pages/CafeOwnerOrderDetailPage';
import CafesPage from './pages/CafesPage';
import CafeDetailPage from './pages/CafeDetailPage';
import BookingsPage from './pages/BookingsPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ChefOrdersPage from './pages/ChefOrdersPage';
import WaiterOrdersPage from './pages/WaiterOrdersPage';
import { authApi } from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => authApi.isLoggedIn());

  const onAuthChange = useCallback(() => {
    setIsLoggedIn(authApi.isLoggedIn());
  }, []);

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<LoginPage onAuthChange={onAuthChange} />} />
          <Route path="/register" element={<RegisterPage onAuthChange={onAuthChange} />} />
          <Route path="/account" element={<AccountPage onAuthChange={onAuthChange} />} />
          <Route path="/profile" element={<ProfilePage onAuthChange={onAuthChange} />} />
          <Route path="/admin/dashboard" element={<AdminDashboardPage onAuthChange={onAuthChange} />} />
          <Route path="/admin/cafes" element={<AdminCafesPage onAuthChange={onAuthChange} />} />
          <Route path="/admin/cafeowners" element={<AdminCafeOwnersPage onAuthChange={onAuthChange} />} />
          <Route path="/cafeowner/staff" element={<CafeOwnerStaffPage onAuthChange={onAuthChange} />} />
          <Route path="/cafeowner/menu" element={<CafeOwnerMenuPage onAuthChange={onAuthChange} />} />
          <Route path="/cafeowner/tables" element={<CafeOwnerTablesPage onAuthChange={onAuthChange} />} />
          <Route path="/cafeowner/bookings" element={<CafeOwnerBookingsPage onAuthChange={onAuthChange} />} />
          <Route path="/cafeowner/orders" element={<CafeOwnerOrdersPage onAuthChange={onAuthChange} />} />
          <Route path="/cafeowner/orders/:id" element={<CafeOwnerOrderDetailPage onAuthChange={onAuthChange} />} />
          <Route path="/cafes" element={<CafesPage onAuthChange={onAuthChange} />} />
          <Route path="/cafes/:id" element={<CafeDetailPage onAuthChange={onAuthChange} />} />
          <Route path="/bookings" element={<BookingsPage onAuthChange={onAuthChange} />} />
          <Route path="/orders" element={<OrdersPage onAuthChange={onAuthChange} />} />
          <Route path="/orders/:id" element={<OrderDetailPage onAuthChange={onAuthChange} />} />
          <Route path="/chef/orders" element={<ChefOrdersPage onAuthChange={onAuthChange} />} />
          <Route path="/waiter/orders" element={<WaiterOrdersPage onAuthChange={onAuthChange} />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
