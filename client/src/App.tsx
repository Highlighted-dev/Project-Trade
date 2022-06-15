import React, { FC } from 'react';
import './App.css';
import Navbar from './components/ts/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductWebsiteTemplate from './Pages/ts/ProductPageTemplate';
import Home from './Pages/ts/Home';
const App: FC = () => (
  <div className="App">
    <BrowserRouter>
      <Navbar />
      <div id="home">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Product/:productId" element={<ProductWebsiteTemplate />} />
        </Routes>
      </div>
    </BrowserRouter>
  </div>
);

export default App;
