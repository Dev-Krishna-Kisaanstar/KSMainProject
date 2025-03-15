import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material'; // Importing MUI icon
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#e0f7fa', // Light cyan background color
        textAlign: 'center',
        padding: '20px',
    },
    icon: {
        fontSize: '100px',
        color: '#4caf50', // Green color for the icon
        marginBottom: '20px',
    },
    title: {
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#333',
    },
    message: {
        fontSize: '1.2rem',
        color: '#666',
        marginBottom: '20px',
    },
    button: {
        backgroundColor: '#4caf50',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#45a049',
        },
    },
};

const Fourzerofour = () => {
    return (
        <Container style={styles.container}>
            <ErrorOutline style={styles.icon} />
            <Typography variant="h1" style={styles.title}>
                Error 404
            </Typography>
            <Typography variant="h5" style={styles.message}>
                Page Not Found
            </Typography>
            <Button variant="contained" style={styles.button} href="/">
                Go to Home
            </Button>
        </Container>
    );
};

export default Fourzerofour;