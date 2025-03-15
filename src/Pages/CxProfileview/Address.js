import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  CircularProgress,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Headerbar from '../../Components/SmallComponents/Headerbar';
import Header from '../../Components/SmallComponents/Header';
import Footer from '../../Components/SmallComponents/Footer';
import Footerbar from '../../Components/SmallComponents/Footerbar';
import CxprofileSidebar from '../../Components/CxprofileSidebar/Cxprofilesidebar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import postOfficesData from '../../Assets/Pincodes/pincodeData.json';
import { useNavigate } from 'react-router-dom';

function Address() {
  const [addressDetails, setAddressDetails] = useState({
    nearbyLocation: '',
    village: '',
    pincode: '',
    postOffice: '',
    state: '',
    taluka: '',
    district: '',
  });

  const [loading, setLoading] = useState(false);
  const [postOffices, setPostOffices] = useState([]);
  const [isEditable, setIsEditable] = useState(false);
  const [hasAddress, setHasAddress] = useState(false); // Whether address exists in API response
  const [isMobile, setIsMobile] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    fetchAddress();
  }, []);

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/dashboard`, { withCredentials: true });
      const fetchedAddress = response.data.address || {};
      setAddressDetails(fetchedAddress);

      // Set the `hasAddress` state based on whether the address fields are filled
      const isAddressPresent = Object.values(fetchedAddress).some((field) => field !== '');
      setHasAddress(isAddressPresent);

      // Enable edit mode if the address is empty
      setIsEditable(!isAddressPresent);

    } catch (error) {
      console.error('Error fetching address:', error);
      toast.error('Failed to fetch address.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    // Update the post office based on the entered pincode
    if (name === 'pincode') {
      const enteredPincode = value;
      if (postOfficesData[enteredPincode]) {
        setPostOffices(postOfficesData[enteredPincode]);
        setAddressDetails((prevState) => ({ ...prevState, postOffice: '', taluka: '', district: '', state: '' }));
      } else {
        setPostOffices([]);
        setAddressDetails((prevState) => ({ ...prevState, postOffice: '', taluka: '', district: '', state: '' }));
      }
    }
  };

  const handlePostOfficeChange = (e) => {
    const selectedOffice = e.target.value;
    const officeDetails = postOffices.find((office) => office.officename === selectedOffice);
    if (officeDetails) {
      setAddressDetails((prevDetails) => ({
        ...prevDetails,
        postOffice: officeDetails.officename,
        taluka: officeDetails.Taluk,
        district: officeDetails.Districtname,
        state: officeDetails.statename,
      }));
    } else {
      setAddressDetails((prevDetails) => ({
        ...prevDetails,
        postOffice: '',
        taluka: '',
        district: '',
        state: '',
      }));
    }
  };

  const handleupdateSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent default form submission if the event exists
    setLoading(true);

    try {
      const response = await axios.put(
        ` ${process.env.REACT_APP_API_URL}/api/customers/address`,
        addressDetails,
        {
          withCredentials: true,
        }

      );
      console.log("Address submitted:", response.data);
      toast.success("Address submitted successfully!");

      // Fetch the latest address details to update the UI
      fetchAddress();
      setIsEditable(false); // Disable editing after saving/updating
    } catch (error) {
      console.error('Error submitting address:', error);
      toast.error(error.response?.data?.message || 'Failed to submit address.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/customers/address`,
        addressDetails,
        {
          withCredentials: true,
        }

      );
      console.log("Address submitted:", response.data);
      toast.success("Address submitted successfully!");

      // Set `hasAddress` to true after saving the address
      setHasAddress(true);

      // Fetch the latest address details to update the UI
      fetchAddress();
    } catch (error) {
      console.log("Error submitting address:", error);
      toast.error(error.response?.data?.message || "Failed to submit address.");
    } finally {
      setLoading(false);
    }
  };

  const toggleEdit = () => {
    if (isEditable) {
      // If currently in edit mode, submit the form
      handleupdateSubmit(); // This will now work correctly since we do not manipulate the event
    } else {
      setIsEditable(true); // Enable editing
    }
  };

  const isAddressEmpty = Object.values(addressDetails).every(field => field === '');

  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <Headerbar />
      <Header />
      <Container className="mt-5">
        {/* Render Profile navigation buttons for mobile view */}
        {isMobile && (
          <Box
            mb={3}
            sx={(theme) => ({
              padding: 2,
              display: 'flex',
              flexDirection: 'column',
              [theme.breakpoints.up('md')]: {
                display: 'none', // Hide on desktop
              },
              [theme.breakpoints.down('sm')]: {
                display: 'flex', // Show on mobile
              },
            })}
          >
            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                onClick={() => handleButtonClick('/profile')}
                sx={{
                  backgroundColor: '#4BAF47',
                  color: '#FFFFFF',
                  borderRadius: '25px',
                  flexGrow: 1,
                  marginRight: 1,
                }}
              >
                Personal Details
              </Button>
              <Button
                variant="contained"
                onClick={() => handleButtonClick('/orders')}
                sx={{
                  backgroundColor: '#4BAF47',
                  color: '#FFFFFF',
                  borderRadius: '25px',
                  flexGrow: 1,
                }}
              >
                Orders
              </Button>
            </Box>

            <Box display="flex" justifyContent="center" my={2}>
              <Button
                variant="contained"
                onClick={() => handleButtonClick('/FarmingDetails')}
                sx={{
                  backgroundColor: '#4BAF47',
                  color: '#FFFFFF',
                  borderRadius: '25px',
                  flexGrow: 1,
                  width: 'calc(100% - 16px)', // Full width minus margins
                }}
              >
                Farming Details
              </Button>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Button
                variant="contained"
                onClick={() => handleButtonClick('/Wishlist')}
                sx={{
                  backgroundColor: '#4BAF47',
                  color: '#FFFFFF',
                  borderRadius: '25px',
                  flexGrow: 1,
                  marginRight: 1,
                }}
              >
                Wishlist
              </Button>
              <Button
                variant="contained"
                onClick={() => handleButtonClick('/Address')}
                sx={{
                  backgroundColor: '#4BAF47',
                  color: '#FFFFFF',
                  borderRadius: '25px',
                  flexGrow: 1,
                }}
              >
                Address
              </Button>
            </Box>
          </Box>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <CxprofileSidebar />
          </Grid>
          <Grid item xs={12} md={9}>
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
                <CircularProgress />
              </div>
            )}
            {!loading && (
              <Card className="mb-4 rounded-3">
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" gutterBottom sx={{ fontFamily: 'Poppins, sans-serif' }}>
                      Enter Your Address
                    </Typography>
                    {hasAddress && (
                      <IconButton onClick={toggleEdit} sx={{ color: 'green' }}>
                        {isEditable ? <SaveIcon /> : <EditIcon />}
                      </IconButton>
                    )}
                  </Box>

                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Nearby Location"
                          name="nearbyLocation"
                          value={addressDetails.nearbyLocation}
                          onChange={handleChange}
                          required
                          multiline
                          rows={4}
                          InputProps={{
                            style: { fontFamily: 'Poppins, sans-serif' },
                            readOnly: !isEditable,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Village"
                          name="village"
                          value={addressDetails.village}
                          onChange={handleChange}
                          required
                          InputProps={{
                            style: { fontFamily: 'Poppins, sans-serif' },
                            readOnly: !isEditable,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Pincode"
                          name="pincode"
                          value={addressDetails.pincode}
                          onChange={handleChange}
                          required
                          InputProps={{
                            style: { fontFamily: 'Poppins, sans-serif' },
                            readOnly: !isEditable,
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        {isEditable ? (
                          <TextField
                            select
                            fullWidth
                            margin="normal"
                            name="postOffice"
                            label="Post Office"
                            value={addressDetails.postOffice}
                            onChange={handlePostOfficeChange}
                            required
                            SelectProps={{
                              native: true,
                            }}
                            InputProps={{
                              style: { fontFamily: 'Poppins, sans-serif' },
                            }}
                          >
                            <option value="">Select Post Office</option>
                            {postOffices.map((office) => (
                              <option key={office.officename} value={office.officename}>
                                {office.officename}
                              </option>
                            ))}
                          </TextField>
                        ) : (
                          <TextField
                            fullWidth
                            margin="normal"
                            label="Post Office"
                            name="postOffice"
                            value={addressDetails.postOffice}
                            InputProps={{
                              style: { fontFamily: 'Poppins, sans-serif' },
                              readOnly: true,
                            }}
                          />
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="State"
                          name="state"
                          value={addressDetails.state}
                          required
                          InputProps={{
                            readOnly: true,
                            style: { fontFamily: 'Poppins, sans-serif' },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Taluka"
                          name="taluka"
                          value={addressDetails.taluka}
                          required
                          InputProps={{
                            readOnly: true,
                            style: { fontFamily: 'Poppins, sans-serif' },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="District"
                          name="district"
                          value={addressDetails.district}
                          required
                          InputProps={{
                            readOnly: true,
                            style: { fontFamily: 'Poppins, sans-serif' },
                          }}
                        />
                      </Grid>
                    </Grid>
                    {!hasAddress && (
                      <Button
                        type="submit"
                        variant="contained"
                        sx={{
                          mt: 3,
                          backgroundColor: '#4BAF47',
                          '&:hover': { backgroundColor: '#3E9B3D' },
                          fontFamily: 'Poppins, sans-serif',
                        }}
                      >
                        Save Address
                      </Button>
                    )}
                  </form>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <Footerbar />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </>
  );
}

export default Address;