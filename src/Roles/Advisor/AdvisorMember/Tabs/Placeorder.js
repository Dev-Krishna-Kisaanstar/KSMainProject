import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  MenuItem,
  Snackbar,
  Paper,
  Divider,
  Grid,
  Tooltip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Autocomplete from '@mui/material/Autocomplete';
import ClearIcon from '@mui/icons-material/Clear';


const PlaceOrder = ({ customerId, advisorId }) => {
  const [products, setProducts] = useState([{ productId: "", quantity: 1 }]);
  const [subtotal, setSubtotal] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [productOptions, setProductOptions] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/vendor-admin/products`, {
          withCredentials: true,
        });
        if (Array.isArray(response.data.products)) {
          setProductOptions(response.data.products);
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
    const calculatedSubtotal = products.reduce((sum, product) => sum + (product.price * product.quantity || 0), 0);
    const discountAmount = selectedCoupon ? coupons.find(c => c.code === selectedCoupon)?.discountAmount || 0 : 0;
    setSubtotal(calculatedSubtotal);
    setDiscount(discountAmount);
    setFinalPrice(Math.max(0, calculatedSubtotal - discountAmount));
  }, [products, selectedCoupon]);

  const handleProductChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].productId = value ? value._id : "";
    newProducts[index].price = value ? Number(value.productBasedPrice) : 0;
    setProducts(newProducts);
  };

  const handleQuantityChange = (index, value) => {
    const newProducts = [...products];
    newProducts[index].quantity = value >= 1 ? value : 1;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { productId: "", quantity: 1 }]);
  };

  const deleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const placeOrder = async () => {
    if (!customerId) {
      toast.error("Customer ID is required.");
      return;
    }

    const orders = products.map(product => ({
      productId: product.productId,
      quantity: product.quantity,
    }));

    if (orders.some(order => !order.productId)) {
      toast.error("Please select a product for all items.");
      return;
    }

    const dataToSend = {
      customerId,
      paymentMethod: "COD", // Assuming COD
      transactionId: null, // Assuming no transaction ID for COD
      couponCode: selectedCoupon || "",
      orders,
    };

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/place-by-advisor`,
        dataToSend,
        {
          withCredentials: true,
        }
      );

      if (response.data.message === "Orders processed") {
        toast.success("Order placed successfully!");
        setProducts([{ productId: "", quantity: 1 }]); // Clear products after successful order
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
      backgroundColor: "#0F1535", // Set the background color
      borderRadius: 3, 
      boxShadow: 3, 
      mt: 4,
      position: 'relative',
      overflow: 'hidden',
      background: 'rgba(15, 21, 53, 0.7)', // Semi-transparent background color
      backdropFilter: 'blur(10px)', // Glass effect (blurred background)
    }}
  >
    <ToastContainer />
    <Typography 
      variant="h4" 
      sx={{ 
        color: "#ffffff", // White color for the text to contrast with the dark background
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
        backgroundColor: "rgba(255, 255, 255, 0.1)", // Slightly transparent background for the paper element
        backdropFilter: 'blur(5px)', // Applying some blur for the paper to blend with the glass effect
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
  
      {products.map((product, index) => (
        <Grid container spacing={2} key={index} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={5}>
            <Autocomplete
              options={productOptions} 
              getOptionLabel={(option) => option.productName} 
              renderInput={(params) => (
                <TextField 
                  {...params} 
                  label="Product" 
                  fullWidth 
                  sx={{
                    color: 'white', // White text for the input
                    '& .MuiInputLabel-root': {
                      color: 'white', // White label color
                    },
                    '& .MuiOutlinedInput-root': {
                      color: 'white', // White input text
                      '& fieldset': {
                        borderColor: 'white', // Border color
                      },
                      '&:hover fieldset': {
                        borderColor: 'white', // Hover border color
                      },
                    },
                  }} 
                />
              )}
              onChange={(event, value) => handleProductChange(index, value)} 
            />
          </Grid>
          <Grid item xs={3}>
            <TextField 
              label="Quantity" 
              type="number" 
              value={product.quantity} 
              onChange={(e) => handleQuantityChange(index, Math.max(Number(e.target.value), 1))} 
              fullWidth
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                borderRadius: 1,
                color: 'white', 
                '& .MuiInputLabel-root': {
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
            />
          </Grid>
          <Grid item xs={3}>
            <TextField 
              label="Price (₹)" 
              type="number" 
              value={product.price * product.quantity} 
              fullWidth 
              disabled 
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                borderRadius: 1,
                color: 'white',
                '& .MuiInputLabel-root': {
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
            />
          </Grid>
          <Grid item xs={1}>
            <Tooltip title="Remove Product">
              <IconButton onClick={() => deleteProduct(index)} color="error">
                <DeleteIcon sx={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      ))}
      <Divider sx={{ my: 2, borderColor: 'white' }} />
      <Typography variant="h6" sx={{ color: '#ffffff' }}>Subtotal: ₹{subtotal}</Typography>
      <Typography variant="h6" sx={{ color: '#ffffff' }}>Discount: ₹{discount}</Typography>
      <Typography variant="h5" sx={{ color: "#ffffff", fontWeight: "bold" }}>Final Price: ₹{finalPrice}</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            onClick={addProduct}
            color="success"
            startIcon={<AddCircleIcon />}
            fullWidth
            sx={{
              height: 55,
              borderRadius: 12,
              fontWeight: 'bold',
              fontSize: 16,
              textTransform: 'none',
              paddingLeft: 2,
              paddingRight: 2,
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
              '& .MuiButton-startIcon': {
                marginRight: 1.5,
                transition: 'all 0.3s ease',
              },
            }}
          >
            Add Product
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            onClick={placeOrder}
            color="success"
            disabled={submitting}
            fullWidth
            sx={{
              height: 55,
              borderRadius: 12,
              fontWeight: 'bold',
              fontSize: 16,
              textTransform: 'none',
              paddingLeft: 2,
              paddingRight: 2,
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
              '& .MuiButton-startIcon': {
                marginRight: 1.5,
                transition: 'all 0.3s ease',
              },
            }}
          >
            {submitting ? "Placing Order..." : "Place Order"}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  </Box>
  
  );
};

export default PlaceOrder;