import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { authContext } from '../components/ts/AuthContext';
import { AuthContextType } from '../@types/AuthContext';
import { RouteComponentProp } from '../@types/Routes';

// If user isn't sign in, redirect him to signIn page
function PrivateRoute({ children }: RouteComponentProp) {
  const { authState } = useContext(authContext) as AuthContextType;
  return authState._id ? <Navigate to="/" /> : children;
}
export default PrivateRoute;
