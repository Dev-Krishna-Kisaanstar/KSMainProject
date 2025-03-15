import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [], // List of products
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // To store any errors during fetching
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload; // Set fetched products
      state.status = 'succeeded';
    },
    addProduct: (state, action) => {
      state.products.push(action.payload); // Add a new product
    },
    removeProduct: (state, action) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (product) => product.id === action.payload.id
      );
      if (index !== -1) {
        state.products[index] = action.payload; // Update the product
      }
    },
  },
});

export const { setProducts, addProduct, removeProduct, updateProduct } =
  productSlice.actions;

export default productSlice.reducer;