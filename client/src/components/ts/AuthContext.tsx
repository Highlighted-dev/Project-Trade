import React, { useState, useEffect, createContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AuthContextType, IUser, IAxiosErrorRestApi } from '../../@types/AuthContext';

export const authContext = createContext<AuthContextType | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [authState, setAuthState] = useState<IUser>({
    _id: null,
    username: null,
    email: null,
    birthdate: null,
    sex: null,
    role: null,
  });
  // isAuthenticated checks If user has a working token - If he has, he is authenticated so this function will return his data as a response.json().
  const isAuthenticated = async () => {
    return axios.get('/api/auth/isAuthenticated').then(async response => response.data);
  };
  // loadData loads data from api and sets it to the authState.
  const loadData = async () => {
    setLoading(true);
    isAuthenticated()
      .then(response_data => {
        if (response_data.isUserLoggedIn === false) {
          return [];
        }
        if (response_data.error) {
          console.log(response_data.error, response_data.message);
          return [];
        }
        // If user is logged in(there is a cookie with token), set authState to user data
        setAuthState({
          _id: response_data.user._id,
          username: response_data.user.username,
          email: response_data.user.email,
          birthdate: response_data.user.birthdate,
          sex: response_data.user.sex,
          role: response_data.user.role,
        });
        return response_data;
      })
      .catch(err => console.log(err))
      .then(() => {
        setLoading(false);
      });
  };

  const axiosErrorHandler = (err: IAxiosErrorRestApi) => {
    // If the request was made and the server responded.
    if (err.response) {
      toast(err.response.data.message, { type: 'error' });
    }
  };

  // login logs user in and sets his data to the authState.
  const login = async (email: string, password: string) => {
    axios
      .post('/api/auth/login/', {
        email,
        password,
      })
      .then(response => response.data)
      .then(response_data => {
        if (response_data.isUserLoggedIn === true) {
          loadData();
          navigate('/');
        }
      })
      .catch((err: IAxiosErrorRestApi) => axiosErrorHandler(err));
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    birthdate: string,
    sex: string,
  ) => {
    axios
      .post('/api/auth/register/', {
        username,
        email,
        password,
        birthdate,
        sex,
      })
      .then(response => response.data)
      .then(response_data => {
        if (response_data.status === 'ok') {
          login(email, password);
        }
      });
  };

  // logout logs user out and sets authState to null.
  const logout = async () => {
    const response = await fetch('/api/auth/logout/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      setAuthState({
        _id: null,
        username: null,
        email: null,
        birthdate: null,
        sex: null,
        role: null,
      });
      navigate('/Login');
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  const values = useMemo(
    () => ({ authState, login, logout, register, loading, loadData }),
    [authState, loading],
  );
  return <authContext.Provider value={values}>{children}</authContext.Provider>;
}

export default AuthProvider;
