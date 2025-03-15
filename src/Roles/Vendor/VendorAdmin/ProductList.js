import React, { useEffect, useState } from "react";
import axios from "axios";
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
} from "@mui/material";
import Sidebar from "../../../Sidebars/Vendor/VendorAdmin/VendorAdminSidebar";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const [advisories, setpendingProductRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvisories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/vendor-member/product-request`,
          { withCredentials: true }
        );
        setpendingProductRequests(response.data.pendingProductRequests || []); // Set defaults to empty array if undefined
        setLoading(false);
      } catch (error) {
        console.error("Error fetching advisories:", error);
        setLoading(false);
      }
    };
    fetchAdvisories();
  }, []);

  const viewdetails = (id) => {
    navigate(`/ViewDetails/${id}`); // Navigate to the details page with the ID
  };

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <Box sx={styles.contentContainer}>
        <Typography variant="h5" align="center" sx={styles.pageTitle}>
          Registered Product Requests
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="200px">
            <CircularProgress sx={{ color: "#fff" }} />
          </Box>
        ) : (
          <TableContainer component={Paper} elevation={3} sx={styles.tableContainer}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Product Image", "Product Based Price", "Product Name", "Actions"].map((header) => (
                    <TableCell key={header} sx={styles.tableHeader}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {advisories.length > 0 ? (
                  advisories.map((advisory, index) => (
                    <TableRow key={advisory._id} hover sx={styles.tableRow}>
                      <TableCell sx={styles.tableCell}>
                        {Array.isArray(advisory.productImages) && advisory.productImages.length > 0 ? (
                          <img src={advisory.productImages[0]} alt="Product" style={{ width: '100px', height: 'auto' }} />
                        ) : (
                          <Typography sx={{ color: "#fff" }}>No Image</Typography>
                        )}
                      </TableCell>
                      <TableCell sx={styles.tableCell}>{advisory.productBasedPrice}</TableCell>
                      <TableCell sx={styles.tableCell}>{advisory.productName}</TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Button
                          variant="contained"
                          sx={styles.viewButton}
                          onClick={() => viewdetails(advisory._id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align="center" sx={styles.noDataText}>
                      No Product Requests Registered
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

const styles = {
  pageContainer: {
    display: "flex",
    flexDirection: "row",
    minHeight: "100vh",
    backgroundColor: "#121212", // Dark background color
    color: "#fff", // White text color
  },
  contentContainer: {
    flex: 1,
    padding: "80px 20px",
  },
  pageTitle: {
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "20px",
  },
  tableContainer: {
    maxHeight: 440,
    backgroundColor: "#1e1e2f",
  },
  tableHeader: {
    backgroundColor: "#37474f", // Dark background for table header
    color: "#fff", // White text in header
    fontWeight: "bold",
    textAlign: "center",
  },
  tableRow: {
    backgroundColor: "#2a3d47", // Dark row background
    "&:hover": {
      backgroundColor: "#455a64", // Lighter background when hovered
    },
  },
  tableCell: {
    color: "#fff", // White text for table cells
    textAlign: "center", // Center text
  },
  viewButton: {
    backgroundColor: "#1976d2", // Blue button color
    color: "#fff", // White text
    "&:hover": {
      backgroundColor: "#1565c0", // Darker blue on hover
    },
  },
  noDataText: {
    color: "#fff", // White text for no data message
    fontStyle: "italic",
  },
};

export default ProductList;
