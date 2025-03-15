import React, { useState } from 'react';
import { Box, Typography, Container, Grid, Card, CardContent, Button } from '@mui/material';
import Headerbar from '../../Components/SmallComponents/Headerbar';
import Header from '../../Components/SmallComponents/Header';
import Footer from '../../Components/SmallComponents/Footer';
import Footerbar from '../../Components/SmallComponents/Footerbar';
import CxprofileSidebar from '../../Components/CxprofileSidebar/Cxprofilesidebar'; // Import your sidebar
import { useNavigate } from 'react-router-dom';

function Wishlist() {
  const [isMobile, setIsMobile] = useState(true);
  const navigate = useNavigate();

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <Headerbar />
      <Header />
      <Container className="mt-5">
        {/* Render Profile navigation buttons for mobile view */}
        {isMobile && (
          <Box display="flex" flexDirection="column" mb={3} sx={{ padding: 2 }}>
            <Box display="flex" justifyContent="space-between">
              <Button 
                  variant="contained" 
                  onClick={() => handleButtonClick('/profile')}
                  sx={{ 
                      backgroundColor: '#4BAF47', 
                      color: '#FFFFFF', 
                      borderRadius: '25px', 
                      flexGrow: 1, 
                      marginRight: 1 
                  }}>
                  Personal Details
              </Button>
              <Button 
                  variant="contained" 
                  onClick={() => handleButtonClick('/orders')}
                  sx={{ 
                      backgroundColor: '#4BAF47', 
                      color: '#FFFFFF', 
                      borderRadius: '25px', 
                      flexGrow: 1 
                  }}>
                  Orders
              </Button>
            </Box>

            <Box display="flex" justifyContent="center" my={2}>
              <Button 
                  variant="contained" 
                  onClick={() => handleButtonClick('/FarmingDetails')}
                  sx={{ 
                      backgroundColor: '#4BAF47', 
                      color: '#FFFFFF', 
                      borderRadius: '25px', 
                      flexGrow: 1, 
                      width: 'calc(100% - 16px)' 
                  }}>
                  Farming Details
              </Button>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Button 
                  variant="contained" 
                  onClick={() => handleButtonClick('/Wishlist')}
                  sx={{ 
                      backgroundColor: '#4BAF47', 
                      color: '#FFFFFF', 
                      borderRadius: '25px', 
                      flexGrow: 1, 
                      marginRight: 1 
                  }}>
                  Wishlist
              </Button>
              <Button 
                  variant="contained" 
                  onClick={() => handleButtonClick('/Address')}
                  sx={{ 
                      backgroundColor: '#4BAF47', 
                      color: '#FFFFFF', 
                      borderRadius: '25px', 
                      flexGrow: 1 
                  }}>
                  Address
              </Button>
            </Box>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <CxprofileSidebar />
          </Grid>

          <Grid item xs={12} md={9}>
            <Card className="mb-4 rounded-3">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>Wishlist</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  Your Wishlist will be displayed here.
                </Typography>
                {/* TODO: Include your wishlist table or list here */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <Footerbar />
    </>
  );
}

export default Wishlist;