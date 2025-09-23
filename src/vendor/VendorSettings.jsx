import React, { useEffect, useState } from "react";
import { Box, Tabs, Tab, Typography, Paper, Container, Switch, TextField, Button, Grid, Divider } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PaymentIcon from "@mui/icons-material/Payment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useOutletContext } from "react-router-dom";
import { PersonAddAltTwoTone } from "@mui/icons-material";
import CustomAlert from "../utils/CustomAlert";
import Info from "@mui/icons-material/Info";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import VendorProfileForm from "../vendorUtils/VendorProfileForm";

const VendorSettings = () => {
    const { vendor } = useOutletContext();

    const [preferences, setPreferences] = useState({
        firstName: "",
        lastName: "",
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        country: '',
        pincode: '',
    });

    const [tabIndex, setTabIndex] = useState(0);


    const [showAlert, setAlert] = useState(false);

    useEffect(() => {
        const savedPreferences = localStorage.getItem('vd_preferences');

        if (savedPreferences) {
            setPreferences(JSON.parse(savedPreferences));
        }
    }, []);

    // Function to save preferences to localStorage
    const handleSavePreferences = () => {
        // Save preferences to localStorage
        localStorage.setItem('vd_preferences', JSON.stringify(preferences));
        setAlert(true)
    };


    return (
        <Box sx={{ maxWidth: 900, px: { xs: 2, md: 5 }, mx: 'auto' }}>
            <Typography variant="body5" component='div' p={2} fontWeight={500} align="left" gutterBottom mb={2}>
                Settings
            </Typography>

            {/* Tabs Navigation */}
            <Tabs
                value={tabIndex}
                onChange={(_, newValue) => setTabIndex(newValue)} // ✅ Arrow function here
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{ borderBottom: 1, borderColor: "divider" }}
            >
                <Tab icon={<AccountCircleIcon />} label="Profile" sx={{ fontSize: "0.85rem" }} />
                <Tab icon={<LockIcon />} label="Password" sx={{ fontSize: "0.85rem" }} />
                <Tab icon={<PaymentIcon />} label="Payments" sx={{ fontSize: "0.85rem" }} />
                <Tab icon={<NotificationsIcon />} label="Notifications" sx={{ fontSize: "0.85rem" }} />
                <Tab icon={<PersonAddAltTwoTone />} label="Preferences" sx={{ fontSize: "0.85rem" }} />

            </Tabs>

            <Box sx={{ mt: 4, p: 2 }}>
                {/* Profile Settings */}
                {tabIndex === 0 && (
                    <Grid container spacing={2}>
                        {/* vendor profile */}
                        <VendorProfileForm />
                    </Grid>
                )}

                {/* Security Settings */}
                {tabIndex === 1 && (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Current Password" type="password" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="New Password" type="password" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Confirm Password" type="password" variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" color="primary" fullWidth sx={{ py: 1.5 }}>Update Password</Button>
                        </Grid>
                    </Grid>
                )}

                {/* Payment Settings */}
                {tabIndex === 2 && (
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField fullWidth label="Card Number" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth label="Expiry Date" variant="outlined" />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField fullWidth label="CVV" type="password" variant="outlined" />
                        </Grid>
                        <Grid item xs={6}>
                            <Button variant="contained" color="primary" fullWidth sx={{ py: 1.5 }}>Save</Button>
                        </Grid>
                    </Grid>
                )}

                {/* Notifications Settings */}
                {tabIndex === 3 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                            <Typography variant="body1">Enable Email Notifications</Typography>
                            <Switch defaultChecked />
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="body1">Enable SMS Notifications</Typography>
                            <Switch />
                        </Box>
                    </Box>
                )}

                {tabIndex === 4 && (
                    <Box sx={{ px: { xs: 0, md: 3 } }}>
                        <Typography variant="h6" fontWeight={700} mb={4} gutterBottom>
                            User Preferences
                        </Typography>

                        {showAlert && (
                            <CustomAlert
                                openInitially={showAlert}
                                onClose={() => setAlert(false)}
                                severity="success"
                                icon={<CheckCircleOutline />}
                                title="Success"
                                message="Your preferences have been updated successfully."
                            />
                        )}

                        <form>
                            <Grid container spacing={2}>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        variant="outlined"
                                        value={preferences.firstName}
                                        onChange={(e) =>
                                            setPreferences((prev) => ({
                                                ...prev,
                                                firstName: e.target.value,
                                            }))
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        variant="outlined"
                                        value={preferences.lastName}
                                        onChange={(e) =>
                                            setPreferences((prev) => ({
                                                ...prev,
                                                lastName: e.target.value,
                                            }))
                                        }
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Address Line 1"
                                        variant="outlined"
                                        value={preferences.addressLine1}
                                        onChange={(e) =>
                                            setPreferences((prev) => ({
                                                ...prev,
                                                addressLine1: e.target.value,
                                            }))
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Address Line 2"
                                        variant="outlined"
                                        value={preferences.addressLine2}
                                        onChange={(e) =>
                                            setPreferences((prev) => ({
                                                ...prev,
                                                addressLine2: e.target.value,
                                            }))
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="City"
                                        variant="outlined"
                                        value={preferences.city}
                                        onChange={(e) =>
                                            setPreferences((prev) => ({
                                                ...prev,
                                                city: e.target.value,
                                            }))
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="State"
                                        variant="outlined"
                                        value={preferences.state}
                                        onChange={(e) =>
                                            setPreferences((prev) => ({
                                                ...prev,
                                                state: e.target.value,
                                            }))
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Country"
                                        variant="outlined"
                                        value={preferences.country}
                                        onChange={(e) =>
                                            setPreferences((prev) => ({
                                                ...prev,
                                                country: e.target.value,
                                            }))
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        label="Pincode"
                                        variant="outlined"
                                        value={preferences.pincode}
                                        onChange={(e) =>
                                            setPreferences((prev) => ({
                                                ...prev,
                                                pincode: e.target.value,
                                            }))
                                        }
                                    />
                                </Grid>

                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleSavePreferences()}
                                        sx={{ py: 1.5, px: 4 }}
                                    >
                                        Save Preferences
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                )}
            </Box>
        </Box >
    );
};

export default VendorSettings;
