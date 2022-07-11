import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/SignPages.css';

const SignUp = () => {
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const confirmPasswordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const usernameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const doesPasswordMatch = () => {
    //If password and confirm password are equal
    if (passwordRef.current.value == confirmPasswordRef.current.value) return true;
    return false;
  };

  const doesPasswordHaveCapitalLetter = () => {
    //Check if there is any uppercase letter in password. If there is not, return error
    if (/[A-Z]/.test(passwordRef.current.value)) return true;
    return false;
  };

  const doesPasswordHaveNumber = () => {
    //Check if there is any number in password. If there is not, return error
    if (/[1-9]/.test(passwordRef.current.value)) return true;
    return false;
  };

  const isEmailValid = () => {
    //Regular Expression validating email with rfc822 standard. If email is not valid, return error. Examples:
    // asdkladlkaslkaslk  /Not valid
    // test.com  /Not valid
    // test@test  /Not valid
    // test@test.com   /Valid
    if (
      /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(
        emailRef.current.value,
      )
    )
      return true;
    return false;
  };

  const handleSignUp = async () => {
    setError(null);
    //If emailRef and passordRef aren't null
    if (emailRef.current && passwordRef.current) {
      if (!doesPasswordMatch()) {
        return setError('Passwords do not match.');
      } else if (!doesPasswordHaveCapitalLetter()) {
        return setError('Password does not have an upper case letter.');
      } else if (!doesPasswordHaveNumber()) {
        return setError('Password does not have a number.');
      } else if (!isEmailValid()) {
        return setError('Email is not valid.');
      } else {
        try {
          setLoading(true);
          const email = emailRef.current.value;
          const username = usernameRef.current.value;
          const password = passwordRef.current.value;
          const response = await fetch('/api/auth/register/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              email,
              password,
            }),
          });
          const data = await response.json();
          console.log(data);
          //navigate('/');
        } catch {
          setError('Failed to create an account');
        }
      }
      setLoading(false);
    }
  };

  return (
    <div id="SignPage">
      <h1>Register</h1>
      <div className={error ? 'bar active' : 'bar'}>{error}</div>
      <div id="SignPageForm">
        <div className="inputField">
          <input ref={usernameRef} type="text" maxLength={28} required />
          <span></span>
          <label>Username</label>
        </div>
        <div className="inputField">
          <input ref={emailRef} type="text" maxLength={80} required />
          <span></span>
          <label>Email</label>
        </div>
        <div className="inputField">
          <input ref={passwordRef} type="password" maxLength={100} required />
          <span></span>
          <label>Password</label>
        </div>
        <div className="inputField">
          <input ref={confirmPasswordRef} type="password" maxLength={100} required />
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
