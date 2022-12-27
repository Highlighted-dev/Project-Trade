/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { MouseEventHandler, MutableRefObject, useContext, useRef, useState } from 'react';
import '../css/Settings.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContextType } from '../../@types/AuthContext';
import { authContext } from '../../components/ts/AuthContext';
import { RouteComponentProp } from '../../@types/Routes';

function Settings({ children }: RouteComponentProp) {
  return (
    <div id="Settings">
      <div id="SettingsContent">
        <div className="headerText">
          <h1>Settings</h1>
        </div>
        <div className="settingsNavBar">
          <ul>
            <Link to="/Settings/Account">
              <li
                className={
                  window.location.pathname === '/Settings/Account' ? 'selected' : undefined
                }
              >
                <span>Account</span>
              </li>
            </Link>
            <Link to="/Settings/Privacy">
              <li
                className={
                  window.location.pathname === '/Settings/Privacy' ? 'selected' : undefined
                }
              >
                <span>Privacy</span>
              </li>
            </Link>
            <Link to="/Settings/Notifications">
              <li
                className={
                  window.location.pathname === '/Settings/Notifications' ? 'selected' : undefined
                }
              >
                <span>Notifications</span>
              </li>
            </Link>
            <Link to="/Settings/Admin">
              <li
                className={window.location.pathname === '/Settings/Admin' ? 'selected' : undefined}
              >
                <span>Admin</span>
              </li>
            </Link>
          </ul>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Settings;
