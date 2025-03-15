import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cartItems: [], // This initializes the cart items as an empty array
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find(
        (item) => item.id === action.payload.id
      );

      if (existingItem) {
        // Increase quantity if item already exists
        existingItem.quantity += action.payload.quantity;
      } else {
        // Add new item to cart
        state.cartItems.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item.id !== action.payload
      );
    },
    updateCartItem: (state, action) => {
      const { id, quantity } = action.payload; // Destructure id and quantity from the payload
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity; // Update the quantity of the item
      }
    },
  },
});

export const { addToCart, removeFromCart, updateCartItem } = cartSlice.actions;

export default cartSlice.reducer;
