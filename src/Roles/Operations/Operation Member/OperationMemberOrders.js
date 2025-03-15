import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import DashboardIcon from '@mui/icons-material/Dashboard'; 
import Sidebar from '../../../Sidebars/Operation/OperationMember/OperationMemberSidebar';
import axios from 'axios';
import Calendar from '../../../Components/Calender/CalenderOM';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastContainer, toast } from 'react-toastify';

function OperationMemberOrders() {
    const [activeTab, setActiveTab] = useState(0);
    const [advisors, setAdvisors] = useState([]);
    const [ordersCount, setOrdersCount] = useState(0);
    const [orders, setOrders] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [ordersFetched, setOrdersFetched] = useState(false);
    const [updatedOrders, setUpdatedOrders] = useState(new Set());

    const statusOptions = [
        'Order Placed',
        'Order Confirmed',
        'Order Cancelled',
        'Ready to Ship',
        'Delivered',
        'Return',
    ];

    useEffect(() => {
        const fetchAdvisors = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-member/all-advisory-members`, { withCredentials: true });
                setAdvisors(response.data.advisoryMembers);
            } catch (error) {
                console.error("Error fetching advisors: ", error);
            }
        };

        const fetchOrdersCount = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/operational-member/total-orders-count`, { withCredentials: true });
                setOrdersCount(response.data.count);
            } catch (error) {
                console.error("Error fetching orders count: ", error);
            }
        };

        fetchAdvisors();
        fetchOrdersCount();
    }, []);

    const fetchAllOrders = async (startDate = '', endDate = '') => {
        try {
            const url = `${process.env.REACT_APP_API_URL}/api/advisory-admin/placed-orders?startDate=${startDate}&endDate=${endDate}`;
            const response = await axios.get(url, { withCredentials: true });
            setOrders(response.data.orders || []);
            setOrdersFetched(true);
        } catch (error) {
            console.error("Error fetching orders: ", error);
        }
    };

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/operational-member/update-orderStatus`, {
                orderId, 
                status: newStatus
            }, { withCredentials: true });

            if (response.status === 200) {
                setOrders((prevOrders) => 
                    prevOrders.map(order =>
                        order.orderId === orderId ? { ...order, status: newStatus } : order
                    )
                );
                setUpdatedOrders(prev => new Set(prev).add(orderId));
                toast.success('Status updated successfully!');
            }
        } catch (error) {
            console.error("Error updating order status: ", error);
            toast.error('Failed to update status!');
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [['Order ID', 'Order Date', 'Advisor Name', 'Customer Name', 'Mobile', 'Alt. Number', 'Products', 'Village', 'Taluka', 'District', 'Pincode', 'Total Amount', 'Status']],
            body: orders.map(order => [
                order.orderId,
                new Date(order.orderDate).toLocaleString(),
                order.advisorName,
                order.customerName,
                order.customerMobile,
                order.alternateMobile,
                order.products.map(product => `${product.productName} (Qty: ${product.quantity})`).join(', '),
                order.village,
                order.taluka,
                order.district,
                order.pincode,
                order.totalAmount,
                order.status,
            ]),
        });
        doc.save('orders.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            orders.map(order => ({
                'Order ID': order.orderId,
                'Order Date': new Date(order.orderDate).toLocaleString(),
                'Advisor Name': order.advisorName,
                'Customer Name': order.customerName,
                'Mobile': order.customerMobile,
                'Alt. Number': order.alternateMobile,
                'Products': order.products.map(product => `${product.productName} (Qty: ${product.quantity})`).join(', '),
                'Village': order.village,
                'Taluka': order.taluka,
                'District': order.district,
                'Pincode': order.pincode,
                'Total Amount': order.totalAmount,
                'Status': order.status,
            }))
        );
        
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');
        XLSX.writeFile(workbook, 'orders.xlsx');
    };

    const exportToCSV = () => {
        const csvData = orders.map(order => ({
            'Order ID': order.orderId,
            'Order Date': new Date(order.orderDate).toLocaleString(),
            'Advisor Name': order.advisorName,
            'Customer Name': order.customerName,
            'Mobile': order.customerMobile,
            'Alt. Number': order.alternateMobile,
            'Products': order.products.map(product => `${product.productName} (Qty: ${product.quantity})`).join(', '),
            'Village': order.village,
            'Taluka': order.taluka,
            'District': order.district,
            'Pincode': order.pincode,
            'Total Amount': order.totalAmount,
            'Status': order.status,
        }));

        const csvString = [
            Object.keys(csvData[0]).join(','),
            ...csvData.map(row => Object.values(row).join(',')),
        ].join('\n');

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'orders.csv');
    };

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
                                    onClick={() => console.log("View orders for advisor:", advisor._id)}
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

    const renderAllOrders = () => (
        <TableContainer component={Paper} style={{ backgroundColor: '#1E1E2F', backdropFilter: 'blur(5px)', borderRadius: 16, overflow: 'hidden' }}>
            <Calendar onDateSelect={(start, end) => {
                setSelectedStartDate(start);
                setSelectedEndDate(end);
                if (!ordersFetched) {
                    fetchAllOrders(start, end); 
                }
            }} />
            <Box mb={2}>
                <Button variant="contained" style={buttonStyle} onClick={exportToPDF}>Export to PDF</Button>
                <Button variant="contained" style={buttonStyle} onClick={exportToExcel}>Export to Excel</Button>
                <Button variant="contained" style={buttonStyle} onClick={exportToCSV}>Export to CSV</Button>
            </Box>
            <Table>
                <TableHead style={{ backgroundColor: '#3f51b5' }}>
                    <TableRow>
                        <TableCell style={tableHeaderCellStyle}>Order ID</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Order Date</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Advisor Name</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Customer Name</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Mobile</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Alt. Number</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Products</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Village</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Taluka</TableCell>
                        <TableCell style={tableHeaderCellStyle}>District</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Pincode</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Total Amount</TableCell>
                        <TableCell style={tableHeaderCellStyle}>Status</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <TableRow key={order.orderId} hover>
                            <TableCell style={tableCellStyle}>{order.orderId}</TableCell>
                            <TableCell style={tableCellStyle}>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                            <TableCell style={tableCellStyle}>{order.advisorName}</TableCell>
                            <TableCell style={tableCellStyle}>{order.customerName}</TableCell>
                            <TableCell style={tableCellStyle}><div>{order.customerMobile}</div></TableCell>
                            <TableCell style={tableCellStyle}><div>{order.alternateMobile}</div></TableCell>
                            <TableCell style={tableCellStyle}>
                                {order.products.map((product, index) => (
                                    <div key={index}>{product.productName} (Qty: {product.quantity})</div>
                                ))}
                            </TableCell>
                            <TableCell style={tableCellStyle}>{order.village}</TableCell>
                            <TableCell style={tableCellStyle}>{order.taluka}</TableCell>
                            <TableCell style={tableCellStyle}>{order.district}</TableCell>
                            <TableCell style={tableCellStyle}>{order.pincode}</TableCell>
                            <TableCell style={tableCellStyle}>₹{order.totalAmount}</TableCell>
                            <TableCell style={tableCellStyle}>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel style={{ color: '#fff' }}>Status</InputLabel>
                                    <Select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                        disabled={updatedOrders.has(order.orderId)} // Disable if this order has been updated
                                        style={{ color: '#fff', backgroundColor: '#3f51b5', borderRadius: 5 }}
                                        MenuProps={{ PaperProps: { style: { backgroundColor: '#1E1E2F' } } }}
                                    >
                                        {statusOptions.map((status) => (
                                            <MenuItem key={status} value={status} style={{ color: '#fff' }}>{status}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <div style={pageStyle}>
            <Sidebar />
            <div style={contentStyle}>
                <AppBar position="static" style={{ backgroundColor: '#FFA500', borderRadius: '0 0 10px 10px' }}>
                    <Tabs value={activeTab} onChange={handleChange} variant="fullWidth">
                        <Tab 
                            label={`Orders by Advisor (${advisors.length})`} 
                            icon={<DashboardIcon />} 
                            style={{ color: activeTab === 0 ? '#fff' : '#000' }} 
                        />
                        <Tab 
                            label={`All Orders (${ordersCount})`} 
                            icon={<VisibilityIcon />} 
                            style={{ color: activeTab === 1 ? '#fff' : '#000' }} 
                        />
                    </Tabs>
                </AppBar>
                <Box p={3}>
                    {activeTab === 0 ? renderOrdersByAdvisor() : renderAllOrders()}
                </Box>
            </div>
            <ToastContainer />
        </div>
    );
}

// Styles
const pageStyle = {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    backgroundColor: '#1E1E2F',
    color: '#fff',
    flex: 1,
    marginTop: '50px',
};

const contentStyle = {
    flex: 1,
    padding: '20px',
};

const tableHeaderCellStyle = {
    backgroundColor: '#3f51b5',
    color: '#fff',
};

const tableCellStyle = {
    color: '#fff',
    backgroundColor: '#1E1E2F',
};

// Button style
const buttonStyle = {
    backgroundColor: '#FFA500', 
    color: '#fff', 
    borderRadius: 8,
    marginRight: '10px',
};

// Export component
export default OperationMemberOrders;