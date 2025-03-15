import { configureStore } from '@reduxjs/toolkit';
import productReducer from './Redux/productSlice';
import cartReducer from './Redux/cartSlice';

export const store = configureStore({
  reducer: {
    product: productReducer,
    cart: cartReducer,
  },
});