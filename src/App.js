import React, { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';
import ProfilePage from './pages/ProfilePage';
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
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
