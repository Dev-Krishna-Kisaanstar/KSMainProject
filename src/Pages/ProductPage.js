import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Typography,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useDispatch } from 'react-redux';
import { setSelectedProduct } from '../Components/SmallComponents/productSlice';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ReactImageMagnify from 'react-image-magnify';
import Lottie from 'react-lottie';
import stockAvailableAnimationData from '../Assets/Logo/Animation - 1736233187049.json';
import stockLowAnimationData from '../Assets/Logo/Animation - 1736918176563.json';
import Headerbar from '../Components/SmallComponents/Headerbar';
import Header from '../Components/SmallComponents/Header';
import Footer from '../Components/SmallComponents/Footer';
import Footerbar from '../Components/SmallComponents/Footerbar';
import CartSidebar from './Cart/CartSidebar';
import { ShoppingCartIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { keyframes } from '@emotion/react';
import { toast } from 'react-toastify';
import Fourzerofour from './Fourzerofour';


function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState({ productImages: [] }); // Initialize product with default productImages array
  const [selectedImage, setSelectedImage] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [aindex, setAindex] = useState(0);
  const [openIndex, setOpenIndex] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [buttonText, setButtonText] = useState('Notify Me');
  const [isNotified, setIsNotified] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]); // Initialize as an empty array

  const detailsBoxRef = useRef(null); // Reference to the details box

 // Automatically cycle through product images
useEffect(() => {
  const interval = setInterval(() => {
    if (product.productImages && product.productImages.length > 0) {
      // Ensure productImages is defined and has elements
      setSelectedImage((prevImage) => {
        const currentIndex = product.productImages.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % product.productImages.length;
        return product.productImages[nextIndex];
      });
    }
  }, 3000); // Change image every 3 seconds
  return () => clearInterval(interval); // Cleanup interval on component unmount
}, [product.productImages]);

// Calculate discount percentage
const discountPercentage = product.toggleSell
  ? Math.round(((product.MRP - product.sellPrice) / product.MRP) * 100)
  : null;

// Fetch related products
const fetchRelatedProducts = async (category) => {
  try {
    const relatedProductsResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/customers/get-products?category=${category}`,
      { withCredentials: true }
    );
    setRelatedProducts(relatedProductsResponse.data.products || []); // Default to an empty array if undefined
  } catch (error) {
    console.error('Error fetching related products:', error);
  }
};

// Fetch product details
// Fetch product details
useEffect(() => {
  const fetchProduct = async () => {
    try {
      console.log("Fetching product with ID:", id); // Log the product ID being fetched
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/customers/get-products/${id}`,
        { withCredentials: true }
      );

      console.log("Response received:", response.data); // Log the entire response data

      const productData = response.data.product;

      // Check if productData is null or undefined
      if (!productData) {
        console.error("Product data is null or undefined");
        navigate('/Fourzerofour'); // Redirect to 404 page
        return;
      }

      console.log("Product data:", productData); // Log the product data

      // Check stock status
      const stockStatus = productData?.stock?.stockListedForSell ?? null;
      if (stockStatus === null) {
        console.error("stockListedForSell is null");
        navigate('/Fourzerofour'); // Redirect to 404 page
        return;
      }

      // Ensure productImages is an array
      if (!Array.isArray(productData.productImages)) {
        console.warn("productImages is not an array, defaulting to empty array");
        productData.productImages = []; // Default to an empty array if undefined
      }

      setProduct(productData);
      setSelectedImage(productData.productImages[0] || ''); // Fallback to an empty string if no images
      dispatch(setSelectedProduct(productData));
      setLoading(false);

      // Fetch related products
      fetchRelatedProducts(productData.category);
    } catch (err) {
      console.error("Error fetching product:", err); // Log any errors that occur during the fetch
      navigate('/Fourzerofour'); // Redirect to 404 page on error
    }
  };

  fetchProduct();
}, [id, dispatch, navigate]);

// Handle adding product to cart
const handleAddToCart = async () => {
  if (product) {
    const customerId = localStorage.getItem('customerId');
    const productToAdd = {
      productId: id,
      quantity: Number(quantity),
      price: product.toggleSell ? product.sellPrice : product.MRP,
      imageURL: product.productImages[0] || '',
      name: product.productName,
      customerId: customerId,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/add`,
        productToAdd,
        { withCredentials: true }
      );

      if (response.status === 200) {
        alert(response.data.message || 'Product added to cart successfully!');
        setQuantity(1);
        setCartSidebarOpen(true);
      } else {
        throw new Error('API responded with a non-success status');
      }
    } catch (error) {
      const errorMessage = error.response
        ? error.response.data.message || 'Failed to add product to cart'
        : error.message || 'Failed to add product to cart';
      setError(errorMessage);

      // Check for authentication error and redirect to login
      if (error.response && error.response.status === 401) {
        navigate('/login'); // Directly redirect to the login page
      }
    }
  } else {
    setError('Product not found');
  }
};

// Handle "Notify Me" functionality
const handleNotifyme = async () => {
  if (product) {
    const customerId = localStorage.getItem('customerId');
    const productToAdd = {
      productId: id,
      customerId: customerId,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/customers/notify-me/${id}`,
        productToAdd,
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success('We have received your request. We will inform you when this product is back in stock.');
        setButtonText('We got your request ✅'); // Change button text
        setIsNotified(true); // Set notified state

        // Redirect after a short delay
        setTimeout(() => {
          navigate('/'); // Redirect to home page or shop page
        }, 2000); // 2 seconds delay
      } else if (response.status === 400 && response.data.message === "You have already requested to be notified for this product.") {
        toast.info('We got your request. We will inform you when this product gets back in stock.');
        setButtonText('We got your request ✅'); // Change button text
        setIsNotified(true); // Set notified state
      }
    } catch (error) {
      const errorMessage = error.response ? error.response.data.message || 'Failed to add product to notifications' : error.message || 'Failed to add product to notifications';
      toast.error(errorMessage);
    }
  } else {
    toast.error('Product not found');
  }
};

// ITEMS array for rendering product details
const ITEMS = [
  {
    title: 'Dosage Guidelines',
    subtitle: 'Recommended Dosage',
    content: product?.doses || ['No dosage information available'],
  },
  {
    title: 'Features and Benefits',
    subtitle: 'Key Advantages',
    content: product?.featuresAndBenefits || ['No features available'],
  },
  {
    title: 'How to Use',
    subtitle: 'Usage Instructions',
    content: product?.howToUse || ['No usage instructions available'],
  },
  {
    title: 'Mode of Use',
    subtitle: 'Application Method',
    content: product?.modeOfUse ? [product.modeOfUse] : ['No application method available'],
  },
  {
    title: 'Chemical Composition',
    subtitle: 'Ingredients Breakdown',
    content: product?.productChemicalComposition ? [product.productChemicalComposition] : ['No composition information available'],
  },
  {
    title: 'FAQs',
    subtitle: 'Common Questions',
    content: product?.faqs || ['No FAQs available'],
  },
];

// Keyframes for the rotating snake animation
const snakeAnimation = keyframes`
0% {
  border-image-source: linear-gradient(90deg, #4BAF47, #4BAF47, transparent, transparent);
  border-image-slice: 1;
}
25% {
  border-image-source: linear-gradient(90deg, transparent, #4BAF47, #4BAF47, transparent);
  border-image-slice: 1;
}
50% {
  border-image-source: linear-gradient(90deg, transparent, transparent, #4BAF47, #4BAF47);
  border-image-slice: 1;
}
75% {
  border-image-source: linear-gradient(90deg, #4BAF47, transparent, transparent, #4BAF47);
  border-image-slice: 1;
}
100% {
  border-image-source: linear-gradient(90deg, #4BAF47, #4BAF47, transparent, transparent);
  border-image-slice: 1;
}
`;

// Increment and decrement quantity
const incrementQuantity = () => {
  setQuantity((prev) => Math.min(prev + 1, 5));
};

const decrementQuantity = () => {
  setQuantity((prev) => Math.max(prev - 1, 1));
};

// Toggle description visibility
const toggleDescription = () => {
  setShowFullDescription((prev) => !prev);
};

// Handle tab change
const handleTabChange = (event, newValue) => {
  setAindex(newValue);
};

  return (
    <>
      {/* We need to rename the demo variable value and variable name  */}
      {/* Here is the Turnary operator for disable products  */}
      {product.demovarable === "desable" ? (
        <Fourzerofour />
      ) : (
        // Turnary operator is till here 
        <>
          <Headerbar />
          <Header />
          <Container className="mt-5" style={{ maxWidth: '90%', padding: '0' }}>
            {loading ? (
              <Typography variant="h6" align="center">
                Loading product details...
              </Typography>
            ) : error ? (
              <Typography variant="h6" align="center" color="error">
                {error}
              </Typography>
            ) : (
              product && (
                <Grid container spacing={4}>
                  {/* Product Image Section */}
                  <Grid item xs={12} md={8}>
                    <Card className="shadow-sm" style={{ display: 'flex' }}>
                      <Grid container spacing={2} style={{ flexDirection: 'row' }}>
                        {/* Small Images on the Left */}
                        <Grid item xs={3} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          {product.productImages.map((img, index) => (
                            <Card
                              className="border-0 mb-2"
                              key={index}
                              onClick={() => setSelectedImage(img)}
                              style={{
                                cursor: 'pointer',
                                border: '5px solid transparent', // Base border
                                borderRadius: '10px', // Rounded corners
                                transition: 'box-shadow 0.3s ease, transform 0.3s ease', // Smooth transitions
                                overflow: 'hidden',
                              }}
                              // Add hover effects
                              onMouseEnter={(e) => {
                                e.currentTarget.style.animation = `${snakeAnimation} 3s linear infinite`; // Start animation
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)'; // Enhanced shadow
                                e.currentTarget.style.transform = 'scale(1.1)'; // Slight scale-up effect
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.animation = 'none'; // Stop animation
                                e.currentTarget.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.1)'; // Revert shadow
                                e.currentTarget.style.transform = 'scale(1)'; // Revert scale
                              }}
                            >
                              <CardMedia
                                component="img"
                                image={img}
                                alt={`Thumbnail ${index + 1}`}
                                className="rounded"
                                style={{
                                  width: '100%',
                                  height: 'auto', // Maintain aspect ratio
                                }}
                              />
                            </Card>
                          ))}
                        </Grid>
                        {/* Main Image with Hover Zoom */}
                        <Grid item xs={9}>
                          <ReactImageMagnify
                            {...{
                              smallImage: {
                                alt: 'Product Image',
                                isFluidWidth: true,
                                src: selectedImage || product.productImages[0] || 'https://via.placeholder.com/600',
                              },
                              largeImage: {
                                src: selectedImage || product.productImages[0] || 'https://via.placeholder.com/1200',
                                width: 2000, // High-resolution image for zoom
                                height: 2000, // High-resolution image for zoom
                              },
                              enlargedImageContainerStyle: {
                                zIndex: 9,
                              },
                              enlargedImagePosition: 'over', // Magnify directly on the main image
                              isHintEnabled: true, // Adds a hint to show zoom is possible
                              hintTextMouse: "Hover to zoom", // Optional hover text
                              enlargedImageStyle: {
                                objectFit: 'cover',
                              },
                            }}
                          />
                        </Grid>
                      </Grid>
                    </Card>
                  </Grid>



                  {/* Product Details Section (Right Side) */}
                  <Grid item xs={12} md={4} ref={detailsBoxRef}>
                    <TableContainer
                      component={Paper}
                      style={{
                        border: '5px solid transparent', // Base border
                        borderRadius: '30px',
                        boxShadow: '0 10px 15px rgba(0, 0, 0, 0.2)', // Subtle shadow by default
                        maxWidth: '100%',
                        overflow: 'hidden',
                        padding: '5px',
                        transition: 'box-shadow 0.3s ease, transform 0.3s ease', // Smooth transition for shadow and scale
                      }}
                      // Add hover effects
                      onMouseEnter={(e) => {
                        e.currentTarget.style.animation = `${snakeAnimation} 3s linear infinite`; // Start animation
                        e.currentTarget.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.4)'; // Enhanced shadow
                        e.currentTarget.style.transform = 'scale(1.05)'; // Slight scale-up effect
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.animation = 'none'; // Stop animation
                        e.currentTarget.style.boxShadow = '0 10px 15px rgba(0, 0, 0, 0.2)'; // Revert to subtle shadow
                        e.currentTarget.style.transform = 'scale(1)'; // Revert scale
                      }}
                    >
                      <Table style={{ tableLayout: 'fixed', width: '100%', borderCollapse: 'collapse' }}>
                        <TableBody>
                          {/* Brand Name and Product Name */}
                          <TableRow>
                            <TableCell
                              style={{
                                width: '50%',
                                padding: '8px',
                                borderRight: '2px solid gray',
                              }}
                            >
                              <Typography
                                variant="h6"
                                style={{
                                  fontWeight: 'bold',
                                  wordWrap: 'break-word',
                                  width: '100%',
                                }}
                              >
                                {product.productBrandName}
                              </Typography>
                              <Button
                                variant="text"
                                onClick={() =>
                                  navigate(`/ViewMoreDetails/${product.vendorId}`)
                                }
                                style={{ padding: '5px 0' }}
                              >
                                View More Products
                              </Button>
                            </TableCell>
                            <TableCell
                              style={{
                                width: '50%',
                                padding: '8px',
                              }}
                            >
                              <Typography
                                variant="h6"
                                style={{
                                  fontWeight: 'bold',
                                  wordWrap: 'break-word',
                                  width: '100%',
                                }}
                              >
                                {product.productName}
                              </Typography>
                            </TableCell>
                          </TableRow>

                          {/* Pricing Section */}
                          <TableRow>
                            <TableCell colSpan={2} style={{ textAlign: 'left' }}>
                              {product.toggleSell ? (
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Typography
                                    variant="h6"
                                    style={{
                                      textDecoration: 'line-through',
                                      color: 'gray',
                                      marginRight: '10px',
                                    }}
                                  >
                                    ₹ {product.MRP}
                                  </Typography>
                                  <Typography
                                    variant="h6"
                                    style={{
                                      color: 'red',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    ₹ {product.sellPrice}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    style={{
                                      color: 'green',
                                      marginLeft: '10px',
                                      fontWeight: 'bold',
                                    }}
                                  >
                                    {discountPercentage}% OFF
                                  </Typography>
                                </div>
                              ) : (
                                <Typography
                                  variant="h6"
                                  style={{ color: 'black', fontWeight: 'bold' }}
                                >
                                  ₹ {product.MRP}
                                </Typography>
                              )}
                            </TableCell>
                          </TableRow>

                          {/* Quantity Section */}
                          <TableRow style={{ height: '100%' }}>
                            <TableCell
                              style={{

                                width: '50%',
                                padding: '8px',
                                verticalAlign: 'middle',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton
                                  onClick={decrementQuantity}
                                  aria-label="decrement"
                                  style={{
                                    marginRight: '10px',
                                    border: '1px solid #ccc',
                                  }}
                                >
                                  <RemoveIcon />
                                </IconButton>
                                <TextField
                                  type="number"
                                  value={quantity}
                                  onChange={(e) =>
                                    setQuantity(
                                      Math.max(1, Math.min(5, Number(e.target.value)))
                                    )
                                  }
                                  inputProps={{ min: 1, max: 5 }}
                                  style={{
                                    width: '60px',
                                    textAlign: 'center',
                                    marginRight: '10px',
                                  }}
                                />
                                <IconButton
                                  onClick={incrementQuantity}
                                  aria-label="increment"
                                  style={{
                                    marginLeft: '10px',
                                    border: '1px solid #ccc',
                                  }}
                                >
                                  <AddIcon />
                                </IconButton>
                              </div>
                            </TableCell>

                            {/* Stock Status with Lottie Icon */}
                            <TableCell style={{

                              padding: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-start',
                              verticalAlign: 'middle',
                              height: '120px'
                            }}>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Lottie
                                  options={{
                                    loop: true,
                                    autoplay: true,
                                    animationData: product.stock.stockListedForSell <= 10 || product.stock === null ? stockLowAnimationData : stockAvailableAnimationData,
                                    rendererSettings: { preserveAspectRatio: 'xMidYMid slice' }
                                  }}
                                  height={30}
                                  width={30}
                                  style={{ marginRight: '10px' }}
                                />
                                <Typography
                                  variant="subtitle1"
                                  style={{
                                    color: product.stock.stockListedForSell === 0 || product.stock === null ? 'red' : product.stock.stockListedForSell <= 10 || product.stock === null ? 'orange' : 'green',
                                    fontWeight: 'bold',
                                    margin: 0
                                  }}
                                >
                                  {product.stock.stockListedForSell === 0 || product.stock === null ? 'No Stock at the Moment' : product.stock.stockListedForSell <= 10 || product.stock === null ? 'Hurry Up! Few Remaining' : 'In Stock'}
                                </Typography>
                              </div>
                            </TableCell>
                          </TableRow>

                          {/* Add to Cart Section */}
                          <TableRow>
                            <TableCell colSpan={2} style={{ textAlign: 'center' }}>
                              {product.stock.stockListedForSell === 0 || product.stock === null ? (
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                  <Button
                                    variant="contained"
                                    onClick={handleNotifyme}
                                    style={{ backgroundColor: '#ccc', color: 'white', width: '100%', fontSize: '1.25rem', marginTop: '10px' }}
                                    aria-label="Notify me when this product is back in stock"
                                    disabled={isNotified} // Disable button after notification
                                  >
                                    {buttonText}
                                  </Button>
                                  <Button
                                    variant="outlined"
                                    onClick={() => navigate('/')} // Redirect to home or shop page
                                    style={{ width: '100%', fontSize: '1.25rem', marginTop: '10px' }}
                                  >
                                    Go to Shop
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  variant="contained"
                                  onClick={handleAddToCart}
                                  style={{ backgroundColor: '#4BAF47', color: 'white', width: '100%', fontSize: '1.25rem', marginTop: '10px' }}
                                >
                                  <ShoppingCartIcon className="me-2" /> Add to Cart
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>


                  {/* New Section for Product Description and Additional Info */}
                  <Grid item xs={12} md={8}>
                    <div
                      style={{
                        padding: '20px',
                        border: '5px solid transparent', // Initial transparent border
                        borderRadius: '20px',
                        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.animation = `${snakeAnimation} 3s linear infinite`; // Snake animation
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)'; // Shadow on hover
                        e.currentTarget.style.transform = 'scale(1.02)'; // Slight scale effect
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.animation = 'none'; // Remove animation
                        e.currentTarget.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.1)'; // Revert shadow
                        e.currentTarget.style.transform = 'scale(1)'; // Revert scale
                      }}
                    >
                      <Typography variant="h5" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {showFullDescription
                          ? product.productDescription
                          : `${product.productDescription
                            .split(' ')
                            .slice(0, 60)
                            .join(' ')}... `}
                      </Typography>
                      <Button variant="text" onClick={toggleDescription}>
                        {showFullDescription ? 'Read Less' : 'Read More'}
                      </Button>
                    </div>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <TableContainer
                      component={Paper}
                      style={{
                        border: '5px solid transparent', // Initial transparent border
                        borderRadius: '30px',
                        padding: '5px',
                        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.animation = `${snakeAnimation} 3s linear infinite`; // Snake animation
                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)'; // Shadow on hover
                        e.currentTarget.style.transform = 'scale(1.05)'; // Slight scale effect
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.animation = 'none'; // Remove animation
                        e.currentTarget.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.1)'; // Revert shadow
                        e.currentTarget.style.transform = 'scale(1)'; // Revert scale
                      }}
                    >
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell style={{ borderRight: '1px solid black' }}>
                              <Typography variant="h6">Brand Name:</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1">{product.productBrandName}</Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ borderRight: '1px solid black' }}>
                              <Typography variant="h6">Product Name:</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1">{product.productName}</Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ borderRight: '1px solid black' }}>
                              <Typography variant="h6">Categories:</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1">
                                {product.category && product.category.length > 0
                                  ? product.category
                                  : 'No categories available'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ borderRight: '1px solid black' }}>
                              <Typography variant="h6">Subcategories:</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body1">
                                {product.subCategory && product.subCategory.length > 0
                                  ? product.subCategory
                                  : 'No subcategories available'}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Grid>


                  {/* Desktop Version */}
                  <div className="tabs-container desktop-only">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      {ITEMS.map((item, index) => (
                        <Button
                          key={index}
                          onClick={(e) => handleTabChange(e, index)}
                          variant={aindex === index ? 'contained' : 'outlined'}
                          style={{
                            borderRadius: '20px',
                            borderColor: '#4CAF50',
                            color: aindex === index ? '#FFF' : '#4CAF50',
                            backgroundColor: aindex === index ? '#4CAF50' : '#FFF',
                            margin: '0 5px',
                            transition: 'box-shadow 0.3s ease, transform 0.3s ease',
                          }}
                        >
                          {item.title}
                        </Button>
                      ))}
                    </div>

                    <div className="tabs-content">
                      <AnimatePresence mode="wait">
                        {ITEMS.map((item, index) =>
                          aindex === index ? (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: -30 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 30 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              style={{
                                backgroundColor: '#F9F9F9',
                                padding: '15px',
                                borderRadius: '10px',
                              }}
                            >
                              <Typography variant="h6" style={{ marginBottom: '10px', color: '#4CAF50' }}>
                                {item.subtitle}
                              </Typography>
                              {item.title === 'FAQs' ? (
                                <div style={{ marginTop: '20px' }}>
                                  {product.faqs && product.faqs.length > 0 ? (
                                    product.faqs.map((faq, index) => (
                                      <div key={index} style={{ marginBottom: '10px' }}>
                                        <div
                                          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                          onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                        >
                                          <ChevronRight
                                            style={{
                                              transform: openIndex === index ? 'rotate(90deg)' : 'none',
                                              transition: 'transform 0.2s',
                                              color: '#4CAF50',
                                            }}
                                          />
                                          <Typography
                                            variant="body1"
                                            style={{ fontWeight: 'bold', marginLeft: '10px' }}
                                          >
                                            {faq.question}
                                          </Typography>
                                        </div>
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.7 }}
                                          animate={
                                            openIndex === index
                                              ? { opacity: 1, scale: 1 }
                                              : { opacity: 0, scale: 0.7 }
                                          }
                                          exit={{ opacity: 0, scale: 0.7 }}
                                          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                                          style={{ paddingLeft: '25px', color: '#666' }}
                                        >
                                          {openIndex === index && <p>{faq.answer}</p>}
                                        </motion.div>
                                      </div>
                                    ))
                                  ) : (
                                    <Typography variant="body2" style={{ color: '#999' }}>
                                      No FAQs available for this product.
                                    </Typography>
                                  )}
                                </div>
                              ) : (
                                <Typography variant="body1">{item.content.join(', ')}</Typography>
                              )}
                            </motion.div>
                          ) : null
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Mobile Version */}
                  <div className="container">
                    <div className="tabs-container mobile-only" style={{ overflowX: 'auto' }}>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          marginBottom: '10px',
                          padding: '5px',
                          justifyContent: 'space-between', // This ensures buttons are spread out evenly
                        }}
                      >
                        {ITEMS.map((item, index) => (
                          <Button
                            key={index}
                            onClick={(e) => handleTabChange(e, index)}
                            variant={aindex === index ? 'contained' : 'outlined'}
                            style={{
                              borderRadius: '20px',
                              borderColor: '#4CAF50',
                              color: aindex === index ? '#FFF' : '#4CAF50',
                              backgroundColor: aindex === index ? '#4CAF50' : '#FFF',
                              margin: '5px 0', // Vertical margin for spacing between buttons
                              width: 'calc(50% - 10px)',  // Set width to 50% for each button
                              padding: '12px', // Adds padding to buttons for better appearance
                              fontWeight: 'bold', // Bold text for prominence
                              boxShadow: aindex === index ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none', // Adds shadow on active button
                              transition: 'all 0.3s ease', // Smooth transition for hover effects
                              fontSize: '16px', // Larger font size for better readability
                            }}
                          >
                            {item.title}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>



                  <>
                    <div className="tabs-content mobile-only" style={{ padding: '15px' }}>
                      <AnimatePresence mode="wait">
                        {ITEMS.map((item, index) =>
                          aindex === index ? (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 20 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              style={{
                                backgroundColor: '#F9F9F9',
                                padding: '20px',
                                borderRadius: '10px',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow to lift the content
                                marginBottom: '20px', // Spacing between tab content
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start', // Align text to the left for better readability
                              }}
                            >
                              <Typography
                                variant="h6"
                                style={{
                                  marginBottom: '10px',
                                  color: '#4CAF50',
                                  fontWeight: 'bold',
                                }}
                              >
                                {item.subtitle}
                              </Typography>
                              <Typography
                                variant="body1"
                                style={{
                                  color: '#666',
                                  lineHeight: '1.6', // Improved line height for better readability
                                }}
                              >
                                {item.content.join(', ')}
                              </Typography>
                            </motion.div>
                          ) : null
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                  <div style={{ marginTop: '40px' }}>
                    <Typography variant="h5" gutterBottom>
                      Related Products
                    </Typography>
                    <Grid container spacing={3}>
                      {relatedProducts.map((relatedProduct) => (
                        <Grid item xs={6} sm={4} md={3} key={relatedProduct._id}>
                          <Card>
                            <CardMedia
                              component="img"
                              image={relatedProduct.productImages[0]}
                              alt={relatedProduct.productName}
                            />
                            <CardContent>
                              <Typography variant="h6">{relatedProduct.productName}</Typography>
                              <Typography variant="body2">₹ {relatedProduct.MRP}</Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                </Grid>

              )
            )}
          </Container>

          {/* Render Cart Sidebar */}
          {cartSidebarOpen && <CartSidebar onClose={() => setCartSidebarOpen(false)} />}
          <div style={{ padding: '40px 0 0' }}>
            <Footer />
            <Footerbar />
          </div>

          {/* Inline Styles */}
          {/* Inline Styles */}
          <style>
            {`
    /* Desktop Version */
    .desktop-only {
      display: block;
    }

    /* Mobile Version */
    .mobile-only {
      display: block;
    }

    /* Media Queries */
    @media (max-width: 768px) {
      /* Hide Desktop on Mobile */
      .desktop-only {
        display: none;
      }

      /* Show Mobile on Mobile */
      .mobile-only {
        display: block;
      }
    }

    /* Mobile View Specific Styling */
    @media (min-width: 769px) {
      /* Hide Mobile Content on Desktop */
      .mobile-only {
        display: none;
      }
    }
  `}
          </style>



        </>
      )}

    </>


  );
}

export default ProductPage;
