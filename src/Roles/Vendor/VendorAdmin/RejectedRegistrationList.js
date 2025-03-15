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

function RejectedRegistrationList() {
  const [vendorRequests, setVendorRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRejectedRegistrationRequests = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/vendor-admin/vendor-member/rejected-registration-requests`,
          { withCredentials: true }
        );
        setVendorRequests(response.data.vendorRequests);
      } catch (error) {
        console.error("Error fetching rejected registration requests:", error);
      }
      setLoading(false);
    };
    fetchRejectedRegistrationRequests();
  }, []);

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <Box sx={styles.contentContainer}>
        <Typography variant="h5" align="center" sx={styles.pageTitle}>
          Rejected Registration Requests
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
                  {['Sr. No.', 'Full Name', 'Mobile Number', 'Official Email', 'Vendor ID'].map((header) => (
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
                      <TableCell sx={styles.tableCell}>{vendorRequest._id}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={styles.noDataText}>
                      No rejected registration requests found
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

// 🎨 Styled Components
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
  noDataText: {
    color: '#fff',
    fontStyle: 'italic',
  },
};

export default RejectedRegistrationList;
