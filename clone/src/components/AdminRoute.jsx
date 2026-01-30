import React from "react";
import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";

// Protects admin-only pages inside /cms
export default function AdminRoute({ children }) {
  const { user, isLoggedIn } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/cms" replace />;
  }

  return children;
}
