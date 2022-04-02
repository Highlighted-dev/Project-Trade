import React, { FC } from 'react';
import './index.css';
import './App.css';
import Navbar from './components/ts/Navbar';

const App: FC = () => {
  return (
    <div className="App">
      <Navbar />
      <div className="home">
        <h1>Hello, world</h1>
      </div>
    </div>
  );
};

export default App;
