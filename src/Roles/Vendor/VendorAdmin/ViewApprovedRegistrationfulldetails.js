import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Button,
  TextField,
  Grid,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import BusinessIcon from "@mui/icons-material/Business";
import PaymentIcon from "@mui/icons-material/Payment";
import AssignmentIcon from "@mui/icons-material/Assignment";
import LazyLoad from "react-lazyload";
import Sidebar from "../../../Sidebars/Vendor/VendorAdmin/VendorAdminSidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApprovedVendorSidebar from "./ApprovedVendorSidebar";

const ViewApprovedRegistrationFullDetails = () => {
  const { vendorId } = useParams(); // Get vendorId from the URL
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch vendor details
  useEffect(() => {
    const fetchVendorDetails = async () => {
      if (vendorId) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/vendor-admin/get-vendor-member-details/${vendorId}`,
            {
              withCredentials: true,
            }
          );
          setVendorDetails(response.data.data.vendorMember);
        } catch (error) {
          setError(
            error.response
              ? error.response.data.message
              : "Failed to fetch vendor details. Please try again."
          );
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVendorDetails();
  }, [vendorId]);

  const handleSave = async () => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_API_URL}/api/vendor-admin/update-vendor/${vendorId}`,
        vendorDetails,
        { withCredentials: true }
      );
      toast.success("Vendor details updated successfully!");
    } catch (error) {
      toast.error("Failed to save vendor details.");
    } finally {
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="text-center" my={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div style={pageStyle}>
    <Sidebar />
    <Box m={3} style={{ paddingTop: "80px", flex: 1 }}>
      <ToastContainer />
      <Typography variant="h5" align="center" gutterBottom>
        Vendor Details
      </Typography>
      <Button
        variant="contained"
        color="primary"
        style={{ float: "right", marginBottom: "10px" }}
        onClick={() => {
          if (isEditing) {
            handleSave();
          } else {
            setIsEditing(true);
          }
        }}
      >
        {isEditing ? "Save" : "Edit"}
      </Button>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h6">Basic Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={vendorDetails?.fullName || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      fullName: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email ID"
                  value={vendorDetails?.emailId || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      emailId: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <EmailIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mobile Number"
                  value={vendorDetails?.mobileNumber || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      mobileNumber: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Alternate Mobile Number"
                  value={vendorDetails?.alternateMobileNumber || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      alternateMobileNumber: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Address"
                  value={vendorDetails?.fullAddress || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      fullAddress: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <HomeIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                  multiline
                  rows={2}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Shop Name"
                  value={vendorDetails?.shopName || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      shopName: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <BusinessIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="GST No"
                  value={vendorDetails?.gstNo || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      gstNo: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <AssignmentIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Shop Website"
                  value={vendorDetails?.shopWebsite || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      shopWebsite: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <BusinessIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Shop Address"
                  value={vendorDetails?.shopAddress || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      shopAddress: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <HomeIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Account Number"
                  value={vendorDetails?.bankAccountNumber || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      bankAccountNumber: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <PaymentIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Account Name"
                  value={vendorDetails?.bankAccountName || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      bankAccountName: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <PaymentIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Code"
                  value={vendorDetails?.bankCode || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      bankCode: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <PaymentIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Bank Name"
                  value={vendorDetails?.bankName || ""}
                  onChange={(e) =>
                    setVendorDetails({
                      ...vendorDetails,
                      bankName: e.target.value,
                    })
                  }
                  InputProps={{
                    startAdornment: (
                      <PaymentIcon style={{ color: "green", marginRight: "8px" }} />
                    ),
                  }}
                  variant="outlined"
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6">Document Uploads</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography>Profile Photo:</Typography>
                    <LazyLoad height={200} once>
                      <img
                        src={vendorDetails?.profilephoto}
                        alt="Profile"
                        style={{
                          width: "300px",
                          height: "300px",
                          marginBottom: "16px",
                          objectFit: "cover",
                        }}
                      />
                    </LazyLoad>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography>Address Proof:</Typography>
                    <LazyLoad height={200} once>
                      <img
                        src={vendorDetails?.addressProof}
                        alt="Address Proof"
                        style={{
                          width: "300px",
                          height: "300px",
                          marginBottom: "16px",
                          objectFit: "cover",
                        }}
                      />
                    </LazyLoad>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography>PAN Card:</Typography>
                    <LazyLoad height={200} once>
                      <img
                        src={vendorDetails?.panCard}
                        alt="PAN Card"
                        style={{
                          width: "300px",
                          height: "300px",
                          marginBottom: "16px",
                          objectFit: "cover",
                        }}
                      />
                    </LazyLoad>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography>Shop Registration Proof:</Typography>
                    <LazyLoad height={200} once>
                      <img
                        src={vendorDetails?.shopRegistrationProof}
                        alt="Shop Registration"
                        style={{
                          width: "300px",
                          height: "300px",
                          marginBottom: "16px",
                          objectFit: "cover",
                        }}
                      />
                    </LazyLoad>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography>Shop Logo:</Typography>
                    <LazyLoad height={200} once>
                      <img
                        src={vendorDetails?.shopLogo}
                        alt="Shop Logo"
                        style={{
                          width: "300px",
                          height: "300px",
                          marginBottom: "16px",
                          objectFit: "cover",
                        }}
                      />
                    </LazyLoad>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography>GST Certificate:</Typography>
                    <LazyLoad height={200} once>
                      <img
                        src={vendorDetails?.gstCertificate}
                        alt="GST Certificate"
                        style={{
                          width: "300px",
                          height: "300px",
                          marginBottom: "16px",
                          objectFit: "cover",
                        }}
                      />
                    </LazyLoad>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography>PAN Image:</Typography>
                    <LazyLoad height={200} once>
                      <img
                        src={vendorDetails?.panImage}
                        alt="PAN Image"
                        style={{
                          width: "300px",
                          height: "300px",
                          marginBottom: "16px",
                          objectFit: "cover",
                        }}
                      />
                    </LazyLoad>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography>Shop Act License:</Typography>
                    <LazyLoad height={200} once>
                      <img
                        src={vendorDetails?.shopActLicense}
                        alt="Shop Act License"
                        style={{
                          width: "300px",
                          height: "300px",
                          marginBottom: "16px",
                          objectFit: "cover",
                        }}
                      />
                    </LazyLoad>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography>Gram Panchayat NOC:</Typography>
                    <LazyLoad height={200} once>
                      <img
                        src={vendorDetails?.gramPanchayatNoc || ""}
                        alt="Gram Panchayat NOC"
                        style={{
                          width: "300px",
                          height: "300px",
                          marginBottom: "16px",
                          objectFit: "cover",
                        }}
                      />
                    </LazyLoad>
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <Typography>Cancelled Cheque:</Typography>
                    <LazyLoad height={200} once>
                      <img
                        src={vendorDetails?.cancelledCheque}
                        alt="Cancelled Cheque"
                        style={{
                          width: "300px",
                          height: "300px",
                          marginBottom: "16px",
                          objectFit: "cover",
                        }}
                      />
                    </LazyLoad>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Paper elevation={3} sx={{ padding: 3 }}>
          <ApprovedVendorSidebar
            vendorId={vendorId} // Pass the vendorId here
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </Paper>
      </Grid>

      <Box mt={3} className="text-center">
        <Button
          variant="contained"
          onClick={() => window.history.back()}
          className="ms-2"
        >
          Go Back
        </Button>
      </Box>
    </Box>
  </div>
  );
};

const pageStyle = {
  display: "flex",
  flexDirection: "row",
  minHeight: "100vh",
  backgroundColor: "#1e1e2f",
  color: "#fff",
  flex: 1,
};

export default ViewApprovedRegistrationFullDetails;
