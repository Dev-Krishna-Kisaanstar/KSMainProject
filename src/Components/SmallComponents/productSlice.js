import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import axios from 'axios';

// Fetch product by ID
export const fetchProductById = createAsyncThunk(
    'product/fetchById',
    async (id) => {
        const response = await axios.get(`https://api.kisaanstar.com/api/operational-admin/products/${id}`);
        return response.data;
    }
);

const productSlice = createSlice({
    name: 'product',
    initialState: {
        selectedProduct: {},
        loading: false,
        error: null,
    },
    reducers: {
        setSelectedProduct(state, action) {
            state.selectedProduct = action.payload; // Update the selected product in local state
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedProduct = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { setSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
