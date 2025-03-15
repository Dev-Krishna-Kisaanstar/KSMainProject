import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Typography,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import HomeIcon from '@mui/icons-material/Home';
import AdvisorMemberNavbar from './OperationAdminNavbar';
import icon from '../../../Assets/Logo/icon.png';
import { Link, useLocation } from 'react-router-dom';
import RollingText from '../../../Components/RollingTextSidebar/RollingText'; // Import the RollingText component
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import the new icon
import AddIcon from '@mui/icons-material/Add'; // Plus icon for "Add Advisor Member"
import ListIcon from '@mui/icons-material/List';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  zIndex: theme.zIndex.drawer + 1,
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: theme.spacing(7),
});

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    backgroundColor: 'rgba(15, 21, 53, 0.8)',
    backdropFilter: 'blur(10px)',
    ...(open ? openedMixin(theme) : closedMixin(theme)),
    '&:hover': {
      width: drawerWidth,
      '.menu-text': {
        display: 'block',
      },
    },
  },
  '&:hover .menu-text': {
    display: 'block',
  },
  '.menu-text': {
    display: open ? 'block' : 'none',
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center', // Center align the content
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function Sidebar({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const location = useLocation(); // Track the active route

  const toggleDrawer = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <HomeIcon />, link: '/OperationAdminDashboard' },
    { text: 'Add Opp Member', icon: <AddIcon />, link: '/AddOperationMember' }, // Using Plus icon
    { text: 'Opp Member List', icon: <ListIcon />, link: '/OperationMemberList' },
    { text: 'Orders', icon: <ShoppingCartIcon />, link: '/OppAOrders' },
  ];

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <CssBaseline />
      
      <Drawer
        variant="permanent"
        sx={{
          '& .MuiDrawer-paper': {
            borderRight: 'none',
            backgroundColor: 'rgba(15, 21, 53, 0.8)',
            backdropFilter: 'blur(10px)',
          },
          ...(open ? openedMixin(theme) : closedMixin(theme)),
        }}
        open={open}
      >
        <DrawerHeader>
          <img
            src={icon}
            alt="App Icon"
            style={{
              width: '40px',
              height: '40px',
              marginRight: open ? '10px' : '0px',
            }}
          />
          {open && (
            <RollingText 
              text="KisaanStar" 
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 600, 
                color: 'white', 
                marginRight: 'auto',
                alignItems : 'center'
              }} 
            /> // Use RollingText component with styles
          )}
        </DrawerHeader>

        <Divider sx={{ bgcolor: 'gray' }} />

        <List>
          {menuItems.map((item) => (
            <Tooltip key={item.text} title={item.text} placement="right" arrow>
              <ListItem disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    borderRadius: '50px 0 0 50px',
                    backgroundColor: location.pathname === item.link ? 'orange' : 'transparent', // Active item turns orange
                    '&:hover': {
                      backgroundColor: 'orange',
                      color: 'white',
                    },
                  }}
                  component={Link}
                  to={item.link}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 2.5 : 'auto',
                      justifyContent: 'center',
                      color: 'white',
                    }}
                  >
                    {React.cloneElement(item.icon, {
                      style: { borderRadius: '50%', padding: '10px', backgroundColor: '#2D2D44', fontSize: '40px' },
                    })}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      fontFamily: 'Poppins, sans-serif',
                      color: 'white',
                      paddingLeft: '20px',
                      fontSize: '1.2rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Drawer>

      <AdvisorMemberNavbar open={open} toggleDrawer={toggleDrawer} />

      <Box
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
          p: 3,
          width: open ? `calc(100% - ${drawerWidth}px)` : '100%',
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}