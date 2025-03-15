// AdvisorMemberMyOrders.js
import React, { useState } from 'react';
import Sidebar from '../../../Sidebars/Advisor/AdvisorMember/AdvisorMemberSidebar';
import Calendar from '../../../Components/Calender/Calender';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    useTheme,
    styled,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const StyledPaper = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(3),
    marginBottom: theme.spacing(2),
}));

function AdvisorMemberMyOrders() {
    const [orders, setOrders] = useState([]);
    const theme = useTheme();

    // Fetch orders with date filtering
    const fetchOrders = async (startDate, endDate) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/advisory-member/placed-orders`, {
                params: { startDate, endDate },
                withCredentials: true,
            });

            const formattedOrders = response.data.orders.map((order) => ({
                customerName: order.customerName,
                customerMobile: order.mobileNumber,
                items: order.items,
                price: order.totalAmount,
                status: order.status,
            }));

            setOrders(formattedOrders);
            console.log("Orders fetched successfully:", formattedOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleDateSelect = ({ start, end }) => {
        fetchOrders(start, end);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', paddingTop: theme.spacing(8) }}>
            <Sidebar />
            <Box sx={{ flexGrow: 1, padding: theme.spacing(3) }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    <ShoppingCartIcon sx={{ mr: 1, verticalAlign: 'middle' }} /> My Orders
                </Typography>
                <Calendar onDateSelect={handleDateSelect} />
                <StyledPaper elevation={3}>
                    <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Mobile Number</TableCell>
                                    <TableCell>Product Name</TableCell>
                                    <TableCell align="right">Quantity</TableCell>
                                    <TableCell align="right">Total Price</TableCell>
                                    <TableCell>Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order, orderIndex) => (
                                    order.items.map((item, itemIndex) => (
                                        <TableRow key={`${orderIndex}-${itemIndex}`}>
                                            {itemIndex === 0 ? (
                                                <>
                                                    <TableCell rowSpan={order.items.length}>{order.customerName}</TableCell>
                                                    <TableCell rowSpan={order.items.length}>{order.customerMobile}</TableCell>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                    <TableCell align="right" rowSpan={order.items.length}>₹{order.price}</TableCell>
                                                    <TableCell rowSpan={order.items.length}>{order.status}</TableCell>
                                                </>
                                            ) : (
                                                <>
                                                    <TableCell>{item.productName}</TableCell>
                                                    <TableCell align="right">{item.quantity}</TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </StyledPaper>
            </Box>
        </Box>
    );
}

export default AdvisorMemberMyOrders;