import React, { useEffect,useState  } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    Container,
    Card,
    CardContent,
    CardHeader,
    TextField,
    Typography,
    Button,
    CircularProgress,
    Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import VerifiedIcon from '@mui/icons-material/Verified';
import CallIcon from '@mui/icons-material/Call';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import FarmerIcon from '../Assets/Logo/farmervector.webp';
import Headerbar from '../Components/SmallComponents/Headerbar';
import Header from '../Components/SmallComponents/Header';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';
import CxprofileSidebar from '../Components/CxprofileSidebar/Cxprofilesidebar';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Removed the duplicate useState and instead passed setCustomerID as a prop
const ViewProfile = ({ setCustomerId }) => {
    const navigate = useNavigate(); // Import and use the navigate function directly
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [updatedCustomer, setUpdatedCustomer] = useState({});
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState('');
    const [isMobile, setIsMobile] = useState(false);

    const fetchDashboard = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/customers/dashboard`,
                { withCredentials: true }
            );
    
            console.log("Dashboard API Response:", response.data); // Log full API response
    
            if (response.data && response.data.customer) {
                const fetchedCustomer = response.data.customer;
                console.log("Extracted Customer:", fetchedCustomer); // Log extracted customer
    
                setCustomer(fetchedCustomer);
    
                if (fetchedCustomer.customer_id) {
                    localStorage.setItem('customerId', fetchedCustomer.customer_id);
                    setCustomerId(fetchedCustomer.customer_id);
                    console.log("Stored Customer ID:", fetchedCustomer.customer_id); // Confirm storage
                }
            } else {
                console.warn('No customer data found in the response.');
            }
        } catch (error) {
            console.error("Error fetching dashboard:", error);
            if (error.response && error.response.status === 401) {
                setError('Session expired. Please log in again.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    

    useEffect(() => {
        fetchDashboard();
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleEdit = () => {
        setUpdatedCustomer({ ...customer });
        setIsEditing(true);
    };

    const handleSave = async () => {
        const token = Cookies.get('customerSession');
        if (!token) {
            setMessage('No token found, please log in again.');
            return;
        }

        try {
            setLoading(true);
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/customers/update`,
                updatedCustomer,
                { withCredentials: true }
            );

            setCustomer(response.data.customer);
            setIsEditing(false);
            setMessage('Profile updated successfully!');
            fetchDashboard();
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error updating profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setUpdatedCustomer((prev) => ({ ...prev, [field]: value }));
    };

    const handleButtonClick = (path) => {
        if (customer?.customer_id) {
            console.log(`Navigating to: ${path}/${customer.customer_id}`);
            navigate(`${path}/${customer.customer_id}`);
        } else {
            console.log(`Navigating to: ${path} (No customer ID found)`);
            navigate(path);
        }
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
                                    width: 'calc(100% - 16px)' // Full width minus margins 
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
                
                <Row>
                    {/* Sidebar */}
                    <Col xs={12} md={3}>
                        <CxprofileSidebar />
                    </Col>

                    {/* Main Content */}
                    <Col xs={12} md={9}>
                        {error && (
                            <Typography color="error" variant="h6" align="center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                {error}
                            </Typography>
                        )}
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
                                <CircularProgress />
                            </div>
                        ) : customer ? (
                            <>
                                {/* Customer Profile Card */}
                                <Card className="mb-4 rounded-3">
                                    <CardHeader
                                        avatar={
                                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                <img
                                                    src={FarmerIcon}
                                                    alt="Farmer Icon"
                                                    style={{
                                                        width: '100px',
                                                        height: '100px',
                                                        borderRadius: '50%',
                                                    }}
                                                    className="img-fluid"
                                                />
                                            </div>
                                        }
                                        title={
                                            <Typography
                                                variant="h5"
                                                className="fw-bold"
                                                align="center"
                                            >
                                                {customer.fullName || 'N/A'}
                                            </Typography>
                                        }
                                        subheader={
                                            <Typography
                                                variant="body2"
                                                className="text-muted"
                                                align="center"
                                            >
                                                {customer.mobileNumber || 'N/A'}
                                            </Typography>
                                        }
                                        action={
                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
                                                <Button
                                                    variant="contained"
                                                    style={{ backgroundColor: '#4BAF47', color: '#FFFFFF', marginTop: 5, borderRadius: '25px', textTransform: 'none' }}
                                                    onClick={() => (window.location.href = `tel:${customer.mobileNumber}`)}
                                                >
                                                    <CallIcon style={{ color: '#FFFFFF', marginRight: '5px' }} />
                                                    Call Now!
                                                </Button>
                                                <Typography
                                                    variant="body2"
                                                    style={{ marginTop: 10, textAlign: 'center', color: '#000' }}
                                                >
                                                    {customer.registeredBy}
                                                </Typography>
                                            </div>
                                        }
                                        style={{
                                            textAlign: 'center',
                                            backgroundColor: '#f5f5f5',
                                            padding: '20px',
                                        }}
                                    />

                                    <CardContent>
                                        <Row className="gy-3">
                                            <Col xs={12} md={6}>
                                                <TextField
                                                    label="Full Name"
                                                    value={isEditing ? updatedCustomer.fullName || '' : customer.fullName || 'N/A'}
                                                    onChange={(e) => handleChange('fullName', e.target.value)}
                                                    disabled={!isEditing}
                                                    fullWidth
                                                    InputProps={{
                                                        style: { fontFamily: 'Poppins, sans-serif' }
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <TextField
                                                    label="Mobile Number"
                                                    value={customer.mobileNumber || 'N/A'}
                                                    disabled
                                                    fullWidth
                                                    InputProps={{
                                                        style: { fontFamily: 'Poppins, sans-serif' }
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <TextField
                                                    label="Alternate Mobile Number"
                                                    value={isEditing ? updatedCustomer.alternateMobileNumber || '' : customer.alternateMobileNumber || 'N/A'}
                                                    onChange={(e) => handleChange('alternateMobileNumber', e.target.value)}
                                                    disabled={!isEditing}
                                                    fullWidth
                                                    InputProps={{
                                                        style: { fontFamily: 'Poppins, sans-serif' }
                                                    }}
                                                />
                                            </Col>
                                            <Col xs={12} md={6}>
                                                <TextField
                                                    label="Registration Date"
                                                    value={customer.registrationDate ? new Date(customer.registrationDate).toLocaleDateString() : 'N/A'}
                                                    disabled
                                                    fullWidth
                                                    InputProps={{
                                                        style: { fontFamily: 'Poppins, sans-serif' }
                                                    }}
                                                />
                                            </Col>
                                        </Row>
                                        <Button
                                            variant="contained"
                                            className="mt-3 w-30"
                                            style={{
                                                backgroundColor: '#4BAF47',
                                                color: '#FFFFFF',
                                                borderRadius: '20px',
                                                height: '40px',
                                                fontSize: '14px',
                                                padding: '8px 16px',
                                            }}
                                            onClick={isEditing ? handleSave : handleEdit}
                                            startIcon={isEditing ? <SaveIcon style={{ color: '#fff' }} /> : <EditIcon style={{ color: '#fff' }} />}
                                        >
                                            {isEditing ? 'Save Changes' : 'Edit Profile'}
                                        </Button>
                                    </CardContent>
                                </Card>

                                {/* Features Section */}
                                <Typography variant="h5" className="mt-5 mb-4 text-center" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                    Our Features
                                </Typography>
                                <Row className="gy-3">
                                    <Col xs={12} md={4}>
                                        <Card className="h-100">
                                            <CardContent>
                                                <AgricultureIcon style={{ fontSize: 40, color: '#4BAF47' }} />
                                                <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>Extensive Range</Typography>
                                                <Typography variant="body2" className="text-muted" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    We offer the most extensive range of agricultural products. Offering variety to our customers is our forte.
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Card className="h-100">
                                            <CardContent>
                                                <VerifiedIcon style={{ fontSize: 40, color: '#4BAF47' }} />
                                                <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>Best Quality</Typography>
                                                <Typography variant="body2" className="text-muted" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    We provide the best quality products, ensuring durability and trust.
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                    <Col xs={12} md={4}>
                                        <Card className="h-100">
                                            <CardContent>
                                                <MonetizationOnIcon style={{ fontSize: 40, color: '#4BAF47' }} />
                                                <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>Affordable Rates</Typography>
                                                <Typography variant="body2" className="text-muted" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                                    Best products at pocket-friendly prices to support our farmer community.
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Col>
                                </Row>
                            </>
                        ) : (
                            <Typography variant="h6" color="error" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                                {error || 'No data available.'}
                            </Typography>
                        )}
                    </Col>
                </Row>
            </Container>
            <Footer />
            <Footerbar />
        </>
    );
};

export default ViewProfile;