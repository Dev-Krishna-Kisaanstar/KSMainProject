// store.js
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './productSlice';  // Update this path according to your structure

// Configuring the Redux store
export const store = configureStore({
    reducer: {
        product: productReducer,
        // Add other reducers here if needed
    },
});