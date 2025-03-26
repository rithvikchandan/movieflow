import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './screen/Login';
import Home from './screen/Home';
import Dash from './screen/Dash';
import Specific from './screen/Specific';
import WatchList from './screen/WatchList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/home" element={<Dash />} />
        <Route exact path="/movie/:id" element={<Specific />} />
        <Route exact path="/watchlist" element={<WatchList/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
