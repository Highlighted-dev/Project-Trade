import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../components/ts/AuthContext';
import { AuthContextType } from '../@types/AuthContext';
import { RouteComponentProp } from '../@types/Routes';

// If user isn't sign in, redirect him to signIn page
const PrivateRoute = ({ children }: RouteComponentProp) => {
  const { authState, loading } = useContext(AuthContext) as AuthContextType;
  return authState._id || loading ? children : <Navigate to="/Login" />;
};
export default PrivateRoute;
