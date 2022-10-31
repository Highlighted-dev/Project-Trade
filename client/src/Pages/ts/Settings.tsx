/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { MouseEventHandler, MutableRefObject, useContext, useRef, useState } from 'react';
import '../css/Settings.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContextType } from '../../@types/AuthContext';
import { authContext } from '../../components/ts/AuthContext';

const Settings = () => {
  const { authState } = useContext(authContext) as AuthContextType;
  const [currentPage, setCurrentPage] = useState('Account Settings');
  const emailRef = useRef() as MutableRefObject<HTMLInputElement>;
  const usernameRef = useRef() as MutableRefObject<HTMLInputElement>;
  const birthDateRef = useRef() as MutableRefObject<HTMLInputElement>;
  const toggleSelectedSetting: MouseEventHandler = setting => {
    // If there is any setting that has class '.selected', remove that class from it.
    const selectedSetting = document.querySelector('.selected');
    console.log(selectedSetting);
    if (selectedSetting) selectedSetting?.classList.toggle('selected');

    // Toggle clicked setting selected class
    (setting.target as HTMLTextAreaElement).classList.toggle('selected');
  };
  const updateUserData = () => {
    if (emailRef.current.value || usernameRef.current.value || birthDateRef.current.value) {
      axios.put('/api/auth/update', {
        _id: authState._id,
        email: emailRef.current.value ? emailRef.current.value : authState.email,
        username: usernameRef.current.value ? usernameRef.current.value : authState.username,
        birthdate: birthDateRef.current.value ? birthDateRef.current.value : authState.birthdate,
      });
    }
  };
  return (
    <div id="Settings">
      <div id="SettingsContent">
        <div className="headerText">
          <h1>Settings</h1>
        </div>
        <div className="settingsNavBar">
          <ul>
            <li className="selected" onClick={toggleSelectedSetting}>
              <Link to="/Settings/Account">Account</Link>
            </li>
            <li onClick={toggleSelectedSetting}>
              <Link to="/Settings/Privacy">Privacy</Link>
            </li>
            <li onClick={toggleSelectedSetting}>
              <Link to="/Settings/Notifications">Notifications</Link>
            </li>
            <li onClick={toggleSelectedSetting}>
              <Link to="/Settings/Admin">Admin</Link>
            </li>
          </ul>
        </div>
        <div id="AccountSettings">
          <div id="EditProfile">
            <div className="description">
              <h2>Edit Profile</h2>
              <span>
                Here you can edit profile data you provided when you created your account <br />{' '}
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
      </div>
    </div>
  );
};

export default Settings;
