import React, { FC } from 'react';
import './App.css';
import Navbar from './components/ts/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductWebsiteTemplate from './Pages/ts/ProductPageTemplate';
import Home from './Pages/ts/Home';
import User from './Pages/ts/User';
import SignUp from './Pages/ts/SignUp';
import { AuthProvider } from './FirebaseAuthentication/AuthContext';
import SignIn from './Pages/ts/SignIn';
import PrivateRoute from './PrivateRoute';
const App: FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <div id="App">
        <Navbar />
        <div id="home">
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/User"
              element={
                <PrivateRoute>
                  <User />
                </PrivateRoute>
              }
            />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/SignIn" element={<SignIn />} />
            <Route
              path="/Product/:productId"
              element={
                <PrivateRoute>
                  <ProductWebsiteTemplate />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
