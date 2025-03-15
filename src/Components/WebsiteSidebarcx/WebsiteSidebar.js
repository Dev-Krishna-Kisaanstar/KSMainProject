import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close'; // For closing the sidebar
import HomeIcon from '@mui/icons-material/Home'; // Home icon
import InfoIcon from '@mui/icons-material/Info'; // About Us icon
import AssignmentIcon from '@mui/icons-material/Assignment'; // Services icon
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Products icon
import ContactMailIcon from '@mui/icons-material/ContactMail'; // Contact Us icon
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Logout icon
import logo from '../../Assets/Logo/Kisaanstarlogo1.webp'; // Adjust the path as per your folder structure

// Define styles for the active list item
const styles = {
    sidebar: {
        width: '250px',
        backgroundColor: '#fff', // White background for the entire sidebar
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100%',
        boxShadow: '2px 0 5px rgba(0,0,0,0.5)',
        transition: 'transform 0.3s ease-in-out',
        borderRadius: '0 20px 20px 0', // Rounded right corners
        zIndex: 1000, // High z-index to ensure it overlaps other content
    },
    listItem: {
        '&:hover': {
            backgroundColor: '#e0f2f1', // Light teal on hover
        },
        color: '#000', // Default text color
        display: 'flex',
        alignItems: 'center', // Center icons vertically with text
    },
    activeListItem: {
        backgroundColor: '#4CAF50', // Green background for the active item
        color: '#fff', // White text for the active item
    },
    logo: {
        height: '40px',
        marginBottom: '16px',
    },
    sidebarTitle: {
        paddingBottom: '16px',
        color: '#4CAF50', // Green color for title
        borderBottom: '1px solid #e0e0e0', // Divider below title
    },
    iconSpacing: {
        marginRight: '16px', // Space between icon and text
    },
};

function WebsiteSidebar({ isMobile, handleClose, isLoggedIn }) {
    const navigate = useNavigate();
    
    return (
        <Box
            component="nav"
            sx={{
                ...styles.sidebar,
                transform: isMobile ? 'translateX(0)' : 'translateX(-100%)',
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" p={2}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                </Link>
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Typography variant="h5" align="center" sx={styles.sidebarTitle}>
                KisaanStar
            </Typography>
            <List>
                <ListItem 
                    button 
                    onClick={() => navigate('/')}
                    sx={{ 
                        ...styles.listItem, 
                        ...(window.location.pathname === '/' ? styles.activeListItem : {}) 
                    }}
                >
                    <HomeIcon sx={{ color: window.location.pathname === '/' ? '#fff' : '#4CAF50', ...styles.iconSpacing }} />
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem 
                    button 
                    onClick={() => navigate('/About')}
                    sx={{ 
                        ...styles.listItem, 
                        ...(window.location.pathname === '/About' ? styles.activeListItem : {}) 
                    }}
                >
                    <InfoIcon sx={{ color: window.location.pathname === '/About' ? '#fff' : '#4CAF50', ...styles.iconSpacing }} />
                    <ListItemText primary="About Us" />
                </ListItem>
                <ListItem 
                    button 
                    onClick={() => navigate('/Services')}
                    sx={{ 
                        ...styles.listItem, 
                        ...(window.location.pathname === '/Services' ? styles.activeListItem : {}) 
                    }}
                >
                    <AssignmentIcon sx={{ color: window.location.pathname === '/Services' ? '#fff' : '#4CAF50', ...styles.iconSpacing }} />
                    <ListItemText primary="Services" />
                </ListItem>
                <ListItem 
                    button 
                    onClick={() => navigate('/products/Categories')}
                    sx={{ 
                        ...styles.listItem, 
                        ...(window.location.pathname === '/products/Categories' ? styles.activeListItem : {}) 
                    }}
                >
                    <ShoppingCartIcon sx={{ color: window.location.pathname === '/products/Categories' ? '#fff' : '#4CAF50', ...styles.iconSpacing }} />
                    <ListItemText primary="Products" />
                </ListItem>
                <ListItem 
                    button 
                    onClick={() => navigate('/Contactus')}
                    sx={{ 
                        ...styles.listItem, 
                        ...(window.location.pathname === '/Contactus' ? styles.activeListItem : {}) 
                    }}
                >
                    <ContactMailIcon sx={{ color: window.location.pathname === '/Contactus' ? '#fff' : '#4CAF50', ...styles.iconSpacing }} />
                    <ListItemText primary="Contact Us" />
                </ListItem>
                {/* Conditional rendering for the "Logout" option */}
                {isLoggedIn && (
                    <ListItem 
                        button 
                        onClick={() => {
                            // Add logout function here
                        }}
                        sx={{ 
                            ...styles.listItem 
                        }}
                    >
                        <ExitToAppIcon sx={{ color: '#4CAF50', ...styles.iconSpacing }} />
                        <ListItemText primary="Logout" />
                    </ListItem>
                )}
            </List>
        </Box>
    );
}

export default WebsiteSidebar;