import React from 'react';
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import logo from '../../Assets/Logo/Kisaanstarlogo1.webp';

function Header() {
  return (
    <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#e3f2fd', padding: '0 10px' }}>
      <div className="container-fluid">
        {/* Logo */}
        <a className="navbar-brand" href="#">
          <img src={logo} alt="Logo" style={{ height: '60px', borderRadius: '20px' }} />
        </a>

        {/* Toggle Button */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
          {/* Navigation Links */}
          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/About">About Us</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/Services">Services</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Products</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="#">Contact Us</Link>
            </li>
            <li className="nav-item">
              <Link className="btn nav-link" to="/login">Login</Link>
            </li>
          </ul>
          {/* Search and Cart Icons */}
          <div className="d-flex align-items-center">
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <ShoppingCartIcon />
            </IconButton>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;
