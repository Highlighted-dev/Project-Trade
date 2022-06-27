import { MutableRefObject, useRef, useState } from 'react';
import { useAuth } from '../../FirebaseAuthentication/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignPages.css';

const SignUp = () => {
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const confirmPasswordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { signUp, currentUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleSignUp = async () => {
    setError(null);
    //If emailRef and passordRef aren't null
    if (emailRef.current && passwordRef.current) {
      if (passwordRef.current.value != confirmPasswordRef.current.value) {
        return setError('Password do not match');
      } else {
        try {
          setLoading(true);
          await signUp(emailRef.current.value, passwordRef.current.value);
          navigate('/');
        } catch {
          setError('Failed to create an account');
        }
      }
      setLoading(false);
    }
  };
  return (
    <div id="SignPage">
      <h1>Sign Up</h1>
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
        <div className="inputField">
          <input ref={confirmPasswordRef} type="password" required />
          <span></span>
          <label>Confirm Password</label>
        </div>
        <button onClick={handleSignUp} disabled={loading}>
          Sign Up
        </button>
        <br />
        <div id="createAccount">
          <Link to="/SignIn"> Already have an account?</Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
