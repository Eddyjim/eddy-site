import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Techie from './pages/Techie';
import Home from './pages/home/Home';
import React from 'react';


/**
 * Root Application component
 * @return {JSX.Element}
 * @constructor
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home/>}/>
        <Route path="developer" element={<Techie/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
