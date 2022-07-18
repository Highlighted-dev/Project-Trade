import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../components/ts/AuthContext';

//If user isn't sign in, redirect him to signIn page
export default function PrivateRoute({ children }: any) {
  const { authState, loading } = useContext(AuthContext);

  return authState._id && !loading
    ? children
    : //Every time user refreshes the page, AuthContext valides him. Sometimes there is a 1ms delay (becouse of thatuser will see login page popup),
      //so we use setTimeout to wait 1ms before redirecting him to login page
      setTimeout(function () {
        <Navigate to="/Login" />;
      }, 1);
}
