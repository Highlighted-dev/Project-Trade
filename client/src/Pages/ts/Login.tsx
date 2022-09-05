import { MutableRefObject, useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignPages.css';
import { AuthContext } from '../../components/ts/AuthContext';

var alertify = require('alertifyjs');

const Login = () => {
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useContext(AuthContext);

  const handleSignIn = async () => {
    if (validateSignIn()) {
      //If emailRef and passordRef aren't null
      if (emailRef.current && passwordRef.current) {
        setLoading(true);
        const email = emailRef.current.value;
        const password = passwordRef.current.value;
        login(email, password);
        setLoading(false);
      }
    }
  };

  const validateSignIn = () => {
    if (!emailRef.current.value || !passwordRef.current.value) {
      alertify.error('Email or password is not set');
      return false;
    }
    if (emailRef.current.value.length < 6 || passwordRef.current.value.length < 6) {
      alertify.error('Email and password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  return (
    <div id="SignPage">
      <h1>Login</h1>
      <div id="SignPageForm">
        <div className="inputField">
          <input ref={emailRef} type="text" required />
          <span></span>
          <label>Email</label>
        </div>
        <div className="inputField">
          <input ref={passwordRef} type="password" required />
          <span></span>
          <label>Password</label>
        </div>
        {
          //TODO Add forgot password method
        }
        <div id="forgotPassword">Forgot password?</div>
        <button onClick={handleSignIn} disabled={loading}>
          Sign in
        </button>
        <br />
        <div id="createAccount">
          <Link to="/Register"> Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
