import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/ts/Navbar';
import ProductWebsiteTemplate from './Pages/ts/ProductPageTemplate';
import Home from './Pages/ts/Home';
import User from './Pages/ts/User';
import NotFound from './Pages/ts/NotFound';
import Register from './Pages/ts/Register';
import Login from './Pages/ts/Login';
import AuthProvider from './components/ts/AuthContext';
import SignedUserRoute from './RouteSettings/SignedUserRoute';
import NotSignedUserRoute from './RouteSettings/NotSignedUserRoute';
import Favourites from './Pages/ts/Favourites';
import Settings from './Pages/ts/Settings';

const App = () => {
  return (
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
              />
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
                path="/Favourites"
                element={
                  <SignedUserRoute>
                    <Favourites />
                  </SignedUserRoute>
                }
              />
              <Route
                path="/Settings"
                element={
                  <SignedUserRoute>
                    <Settings />
                  </SignedUserRoute>
                }
              />
              <Route
                path="/Product/:product_id"
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
};

export default App;
