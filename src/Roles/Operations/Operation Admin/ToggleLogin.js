import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "../../../Sidebars/Operation/OperationAdmin/OperationAdminSidebar";
import "./ToggleLogin.css";

function ToggleLogin() {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const toggleLoginStatus = async () => {
    setIsToggling(true);
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/operational-admin/toggle-login/${customerId}`,
        {},
        { withCredentials: true }
      );
      toast.success("Login status toggled successfully.");
      navigate("/OperationMemberList");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error toggling login status");
    } finally {
      setIsToggling(false);
    }
  };

  const handleToggle = () => {
    setIsChecked(!isChecked);
    toggleLoginStatus();
  };

  return (
    <div style={pageStyle}>
      <Sidebar />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} closeOnClick draggable pauseOnHover />
      <div style={containerStyle}>
        <div style={boxStyle}>
          <h2 style={titleStyle}>Toggle Login Status</h2>
          <p style={descriptionStyle}>
            Use the toggle switch below to enable or disable login for this Operation member.
          </p>
          <div className="toggle-wrapper">
            <input
              className="toggle-checkbox"
              type="checkbox"
              checked={isChecked}
              onChange={handleToggle}
              disabled={isToggling}
            />
            <div className="toggle-container">
              <div className="toggle-button">
                <div className="toggle-button-circles-container">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div key={index} className="toggle-button-circle" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const pageStyle = {
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  backgroundColor: "#1e1e2f",
  color: "#fff",
};

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  paddingTop: "80px",
  width: "100%",
};

const boxStyle = {
  padding: "40px",
  textAlign: "center",
  borderRadius: "12px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  maxWidth: "500px", // Restrict max width for better structure
  width: "100%",
};

const titleStyle = {
  marginBottom: "20px",
  color: "#333",
};

const descriptionStyle = {
  marginBottom: "30px",
  color: "#555",
};

export default ToggleLogin;
