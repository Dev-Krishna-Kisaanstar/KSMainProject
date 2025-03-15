import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PinDropIcon from '@mui/icons-material/PinDrop';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Header from '../Components/SmallComponents/Header';
import Headerbar from '../Components/SmallComponents/Headerbar';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';

const phoneNumber = '+91 883 038 5928';
const emailAddress = 'info@kisaanstar.com';
const address = '4th floor, office number 401, Vishwaraj Pride, Nagar Rd, near hp petrol pump, Wagholi, Pune, Maharashtra 412207';

const buttonStyles = {
    marginTop: 2,
    fontFamily: 'Poppins, sans-serif',
};

const styles = {
    title: {
        fontFamily: 'Poppins, sans-serif',
    },
    bodyText: {
        fontFamily: 'Poppins, sans-serif',
    },
};

function Contactus() {
    return (
        <div>
            <Headerbar />
            <Header />

            <Container className="my-5">
                <div className="row">
                    <div className="col-md-6">
                        <Typography variant="h4" sx={styles.title}>Contact Us</Typography>
                        <form>
                            <TextField
                                fullWidth
                                label="Name"
                                variant="outlined"
                                margin="normal"
                                sx={{ ...styles.bodyText, marginBottom: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                margin="normal"
                                sx={{ ...styles.bodyText, marginBottom: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Message"
                                variant="outlined"
                                margin="normal"
                                multiline
                                rows={4}
                                sx={{ ...styles.bodyText, marginBottom: 2 }}
                            />
                            <Button variant="contained" sx={buttonStyles} type="submit">Send Message</Button>
                        </form>
                    </div>

                    <div className="col-md-6">
                        <Typography variant="h4" sx={styles.title}>Company Information</Typography>
                        <div className="d-flex align-items-center mb-2">
                            <PhoneInTalkIcon />
                            <Typography
                                variant="body1"
                                sx={{ ml: 2, cursor: 'pointer', ...styles.bodyText }}
                                component="a"
                                href={`tel:${phoneNumber}`}
                            >
                                {phoneNumber}
                            </Typography>
                        </div>
                        <div className="d-flex align-items-center mb-2">
                            <MailOutlineIcon />
                            <Typography
                                variant="body1"
                                sx={{ ml: 2, ...styles.bodyText }}
                                component="a"
                                href={`mailto:${emailAddress}`}
                            >
                                {emailAddress}
                            </Typography>
                        </div>
                        <div className="d-flex align-items-center mb-4">
                            <PinDropIcon />
                            <Typography
                                variant="body1"
                                sx={{ ml: 2, cursor: 'pointer', ...styles.bodyText }}
                                onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`, '_blank')}
                            >
                                Address: {address}
                            </Typography>
                        </div>
                        <Typography variant="h4" sx={styles.title}>Follow Us</Typography>
                        <div className="d-flex justify-content-start">
                            <IconButton
                                aria-label="instagram"
                                sx={{ color: '#C13584', margin: '0 5px', fontSize: '2rem' }}
                                component="a"
                                href="https://www.instagram.com/kisaanstar?igsh=YWs3d2V3MW5oejE"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <InstagramIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                                aria-label="youtube"
                                sx={{ color: '#FF0000', margin: '0 5px', fontSize: '2rem' }}
                                component="a"
                                href="https://youtube.com/@kisaanstar?si=21s_5XXHiH7HwGdO"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <YouTubeIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton
                                aria-label="linkedin"
                                sx={{ color: '#0077B5', margin: '0 5px', fontSize: '2rem' }}
                                component="a"
                                href="https://www.linkedin.com/company/kisaanstar"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <LinkedInIcon fontSize="inherit" />
                            </IconButton>
                        </div>
                    </div>
                </div>
            </Container>

            <div style={{ padding: '40px 0 0' }}>
                <Footer />
                <Footerbar />
            </div>
        </div>
    );
}

export default Contactus;