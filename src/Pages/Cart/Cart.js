import React, { useEffect, useState } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Box, Button, Divider, TextField, InputAdornment } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Headerbar from '../../Components/SmallComponents/Headerbar';
import Header from '../../Components/SmallComponents/Header';
import Footer from '../../Components/SmallComponents/Footer';
import Footerbar from '../../Components/SmallComponents/Footerbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import CallIcon from '@mui/icons-material/Call';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';



function Cart({ initialCartItems, customerId }) {
  const [cartItems, setCartItems] = useState([]);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [error, setError] = useState("");
  const [product, setProduct] = useState(null); // Assuming product is fetched from an API or passed as props
  const [quantity, setQuantity] = useState(); // Initialize quantity, you can update this as needed
  const navigate = useNavigate();
  const [subtotal, setSubtotal] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, { withCredentials: true });
      console.log(response.data.cart);

      if (response.status === 404 || !response.data.cart || response.data.cart.length === 0) {
        toast.error('Cart is empty or not found. Redirecting to the home page...');
        navigate('/');
        return;
      }
      setCartItems(response.data.cart);
    } catch (error) {
      toast.error('Error fetching cart items.');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/remove`, {
        withCredentials: true,
        data: { productId }
      });
      if (response.status === 200) {
        setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
        toast.success('Product removed from cart.');
      } else {
        throw new Error('Failed to remove item');
      }
    } catch (error) {
      toast.error('Failed to remove item from cart');
    }
  };

  const handleClearCart = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/clear`, { withCredentials: true });
      setCartItems([]);
    } catch (error) {
      toast.error('Failed to clear cart');
    }
  };



  const ProceedToCheckout = async () => {
    try {
      if (cartItems.length === 0) {
        toast.error("Your cart is empty. Add products before proceeding.");
        return;
      }

      // Iterate through cart items and update them on the backend
      for (const item of cartItems) {
        await handleAddToCart(item); // Use the cart quantity directly
      }

      // Navigate to checkout page after successfully updating cart
      navigate('/checkout', { state: { cartItems } });
    } catch (error) {
      toast.error("An error occurred while proceeding to checkout.");
    }
  };

  const handleAddToCart = async (item) => {
    const customerId = localStorage.getItem('customerId');

    // Construct the payload with the cart's quantity as the final value
    const productToAdd = {
      productId: item.productId,
      quantity: item.quantity, // Use the cart page's updated quantity
      price: item.price,
      imageURL: item.imageURL || '', // Use existing or fallback image
      name: item.name,
      customerId: customerId,
    };

    try {
      // Send the request to replace the quantity for the product
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/cart/add`,
        productToAdd,
        { withCredentials: true }
      );

      if (response.status === 200) {
        toast.success(response.data.message || 'Cart updated successfully!');
      } else {
        throw new Error('API responded with a non-success status');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update cart';
      toast.error(errorMessage);
    }
  };

  const handleIncreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.quantity < 5
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (productId) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleCallback = async () => {
    try {
      // Make the API call to request a callback
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/customers/request-callback`, null, { withCredentials: true });

      if (response.status === 201) {
        toast.success(response.data.message); // Show success message
        await fetchCartItems(); // Refresh cart items after callback request

        // Display a message and allow manual navigation
        const messageElement = (
          <div>
            <Typography variant="h6">Our Call Advisory will get back to you within 24 hrs</Typography>
            <Button variant="contained" onClick={() => navigate('/')}>
              Happy Shopping
            </Button>
          </div>
        );
        toast.info(messageElement); // Show the message without auto-closing
      }
    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data.message;
        if (error.response.status === 400) {
          toast.error(errorMessage); // Show error message for 400 responses
        } else {
          toast.error('Server error. Please try again later.'); // General server error message
        }
      } else {
        toast.error('Server error. Please try again later.'); // Handle network errors
      }
    }
  };

  const styles = {
    cartContainer: { display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', padding: '20px', borderRadius: '8px', width: '100%' },
    table: { minWidth: '650px' },
    sidebar: { display: 'flex', flexDirection: 'column', width: '300px', backgroundColor: '#e8f5e9', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', height: 'auto' },
    button: { marginTop: '16px', width: '200px', backgroundColor: '#4caf50', color: '#fff', padding: '10px 20px' },
    input: { marginTop: '16px' }
  };

  return (
    <>
      <Headerbar />
      <Header />
      <Container className="mt-5" style={{ maxWidth: '100%' }}>
        {cartItems.length > 0 ? (
          <>
            {/* Desktop Version */}
            <Box className="desktop-version">
              <Box style={styles.cartContainer}>
                <Box flex={1} mr={2}>
                  <TableContainer component={Paper}>
                    <Table style={styles.table}>
                      <TableHead style={{ backgroundColor: '#c8e6c9' }}>
                        <TableRow>
                          <TableCell>Product Image</TableCell>
                          <TableCell>Product Name</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {cartItems.map((item) => (
                          <TableRow key={item.productId} style={{ backgroundColor: '#f9f9f9' }}>
                            <TableCell>
                              <Box style={{ width: '120px', height: '100px', overflow: 'hidden', borderRadius: '8px' }}>
                                <img
                                  src={item.productImages || 'https://via.placeholder.com/120'}
                                  alt={item.productName}
                                  className="img-fluid"
                                  style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                />
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Link to={`/product/${item.productId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <Typography variant="body1">{item.productName}</Typography>
                              </Link>
                            </TableCell>
                            <TableCell align="right">
                              <Box
                                style={{
                                  border: '2px solid #4caf50',
                                  borderRadius: '4px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-end',
                                  padding: '4px',
                                  width: 'fit-content',
                                  marginLeft: 'auto',
                                }}
                              >
                                <IconButton onClick={() => handleDecreaseQuantity(item.productId)} style={{ color: '#4caf50' }}>
                                  <RemoveIcon />
                                </IconButton>
                                <Typography variant="body1" style={{ margin: '0 8px' }}>
                                  {item.quantity}
                                </Typography>
                                <IconButton onClick={() => handleIncreaseQuantity(item.productId)} style={{ color: '#4caf50' }}>
                                  <AddIcon />
                                </IconButton>
                              </Box>
                            </TableCell>
                            <TableCell align="right">₹ {item.price}</TableCell>
                            <TableCell align="right">
                              <IconButton
                                style={{ color: '#4caf50' }}
                                onClick={() => handleRemoveFromCart(item.productId)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Box display="flex" justifyContent="flex-start" mt={2}>
                    <Button variant="contained" style={styles.button} onClick={handleClearCart}>
                      Clear Cart
                    </Button>
                  </Box>
                </Box>
                <Box style={styles.sidebar}>
                  <Typography variant="h6" gutterBottom>
                    Get Shipping Estimates
                  </Typography>
                  <Divider />
                  <TextField
                    fullWidth
                    label="Zip/Postal Code"
                    variant="outlined"
                    margin="normal"
                    style={styles.input}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            style={{ color: '#4caf50' }}
                            onClick={() => {
                              /* Call API here */
                            }}
                          >
                            <ArrowForwardIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Divider style={{ margin: '16px 0' }} />
                  <Typography variant="body1" style={{ marginTop: '16px' }}>
                    Subtotal: ₹ {subtotal.toFixed(2)}
                  </Typography>
                  <Button variant="contained" style={styles.button} onClick={ProceedToCheckout}>
                    Proceed to CheckOut
                  </Button>
                  <Typography variant="body1" style={{ marginTop: '16px' }}>
                    --------------- OR ----------------
                  </Typography>
                  <Button variant="contained" onClick={handleCallback} style={styles.button}>
                    Request To Call Advisory
                  </Button>
                </Box>
              </Box>
            </Box>

            {/* Mobile Version */}
            <Box className="mobile-version">
              <Box
                sx={{
                  padding: '20px',
                  backgroundColor: '#F4F9F4',
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  position: 'relative', // Set position relative for the container
                }}
              >
                {/* Title with Clear Cart Icon */}
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between', // Align items with space between them
                    alignItems: 'center',
                    width: '100%', // Ensure it takes up full width
                    marginBottom: '20px',
                  }}
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="#2e7d32"
                    sx={{ marginRight: '10px' }} // Space between title and icon
                  >
                    My Cart
                  </Typography>
                  <IconButton
                    onClick={handleClearCart}
                    color="success"
                    sx={{
                      backgroundColor: '#e8f5e9',
                      '&:hover': { backgroundColor: '#c8e6c9' },
                      padding: '8px',
                      borderRadius: '50%',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <DeleteSweepIcon sx={{ fontSize: '20px' }} />
                  </IconButton>
                </Box>

                <Divider sx={{ marginBottom: '20px' }} />

                {/* Cart Items */}
                {cartItems.map((item) => (
                  <Box
                    key={item.productId}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      padding: '16px',
                      gap: '12px',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                      marginBottom: '16px',
                    }}
                  >
                    {/* Product Image */}
                    <Box
                      component="img"
                      src={item.productImages}
                      alt={item.productName}
                      sx={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Product Details */}
                    <Box sx={{ flex: 1 }}>
                      {/* Product Name and Delete Icon */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          color="#2e7d32"
                          sx={{
                            flex: 1,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {item.productName}
                        </Typography>
                        <IconButton
                          onClick={() => handleRemoveFromCart(item.productId)}
                          color="error"
                          sx={{
                            backgroundColor: '#ffe0e0',
                            '&:hover': { backgroundColor: '#ffccd9' },
                            borderRadius: '50%',
                            padding: '8px',
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>

                      {/* Quantity and Price */}
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginTop: '8px',
                        }}
                      >
                        {/* Quantity Control */}
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <IconButton
                            onClick={() => handleDecreaseQuantity(item.productId)}
                            size="small"
                            color="primary"
                            sx={{
                              backgroundColor: '#e8f5e9',
                              '&:hover': { backgroundColor: '#c8e6c9' },
                              borderRadius: '50%',
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography variant="body2" color="textPrimary">
                            {item.quantity}
                          </Typography>
                          <IconButton
                            onClick={() => handleIncreaseQuantity(item.productId)}
                            size="small"
                            color="primary"
                            sx={{
                              backgroundColor: '#e8f5e9',
                              '&:hover': { backgroundColor: '#c8e6c9' },
                              borderRadius: '50%',
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>

                        {/* Price */}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          sx={{ fontWeight: 'bold' }}
                        >
                          ₹ {(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}

                <Divider sx={{ marginBottom: '20px' }} />

                {/* Shipping Estimates */}
                <Box sx={{ marginBottom: '16px' }}>
                  <Typography variant="h6" fontWeight="bold" color="#2e7d32" sx={{ marginBottom: '8px' }}>
                    Get Shipping Estimates
                  </Typography>
                  <TextField
                    fullWidth
                    label="Zip/Postal Code"
                    variant="outlined"
                    margin="normal"
                    style={{ marginBottom: '16px' }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            style={{ color: '#4caf50' }}
                            onClick={() => {
                              /* Call API here */
                            }}
                          >
                            <ArrowForwardIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>

                {/* Fixed Action Buttons */}
                <Box
                  sx={{
                    position: 'fixed', // Fix the position
                    bottom: 0, // Align to the bottom
                    left: 0,
                    right: 0,
                    backgroundColor: '#F4F9F4', // Background color for the buttons
                    padding: '16px', // Padding around the buttons
                    zIndex: 1000, // Increase z-index to ensure visibility
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {/* Request to Call Advisory Button */}
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: '#2e7d32', // Green background
                      color: '#fff', // White text
                      padding: '14px 20px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
                    }}
                    startIcon={<CallIcon />} // Add an icon before the text
                    onClick={handleCallback}
                  >
                    Request to Call Advisory
                  </Button>

                  {/* Proceed to Checkout Button */}
                  <Button
                    variant="contained"
                    style={{
                      backgroundColor: '#2e7d32', // Green background
                      color: '#fff', // White text
                      padding: '14px 20px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.1)',
                    }}
                    startIcon={<ShoppingCartIcon />} // Add an icon before the text
                    onClick={ProceedToCheckout}
                  >
                    Proceed to Checkout
                  </Button>
                </Box>
              </Box>
            </Box>

          </>
        ) : (
          <>
            <Typography variant="h5" className="text-center">
              Your cart is empty
            </Typography>
            <Button variant="outlined" onClick={() => { }} style={{ marginTop: '10px' }}>
              Continue Shopping
            </Button>
          </>
        )}

        <Footer />
        <Footerbar />

        <style jsx>{`
        .desktop-version {
          display: block;
        }
  
        .mobile-version {
          display: none;
        }
  
        @media (max-width: 768px) {
          .desktop-version {
            display: none;
          }
  
          .mobile-version {
            display: block;
          }
        }
      `}</style>
      </Container>
    </>



  );
}

export default Cart;
