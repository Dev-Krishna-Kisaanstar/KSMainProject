import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Grid,
  Button,
  Paper,
} from '@mui/material';
import Sidebar from '../../../Sidebars/Vendor/VendorAdmin/VendorAdminSidebar';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewPendingVendorMemberRegistrationRequest = () => {
  const location = useLocation();
  const member = location.state?.member;

  const [remark, setRemark] = useState('');
  const [remarkError, setRemarkError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const suggestions = [
    'Incomplete documents',
    'Invalid details',
    'Other reasons',
    'Did not meet requirements',
    'Pending additional verification'
  ];

  if (!member) {
    return (
      <Box p={3}>
        <Typography variant="h6" align="center" sx={{ color: '#fff' }}>
          No member details found.
        </Typography>
      </Box>
    );
  }

  const handleAccept = async () => {
    setIsSubmitting(true);
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/vendor-admin/vendor-member/update-status/${member._id}`,
        { status: 'approved' },
        { withCredentials: true }
      );
      toast.success('Request accepted successfully');
      window.history.back(); // Go back after successful approval
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error('Failed to accept request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (remark.length < 50) {
      setRemarkError('Remark must be at least 50 characters.');
      return;
    }

    const finalRemark = remark || 'No remark added while rejecting';

    setIsSubmitting(true);
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/vendor-admin/vendor-member/update-status/${member._id}`,
        { status: 'rejected', remark: finalRemark },
        { withCredentials: true }
      );
      toast.success('Request rejected successfully');
      window.history.back(); // Go back after successful rejection
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error('Failed to reject request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={pageStyle}>
      <Sidebar />
      <Box p={3} style={{ flex: 1 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          Member Details
        </Typography>
        <Paper elevation={3} sx={{ padding: '20px', backgroundColor: '#1e1e2f' }}>
          <Grid container spacing={2}>
            {Object.entries(member).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                {typeof value === 'string' && value.startsWith('data:image') ? (
                  <Box textAlign="center" my={2}>
                    <Typography variant="subtitle2" sx={{ color: '#fff' }}>
                      {`${key.replace(/([A-Z])/g, ' $1')}:`}
                    </Typography>
                    <img
                      src={value}
                      alt={key}
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', border: '2px solid #1976d2' }}
                    />
                  </Box>
                ) : (
                  <TextField
                    label={key.replace(/([A-Z])/g, ' $1')} // Add space before capital letters in labels
                    value={value}
                    fullWidth
                    InputProps={{ readOnly: true, style: { color: '#fff' } }} // Set text color to white
                    variant="outlined"
                    sx={{
                      marginBottom: '15px',
                      '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                      },
                      '& .MuiInputBase-root': {
                        backgroundColor: '#2a2a2a',
                      },
                      '& .MuiInputBase-input': {
                        color: '#fff', // Set the input text color to white
                      },
                      '& .MuiFormLabel-root': {
                        color: '#fff', // Set label text color to white
                      },
                    }}
                  />
                )}
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Box mt={3}>
          <Typography variant="h6" sx={{ color: '#fff' }}>Remark:</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Please provide a remark"
            error={!!remarkError}
            helperText={remarkError}
            variant="outlined"
            sx={{
              marginTop: 2,
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
              },
              '& .MuiInputBase-input': {
                color: '#fff', // Set the input text color to white
              },
              '& .MuiInputBase-root': {
                backgroundColor: '#2a2a2a',
              },
              '& .MuiFormLabel-root': {
                color: '#fff', // Set label text color to white
              },
            }}
          />
          <Box mt={2} textAlign="center">
            {suggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outlined"
                color="primary"
                onClick={() => setRemark(remark + ' ' + suggestion)}
                style={{ margin: '5px' }}
              >
                {suggestion}
              </Button>
            ))}
          </Box>
        </Box>

        <Box mt={3} textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={handleAccept}
            disabled={isSubmitting}
            style={{ marginRight: '10px' }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleReject}
            disabled={isSubmitting}
          >
            Reject
          </Button>
          <Button
            variant="outlined"
            color="default"
            onClick={() => window.history.back()}
            style={{ marginLeft: '10px' }}
          >
            Go Back
          </Button>
        </Box>
      </Box>
    </div>
  );
};

const pageStyle = {
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100vh',
  backgroundColor: '#121212',
  color: '#fff',
  paddingTop: '80px'
};

export default ViewPendingVendorMemberRegistrationRequest;