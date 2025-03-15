import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Paper,
    CircularProgress,
    Button,
    TextField,
    Grid,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ListAltIcon from '@mui/icons-material/ListAlt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Sidebar from '../../../Sidebars/Vendor/VendorAdmin/VendorAdminSidebar';
import InventorySidebar from './InventorySidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ViewDetailsApprovedProducts() {
    const location = useLocation();
    const { productId } = location.state; 
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor-admin/products/${productId}`, {
                    withCredentials: true,
                });
                setProductDetails(response.data.product);
                console.log("Fetched product details:", response.data.product);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.message);
                } else {
                    setError("Failed to fetch product details. Please try again.");
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetails();
    }, [productId]);

    const handleSave = async () => {
        console.log("Saving product details:", productDetails);
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/vendor-admin/update-product/${productId}`,
                productDetails,
                { withCredentials: true }
            );
            toast.success("Product details updated successfully!");
            console.log("Product details updated successfully!");
        } catch (error) {
            console.error("Error saving product details:", error);
            toast.error("Failed to save product details.");
        } finally {
            setIsEditing(false);
            console.log("Exiting editing mode.");
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="text-center" my={4}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    return (
        <div style={pageStyle}>
            <Sidebar />
            <Box m={3} style={{ paddingTop: '80px', flex: 1 }}>
                <ToastContainer />
                <Typography variant="h5" align="center" gutterBottom>
                    Product Details
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    style={{ float: 'right', marginBottom: '10px' }} 
                    onClick={() => {
                        if (isEditing) {
                            handleSave();
                        } else {
                            setIsEditing(true);
                        }
                    }}
                >
                    {isEditing ? <SaveIcon /> : <EditIcon />} {isEditing ? "Save" : "Edit"}
                </Button>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 3 }}>
                            <Typography variant="h6">Basic Information</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Product Name"
                                        value={productDetails?.productName || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, productName: e.target.value })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Product Description"
                                        value={productDetails?.productDescription || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, productDescription: e.target.value })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Brand Name"
                                        value={productDetails?.productBrandName || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, productBrandName: e.target.value })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Seller Shop Name"
                                        value={productDetails?.sellerDetails?.shopName || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, sellerDetails: { ...productDetails.sellerDetails, shopName: e.target.value } })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="GST Number"
                                        value={productDetails?.sellerDetails?.gstNo || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, sellerDetails: { ...productDetails.sellerDetails, gstNo: e.target.value } })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Status"
                                        value={productDetails?.status || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, status: e.target.value })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Category"
                                        value={productDetails?.category || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, category: e.target.value })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="SubCategory"
                                        value={productDetails?.subCategory || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, subCategory: e.target.value })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Product Based Price"
                                        value={productDetails?.productBasedPrice || ''}
                                        InputProps={{
                                            endAdornment: <AttachMoneyIcon style={{ color: 'green' }} />
                                        }}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        onChange={(e) => setProductDetails({ ...productDetails, productBasedPrice: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="MRP"
                                        value={productDetails?.MRP || ''}
                                        InputProps={{
                                            endAdornment: <AttachMoneyIcon style={{ color: 'green' }} />
                                        }}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        onChange={(e) => setProductDetails({ ...productDetails, MRP: e.target.value })}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Sell Price"
                                        value={productDetails?.sellPrice || ''}
                                        InputProps={{
                                            endAdornment: <AttachMoneyIcon style={{ color: 'green' }} />
                                        }}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        onChange={(e) => setProductDetails({ ...productDetails, sellPrice: e.target.value })}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 3 }}>
                            <Typography variant="h6">Additional Information</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Mode of Use"
                                        value={productDetails?.modeOfUse || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, modeOfUse: e.target.value })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Chemical Composition"
                                        value={productDetails?.productChemicalComposition || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, productChemicalComposition: e.target.value })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Note"
                                        value={productDetails?.note || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, note: e.target.value })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Additional Description"
                                        value={productDetails?.descriptionSecond || ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, descriptionSecond: e.target.value })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Features and Benefits"
                                        value={productDetails?.featuresAndBenefits ? productDetails.featuresAndBenefits.join(', ') : ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, featuresAndBenefits: e.target.value.split(', ') })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        multiline
                                        rows={3}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="How to Use"
                                        value={productDetails?.howToUse ? productDetails.howToUse.join(', ') : ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, howToUse: e.target.value.split(', ') })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        multiline
                                        rows={3}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Doses"
                                        value={productDetails?.doses ? productDetails.doses.join(', ') : ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, doses: e.target.value.split(', ') })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        multiline
                                        rows={3}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="YouTube Video Links"
                                        value={productDetails?.youtubeVideoLinks ? productDetails.youtubeVideoLinks.join(', ') : ''}
                                        onChange={(e) => setProductDetails({ ...productDetails, youtubeVideoLinks: e.target.value.split(', ') })}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        multiline
                                        rows={3}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="FAQs"
                                        value={productDetails?.faqs.map(faq => `Q: ${faq.question} A: ${faq.answer}`).join('\n') || ''}
                                        onChange={(e) => {
                                            const faqs = e.target.value.split('\n').map(faq => {
                                                const [question, answer] = faq.split(' A: ');
                                                return { question, answer };
                                            });
                                            setProductDetails({ ...productDetails, faqs });
                                        }}
                                        variant="outlined"
                                        disabled={!isEditing}
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">Product Images:</Typography>
                                    <Grid container spacing={1}>
                                        {productDetails?.productImages?.map((image, index) => (
                                            <Grid item xs={4} key={index}>
                                                <img src={image} alt={`Product ${index}`} style={{ maxHeight: '150px', borderRadius: '5px', width: '100%' }} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="h6">Banner Images:</Typography>
                                    <Grid container spacing={1}>
                                        {productDetails?.productBannerImages?.map((image, index) => (
                                            <Grid item xs={4} key={index}>
                                                <img src={image} alt={`Banner ${index}`} style={{ maxHeight: '150px', borderRadius: '5px', width: '100%' }} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ padding: 3 }}>
                            <InventorySidebar 
                                onPriceSubmit={(priceData) => {
                                    setProductDetails(prev => ({
                                        ...prev,
                                        ...priceData // Update product details with the new pricing data when submitted
                                    }));
                                }}
                                productBasePrice={productDetails?.productBasedPrice}
                                MRP={productDetails?.MRP}
                                sellPrice={productDetails?.sellPrice}
                                stockOnHold={productDetails?.stock?.stockOnHold || 0}
                                stockListedForSell={productDetails?.stock?.stockListedForSell || 0}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                productId={productId}
                            />
                        </Paper>
                    </Grid>
                </Grid>

                <Box mt={3} className="text-center">
                    <Button variant="contained" onClick={() => window.history.back()} className="ms-2">
                        Go Back
                    </Button>
                </Box>
            </Box>
        </div>
    );
}

const pageStyle = {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    backgroundColor: '#1e1e2f',
    color: '#fff',
    flex: 1,
};

export default ViewDetailsApprovedProducts;