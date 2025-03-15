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

const PendingVendorMemberRegistrationRequest = () => {
  const [vendorMembers, setVendorMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVendorMembers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/vendor-admin/vendor-member/pending-registration-requests`,
          { withCredentials: true }
        );
        setVendorMembers(response.data.vendorRequests);
      } catch (error) {
        console.error("Error fetching vendor members:", error);
      }
      setLoading(false);
    };
    fetchVendorMembers();
  }, []);

  const handleViewDetails = (member) => {
    navigate('/pendingregistrationrequests/ViewPendingVendorMemberRegistrationRequest', { state: { member } });
  };

  return (
    <div style={styles.pageContainer}>
      <Sidebar />
      <Box sx={styles.contentContainer}>
        <Typography variant="h5" align="center" sx={styles.pageTitle}>
          Pending Vendor Member Registration Request
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
                {vendorMembers.length > 0 ? (
                  vendorMembers.map((member, index) => (
                    <TableRow key={index} hover sx={styles.tableRow}>
                      <TableCell sx={styles.tableCell}>{index + 1}</TableCell>
                      <TableCell sx={styles.tableCell}>{member.fullName}</TableCell>
                      <TableCell sx={styles.tableCell}>{member.mobileNumber}</TableCell>
                      <TableCell sx={styles.tableCell}>{member.emailId}</TableCell>
                      <TableCell sx={styles.tableCell}>
                        <Button
                          variant="contained"
                          sx={styles.viewButton}
                          onClick={() => handleViewDetails(member)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={styles.noDataText}>
                      No vendor members registered
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

export default PendingVendorMemberRegistrationRequest;
