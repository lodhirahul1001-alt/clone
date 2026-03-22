import React from "react";
import { Navigate, useLocation } from "react-router";
import { useSelector } from "react-redux";

// Protects admin-only pages inside /cms
export default function AdminRoute({ children }) {
  const { user, isLoggedIn, authChecked, authLoading } = useSelector((s) => s.auth);
  const location = useLocation();

  if (!authChecked || authLoading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/cms" replace />;
  }

  return children;
}
