import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Paper,
  Divider,
  Grid,
  Modal,
  Checkbox,
  Tooltip,
} from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ClearIcon from '@mui/icons-material/Clear';

const PlaceOrder = ({ customerId, advisorId }) => {
  const [subtotal, setSubtotal] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [productOptions, setProductOptions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [checkedProducts, setCheckedProducts] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory-member/get-products`, {
          withCredentials: true,
        });
        if (Array.isArray(response.data.approvedProducts)) {
          setProductOptions(response.data.approvedProducts);
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (error) {
        toast.error("Failed to fetch products.");
      }
    };

    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/get-coupons`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          withCredentials: true,
        });
        if (response.data.coupons) {
          setCoupons(response.data.coupons);
        }
      } catch (error) {
        toast.error("Failed to fetch coupons.");
      }
    };

    fetchProducts();
    fetchCoupons();
  }, []);

  useEffect(() => {
    const calculatedSubtotal = Object.keys(checkedProducts).reduce((sum, key) => {
      const product = productOptions.find(p => p._id === key);
      if (product && checkedProducts[key]) {
        return sum + (product.MRP * checkedProducts[key]);
      }
      return sum;
    }, 0);

    const discountAmount = selectedCoupon ? coupons.find(c => c.code === selectedCoupon)?.discountAmount || 0 : 0;
    setSubtotal(calculatedSubtotal);
    setDiscount(discountAmount);
    setFinalPrice(Math.max(0, calculatedSubtotal - discountAmount));
  }, [checkedProducts, selectedCoupon, productOptions, coupons]);

  const handleCheckboxChange = (productId) => {
    setCheckedProducts(prev => ({
      ...prev,
      [productId]: prev[productId] ? 0 : 1 // Default quantity is 1 when checked
    }));
  };

  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const incrementQuantity = (productId) => {
    setCheckedProducts((prev) => ({
      ...prev,
      [productId]: prev[productId] ? prev[productId] + 1 : 1,
    }));
  };

  const decrementQuantity = (productId) => {
    setCheckedProducts((prev) => ({
      ...prev,
      [productId]: prev[productId] > 1 ? prev[productId] - 1 : prev[productId],
    }));
  };

  const placeOrder = async () => {
    if (!customerId) {
      toast.error("Customer ID is required.");
      return;
    }

    const orders = Object.keys(checkedProducts).map(productId => ({
      productId,
      quantity: checkedProducts[productId],
    }));

    if (orders.some(order => order.quantity <= 0)) {
      toast.error("Please select a product for all items.");
      return;
    }

    const dataToSend = {
      customerId,
      paymentMethod: "COD",
      transactionId: null,
      couponCode: selectedCoupon || "",
      orders,
    };

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/place-by-advisor`,
        dataToSend,
        { withCredentials: true }
      );

      if (response.data.message === "Orders processed") {
        toast.success("Order placed successfully!");
        setCheckedProducts({});
        setSelectedCoupon("");
      } else {
        toast.error(response.data.message || "Failed to place order.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error(error.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#0F1535",
        borderRadius: 3,
        boxShadow: 3,
        mt: 4,
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(15, 21, 53, 0.7)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <ToastContainer />
      <Typography
        variant="h4"
        sx={{
          color: "#ffffff",
          mb: 3,
          textAlign: "center",
          fontWeight: "bold"
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: 40, verticalAlign: "middle", color: "green" }} /> Place Order
      </Typography>
      <Paper
        elevation={3}
        sx={{
          padding: 3,
          borderRadius: 2,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: 'blur(5px)',
        }}
      >
        <TextField
          select
          label="Coupons"
          value={selectedCoupon}
          onChange={(e) => setSelectedCoupon(e.target.value)}
          fullWidth
          sx={{
            mb: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 1,
            color: 'white',
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiMenuItem-root': {
              color: 'white',
            },
            '& .MuiOutlinedInput-root': {
              color: 'white',
              '& fieldset': {
                borderColor: 'white',
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
            },
          }}
          InputProps={{
            endAdornment: (
              selectedCoupon && (
                <IconButton
                  onClick={() => setSelectedCoupon('')}
                  sx={{ color: 'white', padding: 0 }}
                >
                  <ClearIcon />
                </IconButton>
              )
            ),
          }}
        >
          {coupons.map((coupon) => (
            <MenuItem key={coupon.code} value={coupon.code}>
              <LocalOfferIcon sx={{ color: "green", mr: 1 }} /> {coupon.code} - ₹{coupon.discountAmount}
            </MenuItem>
          ))}
        </TextField>

        <Typography variant="h6" sx={{ color: "#ffffff", mb: 2 }}>Product List</Typography>
        {/* Enhanced table structure */}
        <div style={{ border: '1px solid white', borderRadius: '5px', padding: '10px' }}>
          <Grid container spacing={2}>
            <Grid item xs={3}><Typography sx={{ color: '#ffffff', fontWeight: 'bold' }}>Product Image</Typography></Grid>
            <Grid item xs={6}><Typography sx={{ color: '#ffffff', fontWeight: 'bold' }}>Product Name</Typography></Grid>
            <Grid item xs={3}><Typography sx={{ color: '#ffffff', fontWeight: 'bold' }}>Select</Typography></Grid>
          </Grid>
          {productOptions.map(product => (
            <Grid container spacing={2} key={product._id} alignItems="center" sx={{ borderBottom: '1px solid white', padding: '10px 0' }}>
              <Grid item xs={3}>
                <img src={product.productImages[0]} alt={product.productName} style={{ width: '100px', height: '100px', border: '2px solid white', borderRadius: '4px' }} />
              </Grid>
              <Grid item xs={6}>
                <Typography sx={{ color: '#ffffff' }}>{product.productName}</Typography>
                <Typography sx={{ color: '#ffffff' }}>Price: ₹{product.MRP}</Typography>
                {/* Enhanced quantity controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid white',
                  borderRadius: '4px',
                  padding: '5px',
                  marginTop: '5px',
                  width: '100px'
                }}>
                  <Button
                    variant="text"
                    onClick={() => decrementQuantity(product._id)}
                    sx={{ color: 'white', padding: '0 4px', borderRadius: '4px', minWidth: '28px' }}>-</Button>
                  <Typography sx={{ color: '#ffffff', mx: 1 }}>{checkedProducts[product._id] || 1}</Typography>
                  <Button
                    variant="text"
                    onClick={() => incrementQuantity(product._id)}
                    sx={{ color: 'white', padding: '0 4px', borderRadius: '4px', minWidth: '28px' }}>+</Button>
                </div>
              </Grid>
              <Grid item xs={3}>
                <Checkbox
                  checked={!!checkedProducts[product._id]}
                  onChange={() => handleCheckboxChange(product._id)}
                />
                <Tooltip title="View Details">
                  <Button variant="outlined" onClick={() => handleViewDetails(product)}>Details</Button>
                </Tooltip>
              </Grid>
            </Grid>
          ))}
        </div>
        <Divider sx={{ my: 2, borderColor: 'white' }} />
        <Typography variant="h6" sx={{ color: '#ffffff' }}>Subtotal: ₹{subtotal}</Typography>
        <Typography variant="h6" sx={{ color: '#ffffff' }}>Discount: ₹{discount}</Typography>
        <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: "bold" }}>Final Price: ₹{finalPrice}</Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Button
              variant="contained"
              onClick={placeOrder}
              color="success"
              disabled={submitting || subtotal === 0}
              fullWidth
              sx={{
                height: 55,
                borderRadius: 12,
                fontWeight: 'bold',
                fontSize: 16,
                textTransform: 'none',
                background: 'linear-gradient(45deg, #66bb6a, #388e3c)',
                boxShadow: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388e3c, #66bb6a)',
                  boxShadow: 12,
                  transform: 'translateY(-5px)',
                },
                '&:active': {
                  transform: 'translateY(1px)',
                  boxShadow: 6,
                },
              }}
            >
              {submitting ? "Placing Order..." : "Place Order"}
            </Button>
          </Grid>
        </Grid>

        <Modal open={modalOpen} onClose={handleModalClose}>
          <Box sx={{
            backgroundColor: "white",
            borderRadius: 2,
            padding: 4,
            maxWidth: 600,
            margin: "auto",
            mt: '10%',
            maxHeight: '70vh',
            overflowY: 'auto',
          }}>
            {selectedProduct && (
              <>
                <Typography variant="h5">{selectedProduct.productName}</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <img src={selectedProduct.productImages[0]} alt={selectedProduct.productName} style={{ width: '100%', height: 'auto' }} />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Description"
                      value={selectedProduct.productDescription}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <TextField
                      label="Price (₹)"
                      value={selectedProduct.MRP}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label="Category"
                      value={selectedProduct.category}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label="Sub-Category"
                      value={selectedProduct.subCategory}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ mt: 2 }}
                    />
                    <TextField
                      label="Brand"
                      value={selectedProduct.productBrandName}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                </Grid>
                <Typography variant="h6" sx={{ mt: 2 }}>Additional Information</Typography>
                <TextField
                  label="Mode of Use"
                  value={selectedProduct.modeOfUse}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Note"
                  value={selectedProduct.note}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Chemical Composition"
                  value={selectedProduct.productChemicalComposition}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Features & Benefits"
                  value={selectedProduct.featuresAndBenefits.join(', ')}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="How to Use"
                  value={selectedProduct.howToUse.join(', ')}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mt: 1 }}
                />
                <TextField
                  label="Doses"
                  value={selectedProduct.doses.join(', ')}
                  fullWidth
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{ mt: 1 }}
                />
                {selectedProduct.youtubeVideoLinks.length > 0 && (
                  <TextField
                    label="YouTube Links"
                    value={selectedProduct.youtubeVideoLinks.join(', ')}
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{ mt: 1 }}
                  />
                )}
                {selectedProduct.faqs.map(faq => (
                  <Box key={faq._id}>
                    <TextField
                      label={`Q: ${faq.question}`}
                      value={faq.answer}
                      fullWidth
                      InputProps={{
                        readOnly: true,
                      }}
                      sx={{ mt: 2 }}
                    />
                  </Box>
                ))}
              </>
            )}
            <Button variant="contained" onClick={handleModalClose} sx={{ mt: 2 }}>Close</Button>
          </Box>
        </Modal>
      </Paper>
    </Box>
  );
};

export default PlaceOrder;