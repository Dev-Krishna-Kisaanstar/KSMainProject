import React, { useEffect, useState } from 'react';
import { Container, Typography, CircularProgress, Box, Link } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Headerbar from '../Components/SmallComponents/Headerbar';
import Header from '../Components/SmallComponents/Header';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';
import { motion } from 'framer-motion';

const AnimatedGroupCustomVariants = ({ products, navigate }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, filter: 'blur(4px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 1.2,
        type: 'spring',
        bounce: 0.3,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        padding: '32px',
      }}
    >
      {products.map((vendorProduct) => (
        <motion.div
          key={vendorProduct._id}
          variants={itemVariants}
          style={{ cursor: 'pointer' }}
          onClick={() => navigate(`/product/${vendorProduct._id}?vendorId=${vendorProduct.vendorId}`)}
        >
          <img
            src={vendorProduct.productImages[0] || 'https://via.placeholder.com/140'}
            alt={vendorProduct.productName}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '4px',
              display: 'block',
            }}
          />
          <Typography variant="h6" align="center">{vendorProduct.productName}</Typography>
          <Typography variant="body2" align="center">
            Price: {vendorProduct.sellPrice !== null ? `₹ ${vendorProduct.sellPrice.toFixed(2)}` : 'N/A'}
          </Typography>
          <Typography variant="caption" align="center" display="block" color="textSecondary">
            MRP: ₹ {vendorProduct.MRP}
          </Typography>
        </motion.div>
      ))}
    </motion.div>
  );
};

function ViewMoreDetails() {
  const { vendorId } = useParams();
  const [vendorProducts, setVendorProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorProducts = async () => {
      if (!vendorId) {
        console.error('Vendor ID not provided');
        setLoading(false); // Stop loading if no vendor ID
        return; // Exit if there's no vendor ID
      }

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/customers/get-products`, {
          params: { vendorId: vendorId }, // Fetch products by vendorId
          withCredentials: true,
        });

        // Ensure that the response only contains products for the specified vendor
        const filteredProducts = response.data.products.filter(product => product.vendorId === vendorId);
        setVendorProducts(filteredProducts);
        console.log(filteredProducts);
      } catch (error) {
        console.error('Failed to fetch vendor products:', error);
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    fetchVendorProducts();
  }, [vendorId]);

  return (
    <>
      <Headerbar />
      <Header />
      <Container className="mt-5">
        <Typography variant="h4" align="center" gutterBottom color="primary">
          More Products from this Brand
        </Typography>
        <Link 
          component="button"
          variant="body1"
          onClick={() => navigate(`/VendorProductsPage/${vendorId}`)} 
          underline="hover"
        >
          Visit the Brand
        </Link>
        
        {loading ? ( // Show loading indicator while fetching
          <Box display="flex" justifyContent="center" alignItems="center" height="100px">
            <CircularProgress />
          </Box>
        ) : vendorProducts.length > 0 ? (
          <AnimatedGroupCustomVariants products={vendorProducts.slice(0, 6)} navigate={navigate} />
        ) : (
          <Typography variant="body1" align="center" color="textSecondary">
            No products found from this vendor.
          </Typography>
        )}
      </Container>
      <Footer />
      <Footerbar />
    </>
  );
}

export default ViewMoreDetails;