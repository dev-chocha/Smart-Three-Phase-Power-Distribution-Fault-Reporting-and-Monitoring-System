import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import ReportFault from './pages/ReportFault';
import MyFaults from './pages/MyFaults';
import AdminDashboard from './pages/AdminDashboard';
import AdminFaults from './pages/AdminFaults';
import AdminPowerTimetable from './pages/AdminPowerTimetable';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/citizen/dashboard'} replace />;
  }

  return children;
};

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Citizen Protected Routes */}
      <Route
        path="/citizen/dashboard"
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <CitizenDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/report-fault"
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <ReportFault />
          </ProtectedRoute>
        }
      />
      <Route
        path="/citizen/my-faults"
        element={
          <ProtectedRoute allowedRoles={['citizen']}>
            <MyFaults />
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faults"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminFaults />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/power-schedule"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPowerTimetable />
          </ProtectedRoute>
        }
      />

      {/* Default Fallback Redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default App;