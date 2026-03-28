import React, { useEffect, useRef } from "react";
import { Navigate, useLocation } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { initAuth } from "../features/actions/AuthAction";

// Protects admin-only pages inside /cms
export default function AdminRoute({ children }) {
  const dispatch = useDispatch();
  const { user, isLoggedIn, authChecked, authLoading } = useSelector((s) => s.auth);
  const location = useLocation();
  const authRequestedRef = useRef(false);

  useEffect(() => {
    if (authRequestedRef.current || authChecked || authLoading) {
      return;
    }

    authRequestedRef.current = true;
    dispatch(initAuth());
  }, [authChecked, authLoading, dispatch]);

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
