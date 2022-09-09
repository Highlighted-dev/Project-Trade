import React, { useState, useEffect, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';

var alertify = require('alertifyjs');

export type IAxiosErrorRestApi = AxiosError & {
  response: {
    data: {
      error: string;
      status: string;
      message: string;
    };
  };
};

export type IUser = {
  _id: string | null;
  username: string | null;
  email: string | null;
  birthdate: string | null;
  sex: string | null;
  role: string | null;
};

export const AuthContext = createContext<any>(null);
export const AuthProvider = (props: any) => {
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
    return await axios.get('/api/auth/isAuthenticated').then(async response => response.data);
  };
  // loadData loads data from api and sets it to the authState.
  const loadData = async () => {
    setLoading(true);
    isAuthenticated()
      .then(responseData => {
        if (responseData.isUserLoggedIn === false) {
          return;
        } else if (responseData.error) {
          console.log(responseData.error, responseData.message);
        } else {
          //If user is logged in(there is a cookie with token), set authState to user data
          setAuthState({
            _id: responseData.user._id,
            username: responseData.user.username,
            email: responseData.user.email,
            birthdate: responseData.user.birthdate,
            sex: responseData.user.sex,
            role: responseData.user.role,
          });
        }
        return responseData;
      })
      .catch(err => console.log(err))
      .then(() => {
        setLoading(false);
      });
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
      .then(responseData => {
        if (responseData.status === 'ok') {
          login(email, password);
        }
      });
  };

  // login logs user in and sets his data to the authState.
  const login = async (email: string, password: string) => {
    axios
      .post('/api/auth/login/', {
        email,
        password,
      })
      .then(response => response.data)
      .then(responseData => {
        if (responseData.isUserLoggedIn === true) {
          loadData();
          navigate('/');
        }
      })
      .catch((err: IAxiosErrorRestApi) => axiosErrorHandler(err));
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
        birthdate: null,
        sex: null,
        role: null,
      });
      navigate('/Login');
    }
  };
  const axiosErrorHandler = (err: IAxiosErrorRestApi) => {
    //If the request was made and the server responded.
    if (err.response) {
      alertify.error(err.response.data.message);
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
