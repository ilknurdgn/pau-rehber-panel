import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar.js';
import Sidebar from './components/sidebar/Sidebar.js';
import Login from './pages/login/Login.js';
import Home from './pages/home/Home.js';

function Layout({ children }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Navbar />
        {children}
      </div>
    </div>
  );
}

function AppRoutes() {
  const location = useLocation();
  const isLogin = location.pathname === '/login';
  return isLogin ? (
    <Login />
  ) : (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Diğer route'lar buraya eklenebilir */}
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
