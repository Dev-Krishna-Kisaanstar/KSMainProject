import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TableHead,
    Paper,
    Box,
    Typography,
    AppBar,
    Tabs,
    Tab,
    Button,
    Snackbar,
    Alert,
} from "@mui/material";
import Sidebar from "../../../Sidebars/Advisor/AdvisorAdmin/AdvisorAdminSidebar";
import axios from 'axios';
import { styled } from "@mui/material/styles";
import Calendar from '../../../Components/Calender/CalenderAA';
import { Dashboard as DashboardIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";

// Styled components for Table
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.common.white,
    color: theme.palette.text.primary,
    fontWeight: "bold",
    textAlign: 'center',
    border: 'none', // Remove borders
    padding: '16px 8px', // Adds padding for spacing
}));

const BlueTableCell = styled(TableCell)(({ theme }) => ({
    backgroundColor: '#1976d2',
    color: '#FFFFFF',
    fontWeight: "bold",
    textAlign: 'center',
    border: 'none', // Remove borders
    padding: '16px 8px', // Adds padding for spacing
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
}));

const columns = [
    { id: 'orderId', label: 'Order #', minWidth: 70 },
    { id: 'orderDate', label: 'Date', minWidth: 90, format: (value) => new Date(value).toLocaleDateString() },
    { id: 'advisorName', label: 'Advisor', minWidth: 100 },
    { id: 'customerName', label: 'Customer', minWidth: 100 },
    { id: 'customerMobile', label: 'Mobile', minWidth: 80 },
    { id: 'alternateMobile', label: 'Alt. Number', minWidth: 100 },
    { id: 'products', label: 'Products', minWidth: 150 },
    { id: 'village', label: 'Village', minWidth: 80 },
    { id: 'taluka', label: 'Taluka', minWidth: 80 },
    { id: 'district', label: 'District', minWidth: 80 },
    { id: 'pincode', label: 'Pincode', minWidth: 80 },
    { id: 'totalAmount', label: 'Total', minWidth: 80, format: (value) => `₹${value.toFixed(2)}` },
    { id: 'status', label: 'Status', minWidth: 80 },
];

function AdvisorAdminAdvisoryOrders() {
    const [orders, setOrders] = useState([]);
    const [advisors, setAdvisors] = useState([]);
    const [activeMainTab, setActiveMainTab] = useState(0);
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [selectedEndDate, setSelectedEndDate] = useState("");
    
    // Snackbar State
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('info');

    const navigate = useNavigate(); // Initialize the useNavigate hook
    
    // Set initial dates to today's date
    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        fetchAdvisors(); // Fetch advisors only on mount
        // Fetch today's orders by default
        fetchOrders(today, today);
    }, []); 

    const fetchAdvisors = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-member/all-advisory-members`, { withCredentials: true });
            if (response.data && Array.isArray(response.data.advisoryMembers)) {
                setAdvisors(response.data.advisoryMembers);
            } else {
                showSnackbar("No advisors found.", 'warning');
            }
        } catch (error) {
            console.error("Error fetching advisors:", error);
            showSnackbar("Failed to fetch advisors.", 'error');
        }
    };

    const fetchOrders = async (startDate, endDate) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory-admin/placed-orders?startDate=${startDate}&endDate=${endDate}`, { withCredentials: true });

            if (response.data && Array.isArray(response.data.orders)) {
                const sortedOrders = response.data.orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
                setOrders(sortedOrders);
            } else {
                showSnackbar("No orders found.", 'warning');
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            showSnackbar("Failed to fetch orders.", 'error');
        }
    };

    const handleDateSelection = (startDate, endDate) => {
        setSelectedStartDate(startDate);
        setSelectedEndDate(endDate);
        fetchOrders(startDate, endDate); // Fetch orders when both dates are selected
    };

    const handleMainTabChange = (event, newValue) => {
        setActiveMainTab(newValue);
    };

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = () => {
        setSnackbarOpen(false);
    };

    const viewdetails = (id) => {
        navigate(`/Ordersbyadvisortoadmin/${id}`); // Correctly navigate to the details page with the ID
    };

    const renderOrdersByAdvisor = () => (
        <TableContainer component={Paper} style={{ backgroundColor: '#1E1E2F', backdropFilter: 'blur(5px)', borderRadius: 16, overflow: 'hidden' }}>
            <Table>
                <TableHead style={{ backgroundColor: '#3f51b5' }}>
                    <TableRow>
                        <TableCell style={{ color: "#fff", fontWeight: 'bold', textAlign: 'center' }}>Employment ID</TableCell>
                        <TableCell style={{ color: "#fff", fontWeight: 'bold', textAlign: 'center' }}>Name</TableCell>
                        <TableCell style={{ color: "#fff", fontWeight: 'bold', textAlign: 'center' }}>Email</TableCell>
                        <TableCell style={{ color: "#fff", fontWeight: 'bold', textAlign: 'center' }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {advisors.map((advisor) => (
                        <TableRow key={advisor._id} hover>
                            <TableCell style={{ color: '#fff', textAlign: 'center' }}>{advisor.employmentId}</TableCell>
                            <TableCell style={{ color: '#fff', textAlign: 'center' }}>{advisor.fullName}</TableCell>
                            <TableCell style={{ color: '#fff', textAlign: 'center' }}>{advisor.officialEmail}</TableCell>
                            <TableCell style={{ color: '#fff', textAlign: 'center' }}>
                                <Button
                                    variant="contained"
                                    style={{ backgroundColor: '#FFA500', color: '#fff' }}
                                    onClick={() => viewdetails(advisor._id)} // Call viewdetails with advisor ID
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

    const renderOrdersTable = () => (
        <TableContainer component={Paper} sx={{ borderRadius: '15px', marginTop: '20px' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <BlueTableCell key={column.id}>{column.label}</BlueTableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.length > 0 ? (
                        orders.map((row) => (
                            <StyledTableRow hover key={row.orderId}>
                                {columns.map((column) => (
                                    <StyledTableCell key={column.id}>
                                        {column.id === "products" ? (
                                            row.products && Array.isArray(row.products) ? (
                                                <div>
                                                    {row.products.map((item, index) => (
                                                        <Typography key={index}>- {item.productName} (Qty: {item.quantity})</Typography>
                                                    ))}
                                                </div>
                                            ) : 'N/A'
                                        ) : (
                                            row[column.id] || 'N/A'
                                        )}
                                    </StyledTableCell>
                                ))}
                            </StyledTableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ color: '#FFFFFF' }}>
                                No orders available for the selected date range.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <div style={pageStyle}>
            <Sidebar />
            <div style={contentStyle}>
                <Calendar onDateSelect={handleDateSelection} />

                <AppBar position="static" style={{ backgroundColor: '#FFA500', borderRadius: '0 0 10px 10px' }}>
                    <Tabs value={activeMainTab} onChange={handleMainTabChange} variant="fullWidth">
                        <Tab
                            label={`Orders by Advisor (${advisors.length})`}
                            icon={<DashboardIcon />}
                            style={{ color: activeMainTab === 0 ? '#fff' : '#000', fontWeight: 'bold' }}
                        />
                        <Tab
                            label={`All Orders (${orders.length})`}
                            icon={<VisibilityIcon />}
                            style={{ color: activeMainTab === 1 ? '#fff' : '#000', fontWeight: 'bold' }}
                        />
                    </Tabs>
                </AppBar>

                <Box p={3} style={{ backgroundColor: '#f0f0f0', borderRadius: '16px' }}>
                    {activeMainTab === 0 ? renderOrdersByAdvisor() : renderOrdersTable()}
                </Box>
            </div>

            {/* Snackbar for Notifications */}
            <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
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

export default AdvisorAdminAdvisoryOrders;