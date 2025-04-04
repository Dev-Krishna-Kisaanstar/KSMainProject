import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';
import PostAddIcon from '@mui/icons-material/PostAdd';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DomainIcon from '@mui/icons-material/Domain';
import PublicIcon from '@mui/icons-material/Public';

const Cxnearbyorders = () => {
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { customerId } = useParams();

  const fetchCustomerData = async (customerId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/customers/nearby/${customerId}?offset=0&limit=5`,
        { withCredentials: true }
      );

      const fetchedCustomerData = response.data;
      setCustomerData(fetchedCustomerData);
    } catch (err) {
      console.error('Error fetching customer data:', err);
      setError('Failed to fetch customer data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchCustomerData(customerId);
    }
  }, [customerId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error}</Typography>;
  }

  if (!customerData) {
    return <Typography>No customer data available</Typography>;
  }

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" fontWeight="bold" color="white" gutterBottom>
        Nearby Customers Information
      </Typography>
      <Typography variant="h6" fontWeight="bold" color="white">
        <LocationOnIcon color="success" /> Pin Code: {customerData.pincode}
      </Typography>
      <Typography variant="h6" fontWeight="bold" color="white">
        <ArrowForwardIcon color="success" /> Total Customers: {customerData.totalCustomers}
      </Typography>

      <TableContainer component={Paper} style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', marginTop: '20px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ color: 'white' }}><PersonIcon /> Customer Name</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}><PlaceIcon /> Nearby Location</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}><PlaceIcon /> Village</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}><PostAddIcon /> Post Office</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}><AccountTreeIcon /> Taluka</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}><DomainIcon /> District</TableCell>
              <TableCell align="center" sx={{ color: 'white' }}><PublicIcon /> State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customerData.nearbyCustomers.map((customer) => (
              <TableRow key={customer.customerId._id}>
                <TableCell align="center" sx={{ color: 'white' }}>{customer.customerId.fullName}</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>{customer.nearbyLocation}</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>{customer.village}</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>{customer.postOffice}</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>{customer.taluka}</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>{customer.district}</TableCell>
                <TableCell align="center" sx={{ color: 'white' }}>{customer.state}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Cxnearbyorders;