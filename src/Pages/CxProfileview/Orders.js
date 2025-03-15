import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  Divider,
  Chip,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Pending, Error } from '@mui/icons-material';
import Headerbar from '../../Components/SmallComponents/Headerbar';
import Header from '../../Components/SmallComponents/Header';
import Footer from '../../Components/SmallComponents/Footer';
import Footerbar from '../../Components/SmallComponents/Footerbar';
import CxprofileSidebar from '../../Components/CxprofileSidebar/Cxprofilesidebar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Orders = () => {
  const navigate = useNavigate();
  const { customer_id: paramCustomerId } = useParams(); // Get customer ID from URL
  const isMobile = useMediaQuery('(max-width:600px)');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit] = useState(5); // Set the limit for orders to fetch
  const [hasMoreOrders, setHasMoreOrders] = useState(true);
  const customerId = paramCustomerId || localStorage.getItem('customerId'); // Retrieve customer ID

  // Fetch orders from the API initially
  useEffect(() => {
    if (!customerId) {
      console.error('Customer ID not found in URL or local storage.');
      setLoading(false);
      return;
    }
    fetchOrders();
  }, [customerId]); // Call this effect whenever customerId changes

  const fetchOrders = async () => {
    if (!customerId || !hasMoreOrders) return;

    setLoading(true);
    try {
      console.log("Fetching orders for customer ID:", customerId);
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${customerId}`, {
        withCredentials: true,
        params: { offset, limit },
      });

      if (response.data.orders.length === 0) {
        setHasMoreOrders(false);
        toast.info("No more orders to load.");
      } else {
        setOrders((prevOrders) => [...prevOrders, ...response.data.orders]);
        setOffset((prevOffset) => prevOffset + limit);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching orders');
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollTop + clientHeight >= scrollHeight - 5 && hasMoreOrders && !loading) {
      fetchOrders(); // Load more orders when scrolled to the bottom
    }
  };

  // Attach scroll event listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasMoreOrders, loading]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Navigate to the product page using the product ID
  };

  if (loading && orders.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Headerbar />
      <Header />
      <Container className="mt-5" style={{ maxWidth: '100%' }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} md={3}>
            <CxprofileSidebar />
          </Grid>

          <Grid item xs={12} md={9}>
            {/* Mobile and Tablet View: Cards */}
            {isMobile && (
              <Box>
                {orders.map((order) => (
                  <Card
                    key={order.orderId}
                    className="mb-4 shadow-lg"
                    sx={{
                      borderRadius: '15px',
                      padding: '20px',
                      backgroundColor: '#f7f7f7',
                      boxShadow: 3,
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ fontWeight: 'bold', color: '#2e7d32', fontSize: '1.2rem' }}
                      >
                        Order ID: {order.orderId}
                      </Typography>

                      {order.items.map((item, index) => (
                        <Box key={index} mb={2} sx={{ display: 'flex', alignItems: 'center' }} onClick={() => handleProductClick(item.productId)}>
                          <img
                            src={item.productImages || 'https://via.placeholder.com/120'}
                            alt={item.name || 'Product'}
                            style={{
                              width: '80px',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                              marginRight: '20px',
                            }}
                          />
                          <Box>
                            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                              {item.name || 'Unknown Product'}
                            </Typography>
                            <Typography variant="body2">Quantity: {item.quantity}</Typography>
                          </Box>
                        </Box>
                      ))}
                      <Divider sx={{ margin: '15px 0' }} />

                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                        Total Amount: <span style={{ color: '#2e7d32' }}>₹{order.totalAmount}</span>
                      </Typography>

                      <Box mt={1} display="flex" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                          Status:
                        </Typography>
                        <Chip
                          label={order.orderStatus}
                          sx={{
                            marginLeft: '10px',
                            backgroundColor:
                              order.orderStatus === 'Completed'
                                ? '#388e3c'
                                : order.orderStatus === 'Pending'
                                  ? '#ff9800'
                                  : '#d32f2f',
                            color: 'white',
                          }}
                          icon={
                            order.orderStatus === 'Completed' ? (
                              <CheckCircle sx={{ color: '#388e3c' }} />
                            ) : order.orderStatus === 'Pending' ? (
                              <Pending sx={{ color: '#ff9800' }} />
                            ) : (
                              <Error sx={{ color: '#d32f2f' }} />
                            )
                          }
                        />
                      </Box>

                      <Typography variant="body2" sx={{ marginTop: '10px', color: '#777' }}>
                        Order Date: {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {loading && (
                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <CircularProgress />
                  </div>
                )}
              </Box>
            )}

            {/* Desktop View: Table */}
            {!isMobile && (
              <Card className="mb-4 rounded-3 shadow-lg" sx={{ boxShadow: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif', color: '#2e7d32' }}>
                    Orders
                  </Typography>
                  <TableContainer component={Paper} sx={{ border: '1px solid #ddd', borderRadius: '10px', maxHeight: '70vh', overflowY: 'auto' }}>
                    <Table sx={{ borderCollapse: 'collapse' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                            Sr No
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                            Order ID
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                            Product Name
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                            Product Image
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                            Quantity
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                            Total Amount
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                            Status
                          </TableCell>
                          <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>
                            Order Date
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order, index) => (
                          <React.Fragment key={order.orderId}>
                            <TableRow>
                              <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }} rowSpan={order.items.length || 1}>
                                {index + 1}
                              </TableCell>
                              <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }} rowSpan={order.items.length || 1}>
                                {order.orderId}
                              </TableCell>
                              <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }} onClick={() => handleProductClick(order.items[0]?.productId)}>
                                {order.items[0]?.name || 'Unknown Product'}
                              </TableCell>
                              <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }} onClick={() => handleProductClick(order.items[0]?.productId)}>
                                <img
                                  src={order.items[0]?.productImages || 'https://via.placeholder.com/120'}
                                  alt={order.items[0]?.name || 'Product'}
                                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                />
                              </TableCell>
                              <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }}>
                                {order.items[0]?.quantity || 0}
                              </TableCell>
                              <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }} rowSpan={order.items.length || 1}>
                                ₹{order.totalAmount}
                              </TableCell>
                              <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }} rowSpan={order.items.length || 1}>
                                {order.orderStatus}
                              </TableCell>
                              <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }} rowSpan={order.items.length || 1}>
                                {new Date(order.createdAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                            {order.items.slice(1).map((item, index) => (
                              <TableRow key={`${order.orderId}-${index}`}>
                                <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }}>
                                  {item.name || 'Unknown Product'}
                                </TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }}>
                                  <img
                                    src={item.productImages || 'https://via.placeholder.com/120'}
                                    alt={item.name || 'Product'}
                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                  />
                                </TableCell>
                                <TableCell align="center" sx={{ border: '1px solid #ddd', padding: '8px' }}>
                                  {item.quantity || 0}
                                </TableCell>
                              </TableRow>
                            ))}
                          </React.Fragment>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  {loading && (
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                      <CircularProgress />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <Footerbar />
    </>
  );
};

export default Orders;