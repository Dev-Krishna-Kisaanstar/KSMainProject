import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Stepper,
    Step,
    StepLabel,
    Card,
    CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import horImage from "../../Assets/Background/horimage.webp";
import verImage from "../../Assets/Background/AA.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuthAdvisoryAdmin from "../../Roles/Advisor/AdvisorAdmin/Auth/AuthContext";
import logoSrc from '../../Assets/Logo/KStarLogo.png'

const steps = ["Enter Email", "Enter Password"];

const AdvisorAdminLogin = () => {
    useAuthAdvisoryAdmin();
    const [activeStep, setActiveStep] = useState(0);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEmailSubmit = async () => {
        setLoading(true);
        setMessage("");

        try {
            if (activeStep === 0) {
                // Send password to registered email
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/advisory-admin/send-password`,
                    { officialEmail: email }
                );
                setMessage(response.data.message);
                toast.success(response.data.message);
                setActiveStep(1);
            } else {
                // Perform login
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/advisory-admin/login`,
                    { officialEmail: email, password },
                    { withCredentials: true } // Include cookies from the server
                );

                if (response.data.token) {
                    // Token is handled on the backend; no need to set it on client side
                    console.log("Login successful:", response.data.message);

                    // Redirect to the advisory dashboard
                    toast.success(response.data.message);
                    navigate("/AdvisorAdminDashboard");
                }
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred";
            setMessage(errorMessage);
            toast.error(errorMessage);
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
                        Advisory Admin Login
                    </Typography>
    
                    <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
    
                    <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        {activeStep === 0 && (
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
                        )}
                        {activeStep === 1 && (
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
                        )}
    
                        <Box display="flex" justifyContent="center" mt={2}>
                            <Button
                                variant="contained"
                                onClick={handleEmailSubmit}
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
                                ) : activeStep === 0 ? "Send Password" : "Login"}
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

export default AdvisorAdminLogin;