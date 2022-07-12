import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../components/ts/AuthContext';
import '../css/User.css';
const User = () => {
  const [authState, setauthState, login, logout] = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      logout();
      navigate('/Login');
    } catch {
      console.log('Something went wrong when trying to logout');
    }
  };
  return (
    <div id="userPanel">
      <h1>Username: {authState.username}</h1>
      <h1>Email: {authState.email}</h1>
      <div id="userInformations">
        <button onClick={handleLogout}> Logout</button>
      </div>
    </div>
  );
};

export default User;
