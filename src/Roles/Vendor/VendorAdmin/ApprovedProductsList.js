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
  Button,
} from '@mui/material';
import Sidebar from '../../../Sidebars/Vendor/VendorAdmin/VendorAdminSidebar';
import { useNavigate } from 'react-router-dom';

function ApprovedProductsList() {
    const [approvedProducts, setApprovedProducts] = useState([]); // State for approved products
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Initialize navigation

    useEffect(() => {
      const fetchApprovedProducts = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/vendor-admin/products`,
            { withCredentials: true }
          );
          setApprovedProducts(response.data.products); // Set the products from the response
          setLoading(false);
        } catch (error) {
          console.error("Error fetching approved products:", error);
          setLoading(false);
        }
      };
      fetchApprovedProducts();
    }, []);

    const handleViewDetails = (productId) => {
      navigate(`/ApprovedProductsList/ViewDetailsApprovedProducts/${productId}`, { state: { productId } });
    };

    return (
      <div style={styles.pageContainer}>
          <Sidebar />
          <Box sx={styles.contentContainer}>
            <Typography variant="h5" align="center" sx={styles.pageTitle}>
              Approved Product Requests
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center" alignItems="center" height="200px">
                <CircularProgress sx={{ color: '#fff' }} />
              </Box>
            ) : (
              <TableContainer component={Paper} elevation={3} sx={styles.tableContainer}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {['Sr. No.', 'Product Name', 'Status', 'Category', 'Price', 'Actions'].map((header) => (
                        <TableCell key={header} sx={styles.tableHeader}>
                          {header}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {approvedProducts.length > 0 ? (
                      approvedProducts.map((product, index) => (
                        <TableRow key={product._id} hover sx={styles.tableRow}>
                          <TableCell sx={styles.tableCell}>{index + 1}</TableCell>
                          <TableCell sx={styles.tableCell}>{product.productName}</TableCell>
                          <TableCell sx={styles.tableCell}>{product.status}</TableCell>
                          <TableCell sx={styles.tableCell}>{product.category}</TableCell>
                          <TableCell sx={styles.tableCell}>₹ {product.productBasedPrice}</TableCell>
                          <TableCell sx={styles.tableCell}>
                            <Button
                              variant="contained"
                              sx={styles.viewButton}
                              onClick={() => handleViewDetails(product._id)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center" sx={styles.noDataText}>
                          No approved products available
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
    backgroundColor: '#121212',
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
    backgroundColor: '#37474f',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    backgroundColor: '#2a3d47',
    '&:hover': {
      backgroundColor: '#455a64',
    },
  },
  tableCell: {
    color: '#fff',
    textAlign: 'center',
  },
  viewButton: {
    backgroundColor: '#1976d2',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#1565c0',
    },
  },
  noDataText: {
    color: '#fff',
    fontStyle: 'italic',
  },
};

export default ApprovedProductsList;
