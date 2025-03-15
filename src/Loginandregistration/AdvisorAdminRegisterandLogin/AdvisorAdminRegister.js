// client/src/OperationalAdminRegister.js
import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import the CSS

// Import images
import horImage from "../../Assets/Background/horimage.webp";
import verImage from "../../Assets/Background/verimage.webp";

const AdvisorAdminRegister = () => {
  // State Variables
  const [fullName, setFullName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [employmentId, setEmploymentId] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const navigate = useNavigate();

  // Function to calculate age based on date of birth
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submission starts

    // Check if the user is at least 18 years old
    if (calculateAge(dob) < 18) {
      toast.error("You must be at least 18 years old to register.");
      setLoading(false);
      return;
    }

    const data = { fullName, officialEmail, employmentId, dob };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/advisory-admin/register`,
        data
      );
      toast.success(response.data.message); // Show success toast
      resetForm();
      navigate("/AdvisorAdminLogin"); // Redirect on successful registration
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred"); // Show error toast
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Resets the form fields
  const resetForm = () => {
    setFullName("");
    setOfficialEmail("");
    setEmploymentId("");
    setDob("");
  };

  // Styling for TextFields
  const textFieldStyles = {
    mb: 1, // Reduced bottom margin
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      "&.Mui-focused fieldset": {
        borderColor: "primary.main",
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: "0.9rem", // Slightly smaller label font
      color: "grey.600",
    },
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <Box sx={{ height: "100vh", width: "100vw", position: "relative", overflow: "hidden" }}>
      {/* Full-screen background image */}
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

      {/* Content container */}
      <Box sx={{ position: "relative", zIndex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* 50-50 split container */}
        <Box sx={{ display: "flex", width: "50%", height: "60%", backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "20px", overflow: "hidden", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)" }}>
          {/* Left side - Vertical image */}
          <Box
            sx={{
              flex: 1,
              backgroundImage: `url(${verImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Right side - Registration form */}
          <Box sx={{ flex: 1, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Typography variant="h5" align="center" gutterBottom>
              Register Advisor Admin
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <TextField
                label="Full Name"
                variant="outlined"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                fullWidth
                sx={textFieldStyles}
              />
              <TextField
                label="Official Email"
                variant="outlined"
                type="email"
                value={officialEmail}
                onChange={(e) => setOfficialEmail(e.target.value)}
                required
                fullWidth
                sx={textFieldStyles}
              />
              <TextField
                label="Employment ID"
                variant="outlined"
                value={employmentId}
                onChange={(e) => setEmploymentId(e.target.value)}
                required
                fullWidth
                sx={textFieldStyles}
              />
              <TextField
                label="Date of Birth"
                variant="outlined"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
                fullWidth
                inputProps={{ max: today }} // Prevent future dates
                sx={textFieldStyles}
              />
              <Button
                variant="contained"
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1, // Reduced margin-top
                  py: 1, // Reduced padding on y-axis
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "0.9rem", // Slightly smaller button font
                  backgroundColor: "#eab85f",
                  "&:hover": {
                    backgroundColor: "#d4a95b",
                  },
                  transition: "background-color 0.3s, transform 0.2s",
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} /> : "Register"}
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
      
      {/* Toast Notification Container */}
      <ToastContainer 
        position="top-center"
        autoClose={3000} // Auto close after 3 seconds
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Box>
  );
};

export default AdvisorAdminRegister;