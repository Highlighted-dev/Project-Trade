import React, { MutableRefObject, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../FirebaseAuthentication/AuthContext';
import '../css/SignUp.css';

const SignIn = () => {
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { signIn, currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const handleSignIn = async () => {
    setError(null);
    //If emailRef and passordRef aren't null
    if (emailRef.current && passwordRef.current) {
      try {
        setLoading(true);
        await signIn(emailRef.current.value, passwordRef.current.value);
      } catch {
        setError('Failed to sign in');
      }
    }
    setLoading(false);
  };
  return (
    <div id="SignUp">
      {currentUser.email}
      <h2>Sign in</h2>
      {error}

      <input ref={emailRef} type="email" placeholder="email" />
      <br />
      <input ref={passwordRef} type="password" placeholder="password" />
      <br />
      <button onClick={handleSignIn} disabled={loading}>
        Submit
      </button>
      <br />
      <Link to="/SignUp"> Create account</Link>
    </div>
  );
};

export default SignIn;
