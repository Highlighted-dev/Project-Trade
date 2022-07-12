import { MutableRefObject, useContext, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignPages.css';
import { AuthContext } from '../../components/ts/AuthContext';

const Login = () => {
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleSignIn = async () => {
    setError(null);
    //If emailRef and passordRef aren't null
    if (emailRef.current && passwordRef.current) {
      setLoading(true);
      const email = emailRef.current.value;
      const password = passwordRef.current.value;
      login(email, password);
      setLoading(false);
    }
  };

  return (
    <div id="SignPage">
      <h1>Login</h1>
      <div className={error ? 'bar active' : 'bar'}>{error}</div>
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
