import React, { useState } from "react";
import Sidebar from "../../../Sidebars/Vendor/VendorMember/VendorMemberSidebar";
import { toast } from 'react-toastify';
import {
    TextField,
    InputAdornment,
    Button,
    IconButton,
    Grid,
    Card,
    CardContent,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
} from "@mui/material";

import PriceChangeIcon from "@mui/icons-material/PriceChange";
import DescriptionIcon from "@mui/icons-material/Description";
import CategoryIcon from "@mui/icons-material/Category";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import NoteIcon from "@mui/icons-material/Note";
import VideoIcon from "@mui/icons-material/VideoLibrary";
import AllOutIcon from "@mui/icons-material/AllOut";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from 'axios';


const ProductForm = () => {
    const [formData, setFormData] = useState({
        productName: "",
        productBasedPrice: "",
        productDescription: "",
        category: "",
        subCategory: "",
        modeOfUse: "",
        featuresAndBenefits: [], // Ensure this is an array
        howToUse: [], // Ensure this is an array
        doses: [], // Ensure this is an array
        productImages: [],
        productBannerImages: [],
        youtubeVideoLinks: "",
        faqs: [],
        note: "",
        descriptionSecond: "",
        productChemicalComposition: "",
        question: "",
        answer: ""
    });

    const [loading, setLoading] = useState(false);

    const categories = {
        "Agro Chemicals": ["Fungicide", "Insecticide", "Herbicide", "Fertilizers", "Micronutrients", "Plant Growth Regulators", "Bio Fertilizers", "Organic Pesticide"],
        "Allied Products": ["Electrical Products", "Plastic Sheets", "Plastic Nets"],
        "Irrigation": ["Sprinkler", "Drip", "Motors and Pumps", "Valves"],
        "Seeds": ["Animal Feed-Grass Seed", "Cereals", "Flowers", "Fruits and Vegetables", "Oil Seed", "Pulses"],
        "Tools and Machinery": ["Plant Care Tools", "Sprayer", "Sprayer Part", "Safety Equipment", "Plowing and Cultivator Attachments"],
        "Garden": ["Horticulture"],
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (Array.isArray(formData[name])) {
            // If the field is an array, use handleChangeNonArray
            toast.error("Invalid operation on an array field");
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleChangeNonArray = (index, field, value) => {
        const updatedField = [...formData[field]];
        updatedField[index] = value; // Update the specific index in the array
        setFormData({ ...formData, [field]: updatedField });
    };




    const handleCategoryChange = (e) => {
        const selectedCategory = e.target.value;
        setFormData({
            ...formData,
            category: selectedCategory,
            subCategory: categories[selectedCategory][0],
        });
    };

    const handleImageChange = (e, type) => {
        const files = Array.from(e.target.files);
        const imagePromises = files.map(file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file); // Convert file to base64
        }));

        Promise.all(imagePromises)
            .then((base64Images) => {
                if (type === 'productImages') {
                    setFormData((prevData) => ({
                        ...prevData,
                        productImages: [...prevData.productImages, ...base64Images]
                    }));
                } else if (type === 'productBannerImages') {
                    setFormData((prevData) => ({
                        ...prevData,
                        productBannerImages: [...prevData.productBannerImages, ...base64Images]
                    }));
                }
            })
            .catch((error) => {
                console.error("Error reading files:", error);
                toast.error("Error reading image files.");
            });
    };

    const deleteImage = (index, type) => {
        if (type === 'productImages') {
            setFormData((prevData) => ({
                ...prevData,
                productImages: prevData.productImages.filter((_, idx) => idx !== index)
            }));
        } else if (type === 'productBannerImages') {
            setFormData((prevData) => ({
                ...prevData,
                productBannerImages: prevData.productBannerImages.filter((_, idx) => idx !== index)
            }));
        }
    };
    const [error, setError] = useState("");

    const addFAQ = () => {
        const { question, answer } = formData;
        if (question && answer) {
            const newFAQ = { question, answer };
            setFormData((prevState) => ({
                ...prevState,
                faqs: [...prevState.faqs, newFAQ],
                question: "",  // Clear the question input
                answer: "",    // Clear the answer input
            }));
        } else {
            toast.error("Both question and answer are required to add an FAQ.");
        }
    };

    const deleteFAQ = (index) => {
        setFormData((prevState) => ({
            ...prevState,
            faqs: prevState.faqs.filter((_, idx) => idx !== index),
        }));
    };

    // Handle form submission
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Validate required fields
        const errors = [];
        if (!formData.productName) errors.push("Product Name is required.");
        if (!formData.MRP) errors.push("MRP is required.");
        if (!formData.productBasedPrice) errors.push("Product Price is required.");
        if (!formData.productDescription || formData.productDescription.split(/\s+/).filter(Boolean).length < 5) errors.push("Product Description must be at least 5 words.");
        if (!formData.category) errors.push("Category is required.");
        if (!formData.subCategory) errors.push("Sub-Category is required.");
        if (!formData.modeOfUse) errors.push("Mode of Use is required.");
        if (!formData.note) errors.push("Note is required.");
        if (formData.productImages.length < 2) errors.push("At least two product images are required.");
        if (formData.productBannerImages.length < 1) errors.push("At least one product banner image is required.");
        if (formData.featuresAndBenefits.length < 1) errors.push("At least one feature or benefit is required.");
        if (formData.howToUse.length < 1) errors.push("At least one usage instruction is required.");
        if (formData.doses.length < 1) errors.push("At least one dose instruction is required.");
        if (formData.faqs.length < 1) errors.push("At least one FAQ is required.");

        if (errors.length > 0) {
            toast.error(errors.join(" "));
            setLoading(false);
            return;
        }

        try {
            // Make the POST request using Axios
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/vendor-member/product-request`, formData, { withCredentials: true });
            console.log("Response:", response.data);
            toast.success('Product request submitted successfully!');

            // Reset the form after successful submission
            setFormData({
                productName: '',
                MRP: '',
                productBasedPrice: '',
                productDescription: '',
                category: '',
                subCategory: '',
                modeOfUse: '',
                featuresAndBenefits: [], // Reset to an array
                howToUse: [], // Reset to an array
                doses: [], // Reset to an array
                productImages: [],
                productBannerImages: [],
                youtubeVideoLinks: "",
                faqs: [],
                note: "",
                descriptionSecond: "",
                productChemicalComposition: "",
                question: "",
                answer: "",
            });
        } catch (error) {
            console.error("Error submitting form:", error);
            toast.error("Failed to submit product request. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const addField = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ''] });
    };

    const deleteField = (field, index) => {
        const updatedField = formData[field].filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: updatedField });
    };
    const [isDisabled, setIsDisabled] = useState(false);
    const [wordCount, setWordCount] = useState(0);

    const handledisChange = (event) => {
        const { name, value } = event.target;

        // Ensure that value is always a string before splitting it
        const words = (value || "").trim().split(/\s+/).filter(Boolean);
        const currentWordCount = words.length;

        // Only update state if the word count is <= 20
        if (currentWordCount <= 20) {
            setFormData({ ...formData, [name]: value });
            setWordCount(currentWordCount);
        }
    };

    // Prevent further typing when word count is 20 or more
    const handleKeyDown = (event) => {
        const { name, value } = event.target;

        // Split the input by spaces to get words and count them
        const words = value.trim().split(/\s+/).filter(Boolean);
        const currentWordCount = words.length;

        // Prevent typing if word count is 20 or more, but allow backspace and delete
        if (currentWordCount >= 20 && event.key !== "Backspace" && event.key !== "Delete") {
            event.preventDefault();
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'row', minHeight: '100vh' }}>
            <Sidebar />
            <div style={{ padding: '20px', paddingTop: '100px', flex: 1 }}>
                <form onSubmit={handleSubmit}>

                    {/* Product Name and Price */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <TextField
                                label="Product Name"
                                name="productName"
                                variant="outlined"
                                fullWidth
                                value={formData.productName}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AllOutIcon style={{ color: 'green' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <TextField
                                label="Product Price"
                                name="productBasedPrice"
                                type="number"
                                variant="outlined"
                                fullWidth
                                value={formData.productBasedPrice}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PriceChangeIcon style={{ color: 'green' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <TextField
                                label="Product MRP"
                                name="MRP"
                                type="number"
                                variant="outlined"
                                fullWidth
                                value={formData.MRP}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PriceChangeIcon style={{ color: 'green' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    

                     {/* Short Deiscription */}
                     <div className="col-md-6 mb-3">
                <TextField
                    label="Short Description"
                    name="descriptionSecond"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                    value={formData.descriptionSecond}
                    onChange={handledisChange}
                    onKeyDown={handleKeyDown} // Block further typing when 20 words are reached
                />
                <FormHelperText>
                    {wordCount}/20 words
                </FormHelperText>
            </div>

                    {/* Product Description and Category */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <TextField
                                label="Product Description"
                                name="productDescription"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.productDescription}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <DescriptionIcon style={{ color: 'green' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <small>{formData.productDescription.split(/\s+/).filter(Boolean).length} / Min 5 words</small>
                        </div>
                               

                        <div className="col-md-6 mb-3">
                            <FormControl fullWidth variant="outlined" required>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleCategoryChange}
                                    label="Category"
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
                            </FormControl>
                        </div>
                    </div>

                    {/* Sub-Category and Mode of Use */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <FormControl fullWidth variant="outlined" required>
                                <InputLabel>Sub-Category</InputLabel>
                                <Select
                                    name="subCategory"
                                    value={formData.subCategory}
                                    onChange={handleChange}
                                    disabled={!formData.category}
                                    label="Sub-Category"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <CategoryIcon style={{ color: 'green' }} />
                                        </InputAdornment>
                                    }
                                >
                                    <MenuItem value="" disabled>Select Sub-Category</MenuItem>
                                    {formData.category && categories[formData.category].map((subCat) => (
                                        <MenuItem key={subCat} value={subCat}>{subCat}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className="col-md-6 mb-3">
                            <TextField
                                label="Mode of Use"
                                name="modeOfUse"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.modeOfUse}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <HowToRegIcon style={{ color: 'green' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>

                    {/* Features and Benefits */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">Features and Benefits</Typography>
                                {formData.featuresAndBenefits.map((feature, index) => (
                                    <TextField
                                        key={index}
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={feature}
                                        onChange={(e) => handleChangeNonArray(index, "featuresAndBenefits", e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <ListAltIcon style={{ color: 'green' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        className="mb-2"
                                    />
                                ))}
                                <Button variant="outlined" onClick={() => addField('featuresAndBenefits')}>
                                    Add Feature
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* How to Use */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">How to Use</Typography>
                                {formData.howToUse.map((use, index) => (
                                    <TextField
                                        key={index}
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={use}
                                        onChange={(e) => handleChangeNonArray(index, "howToUse", e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <HowToRegIcon style={{ color: 'green' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        className="mb-2"
                                    />
                                ))}
                                <Button variant="outlined" onClick={() => addField('howToUse')}>
                                    Add Usage
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Doses */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">Doses</Typography>
                                {formData.doses.map((dose, index) => (
                                    <TextField
                                        key={index}
                                        variant="outlined"
                                        fullWidth
                                        multiline
                                        rows={2}
                                        value={dose}
                                        onChange={(e) => handleChangeNonArray(index, "doses", e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LocalOfferIcon style={{ color: 'green' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                        className="mb-2"
                                    />
                                ))}
                                <Button variant="outlined" onClick={() => addField('doses')}>
                                    Add Dose
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* Product Images Section */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Typography variant="h6" style={{ marginBottom: '10px' }}>Product Images</Typography>
                            <FormControl fullWidth>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleImageChange(e, 'productImages')}
                                    required
                                />
                            </FormControl>
                            <div className="mt-3">
                                {formData.productImages.map((base64, index) => (
                                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                        <img src={base64} alt={`preview ${index}`} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                        <Typography variant="body2">{`Image ${index + 1}`}</Typography>
                                        <IconButton size="small" onClick={() => deleteImage(index, 'productImages')}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Product Banner Images Section */}
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <Typography variant="h6" style={{ marginBottom: '10px' }}>Product Banner Images</Typography>
                            <FormControl fullWidth>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleImageChange(e, 'productBannerImages')}
                                    required
                                />
                            </FormControl>
                            <div className="mt-3">
                                {formData.productBannerImages.map((base64, index) => (
                                    <div key={index} className="d-flex justify-content-between align-items-center mb-2">
                                        <img src={base64} alt={`banner preview ${index}`} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                        <Typography variant="body2">{`Banner Image ${index + 1}`}</Typography>
                                        <IconButton size="small" onClick={() => deleteImage(index, 'productBannerImages')}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <TextField
                                label="Note"
                                name="note"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.note}
                                onChange={handleChange}
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <NoteIcon style={{ color: 'green' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>

                    {/* Secondary Description & Chemical Composition */}
                    
                        <div className="col-md-6 mb-3">
                            <TextField
                                label="Chemical Composition"
                                name="productChemicalComposition"
                                variant="outlined"
                                fullWidth
                                multiline
                                rows={3}
                                value={formData.productChemicalComposition}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AllOutIcon style={{ color: 'green' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </div>
                    </div>

                    {/* YouTube Video Links */}
                    <Grid item xs={12} md={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">YouTube Video Links</Typography>
                                <TextField
                                    variant="outlined"
                                    fullWidth
                                    value={formData.youtubeVideoLinks}
                                    onChange={(e) => setFormData({ ...formData, youtubeVideoLinks: e.target.value })}
                                    placeholder="Enter YouTube video links"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <VideoIcon style={{ color: 'green' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    {/* FAQs */}
                    <Grid item xs={12}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography variant="h6">FAQs</Typography>
                                {/* Input fields for new FAQ */}
                                <div className="d-flex mb-2">
                                    <TextField
                                        label="New Question"
                                        variant="outlined"
                                        value={formData.question} // Use formData.question for new question input
                                        onChange={(e) => setFormData({ ...formData, question: e.target.value })} // Update question in state
                                        style={{ flex: 1, marginRight: '10px' }}
                                    />
                                    <TextField
                                        label="New Answer"
                                        variant="outlined"
                                        value={formData.answer} // Use formData.answer for new answer input
                                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })} // Update answer in state
                                        style={{ flex: 1, marginRight: '10px' }}
                                    />
                                    <Button variant="outlined" onClick={addFAQ}>
                                        Add FAQ
                                    </Button>
                                </div>

                                {/* Existing FAQs */}
                                {formData.faqs.map((faq, index) => (
                                    <div key={index} className="d-flex border p-2 mb-2 align-items-center">
                                        <TextField
                                            label="Question"
                                            variant="outlined"
                                            value={faq.question}
                                            onChange={(e) => {
                                                const updatedFAQs = [...formData.faqs];
                                                updatedFAQs[index].question = e.target.value;
                                                setFormData({ ...formData, faqs: updatedFAQs });
                                            }}
                                            style={{ flex: 1, marginRight: '10px' }}
                                        />
                                        <TextField
                                            label="Answer"
                                            variant="outlined"
                                            value={faq.answer}
                                            onChange={(e) => {
                                                const updatedFAQs = [...formData.faqs];
                                                updatedFAQs[index].answer = e.target.value;
                                                setFormData({ ...formData, faqs: updatedFAQs });
                                            }}
                                            style={{ flex: 1, marginRight: '10px' }}
                                        />
                                        <IconButton size="small" onClick={() => deleteFAQ(index)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Submit Button */}
                    <Button type="submit" variant="contained" color="primary" disabled={loading}>
                        {loading ? "Submitting..." : "Submit"}
                    </Button>
                </form>
            </div >
        </div >

    );
};

export default ProductForm;