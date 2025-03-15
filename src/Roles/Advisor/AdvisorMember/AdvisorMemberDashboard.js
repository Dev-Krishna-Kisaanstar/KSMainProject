import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import Sidebar from '../../../Sidebars/Advisor/AdvisorMember/AdvisorMemberSidebar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import profileIcon from '../../../Assets/Logo/profileicon.webp'; // Replace with your profile icon path
import progressImage from '../../../Assets/Background/dashboardimg.webp'; // Replace with your image path
import TaggingAuth from './Auth/TaggingAuth';

const AdvisoryMemberDashboard = () => {
  TaggingAuth();
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  // Placeholder data for charts
  const pieData = [
    { name: 'Desktop', value: 35 },
    { name: 'Tablet', value: 48 },
    { name: 'Mobile', value: 27 },
  ];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const barData = [
    { name: 'Jan', sales: 30 },
    { name: 'Feb', sales: 45 },
    { name: 'Mar', sales: 50 },
    { name: 'Apr', sales: 60 },
    { name: 'May', sales: 40 },
    { name: 'Jun', sales: 55 },
    { name: 'Jul', sales: 65 },
    { name: 'Aug', sales: 70 },
  ];

 // Fetch member dashboard data
const fetchDashboard = async () => {
  try {
      const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/advisory-member/dashboard`,
          {
              withCredentials: true, // Include cookies from the server
          }
      );
      const { advisoryMember } = response.data;
      setMember(advisoryMember);

      // Using fullName as the username
      const username = advisoryMember.fullName;
      console.log('Fetched username:', username); // Debug log

      // Assuming you have a way to get customerId or create it based on advisoryMember data
      const customerId = 'your_customer_id_here'; // Replace with actual logic

      // Call the new function to send the username
      sendUsernameToComponent(customerId, username);
      
  } catch (error) {
      if (error.response?.status === 401) {
          setError('Session expired. Please log in again.');
          navigate('/Advisormemberlogin');
      } else if (error.response?.status === 404) {
          setError('Advisory Member not found.');
      } else {
          setError('Failed to load dashboard. Please try again later.');
      }
  } finally {
      setLoading(false);
  }
};

// New function to send the username to the component
const sendUsernameToComponent = (customerId, username) => {
  axios.post(`${process.env.REACT_APP_API_URL}/api/advisory-member/send-username`, {
      customerId: customerId,
      username: username
  }, { withCredentials: true })
  .then((response) => {
      console.log('Username sent successfully:', response.data);
  })
  .catch((error) => {
      console.error('Failed to send username:', error);
  });
};

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Format date function
  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : 'N/A';
  };

  return (
    <div style={pageStyle}>
      <Sidebar />
      <div style={contentContainerStyle}>
        {/* Bento Grid Layout Section */}
        <div style={bentoGridStyle}>
          <img src={profileIcon} alt="Profile" style={profileIconStyle} />
          <div style={welcomeTextStyle}>
            <Typography variant="h6">Welcome back!</Typography>
            <Typography variant="h6">{member?.fullName || 'User'}</Typography>

            {/* Added Today's Sales Section */}
            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Today's Sales Section */}
              <div>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Today's Sales</Typography>
                <Typography variant="h4" style={{ fontWeight: 'bold', color: 'green' }}>$65.4K</Typography>
                <div style={progressBarContainer}>
                  <div style={progressBar}>
                    <div style={fillStyle}></div>
                  </div>
                  <Typography variant="body1" style={{ marginLeft: '10px' }}>80%</Typography>
                </div>
              </div>

              {/* Growth Rate Section */}
              <div>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>Growth Rate</Typography>
                <Typography variant="h4" style={{ fontWeight: 'bold', color: 'yellow' }}>78.4%</Typography>
                <div style={progressBarContainer}>
                  <div style={{ ...progressBar, backgroundColor: '#ffe0b3' }}>
                    <div style={{ ...fillStyle, backgroundColor: 'yellow', width: '78%' }}></div>
                  </div>
                  <Typography variant="body1" style={{ marginLeft: '10px' }}>78%</Typography>
                </div>
              </div>
            </div>

          </div>
          {/* New Image Container */}
        <div style={imageContainerStyle}>
          <img src={progressImage} alt="More Info" style={imageStyle1} />
        </div>
        </div>

        <Container>
          {loading ? (
            <div style={loadingStyle}>
              <CircularProgress />
            </div>
          ) : error ? (
            <Typography color="error" variant="h6" align="center">
              {error}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {/* Other Member Info */}
              <Grid item xs={12} md={6}>
                <Card style={cardStyle}>
                  <CardContent>
                    <Typography variant="h6">Date of Birth</Typography>
                    <Typography variant="body1">{formatDate(member.DOB)}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card style={cardStyle}>
                  <CardContent>
                    <Typography variant="h6">Registration Date</Typography>
                    <Typography variant="body1">{formatDate(member.registrationDate)}</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Existing layout code */}
              <Grid item xs={12} md={4}>
                <Card style={cardStyle}>
                  <CardContent>
                    <Typography variant="h6">Email</Typography>
                    <Typography variant="body1">{member.email || 'N/A'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card style={cardStyle}>
                  <CardContent>
                    <Typography variant="h6">Employment ID</Typography>
                    <Typography variant="body1">{member.employmentId || 'N/A'}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card style={cardStyle}>
                  <CardContent>
                    <Typography variant="h6">Growth Rate</Typography>
                    <Typography variant="h4">78.4%</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {/* Charts Section */}
              <Grid item xs={12} md={6}>
                <Card style={cardStyle}>
                  <CardContent>
                    <Typography variant="h6">Monthly Sales</Typography>
                    <BarChart width={500} height={300} data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card style={cardStyle}>
                  <CardContent>
                    <Typography variant="h6">Device Type</Typography>
                    <PieChart width={500} height={300}>
                      <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Container>
      </div>
    </div>
  );
};

// Styles
const pageStyle = {
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100vh',
  backgroundColor: '#1e1e2f',
  color: '#fff',
};

const contentContainerStyle = {
  flexGrow: 1,
  padding: '20px',
  paddingTop: '80px',
};

const bentoGridStyle = {
  display: 'flex',
  // alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '20px',
  border: '1px solid #2a2a3c',
  backgroundColor: '#2c2c3e',
  padding: '20px',
  borderRadius: '8px',
};

const profileIconStyle = {
  width: '60px',
  height: '60px',
  borderRadius: '50%',
};

const welcomeTextStyle = {
  flexGrow: 1,
  marginLeft: '15px',
};

const progressBarContainer = {
  display: 'flex',
  alignItems: 'center',
  marginTop: '5px', // Reduced space above the progress bar
  width:'200px'
};

const progressBar = {
  backgroundColor: '#ddd',
  borderRadius: '12px',
  height: '8px', // Reduced height for a more compact appearance
  width: '10%', // Adjusted width
};

const fillStyle = {
  backgroundColor: 'green',
  borderRadius: '12px',
  height: '100%',
  width: '80%', // This can be adjusted as needed
};

const imageStyle = {
  width: '100px', // Adjust width as per your requirement
  height: '100px', // Adjust height as per your requirement
  borderRadius: '8px',
};

const cardStyle = {
  backgroundColor: '#2c2c3e',
  color: '#fff',
  margin: '10px 0',
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
};

const imageContainerStyle = {
  width: '300px', // Fixed width of the image container
  height: '100%', // Full height to match the section
  display: 'flex',
  alignItems: 'center', // Center the image vertically
  justifyContent: 'center', // Center the image horizontally if needed. Adjust based on your layout
};

const imageStyle1 = {
  width: '100%', // Make the image fill the container width
  height: 'auto', // Maintain the aspect ratio
  maxHeight: '100%', // Ensure it does not overflow the container
};

export default AdvisoryMemberDashboard;