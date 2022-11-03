/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { MouseEventHandler, MutableRefObject, useContext, useRef, useState } from 'react';
import '../css/Settings.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContextType } from '../../@types/AuthContext';
import { authContext } from '../../components/ts/AuthContext';
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
            <Link to="/Settings/Account">
              <li className="selected" onClick={toggleSelectedSetting}>
                <span>Account</span>
              </li>
            </Link>
            <Link to="/Settings/Privacy">
              <li onClick={toggleSelectedSetting}>
                <span>Privacy</span>
              </li>
            </Link>
            <Link to="/Settings/Notifications">
              <li onClick={toggleSelectedSetting}>
                <span>Notifications</span>
              </li>
            </Link>
            <Link to="/Settings/Admin">
              <li onClick={toggleSelectedSetting}>
                <span>Admin</span>
              </li>
            </Link>
          </ul>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Settings;
