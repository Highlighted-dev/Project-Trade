/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { MouseEventHandler, MutableRefObject, useContext, useRef, useState } from 'react';
import '../css/Settings.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
// @ts-ignore
import alertify from 'alertifyjs';
import 'alertifyjs/build/css/alertify.css';
import { AuthContextType } from '../../@types/AuthContext';
import { authContext } from '../../components/ts/AuthContext';
import AccountSettings from '../../components/ts/Settings/AccountSettings';
import { RouteComponentProp } from '../../@types/Routes';

const Settings = ({ children }: RouteComponentProp) => {
  const { authState, loadData } = useContext(authContext) as AuthContextType;
  const [currentPage, setCurrentPage] = useState('Account Settings');
  const toggleSelectedSetting: MouseEventHandler = setting => {
    // If there is any setting that has class '.selected', remove that class from it.
    const selectedSetting = document.querySelector('.selected');
    if (selectedSetting) selectedSetting?.classList.toggle('selected');

    // Toggle clicked setting selected class
    (setting.target as HTMLTextAreaElement).classList.toggle('selected');
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
        {children}
      </div>
    </div>
  );
};

export default Settings;
