import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Paper,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Switch,
    Divider
} from '@mui/material';
import Sidebar from '../../../Sidebars/Vendor/VendorAdmin/VendorAdminSidebar';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Check as CheckIcon,
    Cancel as CancelIcon,
    Edit as EditIcon,
    Description as DescriptionIcon,
    Store as StoreIcon,
    GppGood as GppGoodIcon,
} from '@mui/icons-material';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewDetailsPendingProducts = () => {
    const { vendorId } = useParams();
    const [productDetails, setProductDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [remark, setRemark] = useState('');
    const [remarkError, setRemarkError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [MRP, setMRP] = useState(499.99);
    const [toggleSell, setToggleSell] = useState(true);
    const [sellPrice, setSellPrice] = useState(449.99);
    const [errors, setErrors] = useState({});

    const suggestions = [
        'Incomplete documents',
        'Invalid details',
        'Other reasons',
        'Did not meet requirements',
        'Pending additional verification',
    ];

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/vendor-admin/vender-member/pending-product-request/${vendorId}`,
                    { withCredentials: true }
                );
                if (response.data.productRequest) {
                    setProductDetails(response.data.productRequest);
                } else {
                    toast.error('Product request not found.');
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product details:", error);
                toast.error('Failed to fetch product details');
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [vendorId]);

    const handleApproveOpen = () => {
        setMRP(productDetails.productBasedPrice + 100); // Set MRP to be 100 more than the product's base price
        setToggleSell(true); // Default the toggle to true
        setSellPrice(productDetails.productBasedPrice); // Set the initial sell price
        setIsApproveModalOpen(true); // Open the approval modal
        setErrors({}); // Clear previous errors
    };

    const handleApproveClose = () => {
        setIsApproveModalOpen(false);
    };

    const validateApproval = () => {
        const newErrors = {};
        if (MRP <= productDetails.productBasedPrice) {
            newErrors.MRP = 'MRP must be greater than productBasedPrice.';
        }
        if (toggleSell && (sellPrice <= 0 || sellPrice > MRP)) {
            newErrors.sellPrice = 'Sell Price must be greater than 0 and less than or equal to MRP.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleApproveSubmit = async () => {
        if (!validateApproval()) return; // Validate before submission

        setIsSubmitting(true);
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/vendor-admin/approve-product/${vendorId}`,
                { MRP, toggleSell, sellPrice },
                { withCredentials: true }
            );
            toast.success('Request accepted successfully');
            window.history.back(); // Go back after successful approval
        } catch (error) {
            console.error("Error accepting request:", error);
            toast.error('Failed to accept request');
        } finally {
            setIsSubmitting(false);
            handleApproveClose(); // Close modal after submission
        }
    };

    const handleRejectOpen = () => {
        setIsRejectModalOpen(true);
        setRemark(''); // Reset remark when opening modal
        setRemarkError(''); // Reset remark error when opening modal
    };

    const handleRejectClose = () => {
        setIsRejectModalOpen(false);
    };

    const handleReject = async () => {
        if (remark.length < 50) {
            setRemarkError('Remark must be at least 50 characters.');
            return;
        }

        const finalRemark = remark || 'No remark added while rejecting';

        setIsSubmitting(true);
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/vendor-admin/reject-product/${vendorId}`,
                { remark: finalRemark },
                { withCredentials: true }
            );
            toast.success('Request rejected successfully');
            window.history.back(); // Go back after successful rejection
        } catch (error) {
            console.error("Error rejecting request:", error);
            toast.error('Failed to reject request');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Box p={3} className="text-center" style={{ paddingTop: '80px' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!productDetails) {
        return (
            <Box p={3} className="text-center">
                <Typography variant="h6">
                    No product details found.
                </Typography>
            </Box>
        );
    }

    return (
        <div className="d-flex">
            <Sidebar />
            <Box p={3} className="flex-grow-1" style={{ paddingTop: '80px' }}>
                <Typography variant="h5" gutterBottom>
                    Product Details
                </Typography>

                {/* 50-50% Grid Layout for Product and Seller Information */}
                <div className="row">
                    <div className="col-md-6">
                        <Paper elevation={3} className="p-3 mb-3">
                            <TextField
                                fullWidth
                                label="Product Name"
                                value={productDetails.productName}
                                InputProps={{
                                    endAdornment: <EditIcon style={{ color: 'green' }} />
                                }}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                            <TextField
                                fullWidth
                                label="Product Description"
                                value={productDetails.productDescription}
                                InputProps={{
                                    endAdornment: <DescriptionIcon style={{ color: 'green' }} />
                                }}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                                multiline
                                rows={4}
                            />
                            <TextField
                                fullWidth
                                label="Brand Name"
                                value={productDetails.productBrandName}
                                InputProps={{
                                    endAdornment: <EditIcon style={{ color: 'green' }} />
                                }}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        </Paper>
                    </div>
                    <div className="col-md-6">
                        <Paper elevation={3} className="p-3 mb-3">
                            <TextField
                                fullWidth
                                label="Seller Shop Name"
                                value={productDetails.sellerDetails.shopName}
                                InputProps={{
                                    endAdornment: <StoreIcon style={{ color: 'green' }} />
                                }}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                            <TextField
                                fullWidth
                                label="GST Number"
                                value={productDetails.sellerDetails.gstNo}
                                InputProps={{
                                    endAdornment: <GppGoodIcon style={{ color: 'green' }} />
                                }}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                            <TextField
                                fullWidth
                                label="Status"
                                value={productDetails.status}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        </Paper>
                    </div>
                </div>

                {/* Bento Grid Layout for Additional Information */}
                <Paper elevation={3} className="p-3 mb-3">
                    <Typography variant="h6">Additional Information</Typography>
                    <div className="row">
                        <div className="col-md-4">
                            <TextField
                                fullWidth
                                label="Category"
                                value={productDetails.category}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        </div>
                        <div className="col-md-4">
                            <TextField
                                fullWidth
                                label="SubCategory"
                                value={productDetails.subCategory}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        </div>
                        <div className="col-md-4">
                            <TextField
                                fullWidth
                                label="Mode of Use"
                                value={productDetails.modeOfUse}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <TextField
                                fullWidth
                                label="Chemical Composition"
                                value={productDetails.productChemicalComposition}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        </div>
                        <div className="col-md-4">
                            <TextField
                                fullWidth
                                label="Note"
                                value={productDetails.note}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                            />
                        </div>
                        <div className="col-md-4">
                            <TextField
                                fullWidth
                                label="Additional Description"
                                value={productDetails.descriptionSecond}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                                disabled
                                multiline
                                rows={4}
                            />
                        </div>
                    </div>
                </Paper>

                {/* Additional Details: Features, How To Use, Doses, YouTube Links, and FAQs */}
                <Paper elevation={3} className="p-3 mb-3">
                    <Typography variant="h6">Details</Typography>
                    <div className="row">
                        {/* Features */}
                        <div className="col-md-6">
                            <Typography variant="h6">Features and Benefits:</Typography>
                            <ul>
                                {productDetails.featuresAndBenefits?.map((feature, index) => (
                                    <li key={index}>
                                        <TextField
                                            fullWidth
                                            value={feature}
                                            variant="outlined"
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            disabled
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* How to Use */}
                        <div className="col-md-6">
                            <Typography variant="h6">How to Use:</Typography>
                            <ul>
                                {productDetails.howToUse?.map((instruction, index) => (
                                    <li key={index}>
                                        <TextField
                                            fullWidth
                                            value={instruction}
                                            variant="outlined"
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            disabled
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        {/* Doses */}
                        <div className="col-md-6">
                            <Typography variant="h6">Doses:</Typography>
                            <ul>
                                {productDetails.doses?.map((dose, index) => (
                                    <li key={index}>
                                        <TextField
                                            fullWidth
                                            value={dose}
                                            variant="outlined"
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            disabled
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* YouTube Links */}
                        <div className="col-md-6">
                            <Typography variant="h6">YouTube Video Links:</Typography>
                            <ul>
                                {productDetails.youtubeVideoLinks?.map((link, index) => (
                                    <li key={index}>
                                        <TextField
                                            fullWidth
                                            value={link}
                                            variant="outlined"
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            disabled
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        {/* FAQs */}
                        <div className="col-md-6">
                            <Typography variant="h6">FAQs:</Typography>
                            <ul>
                                {productDetails.faqs?.map((faq) => (
                                    <li key={faq._id}>
                                        <TextField
                                            fullWidth
                                            value={`Q: ${faq.question} A: ${faq.answer}`}
                                            variant="outlined"
                                            margin="normal"
                                            InputLabelProps={{ shrink: true }}
                                            disabled
                                        />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Product Images */}
                        <div className="col-md-6">
                            <Typography variant="h6">Product Images:</Typography>
                            <div className="row">
                                {productDetails.productImages?.map((image, index) => (
                                    <div key={index} className="col-4 mb-2">
                                        <img src={image} alt={`Product ${index}`} className="img-fluid" style={{ maxHeight: '150px', borderRadius: '5px' }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Paper>

                <Box mt={3} className="text-center">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleApproveOpen}
                        disabled={isSubmitting}
                        className="me-2"
                        startIcon={<CheckIcon style={{ color: 'white' }} />}
                    >
                        Approve
                    </Button>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleRejectOpen}
                        disabled={isSubmitting}
                        startIcon={<CancelIcon style={{ color: 'white' }} />}
                    >
                        Reject
                    </Button>
                    <Button variant="contained" onClick={() => window.history.back()} className="ms-2">
                        Go Back
                    </Button>
                </Box>

                {/* Approve Modal */}
                <Dialog open={isApproveModalOpen} onClose={handleApproveClose}>
                    <DialogTitle sx={{ backgroundColor: '#3f51b5', color: 'white' }}>
                        Approve Product Request
                    </DialogTitle>
                    <DialogContent sx={{ padding: 3 }}>
                        <TextField
                            fullWidth
                            label="MRP"
                            type="number"
                            value={MRP}
                            onChange={(e) => setMRP(parseFloat(e.target.value))}
                            error={!!errors.MRP}
                            helperText={errors.MRP}
                            variant="outlined"
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                        />
                        <Divider sx={{ my: 2 }} />
                        <Box mt={1} display="flex" alignItems="center">
                            <Typography variant="body1" sx={{ marginRight: 2 }}>Toggle Sell:</Typography>
                            <Switch
                                checked={toggleSell}
                                onChange={() => setToggleSell(prev => !prev)}
                                color="primary"
                            />
                        </Box>
                        {toggleSell && (
                            <TextField
                                fullWidth
                                label="Sell Price"
                                type="number"
                                value={sellPrice}
                                onChange={(e) => setSellPrice(parseFloat(e.target.value))}
                                error={!!errors.sellPrice}
                                helperText={errors.sellPrice}
                                variant="outlined"
                                margin="normal"
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                    </DialogContent>
                    <DialogActions sx={{ padding: 2 }}>
                        <Button onClick={handleApproveClose} color="primary" variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleApproveSubmit}
                            color="secondary"
                            disabled={isSubmitting}
                            variant="contained"
                        >
                            Approve
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Reject Remark Modal */}
                <Dialog open={isRejectModalOpen} onClose={handleRejectClose}>
                    <DialogTitle sx={{ backgroundColor: '#f44336', color: 'white' }}>
                        Reject Product Request
                    </DialogTitle>
                    <DialogContent sx={{ padding: 3 }}>
                        <Typography variant="body1">Please provide a remark (minimum 50 characters):</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={remark}
                            onChange={(e) => setRemark(e.target.value)}
                            error={remarkError.length > 0}
                            helperText={remarkError}
                            variant="outlined"
                        />
                        <Box mt={2}>
                            <Typography variant="body2">Suggested Remarks:</Typography>
                            {suggestions.map((suggestion, idx) => (
                                <Button
                                    key={idx}
                                    variant="outlined"
                                    onClick={() => setRemark(remark + ' ' + suggestion)}
                                    className="m-1"
                                    sx={{ borderColor: '#f44336', color: '#f44336' }} 
                                >
                                    {suggestion}
                                </Button>
                            ))}
                        </Box>
                    </DialogContent>
                    <DialogActions sx={{ padding: 2 }}>
                        <Button onClick={handleRejectClose} color="primary" variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReject}
                            color="secondary"
                            disabled={isSubmitting}
                            variant="contained"
                        >
                            Reject
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </div>
    );
};

export default ViewDetailsPendingProducts;