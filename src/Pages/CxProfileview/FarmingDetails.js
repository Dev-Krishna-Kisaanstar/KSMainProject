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
  Chip,
  IconButton,
  MenuItem,
  Select,
  OutlinedInput,
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
import { useNavigate } from 'react-router-dom';

function FarmingDetails() {
  const [farmingDetails, setFarmingDetails] = useState({
    totalAcres: '',
    sourceOfIrrigation: [],
    landAcquisition: '',
    kisaanstarInfo: '',
    crop: [],
    animalHusbandry: [],
  });

  const [loading, setLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(false); // Controls if fields are editable
  const [isNewCustomer, setIsNewCustomer] = useState(true); // Tracks if the user is new or existing
  const [isMobile, setIsMobile] = useState(true);
  const navigate = useNavigate();


  const sourceOfIrrigationOptions = [
    'Bore well', 'Well', 'Canal', 'Farm Pond', 'Lake', 'Dam Water',
  ];

  const kisaanstarInfoOptions = [
    'Instagram', 'Website', 'Referral', 'Exhibition', 'WhatsApp',
    'Google', 'YouTube', 'Campaign', 'Outbound', 'LinkedIn',
  ];

  const cropOptions = [
    'Rice', 'Paddy', 'Cotton', 'Gram', 'Black Gram', 'Green Gram', 'Tur',
    'Pigeonpea', 'Pea', 'Pomegranate', 'Papaya', 'Banana', 'Grapes',
    'Citrus', 'Custard Apple', 'Strawberry', 'Watermelon', 'Muskmelon', 'Mango',
    'Apple', 'Oranges', 'Sugarcane', 'Tomato', 'Brinjal', 'Chilli',
    'Capsicum', 'Carrot', 'Okra', 'Potato', 'Sweet Potato', 'Drumstick', 'Rose',
    'Cabbage', 'Cauliflower', 'Mustard', 'Cucumber', 'Beans', 'Bitter Gourd',
  ];

  const animalHusbandryOptions = [
    'Cow', 'Buffalo', 'Pig', 'Donkey',
  ];

  useEffect(() => {
    fetchFarmingDetails();
  }, []);

  const fetchFarmingDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/customers/dashboard`, { withCredentials: true });
      const fetchedFarmingDetails = response.data.farmingDetails || {};

      setFarmingDetails(fetchedFarmingDetails);

      // Check if all fields are empty or default values
      const isNew = Object.values(fetchedFarmingDetails).every(
        (field) => (Array.isArray(field) && field.length === 0) || field === ''
      );

      setIsNewCustomer(isNew); // Determine if the user is new or existing
      setIsEditable(isNew); // Make fields editable if the user is new

    } catch (error) {
      console.error('Error fetching farming details:', error);
      toast.error('Failed to fetch farming details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFarmingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleAddField = (field, value) => {
    if (Array.isArray(value)) {
      setFarmingDetails((prevDetails) => ({
        ...prevDetails,
        [field]: value,
      }));
    } else if (!farmingDetails[field].includes(value)) {
      setFarmingDetails((prevDetails) => ({
        ...prevDetails,
        [field]: [...prevDetails[field], value],
      }));
    }
  };

  const handleRemoveField = (field, value) => {
    setFarmingDetails((prevDetails) => ({
      ...prevDetails,
      [field]: prevDetails[field].filter((item) => item !== value),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (isNewCustomer) {
        // Save new details
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/customers/farming-details`,
          farmingDetails,
          { withCredentials: true }
        );
        toast.success("Farming details saved successfully!");
      } else {
        // Update existing details
        await axios.put(
          `${process.env.REACT_APP_API_URL}/api/customers/farming-details`,
          farmingDetails,
          { withCredentials: true }
        );
        toast.success("Farming details updated successfully!");
      }

      fetchFarmingDetails(); // Re-fetch data to reflect updates
      setIsEditable(false); // Disable editing after submission

    } catch (error) {
      console.error('Error submitting farming details:', error);
      toast.error(error.response?.data?.message || 'Failed to submit farming details.');
    } finally {
      setLoading(false);
    }
  };
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
              Farming Details
            </Typography>
            {!isNewCustomer && (
              <IconButton
                onClick={() => {
                  if (isEditable) {
                    handleSubmit(); // Save data if currently editing
                  }
                  setIsEditable(!isEditable); // Toggle between edit and view mode
                }}
                sx={{ color: isEditable ? 'blue' : 'green' }}
              >
                {isEditable ? <SaveIcon /> : <EditIcon />}
              </IconButton>
            )}
          </Box>
          <form>
            <Grid container spacing={2}>
              {/* Source of Irrigation */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  Source of Irrigation
                </Typography>
                <Select
                  fullWidth
                  multiple
                  value={farmingDetails.sourceOfIrrigation}
                  onChange={(e) => handleAddField('sourceOfIrrigation', e.target.value)}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  disabled={!isEditable}
                >
                  {sourceOfIrrigationOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Land Acquisition */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  Land Acquisition
                </Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  name="landAcquisition"
                  value={farmingDetails.landAcquisition}
                  onChange={handleChange}
                  InputProps={{
                    style: { fontFamily: 'Poppins, sans-serif' },
                    readOnly: !isEditable,
                  }}
                />
              </Grid>

              {/* Kisaanstar Info */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  Kisaanstar Info
                </Typography>
                <Select
                  fullWidth
                  value={farmingDetails.kisaanstarInfo || ''}
                  onChange={(e) => {
                    setFarmingDetails((prevDetails) => ({
                      ...prevDetails,
                      kisaanstarInfo: e.target.value,
                    }));
                  }}
                  input={<OutlinedInput />}
                  displayEmpty
                  disabled={!isEditable}
                >
                  {kisaanstarInfoOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Crop */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  Crop
                </Typography>
                <Select
                  fullWidth
                  multiple
                  value={farmingDetails.crop}
                  onChange={(e) => handleAddField('crop', e.target.value)}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  disabled={!isEditable}
                >
                  {cropOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              {/* Animal Husbandry */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  Animal Husbandry
                </Typography>
                <Select
                  fullWidth
                  multiple
                  value={farmingDetails.animalHusbandry}
                  onChange={(e) => handleAddField('animalHusbandry', e.target.value)}
                  input={<OutlinedInput />}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                  disabled={!isEditable}
                >
                  {animalHusbandryOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>

            {/* Save Details Button */}
            {isNewCustomer && (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  sx={{
                    mt: 3,
                    backgroundColor: '#4BAF47',
                    '&:hover': { backgroundColor: '#3E9B3D' },
                    fontFamily: 'Poppins, sans-serif',
                  }}
                >
                  Save Details
                </Button>
              </Grid>
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

export default FarmingDetails;