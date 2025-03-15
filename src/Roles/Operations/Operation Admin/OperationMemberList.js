import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Button,
} from "@mui/material";
import Sidebar from "../../../Sidebars/Operation/OperationAdmin/OperationAdminSidebar";
import { useNavigate } from "react-router-dom";

const OperationMemberList = () => {
  const [advisories, setAdvisories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdvisories = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/operational-admin/operational-members`,
          { withCredentials: true }
        );
        // Update this line to fetch from operationalMembers instead of advisoryMembers
        setAdvisories(response.data.operationalMembers); 
      } catch (error) {
        console.error("Error fetching advisories:", error);
      }
    };
    fetchAdvisories();
  }, []);

  const handleToggleLogin = (id) => {
    navigate(`/OppToggleLogin/${id}`);
  };

  return (
    <div style={pageStyle}>
    <Sidebar />
    <Box m={3} style={boxStyle}>
      <Typography variant="h4" align="center" sx={titleStyle}>
        Registered Operation Members
      </Typography>
      <TableContainer component={Paper} elevation={5} sx={tableContainerStyle}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} sx={tableHeaderStyle} align="center">
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {advisories?.length > 0 ? (
              advisories.map((advisory, index) => (
                <TableRow key={advisory._id} hover sx={tableRowStyle}>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>{index + 1}</TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>{advisory.employmentId}</TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>{advisory.fullName}</TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                    {advisory.dob ? new Date(advisory.dob).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>{advisory.officialEmail}</TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                    {advisory.isLoginDisabled ? "Yes" : "No"}
                  </TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF" }}>
                    {new Date(advisory.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      sx={buttonStyle}
                      onClick={() => handleToggleLogin(advisory._id)}
                    >
                      Toggle Login
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={noDataStyle}>
                  No advisory members registered
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  </div>
  );
};

const pageStyle = {
  display: "flex",
  flexDirection: "row",
  minHeight: "100vh",
  backgroundColor: "#1E1E2F",
  color: "#fff",
  paddingTop: "80px",
};

const boxStyle = {
  flex: 1,
  paddingTop: "20px",
};

const titleStyle = {
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#FFFFFF",
};

const tableContainerStyle = {
  borderRadius: "15px",
  overflow: "hidden",
  backgroundColor: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
};

const tableHeaderStyle = {
  backgroundColor: "#6366F1",
  color: "#FFFFFF",
  fontWeight: "bold",
};

const tableRowStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.05)",
  transition: "all 0.3s ease-in-out",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
};

const buttonStyle = {
  backgroundColor: "#6366F1",
  color: "#FFFFFF",
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: "#4F46E5",
  },
};

const noDataStyle = {
  fontSize: "1.2rem",
  fontWeight: "bold",
  color: "#FFFFFF",
};

const columns = [
  { id: "sr", label: "Sr. No." },
  { id: "employmentId", label: "Employment ID" },
  { id: "fullName", label: "Full Name" },
  { id: "dob", label: "Date of Birth" },
  { id: "officialEmail", label: "Official Email" },
  { id: "isLoginDisabled", label: "Login Disabled" },
  { id: "createdAt", label: "Created At" },
  { id: "actions", label: "Actions" },
];

export default OperationMemberList;
