import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import Navbar from './components/navbar/Navbar.js';
import Sidebar from './components/sidebar/Sidebar.js';
import Login from './pages/login/Login.js';
import Home from './pages/home/Home.js';
import UserList from './pages/users/UserList.js';
import SuperAdminList from './pages/superAdmins/SuperAdminList.js';
import SupportAdminList from './pages/supportAdmins/SupportAdminList.js';
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
      <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/superadmins" element={<SuperAdminList />} />
        <Route path="/supportadmins" element={<SupportAdminList />} />
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
