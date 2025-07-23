import React from 'react';
import { Navigate } from 'react-router-dom';
import '../index.css';
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Redirect if not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Redirect if role is not allowed
  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
