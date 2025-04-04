import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  TextField,
  CircularProgress,
  Typography,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  IconButton,
  MenuItem,
  Chip,
  Select,
  OutlinedInput,
  Dialog,
  DialogTitle,
  DialogActions,
} from '@mui/material';
import { AddLocation, Edit, Save, ArrowBack, NearMe, Task, Refresh, Comment, History, LocationOn, ShoppingCart } from '@mui/icons-material';
import axios from 'axios';
import postOfficeData from '../../../Assets/Pincodes/pincodeData.json';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Oldorders from './Tabs/Oldorders';
import PlaceOrder from './Tabs/Placeorder';
import Cxnearbyorders from './Tabs/Cxnearbyorders';
import { styled } from '@mui/material/styles';
import Sidebar from '../../../Sidebars/Operation/OperationAdmin/OperationAdminSidebar';

function OperationAdminseenewcxdetails() {
  const location = useLocation();

  // Initialize mobileNumber from local storage or location state
  const storedMobileNumber = localStorage.getItem("mobileNumber");
  const { mobileNumber = storedMobileNumber } = location.state || {};

  const { customerId } = useParams();
  const navigate = useNavigate();

  // State variables
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeComponent, setActiveComponent] = useState('details');
  const [isEditableAddress, setIsEditableAddress] = useState(false);
  const [isEditableFarming, setIsEditableFarming] = useState(false);
  const [isEditableDetails, setIsEditableDetails] = useState(false);
  const [password, setPassword] = useState('');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isEditingFarming, setIsEditingFarming] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [postOffices, setPostOffices] = useState([]);
  const [updatedCustomer, setUpdatedCustomer] = useState({});

  const [addressDetails, setAddressDetails] = useState({
    village: '',
    pincode: '',
    postOffice: '',
    nearbyLocation: '',
    taluka: '',
    district: '',
    state: '',
  });

  const [customerDetails, setCustomerDetails] = useState({
    fullName: '',
    alternateMobileNumber: '',
    registeredBy: '',
  });

  const [availablePostOffices, setAvailablePostOffices] = useState([]);
  const [farmingDetails, setFarmingDetails] = useState({
    totalAcres: '',
    sourceOfIrrigation: [],
    landAcquisition: '',
    kisaanstarInfo: '',
    crop: [],
    animalHusbandry: [],
  });

  const [selectedServices, setSelectedServices] = useState({
    service1: '',
    service2: '',
    service3: '',
  });

  const [openServiceDialog, setOpenServiceDialog] = useState(false);

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
    'Citrus', 'Custard Apple', 'Strawberry', 'Watermelon', 'Muskmelon',
    'Mango', 'Apple', 'Oranges', 'Sugarcane', 'Tomato', 'Brinjal',
    'Chilli', 'Capsicum', 'Carrot', 'Okra', 'Potato', 'Sweet Potato',
    'Drumstick', 'Rose', 'Cabbage', 'Cauliflower', 'Mustard',
    'Cucumber', 'Beans', 'Bitter Gourd',
  ];

  const animalHusbandryOptions = [
    'Cow', 'Buffalo', 'Pig', 'Donkey',
  ];

  const services = [
    { service1: 'Order Place', service2: 'Order Placed' },
    { service1: 'Agronomy Call', service2: 'Agronomy Related Query' },
    { service1: 'Inquiry Call', service2: 'Product Inquiry Call' },
    { service1: 'Order Related Inquiry', service2: 'Order tracking related call' },
    { service1: 'Profile Verification', service2: 'Profile Created' },
    { service1: 'Random Call', service2: '' },
  ];

  useEffect(() => {
    if (mobileNumber) {
      fetchCustomerDetails(mobileNumber);
      fetchFarmingDetails(mobileNumber);
    } else {
      setError('Mobile number is missing. Cannot fetch customer details.');
    }
  }, [mobileNumber]);

  const fetchCustomerDetails = async (mobileNumber) => {
    setLoading(true);
    setError(''); 
    setCustomer(null);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/search-customer/${mobileNumber}`
      );

      if (response.data && response.data.customer) {
        setCustomer(response.data.customer);
        const fullRegisteredBy = response.data.customer.registeredBy || 'N/A';
        const registeredByName = fullRegisteredBy.replace(/^Operation Admin: /, '');

        setCustomerDetails({
          fullName: response.data.customer.fullName || '',
          alternateMobileNumber: response.data.customer.alternateMobileNumber || '',
          registeredBy: registeredByName,
        });

        const customerAddress = response.data.address || {};
        setAddressDetails({
          village: customerAddress.village || '',
          pincode: customerAddress.pincode || '',
          postOffice: customerAddress.postOffice || '',
          taluka: customerAddress.taluka || '',
          district: customerAddress.district || '',
          state: customerAddress.state || '',
          nearbyLocation: customerAddress.nearbyLocation || '',
        });

        if (customerAddress.pincode) {
          handleChangeAddress({
            target: { name: 'pincode', value: customerAddress.pincode }
          });
          await fetchPostOffices(customerAddress.pincode);
        }

        const isAddressEmpty = Object.values(customerAddress).every(
          (field) => field.trim() === ''
        );
        setIsEditableAddress(isAddressEmpty);
      } else {
        setError('No customer details found.');
      }
    } catch (err) {
      console.error('Error fetching customer details:', err);
      setError('Failed to load customer details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPostOffices = async (pincode) => {
    if (pincode && pincode.length === 6) {
      const matchedPostOffices = postOfficeData[pincode] || [];
      setAvailablePostOffices(matchedPostOffices);
    } else {
      setAvailablePostOffices([]);
    }
  };

  const fetchFarmingDetails = async (mobileNumber) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/search-customer/${mobileNumber}`
      );
      const fetchedFarmingDetails = response.data.farmingDetails || {};
      setFarmingDetails((prevDetails) => ({
        ...prevDetails,
        ...fetchedFarmingDetails,
      }));

      const isFarmingEmpty = Object.values(fetchedFarmingDetails).every(
        (field) => !field || (Array.isArray(field) && field.length === 0)
      );
      setIsEditableFarming(isFarmingEmpty);
    } catch (error) {
      console.error('Error fetching farming details:', error);
      setError('Failed to fetch farming details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAddress = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/add-address/${customerId}`,
        addressDetails
      );

      setError('');
      fetchCustomerDetails(mobileNumber);
      setIsEditableAddress(false);
    } catch (error) {
      console.error('Error saving address:', error);
      setError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async () => {
    setLoading(true);
    setError('');
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/update-address/${customerId}`,
        addressDetails
      );

      setError('');
      fetchCustomerDetails(mobileNumber);
      setIsEditableAddress(false);
    } catch (error) {
      console.error('Error updating address:', error);
      setError('Failed to update address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddressDetails((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEditAddress = () => {
    if (isEditableAddress) {
      const isAddressEmpty = Object.values(addressDetails).every(field => !field.trim());

      if (isAddressEmpty) {
        handleSubmitAddress();
      } else {
        handleUpdateAddress();
      }

      setIsEditingAddress(false);
    } else {
      setIsEditableAddress(true);
      setIsEditingAddress(true);
    }
  };

  const handleSubmitCustomerDetails = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/update-customer/${customerId}`,
        customerDetails
      );
      toast.success('Customer details saved successfully!');
      fetchCustomerDetails(mobileNumber);
      setIsEditableDetails(false);
    } catch (error) {
      console.error('Error saving customer details:', error);
      setError('Failed to save customer details.');
      toast.error('Failed to save customer details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomerAndFarmingDetails = (mobileNumber) => {
    if (mobileNumber) {
      fetchCustomerDetails(mobileNumber);
      fetchFarmingDetails(mobileNumber);
    } else {
      setError('Mobile number is missing. Cannot fetch customer details.');
    }
  };

  useEffect(() => {
    fetchCustomerAndFarmingDetails(mobileNumber);
  }, [mobileNumber]);

  const handleToggleComponent = (event, newComponent) => {
    if (newComponent) {
      setActiveComponent(newComponent);

      if (newComponent === 'addAddress') {
        fetchCustomerAndFarmingDetails(mobileNumber);

        setAddressDetails({
          village: '',
          pincode: '',
          postOffice: '',
          nearbyLocation: '',
          taluka: '',
          district: '',
          state: '',
        });
      }
    }
  };

  const handleChangeAddress = (e) => {
    const { name, value } = e.target;
    setAddressDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));

    if (name === 'pincode') {
      fetchPostOffices(value);
    }
  };

  const handlePostOfficeChange = (e) => {
    const selectedPostOffice = e.target.value;
    const selectedOffice = availablePostOffices.find(
      (office) => office.officename === selectedPostOffice
    );

    if (selectedOffice) {
      setAddressDetails((prev) => ({
        ...prev,
        postOffice: selectedPostOffice,
        taluka: selectedOffice.Taluk || selectedOffice.Districtname,
        district: selectedOffice.Districtname,
        state: selectedOffice.statename,
      }));
    }
  };

  const handleChangeFarming = (e) => {
    const { name, value } = e.target;
    setFarmingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleChangeCustomerDetails = (e) => {
    const { name, value } = e.target;
    setCustomerDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value === 'N/A' ? '' : value,
    }));
  };

  const handleSubmitFarmingDetails = async () => {
    setLoading(true);
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/add-farming-details/${customerId}`,
        farmingDetails
      );
      toast.success('Farming details saved successfully!');
      fetchFarmingDetails(mobileNumber);
      setIsEditableFarming(false);
    } catch (error) {
      console.error('Error submitting farming details:', error);
      setError('Failed to submit farming details.');
      toast.error('Failed to submit farming details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFarmingDetails = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/update-farming-details/${customerId}`,
        farmingDetails
      );
      toast.success('Farming details updated successfully!');
      fetchFarmingDetails(mobileNumber);
      setIsEditableFarming(false);
    } catch (error) {
      console.error('Error updating farming details:', error);
      setError('Failed to update farming details.');
      toast.error('Failed to update farming details.');
    } finally {
      setLoading(false);
    }
  };

  const toggleEditFarming = () => {
    if (isEditableFarming) {
      const isFarmingDetailsEmpty = Object.values(farmingDetails).every(field => !field || (Array.isArray(field) && field.length === 0));

      if (isFarmingDetailsEmpty) {
        handleSubmitFarmingDetails();
      } else {
        handleUpdateFarmingDetails();
      }

      setIsEditingFarming(false);
    } else {
      setIsEditableFarming(true);
      setIsEditingFarming(true);
    }
  };

  const toggleEditDetails = () => {
    if (isEditableDetails) {
      handleSubmitCustomerDetails();
      setIsEditingDetails(false);
    } else {
      setIsEditableDetails(true);
      setIsEditingDetails(true);
    }
  };

  const handleRefresh = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/regenerate-password/${customerId}`,
        {}
      );

      if (response.status === 200) {
        const newPassword = response.data.actualPassword;
        setPassword(newPassword);
        toast.success('Password regenerated successfully!');
        fetchFarmingDetails(mobileNumber);
      } else {
        setError('Failed to regenerate password.');
      }
    } catch (error) {
      console.error('Error regenerating password:', error);
      setError('Failed to regenerate password.');
      toast.error('Failed to regenerate password.');
    } finally {
      setLoading(false);
    }
  };

  const yourStyle = { fontFamily: 'Poppins, sans-serif' };

  const handleNavigateBack = () => {
    setOpenServiceDialog(true);
  };

  return (
    <div style={{
      ...pageStyle,
      backgroundColor: 'rgba(15, 21, 53, 0.6)', 
      backdropFilter: 'blur(10px)',     
      borderRadius: '12px',                     
      padding: '16px',
      color: 'white'                              
    }}>
       <Sidebar />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
      <Box style={{ flex: 1 }} className="p-4 rounded shadow">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <IconButton onClick={handleNavigateBack} color="primary">
            <ArrowBack style={{ color: 'white' }} />
          </IconButton>

          <Typography
            variant="h4"
            className="text-center"
            style={{ fontFamily: 'Poppins, sans-serif', color: 'white' }}
          >
            Customer Details
          </Typography>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" style={{ marginRight: '8px', fontFamily: 'Poppins, sans-serif', color: 'white' }}>
              Registered By: {customerDetails.registeredBy || 'N/A'}
            </Typography>
            <IconButton onClick={toggleEditDetails} color="primary">
              {isEditingDetails ? <Save style={{ color: 'white' }} /> : <Edit style={{ color: 'white' }} />}
            </IconButton>
          </div>
        </div>

        {loading ? (
          <CircularProgress color="inherit" sx={{ display: 'block', margin: '0 auto' }} />
        ) : error ? (
          <Alert severity="error" sx={{ color: 'white' }}>{error}</Alert>
        ) : customer ? (
          <Grid container spacing={2} style={yourStyle}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Task style={{ marginRight: '8px', color: 'white' }} />
                Full Name
              </Typography>
              <TextField
                variant="outlined"
                label=""
                fullWidth
                value={customerDetails.fullName || ''}
                onChange={handleChangeCustomerDetails}
                name="fullName"
                InputProps={{
                  readOnly: !isEditableDetails,
                  style: { color: 'white' }
                }}
                className="mb-2"
                sx={{
                  input: {
                    color: 'white',
                  },
                  fieldset: {
                    borderColor: 'green'
                  }
                }}
              />
              <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Task style={{ marginRight: '8px', color: 'white' }} />
                Alternate Mobile Number
              </Typography>
              <TextField
                variant="outlined"
                label=""
                fullWidth
                value={customerDetails.alternateMobileNumber || ''}
                onChange={handleChangeCustomerDetails}
                name="alternateMobileNumber"
                InputProps={{
                  readOnly: !isEditableDetails,
                  style: { color: 'white' }
                }}
                className="mb-2"
                sx={{
                  input: {
                    color: 'white',
                  },
                  fieldset: {
                    borderColor: 'green'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Task style={{ marginRight: '8px', color: 'white' }} />
                Mobile Number
              </Typography>
              <TextField
                label=""
                variant="outlined"
                fullWidth
                value={customer.mobileNumber || ''}
                InputProps={{ readOnly: true, style: { color: 'white' } }}
                className="mb-2"
                sx={{
                  input: {
                    color: 'white',
                  },
                  fieldset: {
                    borderColor: 'green'
                  }
                }}
              />
              <div>
                <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <Refresh style={{ marginRight: '8px', color: 'white' }} />
                  Generate Password
                  <IconButton onClick={handleRefresh} size="small" style={{ marginLeft: '8px' }} disabled={loading}>
                    <Refresh style={{ color: 'white' }} />
                  </IconButton>
                </Typography>
                <TextField
                  variant="outlined"
                  label=""
                  fullWidth
                  value={password || ''}
                  name="password"
                  InputProps={{ readOnly: true, style: { color: 'white' } }}
                  className="mb-2"
                  sx={{
                    input: {
                      color: 'white',
                    },
                    fieldset: {
                      borderColor: 'green'
                    }
                  }}
                />
              </div>
            </Grid>
          </Grid>
        ) : null}

        <Box mt={4}>
          <ToggleButtonGroup
            value={activeComponent}
            exclusive
            onChange={handleToggleComponent}
            aria-label="component toggle"
            fullWidth
            sx={{ mb: 4 }}
          >
            <ToggleButton
              value="oldOrders"
              aria-label="old orders"
              sx={{
                height: 50,
                borderRadius: '20px',
                border: '2px solid green',
                backgroundColor: activeComponent === 'oldOrders' ? 'green' : '#0f1535',
                color: activeComponent === 'oldOrders' ? 'white' : 'white',
                '&:hover': {
                  backgroundColor: activeComponent !== 'oldOrders' ? 'rgba(0, 255, 0, 0.2)' : 'green',
                  color: 'black',
                  borderColor: 'green',
                },
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
              }}
            >
              <History style={{ color: activeComponent === 'oldOrders' ? 'white' : 'green', marginRight: '8px' }} /> Old Orders
            </ToggleButton>
            <ToggleButton
              value="cxNearbyOrders"
              aria-label="cx nearby orders"
              sx={{
                height: 50,
                borderRadius: '20px',
                border: '2px solid green',
                backgroundColor: activeComponent === 'cxNearbyOrders' ? 'green' : '#0f1535',
                color: activeComponent === 'cxNearbyOrders' ? 'white' : 'white',
                '&:hover': {
                  backgroundColor: activeComponent !== 'cxNearbyOrders' ? 'rgba(0, 255, 0, 0.2)' : 'green',
                  color: 'black',
                  borderColor: 'green',
                },
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
              }}
            >
              <LocationOn style={{ color: activeComponent === 'cxNearbyOrders' ? 'white' : 'green', marginRight: '8px' }} /> Cx Nearby Orders
            </ToggleButton>
            <ToggleButton
              value="placeOrder"
              aria-label="place order"
              sx={{
                height: 50,
                borderRadius: '20px',
                border: '2px solid green',
                backgroundColor: activeComponent === 'placeOrder' ? 'green' : '#0f1535',
                color: activeComponent === 'placeOrder' ? 'white' : 'white',
                '&:hover': {
                  backgroundColor: activeComponent !== 'placeOrder' ? 'rgba(0, 255, 0, 0.2)' : 'green',
                  color: 'black',
                  borderColor: 'green',
                },
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
              }}
            >
              <ShoppingCart style={{ color: activeComponent === 'placeOrder' ? 'white' : 'green', marginRight: '8px' }} /> Place Order
            </ToggleButton>
            <ToggleButton
              value="addAddress"
              aria-label="addAddress"
              onClick={() => setActiveComponent('addAddress')}
              sx={{
                height: 50,
                borderRadius: '20px',
                border: '2px solid green',
                backgroundColor: activeComponent === 'addAddress' ? 'green' : '#0f1535',
                color: activeComponent === 'addAddress' ? 'white' : 'white',
                '&:hover': {
                  backgroundColor: activeComponent !== 'addAddress' ? 'rgba(0, 255, 0, 0.2)' : 'green',
                  color: 'black',
                  borderColor: 'green',
                },
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
              }}
            >
              <AddLocation style={{ color: activeComponent === 'addAddress' ? 'white' : 'green', marginRight: '8px' }} /> Add Address
            </ToggleButton>

            <ToggleButton
              value="addFarmingDetails"
              aria-label="farming details"
              onClick={() => setActiveComponent('addFarmingDetails')}
              sx={{
                height: 50,
                borderRadius: '20px',
                border: '2px solid green',
                backgroundColor: activeComponent === 'addFarmingDetails' ? 'green' : '#0f1535',
                color: activeComponent === 'addFarmingDetails' ? 'white' : 'white',
                '&:hover': {
                  backgroundColor: activeComponent !== 'addFarmingDetails' ? 'rgba(0, 255, 0, 0.2)' : 'green',
                  color: 'black',
                  borderColor: 'green',
                },
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
              }}
            >
              <Task style={{ color: activeComponent === 'addFarmingDetails' ? 'white' : 'green', marginRight: '8px' }} /> Farming Details
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <div>
          <Box>
            {loading ? (
              <CircularProgress color="inherit" sx={{ display: 'block', margin: '0 auto' }} />
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <div>
                {activeComponent === 'oldOrders' && <Oldorders />}
                {activeComponent === 'cxNearbyOrders' && <Cxnearbyorders />}
                {activeComponent === 'placeOrder' && <PlaceOrder customerId={customerId} />}
              </div>
            )}
          </Box>

          {activeComponent === 'addAddress' && (
            <GlassEffectBox>
              <AddressDetailsContainer>
                <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem' }}>
                  Address Details
                  <div style={{ marginLeft: 'auto' }}>
                    <IconButton onClick={toggleEditAddress} color="primary">
                      {isEditingAddress ? <Save style={{ color: 'green', fontSize: '1.5rem' }} /> : <Edit style={{ color: 'green', fontSize: '1.5rem' }} />}
                    </IconButton>
                  </div>
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Village"
                      variant="outlined"
                      fullWidth
                      name="village"
                      value={addressDetails.village}
                      onChange={handleChangeAddress}
                      InputProps={{ readOnly: !isEditableAddress }}
                    />
                    <StyledTextField
                      label="Pincode"
                      variant="outlined"
                      fullWidth
                      name="pincode"
                      value={addressDetails.pincode}
                      onChange={handleChangeAddress}
                      InputProps={{ readOnly: !isEditableAddress }}
                    />
                    <StyledTextField
                      label="Post Office"
                      variant="outlined"
                      fullWidth
                      name="postOffice"
                      select
                      value={addressDetails.postOffice}
                      onChange={handlePostOfficeChange}
                    >
                      {availablePostOffices.length > 0 ? (
                        availablePostOffices.map((office) => (
                          <MenuItem key={office.officename} value={office.officename}>
                            {office.officename}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>No Post Offices Available</MenuItem>
                      )}
                    </StyledTextField>
                    <StyledTextField
                      label="Taluka"
                      variant="outlined"
                      fullWidth
                      name="taluka"
                      value={addressDetails.taluka}
                      onChange={handleChangeAddress}
                      InputProps={{ readOnly: !isEditableAddress }}
                    />
                    <StyledTextField
                      label="State"
                      variant="outlined"
                      fullWidth
                      name="state"
                      value={addressDetails.state}
                      onChange={handleChangeAddress}
                      InputProps={{ readOnly: !isEditableAddress }}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <StyledTextField
                      label="Nearby Location"
                      variant="outlined"
                      fullWidth
                      name="nearbyLocation"
                      value={addressDetails.nearbyLocation}
                      onChange={handleChangeAddress}
                      InputProps={{ readOnly: !isEditableAddress }}
                    />
                    <StyledTextField
                      label="District"
                      variant="outlined"
                      fullWidth
                      name="district"
                      value={addressDetails.district}
                      onChange={handleChangeAddress}
                      InputProps={{ readOnly: !isEditableAddress }}
                    />
                  </Grid>
                </Grid>

                {isEditableAddress && (
                  <StyledButton variant="contained" onClick={toggleEditAddress}>
                    {Object.values(addressDetails).some(field => field.trim()) ? 'Update Address' : 'Save Address'}
                  </StyledButton>
                )}
              </AddressDetailsContainer>
            </GlassEffectBox>
          )}
        </div>

        {activeComponent === 'addFarmingDetails' && (
          <GlassEffectBox>
            <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', fontFamily: 'Poppins, sans-serif', color: 'white' }}>
              Farming Details
              <div style={{ marginLeft: 'auto' }}>
                <IconButton onClick={toggleEditFarming} color="primary">
                  {isEditingFarming ? <Save style={{ color: 'green' }} /> : <Edit style={{ color: 'green' }} />}
                </IconButton>
              </div>
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ color: 'white' }}>Source of Irrigation</Typography>
                <Select
                  fullWidth
                  multiple
                  value={farmingDetails.sourceOfIrrigation}
                  onChange={(e) => {
                    const { target: { value } } = e;
                    const newValue = typeof value === 'string' ? value.split(',') : value;
                    setFarmingDetails((prevDetails) => ({
                      ...prevDetails,
                      sourceOfIrrigation: newValue,
                    }));
                  }}
                  input={<OutlinedInput style={{ color: 'white' }} />}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                      ))}
                    </Box>
                  )}
                  disabled={!isEditableFarming}
                  style={{ color: 'white' }}
                >
                  {sourceOfIrrigationOptions.map((option) => (
                    <MenuItem key={option} value={option} style={{ color: 'black', backgroundColor: 'white' }}>
                      {farmingDetails.sourceOfIrrigation.includes(option) ? <strong>{option}</strong> : option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  label="Land Acquisition"
                  variant="outlined"
                  fullWidth
                  name="landAcquisition"
                  value={farmingDetails.landAcquisition}
                  onChange={handleChangeFarming}
                  InputProps={{
                    readOnly: !isEditableFarming,
                    style: { color: 'white' }
                  }}
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ color: 'white' }}>Kisaanstar Info</Typography>
                <Select
                  fullWidth
                  value={farmingDetails.kisaanstarInfo || ''}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFarmingDetails((prevDetails) => ({
                      ...prevDetails,
                      kisaanstarInfo: value,
                    }));
                  }}
                  input={<OutlinedInput style={{ color: 'white' }} />}
                  displayEmpty
                  disabled={!isEditableFarming}
                  style={{ color: 'white' }}
                >
                  {kisaanstarInfoOptions.map((option) => (
                    <MenuItem key={option} value={option} style={{ color: 'black', backgroundColor: 'white' }}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ color: 'white' }}>Crop</Typography>
                <Select
                  fullWidth
                  multiple
                  value={farmingDetails.crop}
                  onChange={(e) => {
                    const { target: { value } } = e;
                    const newValue = typeof value === 'string' ? value.split(',') : value;
                    setFarmingDetails((prevDetails) => ({
                      ...prevDetails,
                      crop: newValue,
                    }));
                  }}
                  input={<OutlinedInput style={{ color: 'white' }} />}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                      ))}
                    </Box>
                  )}
                  disabled={!isEditableFarming}
                  style={{ color: 'white' }}
                >
                  {cropOptions.map((option) => (
                    <MenuItem key={option} value={option} style={{ color: 'black', backgroundColor: 'white' }}>
                      {farmingDetails.crop.includes(option) ? <strong>{option}</strong> : option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle1" style={{ color: 'white' }}>Animal Husbandry</Typography>
                <Select
                  fullWidth
                  multiple
                  value={farmingDetails.animalHusbandry}
                  onChange={(e) => {
                    const { target: { value } } = e;
                    const newValue = typeof value === 'string' ? value.split(',') : value;
                    setFarmingDetails((prevDetails) => ({
                      ...prevDetails,
                      animalHusbandry: newValue,
                    }));
                  }}
                  input={<OutlinedInput style={{ color: 'white' }} />}
                  renderValue={(selected) => (
                    <Box display="flex" flexWrap="wrap" gap={0.5}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} style={{ color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.3)' }} />
                      ))}
                    </Box>
                  )}
                  disabled={!isEditableFarming}
                  style={{ color: 'white' }}
                >
                  {animalHusbandryOptions.map((option) => (
                    <MenuItem key={option} value={option} style={{ color: 'black', backgroundColor: 'white' }}>
                      {farmingDetails.animalHusbandry.includes(option) ? <strong>{option}</strong> : option}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>

            {isEditableFarming && (
              <StyledButton
                variant="contained"
                onClick={() => {
                  toggleEditFarming();
                }}
                style={{ color: 'white' }}
              >
                {Object.values(farmingDetails).some(field => field) ? 'Update Farming Details' : 'Save Farming Details'}
              </StyledButton>
            )}
          </GlassEffectBox>
        )}

        <Dialog open={openServiceDialog} onClose={() => setOpenServiceDialog(false)} maxWidth="md">
          <DialogTitle style={{ display: 'flex', alignItems: 'center' }}>
            <NearMe style={{ color: 'green', marginRight: '8px' }} />
            Select Services
          </DialogTitle>
          <Box sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Select
                  fullWidth
                  value={selectedServices.service1}
                  onChange={(e) => setSelectedServices((prev) => ({ ...prev, service1: e.target.value }))}
                  displayEmpty
                  sx={{
                    '& .MuiSelect-root': {
                      color: 'black',
                    },
                    '& .MuiMenuItem-root': {
                      color: 'black',
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Service 1</em>
                  </MenuItem>
                  {services.map((service, index) => service.service1 && (
                    <MenuItem key={index} value={service.service1}>
                      {service.service1}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} md={4}>
                <Select
                  fullWidth
                  value={selectedServices.service2}
                  onChange={(e) => setSelectedServices((prev) => ({ ...prev, service2: e.target.value }))}
                  displayEmpty
                  input={<OutlinedInput style={{ color: 'black' }} />}
                >
                  <MenuItem value="" style={{ color: 'black' }}>
                    <em>Select Service 2</em>
                  </MenuItem>
                  {services.map((service, index) => service.service2 && (
                    <MenuItem key={index} value={service.service2} style={{ color: 'black' }}>
                      {service.service2}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Service 3 Description"
                  value={selectedServices.service3}
                  onChange={(e) => setSelectedServices((prev) => ({ ...prev, service3: e.target.value }))}
                  variant="outlined"
                  placeholder="Describe your service here"
                  style={{ color: 'white' }}
                />
              </Grid>
            </Grid>
          </Box>
          <DialogActions>
            <Button onClick={() => setOpenServiceDialog(false)} color="error">
              Cancel
            </Button>
            <Button color="primary">
              Submit Services
            </Button>
          </DialogActions>
        </Dialog>

      </Box>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
    </div>
  );
}

const pageStyle = {
  backgroundColor: '#1e1e2f',
  minHeight: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
};

const GlassEffectBox = styled(Box)(({ theme }) => ({
  backdropFilter: 'blur(10px)', 
  backgroundColor: 'rgba(15, 21, 53, 0.4)', 
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[10],
}));

const AddressDetailsContainer = styled(Box)(({ theme }) => ({
  fontFamily: 'Poppins, sans-serif',
  color: 'white',
  padding: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  '& .MuiOutlinedInput-root': {
    color: 'white',
    fontSize: '1.2rem',
  },
  '& .MuiInputLabel-root': {
    color: 'white',
    fontSize: '1.1rem',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#4CAF50',
  color: 'white',
  fontSize: '1.1rem',
  '&:hover': {
    backgroundColor: '#45a049',
  },
}));

export default OperationAdminseenewcxdetails;
