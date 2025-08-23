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
import { AddLocation, Edit, AddShoppingCart, Save, ArrowBack, NearMe, Task, Refresh, Comment, History, LocationOn, ShoppingCart } from '@mui/icons-material';
import axios from 'axios';
import postOfficeData from '../../../Assets/Pincodes/pincodeData.json';
import Cookies from 'js-cookie';
import TaggingAuth from './Auth/TaggingAuth';
import Tagging from './Tabs/Tagging';
import OrderConfirmation from './Tabs/Oldorders';
// import PlaceOrder from './Tabs/Placeorder';
import Cxnearbyorders from './Tabs/Cxnearbyorders'
import { styled } from '@mui/material/styles';
import ProductListAdvisory from './Tabs/ProductList'
import { School } from '@mui/icons-material';
import AdminPanelSettings from '@mui/icons-material/AdminPanelSettings';

function OperationMemberseenewcxdetails() {
  TaggingAuth();
  const location = useLocation();

  // Initialize mobileNumber from local storage or location state
  const storedMobileNumber = localStorage.getItem("mobileNumber");
  const { mobileNumber = storedMobileNumber } = location.state || {};

  const { customerId } = useParams();
  console.log(customerId);
  
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
    'Rice', 'Paddy', 'Cotton','Onion', 'Gram', 'Black Gram', 'Green Gram', 'Tur',
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
    { service1: 'Attempt 1', service2: 'CNR' },
    { service1: 'Attempt 2', service2: 'Call Picked But Disconnected by Cx' },
    { service1: 'Attempt 3', service2: 'Call Back' },
    { service1: 'Attempt 4', service2: 'Order Cancel' },
    { service1: 'Attempt 5', service2: 'Order Confirm' },
    { service1: 'Attempt 6', service2: '' },
  ];

  // Fetch customer and farming details when mobileNumber changes
  useEffect(() => {
    if (mobileNumber) {
      fetchCustomerDetails(mobileNumber);
      fetchFarmingDetails(mobileNumber);
    } else {
      setError('Mobile number is missing. Cannot fetch customer details.');
    }
  }, [mobileNumber]);

 const fetchCustomerDetails = async (mobileNumber) => {
  console.log('Starting fetchCustomerDetails with mobileNumber:', mobileNumber);
  setLoading(true);
  setError('');
  setCustomer(null); // Reset customer state

  try {
    console.log('Making API call to fetch customer data...');
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/advisory-member/search-customer/${mobileNumber}`,
      { withCredentials: true }
    );
    console.log('API response received:', response.data);

    if (response.data && response.data.customer) {
      console.log('Customer data found:', response.data.customer);
      // Set customer object
      setCustomer(response.data.customer);

      // Extract registeredBy name by removing the advisory member string
      const fullRegisteredBy = response.data.customer.registeredBy || 'N/A';
      const registeredByName = fullRegisteredBy.replace(/^Advisory Member: /, '');
      console.log('Registered By after processing:', registeredByName);

      // Populate customerDetails with fetched data
      setCustomerDetails({
        fullName: response.data.customer.fullName || '',
        alternateMobileNumber: response.data.customer.alternateMobileNumber || '',
        registeredBy: registeredByName, // Use modified value here
      });
      console.log('Customer details set:', {
        fullName: response.data.customer.fullName,
        alternateMobileNumber: response.data.customer.alternateMobileNumber,
        registeredBy: registeredByName,
      });

      // Address details
      const customerAddress = response.data.address || {};
      console.log('Customer address fetched:', customerAddress);
      setAddressDetails({
        village: customerAddress.village || '',
        pincode: customerAddress.pincode || '',
        postOffice: customerAddress.postOffice || '',
        taluka: customerAddress.taluka || '',
        district: customerAddress.district || '',
        state: customerAddress.state || '',
        nearbyLocation: customerAddress.nearbyLocation || '',
      });
      console.log('Address details set:', {
        village: customerAddress.village,
        pincode: customerAddress.pincode,
        postOffice: customerAddress.postOffic,
        taluka: customerAddress.taluka,
        district: customerAddress.district,
        state: customerAddress.state,
        nearbyLocation: customerAddress.nearbyLocation,
      });

      // Fetch post offices if pincode exists
      if (customerAddress.pincode) {
        console.log('Fetching post offices for pincode:', customerAddress.pincode);
        await fetchPostOffices(customerAddress.pincode);
        // Optionally, update addressDetails with fetched post office info
      } else {
        console.log('No pincode available to fetch post offices.');
      }

      // Save mobile and token
      localStorage.setItem('mobileNumber', mobileNumber);
      Cookies.set('frontendadvisorycustomertoken', response.data.customer._id);
      console.log('Saved mobile and token:', {
        mobileNumber,
        token: response.data.customer._id,
      });

      // Check if address is empty
      const isAddressEmpty = Object.values(customerAddress).every(
        (field) => typeof field === 'string' && field.trim() === ''
      );
      console.log('Is address empty?', isAddressEmpty);
      setIsEditableAddress(isAddressEmpty);
    } else {
      console.log('No customer data found in response.');
      setError('No customer details found.');
    }
  } catch (err) {
    console.error('Error fetching customer details:', err);
    setError('Failed to load customer details. Please try again later.');
  } finally {
    console.log('fetchCustomerDetails completed.');
    setLoading(false);
  }
};

  // Function to fetch post offices based on pincode
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
        `${process.env.REACT_APP_API_URL}/api/advisory-member/search-customer/${mobileNumber}`,
        { withCredentials: true }
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
        addressDetails,
        { withCredentials: true }
      );
      // Refresh customer details after saving address
      await fetchCustomerDetails(mobileNumber);
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
        addressDetails,
        { withCredentials: true }
      );
      await fetchCustomerDetails(mobileNumber);
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
      const isAddressEmpty = Object.values(addressDetails).every((field) => !field.trim());

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
        customerDetails,
        { withCredentials: true }
      );
      await fetchCustomerDetails(mobileNumber);
      setIsEditableDetails(false);
    } catch (error) {
      console.error('Error saving customer details:', error);
      setError('Failed to save customer details.');
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
        farmingDetails,
        { withCredentials: true }
      );
      fetchFarmingDetails();
      setIsEditableFarming(false);
    } catch (error) {
      console.error('Error submitting farming details:', error);
      setError('Failed to submit farming details.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateFarmingDetails = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/update-farming-details/${customerId}`,
        farmingDetails,
        { withCredentials: true }
      );
      fetchFarmingDetails();
      setIsEditableFarming(false);
    } catch (error) {
      console.error('Error updating farming details:', error);
      setError('Failed to update farming details.');
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
      setIsEditableFarming(false);
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
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        const newPassword = response.data.actualPassword;
        setPassword(newPassword);
        fetchFarmingDetails();
      } else {
        setError('Failed to regenerate password.');
      }
    } catch (error) {
      console.error('Error regenerating password:', error);
      setError('Failed to regenerate password.');
    } finally {
      setLoading(false);
    }
  };

  const [username, setUsername] = useState('');

  useEffect(() => {
   const fetchUsername = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-member/dashbord`, {
      withCredentials: true,
    });
    const { advisoryMember } = response.data || {};
    if (advisoryMember && advisoryMember.fullName) {
      const fetchedUsername = advisoryMember.fullName;
      setUsername(fetchedUsername);
      console.log('Fetched username:', fetchedUsername);
    } else {
      console.warn('advisoryMember or fullName not found in response', response.data);
    }
  } catch (error) {
    console.error('Failed to fetch username:', error);
    setError('Failed to fetch data.');
  }
};
    fetchUsername();
  }, []);

  const handleSubmitTagging = async () => {
    setLoading(true);
    setError('');
    try {
      const requestBody = {
        service1: selectedServices.service1,
        service2: selectedServices.service2,
        remarks: selectedServices.service3,
        advisorName: username,
        taggedDate: new Date().toISOString(),
      };
      console.log('Tagging request payload:', requestBody);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/advisory-member/tagging/${customerId}`,
        requestBody,
        { withCredentials: true }
      );
      if (response.status === 200 || response.status === 201) {
        Cookies.remove('frontendadvisorycustomertoken');
        setError('Tagging is completed successfully!');
        navigate('/AdvisorMemberSearchcx');
      } else {
        setError('Failed to submit tagging.');
      }
    } catch (error) {
      console.error('Error submitting tagging:', error);
      setError('Failed to submit tagging.');
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
      backgroundColor: 'rgba(15, 21, 53, 0.6)',   // Semi-transparent dark background
      backdropFilter: 'blur(10px)',                // Glassmorphism effect (blur behind)
      borderRadius: '12px',                        // Rounded corners
      paddingTop: '50px',
      color: 'white'                               // Default text color for readability
    }}>
      <Box style={{ flex: 1 }} className="p-4 rounded shadow">
     {/* Header Section */}
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
    {/* <IconButton onClick={toggleEditDetails} color="primary">
      {isEditingDetails ? <Save style={{ color: 'white' }} /> : <Edit style={{ color: 'white' }} />}
    </IconButton> */}
  </div>
</div>
    
        {/* Loading, Error, or Customer Details */}
        {loading ? (
          <CircularProgress color="inherit" sx={{ display: 'block', margin: '0 auto' }} />
        ) : error ? (
          <Alert severity="error" sx={{ color: 'white' }}>{error}</Alert>
        ) : customer ? (
          <Grid container spacing={2} style={yourStyle}>
            <Grid item xs={12} md={6}>
              {/* Only show field title if icon exists */}
              <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Task style={{ marginRight: '8px', color: 'white' }} /> {/* Icon in white */}
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
                  style: { color: 'white' }  // Ensuring text is white inside the input
                }}
                className="mb-2"
                sx={{
                  input: {
                    color: 'white',  // White text color inside text field
                  },
                  fieldset: {
                    borderColor: '#0F1535',borderRadius:'20px'  // Green border for the text field 
                  }
                }}
              />
              {/* Only show field title if icon exists */}
              <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Task style={{ marginRight: '8px', color: 'white' }} /> {/* Icon in white */}
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
                    color: 'white',  // White text color inside text field
                  },
                  fieldset: {
                    borderColor: '#0F1535',borderRadius:'20px'  // Green border for the text field
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Only show field title if icon exists */}
              <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                <Task style={{ marginRight: '8px', color: 'white' }} /> {/* Icon in white */}
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
                    color: 'white',  // White text color inside text field
                  },
                  fieldset: {
                    borderColor: '#0F1535',borderRadius:'20px'  // Green border for the text field
                  }
                }}
              />
              <div>
                {/* Only show field title if icon exists */}
                <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                  <Refresh style={{ marginRight: '8px', color: 'white' }} /> {/* Icon in white */}
                  Generate Password
                  <IconButton onClick={handleRefresh} size="small" style={{ marginLeft: '8px' }} disabled={loading}>
                    <Refresh style={{ color: 'white' }} /> {/* Icon in white */}
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
                      color: 'white',  // White text color inside text field
                    },
                    fieldset: {
                      borderColor: '#0F1535',borderRadius:'20px'  // Green border for the text field
                    }
                  }}
                />
              </div>
            </Grid>
          </Grid>
        ) : null}


     {/* Toggle Button Group */}
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
      value="remark"
      aria-label="remark"
      sx={{
        height: 50,
        borderRadius: '20px',
        border: '2px solid green',
        backgroundColor: activeComponent === 'remark' ? 'green' : '#0f1535',
        color: activeComponent === 'remark' ? 'white' : 'white',
        '&:hover': {
          backgroundColor: activeComponent !== 'remark' ? 'rgba(0, 255, 0, 0.2)' : 'green',
          color: 'black',  // Change text color to black on hover for inactive tabs
          borderColor: 'green',
        },
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <Comment style={{ color: activeComponent === 'remark' ? 'white' : 'green', marginRight: '8px' }} /> Tagging
    </ToggleButton>
    <ToggleButton
      value="OrderConfirmation"
      aria-label="old orders"
      sx={{
        height: 50,
        borderRadius: '20px',
        border: '2px solid green',
        backgroundColor: activeComponent === 'OrderConfirmation' ? 'green' : '#0f1535',
        color: activeComponent === 'OrderConfirmation' ? 'white' : 'white',
        '&:hover': {
          backgroundColor: activeComponent !== 'OrderConfirmation' ? 'rgba(0, 255, 0, 0.2)' : 'green',
          color: 'black',  // Change text color to black on hover for inactive tabs
          borderColor: 'green',
        },
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <History style={{ color: activeComponent === 'OrderConfirmation' ? 'white' : 'green', marginRight: '8px' }} /> Order Confirmation
    </ToggleButton>
    {/* <ToggleButton
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
          color: 'black',  // Change text color to black on hover for inactive tabs
          borderColor: 'green',
        },
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    >
      <LocationOn style={{ color: activeComponent === 'cxNearbyOrders' ? 'white' : 'green', marginRight: '8px' }} /> Cx Nearby Orders
    </ToggleButton> */}
    {/* <ToggleButton
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
          color: 'black',  // Change text color to black on hover for inactive tabs
          borderColor: 'green',
        },
        display: 'flex',
        alignItems: 'center',
        padding: '0 16px',
      }}
    > */}
      {/* <ShoppingCart style={{ color: activeComponent === 'placeOrder' ? 'white' : 'green', marginRight: '8px' }} /> Place Order
    </ToggleButton> */}
    {/* <ToggleButton
  value="ProductListAdvisory" // Ensure the value matches the component name for product list
  aria-label="ProductListAdvisory"
  onClick={() => setActiveComponent('ProductListAdvisory')} // Add onClick to set active component
  sx={{
    height: 50,
    borderRadius: '20px',
    border: '2px solid green',
    backgroundColor: activeComponent === 'ProductListAdvisory' ? 'green' : '#0f1535',
    color: activeComponent === 'ProductListAdvisory' ? 'white' : 'white',
    '&:hover': {
      backgroundColor: activeComponent !== 'ProductListAdvisory' ? 'rgba(0, 255, 0, 0.2)' : 'green',
      color: 'black',
      borderColor: 'green',
    },
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
  }}
>
  <ShoppingCart style={{ color: activeComponent === 'ProductListAdvisory' ? 'white' : 'green', marginRight: '8px' }} /> Search Product List
</ToggleButton> */}

<ToggleButton
  value="addAddress" // Ensure the value matches the component name for add address
  aria-label="addAddress"
  onClick={() => setActiveComponent('addAddress')} // Add onClick to set active component
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

{/* <ToggleButton
  value="addFarmingDetails"
  aria-label="farming details"
  onClick={() => setActiveComponent('addFarmingDetails')} // Add onClick to set active component
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
</ToggleButton> */}
  </ToggleButtonGroup>
</Box>

<div>
  <Box>
    {/* Render Active Component */}
    {loading ? (
      <CircularProgress color="inherit" sx={{ display: 'block', margin: '0 auto' }} />
    ) : error ? (
      <Alert severity="error">{error}</Alert>
    ) : (
      <div>
        {activeComponent === 'remark' && <Tagging />}
        {activeComponent === 'ProductListAdvisory' && <ProductListAdvisory />}
        {activeComponent === 'OrderConfirmation' && <OrderConfirmation />}
        {activeComponent === 'cxNearbyOrders' && <Cxnearbyorders customerId={customerId} />}
        {/* {activeComponent === 'placeOrder' && <PlaceOrder customerId={customerId} />} */}
      </div>
    )}
  </Box>

  {/* // Render section for Address */}
{activeComponent === 'addAddress' && (
  <GlassEffectBox>
    <AddressDetailsContainer>
      <Typography variant="h6" className="mb-2" style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem' }}>
        Address Details
        <div style={{ marginLeft: 'auto' }}>
          {/* <IconButton onClick={toggleEditAddress} color="primary">
            {isEditingAddress ? <Save style={{ color: 'green', fontSize: '1.5rem' }} /> : <Edit style={{ color: 'green', fontSize: '1.5rem' }} />}
          </IconButton> */}
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

    {/* Farming Details Section */}
 {activeComponent === 'addFarmingDetails' && (
        <GlassEffectBox>
          {/* Header with title and edit/save button */}
          <Typography
            variant="h6"
            className="mb-2"
            style={{
              display: 'flex',
              alignItems: 'center',
              fontFamily: 'Poppins, sans-serif',
              color: 'white',
            }}
          >
            Farming Details
            <div style={{ marginLeft: 'auto' }}>
              {/* <IconButton onClick={toggleEditFarming} color="primary">
                {isEditingFarming ? (
                  <Save style={{ color: 'green' }} />
                ) : (
                  <Edit style={{ color: 'green' }} />
                )}
              </IconButton> */}
            </div>
          </Typography>

          {/* Farming details form grid in 50-50 layout */}
          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={6}>
              {/* Source of Irrigation */}
              <Typography variant="subtitle1" style={{ color: 'white' }}>
                Source of Irrigation
              </Typography>
              <Select
                fullWidth
                multiple
                value={farmingDetails.sourceOfIrrigation}
                onChange={(e) => {
                  const { target: { value } } = e;
                  const newValue = typeof value === 'string' ? value.split(',') : value;
                  setFarmingDetails((prev) => ({
                    ...prev,
                    sourceOfIrrigation: newValue,
                  }));
                }}
                input={<OutlinedInput style={{ color: 'white' }} />}
                renderValue={(selected) => (
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {selected.map((val) => (
                      <Chip
                        key={val}
                        label={val}
                        style={{
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        }}
                      />
                    ))}
                  </Box>
                )}
                disabled={!isEditableFarming}
                style={{ color: 'white' }}
              >
                {sourceOfIrrigationOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    style={{
                      color: 'white',
                      backgroundColor: '#0F1535',
                    }}
                  >
                    {farmingDetails.sourceOfIrrigation.includes(option) ? (
                      <strong style={{ color: 'white' }}>{option}</strong>
                    ) : (
                      <span style={{ color: 'white' }}>{option}</span>
                    )}
                  </MenuItem>
                ))}
              </Select>

              {/* Land Acquisition */}
              <Typography variant="subtitle1" style={{ color: 'white', marginTop: '16px' }}>
                Land Acquisition
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                name="landAcquisition"
                value={farmingDetails.landAcquisition}
                onChange={handleChangeFarming}
                InputProps={{
                  readOnly: !isEditableFarming,
                  style: { color: 'white' },
                }}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  marginTop: '8px',
                }}
              />

              {/* Kisaanstar Info */}
              <Typography variant="subtitle1" style={{ color: 'white', marginTop: '16px' }}>
                Kisaanstar Info
              </Typography>
              <Select
                fullWidth
                value={farmingDetails.kisaanstarInfo || ''}
                onChange={(e) => {
                  const { value } = e.target;
                  setFarmingDetails((prev) => ({
                    ...prev,
                    kisaanstarInfo: value,
                  }));
                }}
                input={<OutlinedInput style={{ color: 'white' }} />}
                displayEmpty
                disabled={!isEditableFarming}
                style={{ marginTop: '8px', color: 'white' }}
                renderValue={(selected) => (
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '5px',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                    }}
                  >
                    {selected}
                  </span>
                )}
                MenuProps={{
                  PaperProps: { style: { maxHeight: 200, backgroundColor: 'white' } },
                  MenuListProps: { style: { padding: 0 } },
                }}
              >
                {kisaanstarInfoOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      fontWeight: farmingDetails.kisaanstarInfo === option ? 'bold' : 'normal',
                    }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} md={6}>
              {/* Crop */}
              <Typography variant="subtitle1" style={{ color: 'white' }}>
                Crop
              </Typography>
              <Select
                fullWidth
                multiple
                value={farmingDetails.crop}
                onChange={(e) => {
                  const { target: { value } } = e;
                  const newValue = typeof value === 'string' ? value.split(',') : value;
                  setFarmingDetails((prev) => ({
                    ...prev,
                    crop: newValue,
                  }));
                }}
                input={<OutlinedInput style={{ color: 'white' }} />}
                renderValue={(selected) => (
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {selected.map((val) => (
                      <Chip
                        key={val}
                        label={val}
                        style={{
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        }}
                      />
                    ))}
                  </Box>
                )}
                disabled={!isEditableFarming}
                style={{ marginTop: '8px', color: 'white' }}
              >
                {cropOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    style={{
                      color: 'white', backgroundColor: '#0F1535'
                    }}
                  >
                    {farmingDetails.crop.includes(option) ? (
                      <strong style={{ color: 'white' }}>{option}</strong>
                    ) : (
                      <span style={{ color: 'white' }}>{option}</span>
                    )}
                  </MenuItem>
                ))}
              </Select>

              {/* Animal Husbandry */}
              <Typography variant="subtitle1" style={{ color: 'white', marginTop: '16px' }}>
                Animal Husbandry
              </Typography>
              <Select
                fullWidth
                multiple
                value={farmingDetails.animalHusbandry}
                onChange={(e) => {
                  const { target: { value } } = e;
                  const newValue = typeof value === 'string' ? value.split(',') : value;
                  setFarmingDetails((prev) => ({
                    ...prev,
                    animalHusbandry: newValue,
                  }));
                }}
                input={<OutlinedInput style={{ color: 'white' }} />}
                renderValue={(selected) => (
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {selected.map((val) => (
                      <Chip
                        key={val}
                        label={val}
                        style={{
                          color: 'white',
                          backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        }}
                      />
                    ))}
                  </Box>
                )}
                disabled={!isEditableFarming}
                style={{ marginTop: '8px', color: 'white' }}
              >
                {animalHusbandryOptions.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    style={{
                      color: 'white', backgroundColor: '#0F1535'
                    }}
                  >
                    {farmingDetails.animalHusbandry.includes(option) ? (
                      <strong style={{ color: 'white' }}>{option}</strong>
                    ) : (
                      <span style={{ color: 'white' }}>{option}</span>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>

          {/* Show save/update button only when in edit mode */}
          {isEditableFarming && (
            <StyledButton
              variant="contained"
              onClick={() => {
                toggleEditFarming();
              }}
              style={{ color: 'white' }}
            >
              {Object.values(farmingDetails).some((field) => field) ? 'Update Farming Details' : 'Save Farming Details'}
            </StyledButton>
          )}
        </GlassEffectBox>
      )}

{/* Services Selection Dialog */}
<Dialog
  open={openServiceDialog}
  onClose={() => setOpenServiceDialog(false)}
  fullWidth
  maxWidth="md"
  PaperProps={{
    style: {
      width: '80%',
      height: '50%', // Increased height for larger size
      maxWidth: 'none',
      borderRadius: 20,
      boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
      backgroundColor: '#1e1e2f',
    }
  }}
>
  <DialogTitle
    sx={{
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#4CAF50',
      color: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 2,
    }}
  >
    <NearMe sx={{ fontSize: 30, marginRight: 10 }} />
    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
      Operation Member Attempts
    </Typography>
  </DialogTitle>
  <Box sx={{ padding: 4, height: 'calc(100% - 80px)', overflowY: 'auto' }}>
    <Grid container spacing={3}>
      {/* Service 1 */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" sx={{ mb: 1, color: 'white' }}> Select Attempt</Typography>
        <Select
          fullWidth
          value={selectedServices.service1}
          onChange={(e) => setSelectedServices(prev => ({ ...prev, service1: e.target.value }))}
          displayEmpty
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: 18,
              borderRadius: 10,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <MenuItem value="">
            <em style={{ fontSize: 16, color: '#999' }}>Select Attempt</em>
          </MenuItem>
          {services.map((service, index) => service.service1 && (
            <MenuItem key={index} value={service.service1} style={{ fontSize: 16 }}>
              {service.service1}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      {/* Service 2 */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" sx={{ mb: 1, color: 'white' }}> Select Reason</Typography>
        <Select
          fullWidth
          value={selectedServices.service2}
          onChange={(e) => setSelectedServices(prev => ({ ...prev, service2: e.target.value }))}
          displayEmpty
          input={<OutlinedInput />}
          sx={{
            '& .MuiOutlinedInput-root': {
              fontSize: 18,
              borderRadius: 10,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'white',
            },
            backgroundColor: 'white',
            color: 'black',
          }}
        >
          <MenuItem value="">
            <em style={{ fontSize: 16, color: '#999' }}>Select Reason</em>
          </MenuItem>
          {services.map((service, index) => service.service2 && (
            <MenuItem key={index} value={service.service2} style={{ fontSize: 16 }}>
              {service.service2}
            </MenuItem>
          ))}
        </Select>
      </Grid>
      
      {/* Service 3 Description - Make it big and prominent */}
      <Grid item xs={12} md={12}> {/* Full width for better size */}
        <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>Description</Typography>
        <TextField
          fullWidth
          placeholder="Describe your Reason here"
          variant="outlined"
          value={selectedServices.service3}
          onChange={(e) => setSelectedServices(prev => ({ ...prev, service3: e.target.value }))}
          multiline
          rows={6} // Make it larger vertically
          sx={{
            input: { fontSize: 16, color: 'white' },
            backgroundColor: 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              height: '100%', // Ensures full height if needed
            },
          }}
        />
      </Grid>
    </Grid>
  </Box>
  <DialogActions sx={{ padding: 2, backgroundColor: '#1e1e2f', borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
    <Button onClick={() => setOpenServiceDialog(false)} color="error" variant="contained" sx={{ fontSize: 16, paddingX: 2, borderRadius: 2 }}>
      Cancel
    </Button>
    <Button onClick={handleSubmitTagging} color="primary" variant="contained" sx={{ fontSize: 16, paddingX: 2, borderRadius: 2 }}>
      Submit Attempts
    </Button>
  </DialogActions>
</Dialog>



      </Box>
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
  backdropFilter: 'blur(10px)', // Glass effect
  backgroundColor: 'rgba(15, 21, 53, 0.4)', // Semi-transparent background with the provided color
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
    fontSize: '1.2rem', // Increased font size for text input
  },
  '& .MuiInputLabel-root': {
    color: 'white',
    fontSize: '1.1rem', // Increased font size for label
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: 'white',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#4CAF50', // Green button color
  color: 'white',
  fontSize: '1.1rem', // Increased font size for button text
  '&:hover': {
    backgroundColor: '#45a049', // Slightly darker green on hover
  },
}));

export default OperationMemberseenewcxdetails;