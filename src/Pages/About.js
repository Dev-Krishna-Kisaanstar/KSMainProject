import React from 'react';
import { Box, Button, Typography } from '@mui/material'; 
import Hero from '../Assets/Background/Home.png'; 
import Headerbar from '../Components/SmallComponents/Headerbar';
import Header from '../Components/SmallComponents/Header';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';
import Testimonials from '../Components/SmallComponents/Testimonials'; 
// import FarmersImage1 from '../Assets/Farmers/farmer1.png'; 
// import FarmersImage2 from '../Assets/Farmers/farmer2.png'; 
// import FarmersImage3 from '../Assets/Farmers/farmer3.png'; 
// import FounderImage from '../Assets/Founders/founder.png'; // Replace with the actual path
// import CoFounderImage from '../Assets/Founders/cofounder.png'; // Replace with the actual path
// import ManagerImage from '../Assets/Founders/manager.png'; // Replace with the actual path

const buttonStyles = {
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
        backgroundColor: 'darkgreen',
    },
};

function About() {
    return (
        <div>
            <Headerbar />
            <Header />

            <div className="container">
                {/* Section Header */}
                <div className="text-center my-5">
                    <h2 style={{ fontFamily: 'Exo, sans-serif', color: 'black', fontSize: '2rem', fontWeight: 'bold' }}>
                        Get to Know Us
                    </h2>
                    <p style={{ fontFamily: 'Inter, sans-serif', color: '#555' }}>
                        The Best Agriculture Market
                    </p>
                </div>

                {/* Content Section */}
                <div className="row align-items-center">
                    {/* Image Section */}
                    <div className="col-md-6 position-relative">
                        <img
                            src={Hero}
                            alt="Hero Background"
                            className="img-fluid"
                            style={{
                                width: '450px',
                                height: '601px',
                                position: 'relative',
                                left: '15px',
                                borderRadius: '10px',
                                objectFit: 'cover',
                            }}
                        />
                        <img
                            src={Hero}
                            alt="Overlay Image"
                            className="img-fluid"
                            style={{
                                width: '290px',
                                height: '321px',
                                position: 'absolute',
                                top: '280px',
                                left: '-105px',
                                borderRadius: '10px',
                                objectFit: 'cover',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                            }}
                        />
                    </div>

                    {/* Text Section */}
                    <div className="col-md-6">
                        <Box textAlign="left">
                            <h1 style={{ fontFamily: 'Exo, sans-serif', color: 'black', fontWeight: 'bold', fontSize: '2.5rem' }}>
                                The Best Agriculture Market
                            </h1>
                            <p style={{ fontFamily: 'Inter, sans-serif', color: '#555', lineHeight: '1.6rem' }}>
                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration. 
                                There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration 
                                in some form by injected humor or random words which don't look even.
                            </p>
                            <ul style={{ color: '#555', lineHeight: '1.8rem', paddingLeft: '20px' }}>
                                <li>Suspensisse suscipit sagittis leo</li>
                                <li>Entum estibulum dignissim posuere</li>
                                <li>Lorem ipsum on the tend to repeat</li>
                            </ul>
                            <Box mt={3}>
                                <Button variant="contained" sx={buttonStyles} style={{ marginRight: '10px' }}>
                                    Discover More
                                </Button>
                                <Button variant="contained" sx={buttonStyles}>
                                    Get Started
                                </Button>
                            </Box>
                        </Box>
                    </div>
                </div>
            </div>

            {/* Founder, Co-Founder, and Manager Section */}
            <div className="container my-5">
                <div className="text-center mb-4">
                    <h2 style={{ fontFamily: 'Exo, sans-serif', color: 'black', fontSize: '2rem', fontWeight: 'bold' }}>
                        Meet Our Team
                    </h2>
                </div>
                <div className="row">
                    {/* Founder */}
                    <div className="col-md-4 text-center">
                        <img 
                            src={Hero} 
                            alt="Founder" 
                            className="img-fluid" 
                            style={{ borderRadius: '10px', objectFit: 'cover', height: '300px' }} 
                        />
                        <Typography variant="h5" component="h5" style={{ fontFamily: 'Exo, sans-serif', margin: '10px 0', color: 'black' }}>
                            Founder Name
                        </Typography>
                        <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#555' }}>
                            Short description about the founder.
                        </Typography>
                    </div>

                    {/* Co-Founder */}
                    <div className="col-md-4 text-center">
                        <img 
                            src={Hero} 
                            alt="Co-Founder" 
                            className="img-fluid" 
                            style={{ borderRadius: '10px', objectFit: 'cover', height: '300px' }} 
                        />
                        <Typography variant="h5" component="h5" style={{ fontFamily: 'Exo, sans-serif', margin: '10px 0', color: 'black' }}>
                            Co-Founder Name
                        </Typography>
                        <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#555' }}>
                            Short description about the co-founder.
                        </Typography>
                    </div>

                    {/* Manager */}
                    <div className="col-md-4 text-center">
                        <img 
                            src={Hero} 
                            alt="Manager" 
                            className="img-fluid" 
                            style={{ borderRadius: '10px', objectFit: 'cover', height: '300px' }} 
                        />
                        <Typography variant="h5" component="h5" style={{ fontFamily: 'Exo, sans-serif', margin: '10px 0', color: 'black' }}>
                            Manager Name
                        </Typography>
                        <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#555' }}>
                            Short description about the manager.
                        </Typography>
                    </div>
                </div>
            </div>

            {/* Video Section with Overlay Text */}
            <div className="container my-5">
                <div className="text-center mb-4">
                    <h2 style={{ fontFamily: 'Exo, sans-serif', color: 'black', fontSize: '2rem', fontWeight: 'bold' }}>
                        Give Your Plants a New Life with Kisaanstar
                    </h2>
                </div>
                <div className="position-relative">
                    <video 
                        controls 
                        style={{ 
                            width: '100%', 
                            borderRadius: '10px',
                            marginBottom: '20px' 
                        }}
                    >
                        <source src="path/to/your/video.mp4" type="video/mp4" /> {/* Replace with your video path */}
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>

            {/* Testimonials Section */}
            <Testimonials />

            {/* Meet Our Farmers Section */}
            <div className="container my-5">
                <div className="text-center mb-4">
                    <h2 style={{ fontFamily: 'Exo, sans-serif', color: 'black', fontSize: '2rem', fontWeight: 'bold' }}>
                        Meet Our Farmers
                    </h2>
                </div>
                <div className="row">
                    {/* Farmer 1 */}
                    <div className="col-md-4 position-relative">
                        <img 
                            src={Hero} 
                            alt="Farmer 1" 
                            className="img-fluid" 
                            style={{ borderRadius: '10px', objectFit: 'cover', height: '300px' }} 
                        />
                        <Box 
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '5px',
                                padding: '10px',
                                zIndex: 1,
                            }}
                        >
                            <Typography variant="h5" component="h5" style={{ fontFamily: 'Exo, sans-serif', margin: 0, color: 'black' }}>
                                Farmer Name 1
                            </Typography>
                            <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#555' }}>
                                Short description about Farmer 1.
                            </Typography>
                        </Box>
                    </div>

                    {/* Farmer 2 */}
                    <div className="col-md-4 position-relative">
                        <img 
                            src={Hero} 
                            alt="Farmer 2" 
                            className="img-fluid" 
                            style={{ borderRadius: '10px', objectFit: 'cover', height: '300px' }} 
                        />
                        <Box 
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '5px',
                                padding: '10px',
                                zIndex: 1,
                            }}
                        >
                            <Typography variant="h5" component="h5" style={{ fontFamily: 'Exo, sans-serif', margin: 0, color: 'black' }}>
                                Farmer Name 2
                            </Typography>
                            <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#555' }}>
                                Short description about Farmer 2.
                            </Typography>
                        </Box>
                    </div>

                    {/* Farmer 3 */}
                    <div className="col-md-4 position-relative">
                        <img 
                            src={Hero} 
                            alt="Farmer 3" 
                            className="img-fluid" 
                            style={{ borderRadius: '10px', objectFit: 'cover', height: '300px' }} 
                        />
                        <Box 
                            style={{
                                position: 'absolute',
                                bottom: '10px',
                                right: '10px',
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                borderRadius: '5px',
                                padding: '10px',
                                zIndex: 1,
                            }}
                        >
                            <Typography variant="h5" component="h5" style={{ fontFamily: 'Exo, sans-serif', margin: 0, color: 'black' }}>
                                Farmer Name 3
                            </Typography>
                            <Typography variant="body2" style={{ fontFamily: 'Inter, sans-serif', color: '#555' }}>
                                Short description about Farmer 3.
                            </Typography>
                        </Box>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '40px 0 0' }}>
                <Footer />
                <Footerbar />
            </div>
        </div>
    );
}

export default About;