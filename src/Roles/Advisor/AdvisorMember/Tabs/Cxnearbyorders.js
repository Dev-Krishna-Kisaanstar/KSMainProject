import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, CircularProgress, Box, Container } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Ensure you have axios installed
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 800,
  margin: theme.spacing(2),
  padding: theme.spacing(3),
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(15, 21, 53, 0.7)', // Custom color with transparency for the glass effect
  color: 'white', // White text color
  boxShadow: theme.shadows[12], // Enhanced shadow
  borderRadius: '12px', // Rounded corners for a softer look
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(3),
}));

const InfoHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
  marginTop: theme.spacing(2),
}));

const InfoContainer = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  padding: theme.spacing(2),
  border: `1px solid #4CAF50`, // Green border color
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'rgba(255, 255, 255, 0.2)', // Light transparent background to match glass effect
  transition: 'all 0.3s ease', // Smooth transition effect for hover
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Slightly darker background on hover
    boxShadow: '0 4px 8px rgba(0, 255, 0, 0.2)', // Subtle green shadow effect on hover
  },
}));

const DetailTypography = styled(Typography)(({ theme }) => ({
  fontSize: '1.2rem', // Increased font size
  color: 'white', // Ensure the text is white
  lineHeight: 1.5, // Optional: Increase line height for better readability
}));

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
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={8}>
          <StyledCard variant="outlined">
            <CardContent>
              <Header>
                <Typography variant="h4" fontSize="2rem" fontWeight="bold">Nearby Customers Information</Typography>
                <InfoHeader>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      <LocationOnIcon color="success" /> Pin Code:
                    </Typography>
                    <DetailTypography>{customerData.pincode}</DetailTypography>
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      <ArrowForwardIcon color="success" /> Total Customers:
                    </Typography>
                    <DetailTypography>{customerData.totalCustomers}</DetailTypography>
                  </Box>
                </InfoHeader>
              </Header>
              {customerData.nearbyCustomers.map((customer, index) => (
                <InfoContainer key={index}>
                  <Typography variant="h6" fontWeight="bold" color="white" fontSize="1.2rem">Customer Name: {customer.customerId.fullName}</Typography>
                  <DetailTypography component="div" color="white">Nearby Location: {customer.nearbyLocation}</DetailTypography>
                  <DetailTypography component="div" color="white">Village: {customer.village}</DetailTypography>
                  <DetailTypography component="div" color="white">Post Office: {customer.postOffice}</DetailTypography>
                  <DetailTypography component="div" color="white">Taluka: {customer.taluka}</DetailTypography>
                  <DetailTypography component="div" color="white">District: {customer.district}</DetailTypography>
                  <DetailTypography component="div" color="white">State: {customer.state}</DetailTypography>
                </InfoContainer>
              ))}
            </CardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cxnearbyorders;
