import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

import Login from '../pages/Auth/Login';
import VerifyOtp from '../pages/Auth/VerifyOtp';
import GpsLocation from '../pages/Auth/GpsLocation';
import Dashboard from '../pages/Dashboard/Dashboard';

// Secure Route Node Guarding Wrapper
const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <option />
      <Route path="/" element={<Login />} />
      <Route path="/verify" element={<VerifyOtp />} />

      {/* Authenticated Engine Terminals */}
      <Route path="/location" element={<ProtectedRoute><GpsLocation /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Global Wildcard Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}