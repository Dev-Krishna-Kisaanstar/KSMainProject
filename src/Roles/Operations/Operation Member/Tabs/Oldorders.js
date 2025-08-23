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
  CssBaseline,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Box,
  Grid,
  Select,
  MenuItem,
  OutlinedInput,
  TextField
} from "@mui/material";
import {
  CheckCircle,
  CancelScheduleSend,
  DateRange,
  Person,
  AttachMoney,
  List,
  NearMe
} from "@mui/icons-material";
import axios from "axios";
import Cookies from "js-cookie";   // ✅ Add this
import { ToastContainer, toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";


  const services = [
    { service1: 'Attempt 1', service2: 'CNR' },
    { service1: 'Attempt 2', service2: 'Call Picked But Disconnected by Cx' },
    { service1: 'Attempt 3', service2: 'Call Back' },
    { service1: 'Attempt 4', service2: 'Order Cancel' },
    { service1: 'Attempt 5', service2: 'Order Confirm' },
    { service1: 'Attempt 6', service2: '' },
  ];

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
    const [openServiceDialog, setOpenServiceDialog] = useState(false);
const [selectedServices, setSelectedServices] = useState({ service1: "", service2: "", service3: "" });
const [message, setMessage] = useState("");
const [username, setUsername] = useState('');


    useEffect(() => {
    if (!customerId) return;  // guard clause
    fetchAllOrders();
}, [customerId]);


    // Scroll event for lazy loading
  useEffect(() => {
    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 50 &&
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

   useEffect(() => {
    const fetchUsername = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/operational-member/dashbord`,
                { withCredentials: true }
            );
            const { advisoryMember } = response.data || {};
            if (advisoryMember && advisoryMember.fullName) {
                setUsername(advisoryMember.fullName);
            }
        } catch (error) {
            console.error("Failed to fetch username:", error);
            setError("Failed to fetch data.");
        }
    };
    fetchUsername();
}, []);


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
             alert(message);
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




    const handleSubmitTagging = async () => {
  setLoading(true);
  setMessage("");
  try {
    const requestBody = {
      service1: selectedServices.service1,
      service2: selectedServices.service2,
      remarks: selectedServices.service3,
      OperationName: username,
      taggedDate: new Date().toISOString(),
    };
    console.log("Tagging request payload:", requestBody);

    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/advisory-member/tagging/${customerId}`,
      requestBody,
      { withCredentials: true }
    );

    if (response.status === 200 || response.status === 201) {
      Cookies.remove("frontendadvisorycustomertoken");
      setMessage("Attempt submitted successfully ✅");
    } else {
      setMessage("Failed to submit tagging ❌");
    }
  } catch (error) {
    console.error("Error submitting tagging:", error);
    setMessage("Failed to submit tagging ❌");
  } finally {
    setLoading(false);
  }
};

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
alert('Status updated successfully!');            }
        } catch (error) {
            console.error("Error updating order status: ", error);
alert('Failed to update status!');        }
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
                                        <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => setOpenServiceDialog(true)}
                      >
                        Action
                      </Button>
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
                                {message && (
  <p style={{ color: message.includes("successfully") ? "green" : "red" }}>
    {message}
  </p>
)}

                              </DialogActions>
                            </Dialog>
        </Container>
    );
};

export default Oldorders;