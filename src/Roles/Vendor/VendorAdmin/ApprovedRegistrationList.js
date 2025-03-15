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

function ApprovedRegistrationList() {
  const [vendorRequests, setVendorRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApprovedRegistrationRequests = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/vendor-admin/get-vendor-members`,
          { withCredentials: true }
        );
        setVendorRequests(response.data.vendorMembers);
      } catch (error) {
        console.error("Error fetching approved registration requests:", error);
      }
      setLoading(false);
    };
    fetchApprovedRegistrationRequests();
  }, []);

  const handleViewDetails = (vendorId) => {
    navigate(`/ApprovedRegistrationList/ViewApprovedRegistrationfulldetails/${vendorId}`);
  };

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <Box sx={styles.contentContainer}>
        <Typography variant="h5" align="center" sx={styles.pageTitle}>
          Approved Registration Requests
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
                  {['Sr. No.', 'Full Name', 'Mobile Number', 'Official Email', 'Actions'].map((header) => (
                    <TableCell key={header} sx={styles.tableHeader}>
                      {header}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {vendorRequests.length > 0 ? (
                  vendorRequests.map((vendorRequest, index) => (
                    <TableRow key={vendorRequest._id} hover sx={styles.tableRow}>
                      <TableCell sx={styles.tableCell}>{index + 1}</TableCell>
                      <TableCell sx={styles.tableCell}>{vendorRequest.fullName}</TableCell>
                      <TableCell sx={styles.tableCell}>{vendorRequest.mobileNumber}</TableCell>
                      <TableCell sx={styles.tableCell}>{vendorRequest.emailId}</TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Button
                          variant="contained"
                          sx={styles.viewButton}
                          onClick={() => handleViewDetails(vendorRequest._id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={styles.noDataText}>
                      No approved registration requests found
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

// 🌟 Styled Components
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

export default ApprovedRegistrationList;
