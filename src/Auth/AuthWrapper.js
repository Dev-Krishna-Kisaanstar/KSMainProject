import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Using React Router
import Cookies from 'js-cookie';
import { CircularProgress, Box, Typography } from '@mui/material';

const AuthWrapper = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('customerSession');
      console.log('Token:', token);

      if (!token) {
        setError('You are not logged in.');
        setLoading(false);
        navigate('/login'); // Redirect to login page
        return;
      }

      // If token exists, assume the user is authenticated
      setIsAuthenticated(true);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress aria-label="Checking authentication" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return <>{isAuthenticated && children}</>;
};

export default AuthWrapper;
