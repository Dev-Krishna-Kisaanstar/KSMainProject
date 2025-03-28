import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CalendarToday } from '@mui/icons-material';
import Sidebar from '../../Sidebars/Logistic/LogisticSidebar';
import BillFormat from '../../Components/BillingForLogistics'; // Adjust the import path based on your file structure
import Modal from '@mui/material/Modal';

const ConfirmOrders = () => {
    const [selectedOrders, setSelectedOrders] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
    const [selectingEndDate, setSelectingEndDate] = useState(false);
    const [currentOrder, setCurrentOrder] = useState(null);

    const fetchOrdersByDateRange = async (start, end) => {
        const queryStartDate = start.toISOString().split("T")[0];
        const queryEndDate = end.toISOString().split("T")[0];

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/operational-admin/track-orders?orderStatus=Order%20Confirmed&startDate=${queryStartDate}&endDate=${queryEndDate}`,
                null,
                { withCredentials: true } 
            );
            setSelectedOrders(response.data.orders || []);
            if (!response.data.orders || response.data.orders.length === 0) {
                toast.info("No confirmed orders found for the selected date range.");
            }
        } catch (error) {
            toast.error("Failed to fetch confirmed orders.");
        }
    };

    useEffect(() => {
        if (startDate && endDate) {
            fetchOrdersByDateRange(startDate, endDate);
        }
    }, [startDate, endDate]);

    const handleDateClick = ({ dateStr }) => {
        const clickedDate = new Date(dateStr);
        if (clickedDate > new Date()) {
            return toast.error("Future dates are not allowed!");
        }

        if (!startDate || selectingEndDate) {
            if (!startDate) {
                setStartDate(clickedDate);
                toast.info("Now select the end date.");
                setSelectingEndDate(true);
            } else {
                if (clickedDate < startDate) {
                    toast.error("End date cannot be before start date!");
                    return;
                }
                setEndDate(clickedDate);
                setSelectingEndDate(false);
                setIsModalOpen(false);
            }
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        autoTable(doc, {
            head: [['Order ID', 'Order Date', 'Advisor Name', 'Customer Name', 'Mobile', 'Alt. Number', 'Products', 'Village', 'Taluka', 'District', 'Pincode', 'Total Amount', 'Status']],
            body: selectedOrders.map(order => [
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
        doc.save('confirmed_orders.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(
            selectedOrders.map(order => ({
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
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Confirmed Orders');
        XLSX.writeFile(workbook, 'confirmed_orders.xlsx');
    };

    const exportToCSV = () => {
        const csvData = selectedOrders.map(order => ({
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
        saveAs(blob, 'confirmed_orders.csv');
    };

    const handleDispatchClick = (order) => {
        if (order) {
            setCurrentOrder(order);
            setIsDispatchModalOpen(true);
        }
    };

    return (
        <>
            <div style={pageStyle}>
                <Sidebar />
                <ToastContainer />
                <Box p={3}>
                    <Box display="flex" gap={2} mb={3} justifyContent="center">
                        <Button variant="contained" color="secondary" onClick={() => setIsModalOpen(true)}>
                            <CalendarToday /> Calendar
                        </Button>
                        <Button variant="contained" color="primary" onClick={exportToPDF}>Export to PDF</Button>
                        <Button variant="contained" color="primary" onClick={exportToExcel}>Export to Excel</Button>
                        <Button variant="contained" color="primary" onClick={exportToCSV}>Export to CSV</Button>
                    </Box>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Order ID</TableCell>
                                    <TableCell>Order Date</TableCell>
                                    <TableCell>Advisor Name</TableCell>
                                    <TableCell>Customer Name</TableCell>
                                    <TableCell>Mobile</TableCell>
                                    <TableCell>Alt. Number</TableCell>
                                    <TableCell>Products</TableCell>
                                    <TableCell>Village</TableCell>
                                    <TableCell>Taluka</TableCell>
                                    <TableCell>District</TableCell>
                                    <TableCell>Pincode</TableCell>
                                    <TableCell>Total Amount</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedOrders.map(order => (
                                    <TableRow key={order.orderId}>
                                        <TableCell>{order.orderId}</TableCell>
                                        <TableCell>{new Date(order.orderDate).toLocaleString()}</TableCell>
                                        <TableCell>{order.advisorName}</TableCell>
                                        <TableCell>{order.customerName}</TableCell>
                                        <TableCell>{order.customerMobile}</TableCell>
                                        <TableCell>{order.alternateMobile}</TableCell>
                                        <TableCell>
                                            {order.products.map((product, index) => (
                                                <div key={index}>{product.productName} (Qty: {product.quantity})</div>
                                            ))}
                                        </TableCell>
                                        <TableCell>{order.village}</TableCell>
                                        <TableCell>{order.taluka}</TableCell>
                                        <TableCell>{order.district}</TableCell>
                                        <TableCell>{order.pincode}</TableCell>
                                        <TableCell>₹{order.totalAmount}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => handleDispatchClick(order)}
                                            >
                                                Dispatch
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
                <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    <Box p={4} bgcolor="white" color="black" width={600} height={600} mx="auto" mt={10} borderRadius={3} boxShadow={3} overflow="auto">
                        <Typography variant="h6" textAlign="center" mb={2} color="primary">
                            {selectingEndDate ? "Select End Date" : "Select Start Date"}
                        </Typography>
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            dateClick={handleDateClick}
                            height={350}
                        />
                        <Button variant="contained" color="error" fullWidth sx={{ mt: 2, borderRadius: 2 }} onClick={() => setIsModalOpen(false)}>Close</Button>
                    </Box>
                </Modal>

                <Modal open={isDispatchModalOpen} onClose={() => setIsDispatchModalOpen(false)}>
    {currentOrder ? (
        <Box p={4} bgcolor="white" color="black" width={1200} height={1000} mx="auto" mt={10} borderRadius={3} boxShadow={3} overflow="auto">
            <Typography variant="h6" textAlign="center" mb={2} color="primary">
                Dispatch Bill
            </Typography>

            <BillFormat
                finalAmount={currentOrder.totalAmount}
                orderId={currentOrder.orderId}
                productName={currentOrder.products[0]?.productName || "Not Available"}
                customerName={currentOrder.customerName || "Not Available"}
                customerMobile={currentOrder.customerMobile || "Not Available"}
                Address={{
                    pincode: currentOrder.pincode || "Not Available",
                    village: currentOrder.village || "Not Available",
                    taluka: currentOrder.taluka || "Not Available",
                    district: currentOrder.district || "Not Available",
                    nearbyLocation: currentOrder.nearbyLocation || "Not Available", // Or make this also optional
                    postOffice: currentOrder.postOffice || "Not Available" // Or make this also optional
                }}
            />

            <Button variant="contained" color="error" fullWidth sx={{ mt: 2, borderRadius: 2 }} onClick={() => setIsDispatchModalOpen(false)}>Close</Button>
        </Box>
    ) : (
        <Typography variant="h6" textAlign="center" color="red">No Order Details Available</Typography>
    )}
</Modal>
            </div>
        </>
    );
};

// Styles
const pageStyle = {
    display: 'flex',
    flexDirection: 'row',
    minHeight: '100vh',
    backgroundColor: '#1e1e2f',
    color: '#fff',
    flex: 1,
    marginTop: '50px',
};

export default ConfirmOrders;