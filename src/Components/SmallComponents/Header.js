import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { IconButton, Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import MenuIcon from '@mui/icons-material/Menu'; // Import the hamburger icon
import logo from '../../Assets/Logo/Kisaanstarlogo1.webp';
import axios from 'axios';
import Cookies from 'js-cookie';
import './Header.css';
import MobileSidebar from '../WebsiteSidebarcx/WebsiteSidebar'; // Import the MobileSidebar
import MobileTabs from './MobileTabs';
import CartSidebar from '../../Pages/Cart/CartSidebar'; // Import the CartSidebar
import CustomizedBadges from './CustomizedBadges'; // Import the CustomizedBadges

function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [categoryMenuAnchorEl, setCategoryMenuAnchorEl] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false); // State for controlling sidebar visibility
    const [cartSidebarOpen, setCartSidebarOpen] = useState(false); // State for controlling cart sidebar visibility
    const [cartItems, setCartItems] = useState([]); // State to hold cart items

    useEffect(() => {
        const token = Cookies.get('customerSession');
        setIsLoggedIn(!!token);

        // Handle window resize event
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch cart items
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
                    withCredentials: true, // Ensure the customer's session is sent
                });
                setCartItems(response.data.cart); // Assuming the API response structure
            } catch (error) {
                console.error('Failed to fetch cart items:', error);
            }
        };

        fetchCartItems();
    }, []);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleProfileMenuClose = () => {
        setAnchorEl(null);
    };

    const handleCategoryMenuOpen = (event) => {
        setCategoryMenuAnchorEl(event.currentTarget);
    };

    const handleCategoryMenuClose = () => {
        setCategoryMenuAnchorEl(null);
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen); // Toggle sidebar open/close state
    };

    const toggleCartSidebar = () => {
        setCartSidebarOpen(!cartSidebarOpen);
        setSidebarOpen(false); // Close the hamburger sidebar if open
    };

    const logout = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/customers/logout`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            });
            if (response.status === 200) {
                Cookies.remove('customerSession');
                setIsLoggedIn(false);
                navigate('/');
            }
        } catch (error) {
            console.error('Logout failed:', error.response ? error.response.data : 'Server error');
        }
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#4BAF4', padding: '0 10px', borderTop: '2px solid white', fontFamily: 'Poppins, sans-serif' }}>
                <div className="container-fluid">
                    {/* Logo */}
                    <Link className="navbar-brand" to="/">
                        <img src={logo} alt="Logo" style={{ height: '60px', borderRadius: '20px' }} />
                    </Link>

                    {/* Hamburger Menu - Display only if mobile and user logged in */}
                    {isMobile && isLoggedIn && (
                        <IconButton onClick={toggleSidebar} edge="start" color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                    )}

                    {/* Bootstrap Navbar Collapse */}
                    <div className="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">
                        <ul className="navbar-nav mb-2 mb-lg-0 nav-links">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/About">About Us</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/Services">Services</Link>
                            </li>

                            {/* Products Dropdown */}
                            <li className="nav-item" onMouseEnter={handleCategoryMenuOpen} onMouseLeave={handleCategoryMenuClose}>
                                <Link className="nav-link" to="/products/Categories">Products</Link>
                                <Menu
                                    anchorEl={categoryMenuAnchorEl}
                                    open={Boolean(categoryMenuAnchorEl)}
                                    onClose={handleCategoryMenuClose}
                                >
                                    <MenuItem onClick={() => {
                                        handleCategoryMenuClose();
                                        navigate('/products/Categories');
                                    }}>
                                        Categories
                                    </MenuItem>
                                </Menu>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/Shop">Shop</Link>
                            </li>

                            <li className="nav-item">
                                <Link className="nav-link" to="/Contactus">Contact Us</Link>
                            </li>
                            {!isLoggedIn && (
                                <li className="nav-item">
                                    <Link className="btn nav-link" to="/login">Login</Link>
                                </li>
                            )}
                        </ul>

                        {/* Right Section */}
                        <div className="d-flex align-items-center">
                            {/* Search */}
                            <IconButton className="MuiIconButton-root">
                                <SearchIcon />
                            </IconButton>
                            {/* Cart Button with Badge */}
                            <IconButton className="MuiIconButton-root" onClick={toggleCartSidebar}>
                                <CustomizedBadges badgeContent={cartItems?.length} /> {/* Pass the cart item count */}
                            </IconButton>
                            {/* Account */}
                            <div>
                                <IconButton className="MuiIconButton-root" onClick={handleProfileMenuOpen}>
                                    <AccountCircleIcon />
                                </IconButton>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileMenuClose}>
                                    {isLoggedIn ? (
                                        <>
                                            <MenuItem onClick={() => {
                                                handleProfileMenuClose();
                                                navigate('/profile');
                                            }} className="fw-bold">
                                                View Profile
                                            </MenuItem>
                                            <MenuItem onClick={() => {
                                                handleProfileMenuClose();
                                                logout();
                                            }} className="fw-bold">
                                                Logout
                                            </MenuItem>
                                        </>
                                    ) : (
                                        <MenuItem onClick={() => {
                                            handleProfileMenuClose();
                                            navigate('/login');
                                        }} className="fw-bold">
                                            Login
                                        </MenuItem>
                                    )}
                                </Menu>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            
            {/* Render MobileTabs if not logged in */}
            {isMobile && <MobileTabs />}

            {/* Render Mobile Sidebar */}
            <MobileSidebar isMobile={sidebarOpen} handleClose={toggleSidebar} logout={logout} />
            
            {/* Render Cart Sidebar */}
            {cartSidebarOpen && <CartSidebar initialCartItems={cartItems} onClose={toggleCartSidebar} />}
        </>
    );
}

export default Header;