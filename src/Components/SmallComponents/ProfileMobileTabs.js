// ProfileMobileTabs.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GrassIcon from '@mui/icons-material/Grass';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ProfileMobileTabs = () => {
    const location = useLocation();

    // Define the tabs and their corresponding links and icons
    const tabs = [
        { to: '/profile', label: 'Personal Details', Icon: PersonIcon },
        { to: '/orders', label: 'Orders', Icon: ShoppingCartIcon },
        { to: '/FarmingDetails', label: 'Farming Details', Icon: GrassIcon },
        { to: '/Wishlist', label: 'Wishlist', Icon: FavoriteIcon },
        { to: '/Address', label: 'Address', Icon: LocationOnIcon },
    ];

    return (
        <Box 
            sx={{
                width: '100%',
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                bgcolor: '#FFFFFF',
                borderTop: '1px solid #ccc',
                boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.2)',
                padding: '8px',
                display: 'flex',
                justifyContent: 'space-around',
            }}
        >
            {tabs.map(({ to, label, Icon }, index) => (
                <Button
                    key={index}
                    component={Link}
                    to={to}
                    startIcon={<Icon sx={{ fontSize: 20 }} />}
                    variant="text"
                    sx={{
                        flexGrow: 1,
                        justifyContent: 'flex-start',
                        color: location.pathname === to ? 'green' : 'black',
                        '&:hover': {
                            backgroundColor: location.pathname === to ? 'lightgreen' : '#f0f0f0',
                        },
                    }}
                >
                    <Typography variant="body2" sx={{ fontWeight: location.pathname === to ? 'bold' : 'normal' }}>
                        {label}
                    </Typography>
                </Button>
            ))}
        </Box>
    );
};

export default ProfileMobileTabs;