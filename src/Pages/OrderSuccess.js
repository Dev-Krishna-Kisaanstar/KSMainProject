import React, { useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import OrdersuccessImage from '../Assets/Background/Ordersuccess.webp'; // Adjust the path as necessary

const OrderSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page after 5 seconds
    const timer = setTimeout(() => {
      navigate('/'); // Redirect to home page
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Container style={{ textAlign: 'center', marginTop: '50px' }}>
      <img 
        src={OrdersuccessImage} 
        alt="Order Success" 
        style={{ width: '100%', maxWidth: '600px', marginBottom: '20px' }} 
      />
      <Typography variant="h4" gutterBottom>
        Order Placed Successfully!
      </Typography>
      <Typography variant="body1" gutterBottom>
        Thank you for your order. We are processing it and will notify you shortly.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        You will be redirected to the home page in 5 seconds.
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/')}>
        Go to Home Now
      </Button>
    </Container>
  );
};

export default OrderSuccess;