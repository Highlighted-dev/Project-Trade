import { MutableRefObject, useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
// @ts-ignore
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { AuthContext } from '../../components/ts/AuthContext';
import { AuthContextType } from '../../@types/AuthContext';
import '../css/SignPages.css';

const SignUp = () => {
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const passwordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const confirmPasswordRef = useRef() as MutableRefObject<HTMLInputElement>;
  const usernameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const birthDateRef = useRef() as MutableRefObject<HTMLInputElement>;
  const sexRef = useRef() as MutableRefObject<HTMLInputElement>;
  const { register } = useContext(AuthContext) as AuthContextType;
  const [loading, setLoading] = useState<boolean>(false);

  const doesPasswordMatch = () => {
    // If password and confirm password are equal
    if (passwordRef.current.value === confirmPasswordRef.current.value) return true;
    return false;
  };

  const doesPasswordHaveCapitalLetter = () => {
    // Check if there is any uppercase letter in password. If there is not, return error
    if (/[A-Z]/.test(passwordRef.current.value)) return true;
    return false;
  };

  const doesPasswordHaveNumber = () => {
    // Check if there is any number in password. If there is not, return error
    if (/[1-9]/.test(passwordRef.current.value)) return true;
    return false;
  };

  const isEmailValid = () => {
    // Regular Expression validating email with rfc822 standard. If email is not valid, return error. Examples:
    // asdkladlkaslkaslk  /Not valid
    // test.com  /Not valid
    // test@test  /Not valid
    // test@test.com   /Valid
    if (
      // eslint-disable-next-line no-control-regex
      /^([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x22([^\x0d\x22\x5c\x80-\xff]|\x5c[\x00-\x7f])*\x22))*\x40([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d)(\x2e([^\x00-\x20\x22\x28\x29\x2c\x2e\x3a-\x3c\x3e\x40\x5b-\x5d\x7f-\xff]+|\x5b([^\x0d\x5b-\x5d\x80-\xff]|\x5c[\x00-\x7f])*\x5d))*(\.\w{2,})+$/.test(
        emailRef.current.value,
      )
    )
      return true;
    return false;
  };

  const isBirthDateValid = (sample_birth_date: Date) => {
    if (new Date(birthDateRef.current.value) > sample_birth_date) return true;
    return false;
  };

  const handleSignUp = async () => {
    // If all input values aren't null
    if (
      emailRef.current.value &&
      passwordRef.current.value &&
      usernameRef.current.value &&
      birthDateRef.current.value &&
      sexRef.current.value
    ) {
      if (!isEmailValid()) return alertify.error('Email is not valid.');

      if (!doesPasswordMatch()) return alertify.error('Passwords do not match.');

      if (!doesPasswordHaveCapitalLetter())
        return alertify.error('Password does not have an upper case letter.');

      if (!doesPasswordHaveNumber()) return alertify.error('Password does not have a number.');

      if (!isBirthDateValid(new Date('01-01-1900')))
        return alertify.error('Your birtdate cannot be after 01-01-1900.');

      try {
        setLoading(true);
        const email = emailRef.current.value;
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const birthdate = birthDateRef.current.value;
        const sex = sexRef.current.value;
        register(username, email, password, birthdate, sex);
      } catch {
        alertify.error('Failed to create an account');
      }
      setLoading(false);
      return alertify.success('Regitration was succesfull.');
    }
    return alertify.error('Please enter all the data');
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
