import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAdminAuthenticated");

  if (!isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default ProtectedRoute;
