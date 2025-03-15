import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Button,
  CircularProgress,
} from '@mui/material';
import Sidebar from '../../../Sidebars/Vendor/VendorAdmin/VendorAdminSidebar';

const ListPendingProducts = () => {
  const [pendingProducts, setPendingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPendingProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/vendor-admin/vender-member/pending-product-request`,
          { withCredentials: true }
        );
        setPendingProducts(response.data.pendingProductRequests || []); // Default to empty array if undefined
        setLoading(false);
      } catch (error) {
        console.error("Error fetching pending products:", error);
        setLoading(false);
      }
    };
    fetchPendingProducts();
  }, []);

  const handleViewDetails = (vendorId) => {
    navigate(`/ListPendingProducts/ViewDetailsPendingProducts/${vendorId}`);
  };

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <Box sx={styles.contentContainer}>
        <Typography variant="h5" align="center" sx={styles.pageTitle}>
          Pending Product Requests
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
                {pendingProducts.length > 0 ? (
                  pendingProducts.map((product, index) => (
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
                      No pending products available
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
};

// 🎨 Styled Components (same as the previous components)
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

export default ListPendingProducts;
