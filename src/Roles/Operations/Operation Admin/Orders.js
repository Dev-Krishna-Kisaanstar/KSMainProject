import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Sidebars/Operation/OperationAdmin/OperationAdminSidebar';
import Calendar from '../../../Components/Calender/CalenderOA';
import axios from 'axios';
import { AppBar, Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const buttonStyle = {
  backgroundColor: '#3f51b5',
  color: '#fff',
};

const tableCellStyle = {
  color: 'white',
};

const tableHeaderCellStyle = {
  backgroundColor: '#3f51b5',
  fontWeight: 'bold',
  color: 'white',
};

function OppOrders() {
  const today = new Date();
  const formattedToday = today.toISOString().split('T')[0];
  const [activeMainTab, setActiveMainTab] = useState(0); // Main tabs: Orders by Advisor, All Orders
  const [activeSubTab, setActiveSubTab] = useState(0); // Sub tabs under All Orders
  const [startDate, setStartDate] = useState(formattedToday);
  const [endDate, setEndDate] = useState(formattedToday);
  const [orders, setOrders] = useState([]); // Holds orders data
  const [advisors, setAdvisors] = useState([]); // Holds advisor data
  const [ordersCount, setOrdersCount] = useState(0);
  const navigate = useNavigate();

  // Fetch advisors and orders count on component mount
  useEffect(() => {
    const fetchAdvisors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-admin/operational-members`, { withCredentials: true });
        // Adjusting the key here based on the new data shape
        setAdvisors(response.data.operationalMembers);
      } catch (error) {
        console.error("Error fetching advisors: ", error);
        toast.error('Failed to fetch advisors');
      }
    };

    const fetchOrdersCount = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-member/total-orders-count`, { withCredentials: true });
        setOrdersCount(response.data.count);
      } catch (error) {
        console.error("Error fetching orders count: ", error);
        toast.error('Failed to fetch orders count');
      }
    };

    fetchAdvisors();
    fetchOrdersCount();
  }, []);

  const viewdetails = (id) => {
    navigate(`/AdvosorOrders/${id}`); // Navigate to the details page with the ID
  };

  // Fetch orders based on the current main tab
  const fetchOrders = async (status) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/operational-admin/track-orders?orderStatus=${encodeURIComponent(status)}&startDate=${startDate}&endDate=${endDate}`,
        null,
        { withCredentials: true }
      );
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Failed to fetch orders.");
      toast.error('Failed to fetch orders');
    }
  };

  // Effect to fetch data on main tab change or date range change
  useEffect(() => {
    if (activeMainTab === 0) {
      fetchOrders('Order Placed'); // Default for Orders by Advisor
    }
  }, [activeMainTab, startDate, endDate]);

  // Effect to fetch orders based on the selected sub-tab
  useEffect(() => {
    if (activeMainTab === 1) {
      switch (activeSubTab) {
        case 0:
          fetchOrders('Order Placed');
          break;
        case 1:
          fetchOrders('Confirmed Order');
          break;
        case 2:
          fetchOrders('Canceled Order');
          break;
        default:
          break;
      }
    }
  }, [activeMainTab, activeSubTab, startDate, endDate]);

  // Tab change handlers
  const handleMainTabChange = (event, newValue) => {
    setActiveMainTab(newValue);
    setActiveSubTab(0); // Reset sub-tab when main tab changes
  };

  const handleSubTabChange = (event, newValue) => {
    setActiveSubTab(newValue);
  };

  // Render Orders By Advisor Table
  const renderOrdersByAdvisor = () => (
    <TableContainer component={Paper} style={{ backgroundColor: '#1E1E2F', backdropFilter: 'blur(5px)', borderRadius: 16, overflow: 'hidden' }}>
      <Table>
        <TableHead style={{ backgroundColor: '#3f51b5' }}>
          <TableRow>
            <TableCell style={tableHeaderCellStyle}>Employment ID</TableCell>
            <TableCell style={tableHeaderCellStyle}>Name</TableCell>
            <TableCell style={tableHeaderCellStyle}>Email</TableCell>
            <TableCell style={tableHeaderCellStyle}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {advisors.map((advisor) => (
            <TableRow key={advisor._id} hover>
              <TableCell style={tableCellStyle}>{advisor.employmentId}</TableCell>
              <TableCell style={tableCellStyle}>{advisor.fullName}</TableCell>
              <TableCell style={tableCellStyle}>{advisor.officialEmail}</TableCell>
              <TableCell style={tableCellStyle}>
                <Button 
                    variant="contained" 
                    style={buttonStyle} 
                    onClick={() => {
                        console.log("Navigating to AdvisorIDOrders with ID:", advisor._id); // Log the ID
                        viewdetails(advisor._id);
                    }}
                >
                    <VisibilityIcon style={{ marginRight: 4 }} /> View Orders
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Render Orders Table
  const renderOrdersTable = () => {
    if (orders.length === 0) {
      return <p style={{ color: 'white' }}>No orders available for this date range.</p>; // Message when no orders are found
    }

    return (
      <TableContainer component={Paper} style={{ backgroundColor: '#1E1E2F', backdropFilter: 'blur(5px)', borderRadius: 16, overflow: 'hidden' }}>
        <Table>
          <TableHead style={{ backgroundColor: '#3f51b5' }}>
            <TableRow>
              {[
                "Order ID", 
                "Order Date", 
                "Advisor Name", 
                "Customer Name", 
                "Mobile", 
                "Alternate Mobile", 
                "Village", 
                "Taluka", 
                "District", 
                "Pincode", 
                "Nearby Location", 
                "Post Office", 
                "Product Name", 
                "Quantity", 
                "Total Amount", 
                "Status"
              ].map(header => (
                <TableCell style={tableHeaderCellStyle} key={header}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map(order => (
              <React.Fragment key={order.orderId}>
                {order.products.map((product, index) => (
                  <TableRow key={index}>
                    {index === 0 ? (
                      <>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.orderId}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.advisorName}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.customerName}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.customerMobile}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.alternateMobile}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.village}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.taluka}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.district}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.pincode}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.nearbyLocation}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.postOffice}</TableCell>
                      </>
                    ) : null}
                    <TableCell style={tableCellStyle}>{product.productName}</TableCell>
                    <TableCell style={tableCellStyle}>{product.quantity}</TableCell>
                    {index === 0 ? (
                      <>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.finalAmount}</TableCell>
                        <TableCell style={tableCellStyle} rowSpan={order.products.length}>{order.status}</TableCell>
                      </>
                    ) : null}
                  </TableRow>
                ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div style={pageStyle}>
      <Sidebar />
      <div style={contentStyle}>
        <Calendar onDateSelect={(start, end) => { setStartDate(start); setEndDate(end); }} />
        
        <AppBar position="static" style={{ backgroundColor: '#FFA500', borderRadius: '0 0 10px 10px' }}>
          <Tabs value={activeMainTab} onChange={handleMainTabChange} variant="fullWidth">
            <Tab 
              label={`Orders by Operation (${advisors.length})`} 
              icon={<DashboardIcon />} 
              style={{ color: activeMainTab === 0 ? '#fff' : '#000' }} 
            />
            <Tab 
              label={`All Orders (${ordersCount})`} 
              icon={<VisibilityIcon />} 
              style={{ color: activeMainTab === 1 ? '#fff' : '#000' }} 
            />
          </Tabs>
        </AppBar>
        
        {/* Conditional rendering for sub-tabs within the All Orders section */}
        {activeMainTab === 1 && (
          <>
            <AppBar position="static" style={{ backgroundColor: '#FFA500', marginBottom: '10px' }}>
              <Tabs value={activeSubTab} onChange={handleSubTabChange} variant="fullWidth">
                <Tab label="Placed Orders" icon={<AddShoppingCartIcon />} />
                <Tab label="Confirmed Orders" icon={<CheckCircleIcon />} />
                <Tab label="Canceled Orders" icon={<CancelIcon />} />
              </Tabs>
            </AppBar>
          </>
        )}

        {/* Render Orders By Advisor or Orders Table based on tab selection */}
        <Box p={3}>
          {activeMainTab === 0 ? renderOrdersByAdvisor() : renderOrdersTable()}
        </Box>
      </div>
      <ToastContainer />
    </div>
  );
}

// Styles
const pageStyle = {
  display: 'flex',
  minHeight: '100vh',
  backgroundColor: '#1E1E2F',
  color: '#fff',
  padding: '20px',
  marginTop: '50px',
};

const contentStyle = {
  flex: 1,
  marginLeft: '20px',
};

export default OppOrders;