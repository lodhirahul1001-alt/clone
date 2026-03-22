
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
const {user,isLoggedIn,authChecked,authLoading} = useSelector((state)=>state.auth);

  if (!authChecked || authLoading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
