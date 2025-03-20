import React, { useEffect, useState, useCallback } from 'react';
import Sidebar from '../../../Sidebars/Operation/OperationMember/OperationMemberSidebar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Calendar from '../../../Components/Calender/CalenderAIDO';

const tableCellStyle = {
    color: 'white',
};

const tableHeaderCellStyle = {
    backgroundColor: '#3f51b5',
    fontWeight: 'bold',
    color: 'white',
};

function AdvisorIDOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { operationalMemberId } = useParams(); // This grabs the ID from the URL
    console.log("operationalMemberId from params:", operationalMemberId);

    // Set today's date as default
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const [startDate, setStartDate] = useState(formattedToday);
    const [endDate, setEndDate] = useState(formattedToday);
    
    const fetchOrders = useCallback(async (startDate, endDate) => {
        if (!operationalMemberId) {
            console.log("No operationalMemberId available. API call not made.");
            return;
        }
        
        console.log(`Fetching orders with startDate: ${startDate}, endDate: ${endDate}`);

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/operational-member/orders/${operationalMemberId}?startDate=${startDate}&endDate=${endDate}`,
                null,
                {
                    withCredentials: true,
                }
            );

            console.log("API response:", response.data);
            setOrders(response.data.orders || []);
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Could not fetch orders. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [operationalMemberId]);

    // Fetch initial orders with today's date
    useEffect(() => {
        console.log("Component mounted. Fetching orders for today's date.");
        fetchOrders(formattedToday, formattedToday);
    }, [fetchOrders, operationalMemberId, formattedToday]);

    // Effect to fetch orders when the date range changes
    useEffect(() => {
        console.log("Date range changed. Fetching orders.");
        fetchOrders(startDate, endDate);
    }, [startDate, endDate, fetchOrders]);

    const handleDateSelect = (start, end) => {
        console.log(`Date selected - Start: ${start}, End: ${end}`);
        setStartDate(start);
        setEndDate(end);
        fetchOrders(start, end); // Fetch orders whenever the date selection changes
    };

    return (
        <>
            <div style={pageStyle}>
                <Sidebar />
                <div style={contentStyle}>
                    <Calendar onDateSelect={handleDateSelect} />
                    {loading && <p>Loading...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
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
                </div>
            </div>
        </>
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

export default AdvisorIDOrders;