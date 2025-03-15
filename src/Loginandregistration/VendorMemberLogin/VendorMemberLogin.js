import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Card,
    CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import horImage from "../../Assets/Background/horimage.webp";
import verImage from "../../Assets/Background/VM.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthVendorMember from '../../Roles/Vendor/VendorMember/Auth/AuthContext';
import logoSrc from '../../Assets/Logo/KStarLogo.png';

const VendorMemberLogin = () => {
    useAuthVendorMember();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setMessage("");

        try {
            // Perform login
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/vendor-member/login`,
                { 
                    emailId: email,  // Note: the key should be emailId as per the API
                    password 
                },
                { withCredentials: true } // Include cookies from the server
            );

            // Redirecting to the Vendor Member Dashboard
            toast.success(response.data.message);
            navigate("/VendorMemberDashboard"); // Adjust to your dashboard route
            
        } catch (error) {
            // Handle error responses
            if (error.response) {
                const errorMessage = error.response.data.message || "An error occurred";
                setMessage(errorMessage);
                toast.error(errorMessage);
            } else {
                setMessage("An unexpected error occurred");
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden", fontFamily: 'Poppins, sans-serif' }}>
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `url(${horImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    zIndex: 0,
                    opacity: 0.8,
                }}
            />
            <Box
                sx={{
                    position: "relative",
                    zIndex: 1,
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Card
                    sx={{
                        display: "flex",
                        width: "60%",
                        height: "70%",
                        backgroundColor: "rgba(255, 255, 255, 0.85)", // Decrease opacity to make the background more visible
                        borderRadius: "20px",
                        overflow: "hidden",
                        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
                    }}
                >
                    <Box
                        sx={{
                            flex: 1,
                            height: "100%",
                            backgroundImage: `url(${verImage})`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                            borderRadius: "20px",
                            overflow: "hidden",
                            backgroundRepeat: "no-repeat",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                borderRadius: "20px 0 0 20px",
                            }} />
                    </Box>
        
                    <Box
                        sx={{
                            flex: 1,
                            padding: "40px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        {/* Logo Section */}
                        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
                            <img src={logoSrc} alt="Logo" style={{ width: '200px', height: 'auto' }} />
                        </Box>
        
                        <Typography variant="h4" align="center" gutterBottom>
                            Vendor Member Login
                        </Typography>
    
                        {/* Login Form */}
                        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <TextField
                                label="Email"
                                variant="outlined"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                fullWidth
                                sx={{ mb: 3 }}
                                InputProps={{
                                    style: { fontFamily: 'Poppins, sans-serif' },
                                }}
                            />
                            <TextField
                                label="Password"
                                variant="outlined"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                fullWidth
                                sx={{ mb: 3 }}
                                InputProps={{
                                    style: { fontFamily: 'Poppins, sans-serif' },
                                }}
                            />
    
                            <Box display="flex" justifyContent="center" mt={2}>
                                <Button
                                    variant="contained"
                                    onClick={handleLogin}
                                    disabled={loading}
                                    sx={{
                                        py: 1.5,
                                        width: "200px",
                                        borderRadius: "5px",
                                        fontWeight: "bold",
                                        fontSize: "0.875rem",
                                        backgroundColor: "#008000",
                                        color: "white",
                                        "&:hover": {
                                            backgroundColor: "white",
                                            color: "brown",
                                        },
                                    }}
                                >
                                    {loading ? (
                                        <CircularProgress size={24} color="inherit" />
                                    ) : "Login"}
                                </Button>
                            </Box>
                        </Box>
    
                        {message && (
                            <Typography color="error" align="center" sx={{ mt: 3 }}>
                                {message}
                            </Typography>
                        )}
                    </Box>
                </Card>
            </Box>
            <ToastContainer />
        </Box>
    );
};

export default VendorMemberLogin;