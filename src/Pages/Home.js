import React, { useState, useEffect } from 'react';  
import { Typography, Button, Box, Grid, Container as MuiContainer } from '@mui/material'; 
import Hero from '../Assets/Background/Home.png'; 
import Headerbar from '../Components/SmallComponents/Headerbar';
import Header from '../Components/SmallComponents/Header';
import { Container, Row, Col, Card } from 'react-bootstrap'; 
import HomeIcon from '@mui/icons-material/Home'; 
import InfoIcon from '@mui/icons-material/Info'; 
import CheckIcon from '@mui/icons-material/Check'; 
import ProductList from '../Components/Productlist';
import ProductSlider from '../Components/SmallComponents/ProductSlider';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';

// Define common styles for fontFamily
const styles = {
    fontFamily: 'Poppins, sans-serif',
};

function IconBox({ icon, title, description }) {
    return (
        <Box textAlign="center" p={2} border={1} borderColor="grey.300" borderRadius={4}>
            {icon}
            <Typography variant="h6" style={{ ...styles, fontWeight: 'bold', marginTop: '10px' }}>
                {title}
            </Typography>
            <Typography variant="body2" color="textSecondary" style={styles}>
                {description}
            </Typography>
        </Box>
    );
}

const Counter = ({ title, targetNumber, percentage, color }) => {
    const [currentNumber, setCurrentNumber] = useState(0);

    useEffect(() => {
        const duration = 2000; 
        const incrementTime = 50; 
        const totalSteps = duration / incrementTime; 
        const incrementValue = Math.ceil(targetNumber / totalSteps); 

        let count = 0;
        const interval = setInterval(() => {
            count += incrementValue;
            if (count >= targetNumber) {
                clearInterval(interval);
                count = targetNumber; 
            }
            setCurrentNumber(count);
        }, incrementTime);

        return () => clearInterval(interval); 
    }, [targetNumber]);

    // Calculate circle properties
    const circleSize = 150; 
    const strokeWidth = 15; 
    const radius = (circleSize - strokeWidth) / 2; 
    const circumference = 2 * Math.PI * radius; 
    const offset = circumference - (percentage / 100) * circumference; 

    return (
        <Box textAlign="center" position="relative" marginBottom={4}>
            <svg width={circleSize} height={circleSize}>
                <circle
                    stroke="#e6e6e6" 
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    r={radius}
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                />
                <circle
                    stroke={color} 
                    fill="transparent"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={circleSize / 2}
                    cy={circleSize / 2}
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>
            <Typography variant="h4" style={{ ...styles, color, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                {currentNumber}
            </Typography>
            <Typography variant="subtitle1" style={styles}>{title}</Typography>
        </Box>
    );
}

const buttonStyles = {
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
        backgroundColor: 'darkgreen',
    },
};

// Column Style
const columnStyle = {
    backgroundImage: `url(${Hero})`, 
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#000',
    borderRadius: '10px',
    padding: '20px',
    margin: '10px',
    minHeight: '250px',
};

// Text Container Style
const textContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '20px',
    transform: 'translateY(-50%)',
    color: '#000',
    zIndex: 2,
};

function Home() {
    return (
        <div style={{ overflowX: 'hidden', margin: '0' }}> 
            <Headerbar />
            <Header />

            {/* Desktop Version */}
            <div className="d-none d-md-block">
                <div className="position-relative">
                    <img
                        src={Hero}
                        alt="Hero Background"
                        className="img-fluid w-100"
                        style={{ maxHeight: '700px', objectFit: 'cover' }}
                    />
                    <div className="position-absolute top-50 start-0" style={{ zIndex: 1 }}>
                        <div style={{ transform: 'translateY(-50%)', paddingLeft: '20px' }}>
                            <Typography
                                variant="h2"
                                style={{ ...styles, fontSize: '3.5rem', fontWeight: 'bold', textShadow: '1px 1px 4px rgba(0, 0, 0, 0.7)', lineHeight: '1.2', color: 'black', marginBottom: '10px' }}
                            >
                                Quality Agricultural
                            </Typography>
                            <h4 style={{ ...styles, color: 'green' }}>
                                <b>Products for Every Farmer's Success</b>
                            </h4>
                            <Button
                                variant="contained"
                                sx={buttonStyles}
                                style={{ marginTop: '20px' }}
                            >
                                Let's Connect
                            </Button>
                        </div>
                    </div>
                </div>

                {/* <MuiContainer
                    style={{
                        maxWidth: '1050px',
                        position: 'absolute',
                        zIndex: 1,
                        bottom: '-20%',
                        left: '50%',
                        transform: 'translate(-50%, 50%)',
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        overflowX: 'hidden'
                    }}
                >
                    <Row className="justify-content-center">
                        <Col xs={12} md={4}>
                            <IconBox icon={<HomeIcon fontSize="large" />} title="Home" description="Your cozy space." />
                        </Col>
                        <Col xs={12} md={4}>
                            <IconBox icon={<InfoIcon fontSize="large" />} title="Information" description="Stay informed and updated." />
                        </Col>
                        <Col xs={12} md={4}>
                            <IconBox icon={<CheckIcon fontSize="large" />} title="Success" description="Achieve your goals." />
                        </Col>
                    </Row>
                </MuiContainer> */}
            </div>

            {/* Mobile Version */}
            <div className="d-block d-md-none">
                <div className="position-relative">
                    <img
                        src={Hero}
                        alt="Hero Background"
                        className="img-fluid w-100"
                        style={{ maxHeight: '435px', objectFit: 'cover' }}
                    />
                    <div style={textContainerStyle}>
                        <h1 style={styles}>Your Mobile Heading Here</h1>
                        <Button variant="contained" style={buttonStyles}>
                            Click Me
                        </Button>
                    </div>
                </div>

                <MuiContainer
                    style={{
                        maxWidth: '90%',
                        marginTop: '20px',
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        overflowX: 'hidden'
                    }}
                >
                    <Row className="justify-content-center">
                        <Col xs={12} md={4}>
                            <IconBox icon={<HomeIcon fontSize="large" />} title="Home" description="Your cozy space." />
                        </Col>
                        <Col xs={12} md={4}>
                            <IconBox icon={<InfoIcon fontSize="large" />} title="Information" description="Stay informed and updated." />
                        </Col>
                        <Col xs={12} md={4}>
                            <IconBox icon={<CheckIcon fontSize="large" />} title="Success" description="Achieve your goals." />
                        </Col>
                    </Row>
                </MuiContainer>
            </div>

            {/* Products and Other Content */}
            <div style={{ padding: '50px 0' }}>
                <ProductList />
            </div>

            {/* Counter Section */}
            <MuiContainer className="text-center my-5" sx={{ backgroundColor: '#ECEEEB', borderRadius: '30px', padding: '40px' }}>
                <Typography variant="h4" style={{ marginBottom: '40px', ...styles }}>Our Achievements</Typography>
                <Grid container spacing={4} justifyContent="center">
                    <Grid item xs={12} sm={6} md={3}>
                        <Counter title="Our Clients" targetNumber={1500} percentage={90} color="#28a745" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Counter title="Our Services" targetNumber={25} percentage={50} color="#007bff" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Counter title="Our Targets" targetNumber={100} percentage={75} color="#ffc107" />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Counter title="Our Products" targetNumber={500} percentage={60} color="#dc3545" />
                    </Grid>
                </Grid>
            </MuiContainer>

            <div className="container text-center" style={{ overflowX: 'hidden' }}> 
                <div className="row">
                    <div className="col" style={columnStyle}>
                        <div style={{ textAlign: 'left' }}>
                            <p style={styles}>Lorem ipsum dolor sit amet.</p>
                            <h4 style={styles}>Hello Here we go</h4>
                            <Button variant="contained" style={buttonStyles}>
                                Order Now
                            </Button>
                        </div>
                    </div>
                    <div className="col" style={columnStyle}>
                        <div style={{ textAlign: 'left' }}>
                            <p style={styles}>Lorem ipsum dolor sit amet.</p>
                            <h4 style={styles}>Hello Here we go</h4>
                            <Button variant="contained" style={buttonStyles}>
                                Order Now
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ padding: '40px 0' }}>
                <ProductSlider />
            </div>

            <MuiContainer className="text-center" style={{ paddingTop: '20px', overflowX: 'hidden' }}> 
                <Row>
                    <Col>
                        <img
                            src={Hero}
                            alt="Description of the image"
                            className="img-fluid"
                            style={{ maxHeight: '300px', objectFit: 'cover', width: '100%' }} 
                        />
                    </Col>

                    {/* Desktop Version */}
                    <Col md={12} className="d-none d-md-block">
                        <h2 style={styles}>Your Heading Here</h2>
                        <p style={styles}>Your description goes here. Give a brief and meaningful context about your content.</p>
                        <div className="d-flex justify-content-around mt-4">
                            <Card className="text-center" style={{ width: 'calc(50% - 20px)', maxWidth: '400px' }}>
                                <Card.Body>
                                    <Card.Text>
                                        <IconBox
                                            icon={<HomeIcon fontSize="large" />}
                                            title="Home"
                                            description="Your cozy space."
                                        />
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="text-center" style={{ width: 'calc(50% - 20px)', maxWidth: '400px' }}>
                                <Card.Body>
                                    <Card.Text>
                                        <IconBox
                                            icon={<InfoIcon fontSize="large" />}
                                            title="Information"
                                            description="Stay informed."
                                        />
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    {/* Mobile Version */}
                    <Col xs={12} className="d-block d-md-none text-center">
                        <h2 className="h5" style={styles}>Your Mobile Heading Here</h2>
                        <p style={styles}>Your mobile description goes here. Provide meaningful context for mobile users.</p>
                        <div className="mt-3">
                            <Card className="mb-3" style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Text>
                                        <IconBox
                                            icon={<HomeIcon fontSize="large" />}
                                            title="Home"
                                            description="Your cozy space."
                                        />
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                            <Card className="mb-3" style={{ width: '100%' }}>
                                <Card.Body>
                                    <Card.Text>
                                        <IconBox
                                            icon={<InfoIcon fontSize="large" />}
                                            title="Information"
                                            description="Stay informed."
                                        />
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>
                </Row>
            </MuiContainer>

            <div style={{ padding: '40px 0 0' }}>
                <Footer />
                <Footerbar />
            </div>
        </div>
    );
}

export default Home;