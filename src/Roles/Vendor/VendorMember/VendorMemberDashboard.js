import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Card,
    CardContent,
    Avatar,
    Typography,
    CircularProgress,
    Fade,
    styled,
    useTheme,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    TextField,
    Grid
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import StoreIcon from '@mui/icons-material/Store';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import Sidebar from '../../../Sidebars/Vendor/VendorMember/VendorMemberSidebar';

// Styled Components
const ContainerStyled = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4),
    background: '#ffffff',
    borderRadius: '16px',
    padding: theme.spacing(4),
    color: '#000000',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    display: 'flex',
}));

const AvatarStyled = styled(Avatar)({
    width: '100px',
    height: '100px',
    margin: 'auto',
    border: '3px solid #4caf50',
});

const SidebarStyled = styled(Box)(({ theme }) => ({
    width: 250,
    minHeight: '100vh',
    backgroundColor: '#4caf50', // Bright green background for the sidebar
    padding: theme.spacing(2),
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    color: '#ffffff',
}));

const CardStyled = styled(Card)(({ theme }) => ({
    background: '#e0e0e0',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    marginBottom: theme.spacing(2),
}));

const SectionTitleStyled = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    color: '#4caf50',
    margin: theme.spacing(2, 0, 1),
    fontSize: '1.5rem',
}));

const InputFieldStyled = styled(TextField)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    width: '100%',
}));

const ImageStyled = styled('img')({
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
});

// VendorMemberDashboard component
const VendorMemberDashboard = () => {
    const theme = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [vendorMember, setVendorMember] = useState(null);
    const [activeSection, setActiveSection] = useState('personalDetails');

    const fetchDashboard = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor-member/dashboard`, { withCredentials: true });
            setVendorMember(response.data.vendorMember);
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Session expired. Please log in again.');
            } else if (error.response?.status === 404) {
                setError('Vendor Member not found.');
            } else {
                setError('Failed to load dashboard. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const renderKYCDocument = (title, imageSrc, altText) => {
        return imageSrc ? (
            <Grid container spacing={2} alignItems="center" style={{ marginBottom: '16px' }}>
                <Grid item xs={6}>
                    <Typography><strong>{title}:</strong></Typography>
                </Grid>
                <Grid item xs={6}>
                    <ImageStyled src={imageSrc} alt={altText} style={{ maxHeight: '100px' }} />
                </Grid>
            </Grid>
        ) : null; // Don't render if imageSrc is null/undefined
    };

    if (loading) {
        return (
            <ContainerStyled>
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                    <CircularProgress />
                </Box>
            </ContainerStyled>
        );
    }

    if (error) {
        return (
            <ContainerStyled>
                <Typography color="error" variant="h6" align="center">{error}</Typography>
            </ContainerStyled>
        );
    }

    return (
        <div style={pageStyle}>
            <Sidebar />
            <ContainerStyled>
                <SidebarStyled>
                    <List>
                        <ListItem button onClick={() => setActiveSection('personalDetails')}>
                            <ListItemIcon><PersonIcon sx={{ color: '#ffffff' }} /></ListItemIcon>
                            <ListItemText primary="Personal Details" />
                        </ListItem>
                        <ListItem button onClick={() => setActiveSection('shopDetails')}>
                            <ListItemIcon><StoreIcon sx={{ color: '#ffffff' }} /></ListItemIcon>
                            <ListItemText primary="Shop Details" />
                        </ListItem>
                        <ListItem button onClick={() => setActiveSection('bankDetails')}>
                            <ListItemIcon><MonetizationOnIcon sx={{ color: '#ffffff' }} /></ListItemIcon>
                            <ListItemText primary="Bank Details" />
                        </ListItem>
                        <ListItem button onClick={() => setActiveSection('kycDetails')}>
                            <ListItemIcon><DescriptionIcon sx={{ color: '#ffffff' }} /></ListItemIcon>
                            <ListItemText primary="KYC Documents" />
                        </ListItem>
                    </List>
                </SidebarStyled>

                <Box flex={1} marginLeft={2}>
                    <CardStyled>
                        <CardContent>
                            <AvatarStyled src={vendorMember?.profilephoto} alt="Profile Photo">
                                <AccountCircleIcon fontSize="large" />
                            </AvatarStyled>
                            <Typography variant="h5" align="center">{vendorMember?.fullName || 'N/A'}</Typography>
                            <Typography align="center">{vendorMember?.fullAddress || 'N/A'}</Typography>
                        </CardContent>
                    </CardStyled>

                    <Fade in={true}>
                        <Grid container spacing={4}>
                            <Grid item xs={12} hidden={activeSection !== 'personalDetails'}>
                                <CardStyled>
                                    <CardContent>
                                        <SectionTitleStyled variant="h6">Personal Details</SectionTitleStyled>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>   {/* Modified width here */}
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Full Name"
                                                    defaultValue={vendorMember?.fullName || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>   {/* Modified width here */}
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Mobile Number"
                                                    defaultValue={vendorMember?.mobileNumber || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>   {/* Modified width here */}
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Alternate Mobile Number"
                                                    defaultValue={vendorMember?.alternateMobileNumber || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>   {/* Modified width here */}
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Email ID"
                                                    defaultValue={vendorMember?.emailId || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>   {/* Full width */}
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Full Address"
                                                    defaultValue={vendorMember?.fullAddress || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </CardStyled>
                            </Grid>

                            {/* Shop Details */}
                            <Grid item xs={12} hidden={activeSection !== 'shopDetails'}>
                                <CardStyled>
                                    <CardContent>
                                        <SectionTitleStyled variant="h6">Shop Details</SectionTitleStyled>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Shop Name"
                                                    defaultValue={vendorMember?.shopName || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Shop Website"
                                                    defaultValue={vendorMember?.shopWebsite || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="GST No"
                                                    defaultValue={vendorMember?.gstNo || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Shop Address"
                                                    defaultValue={vendorMember?.shopAddress || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography><strong>Shop Logo:</strong></Typography>
                                                {vendorMember?.shopLogo && (
                                                    <ImageStyled src={vendorMember.shopLogo} alt="Shop Logo" style={{ maxHeight: '100px' }} />
                                                )}
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography><strong>Shop Address Proof:</strong></Typography>
                                                {vendorMember?.shopAddressProof && (
                                                    <ImageStyled src={vendorMember.shopAddressProof} alt="Shop Address Proof" style={{ maxHeight: '100px' }} />
                                                )}
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography><strong>Shop Registration Proof:</strong></Typography>
                                                {vendorMember?.shopRegistrationProof && (
                                                    <ImageStyled src={vendorMember.shopRegistrationProof} alt="Shop Registration Proof" style={{ maxHeight: '100px' }} />
                                                )}
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </CardStyled>
                            </Grid>

                            {/* Bank Details  */}
                            <Grid item xs={12} hidden={activeSection !== 'bankDetails'}>
                                <CardStyled>
                                    <CardContent>
                                        <SectionTitleStyled variant="h6">Bank Details</SectionTitleStyled>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>   {/* Modified width here */}
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Bank Name"
                                                    defaultValue={vendorMember?.bankName || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>   {/* Modified width here */}
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Account Name"
                                                    defaultValue={vendorMember?.bankAccountName || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>   {/* Modified width here */}
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Account Number"
                                                    defaultValue={vendorMember?.bankAccountNumber || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={6}>   {/* Modified width here */}
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Bank Code"
                                                    defaultValue={vendorMember?.bankCode || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </CardStyled>
                            </Grid>

                            {/* KYC Documents */}
                            <Grid item xs={12} hidden={activeSection !== 'kycDetails'}>
                                <CardStyled>
                                    <CardContent>
                                        <SectionTitleStyled variant="h6">KYC Documents</SectionTitleStyled>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                {renderKYCDocument("PAN Card", vendorMember?.panCard, "PAN Card")}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                {renderKYCDocument("Address Proof", vendorMember?.addressProof, "Address Proof")}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                {renderKYCDocument("GST Certificate", vendorMember?.gstCertificate, "GST Certificate")}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                {renderKYCDocument("Agricultural PAN Image", vendorMember?.panImage, "Agricultural PAN Image")}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                {renderKYCDocument("Shop Act License", vendorMember?.shopActLicense, "Shop Act License")}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                {renderKYCDocument("Gram Panchayat NOC", vendorMember?.gramPanchayatNoc, "Gram Panchayat NOC")}
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="CIN No"
                                                    defaultValue={vendorMember?.cinNo || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Seed License No"
                                                    defaultValue={vendorMember?.seedLicenseNo || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Pesticides License No"
                                                    defaultValue={vendorMember?.pesticidesLicenseNo || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Fertilizer License No"
                                                    defaultValue={vendorMember?.fertilizerLicenseNo || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <InputFieldStyled
                                                    variant="outlined"
                                                    label="Other License No"
                                                    defaultValue={vendorMember?.otherLicenseNo || ''}
                                                    inputProps={{ readOnly: true }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </CardStyled>
                            </Grid>
                        </Grid>
                    </Fade>
                </Box>
            </ContainerStyled>
        </div>
    );
};

const pageStyle = {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    background: 'linear-gradient(to bottom, #1E1E2F, #33334D)', // Dark gradient background
    color: '#fff',
    paddingTop: '20px',
    flex: 1,
};

export default VendorMemberDashboard;