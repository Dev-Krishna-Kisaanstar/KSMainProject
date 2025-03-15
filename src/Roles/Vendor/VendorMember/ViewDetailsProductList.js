import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Button,
    TextField,
    Typography,
    IconButton,
    Snackbar,
    Alert,
    MenuItem,
    Select,
    Grid,
    InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ImageIcon from "@mui/icons-material/Image";
import VideoIcon from "@mui/icons-material/VideoLibrary"; // Icon for video links
import PriceChangeIcon from "@mui/icons-material/PriceChange"; // Icon for price
import DescriptionIcon from "@mui/icons-material/Description"; // Icon for description
import CategoryIcon from "@mui/icons-material/Category"; // Icon for category
import ListAltIcon from "@mui/icons-material/ListAlt"; // Icon for features/benefits
import HowToRegIcon from "@mui/icons-material/HowToReg"; // Icon for usage instructions
import LocalOfferIcon from "@mui/icons-material/LocalOffer"; // Icon for doses
import NoteIcon from "@mui/icons-material/Note"; // Icon for notes
import AllOutIcon from "@mui/icons-material/AllOut"; // Icon for general action items
import { useParams } from "react-router-dom";
import Sidebar from '../../../Sidebars/Vendor/VendorMember/VendorMemberSidebar';

const categories = {
    "Agro Chemicals": [
        "Fungicide",
        "Insecticide",
        "Herbicide",
        "Fertilizers",
        "Micronutrients",
        "Plant Growth Regulators",
        "Bio Fertilizers",
        "Organic Pesticide",
    ],
    "Allied Products": [
        "Electrical Products",
        "Plastic Sheets",
        "Plastic Nets",
    ],
    Irrigation: ["Sprinkler", "Drip", "Motors and Pumps", "Valves"],
    Seeds: [
        "Animal Feed-Grass Seed",
        "Cereals",
        "Flowers",
        "Fruits and Vegetables",
        "Oil Seed",
        "Pulses",
    ],
    "Tools and Machinery": [
        "Plant Care Tools",
        "Sprayer",
        "Sprayer Part",
        "Safety Equipment",
        "Plowing and Cultivator Attachments",
    ],
    Garden: ["Horticulture"],
};

const ViewDetailsProductList = () => {
    const { customerId } = useParams();
    const [productRequest, setProductRequest] = useState({
        productName: "",
        productBasedPrice: "",
        productDescription: "",
        category: "",
        subCategory: "",
        modeOfUse: "",
        featuresAndBenefits: [],
        howToUse: [],
        doses: [],
        productImages: [],
        productBannerImages: [],
        youtubeVideoLinks: [],
        faqs: [],
        note: "",
        descriptionSecond: "",
        productChemicalComposition: "",
        question: "",
        answer: "",
        status: ''
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackSeverity, setSnackSeverity] = useState('success');
    const [isEditing, setIsEditing] = useState(false);
    const [newProductImages, setNewProductImages] = useState([]);
    const [newBannerImages, setNewBannerImages] = useState([]);

    useEffect(() => {
        const fetchProductRequestDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/vendor-member/product-request/${customerId}`,
                    { withCredentials: true }
                );
                const productRequestData = response.data.productRequest;

                setProductRequest({
                    ...productRequestData,
                    productImages: productRequestData.productImages,
                    productBannerImages: productRequestData.productBannerImages,
                });
            } catch (error) {
                console.error("Error fetching product request details:", error);
                setSnackMessage("Error fetching product request details.");
                setSnackSeverity("error");
                setSnackbarOpen(true);
            }
        };
        fetchProductRequestDetails();
    }, [customerId]);

    const handleEditClick = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = async () => {
        if (productRequest.status !== 'pending') {
            setSnackMessage("You cannot update this product request because its status is not pending.");
            setSnackSeverity("error");
            setSnackbarOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append('productName', productRequest.productName);
        formData.append('productBasedPrice', productRequest.productBasedPrice);
        formData.append('productDescription', productRequest.productDescription);
        formData.append('category', productRequest.category);
        formData.append('subCategory', productRequest.subCategory);
        formData.append('modeOfUse', productRequest.modeOfUse);
        formData.append('featuresAndBenefits', productRequest.featuresAndBenefits.join(", "));
        formData.append('howToUse', productRequest.howToUse.join(", "));
        formData.append('doses', productRequest.doses.join(", "));
        formData.append('note', productRequest.note);
        formData.append('descriptionSecond', productRequest.descriptionSecond);
        formData.append('productChemicalComposition', productRequest.productChemicalComposition);
        formData.append('youtubeVideoLinks', productRequest.youtubeVideoLinks.join(", "));
        formData.append('question', productRequest.question);
        formData.append('answer', productRequest.answer);
        formData.append('status', productRequest.status);
        
        // Add new images to the FormData
        for (let i = 0; i < newProductImages.length; i++) {
            formData.append('productImages', newProductImages[i]);
        }
        for (let i = 0; i < newBannerImages.length; i++) {
            formData.append('productBannerImages', newBannerImages[i]);
        }

        try {
            const response = await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/vendor-member/product-request/${customerId}`,
                formData,
                { 
                    withCredentials: true, 
                    headers: { 'Content-Type': 'multipart/form-data' } 
                }
            );
            setProductRequest(response.data.productRequest);
            setSnackMessage("Product request updated successfully.");
            setSnackSeverity("success");
        } catch (error) {
            console.error("Error updating product request:", error);
            setSnackMessage("Error updating product request.");
            setSnackSeverity("error");
        } finally {
            setSnackbarOpen(true);
            setIsEditing(false); // Exit editing mode after saving
            setNewProductImages([]); // Clear new images
            setNewBannerImages([]); // Clear new banner images
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductRequest((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setProductRequest((prev) => ({
            ...prev,
            category: selectedCategory,
            subCategory: categories[selectedCategory][0],
        }));
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const addFAQ = () => {
        const { question, answer } = productRequest;
        if (question && answer) {
            setProductRequest((prev) => ({
                ...prev,
                faqs: [...prev.faqs, { question, answer }],
                question: "",
                answer: "",
            }));
        } else {
            setSnackMessage("Both question and answer are required.");
            setSnackSeverity("error");
            setSnackbarOpen(true);
        }
    };

    const handleImageUpload = (e) => {
        setNewProductImages(e.target.files); // Store the uploaded files in state
    };

    const handleBannerImageUpload = (e) => {
        setNewBannerImages(e.target.files); // Store the uploaded files in state
    };

    return (
        <div style={pageStyle}>
            <Sidebar />
            <Box m={3} style={formStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5">Product Request Details</Typography>
                    <IconButton onClick={handleEditClick} style={{ color: 'green' }}>
                        <EditIcon />
                    </IconButton>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                        <TextField
                            label="Product Name"
                            name="productName"
                            value={productRequest.productName || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AllOutIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Product Based Price"
                            name="productBasedPrice"
                            value={productRequest.productBasedPrice || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            type="number"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PriceChangeIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Product Description"
                            name="productDescription"
                            value={productRequest.productDescription || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DescriptionIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                        <Select
                            label="Category"
                            name="category"
                            value={productRequest.category || ''}
                            onChange={handleCategoryChange}
                            fullWidth
                            margin="normal"
                            disabled={!isEditing}
                            startAdornment={
                                <InputAdornment position="start">
                                    <CategoryIcon style={{ color: 'green' }} />
                                </InputAdornment>
                            }
                        >
                            <MenuItem value="" disabled>Select Category</MenuItem>
                            {Object.keys(categories).map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Select
                            label="Sub-Category"
                            name="subCategory"
                            value={productRequest.subCategory || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            disabled={!productRequest.category || !isEditing}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CategoryIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                            }}
                        >
                            <MenuItem value="" disabled>Select Sub-Category</MenuItem>
                            {productRequest.category && categories[productRequest.category].map((subCat) => (
                                <MenuItem key={subCat} value={subCat}>{subCat}</MenuItem>
                            ))}
                        </Select>
                        <TextField
                            label="Mode of Use"
                            name="modeOfUse"
                            value={productRequest.modeOfUse || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={2}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HowToRegIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Features and Benefits"
                            name="featuresAndBenefits"
                            value={productRequest.featuresAndBenefits.join(", ") || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={2}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <ListAltIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="How to Use"
                            name="howToUse"
                            value={productRequest.howToUse.join(", ") || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={2}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <HowToRegIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}> {/* Maintain 50-50 grid for doses and note */}
                        <TextField
                            label="Doses"
                            name="doses"
                            value={productRequest.doses.join(", ") || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={2}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LocalOfferIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}> {/* Matched with the doses field */}
                        <TextField
                            label="Note"
                            name="note"
                            value={productRequest.note || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <NoteIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                    </Grid>

                    {/* Product Images display */}
                    <Grid item xs={12} md={6}>
                        <Box mt={2}>
                            <Typography variant="subtitle1">Fetched Product Images:</Typography>
                            {isEditing && (
                                <Box display="flex" alignItems="center">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleImageUpload}
                                        style={{ display: 'block', marginBottom: '10px' }}
                                    />
                                    <ImageIcon style={{ color: 'green', marginLeft: '8px' }} />
                                </Box>
                            )}
                            <Grid container spacing={1}>
                                {(newProductImages.length > 0 ? Array.from(newProductImages) : productRequest.productImages).map((img, index) => (
                                    <Grid item xs={4} key={index}>
                                        <img
                                            src={typeof img === 'string' ? img : URL.createObjectURL(img)} // Use new uploads or existing base64 strings
                                            alt={`ProductImage-${index}`}
                                            style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Product Banner Images display */}
                    <Grid item xs={12} md={6}>
                        <Box mt={2}>
                            <Typography variant="subtitle1">Fetched Banner Images:</Typography>
                            {isEditing && (
                                <Box display="flex" alignItems="center">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={handleBannerImageUpload}
                                        style={{ display: 'block', marginBottom: '10px' }}
                                    />
                                    <ImageIcon style={{ color: 'green', marginLeft: '8px' }} />
                                </Box>
                            )}
                            <Grid container spacing={1}>
                                {(newBannerImages.length > 0 ? Array.from(newBannerImages) : productRequest.productBannerImages).map((img, index) => (
                                    <Grid item xs={4} key={index}>
                                        <img
                                            src={typeof img === 'string' ? img : URL.createObjectURL(img)} // Use new uploads or existing base64 strings
                                            alt={`BannerImage-${index}`}
                                            style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>

                    <Grid item xs={12}> {/* Update this grid item for remaining fields */}
                        <TextField
                            label="Secondary Description"
                            name="descriptionSecond"
                            value={productRequest.descriptionSecond || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <DescriptionIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Chemical Composition"
                            name="productChemicalComposition"
                            value={productRequest.productChemicalComposition || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AllOutIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="YouTube Video Links"
                            name="youtubeVideoLinks"
                            value={productRequest.youtubeVideoLinks.join(", ") || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <VideoIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Question"
                            name="question"
                            value={productRequest.question || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AllOutIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                        <TextField
                            label="Answer"
                            name="answer"
                            value={productRequest.answer || ''}
                            onChange={handleInputChange}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={2}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AllOutIcon style={{ color: 'green' }} />
                                    </InputAdornment>
                                ),
                                readOnly: !isEditing,
                            }}
                        />
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={addFAQ}
                            disabled={!isEditing}
                            style={{ marginBottom: '16px' }}
                        >
                            Add FAQ
                        </Button>

                        <Typography variant="h6" gutterBottom>
                            FAQs
                        </Typography>
                        {productRequest.faqs.map((faq, index) => (
                            <Box key={index} border={1} p={2} mb={2}>
                                <Typography><strong>Q:</strong> {faq.question}</Typography>
                                <Typography><strong>A:</strong> {faq.answer}</Typography>
                            </Box>
                        ))}

                        {isEditing && (
                            <Button variant="contained" onClick={handleSave} color="success">
                                Save
                            </Button>
                        )}
                    </Grid>
                </Grid>

                <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={snackSeverity}>
                        {snackMessage}
                    </Alert>
                </Snackbar>
            </Box>
        </div>
    );
};

const pageStyle = {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    color: '#333',
    padding: '10px',
    paddingTop: '80px',
};

const formStyle = {
    margin: '0 auto',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    flex: 1,
};

export default ViewDetailsProductList;