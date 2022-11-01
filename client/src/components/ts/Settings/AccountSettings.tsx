import axios from 'axios';
import React, { MutableRefObject, useContext, useRef } from 'react';
// @ts-ignore
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { AuthContextType } from '../../../@types/AuthContext';
import { authContext } from '../AuthContext';
import '../../css/Settings/AccountSettings.css';

const AccountSettings = () => {
  const { authState, loadData } = useContext(authContext) as AuthContextType;
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const usernameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const birthDateRef = useRef() as MutableRefObject<HTMLInputElement>;

  const updateUserData = async () => {
    if (emailRef.current.value || usernameRef.current.value || birthDateRef.current.value) {
      await axios.put('/api/auth/update', {
        _id: authState._id,
        email: emailRef.current.value ? emailRef.current.value : authState.email,
        username: usernameRef.current.value ? usernameRef.current.value : authState.username,
        birthdate: birthDateRef.current.value ? birthDateRef.current.value : authState.birthdate,
      });
      loadData().then(() => {
        alertify.success('User data updated successfully!');
      });
    }
  };

  return (
    <div id="AccountSettings">
      <div id="EditProfile">
        <div className="description">
          <h2>Edit Profile</h2>
          <span>
            Here you can edit profile data you provided when you created your account <br />
            (username, email, birthdate). Password can be changed in Privacy tab.
          </span>
        </div>
        <div className="content">
          <div className="form">
            <div className="formItem">
              <div className="labelField">
                <label>Username</label>
              </div>
              <div className="inputField">
                <input
                  type="text"
                  ref={usernameRef}
                  placeholder={authState.username || 'username'}
                  required
                />
                <span />
                <label>{authState.username || 'username'}</label>
              </div>
            </div>
            <div className="formItem">
              <div className="labelField">
                <label>Email</label>
              </div>
              <div className="inputField">
                <input
                  type="text"
                  ref={emailRef}
                  placeholder={authState.email || 'email'}
                  required
                />
                <span />
                <label>{authState.email || 'email'}</label>
              </div>
            </div>
            <div className="formItem">
              <div className="labelField">
                <label>Birthdate</label>
              </div>
              <div className="inputField">
                <input type="date" ref={birthDateRef} required />
                <span />
                <label style={{ left: '6px' }}>{authState.birthdate}</label>
              </div>
            </div>
            <div className="formButton">
              <button type="submit" onClick={updateUserData}>
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="Preferences">
        <div className="description">
          <h2>Preferences</h2>
          <span>
            Here you can change your preferences. <br /> You can change your theme and language
            here.
          </span>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
