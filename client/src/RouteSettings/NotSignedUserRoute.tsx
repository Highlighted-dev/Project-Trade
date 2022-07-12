import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../components/ts/AuthContext';

//If user isn't sign in, redirect him to signIn page
export default function PrivateRoute({ children }: any) {
  const [authState] = useContext(AuthContext);

  return authState._id ? <Navigate to="/" /> : children;
}
