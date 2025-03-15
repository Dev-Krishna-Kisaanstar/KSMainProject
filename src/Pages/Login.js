import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Button, TextField } from '@mui/material';
import Cookies from 'js-cookie';
import Headerbar from '../Components/SmallComponents/Headerbar';
import Header from '../Components/SmallComponents/Header';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';
import MobileLogin from './MobileLogin';
import image1 from '../Assets/Background/image1.webp';
import image2 from '../Assets/Background/image2.webp'

const Login = () => {
    const navigate = useNavigate();
    const signUpFormRef = useRef(null);

    const [activeLogin, setActiveLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [advisorName, setAdvisorName] = useState("");
    const [loading, setLoading] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Adjust the width as needed

    useEffect(() => {
        const token = Cookies.get('customerSession');
        if (token) {
            navigate('/'); // Redirect to dashboard if already logged in
        }

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768); // Update mobile state on resize
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [navigate]);

    const handleToggleClick = () => {
        const logincontainer = document.getElementById('logincontainer');
        logincontainer.classList.toggle('active');
        setActiveLogin(prev => prev === "operations" ? "advisor" : "operations");
        setEmail("");
        setPassword("");
        setFullName("");
        setMobileNumber("");
        setAdvisorName("");
    };

    const handleSignupSubmit = async () => {
        setLoading(true);
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/customers/register`, // Registration endpoint
                {
                    fullName,
                    mobileNumber,
                    email,
                    password,
                    advisorName
                }
            );
            toast.success(response.data.message);
            navigate("/"); // Redirect to dashboard after successful registration
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
        setLoading(false);
    };

    const handlePasswordSubmit = async () => {
        setLoading(true);
        try {
            const endpoint = `${process.env.REACT_APP_API_URL}/api/customers/login`;
            const response = await axios.post(endpoint, { mobileNumber, password }, { withCredentials: true });

            if (response.status === 200 || response.status === 201) {
                toast.success("User logged in successfully!");

                if (response.data.token) {
                    Cookies.set('customerSession', response.data.token, { expires: 1 / 12 }); // Store for approximately 2 hours
                    console.log('Token received:', response.data.token);
                    navigate('/'); // Redirect to the dashboard
                }
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
        setLoading(false);
    };

    return (
        <>
            <Headerbar />
            <Header />
            <div className="login-background"> {/* Background wrapper */}
                <div className="d-flex justify-content-center align-items-center vh-100">
                    {isMobile ? (
                        <MobileLogin isSignIn={activeLogin === 'operations'} setIsSignIn={setActiveLogin} />
                    ) : (
                        <div className="logincontainer" id="logincontainer">
                            <div className={`form-logincontainer sign-in ${activeLogin === 'operations' ? 'active' : ''} mb-4`}>
                                <form ref={signUpFormRef} className="d-flex flex-column align-items-center">
                                    <h2 className="text-center" style={{ color: '#008000' }}>Login In</h2>
                                    <span className="text-center" style={{ color: '#008000' }}>Enter Your Mobile Number and Password To Login</span>

                                    <TextField
                                        label="Mobile Number"
                                        variant="outlined"
                                        type="text"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        fullWidth
                                        className="mb-2"
                                    />
                                    <TextField
                                        label="Password"
                                        variant="outlined"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                        className="mb-2"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handlePasswordSubmit}
                                        disabled={loading}
                                        sx={{
                                            mt: 2,
                                            backgroundColor: '#008000', // Green
                                            color: '#D3EAD2', // Light green
                                            '&:hover': { backgroundColor: '#00b300' } // Darker green
                                        }}
                                    >
                                        {loading ? "Logging in..." : "Login"}
                                    </Button>
                                </form>
                            </div>

                            <div className={`form-logincontainer sign-up ${activeLogin === 'advisor' ? 'active' : ''} mb-4`}>
                                <form className="d-flex flex-column align-items-center">
                                    <h2 className="text-center" style={{ color: '#008000' }}>Sign Up</h2>
                                    <span className="text-center" style={{ color: '#008000' }}>Create your account</span>

                                    <TextField
                                        label="Full Name"
                                        variant="outlined"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        fullWidth
                                        className="mb-2"
                                    />
                                    <TextField
                                        label="Mobile Number"
                                        variant="outlined"
                                        value={mobileNumber}
                                        onChange={(e) => setMobileNumber(e.target.value)}
                                        fullWidth
                                        className="mb-2"
                                    />
                                    <TextField
                                        label="Email"
                                        variant="outlined"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        fullWidth
                                        className="mb-2"
                                    />
                                    <TextField
                                        label="Password"
                                        variant="outlined"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                        className="mb-2"
                                    />
                                    <Button
                                        variant="contained"
                                        onClick={handleSignupSubmit}
                                        disabled={loading}
                                        sx={{
                                            mt: 2,
                                            backgroundColor: '#008000', // Green
                                            color: '#D3EAD2', // Light green
                                            '&:hover': { backgroundColor: '#00b300' } // Darker green
                                        }}
                                    >
                                        {loading ? "Signing up..." : "Sign Up"}
                                    </Button>
                                </form>
                            </div>

                            <div className="toggle-logincontainer text-center">
                                <div
                                    className="toggle-panel toggle-left"
                                    style={{
                                        backgroundImage: `url(${image2})`, // Background for Login
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <div className="glass-effect">
                                        <h2 className="bold-text" style={{ color: 'green' }}>Hello, Customer!</h2>
                                        <p className="bold-text" style={{ color: 'green' }}>Do you already have an Account? Click on Following Login Button and Login!</p>
                                        <button className="hidden" onClick={handleToggleClick}>Login</button>
                                    </div>
                                </div>
                                <div
                                    className="toggle-panel toggle-right"
                                    style={{
                                        backgroundImage: `url(${image1})`, // Background for Signup
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                >
                                    <div className="glass-effect">
                                        <h2 className="bold-text" style={{ color: 'green' }}>Hello, Customer!</h2>
                                        <p className="bold-text" style={{ color: 'green' }}>Have you Created an Account? If no then please click on below Signin Button and Create an Account to Login!</p>
                                        <button className="hidden" onClick={handleToggleClick}>Signup</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <ToastContainer />
                </div>
            </div>
            <Footer />
            <Footerbar />
        </>
    );
};

export default Login;