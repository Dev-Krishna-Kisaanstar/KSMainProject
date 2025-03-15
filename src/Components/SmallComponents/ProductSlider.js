import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CircularProgress, Typography, Box, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { ShoppingBag, Favorite } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './ProductSlider.css'; // Ensure the path is correct

const styles = {
    title: {
        fontFamily: 'Poppins, sans-serif',
        fontSize: '1.5rem',
    },
    productCard: {
        position: 'relative',
        textAlign: 'center',
        borderRadius: '20px',
        overflow: 'hidden',
        transition: 'transform 0.2s',
    },
    productImage: {
        width: '120px',
        height: '120px',
        objectFit: 'cover',
        transition: 'opacity 0.3s ease',
        margin: '0 auto',
    },
    icons: {
        position: 'absolute',
        bottom: '10px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '10px',
        opacity: 0,
        transition: 'opacity 0.3s ease',
    },
    iconButton: {
        color: '#fff',
    },
    rating: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '5px',
    },
    star: {
        color: 'gold',
        fontSize: '0.8rem',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(128, 128, 128, 0.8)', // Darker overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        opacity: 0, // Default opacity
        transition: 'opacity 0.3s ease',
    },
    cardHover: {
        '&:hover $overlay': {
            opacity: 1, // Show overlay on hover
        },
    },
    sliderContainer: {
        display: 'flex',
        overflowX: 'scroll',
        padding: '20px',
        gap: '20px',
    },
    productCardWrapper: {
        flexShrink: 0,
        width: '300px',
        position: 'relative',
        cursor: 'pointer',
    },
    navigationButton: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: 'white',
        borderRadius: '50%',
        padding: '10px',
        zIndex: 1,
    },
};

const ProductSlider = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/get-products`, {
                    withCredentials: true,
                });
                setProducts(response.data.products || []); // Assuming response.data.products is the array of products
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleScroll = (direction) => {
        const container = document.getElementById('product-slider-container');
        const step = 300; // Adjust step size based on the width of a product card
        if (direction === 'left') {
            container.scrollLeft -= step;
        } else {
            container.scrollLeft += step;
        }
    };

    return (
        <div className="product-slider">
            <Typography variant="h4" align="center" sx={styles.title}>Products With Discount</Typography>
            <br />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="h6" align="center" color="error">
                    Error: {error}
                </Typography>
            ) : (
                products.length > 0 ? (
                    <div style={{ position: 'relative' }}>
                        <IconButton
                            style={{ ...styles.navigationButton, left: '10px' }}
                            onClick={() => handleScroll('left')}
                        >
                            {'<'}
                        </IconButton>

                        <div
                            id="product-slider-container"
                            style={styles.sliderContainer}
                        >
                            {products.map((product) => (
                                <div key={product._id} style={styles.productCardWrapper}>
                                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <div className="product-card" style={styles.productCard}>
                                            <img
                                                src={(product.productImages && product.productImages.length > 0 ? product.productImages[0] : 'https://via.placeholder.com/120')}
                                                alt={product.productName}
                                                style={styles.productImage}
                                            />
                                            {/* Overlay for out of stock products */}
                                            {product.stock?.stockListedForSell === 0 && (
                                                <div style={{ ...styles.overlay, opacity: 1 }}>
                                                    Out of Stock
                                                </div>
                                            )}
                                            <div className="icons" style={styles.icons}>
                                                <IconButton sx={styles.iconButton}>
                                                    <VisibilityIcon />
                                                </IconButton>
                                                <IconButton sx={styles.iconButton}>
                                                    <ShoppingBag />
                                                </IconButton>
                                                <IconButton sx={styles.iconButton}>
                                                    <Favorite />
                                                </IconButton>
                                            </div>
                                            <Typography variant="h6" className="product-title">{product.productName}</Typography>
                                            <Typography variant="body2" className="product-price">
                                                {product.toggleSell ? (
                                                    <>₹ {product.sellPrice} <span style={{ textDecoration: 'line-through' }}>₹ {product.MRP}</span></>
                                                ) : (
                                                    <>₹ {product.MRP}</>
                                                )}
                                            </Typography>
                                            <div className="rating" style={styles.rating}>
                                                {[...Array(5)].map((_, index) => (
                                                    <span key={index} className="star" style={styles.star}>★</span>
                                                ))}
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>

                        <IconButton
                            style={{ ...styles.navigationButton, right: '10px' }}
                            onClick={() => handleScroll('right')}
                        >
                            {'>'}
                        </IconButton>
                    </div>
                ) : (
                    <Typography variant="h6" align="center">No products found</Typography>
                )
            )}
        </div>
    );
};

export default ProductSlider;
