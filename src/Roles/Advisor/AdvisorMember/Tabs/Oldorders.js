import React, { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    Typography,
    Box,
    Grid,
    Container,
    Stack,
    Paper,
    CssBaseline,
    Button,
} from "@mui/material";
import { CheckCircle, CancelScheduleSend, LocalOffer } from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
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
            toast.success("Orders fetched successfully!");
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
                orders.map((order) => (
                    <Paper key={order.orderId} elevation={4} sx={{
                        padding: '20px',
                        borderRadius: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Transparent background for glass effect
                        backdropFilter: 'blur(5px)', // Subtle blur for a glass-like effect
                        mb: 3,
                        color: 'white', // Ensure text is white inside the card
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                {order.orderStatus === "Completed" ? (
                                    <CheckCircle sx={{ color: "green" }} fontSize="large" />
                                ) : (
                                    <CancelScheduleSend sx={{ color: "green" }} fontSize="large" />
                                )}
                                <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 'bold' }}>
                                    Order ID: {order.orderId}
                                </Typography>
                            </Stack>
                            <Grid container spacing={2} alignItems="center" sx={{ mt: 2 }}>
                                <Grid item xs={6}>
                                    <Typography variant="body1" sx={{ fontWeight: '500', color: 'white', fontSize: '1.2rem' }}>
                                        <b>Date of Order:</b> {new Date(order.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="body1" sx={{ fontWeight: '500', color: 'white', fontSize: '1.2rem' }}>
                                        <b>Order Placed By:</b> {order.orderPlacedBy}
                                    </Typography>
                                </Grid>
                            </Grid>

                            <Typography variant="body1" sx={{ fontWeight: '700', mt: 1, color: 'white', fontSize: '1.4rem' }}>
                                Total Amount: ₹{order.totalAmount}
                            </Typography>

                            <Typography variant="body1" sx={{ fontWeight: '700', color: 'white', fontSize: '1.4rem' }}>
                                Order Status: {order.orderStatus}
                            </Typography>

                            <Typography variant="body2" sx={{ fontWeight: '600', mt: 2 }}>
                                Items:
                            </Typography>
                            {order.items.map((item) => (
                                <Grid container spacing={2} key={item.productId} alignItems="center">
                                    <Grid item xs={6}>
                                        <Typography variant="body2" sx={{ fontWeight: '500' }}>
                                            <LocalOffer sx={{ color: "orange", marginRight: '4px' }} />
                                            {item.name}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Typography variant="body2" sx={{ fontWeight: '500' }}>Qty: {item.quantity}</Typography>
                                    </Grid>
                                </Grid>
                            ))}
                        </CardContent>
                    </Paper>
                ))
            ) : (
                <Typography variant="h6" align="center" color="text.secondary" sx={{ fontWeight: 'bold', color: 'white' }}>
                    No orders found for this user.
                </Typography>
            )}
        </Container>
    );
};

export default Oldorders;
