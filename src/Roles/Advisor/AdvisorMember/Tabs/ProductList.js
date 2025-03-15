import React, { useState, useEffect } from 'react';
import {
    TextField,
    Grid,
    Typography,
    Container,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Modal,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
} from '@mui/material';
import {
    Visibility,
    MoneyOff,
    Info,
    LocalOffer,
    Fastfood,
    Description,
    Build,
} from '@mui/icons-material';
import axios from 'axios';
import TaggingAuth from '../Auth/TaggingAuth'; // Assuming this handles authentication
import SearchBackground from '../../../../Assets/Background/Searchcx.webp';

const baseFontSize = '1.25rem';

const styles = {
    typography: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '2.5rem',
        marginBottom: '20px',
    },
    button: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: baseFontSize,
        color: '#FFF',
        backgroundColor: '#34A853',
        border: 0,
        padding: '12px 24px',
        borderRadius: '20px',
        transition: 'transform 0.1s',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 10px rgba(52, 168, 83, 0.7)',
        },
        '&:active': {
            transform: 'translateY(1px)',
        },
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: '40px',
        borderRadius: '12px',
        maxWidth: '900px',
        width: '90%',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    },
    image: {
        width: '200px',
        height: 'auto',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.3)',
    },
    readonly: {
        border: 'none',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        fontSize: baseFontSize,
    },
    tableCell: {
        padding: '10px',
        textAlign: 'center',
        fontSize: baseFontSize,
    },
    icon: {
        color: 'green',
        marginRight: '8px',
    },
    pageStyle: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundImage: `url(${SearchBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#000',
        paddingTop: '80px',
        fontFamily: 'Poppins, sans-serif',
        position: 'relative',
    },
    glassEffect: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(10px)',
        zIndex: 1,
    },
    container: {
        position: 'relative',
        zIndex: 2,
        paddingBottom: '20px', // Optional: Add padding for bottom
    },
};

const categories = {
    "Agro Chemicals": ["Fungicide", "Insecticide", "Herbicide", "Fertilizers", "Micronutrients", "Plant Growth Regulators", "Bio Fertilizers", "Organic Pesticide"],
    "Allied Products": ["Electrical Products", "Plastic Sheets", "Plastic Nets"],
    "Irrigation": ["Sprinkler", "Drip", "Motors and Pumps", "Valves"],
    "Seeds": ["Animal Feed-Grass Seed", "Cereals", "Flowers", "Fruits and Vegetables", "Oil Seed", "Pulses"],
    "Tools and Machinery": ["Plant Care Tools", "Sprayer", "Sprayer Part", "Safety Equipment", "Plowing and Cultivator Attachments"],
    "Garden": ["Horticulture"],
};

function ProductList() {
    TaggingAuth();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedMainCategory, setSelectedMainCategory] = useState('');
    const [selectedSubCategory, setSelectedSubCategory] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory-member/get-products`, {
                    withCredentials: true,
                });
                setProducts(response.data.approvedProducts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleViewDetails = (product) => {
        setSelectedProduct(product);
        setOpenModal(true);
    };

    const handleModalClose = () => {
        setOpenModal(false);
        setSelectedProduct(null);
    };

    // Filter products based on search term and category/subcategory selection
    const filteredProducts = products
        .filter(product => product && product.productName && product.productName.toLowerCase().includes(searchTerm.toLowerCase()))
        .filter(product => !selectedMainCategory || product.category === selectedMainCategory)
        .filter(product => !selectedSubCategory || product.subcategory === selectedSubCategory);

    return (
        <div style={styles.pageStyle}>
            <div style={styles.glassEffect}></div>
            <Container className="mt-5" style={styles.container}>
                <Typography variant="h4" sx={styles.typography} align="center">
                    Product List
                </Typography>
                <TextField
                    variant="outlined"
                    placeholder="Search for a product..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                    sx={{
                        borderRadius: '20px',
                        fontFamily: 'Poppins, sans-serif',
                        fontSize: baseFontSize,
                        maxWidth: '400px',
                        width: '100%',
                        margin: '0 auto',
                    }}
                />
                <FormControl variant="outlined" fullWidth className="mb-4">
                    <InputLabel id="main-category-select-label">Main Category</InputLabel>
                    <Select
                        labelId="main-category-select-label"
                        value={selectedMainCategory}
                        onChange={(e) => {
                            setSelectedMainCategory(e.target.value);
                            setSelectedSubCategory('');
                        }}
                        label="Main Category"
                    >
                        <MenuItem value="">
                            <em>All</em>
                        </MenuItem>
                        {Object.keys(categories).map((category) => (
                            <MenuItem key={category} value={category}>
                                {category}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedMainCategory && (
                    <FormControl variant="outlined" fullWidth className="mb-4">
                        <InputLabel id="sub-category-select-label">Sub Category</InputLabel>
                        <Select
                            labelId="sub-category-select-label"
                            value={selectedSubCategory}
                            onChange={(e) => setSelectedSubCategory(e.target.value)}
                            label="Sub Category"
                        >
                            <MenuItem value="">
                                <em>All</em>
                            </MenuItem>
                            {categories[selectedMainCategory].map((subCat) => (
                                <MenuItem key={subCat} value={subCat}>
                                    {subCat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}

                {loading ? (
                    <Container align="center">
                        <CircularProgress />
                    </Container>
                ) : error ? (
                    <Typography variant="h6" align="center" className="mt-4" color="error">
                        Error: {error}
                    </Typography>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Image</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProducts.slice(0, visibleCount).map(product => (
                                        <TableRow key={product._id}>
                                            <TableCell style={styles.tableCell}>
                                                <img src={product.productImages[0] || 'https://via.placeholder.com/120'} alt={product.productName} style={styles.image} />
                                            </TableCell>
                                            <TableCell style={styles.tableCell}>{product.productName}</TableCell>
                                            <TableCell style={styles.tableCell}>
                                                <MoneyOff style={{ ...styles.icon }} /> ₹ {product.sellPrice} <span style={{ textDecoration: 'line-through' }}>₹ {product.MRP}</span>
                                            </TableCell>
                                            <TableCell style={styles.tableCell}>{product.productDescription}</TableCell>
                                            <TableCell style={styles.tableCell}>
                                                <Button
                                                    variant="outlined"
                                                    startIcon={<Visibility style={{ color: 'green' }} />}
                                                    onClick={() => handleViewDetails(product)}
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Modal for Product Details */}
                        <Modal
                            open={openModal}
                            onClose={handleModalClose}
                            aria-labelledby="modal-title"
                            aria-describedby="modal-description"
                            sx={styles.modal}
                        >
                            <div style={styles.modalContent}>
                                {selectedProduct && (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Typography id="modal-title" variant="h5" className="mb-2">
                                                {selectedProduct.productName}
                                            </Typography>
                                            <img src={selectedProduct.productImages[0]} alt={selectedProduct.productName} style={styles.image} />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField
                                                label="Price"
                                                value={`₹ ${selectedProduct.sellPrice}`}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <MoneyOff style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                            />
                                            <TextField
                                                label="MRP"
                                                value={`₹ ${selectedProduct.MRP}`}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <MoneyOff style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Brand"
                                                value={selectedProduct.productBrandName}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <LocalOffer style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Shop Name"
                                                value={selectedProduct.shopName}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <Info style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                            />
                                            <TextField
                                                label="GST No"
                                                value={selectedProduct.sellerDetails?.gstNo}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <Info style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Toggle Sale"
                                                value={selectedProduct.toggleSell ? 'Yes' : 'No'}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <Info style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={6}>
                                            <TextField
                                                label="Description"
                                                value={selectedProduct.productDescription}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <Description style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                                multiline
                                                rows={5}
                                            />
                                            <TextField
                                                label="Mode of Use"
                                                value={selectedProduct.modeOfUse}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <Fastfood style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Video Links"
                                                value={selectedProduct.youtubeVideoLinks.join(', ')}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <Info style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Chemical Composition"
                                                value={selectedProduct.productChemicalComposition}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <Build style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                            />
                                            <TextField
                                                label="Features"
                                                value={selectedProduct.featuresAndBenefits.join(', ')}
                                                InputProps={{
                                                    readOnly: true,
                                                    endAdornment: <Info style={styles.icon} />,
                                                }}
                                                variant="filled"
                                                style={styles.readonly}
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Typography variant="h6">FAQs:</Typography>
                                            {selectedProduct.faqs.map((faq, index) => (
                                                <Grid container spacing={1} key={faq._id}>
                                                    <Grid item xs={12}>
                                                        <TextField
                                                            label={`Q ${index + 1}: ${faq.question}`}
                                                            value={faq.answer}
                                                            InputProps={{
                                                                readOnly: true,
                                                                endAdornment: <Info style={styles.icon} />,
                                                            }}
                                                            variant="filled"
                                                            style={styles.readonly}
                                                            fullWidth
                                                            multiline
                                                        />
                                                    </Grid>
                                                </Grid>
                                            ))}
                                        </Grid>

                                        <Grid item xs={12}>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                onClick={handleModalClose} 
                                                style={{ marginTop: '20px' }}
                                            >
                                                Close
                                            </Button>
                                        </Grid>
                                    </Grid>
                                )}
                            </div>
                        </Modal>
                    </>
                )}
            </Container>
        </div>
    );
}

export default ProductList;