import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CssBaseline
} from "@mui/material";
import { CheckCircle, CancelScheduleSend, DateRange, Person, AttachMoney, List } from "@mui/icons-material"; // Imported icons
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const Oldorders = () => {
    const { customerId } = useParams();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const loadOrders = async (pageNumber) => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/orders/${customerId}?page=${pageNumber}&limit=5`,
                { withCredentials: true }
            );

            const ordersList = response.data.orders || [];
            const sortedOrders = ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            setOrders((prevOrders) => [...prevOrders, ...sortedOrders]);
            if (ordersList.length < 5) {
                setHasMore(false);
            }
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch orders";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (customerId) {
            loadOrders(page);
        }
    }, [customerId, page]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 &&
                hasMore && !loading
            ) {
                setPage((prev) => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loading, hasMore]);

    if (loading && page === 1) {
        return (
            <Container>
                <Typography color="text.secondary" fontWeight="bold" sx={{ color: 'white' }}>Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Typography color="error" fontWeight="bold" sx={{ color: 'white' }}>{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{
            mt: 4,
            padding: '30px',
            borderRadius: '12px',
            boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
            backgroundColor: 'rgba(15, 21, 53, 0.7)', // Slight opacity for glass effect
            backdropFilter: 'blur(10px)', // Apply blur effect
            color: 'white', // Set text color to white for better visibility
        }}>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} />
            <CssBaseline />
            <Typography variant="h4" align="center" sx={{
                fontFamily: 'Poppins, sans-serif', fontWeight: 'bold', mb: 4, color: 'white'
            }}>
                Order History
            </Typography>
            {orders.length > 0 ? (
                <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(5px)' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}><CheckCircle /> Order ID</TableCell>
                                <TableCell sx={{ color: 'white' }}><DateRange /> Date of Order</TableCell>
                                <TableCell sx={{ color: 'white' }}><Person /> Order Placed By</TableCell>
                                <TableCell sx={{ color: 'white' }}><AttachMoney /> Total Amount</TableCell>
                                <TableCell sx={{ color: 'white' }}><CancelScheduleSend /> Order Status</TableCell>
                                <TableCell sx={{ color: 'white' }}><List /> Items</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((order) => (
                                <TableRow key={order.orderId}>
                                    <TableCell sx={{ color: 'white' }}>
                                        {order.orderStatus === "Completed" ? (
                                            <CheckCircle sx={{ color: "green", marginRight: '8px' }} fontSize="small" />
                                        ) : (
                                            <CancelScheduleSend sx={{ color: "orange", marginRight: '8px' }} fontSize="small" />
                                        )}
                                        {order.orderId}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>
                                        {new Date(order.createdAt).toLocaleString()} {/* Date with Time */}
                                    </TableCell>
                                    <TableCell sx={{ color: 'white' }}>{order.orderPlacedBy}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>₹{order.totalAmount}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>{order.orderStatus}</TableCell>
                                    <TableCell sx={{ color: 'white' }}>
                                        {order.items.map((item, index) => (
                                            <div key={item.productId}>
                                                {item.name} (Qty: {item.quantity}){index < order.items.length - 1 ? ', ' : ''}
                                            </div>
                                        ))}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="h6" align="center" color="text.secondary" sx={{ fontWeight: 'bold', color: 'white' }}>
                    No orders found for this user.
                </Typography>
            )}
        </Container>
    );
};

export default Oldorders;