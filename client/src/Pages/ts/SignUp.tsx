import { MutableRefObject, useRef, useState } from 'react';
import { useAuth } from '../../FirebaseAuthentication/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignUp.css';

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
    <div id="SignUp">
      {currentUser.email}
      <h2>Sign up</h2>
      {error}
      <br />
      <input ref={emailRef} type="email" placeholder="email" />
      <br />
      <input ref={passwordRef} type="password" placeholder="password" />
      <br />
      <input ref={confirmPasswordRef} type="password" placeholder="confirm password" />
      <br />
      <button onClick={handleSignUp} disabled={loading}>
        Submit
      </button>
      <br />
      <Link to="/SignIn"> Already have an account?</Link>
    </div>
  );
};

export default SignUp;
