import { MutableRefObject, useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authContext } from '../../components/ts/AuthContext';
import { AuthContextType } from '../../@types/AuthContext';
import '../css/SignPages.css';
import {
  doesPasswordMatch,
  doesPasswordHaveCapitalLetter,
  doesPasswordHaveNumber,
  isEmailValid,
  isBirthDateValid,
} from '../../utils/Validation';

const SignUp = () => {
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const confirmPasswordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const usernameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const birthDateRef = useRef() as MutableRefObject<HTMLInputElement>;
  const sexRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { register } = useContext(authContext) as AuthContextType;
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignUp = async () => {
    // If all input values aren't null
    if (
      emailRef.current.value &&
      passwordRef.current.value &&
      confirmPasswordRef.current.value &&
      usernameRef.current.value &&
      birthDateRef.current.value &&
      sexRef.current.value
    ) {
      const email = emailRef.current.value;
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;
      const confirm_password = confirmPasswordRef.current.value;
      const birthdate = birthDateRef.current.value;
      const sex = sexRef.current.value;
      if (!isEmailValid(email)) return toast('Email is not valid.', { type: 'error' });

      if (!doesPasswordMatch(password, confirm_password))
        return toast('Passwords do not match.', { type: 'error' });

      if (!doesPasswordHaveCapitalLetter(password))
        return toast('Password does not have an upper case letter.', { type: 'error' });

      if (!doesPasswordHaveNumber(password))
        return toast('Password does not have a number.', { type: 'error' });

      if (!isBirthDateValid(new Date('01-01-1900'), new Date(birthDateRef.current.value)))
        return toast('Your birtdate cannot be after 01-01-1900.', { type: 'error' });

      try {
        setLoading(true);
        register(username, email, password, birthdate, sex);
      } catch {
        toast('Failed to create an account', { type: 'error' });
      }
      setLoading(false);
      return toast('Regitration was succesfull.', { type: 'success' });
    }
    return toast('Please enter all the data', { type: 'error' });
  };

  return (
    <div id="SignPage">
      <h1>Register</h1>
      <div id="SignPageForm">
        <div className="inputField">
          <input ref={usernameRef} type="text" maxLength={28} required />
          <span />
          <label>Username</label>
        </div>
        <div className="inputField">
          <input ref={emailRef} type="text" maxLength={80} required />
          <span />
          <label>Email</label>
        </div>
        <div className="inputField">
          <input ref={passwordRef} type="password" maxLength={100} required />
          <span />
          <label>Password</label>
        </div>
        <div className="inputField">
          <input ref={confirmPasswordRef} type="password" maxLength={100} required />
          <span />
          <label>Confirm Password</label>
        </div>
        <div className="inputField inputFieldSpecial">
          <input ref={birthDateRef} type="date" required />
          <span />
          <label>Birthdate</label>
        </div>
        <div className="inputField ">
          <input ref={sexRef} type="text" maxLength={20} required />
          <span />
          <label>Sex</label>
        </div>
        <button type="submit" onClick={handleSignUp} disabled={loading}>
          Sign Up
        </button>
        <br />
        <div id="createAccount">
          <Link to="/Login"> Already have an account?</Link>
        </div>
      </div>
    </div>
  );
};
export default SignUp;
