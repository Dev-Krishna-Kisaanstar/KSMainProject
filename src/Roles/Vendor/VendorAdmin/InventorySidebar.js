import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Tabs,
    Tab,
    Grid,
    Divider,
    Button,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

function InventorySidebar({ onPriceSubmit, productBasePrice, MRP, sellPrice, stockOnHold, stockListedForSell, isEditing, setIsEditing, productId }) {
    const [inventoryData, setInventoryData] = useState({
        productBasedPrice: productBasePrice || '',
        MRP: MRP || '',
        sellPrice: sellPrice || '', 
        stockOnHold: stockOnHold || '',
        stockListedForSell: stockListedForSell || ''
    });

    const [availableForSale, setAvailableForSale] = useState(true);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        setInventoryData(prev => ({
            ...prev,
            productBasedPrice: productBasePrice || '',
            MRP: MRP || '',
            sellPrice: sellPrice || '',
            stockOnHold: stockOnHold || '',
            stockListedForSell: stockListedForSell || ''
        }));
    }, [productBasePrice, MRP, sellPrice, stockOnHold, stockListedForSell]);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        console.log("Switched to tab:", newValue);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInventoryData(prevData => ({ ...prevData, [name]: value }));
        console.log(`Updated ${name} to:`, value);
    };

    const submitStock = async () => {
        console.log("Submitting stock data:", inventoryData);
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/vendor-admin/add-stock/${productId}`,
                inventoryData,
                { withCredentials: true }
            );
            toast.success("Stock updated successfully!");
            console.log("Stock updated successfully!");
        } catch (error) {
            console.error("Error updating stock:", error);
            toast.error("Failed to update stock.");
        }
    };

    const handleSavePricing = () => {
        if (availableForSale && (!inventoryData.sellPrice || inventoryData.sellPrice <= 0)) {
            toast.error("Please enter a valid Sell Price when Available for Sale is checked.");
            console.log("Sell Price is required when Available for Sale is checked.");
            return; // prevent submission if sell price is not provided
        }

        const priceData = {
            productBasedPrice: inventoryData.productBasedPrice,
            sellPrice: inventoryData.sellPrice,
            MRP: inventoryData.MRP
        };
        
        onPriceSubmit(priceData);
        console.log("Submitted price data:", priceData);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: 'auto',
                backgroundColor: '#f5f5f5',
                color: '#000',
                borderRadius: 2,
                padding: 1,
            }}
        >
            <Box
                sx={{
                    width: '25%',
                    backgroundColor: '#e0e0e0',
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Inventory
                </Typography>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    orientation="vertical"
                    sx={{
                        width: '100%',
                        color: '#000',
                    }}
                >
                    <Tab label="Pricing" />
                    <Tab label="Restock" />
                </Tabs>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ backgroundColor: '#2e3a4e' }} />
            <Box
                sx={{
                    flex: 1,
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                {selectedTab === 0 && (
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Product Based Price"
                                name="productBasedPrice"
                                value={inventoryData.productBasedPrice}
                                onChange={handleChange}
                                variant="outlined"
                                disabled={!isEditing}
                            />
                        </Grid>
                        {availableForSale && (
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Sell Price"
                                    name="sellPrice"
                                    value={inventoryData.sellPrice}
                                    onChange={handleChange}
                                    variant="outlined"
                                    disabled={!isEditing}
                                />
                            </Grid>
                        )}
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="MRP"
                                name="MRP"
                                value={inventoryData.MRP}
                                variant="outlined"
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={availableForSale}
                                        onChange={() => {
                                            if (isEditing) {
                                                setAvailableForSale(prev => !prev);
                                                console.log("Toggled available for sale to:", !availableForSale);
                                            }
                                        }}
                                        disabled={!isEditing}
                                    />
                                }
                                label="Available for Sale"
                            />
                        </Grid>
                    </Grid>
                )}

                {selectedTab === 1 && (
                    <Grid container spacing={1}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Stock On Hold"
                                name="stockOnHold"
                                value={inventoryData.stockOnHold}
                                onChange={handleChange}
                                variant="outlined"
                                // Always editable
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Stock Listed For Sell"
                                name="stockListedForSell"
                                value={inventoryData.stockListedForSell}
                                onChange={handleChange}
                                variant="outlined"
                                // Always editable
                            />
                        </Grid>
                    </Grid>
                )}

                <Box sx={{ marginTop: 2 }}>
                    {/* Display the submit stock button in the Restock tab unconditionally */}
                    {selectedTab === 1 && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={submitStock}
                            sx={{ marginRight: 1 }}
                        >
                            Submit Stock
                        </Button>
                    )}
                    {/* Pricing actions should depend on isEditing */}
                    {isEditing && selectedTab === 0 && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSavePricing}
                        >
                            Save Pricing
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
}

export default InventorySidebar;