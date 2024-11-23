import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/SmallComponents/Header';
import Login from './Pages/Login';
import Registration from './Pages/Registration'; // Include this if you have a Registration component
import Home from './Pages/Home'; // Example: a home component
import About from './Pages/About';
import Services from './Pages/Services';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* Your homepage component */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} /> {/* Optional for registration */}
        <Route path="/About" element={<About />} />
        <Route path="/Services" element={<Services />} />
      </Routes>
    </Router>
  );
}

export default App;