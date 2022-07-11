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
const App: FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <div id="App">
        <Navbar />
        <div id="home">
          <Routes>
            <Route path="*" element={<NotFound />}></Route>
            <Route path="/" element={<Home />} />
            <Route path="/User" element={<User />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Product/:productId" element={<ProductWebsiteTemplate />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  </BrowserRouter>
);

export default App;
