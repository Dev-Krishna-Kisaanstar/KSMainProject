import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    CircularProgress,
} from '@mui/material';
import Sidebar from '../../../Sidebars/Vendor/VendorAdmin/VendorAdminSidebar';

function RejectedProductsList() {
    const [rejectedProducts, setRejectedProducts] = useState([]); // State for rejected products
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // State for error handling

    useEffect(() => {
        const fetchRejectedProducts = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/vendor-admin/rejected-product`,
                    { withCredentials: true }
                );

                // Check if the API response structure is as expected
                if (response.data && Array.isArray(response.data.rejectedProducts)) {
                    setRejectedProducts(response.data.rejectedProducts); // Set the products from the response
                } else {
                    setRejectedProducts([]); // Set to empty if response isn't what we expect
                }
            } catch (error) {
                console.error("Error fetching rejected products:", error);
                setError("Failed to fetch rejected products."); // Set error message
            } finally {
                setLoading(false);
            }
        };
        fetchRejectedProducts();
    }, []);

    return (
        <div style={styles.pageContainer}>
            <Sidebar />
            <Box sx={styles.contentContainer}>
                <Typography variant="h5" align="center" sx={styles.pageTitle}>
                    Rejected Products
                </Typography>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                        <CircularProgress sx={{ color: '#fff' }} />
                    </Box>
                ) : error ? (
                    <Typography color="error" align="center" sx={styles.errorText}>
                        {error}
                    </Typography>
                ) : (
                    <TableContainer component={Paper} elevation={3} sx={styles.tableContainer}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {['Sr. No.', 'Product Name', 'Status'].map((header) => (
                                        <TableCell key={header} sx={styles.tableHeader}>
                                            {header}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rejectedProducts.length > 0 ? (
                                    rejectedProducts.map((product, index) => (
                                        <TableRow key={product._id} hover sx={styles.tableRow}>
                                            <TableCell sx={styles.tableCell}>{index + 1}</TableCell>
                                            <TableCell sx={styles.tableCell}>{product.productName}</TableCell>
                                            <TableCell sx={styles.tableCell}>{product.status}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center" sx={styles.noDataText}>
                                            No rejected products available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Box>
        </div>
    );
}

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'row',
        minHeight: '100vh',
        backgroundColor: '#121212', // Dark background
        color: '#fff',
    },
    contentContainer: {
        flex: 1,
        padding: '80px 20px',
    },
    pageTitle: {
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: '20px',
    },
    tableContainer: {
        maxHeight: 440,
        backgroundColor: '#1e1e2f',
    },
    tableHeader: {
        backgroundColor: '#37474f', // Dark background for table header
        color: '#fff', // White text
        fontWeight: 'bold',
        textAlign: 'center',
    },
    tableRow: {
        backgroundColor: '#2a3d47', // Dark row background
        '&:hover': {
            backgroundColor: '#455a64', // Hover effect to lighten row
        },
    },
    tableCell: {
        color: '#fff',
        textAlign: 'center',
    },
    errorText: {
        color: '#ff1744', // Red color for error message
        fontWeight: 'bold',
    },
    noDataText: {
        color: '#fff',
        fontStyle: 'italic',
    },
};

export default RejectedProductsList;
