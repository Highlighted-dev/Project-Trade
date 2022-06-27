import React, { MutableRefObject, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../FirebaseAuthentication/AuthContext';
import '../css/SignPages.css';

const SignIn = () => {
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { signIn, currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleSignIn = async () => {
    setError(null);
    //If emailRef and passordRef aren't null
    if (emailRef.current && passwordRef.current) {
      try {
        setLoading(true);
        await signIn(emailRef.current.value, passwordRef.current.value);
        navigate('/');
      } catch {
        setError('Failed to sign in');
      }
    }
    setLoading(false);
  };
  return (
    <div id="SignPage">
      <h1>Sign in</h1>
      {error}
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
          <Link to="/SignUp"> Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
