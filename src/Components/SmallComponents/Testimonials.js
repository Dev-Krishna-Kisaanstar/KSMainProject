import React from 'react';
import { Box, Typography, Card, CardContent, Avatar, Grid } from '@mui/material';

const testimonials = [
    {
        name: 'Bonnie Tolbet',
        role: 'Customer',
        feedback:
            'There are many variations of passages of available, but the majority have suffered alteration in some form by injected humor or random words.',
        avatar: 'https://via.placeholder.com/100', // Replace with actual image URLs
    },
    {
        name: 'Sarah Albert',
        role: 'Customer',
        feedback:
            'There are many variations of passages of available, but the majority have suffered alteration in some form by injected humor or random words.',
        avatar: 'https://via.placeholder.com/100', // Replace with actual image URLs
    },
    {
        name: 'John Doe',
        role: 'Customer',
        feedback:
            'There are many variations of passages of available, but the majority have suffered alteration in some form by injected humor or random words.',
        avatar: 'https://via.placeholder.com/100', // Replace with actual image URLs
    },
];

function Testimonials() {
    return (
        <Box sx={{ backgroundColor: '#f9f9f9', py: 6 }}>
            {/* Section Heading */}
            <Box textAlign="center" mb={5}>
                <Typography
                    variant="subtitle1"
                    sx={{ fontFamily: 'Poppins, sans-serif', color: '#f8b500', fontWeight: 'bold' }} // Updated font
                >
                    Our Testimonials
                </Typography>
                <Typography
                    variant="h4"
                    sx={{ fontFamily: 'Poppins, sans-serif', color: 'black', fontWeight: 'bold', mt: 1 }} // Updated font
                >
                    What They Say
                </Typography>
            </Box>

            {/* Testimonial Cards */}
            <Grid container spacing={4} justifyContent="center">
                {testimonials.map((testimonial, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                maxWidth: 345,
                                mx: 'auto',
                                p: 3,
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                borderRadius: 2,
                                textAlign: 'center',
                                backgroundColor: 'white',
                            }}
                        >
                            <Avatar
                                src={testimonial.avatar}
                                alt={testimonial.name}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mx: 'auto',
                                    mb: 2,
                                    border: '4px solid #f8b500',
                                }}
                            />
                            <CardContent>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: 'Poppins, sans-serif', // Updated font
                                        color: '#555',
                                        mb: 3,
                                        lineHeight: '1.8rem',
                                    }}
                                >
                                    {testimonial.feedback}
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        fontFamily: 'Poppins, sans-serif', // Updated font
                                        fontWeight: 'bold',
                                        color: 'black',
                                    }}
                                >
                                    {testimonial.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        fontFamily: 'Poppins, sans-serif', // Updated font
                                        color: '#777',
                                    }}
                                >
                                    {testimonial.role}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Testimonials;