import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage';
import UserList from './UserList';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import AdminBookingsPage from './pages/AdminBookingsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminLogsPage from './pages/AdminLogsPage';
import AdminCafesPage from './pages/AdminCafesPage';
import AdminCafeOwnersPage from './pages/AdminCafeOwnersPage';
import CafeOwnerDashboardPage from './pages/CafeOwnerDashboardPage';
import CafeOwnerStaffPage from './pages/CafeOwnerStaffPage';
import CafeOwnerSettingsPage from './pages/CafeOwnerSettingsPage';
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
import ChefDashboardPage from './pages/ChefDashboardPage';
import ChefOrdersPage from './pages/ChefOrdersPage';
import ChefOrderHistoryPage from './pages/ChefOrderHistoryPage';
import WaiterDashboardPage from './pages/WaiterDashboardPage';
import WaiterOrdersPage from './pages/WaiterOrdersPage';
import WaiterProfilePage from './pages/WaiterProfilePage';
import TestPage from './pages/TestPage';
// New ordering system pages
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import AdminDashboard from './pages/AdminDashboard';
import { CartProvider } from './contexts/CartContext';
import { authApi } from './api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => authApi.isLoggedIn());

  const onAuthChange = useCallback(() => {
    setIsLoggedIn(authApi.isLoggedIn());
  }, []);

  console.log('App component rendered, isLoggedIn:', isLoggedIn);

  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} />
        <main>
          <Routes>
            {/* Test route */}
            <Route path="/test" element={<TestPage />} />
            {/* Original homepage */}
            <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} />} />
            {/* New ordering system routes */}
            <Route path="/ordering" element={<MenuPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/orders" element={<OrderHistoryPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Existing routes */}
            <Route path="/home" element={<HomePage isLoggedIn={isLoggedIn} />} />
            <Route path="/login" element={<LoginPage onAuthChange={onAuthChange} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/register" element={<RegisterPage onAuthChange={onAuthChange} />} />
            <Route path="/account" element={<AccountPage onAuthChange={onAuthChange} />} />
            <Route path="/profile" element={<ProfilePage onAuthChange={onAuthChange} />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage onAuthChange={onAuthChange} />} />
            <Route path="/admin/analytics" element={<AdminAnalyticsPage onAuthChange={onAuthChange} />} />
            <Route path="/admin/reports" element={<AdminReportsPage onAuthChange={onAuthChange} />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage onAuthChange={onAuthChange} />} />
            <Route path="/admin/orders" element={<AdminOrdersPage onAuthChange={onAuthChange} />} />
            <Route path="/admin/settings" element={<AdminSettingsPage onAuthChange={onAuthChange} />} />
            <Route path="/admin/logs" element={<AdminLogsPage onAuthChange={onAuthChange} />} />
            <Route path="/admin/cafes" element={<AdminCafesPage onAuthChange={onAuthChange} />} />
            <Route path="/admin/users" element={<UserList />} />
            <Route path="/admin/cafeowners" element={<AdminCafeOwnersPage onAuthChange={onAuthChange} />} />
            <Route path="/cafeowner/dashboard" element={<CafeOwnerDashboardPage onAuthChange={onAuthChange} />} />
            <Route path="/cafeowner/staff" element={<CafeOwnerStaffPage onAuthChange={onAuthChange} />} />
            <Route path="/cafeowner/settings" element={<CafeOwnerSettingsPage onAuthChange={onAuthChange} />} />
            <Route path="/cafeowner/menu" element={<CafeOwnerMenuPage onAuthChange={onAuthChange} />} />
            <Route path="/cafeowner/tables" element={<CafeOwnerTablesPage onAuthChange={onAuthChange} />} />
            <Route path="/cafeowner/bookings" element={<CafeOwnerBookingsPage onAuthChange={onAuthChange} />} />
            <Route path="/cafeowner/orders" element={<CafeOwnerOrdersPage onAuthChange={onAuthChange} />} />
            <Route path="/cafeowner/orders/:id" element={<CafeOwnerOrderDetailPage onAuthChange={onAuthChange} />} />
            <Route path="/cafes" element={<CafesPage onAuthChange={onAuthChange} />} />
            <Route path="/cafes/:id" element={<CafeDetailPage onAuthChange={onAuthChange} />} />
            <Route path="/bookings" element={<BookingsPage onAuthChange={onAuthChange} />} />
            <Route path="/my-orders" element={<OrdersPage onAuthChange={onAuthChange} />} />
            <Route path="/orders/:id" element={<OrderDetailPage onAuthChange={onAuthChange} />} />
            <Route path="/chef/dashboard" element={<ChefDashboardPage onAuthChange={onAuthChange} />} />
            <Route path="/chef/orders" element={<ChefOrdersPage onAuthChange={onAuthChange} />} />
            <Route path="/chef/order-history" element={<ChefOrderHistoryPage onAuthChange={onAuthChange} />} />
            <Route path="/waiter/dashboard" element={<WaiterDashboardPage onAuthChange={onAuthChange} />} />
            <Route path="/waiter/orders" element={<WaiterOrdersPage onAuthChange={onAuthChange} />} />
            <Route path="/waiter/profile" element={<WaiterProfilePage onAuthChange={onAuthChange} />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
