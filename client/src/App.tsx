import React, { FC } from 'react';
import './App.css';
import Navbar from './components/ts/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductWebsiteTemplate from './Pages/ts/ProductPageTemplate';
import Home from './Pages/ts/Home';
import User from './Pages/ts/User';
import NotFound from './Pages/ts/NotFound';
import Register from './Pages/ts/Register';
import Login from './Pages/ts/Login';
import { AuthProvider } from './components/ts/AuthContext';
import SignedUserRoute from './RouteSettings/SignedUserRoute';
import NotSignedUserRoute from './RouteSettings/NotSignedUserRoute';
const App: FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <div id="App">
        <Navbar />
        <div id="home">
          <Routes>
            <Route
              path="*"
              element={
                <SignedUserRoute>
                  <NotFound />
                </SignedUserRoute>
              }
            ></Route>
            <Route
              path="/"
              element={
                <SignedUserRoute>
                  <Home />
                </SignedUserRoute>
              }
            />
            <Route
              path="/User"
              element={
                <SignedUserRoute>
                  <User />
                </SignedUserRoute>
              }
            />
            <Route
              path="/Register"
              element={
                <NotSignedUserRoute>
                  <Register />
                </NotSignedUserRoute>
              }
            />
            <Route
              path="/Login"
              element={
                <NotSignedUserRoute>
                  <Login />
                </NotSignedUserRoute>
              }
            />
            <Route
              path="/Product/:productId"
              element={
                <SignedUserRoute>
                  <ProductWebsiteTemplate />
                </SignedUserRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
