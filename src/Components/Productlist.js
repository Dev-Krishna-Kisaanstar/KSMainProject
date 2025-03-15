import React, { useState, useEffect } from 'react';
import {
    TextField,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Container,
    Button,
    CircularProgress,
} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';  // Ensure the path is correct

const styles = {
    typography: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1.5rem',
    },
    button: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 600,
        fontSize: '0.9rem',
        color: '#000',
        backgroundColor: '#DAB060',
        border: 0,
        padding: '8px 16px',
        borderRadius: '20px',
        position: 'relative',
        marginTop: '20px',
        transition: 'transform 0.1s, background-color 0.3s, color 0.3s',
        '&:hover': {
            transform: 'translateY(-10%) scale(1.1)',
            boxShadow: '0 0 10px rgba(218, 176, 96, 0.5)',
        },
        '&:active': {
            transform: 'translateY(5%) scale(0.9)',
        },
    },
    productCard: {
        position: 'relative',
        borderRadius: '20px',
        overflow: 'hidden',
        textAlign: 'center',
        transition: 'transform 0.2s',
        height: '350px', // Fixed height for uniformity
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    cardImage: {
        width: '100%',
        height: '200px', // Fixed height for images
        objectFit: 'cover',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(128, 128, 128, 0.8)', // Darker overlay
        opacity: 0, // Default opacity
        transition: 'opacity 0.3s ease',
    },
    cardHover: {
        '&:hover $overlay': {
            opacity: 1, // Show overlay on hover
        },
    },
    cardContent: {
        padding: '16px',
        flexGrow: 1, // Ensures content takes up remaining space
    },
};

const categories = {
    "Agro Chemicals": ["Fungicide", "Insecticide", "Herbicide", "Fertilizers", "Micronutrients"],
    "Allied Products": ["Electrical Products", "Plastic Sheets", "Plastic Nets"],
    "Irrigation": ["Sprinkler", "Drip", "Motors and Pumps", "Valves"],
    "Seeds": ["Animal Feed-Grass Seed", "Cereals", "Flowers", "Fruits and Vegetables", "Oil Seed", "Pulses"],
    "Tools and Machinery": ["Plant Care Tools", "Sprayer", "Sprayer Part", "Safety Equipment"],
    "Garden": ["Horticulture"],
};

function ProductList() {
    const { categoryName, subCategoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6);
    const [selectedCategory, setSelectedCategory] = useState(categoryName || "All");
    const [selectedSubCategory, setSelectedSubCategory] = useState(subCategoryName || null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/get-products`, {
                    withCredentials: true,
                });
                setProducts(response.data.products || []);
                console.log(response.data.products);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = Array.isArray(products) && products.length > 0 ? products.filter(product => {
        const matchesSearchTerm = product && product.productName && product.productName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;

        // Check if the product is enabled
        const isEnabled = product.demovarable !== "desable";

        if (selectedSubCategory) {
            return matchesSearchTerm && matchesCategory && product.subCategory === selectedSubCategory && isEnabled;
        }

        return matchesSearchTerm && matchesCategory && isEnabled;
    }) : [];

    const handleViewMore = () => {
        setVisibleCount(prevCount => prevCount + 6);
    };

    const [hoveredProduct, setHoveredProduct] = useState(null);

    return (
        <Container className="mt-5">
            <Typography variant="h4" className="mb-4" align="center" sx={styles.typography}>
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
                    maxWidth: '400px',
                    width: '100%',
                    margin: '0 auto',
                }}
            />

            <div className="category-buttons" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <Button
                    variant="outlined"
                    onClick={() => setSelectedCategory("All")}
                    sx={selectedCategory === "All" ? { ...styles.button, ...styles.activeButton } : styles.button}
                >
                    All
                </Button>
                {Object.keys(categories).map(category => (
                    <Button
                        key={category}
                        variant="outlined"
                        onClick={() => setSelectedCategory(category)}
                        sx={selectedCategory === category ? { ...styles.button, ...styles.activeButton } : styles.button}
                    >
                        {category}
                    </Button>
                ))}
            </div>

            {selectedCategory !== "All" && (
                <div className="subcategory-buttons" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    {categories[selectedCategory]?.map(subCategory => (
                        <Button
                            key={subCategory}
                            variant="outlined"
                            onClick={() => {
                                setSelectedSubCategory(subCategory);
                                setVisibleCount(6);
                            }}
                            sx={selectedSubCategory === subCategory ? { ...styles.button, ...styles.activeButton } : styles.button}
                        >
                            {subCategory}
                        </Button>
                    ))}
                </div>
            )}

            {loading ? (
                <Container align="center">
                    <CircularProgress />
                </Container>
            ) : error ? (
                <Typography variant="h6" align="center" className="mt-4" sx={styles.typography}>
                    Error: {error}
                </Typography>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {filteredProducts.slice(0, visibleCount).map(product => {
                            const isOutOfStock = product?.stock?.stockListedForSell === 0;
                            const isComingSoon = product?.stock === null;

                            return (
                                <Grid item xs={6} sm={4} md={3} lg={2} key={product?._id}>
                                    {isComingSoon ? (
                                        <div style={{ pointerEvents: 'none', color: 'gray' }}>
                                            <Card className="product-card" sx={{ ...styles.productCard, ...styles.cardHover }}>
                                                <CardMedia
                                                    component="img"
                                                    image={product?.productImages[0] || 'https://via.placeholder.com/120'}
                                                    alt={product?.productName}
                                                    sx={styles.cardImage}
                                                />
                                                <div style={{ ...styles.overlay, opacity: 1 }}>
                                                    <Typography variant="h6" style={{ color: '#fff', textAlign: 'center', paddingTop: '50%' }}>
                                                        Coming Soon
                                                    </Typography>
                                                </div>
                                                <CardContent>
                                                    <Typography variant="h6" component="div" className="product-title">
                                                        {product?.productName}
                                                    </Typography>
                                                    <Typography variant="body2" className="product-price">
                                                        {product.toggleSell ? (
                                                            <>₹ {product?.sellPrice} <span style={{ textDecoration: 'line-through' }}>₹ {product?.MRP}</span></>
                                                        ) : (
                                                            <>₹ {product?.MRP}</>
                                                        )}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    ) : (
                                        <Link to={`/product/${product?._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Card
                                                className="product-card"
                                                sx={{ ...styles.productCard, ...styles.cardHover }}
                                                onMouseEnter={() => setHoveredProduct(product?._id)}
                                                onMouseLeave={() => setHoveredProduct(null)}
                                            >
                                                <CardMedia
                                                    component="img"
                                                    image={
                                                        hoveredProduct === product?._id
                                                            ? product?.productImages[1] || product?.productImages[0] || 'https://via.placeholder.com/120'
                                                            : product?.productImages[0] || 'https://via.placeholder.com/120'
                                                    }
                                                    alt={product?.productName}
                                                    sx={styles.cardImage}
                                                />
                                                {isOutOfStock && (
                                                    <div style={{ ...styles.overlay, opacity: 1 }}>
                                                        <Typography variant="h6" style={{ color: '#fff', textAlign: 'center', paddingTop: '50%' }}>
                                                            Out Of Stock
                                                        </Typography>
                                                    </div>
                                                )}
                                                <CardContent sx={styles.cardContent}>
                                                    <Typography variant="h6" component="div" className="product-title">
                                                        {product?.productName}
                                                    </Typography>
                                                    <Typography variant="body2" className="product-price">
                                                        {product.toggleSell ? (
                                                            <>₹ {product?.sellPrice} <span style={{ textDecoration: 'line-through' }}>₹ {product?.MRP}</span></>
                                                        ) : (
                                                            <>₹ {product?.MRP}</>
                                                        )}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Link>
                                    )}
                                </Grid>
                            );
                        })}
                    </Grid>
                    {visibleCount < filteredProducts.length && (
                        <Button
                            onClick={handleViewMore}
                            sx={styles.button}
                            fullWidth
                        >
                            View More Products
                        </Button>
                    )}
                </>
            )}
        </Container>
    );
}

export default ProductList;