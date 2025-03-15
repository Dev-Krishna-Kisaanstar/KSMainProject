import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersonAdd, Email, Cake } from "@mui/icons-material";
import axios from "axios";
import Sidebar from "../../../Sidebars/Operation/OperationAdmin/OperationAdminSidebar";
import { Typography } from "@mui/material";

const OperationAdminAddMember = () => {
  const [employmentId, setEmploymentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [dob, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/operational-admin/register-operational-member`,
        {
          employmentId,
          fullName,
          dob,
          officialEmail: email,
        },
        { withCredentials: true }
      );
      
      toast.success("Advisory member registered successfully!");
      setEmploymentId("");
      setFullName("");
      setDateOfBirth("");
      setEmail("");
    } catch (error) {
      toast.error("Failed to register advisory member. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex flex-row" style={pageStyle}>
      <Sidebar />
      <Container className="py-5" style={containerStyle}>
  <ToastContainer />
  <Typography variant="h4" align="center" sx={titleStyle}>
        Register Operation Members
      </Typography>
  <div className="p-4 rounded-lg shadow-lg" style={formCardStyle}>
    {loading ? (
      <h6 className="text-center text-light">Loading...</h6>
    ) : (
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label className="text-light">Employment ID</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                placeholder="Enter Employment ID"
                value={employmentId}
                onChange={(e) => setEmploymentId(e.target.value)}
                required
                style={inputStyle}
              />
              <div style={iconWrapper}><PersonAdd style={iconStyle} /></div>
            </div>
          </Col>
          <Col md={6}>
            <Form.Label className="text-light">Full Name</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="text"
                placeholder="Enter Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                style={inputStyle}
              />
              <div style={iconWrapper}><PersonAdd style={iconStyle} /></div>
            </div>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Label className="text-light">Date of Birth</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="date"
                value={dob}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                style={inputStyle}
              />
              <div style={iconWrapper}><Cake style={iconStyle} /></div>
            </div>
          </Col>
          <Col md={6}>
            <Form.Label className="text-light">Official Email</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="email"
                placeholder="Enter Official Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              <div style={iconWrapper}><Email style={iconStyle} /></div>
            </div>
          </Col>
        </Row>
        <div className="text-center">
          <Button type="submit" className="btn w-100" style={submitButtonStyle}>
            Add Operation Member
          </Button>
        </div>
      </Form>
    )}
  </div>
</Container>

    </div>
  );
};

const pageStyle = {
  backgroundColor: "#1E1E2F", // Dark background for the whole page
  display: "flex",
  flexDirection: "row",
  width: "100%",
  paddingTop:"100px",
};

const containerStyle = {
  width: "100%",
  paddingBottom: "0", // Remove extra space at the bottom
  backgroundColor: "#1E1E2F"
};

const formCardStyle = {
  backgroundColor: "#1E1E2F", // Change card background to match the page
  borderRadius: "15px",
  padding: "30px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  maxHeight: "auto", // Adjust height to content
};

const inputStyle = {
  borderRadius: "10px",
  backgroundColor: "#1E1E2F", // Background of input fields changed to match
  color: "#fff", // Text color for inputs
  border: "1px solid #ccc",
};

const iconWrapper = {
  backgroundColor: "#FFFFFF",
  borderRadius: "50%",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const iconStyle = {
  fontSize: "1.5rem",
  color: "#007BFF",
};

const submitButtonStyle = {
  borderRadius: "20px",
  backgroundColor: "#1E1E2F",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  padding: "12px 24px",
  fontSize: "1.2rem",
  color: "#fff",
  textTransform: "uppercase",
  letterSpacing: "1px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
};

submitButtonStyle[":hover"] = {
  transform: "scale(1.1)",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
};

const titleStyle = {
  fontWeight: "bold",
  marginBottom: "20px",
  color: "#FFFFFF",
};

export default OperationAdminAddMember;
