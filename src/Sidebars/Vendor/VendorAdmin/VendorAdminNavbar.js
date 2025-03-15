import React from 'react';
import { styled } from '@mui/material/styles';
import { AppBar, Toolbar, Typography, IconButton, Box, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';


const Navbar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer - 1,
  backgroundColor: '#0F1535', // Keep your existing background color
  backdropFilter: 'blur(10px)',
  WebkitBackdropFilter: 'blur(10px)',
}));

const NavbarIconButton = styled(IconButton)(({ theme }) => ({
  color: 'white', // Set icon color to white
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Add a hover effect
    borderRadius: '50%', // Make it circular on hover
  },
}));

const VendorAdminNavbar = ({ open, toggleDrawer, toggleTheme, isDarkMode, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/vendor-admin/logout`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
  
      if (response.status === 200 || response.status === 204) {
        console.log("Logout successful, redirecting...");
  
        // Clear session-related cookies
        Cookies.remove("vendorAdminSession"); // Remove token if stored in cookies
        localStorage.clear(); // Clear any local storage items
        sessionStorage.clear(); // Clear session storage
  
        // Ensure setIsLoggedIn exists before calling it
        if (typeof setIsLoggedIn === "function") {
          setIsLoggedIn(false);
        } else {
          console.warn("setIsLoggedIn is not available, proceeding with redirect.");
        }
  
        // Use React Router to navigate (avoids full page reload)
        navigate("/VendorAdminLogin");
      } else {
        console.error("Unexpected response status:", response.status);
        alert("Logout failed! Please try again.");
      }
    } catch (error) {
      console.error("Logout failed:", error.message || "Server error");
      alert("Logout error! Please check your internet connection.");
    }
  };
  
  
  

  return (
    <Navbar position="absolute">
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, color: 'white' }}>
          {/* Add your title or brand text here */}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <NavbarIconButton onClick={toggleTheme}>
            {isDarkMode ? (
              <img
                src={require('../../../Components/DarkMode/Sun.svg').default}
                alt="Light Mode"
                style={{ width: '24px', height: '24px' }}
              />
            ) : (
              <img
                src={require('../../../Components/DarkMode/Moon.svg').default}
                alt="Dark Mode"
                style={{ width: '24px', height: '24px' }}
              />
            )}
          </NavbarIconButton>
          <Tooltip title="Logout">
            <NavbarIconButton onClick={logout}>
              <LogoutIcon />
            </NavbarIconButton>
          </Tooltip>
          <NavbarIconButton
            onClick={toggleDrawer}
            aria-label="open drawer"
          >
            <MenuIcon />
          </NavbarIconButton>
        </Box>
      </Toolbar>
    </Navbar>
  );
};

export default VendorAdminNavbar;
