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
import { CheckCircle, CancelScheduleSend, DateRange, Person, AttachMoney, List } from "@mui/icons-material";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

const statusOptions = [
    'Order Placed',
    'Order Confirmed',
    'Order Cancelled',
];

const statusColors = {
    'Order Placed': '#1976d2',      // Blue
    'Order Confirmed': '#388e3c',   // Green
    'Order Cancelled': '#d32f2f',   // Red
};

const StatusBadge = ({ status }) => (
    <span
        style={{
            display: 'inline-block',
            padding: '4px 8px',
            borderRadius: '12px',
            backgroundColor: statusColors[status] || 'gray',
            color: 'white',
            fontSize: '0.8em',
            fontWeight: 'bold'
        }}
    >
        {status}
    </span>
);

const Oldorders = () => {
    const { customerId } = useParams();

    // State to hold all orders fetched once
    const [allOrders, setAllOrders] = useState([]);
    // State for currently displayed orders (lazy loaded)
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5; // Load 5 orders at a time
    const [hasMore, setHasMore] = useState(false);

    // Fetch all orders once
    const fetchAllOrders = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/orders/${customerId}`,
                { withCredentials: true }
            );
            const ordersList = response.data.orders || [];
            const sortedOrders = ordersList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setAllOrders(sortedOrders);
            // Initialize with first 5 orders
            const initialOrders = sortedOrders.slice(0, itemsPerPage);
            setDisplayedOrders(initialOrders);
            setHasMore(sortedOrders.length > itemsPerPage);
        } catch (err) {
            const message = err.response?.data?.message || "Failed to fetch orders";
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // Load next batch of 5 orders
    const loadMoreOrders = () => {
        const startIdx = page * itemsPerPage;
        const endIdx = startIdx + itemsPerPage;
        const nextOrders = allOrders.slice(startIdx, endIdx);
        setDisplayedOrders(prev => [...prev, ...nextOrders]);
        setPage(prev => prev + 1);
        if (endIdx >= allOrders.length) {
            setHasMore(false);
        }
    };

    useEffect(() => {
        if (customerId) {
            fetchAllOrders();
        }
    }, [customerId]);

    // Scroll event for lazy loading
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 50 &&
                hasMore && !loading
            ) {
                loadMoreOrders();
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [hasMore, loading, allOrders, page]);

    if (loading && allOrders.length === 0) {
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

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/operational-member/update-orderStatus`,
                { orderId, status: newStatus },
                { withCredentials: true }
            );

            if (response.status === 200) {
                // Update in allOrders
                setAllOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
                    )
                );
                // Update in displayedOrders
                setDisplayedOrders(prev =>
                    prev.map(order =>
                        order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
                    )
                );
                toast.success('Status updated successfully!');
            }
        } catch (error) {
            console.error("Error updating order status: ", error);
            toast.error('Failed to update status!');
        }
    };

    return (
        <Container
            maxWidth="lg"
            sx={{
                mt: 4,
                padding: '30px',
                borderRadius: '12px',
                boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                backgroundColor: 'rgba(15, 21, 53, 0.7)',
                backdropFilter: 'blur(10px)',
                color: 'white',
            }}
        >
            <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} />
            <CssBaseline />
            <Typography
                variant="h4"
                align="center"
                sx={{
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: 'bold',
                    mb: 4,
                    color: 'white'
                }}
            >
                Order History
            </Typography>
            {displayedOrders.length > 0 ? (
                <TableContainer
                    component={Paper}
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(5px)',
                    }}
                >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ color: 'white' }}><CheckCircle /> Order ID</TableCell>
                                <TableCell sx={{ color: 'white' }}><DateRange /> Date of Order</TableCell>
                                <TableCell sx={{ color: 'white' }}><Person /> Order Placed By</TableCell>
                                <TableCell sx={{ color: 'white' }}><AttachMoney /> Total Amount</TableCell>
                                <TableCell sx={{ color: 'white' }}><List /> Items</TableCell>
                                <TableCell sx={{ color: 'white' }}><CancelScheduleSend /> Order Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedOrders.map((order) => {
                                const isDisabled = order.orderStatus !== "Order Placed";
                                const selectBgColor = statusColors[order.orderStatus] || 'white';

                                return (
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
                                            {new Date(order.createdAt).toLocaleString()}
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>{order.orderPlacedBy}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>₹{order.totalAmount}</TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            {order.items.map((item, index) => (
                                                <div key={item.productId}>
                                                    {item.name} (Qty: {item.quantity})
                                                    {index < order.items.length - 1 ? ', ' : ''}
                                                </div>
                                            ))}
                                        </TableCell>
                                        <TableCell sx={{ color: 'white' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <select
                                                    value={order.orderStatus}
                                                    disabled={isDisabled}
                                                    onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                                                    style={{
                                                        marginLeft: '8px',
                                                        padding: '4px',
                                                        borderRadius: '4px',
                                                        border: '1px solid #ccc',
                                                        backgroundColor: selectBgColor,
                                                        color: 'white',
                                                        fontSize: '0.9em',
                                                    }}
                                                >
                                                    {statusOptions.map((status) => (
                                                        <option key={status} value={status}>{status}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            {isDisabled && (
                                                <Typography
                                                    variant="caption"
                                                    display="block"
                                                    sx={{ color: 'lightgray', mt: 1 }}
                                                >
                                                    Status can only be changed once.
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography
                    variant="h6"
                    align="center"
                    color="text.secondary"
                    sx={{ fontWeight: 'bold', color: 'white' }}
                >
                    No orders found for this user.
                </Typography>
            )}
        </Container>
    );
};

export default Oldorders;