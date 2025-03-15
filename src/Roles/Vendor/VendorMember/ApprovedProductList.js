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
import Sidebar from '../../../Sidebars/Vendor/VendorMember/VendorMemberSidebar';
import { useNavigate } from 'react-router-dom';

function ApprovedProductsList() {
  const [approvedProducts, setApprovedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/vendor-member/approved-products`,
          { withCredentials: true }
        );

        if (response.data.approvedProducts) {
          setApprovedProducts(response.data.approvedProducts);
        } else {
          setError("No approved products found.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching approved products:", error);
        setError("Failed to fetch approved products.");
        setLoading(false);
      }
    };
    fetchApprovedProducts();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <Box m={3} style={styles.contentContainer}>
        <Typography variant="h4" align="center" style={styles.pageTitle}>
          Approved Product Requests
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" style={styles.errorText}>
            {error}
          </Typography>
        ) : (
          <TableContainer component={Paper} elevation={5} sx={styles.tableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Sr. No.", "Product Name", "Status", "Category", "MRP", "Brand"].map((header) => (
                    <TableCell key={header} style={styles.tableHeader} align="center">
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {approvedProducts.map((product, index) => (
                  <TableRow key={product._id} hover style={styles.tableRow}>
                    <TableCell align="center" style={styles.tableCell}>{index + 1}</TableCell>
                    <TableCell align="center" style={styles.tableCell}>{product.productName}</TableCell>
                    <TableCell align="center" style={styles.tableCell}>{product.status}</TableCell>
                    <TableCell align="center" style={styles.tableCell}>{product.category}</TableCell>
                    <TableCell align="center" style={styles.tableCell}>₹ {product.productBasedPrice}</TableCell>
                    <TableCell align="center" style={styles.tableCell}>{product.productBrandName}</TableCell>
                  </TableRow>
                ))}
                {approvedProducts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center" style={styles.noDataText}>
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
    backgroundColor: '#1e1e2f',
    color: '#fff',
  },
  contentContainer: {
    paddingTop: '80px',
    flex: 1,
    paddingBottom: '30px',
  },
  pageTitle: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: '20px',
  },
  errorText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#fff',
  },
  tableContainer: {
    maxHeight: 440,
  },
  tableHeader: {
    backgroundColor: '#37474f',
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center', // Ensures header text is centered
  },
  tableRow: {
    backgroundColor: '#2a3d47',
    '&:hover': {
      backgroundColor: '#455a64',
    },
  },
  tableCell: {
    color: '#fff', // Ensures data text is white
    textAlign: 'center', // Center align the data
  },
  noDataText: {
    color: '#fff',
    fontStyle: 'italic',
  },
};


export default ApprovedProductsList;
