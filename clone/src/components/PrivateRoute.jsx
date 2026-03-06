
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router';

const PrivateRoute = ({ children }) => {
const {user,isLoggedIn} = useSelector((state)=>state.auth);
  // if (loading) {
  //   return <div className="text-center mt-10 text-lg">Loading...</div>;
  // }

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
