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
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import autoTable from 'jspdf-autotable';


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

    const [confirmedCount, setConfirmedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [cancelledCount, setCancelledCount] = useState(0);

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
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/advisory-admin/placed-orders?startDate=${startDate}&endDate=${endDate}`,
                { withCredentials: true }
            );

            if (response.data && Array.isArray(response.data.orders)) {
                const sortedOrders = response.data.orders.sort(
                    (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
                );
                setOrders(sortedOrders);

                // ✅ Update counts here
                // ✅ Update counts here with proper mapping
                setConfirmedCount(sortedOrders.filter(o => o.status?.toLowerCase() === "order confirmed").length);
                setPendingCount(sortedOrders.filter(o => o.status?.toLowerCase() === "order placed").length);
                setCancelledCount(sortedOrders.filter(o => o.status?.toLowerCase() === "order cancelled").length);


            } else {
                showSnackbar("No orders found.", 'warning');
                setOrders([]);
                setConfirmedCount(0);
                setPendingCount(0);
                setCancelledCount(0);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            showSnackbar("Failed to fetch orders.", 'error');
            setConfirmedCount(0);
            setPendingCount(0);
            setCancelledCount(0);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF({
            orientation: 'landscape', // More space
            unit: 'mm',
            format: 'a4'
        });

        // Title
        doc.setFontSize(18);
        doc.setTextColor(40);
        doc.text("Orders Report", 14, 15);

        // Date
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

        // Prepare table
        autoTable(doc, {
            startY: 28,
            head: [[
                'Order ID', 'Order Date', 'Advisor', 'Customer', 'Mobile',
                'Products', 'Village', 'District', 'Amount', 'Status'
            ]],
            body: orders.map(order => [
                order.orderId,
                new Date(order.orderDate).toLocaleString(),
                order.advisorName,
                order.customerName,
                order.customerMobile,
                order.products.map(p => `${p.productName} (Qty: ${p.quantity})`).join('\n'),
                order.village,
                order.district,
                `₹${order.totalAmount}`,
                order.status,
            ]),
            styles: {
                fontSize: 9,
                cellPadding: 4,
                overflow: 'linebreak',
                valign: 'middle',
                textColor: [33, 33, 33]
            },
            headStyles: {
                fillColor: [200, 230, 201], // Light green header
                textColor: [0, 0, 0],
                fontStyle: 'bold',
                halign: 'center'
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 25 },
                1: { halign: 'center', cellWidth: 30 },
                2: { cellWidth: 30 },
                3: { cellWidth: 30 },
                4: { halign: 'center', cellWidth: 25 },
                5: { cellWidth: 45 }, // Products
                6: { cellWidth: 25 },
                7: { cellWidth: 25 },
                8: { halign: 'right', cellWidth: 20 },
                9: { halign: 'center', cellWidth: 25 }
            },
            didDrawPage: (data) => {
                const pageCount = doc.internal.getNumberOfPages();
                doc.setFontSize(8);
                doc.setTextColor(100);
                doc.text(`Page ${data.pageNumber} of ${pageCount}`, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 10);
            }
        });

        doc.save('orders.pdf');
    };


    const exportToExcel = () => {
        // Prepare data in a clean order
        const data = orders.map(order => ({
            'Order ID': order.orderId,
            'Order Date': new Date(order.orderDate).toLocaleString(),
            'Advisor Name': order.advisorName,
            'Customer Name': order.customerName,
            'Mobile': order.customerMobile,
            'Products': order.products
                .map(p => `${p.productName} (Qty: ${p.quantity})`)
                .join(', '),
            'Village': order.village,
            'District': order.district,
            'Total Amount': order.totalAmount,
            'Status': order.status,
        }));

        // Create worksheet
        const worksheet = XLSX.utils.json_to_sheet(data);

        // Auto-fit column widths based on content
        const colWidths = Object.keys(data[0]).map(key => ({
            wch: Math.max(
                key.length,
                ...data.map(row => (row[key] ? row[key].toString().length : 0))
            ) + 2 // padding
        }));
        worksheet['!cols'] = colWidths;

        // Create workbook and append sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders');

        // Style header row (bold, center)
        const range = XLSX.utils.decode_range(worksheet['!ref']);
        for (let C = range.s.c; C <= range.e.c; ++C) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
            if (!worksheet[cellAddress]) continue;
            worksheet[cellAddress].s = {
                font: { bold: true, color: { rgb: "000000" } },
                alignment: { horizontal: "center", vertical: "center", wrapText: true }
            };
        }

        // Enable wrap text for product column
        const productColIndex = Object.keys(data[0]).indexOf("Products");
        for (let R = 1; R <= range.e.r; ++R) {
            const cellAddress = XLSX.utils.encode_cell({ r: R, c: productColIndex });
            if (!worksheet[cellAddress]) continue;
            worksheet[cellAddress].s = {
                alignment: { wrapText: true, vertical: "top" }
            };
        }

        // Export file
        XLSX.writeFile(workbook, 'orders.xlsx');
    };


    const exportToCSV = () => {
        // Organize data in a logical order
        const csvData = orders.map(order => ({
            'Order ID': order.orderId,
            'Order Date': new Date(order.orderDate).toLocaleString(),
            'Advisor Name': order.advisorName,
            'Customer Name': order.customerName,
            'Mobile': order.customerMobile,
            'Products': order.products
                .map(p => `${p.productName} (Qty: ${p.quantity})`)
                .join(', '),
            'Village': order.village,
            'District': order.district,
            'Total Amount': order.totalAmount,
            'Status': order.status,
        }));

        // Convert to CSV string with safe quoting
        const headers = Object.keys(csvData[0]).map(h => `"${h}"`).join(',');
        const rows = csvData.map(row =>
            Object.values(row)
                .map(value => `"${(value !== null && value !== undefined ? value : '').toString().replace(/"/g, '""')}"`) // escape quotes
                .join(',')
        );

        const csvString = [headers, ...rows].join('\r\n');

        // Download as CSV
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'orders.csv');
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
        navigate(`/AdvisorAdminIDOrders/${id}`); // Correctly navigate to the details page with the ID
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
                <Box
                    display="flex"
                    alignItems="center"
                    gap={3}
                    mb={3}
                    sx={{
                        p: 2,
                        borderRadius: 2,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                >
                    {/* Calendar */}
                    <Calendar onDateSelect={handleDateSelection} />

                    {/* Status Summary Boxes */}
                    <Box display="flex" gap={2}>
                        {[
                            { label: "Confirmed", value: confirmedCount, color: "#4caf50" },
                            { label: "Pending", value: pendingCount, color: "#ff9800" },
                            { label: "Cancelled", value: cancelledCount, color: "#f44336" },
                        ].map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    backgroundColor: item.color,
                                    color: "#fff",
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    minWidth: 110,
                                    textAlign: "center",
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                    transition: "all 0.2s ease",
                                    cursor: "pointer",
                                    "&:hover": {
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                                    },
                                }}
                                onClick={() =>
                                    item.label === "Confirmed" &&
                                    setOrders(orders.filter(o => o.status?.toLowerCase() === "confirmed"))
                                }
                            >
                                <Typography variant="h6" fontWeight="bold">
                                    {item.value}
                                </Typography>
                                <Typography variant="body2">{item.label}</Typography>
                            </Box>
                        ))}
                    </Box>

                    {/* Export Buttons */}
                    <Box display="flex" gap={1} ml="auto">
                        <Button variant="contained" color="primary" onClick={exportToPDF}>
                            Export to PDF
                        </Button>
                        <Button variant="contained" color="success" onClick={exportToExcel}>
                            Export to Excel
                        </Button>
                        <Button variant="contained" color="secondary" onClick={exportToCSV}>
                            Export to CSV
                        </Button>
                    </Box>
                </Box>



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
// Button style
const buttonStyle = {
    backgroundColor: '#FFA500',
    color: '#fff',
    borderRadius: 8,
    marginRight: '10px',
};

export default AdvisorAdminAdvisoryOrders;