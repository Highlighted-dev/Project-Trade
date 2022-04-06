import React, { FC } from 'react';
import './index.css';
import './App.css';
import Navbar from './components/ts/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProductWebsiteTemplate from './Pages/ProductPageTemplate';
import Home from './Pages/Home';
const App: FC = () => (
  <div className="App">
    <BrowserRouter>
      <Navbar />
      <div className="home">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Product/:productId" element={<ProductWebsiteTemplate />} />
        </Routes>
      </div>
    </BrowserRouter>
  </div>
);

export default App;
