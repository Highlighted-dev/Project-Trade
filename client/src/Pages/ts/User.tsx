import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/User.css';
const User = () => {
  // const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      // logout();
      navigate('/SignIn');
    } catch {
      console.log('Something went wrong when trying to logout');
    }
  };
  return (
    <div id="userPanel">
      {/* <h1>Email: {currentUser && currentUser.email}</h1> */}
      <div id="userInformations">{/* <button onClick={handleLogout}> Logout</button> */}</div>
    </div>
  );
};

export default User;
