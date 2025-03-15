import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Tabs,
    Tab,
    Grid,
    Divider,
    IconButton,
    Button
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh'; // Import the Refresh icon
import axios from 'axios';
import { toast } from 'react-toastify';
import './ApprovedVendorSidebar.css'; // Import the CSS for your toggle switch

function ApprovedVendorSidebar({ isEditing, setIsEditing, vendorId }) {
    const [selectedTab, setSelectedTab] = useState(0);
    const [isChecked, setIsChecked] = useState(false); // Initial state for the toggle
    const [newPassword, setNewPassword] = useState('');

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        console.log("Switched to tab:", newValue);
    };

    const handleToggle = async () => {
        const newStatus = !isChecked; // Determine the new status based on current state
        const actionText = newStatus ? 'Disabled' : 'Enabled'; // Set action text based on new status

        try {
            await axios.patch(
                `${process.env.REACT_APP_API_URL}/api/vendor-admin/vendor-members/toggle-login/${vendorId}`,
                { status: newStatus }, // Send the new status in the request body if your API supports it. Adjust as necessary.
                { withCredentials: true }
            );
            setIsChecked(newStatus); // Update checked state
            toast.success(`Login status toggled to ${actionText}`);
        } catch (error) {
            console.error("Error toggling login status:", error);
            toast.error("Failed to toggle login status.");
        }
    };

    const handleRegeneratePassword = async () => {
        try {
            const response = await axios.put(
                `${process.env.REACT_APP_API_URL}/api/vendor-admin/regenerate-password/${vendorId}`,
                {},
                { withCredentials: true }
            );
            setNewPassword(response.data.actualPassword);
            toast.success("Password regenerated successfully!");
        } catch (error) {
            console.error('Error while regenerating the password:', error);
            toast.error("Failed to regenerate password.");
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: 'auto',
                backgroundColor: '#f5f5f5',
                color: '#000',
                borderRadius: 2,
                padding: 1,
            }}
        >
            <Box
                sx={{
                    width: '25%',
                    backgroundColor: '#e0e0e0',
                    padding: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Vendor Management
                </Typography>
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    orientation="vertical"
                    sx={{
                        width: '100%',
                        color: '#000',
                    }}
                >
                    <Tab label="Toggle Login Status" />
                    <Tab label="Regenerate Password" />
                </Tabs>
            </Box>

            <Divider orientation="vertical" flexItem sx={{ backgroundColor: '#2e3a4e' }} />
            <Box
                sx={{
                    flex: 1,
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                }}
            >
                {selectedTab === 0 && (
                    <Grid container spacing={1} className="approved-vendor-switch">
                        <Grid item xs={12}>
                            <input
                                type="checkbox"
                                id="approved-vendor-toggle-switch"  // Unique ID
                                checked={isChecked}
                                onChange={handleToggle}
                            />
                            <label htmlFor="approved-vendor-toggle-switch"></label>
                            <Typography variant="body1" style={{ display: 'inline-block', marginLeft: '10px' }}>
                                {isChecked ? "Login Disabled" : "Login Enabled"}
                            </Typography>
                        </Grid>
                    </Grid>
                )}

                {selectedTab === 1 && (
                    <Grid container spacing={1} alignItems="center">
                        <Grid item xs={10} sm={8} md={6}>
                            <TextField
                                fullWidth
                                label="New Password"
                                value={newPassword}
                                InputProps={{ readOnly: true }}
                                variant="outlined"
                                sx={{ width: '100%' }} // Setting a width for the text field.
                            />
                        </Grid>
                        <Grid item xs={2}>
                            <IconButton
                                color="primary"
                                onClick={handleRegeneratePassword} // Always enabled
                                // Removed disabled={ !isEditing }
                            >
                                <RefreshIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                )}

                
            </Box>
        </Box>
    );
}

export default ApprovedVendorSidebar;