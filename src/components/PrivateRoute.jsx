import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { initAuth } from "../features/actions/AuthAction";

const PrivateRoute = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const authRequestedRef = useRef(false);
  const { user, isLoggedIn, authChecked, authLoading } = useSelector(
    (state) => state.auth
  );

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
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
