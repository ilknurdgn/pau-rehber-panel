// src/App.js
import React from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import './App.css';


import Navbar from './components/navbar/Navbar.js';
import Sidebar from './components/sidebar/Sidebar.js';
import Login from './pages/login/Login.js';
import Home from './pages/home/Home.js';
import UserList from './pages/users/UserList.js';
import SuperAdminList from './pages/superAdmins/SuperAdminList.js';
import SupportAdminList from './pages/supportAdmins/SupportAdminList.js';
import GenericDetail from './pages/detail/GenericDetail.js';
import FacultyList from'./pages/faculty/FacultyList.js';
import ForgotPassword from './pages/forgotPassword/ForgotPassword.js';

const originalFetch = window.fetch;

window.fetch = async (input, init = {}) => {
 
  const urlString = typeof input === 'string' ? input : input.url;
  const url = new URL(urlString, window.location.origin);
  const path = url.pathname;  // örn. "/api/auth/login"

 
  const publicPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/forgot-password'
  ];

  
  const headers = { ...(init.headers || {}) };

  
  if (!publicPaths.includes(path)) {
    const token = localStorage.getItem('token');
    if (token) headers.Authorization = `Bearer ${token}`;
  }


  const response = await originalFetch(input, { ...init, headers });

 
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    
    return new Promise(() => {});
  }

  return response;
};


function isTokenValid() {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000 > Date.now();
  } catch {
    return false;
  }
}


function PrivateRoute({ children }) {
  return isTokenValid() ? children : <Navigate to="/login" replace />;
}

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function ProtectedLayout() {
  return (
    <PrivateRoute>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1 }}>
          <Navbar />
          <Outlet />
        </div>
      </div>
    </PrivateRoute>
  );
}


export default function App() {
  return (
    <Router>
  <Routes>

    {/* 🔓 Public Routes (sadece Navbar) */}
    <Route element={<PublicLayout />}>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Route>

    {/* 🔐 Protected Routes (Navbar + Sidebar) */}
    <Route element={<ProtectedLayout />}>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<UserList />} />
      <Route path="/superadmins" element={<SuperAdminList />} />
      <Route path="/supportadmins" element={<SupportAdminList />} />
      <Route path="/users/:id" element={<GenericDetail />} />
      <Route path="/faculties" element={<FacultyList />} />
      <Route path="/faculties/:id" element={<GenericDetail />} />
    </Route>

    {/* Her şeyi yakalayıp ana sayfaya yönlendir */}
    <Route path="*" element={<Navigate to="/" replace />} />

  </Routes>
</Router>

  );
}
