// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, children }) => {
  const userRole = localStorage.getItem("userRole");
  return userRole === role ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
