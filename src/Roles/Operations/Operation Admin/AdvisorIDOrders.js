import React, { useEffect, useState } from 'react';
import Sidebar from '../../../Sidebars/Operation/OperationAdmin/OperationAdminSidebar';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Calendar from '../../../Components/Calender/CalenderAIDO'; // Import your Calendar component here

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
    const navigate = useNavigate();
    const { operationalMemberId } = useParams(); // Get operational member ID from params

    // Set today's date as default
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const [startDate, setStartDate] = useState(formattedToday); // Initialize start date to today
    const [endDate, setEndDate] = useState(formattedToday); // Initialize end date to today

    // Effect to fetch orders when operationalMemberId, startDate, or endDate changes
    useEffect(() => {
        const fetchOrders = async () => {
            if (operationalMemberId) {
                try {
                    const response = await axios.post(
                        `${process.env.REACT_APP_API_URL}/api/operational-admin/get-orders/${operationalMemberId}`,
                        null,
                        {
                            params: {
                                startDate,
                                endDate,
                                page: 1, // Initial page number
                            },
                            withCredentials: true,
                        }
                    );

                    if (response.data && response.data.orders) {
                        setOrders(response.data.orders);
                    }
                } catch (error) {
                    console.error("Error fetching orders:", error);
                }
            }
        };

        fetchOrders(); // Fetch orders when component mounts or on dependency changes
    }, [operationalMemberId, startDate, endDate]); // Dependencies to trigger fetching

    const handleDateSelect = (start, end) => {
        setStartDate(start);
        setEndDate(end);
    };

    return (
        <>
            <div style={pageStyle}>
                <Sidebar />
                <div style={contentStyle}>
                    <Calendar onDateSelect={handleDateSelect} /> {/* Pass callback prop */}
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