import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import './components/css/Modal.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Navbar from './components/ts/Navbar';
import ProductPageTemplate from './Pages/ts/ProductPageTemplate';
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
import AccountSettings from './components/ts/Settings/AccountSettings';
import AdminSettings from './components/ts/Settings/AdminSettings';
import Modal from './components/ts/Modal/Modal';
import ModalProvider from './components/ts/Modal/ModalProvider';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <Modal />
          <div id="App">
            <ToastContainer
              progressClassName="toastProgress"
              bodyClassName="toastBody"
              closeButton={false}
              position="bottom-right"
              autoClose={3000}
              theme="colored"
            />
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
                <Route path="/Settings" element={<Navigate to="/Settings/Account" />} />
                <Route
                  path="/Settings/Account"
                  element={
                    <SignedUserRoute>
                      <Settings>
                        <AccountSettings />
                      </Settings>
                    </SignedUserRoute>
                  }
                />
                <Route
                  path="/Settings/Admin"
                  element={
                    <SignedUserRoute>
                      <Settings>
                        <AdminSettings />
                      </Settings>
                    </SignedUserRoute>
                  }
                />
                <Route
                  path="/Product/:product_id"
                  element={
                    <SignedUserRoute>
                      <ProductPageTemplate />
                    </SignedUserRoute>
                  }
                />
              </Routes>
            </div>
          </div>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
