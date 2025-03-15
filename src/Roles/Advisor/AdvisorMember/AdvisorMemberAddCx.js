import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
  Grid,
  InputAdornment,
} from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../../Sidebars/Advisor/AdvisorMember/AdvisorMemberSidebar';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for toast notifications
import TaggingAuth from './Auth/TaggingAuth';

function AdvisorMemberAddCx() {
  TaggingAuth();
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [alternateMobileNumber, setAlternateMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { mobileNumber: incomingMobileNumber, customerId } = location.state || {};
  
  useEffect(() => {
    // Set mobile number from incoming location state if available
    if (incomingMobileNumber) {
      setMobileNumber(incomingMobileNumber);
    }
  }, [incomingMobileNumber]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const customerData = {
      fullName,
      mobileNumber,
      alternateMobileNumber,
      customerId, // Include the customer ID in the request payload if needed
    };
  
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/add-customer`,
        customerData,
        { withCredentials: true } // Sending the request with credentials
      );
  
      toast.success(response.data.message);
      resetForm();
  
      // Redirect to view details page using the newly created customer ID or existing customer ID
      const targetCustomerId = response.data.customer.id; // Fallback to customerId from state if not created
      console.log(targetCustomerId);
      
      navigate(`/AdvisorMemberseenewcxdetails/${targetCustomerId}`, { state: { mobileNumber } }); // Correctly use dynamic URL with customerId
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Server error. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFullName('');
    setMobileNumber('');
    setAlternateMobileNumber('');
  };

  return (
    <div style={pageStyle}>
      <Sidebar/>
        <Box sx={{ padding: 4, backgroundColor: '#fff', borderRadius: '8px', boxShadow: 3,flex:1 }}>
          <Typography variant="h4" className="text-center mb-4">Add New Customer</Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Full Name Field - Left Side */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Full Name"
                  variant="outlined"
                  fullWidth
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  sx={{ marginBottom: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Mobile Number Field (Disabled) - Right Side */}
              <Grid item xs={12} md={6}>
                <TextField
                  label="Mobile Number"
                  variant="outlined"
                  fullWidth
                  value={mobileNumber}
                  disabled // Mobile number should be disabled
                  required
                  sx={{ marginBottom: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Alternate Mobile Number Field - This can take a full row */}
              <Grid item xs={12}>
                <TextField
                  label="Alternate Mobile Number"
                  variant="outlined"
                  fullWidth
                  value={alternateMobileNumber}
                  onChange={(e) => setAlternateMobileNumber(e.target.value)}
                  sx={{ marginBottom: 2 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              sx={{ marginTop: 2, width: '200px', height: '40px', fontSize: '16px', textTransform: 'none' }}
              startIcon={<AddCircleIcon />}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Add Customer'}
            </Button>
          </form>

          {/* Toast Container for displaying notifications */}
          <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} />
        </Box>
    </div>
  );
}

const pageStyle = {
  backgroundColor: '#1e1e2f',
  minHeight: '100vh',
  paddingTop: '65px',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
};

export default AdvisorMemberAddCx;