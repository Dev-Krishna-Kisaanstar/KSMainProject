import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
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
import { useNavigate } from 'react-router-dom';

function OperationMemberOrders() {

const [confirmedCount, setConfirmedCount] = useState(0);
    const [pendingCount, setPendingCount] = useState(0);
    const [cancelledCount, setCancelledCount] = useState(0);

    const [activeTab, setActiveTab] = useState(0);
    const [advisors, setAdvisors] = useState([]);
    const [ordersCount, setOrdersCount] = useState(0);
    const [orders, setOrders] = useState([]);
    const [selectedStartDate, setSelectedStartDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [ordersFetched, setOrdersFetched] = useState(false);
    const [updatedOrders, setUpdatedOrders] = useState(new Set());
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);

    const [startDate, setStartDate] = useState("");
const [endDate, setEndDate] = useState("");

    const statusOptions = [
        'Order Placed',
        'Order Confirmed',
        'Order Cancelled',
    ];

   useEffect(() => {
    const fetchAdvisors = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/operational-member/all-advisory-members`,
                { withCredentials: true }
            );
            setAdvisors(response.data.advisoryMembers);
        } catch (error) {
            console.error("Error fetching advisors: ", error);
        }
    };

    const handleCloseModal = () => {
    setShowModal(false);
};

    const fetchOrdersCount = async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/operational-member/total-orders-count`,
                { withCredentials: true }
            );
            setOrdersCount(response.data.count);
        } catch (error) {
            console.error("Error fetching orders count: ", error);
        }
    };

    // ✅ Format date as YYYY-MM-DD
    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const today = formatDate(new Date());
    fetchAllOrders(today, today);

    fetchAdvisors();
    fetchOrdersCount();
}, []);


     const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };


    const handleDateSelection = (startDate, endDate) => {
        fetchAllOrders(startDate, endDate);
    };


  const fetchAllOrders = async (start = "", end = "") => {
    try {
        const url = `${process.env.REACT_APP_API_URL}/api/advisory-admin/placed-orders?startDate=${start}&endDate=${end}`;
        const response = await axios.get(url, { withCredentials: true });

        const allOrders = response.data.orders || [];

        setOrders(allOrders);
        setOrdersFetched(true);

        // Calculate counts
        const confirmed = allOrders.filter(o => o.status === "Order Confirmed").length;
        const pending = allOrders.filter(o => o.status === "Order Placed").length;
        const cancelled = allOrders.filter(o => o.status === "Order Cancelled").length;

        setConfirmedCount(confirmed);
        setPendingCount(pending);
        setCancelledCount(cancelled);
        setOrdersCount(allOrders.length);

        // Clear dates after fetch
        setStartDate("");
        setEndDate("");
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

            // Update counts here
            const updatedOrdersList = orders.map(order =>
                order.orderId === orderId ? { ...order, status: newStatus } : order
            );

            const confirmed = updatedOrdersList.filter(o => o.status === "Order Confirmed").length;
            const pending = updatedOrdersList.filter(o => o.status === "Order Placed").length;
            const cancelled = updatedOrdersList.filter(o => o.status === "Order Cancelled").length;

            setConfirmedCount(confirmed);
            setPendingCount(pending);
            setCancelledCount(cancelled);
        }
    } catch (error) {
        console.error("Error updating order status: ", error);
        toast.error('Failed to update status!');
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


    const viewdetails = (id) => {
        navigate(`/AMAdvisorIDOrders/${id}`); // Navigate to the details page with the ID
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
                                    onClick={() => {
                                        console.log("Navigating to AdvisorIDOrders with ID:", advisor._id); // Log the ID
                                        viewdetails(advisor._id);
                                    }}
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
                <TableCell style={tableCellStyle}>
                    {new Date(order.orderDate).toLocaleDateString()}
                </TableCell>
                <TableCell style={tableCellStyle}>{order.advisorName}</TableCell>
                <TableCell style={tableCellStyle}>{order.customerName}</TableCell>
                <TableCell style={tableCellStyle}>
                    <div>{order.customerMobile}</div>
                </TableCell>
                <TableCell style={tableCellStyle}>
                    <div>{order.alternateMobile}</div>
                </TableCell>
                <TableCell style={tableCellStyle}>
                    {order.products.map((product, index) => (
                        <div key={index}>
                            {product.productName} (Qty: {product.quantity})
                        </div>
                    ))}
                </TableCell>
                <TableCell style={tableCellStyle}>{order.village}</TableCell>
                <TableCell style={tableCellStyle}>{order.taluka}</TableCell>
                <TableCell style={tableCellStyle}>{order.district}</TableCell>
                <TableCell style={tableCellStyle}>{order.pincode}</TableCell>
                <TableCell style={tableCellStyle}>₹{order.totalAmount}</TableCell>
                <TableCell style={tableCellStyle}>
  <Typography sx={{ color: '#fff', minWidth: '150px' }}>
    {order.status}
  </Typography>
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
                  <Box
  display="flex"
  alignItems="center"
  gap={3}
  mb={3}
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
          py: 2,
          borderRadius: 2,
          minWidth: 130,
          textAlign: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          transition: "all 0.2s ease",
          cursor: "pointer",
          "&:hover": {
            transform: "translateY(-3px)",
            boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
          },
        }}
        onClick={() =>
          item.label === "Confirmed" &&
          setOrders(orders.filter(o => o.status?.toLowerCase() === "confirmed"))
        }
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ lineHeight: 1 }}
        >
          {item.value}
        </Typography>
        <Typography variant="body1" fontWeight="500">
          {item.label}
        </Typography>
      </Box>
    ))}
  </Box>

  {/* Export Buttons */}
  <Box display="flex" gap={1} ml="auto">
    <Button variant="contained" color="primary" onClick={exportToPDF}>
      Export PDF
    </Button>
    <Button variant="contained" color="success" onClick={exportToExcel}>
      Export Excel
    </Button>
    <Button variant="contained" color="secondary" onClick={exportToCSV}>
      Export CSV
    </Button>
  </Box>
</Box>
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