import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person'; // Personal Details Icon
import ListAltIcon from '@mui/icons-material/ListAlt'; // Orders Icon
import GrassIcon from '@mui/icons-material/Grass'; // Using Grass icon for Farming Details
import FavoriteIcon from '@mui/icons-material/Favorite'; // Wishlist Icon
import LocationOnIcon from '@mui/icons-material/LocationOn'; // Address Icon

const drawerOptions = [
  { text: 'Personal Details', link: '/profile', icon: <PersonIcon /> },
  { text: 'Orders', link: '/orders/:customerId', icon: <ListAltIcon /> },
  { text: 'Farming Details', link: '/FarmingDetails', icon: <GrassIcon /> }, // Alternative Icon
  { text: 'Address', link: '/Address', icon: <LocationOnIcon /> },
];

const CxprofileSidebar = ({ onOptionClick }) => {
  const [selectedOption, setSelectedOption] = useState('Personal Details');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const activeOption = drawerOptions.find(option => option.link === location.pathname);
    if (activeOption) {
      setSelectedOption(activeOption.text);
    }
  }, [location.pathname]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (onOptionClick) onOptionClick(option);
  };

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fff',
        padding: '20px 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        '@media (max-width: 600px)': {
          display: 'none',
        },
      }}
    >
      <Stack
        direction="column"
        spacing={2}
        justifyContent="flex-start"
        alignItems="flex-start"
        sx={{
          overflowY: 'auto',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {drawerOptions.map(({ text, link, icon }) => (
          <Box
            key={text}
            onClick={() => handleOptionClick(text)}
            sx={{
              width: '100%',
              padding: '10px 20px',
              color: selectedOption === text ? '#fff' : '#000',
              backgroundColor: selectedOption === text ? '#4BAF47' : 'transparent',
              '&:hover': {
                backgroundColor: selectedOption === text ? '#4BAF47' : '#f5f5f5',
              },
              borderRadius: '25px',
              textAlign: 'center',
              cursor: 'pointer',
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Poppins, sans-serif', // Updated font
            }}
          >
            <Link to={link} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}>
              {/* Change icon color based on selection */}
              {React.cloneElement(icon, { sx: { color: selectedOption === text ? '#fff' : '#4BAF47' } })}
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: selectedOption === text ? 'bold' : 'normal',
                  color: selectedOption === text ? '#fff' : '#000',
                  marginLeft: '10px',
                  fontFamily: 'Poppins, sans-serif', // Updated font
                }}
              >
                {text}
              </Typography>
            </Link>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default CxprofileSidebar;
