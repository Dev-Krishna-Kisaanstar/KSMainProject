import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import { CircularProgress, Typography, Box } from '@mui/material';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductSlider = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get("https://api.kisaanstar.com/api/operational-admin/products");
                console.log("Fetched Products: ", response.data); // Log API response
                setProducts(response.data.products || response.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2500,
    };

    return (
        <div className="product-slider">
            <h2>Products With Discount</h2>
            <br />
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="300px">
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="h6" align="center" color="error">
                    Error: {error}
                </Typography>
            ) : products.length > 0 ? (
                <Slider {...settings}>
                    {products.map((product) => {
                        const imageUrl = product.imageUrl || product.images?.[0] || "https://via.placeholder.com/150";

                        return (
                            <div key={product.id || Math.random()} style={{ padding: '10px' }}>
                                <Box
                                    sx={{
                                        width: '250px',
                                        height: '250px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        padding: '10px',
                                    }}
                                >
                                    <img
                                        src={imageUrl}
                                        alt={product.name || 'Product'}
                                        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            objectFit: 'contain',
                                        }}
                                    />
                                    <Typography variant="h6" align="center" style={{ fontSize: '1rem' }}>
                                        {product.name || 'No Name'}
                                    </Typography>
                                    <Typography variant="body1" align="center">
                                        ₹{product.price || '0.00'}
                                    </Typography>
                                </Box>
                            </div>
                        );
                    })}
                </Slider>
            ) : (
                <Typography variant="h6" align="center">
                    No products available
                </Typography>
            )}
        </div>
    );
};

export default ProductSlider;
