import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import MainLayout from './components/layout/MainLayout';
import Login from './components/auth/Login';
import Register from './components/auth/Register'; 
import AdminDashboard from './components/admin/AdminDashboard';
import FraudAppManager from './components/admin/FraudAppManager';
import FraudUrlManager from './components/admin/FraudUrlManager';
import UserManager from './components/admin/UserManager';
import UserDashboard from './components/user/UserDashboard';

// Route Guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen"><div>Loading...</div></div>;
  return isAuthenticated ? <MainLayout>{children}</MainLayout> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex justify-center items-center h-screen"><div>Loading...</div></div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  return user.role === 'admin' ? <MainLayout>{children}</MainLayout> : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 2000 }} />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} /> {/* ADDED */}
          
          <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
          
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/apps" element={<AdminRoute><FraudAppManager /></AdminRoute>} />
          <Route path="/admin/urls" element={<AdminRoute><FraudUrlManager /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManager /></AdminRoute>} />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<div className="p-8"><h1>404 Not Found</h1></div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;