import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  CardMedia,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';

function CartSidebar({ initialCartItems, onClose }) {
  const [cartItems, setCartItems] = useState(initialCartItems || []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subtotal, setSubtotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCartItems = async () => {
      const customerSession = Cookies.get('customerSession');

      console.log("in the cart sidebar");

      if (!customerSession) {
        setError('No customer session found');
        setLoading(false);
        return;
      }

      

      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/cart`, {
          withCredentials: true,
        });

         if(response.data.statusCode===0){
          toast.info("cart is empty")
          setCartItems([]); // Ensure cartItems is an empty array


          return;
        }
        
        const cartData = response.data.cart;

        
        if (!cartData || !Array.isArray(cartData)) {
          throw new Error('Cart data is not in the expected format');
        }

        const enrichedCartItems = cartData.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          productImages: item.productImages,
          price: item.price,
        }));

        setCartItems(enrichedCartItems);
      } catch (err) {
        setError('Failed to load cart items');
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setSubtotal(total);
  }, [cartItems]);

  const handleRemoveFromCart = async (productId) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/remove`, {
        withCredentials: true,
        data: { productId },
      });

      if (response.status === 200) {
        setCartItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
        alert('Product removed from cart successfully!');
      } else {
        throw new Error('Failed to remove item from cart');
      }
    } catch (error) {
      alert('Failed to remove item from cart');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: 350,
          backgroundColor: '#f1f1f1',
          padding: 2,
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Loading cart items...</Typography>
      </Box>
    );
  }

  if (error === 'No customer session found') {
    return (
      <Box
        sx={{
          width: 350,
          backgroundColor: '#f1f1f1',
          padding: 2,
          position: 'fixed',
          right: 0,
          top: 0,
          height: '100%',
          boxShadow: '0 0 10px rgba(0,0,0,0.2)',
          zIndex: 1200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" gutterBottom>
          You need to log in to view your cart.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#4CAF50',
            color: 'white',
            '&:hover': { backgroundColor: '#45A049' },
          }}
          onClick={() => navigate('/login')}
        >
          Login
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: 350,
        backgroundColor: '#f1f1f1',
        padding: 2,
        position: 'fixed',
        right: 0,
        top: 0,
        height: '100%',
        boxShadow: '0 0 10px rgba(0,0,0,0.2)',
        zIndex: 1200,
        overflowY: 'scroll',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" gutterBottom>
          My Shopping Cart
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      {cartItems?.length > 0 ? (
        <>
          {cartItems.map((item) => (
            <Box key={item.productId} display="flex" alignItems="center" mb={2}>
              <CardMedia
                component="img"
                height="150"
                image={item.productImages}
                alt={item.productName}
                style={{ borderRadius: '8px', marginRight: 10, width: '150px' }}
              />
              <Box flex={1}>
                <Typography variant="subtitle1">{item.productName || 'Unknown Product'}</Typography>
                <Typography variant="body2">Quantity: {item.quantity}</Typography>
                <Typography variant="body2">Price: ₹ {item.price ? item.price.toFixed(2) : '0.00'}</Typography>
                <Button variant="outlined" color="error" onClick={() => handleRemoveFromCart(item.productId)}>
                  Remove
                </Button>
              </Box>
            </Box>
          ))}

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6">Subtotal: ₹ {subtotal.toFixed(2)}</Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: '#4CAF50',
              color: 'white',
              marginTop: 2,
              '&:hover': { backgroundColor: '#45A049' },
            }}
            fullWidth
            onClick={() => {
              navigate('/cart');
              onClose();
            }}
          >
            View Cart
          </Button>
        </>
      ) : (
        <Typography variant="body2">Your cart is empty</Typography>
      )}
    </Box>
  );
}

export default CartSidebar;
