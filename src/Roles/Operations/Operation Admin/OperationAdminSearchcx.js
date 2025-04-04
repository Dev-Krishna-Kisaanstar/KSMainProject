import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, IconButton, InputAdornment, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Sidebar from '../../../Sidebars/Operation/OperationAdmin/OperationAdminSidebar';
import SearchIcon from '@mui/icons-material/Search';
import SearchBackground from '../../../Assets/Background/Searchcx.webp';

function OperationAdminSearchcx() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [customer, setCustomer] = useState(null);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    const trimmedMobileNumber = mobileNumber.trim();

    if (!trimmedMobileNumber) {
      setError('Please enter a mobile number');
      setSuccess('');
      return;
    }

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
        `${process.env.REACT_APP_API_URL}/api/advisory-member/search-customer/${trimmedMobileNumber}`
      );

      if (response.data.message === 'Customer fetched Successfully') {
        setCustomer(response.data.customer);
        setSuccess('Customer found!');
        setError('');
      } else {
        setSuccess('');
        setError('No customer found with the provided number');
        setCustomer(null);
        navigate('/OperationAdminAddCx', { state: { mobileNumber } });
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 404) {
          setError('Customer not found with the provided number');
          navigate('/OperationAdminAddCx', { state: { mobileNumber } });
        } else {
          setError('Server error. Please try again later.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      setMobileNumber(value);
      const regex = /^\d{10}$/;
      setMessage(value.length === 10 ? 'Mobile number is valid.' : '');
      setError('');
      setSuccess('');
    } else {
      setMessage('Only digits are allowed.');
      setError('');
      setSuccess('');
    }
  };

  const handleViewDetails = (customerId) => {
    navigate(`/OperationAdminseenewcxdetails/${customerId}`, { state: { mobileNumber } });
  };

  const pageStyle = {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    color: '#fff',
    paddingTop: '80px',
    fontFamily: 'Poppins, sans-serif',
    backgroundImage: `url(${SearchBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  const glassStyle = {
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={pageStyle}>
      <Sidebar />
      <Container fluid>
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

        {customer && (
          <Row className="justify-content-center mt-4">
            <Col md={10}>
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(10px)',
                  padding: 4,
                  border: '1px solid rgba(255, 255, 255, 0.18)',
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
                            onClick={() => handleViewDetails(customer._id)}
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

export default OperationAdminSearchcx;