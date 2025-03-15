// MobileTabs.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NavigationIcon from '@mui/icons-material/Navigation';
import PersonIcon from '@mui/icons-material/Person';

const MobileTabs = () => {
    const location = useLocation();

    return (
        <BottomNavigation
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
                padding: '4px',
                borderRadius: '12px',
            }}
        >
            {[ 
                { to: '/', label: 'Home', Icon: HomeIcon, bg: '#e3f2fd', hover: '#bbdefb' },
                { to: '/profile', label: 'View Profile', Icon: Diversity1Icon, bg: '#ffebee', hover: '#ffcdd2', iconOffset: 8 },  
                { to: '/Cart', label: 'Cart', Icon: AgricultureIcon, bg: '#e8f5e9', hover: '#c8e6c9' },
                { to: '/products/Categories', label: 'Categories', Icon: ShoppingCartIcon, bg: '#fff3e0', hover: '#ffe0b2' },
                // { to: '/KrushiBook', label: 'Krushi Book', Icon: NavigationIcon, bg: '#f3e5f5', hover: '#e1bee7', iconOffset: 8 },
                { to: '/CallCenter', label: 'Call Center', Icon: PersonIcon, bg: '#e1f5fe', hover: '#b3e5fc' },
            ].map(({ to, label, Icon, bg, hover, iconOffset = 0 }, index) => (
                <BottomNavigationAction
                    key={index}
                    component={Link}
                    to={to}
                    icon={<Icon sx={{ fontSize: 28, color: 'black', transform: `translateY(${iconOffset}px)` }} />}
                    label={
                        <Typography
                            variant="caption"
                            sx={{
                                mt: 1,
                                fontWeight: 500,
                                color: 'black',
                            }}
                        >
                            {label}
                        </Typography>
                    }
                    sx={{
                        flexGrow: 1,
                        minWidth: '0',
                        borderRadius: '12px',
                        bgcolor: location.pathname === to ? 'green' : bg, // Set background color to green when active
                        textAlign: 'center',
                        color: location.pathname === to ? 'white' : 'black',
                        '&:hover': { bgcolor: location.pathname === to ? 'green' : hover },
                    }}
                />
            ))}
        </BottomNavigation>
    );
};

export default MobileTabs;
