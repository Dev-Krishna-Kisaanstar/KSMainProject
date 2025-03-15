import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Rating,
  Breadcrumbs,
  Link as MuiLink,
  Box,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
import Header from '../Components/SmallComponents/Header';
import Headerbar from '../Components/SmallComponents/Headerbar';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';

function Products() {
  const { categoryName, subCategoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/get-products`, {
          withCredentials: true,
        });

        const allProducts = response.data.products || [];
        const filteredProducts = allProducts.filter(
          product =>
            product &&
            product.category === decodeURIComponent(categoryName) &&
            product.subCategory === decodeURIComponent(subCategoryName)
        );

        setProducts(filteredProducts);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, subCategoryName]);

  const handleProductClick = (product) => {
    if (product && product._id) {
      navigate(`/product/${product._id}`, {
        state: { product },
      });
    }
  };

  return (
    <div style={{ backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <Headerbar />
      <Header />

      <Container style={{ marginTop: '20px', paddingBottom: '40px' }}>
        {/* Breadcrumb */}
        <Breadcrumbs aria-label="breadcrumb" separator="/" style={{ marginBottom: '20px' }}>
          <MuiLink component={RouterLink} to="/products/Categories" underline="hover" color="inherit">
            Categories
          </MuiLink>
          <MuiLink component={RouterLink} to={`/subcategories/${encodeURIComponent(categoryName)}`} underline="hover" color="inherit">
            {decodeURIComponent(categoryName)}
          </MuiLink>
          <Typography color="textPrimary">{decodeURIComponent(subCategoryName)}</Typography>
        </Breadcrumbs>

        <Typography
          variant="h4"
          align="center"
          gutterBottom
          style={{ fontWeight: 'bold', color: '#333', marginBottom: '30px' }}
        >
          Explore {decodeURIComponent(subCategoryName)}
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" style={{ height: '50vh' }}>
            <CircularProgress size={50} />
          </Box>
        ) : error ? (
          <Typography variant="h6" align="center" color="error">
            {`Error: ${error}`}
          </Typography>
        ) : products.length > 0 ? (
          <Grid container spacing={4}>
            {products
              .filter(product => product) // Ensure product is not null or undefined
              .map(product => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card
                    onClick={() => handleProductClick(product)}
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      borderRadius: '15px',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 12px 20px rgba(0, 0, 0, 0.2)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      alt={product.productName || 'Product Image'}
                      height="300"
                      image={product.productImages?.[0] || '/default-image.jpg'}
                      style={{ objectFit: 'cover' }}
                    />
                    <CardContent>
                      <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        style={{ fontWeight: 'bold', color: '#444' }}
                      >
                        {product.productName || 'Unnamed Product'}
                      </Typography>
                      <Box display="flex" alignItems="center" marginBottom={1}>
                        <Rating
                          name="read-only"
                          value={product.rating || 0}
                          readOnly
                          precision={0.5}
                          size="small"
                        />
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          style={{ marginLeft: '8px' }}
                        >
                          {product.rating ? `${product.rating}/5` : 'No ratings'}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body1"
                        style={{ fontWeight: 'bold', marginBottom: '10px', color: 'green' }}
                      >
                        {product.sellPrice != null ? `$${product.sellPrice.toFixed(2)}` : 'Price not available'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ height: '40px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {product.description || 'No description available.'}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        style={{ marginTop: '10px' }}
                      >
                        Stock Listed For Sell: {product.stockListedForSell != null ? product.stockListedForSell : 'Not available'}
                      </Typography>
                    </CardContent>
                    <CardActions style={{ justifyContent: 'center', padding: '0 16px 16px' }}>
                      <Button
                        size="small"
                        variant="contained"
                        style={{ backgroundColor: 'green', color: 'white' }}
                        startIcon={<ShoppingCartIcon />}
                      >
                        Buy Now
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
          </Grid>
        ) : (
          <Typography variant="h6" align="center" color="text.secondary">
            No products found in this category.
          </Typography>
        )}
      </Container>

      <Footer />
      <Footerbar />
    </div>
  );
}

export default Products;
