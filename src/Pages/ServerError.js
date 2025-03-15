import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import serverErrorImage from '../Assets/Background/servererror.webp'; // Adjust the path as necessary

function ServerError() {
    return (
        <Container 
            component="main" 
            maxWidth="xs" 
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                minHeight: '100vh', 
                bgcolor: 'background.default',
                boxShadow: 3,
                borderRadius: '8px',
                p: 3
            }}
        >
            <Box sx={{ mb: 2, textAlign: 'center' }}>
                <img 
                    src={serverErrorImage} 
                    alt="Server Error" 
                    style={{ 
                        width: '100%', 
                        height: 'auto', 
                        borderRadius: '8px' 
                    }} 
                />
            </Box>
            <Box sx={{ mb: 2 }}>
                <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom 
                    sx={{ color: 'error.main' }}
                >
                    Server Error
                </Typography>
                <Typography 
                    variant="body1" 
                    align="center" 
                    sx={{ mb: 3 }}
                >
                    Unable to connect to the server.<br />
                    Please try again later.
                </Typography>
            </Box>
        </Container>
    );
}

export default ServerError;