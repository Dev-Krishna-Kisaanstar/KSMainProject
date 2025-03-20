import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Box, TextField, Button, IconButton, InputAdornment, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../../../Sidebars/Advisor/AdvisorMember/AdvisorMemberSidebar';
import SearchIcon from '@mui/icons-material/Search';
import TaggingAuth from './Auth/TaggingAuth';
import SearchBackground from '../../../Assets/Background/Searchcx.webp';

function AdvisorMemberSearchcx() {
  TaggingAuth();
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    const trimmedMobileNumber = mobileNumber.trim();

    // Check if the mobile number is provided
    if (!trimmedMobileNumber) {
      setError('Please enter a mobile number');
      setSuccess('');
      return;
    }

    // Validate if the mobile number is exactly 10 digits and contains only numbers
    if (trimmedMobileNumber.length !== 10 || isNaN(trimmedMobileNumber)) {
      setError('Please enter a valid 10-digit mobile number');
      setSuccess('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setCustomer(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/search-customer/${trimmedMobileNumber}`,
        { withCredentials: true }
      );

      // Check for a successful API response
      if (response.data.message === 'Customer fetched Successfully') {
        setCustomer(response.data.customer);
        setSuccess('Customer found!');
        setError('');
      } else {
        // If no customer is found, set error and initiate redirection
        setSuccess('');
        setError('No customer found with the provided number');
        setCustomer(null); // Clear customer state when not found
        navigate('/AdvisorMemberAddCx', { state: { mobileNumber } }); // Redirect immediately
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Customer not found with the provided number');
          // Redirect since customer was not found.
          navigate('/AdvisorMemberAddCx', { state: { mobileNumber } });
        } else {
          setError('Server error. Please try again later.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false); // Always stop loading in finally block
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;

    // Check if the value contains only digits
    if (/^\d*$/.test(value)) {
      setMobileNumber(value);
      const regex = /^\d{10}$/;
      setMessage(value.length === 10 ? 'Mobile number is valid.' : '');
      setError(''); // Clear error state
      setSuccess(''); // Clear success state
    } else {
      setMessage('Only digits are allowed.'); // Display validation message
      setError(''); // Clear error state
      setSuccess(''); // Clear success state
    }
  };

  const handleViewDetails = (customerId) => {
    navigate(`/AdvisorMemberseenewcxdetails/${customerId}`, { state: { mobileNumber } });
  };

  const pageStyle = {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    color: '#fff',
    paddingTop: '80px',
    fontFamily: 'Poppins, sans-serif',
    backgroundImage: `url(${SearchBackground})`, // Use the imported image
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const glassStyle = {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent white
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={pageStyle}>
      <Sidebar />
      <Container fluid>
        {/* Search Form Section */}
        <Row className="justify-content-center mt-5">
          <Col md={8}>
            <Box sx={glassStyle}>
              <h3 className="text-center mb-4" style={{ color: '#000', fontFamily: 'Poppins, sans-serif' }}>Search Customer</h3>
              <Row>
                <Col md={12}>
                  <TextField
                    label="Mobile Number"
                    variant="outlined"
                    fullWidth
                    value={mobileNumber}
                    onChange={handleInputChange}
                    sx={{ marginBottom: 2 }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleSearch}
                            disabled={loading || mobileNumber.length !== 10}
                            aria-label="search"
                          >
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Col>
              </Row>

              {error && (
                <Alert severity="error" sx={{ marginTop: 2 }}>
                  {error}
                </Alert>
              )}

              {success && (
                <Alert severity="success" sx={{ marginTop: 2 }}>
                  {success}
                </Alert>
              )}
            </Box>
          </Col>
        </Row>

        {/* Customer Details Section */}
        {customer && (
          <Row className="justify-content-center mt-4">
            <Col md={10}>
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background
                  borderRadius: '8px',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Shadow for depth
                  backdropFilter: 'blur(10px)', // Blur effect
                  padding: 4,
                  border: '1px solid rgba(255, 255, 255, 0.18)', // Optional border for glass effect
                }}
              >
                <h4 className="text-center mb-3">Customer Details</h4>
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Full Name</TableCell>
                        <TableCell>Mobile Number</TableCell>
                        <TableCell>Alternate Mobile</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>{customer.fullName}</TableCell>
                        <TableCell>{customer.mobileNumber}</TableCell>
                        <TableCell>{customer.alternateMobileNumber || 'N/A'}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleViewDetails(customer._id)} // Passed customer ID to handle view
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

export default AdvisorMemberSearchcx;