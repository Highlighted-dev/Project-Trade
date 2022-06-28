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
import SignedUserRoute from './RouteSettings/SignedUserRoute';
import NotSignedUserRoute from './RouteSettings/NotSignedUserRoute';
import NotFound from './Pages/ts/NotFound';
const App: FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <div id="App">
        <Navbar />
        <div id="home">
          <Routes>
            <Route path="*" element={<NotFound />}></Route>
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
              path="/SignUp"
              element={
                <NotSignedUserRoute>
                  <SignUp />
                </NotSignedUserRoute>
              }
            />
            <Route
              path="/SignIn"
              element={
                <NotSignedUserRoute>
                  <SignIn />
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
    </BrowserRouter>
  </AuthProvider>
);

export default App;
