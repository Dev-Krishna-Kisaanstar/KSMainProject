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

// Common styles
const styles = {
    fontFamily: 'Poppins, sans-serif',
};

// IconBox component
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

// Counter component
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

            {/* Desktop Hero with overlayed multicontainer */}
            <div className="d-none d-md-block" style={{ position: 'relative' }}>
                {/* Hero Background Image */}
                <img
                    src={Hero}
                    alt="Hero Background"
                    className="img-fluid w-100"
                    style={{ maxHeight: '700px', objectFit: 'cover' }}
                />
                {/* Overlayed multicontainer positioned lower, in the middle horizontally */}
                <div
                    style={{
                        position: 'absolute',
                        top: '100%', // Adjust as needed for positioning
                        left: '50%',
                        transform: 'translateX(-50%) translateY(-50%)', // Center horizontally, move up by 50% of own height
                        width: '90%',
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex: 2,
                        padding: '20px',
                        boxSizing: 'border-box',
                    }}
                >
                    <MuiContainer
                        maxWidth="md"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)', // Elegant gradient background
                            padding: '30px',
                            borderRadius: '15px',
                            boxShadow: '0 8px 20px rgba(0,0,0,0.15)', // Softer, larger shadow
                            transition: 'transform 0.3s, box-shadow 0.3s',
                        }}
                        // Add hover effect for interactivity
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                        }}
                    >
                        <Row className="g-4" style={{ width: '100%' }}>
                            {/* Individual IconBox styling */}
                            <Col xs={12} md={4} style={{ display: 'flex', justifyContent: 'center' }}>
                                <IconBox
                                    icon={
                                        <HomeIcon
                                            fontSize="large"
                                            style={{
                                                color: '#4CAF50',
                                                transition: 'transform 0.3s',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                        />
                                    }
                                    title="Home"
                                    description="Your cozy space."
                                />
                            </Col>
                            <Col xs={12} md={4} style={{ display: 'flex', justifyContent: 'center' }}>
                                <IconBox
                                    icon={
                                        <InfoIcon
                                            fontSize="large"
                                            style={{
                                                color: '#2196F3',
                                                transition: 'transform 0.3s',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                        />
                                    }
                                    title="Information"
                                    description="Stay informed and updated."
                                />
                            </Col>
                            <Col xs={12} md={4} style={{ display: 'flex', justifyContent: 'center' }}>
                                <IconBox
                                    icon={
                                        <CheckIcon
                                            fontSize="large"
                                            style={{
                                                color: '#FF9800',
                                                transition: 'transform 0.3s',
                                            }}
                                            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                                            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                                        />
                                    }
                                    title="Success"
                                    description="Achieve your goals."
                                />
                            </Col>
                        </Row>
                    </MuiContainer>
                </div>
                {/* Static text overlay on background, aligned to the left */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '20px', // Adjust as needed for spacing from the left edge
                    transform: 'translateY(-50%)', // Only translate vertically
                    zIndex: 1,
                    padding: '20px',
                    maxWidth: '50%', // Optional: limit width for better layout
                }}>
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

            {/* Mobile Version */}
            <div className="d-block d-md-none" style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
                {/* Hero Image with overlay text and button on the left */}
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <img
                        src={Hero}
                        alt="Hero Background"
                        className="img-fluid w-100"
                        style={{ maxHeight: '435px', objectFit: 'cover', display: 'block' }}
                    />
                    {/* Overlay Text and Button aligned to the left */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '20px', // Padding from the left
                            transform: 'translateY(-50%)',
                            maxWidth: '70%', // Optional: limit width for better readability
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '15px',
                            borderRadius: '10px',
                        }}
                    >
                        <h1 style={{ color: '#fff', fontSize: '1.8rem', marginBottom: '15px', fontWeight: '600' }}>Your Mobile Heading Here</h1>
                        <Button
                            variant="contained"
                            style={{
                                backgroundColor: '#1976d2',
                                color: '#fff',
                                padding: '10px 20px',
                                fontSize: '1rem',
                                borderRadius: '8px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                transition: 'background-color 0.3s, transform 0.2s',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1565c0')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1976d2')}
                        >
                            Click Me
                        </Button>
                    </div>
                </div>

                {/* Icons Section with attractive cards */}
                <MuiContainer
                    style={{
                        maxWidth: '90%',
                        marginTop: '30px',
                        padding: '20px',
                        backgroundColor: 'white',
                        borderRadius: '12px',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    }}
                >
                    <Row className="justify-content-center g-4">
                        {/* Icon Card 1 */}
                        <Col xs={12} sm={6} md={4}>
                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    textAlign: 'center',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#4CAF50' }}>
                                    <HomeIcon fontSize="inherit" />
                                </div>
                                <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Home</h3>
                                <p style={{ fontSize: '0.95rem', color: '#555' }}>Your cozy space.</p>
                            </div>
                        </Col>
                        {/* Icon Card 2 */}
                        <Col xs={12} sm={6} md={4}>
                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    textAlign: 'center',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#2196F3' }}>
                                    <InfoIcon fontSize="inherit" />
                                </div>
                                <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Information</h3>
                                <p style={{ fontSize: '0.95rem', color: '#555' }}>Stay informed and updated.</p>
                            </div>
                        </Col>
                        {/* Icon Card 3 */}
                        <Col xs={12} sm={6} md={4}>
                            <div
                                style={{
                                    backgroundColor: '#ffffff',
                                    padding: '20px',
                                    borderRadius: '12px',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                    textAlign: 'center',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                                }}
                            >
                                <div style={{ fontSize: '2.5rem', marginBottom: '15px', color: '#FF9800' }}>
                                    <CheckIcon fontSize="inherit" />
                                </div>
                                <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', fontWeight: '600', color: '#333' }}>Success</h3>
                                <p style={{ fontSize: '0.95rem', color: '#555' }}>Achieve your goals.</p>
                            </div>
                        </Col>
                    </Row>
                </MuiContainer>
            </div>

            {/* Product List */}
            <div style={{ padding: '100px 0' }}>
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

            {/* Other Content */}
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

            {/* Product Slider */}
            <div style={{ padding: '40px 0' }}>
                <ProductSlider />
            </div>

            {/* Footer Section */}
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

                    {/* Desktop Additional Content */}
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

                    {/* Mobile Additional Content */}
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

            {/* Final Footer */}
            <div style={{ padding: '40px 0 0' }}>
                <Footer />
                <Footerbar />
            </div>
        </div>
    );
}

export default Home;