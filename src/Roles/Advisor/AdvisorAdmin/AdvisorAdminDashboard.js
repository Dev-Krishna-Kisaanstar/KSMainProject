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
import Sidebar from '../../../Sidebars/Advisor/AdvisorAdmin/AdvisorAdminSidebar';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import profileIcon from '../../../Assets/Logo/profileicon.webp'; // Replace with your profile icon path
import progressImage from '../../../Assets/Background/dashboardimg.webp'; // Replace with your image path

const AdvisorAdminDashboard = () => {
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
        `${process.env.REACT_APP_API_URL}/api/advisory-admin/dashboard`,
        {
          withCredentials: true, // Include cookies from the server
        }
      );
      setMember(response.data.advisoryAdmin);
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        navigate('/AdvisorAdminLogin');
      } else if (error.response?.status === 404) {
        setError('Advisory Admin not found.');
      } else {
        setError('Failed to load dashboard. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
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
      <Sidebar/>
      <div style={contentContainerStyle}>
        <div style={bentoGridStyle}>
          <img src={profileIcon} alt="Profile" style={profileIconStyle} />
          <div style={welcomeTextStyle}>
            <Typography variant="h6">Welcome back!</Typography>
            <Typography variant="h6">{member?.fullName || 'User'}</Typography>

            <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', gap: '20px' }}>
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
              {member ? (
                <>
                  <Grid item xs={12} md={6}>
                    <Card style={cardStyle}>
                      <CardContent>
                        <Typography variant="h6">Date of Birth</Typography>
                        <Typography variant="body1">{formatDate(member.dob)}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card style={cardStyle}>
                      <CardContent>
                        <Typography variant="h6">Official Email</Typography>
                        <Typography variant="body1">{member.officialEmail || 'N/A'}</Typography>
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
                </>
              ) : (
                <Typography color="error" variant="h6" align="center">
                  Member data not available
                </Typography>
              )}
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
  flex:1
};

const contentContainerStyle = {
  flexGrow: 1,
  overflowY: 'auto', // Allows scrolling for content overflow
  padding: '20px',
  paddingTop: '50px',
  flex:1
};

const bentoGridStyle = {
  display: 'flex',
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
  marginTop: '5px',
  width: '200px',
};

const progressBar = {
  backgroundColor: '#ddd',
  borderRadius: '12px',
  height: '8px',
  width: '10%',
};

const fillStyle = {
  backgroundColor: 'green',
  borderRadius: '12px',
  height: '100%',
  width: '80%',
};

const imageStyle = {
  width: '100px',
  height: '100px',
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
  width: '300px',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const imageStyle1 = {
  width: '100%',
  height: 'auto',
  maxHeight: '100%',
};

export default AdvisorAdminDashboard;