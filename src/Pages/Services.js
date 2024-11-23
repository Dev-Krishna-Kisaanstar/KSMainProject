import React from 'react';
import Headerbar from '../Components/SmallComponents/Headerbar';
import Header from '../Components/SmallComponents/Header';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';
import Hero from '../Assets/Background/Home.png';
import { Container, Grid, Typography } from '@mui/material';
import { 
  Accessibility, 
  LocalFlorist,  // Alternative for Eco
  AttachMoney 
} from '@mui/icons-material';

function Services() {
    return (
        <div>
            <Headerbar />
            <Header />
            <div className="container my-5">

                {/* Our Services Section */}
                <div className="text-center mt-5 mb-4">
                    <h2 style={{ fontFamily: 'Exo, sans-serif', color: 'black', fontSize: '2rem', fontWeight: 'bold' }}>
                        Our Services
                    </h2>
                </div>
                <div className="row">
                    {[...Array(3)].map((_, index) => (
                        <div className="col-md-4 text-center mb-4" key={index}>
                            <div className="card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                <img
                                    src={Hero}
                                    alt={`Service ${index + 1}`}
                                    className="card-img-top"
                                    style={{ height: '150px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title" style={{ fontFamily: 'Exo, sans-serif' }}>Service {index + 1}</h5>
                                    <p className="card-text" style={{ fontFamily: 'Inter, sans-serif', color: '#555' }}>
                                        Brief description of Service {index + 1}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Logo Section */}
                <div className="text-center mb-4">
                    <h2 style={{ fontFamily: 'Exo, sans-serif', color: 'black', fontSize: '2rem', fontWeight: 'bold' }}>
                        We Have Worked With
                    </h2>
                </div>

                <div style={styles.logoSection}>
                    <div className="row text-center">
                        {[...Array(4)].map((_, index) => (
                            <div className="col-md-3 mb-4" key={index}>
                                <img
                                    src={Hero}
                                    alt={`Logo ${index + 1}`}
                                    className="img-fluid"
                                    style={{ maxHeight: '100px', objectFit: 'contain', position: 'relative', zIndex: 1 }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="container text-center" style={{ padding: '20px' }}>
                    <div className="row">
                        <div className="col-md-6" style={{ padding: '20px' }}>
                            <div className="text-center mt-5 mb-4">
                                <h2
                                    style={{
                                        fontFamily: 'Exo, sans-serif',
                                        color: 'black',
                                        fontSize: '2rem',
                                        fontWeight: 'bold'
                                    }}>
                                    Agriculture Matters to the Future of Development
                                </h2>
                            </div>
                        </div>
                        <div className="col-md-6" style={{ padding: '20px' }}>
                            <iframe
                                title="Background Video"
                                src="https://www.youtube.com/embed/1z7xBwpBdDg?autoplay=1&loop=1&playlist=1z7xBwpBdDg&mute=1"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    aspectRatio: '16 / 9',
                                    borderRadius: '10px'
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Why Choose Us Section */}
                <div className="text-center mt-5 mb-4">
                    <h2 style={{ fontFamily: 'Exo, sans-serif', color: 'black', fontSize: '2rem', fontWeight: 'bold' }}>
                        Why Choose Us
                    </h2>
                </div>
                <div className="row">
                    {[...Array(3)].map((_, index) => (
                        <div className="col-md-4 text-center mb-4" key={index}>
                            <div className="card" style={{ borderRadius: '10px', overflow: 'hidden' }}>
                                <img
                                    src={Hero}
                                    alt={`Feature ${index + 1}`}
                                    className="card-img-top"
                                    style={{ height: '150px', objectFit: 'cover' }}
                                />
                                <div className="card-body">
                                    <h5 className="card-title" style={{ fontFamily: 'Exo, sans-serif' }}>Feature {index + 1}</h5>
                                    <p className="card-text" style={{ fontFamily: 'Inter, sans-serif', color: '#555' }}>
                                        Brief description of Feature {index + 1}.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                 {/* Extra Feature Section */}
                 <Container textAlign="center" className="mb-4">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <img
                                src={Hero}
                                alt={`Feature Extra`}
                                className="card-img-top"
                                style={{ borderRadius: '10px', width: '100%' }} // Responsive width
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Typography variant="h4" component="h4" style={{ fontFamily: 'Exo, sans-serif', marginBottom: '20px' }}>
                                Extra Feature Title
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                Lorem ipsum dolor sit amet consectetur adipiscing elit placerat class integer, fringilla rhoncus aenean donec est proin massa ligula sociis.
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '40px' }}>
                                Neque fames a dictumst risus facilisi nisl suscipit cras posuere velit, tempor vivamus laoreet euismod class lacus ullamcorper sociosqu vehicula.
                            </Typography>

                            {/* Icons Section */}
                            <Grid container spacing={2} justifyContent="center">
                                <Grid item container direction="column" alignItems="center" xs>
                                    <Accessibility color="primary" style={{ fontSize: '40px' }} />
                                    <Typography variant="subtitle1" style={{ marginTop: '8px' }}>Accessibility</Typography>
                                </Grid>
                                <Grid item container direction="column" alignItems="center" xs>
                                    <LocalFlorist color="green" style={{ fontSize: '40px' }} />
                                    <Typography variant="subtitle1" style={{ marginTop: '8px' }}>Sustainability</Typography>
                                </Grid>
                                <Grid item container direction="column" alignItems="center" xs>
                                    <AttachMoney color="secondary" style={{ fontSize: '40px' }} />
                                    <Typography variant="subtitle1" style={{ marginTop: '8px' }}>Affordability</Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Container>

            </div>
            <Footer />
            <Footerbar />
        </div>
    );
}

// Internal CSS styles
const styles = {
    logoSection: {
        position: 'relative',
        padding: '20px 0',
        backgroundColor: 'rgba(211, 211, 211, 0.5)', // Light gray background
        borderRadius: '5px',
        overflow: 'hidden',
    },
};

export default Services;