import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext<any>(null);

export const AuthProvider = (props: any) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [authState, setAuthState] = useState({
    _id: null,
    username: null,
    email: null,
  });
  // isAuthenticated checks If user has a working token - If he has, he is authenticated so this function will return his data as a response.json().
  const isAuthenticated = async () => {
    return await fetch('/api/auth/isAuthenticated', {
      method: 'GET',
    })
      .then(res => res.json())
      .catch(err => console.log(err));
  };
  // loadData loads data from api and sets it to the authState.
  const loadData = async () => {
    setLoading(true);
    isAuthenticated()
      .then(data => {
        if (data.status == 'error') {
          console.log(data.message);
        } else {
          setAuthState({
            _id: data.user._id,
            username: data.user.username,
            email: data.user.email,
          });
        }
        return data;
      })
      .then(() => {
        setLoading(false);
      });
  };
  const register = async (username: string, email: string, password: string) => {
    const response = await fetch('/api/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
    });
    if (response.status == 200) {
      login(email, password);
    }
  };

  // login logs user in and sets his data to the authState.
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
    if (response.status == 200) {
      loadData();
      navigate('/');
    }
  };

  // logout logs user out and sets authState to null.
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

  const value = {
    authState,
    register,
    login,
    logout,
    loading,
  };
  return <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>;
};

export default AuthContext;
