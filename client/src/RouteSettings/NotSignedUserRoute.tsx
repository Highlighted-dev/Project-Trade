import { Navigate } from 'react-router-dom';
import { useAuth } from '../FirebaseAuthentication/AuthContext';

//If user isn't sign in, redirect him to signIn page
export default function PrivateRoute({ children }: any) {
  const { currentUser } = useAuth();

  return currentUser ? <Navigate to="/" /> : children;
}
