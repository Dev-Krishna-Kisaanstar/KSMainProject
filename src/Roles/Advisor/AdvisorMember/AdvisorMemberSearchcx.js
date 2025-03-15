import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Box, TextField, Button, IconButton, InputAdornment, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import Cookies from 'js-cookie';
import axios from 'axios';
import Sidebar from '../../../Sidebars/Advisor/AdvisorMember/AdvisorMemberSidebar';
import AdvisorMemberAddCx from './AdvisorMemberAddCx'; // Import Add Customer Component
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
  const [showDetails, setShowDetails] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    // Trim the mobile number to remove any leading/trailing spaces
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

    // Proceed if the mobile number is valid
    setLoading(true);
    setError('');
    setSuccess('');
    setCustomer(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/search-customer/${trimmedMobileNumber}`,
        { withCredentials: true }
      );

      if (response.data.message === 'Customer found') {
        setCustomer(response.data.customer);
        setSuccess('Customer found!');
        setError('');
      } else {
        setSuccess('');
        setError('No customer found with the provided number');
        setCustomer(null); // Clear the customer state when no customer is found
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (error.response) {
        if (error.response.status === 404) {
          setError('Customer not found with the provided number');
        } else {
          setError('Server error. Please try again later.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;

    // Check if the value contains only digits
    if (/^\d*$/.test(value)) {
      setMobileNumber(value);
      // Regular expression to match exactly 10 digits
      const regex = /^\d{10}$/;
      if (value.length === 0 || regex.test(value)) {
        setMessage(value.length === 10 ? 'Mobile number is valid.' : '');
      } else {
        setMessage('Mobile number must be exactly 10 digits.');
      }
      setError(''); // Clear error state
      setSuccess(''); // Clear success state
    } else {
      setMessage('Only digits are allowed.'); // Display validation message
      setError(''); // Clear error state
      setSuccess(''); // Clear success state
    }
  };

  const isValidPhoneNumber = (number) => {
    return number.length === 10 && !isNaN(number);
  };

  // Redirect method
  const handleRedirectToAddCustomer = () => {
    navigate('/AdvisorMemberAddCx', { state: { mobileNumber } }); // Adjust the path as needed for your routing
  };

  // Logic for redirecting when no customer found
  if (!customer && (error === 'No customer found with the provided number' || (error && success === ''))) {
    handleRedirectToAddCustomer();
  }

  // Import statements omitted for brevity
  const handleViewDetails = (customerId, mobileNumber) => {
    navigate(`/AdvisorMemberseenewcxdetails/${customerId}`, { state: { mobileNumber } });
  };

  const yourStyle = { fontFamily: 'Poppins, sans-serif' };

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
                            onClick={() => handleViewDetails(customer._id, customer.mobileNumber)} // Pass mobileNumber here
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