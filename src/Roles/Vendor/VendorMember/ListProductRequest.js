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
  Button,
} from "@mui/material";
import Sidebar from "../../../Sidebars/Vendor/VendorMember/VendorMemberSidebar";
import { useNavigate } from "react-router-dom";

const ListProductRequest = () => {
  const [productRequests, setProductRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductRequests = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/vendor-member/product-request`,
          { withCredentials: true }
        );
        setProductRequests(response.data.pendingProductRequests || []); 
      } catch (error) {
        console.error("Error fetching product requests:", error);
      }
    };
    fetchProductRequests();
  }, []);

  const viewDetails = (id) => {
    navigate(`/ViewDetails/${id}`);
  };

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <Box m={3} style={styles.contentContainer}>
        <Typography variant="h4" align="center" style={styles.pageTitle}>
          Registered Product Requests
        </Typography>
        
        <TableContainer component={Paper} elevation={5} sx={styles.tableContainer}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["Product Image", "Product Price", "Product Name", "Actions"].map((header) => (
                  <TableCell 
                    key={header} 
                    style={styles.tableHeader}
                    align="center"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {productRequests.length > 0 ? (
                productRequests.map((request) => (
                  <TableRow key={request._id} hover style={styles.tableRow}>
                    <TableCell align="center">
                      {request.productImages && request.productImages.length > 0 ? (
                        <img
                          src={request.productImages[0]}
                          alt="Product"
                          style={styles.productImage}
                        />
                      ) : (
                        <Typography>No Image</Typography>
                      )}
                    </TableCell>
                    <TableCell align="center">{request.productBasedPrice}</TableCell>
                    <TableCell align="center">{request.productName}</TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => viewDetails(request._id)}
                        style={styles.viewButton}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" style={styles.noDataText}>
                    No Product Requests Registered
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

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
    color: '#f0f0f0',
    marginBottom: '20px',
  },
  tableContainer: {
    maxHeight: 440,
  },
  tableHeader: {
    backgroundColor: '#37474f',
    color: '#fff',
    fontWeight: 'bold',
  },
  tableRow: {
    backgroundColor: '#2a3d47',
  },
  productImage: {
    width: '100px',
    height: 'auto',
  },
  viewButton: {
    backgroundColor: '#BB86FC',
    '&:hover': {
      backgroundColor: '#3700B3',
    },
  },
  noDataText: {
    color: '#f44336',
    fontStyle: 'italic',
  },
};

export default ListProductRequest;
