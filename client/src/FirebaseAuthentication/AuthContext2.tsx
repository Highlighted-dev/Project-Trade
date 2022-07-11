import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
export const AuthContext2 = createContext<any>(null);

export const AuthProvider2 = (props: any) => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState({
    _id: null,
    username: null,
    email: null,
  });
  const isAuthenticated = async () => {
    return await fetch('/api/auth/isAuth', {
      method: 'GET',
    })
      .then(res => res.json())
      .catch(err => console.log(err));
  };
  const loadData = () => {
    isAuthenticated().then(data => {
      if (data.error) {
        console.log(data.error);
        navigate('/Login');
      } else {
        setAuthState({
          _id: data.user._id,
          username: data.user.username,
          email: data.user.email,
        });
        console.log('Welcome back, ' + data.user.username);
      }
    });
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await response.json();
    if (response.status == 200) {
      loadData();
    }
  };
  const logout = async () => {
    const response = await fetch('/api/auth/logout/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status == 200) {
      setAuthState({
        _id: null,
        username: null,
        email: null,
      });
      navigate('/Login');
    }
  };
  useEffect(() => {
    loadData();
  }, []);
  return (
    <AuthContext2.Provider value={[authState, setAuthState, login, logout]}>
      {props.children}
    </AuthContext2.Provider>
  );
};

export default AuthContext2;
