import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../FirebaseAuthentication/AuthContext';

const User = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      logout();
      navigate('/SignIn');
    } catch {
      console.log('Something went wrong when trying to logout');
    }
  };
  return (
    <>
      <label>Email: {currentUser && currentUser.email}</label>
      <button onClick={handleLogout}> Logout</button>
    </>
  );
};

export default User;
