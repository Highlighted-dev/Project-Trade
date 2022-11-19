import { MutableRefObject, useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authContext } from '../../components/ts/AuthContext';
import { AuthContextType } from '../../@types/AuthContext';
import '../css/SignPages.css';

function Login() {
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useContext(authContext) as AuthContextType;

  const validateSignIn = () => {
    if (!emailRef.current.value || !passwordRef.current.value) {
      toast('Email or password is not set', { type: 'error' });
      return false;
    }
    if (emailRef.current.value.length < 6 || passwordRef.current.value.length < 6) {
      toast('Email and password must be at least 6 characters long', { type: 'error' });
      return false;
    }
    return true;
  };

  const handleSignIn = async () => {
    if (validateSignIn()) {
      // If emailRef and passordRef aren't null
      if (emailRef.current && passwordRef.current) {
        setLoading(true);
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        login(email, password);
        setLoading(false);
      }
    }
  };

  return (
    <div id="SignPage">
      <h1>Login</h1>
      <div id="SignPageForm">
        <div className="inputField">
          <input ref={emailRef} id="Email" type="text" required />
          <span />
          <label htmlFor="Email">Email</label>
        </div>
        <div className="inputField">
          <input ref={passwordRef} id="Password" type="password" required />
          <span />
          <label htmlFor="Password">Password</label>
        </div>
        {
          // TODO Add forgot password method
        }
        <div id="forgotPassword">Forgot password?</div>
        <button type="submit" onClick={handleSignIn} disabled={loading}>
          Sign in
        </button>
        <br />
        <div id="createAccount">
          <Link to="/Register"> Create account</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
