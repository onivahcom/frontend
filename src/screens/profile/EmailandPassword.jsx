import React, { useState } from "react";
import {
    Box,
    Grid,
    Typography,
    TextField,
    useTheme,
    IconButton as AppBarIconButton,
    Button,
    Divider,
    Alert,
    Tabs,
    Tab,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";


const EmailandPassword = () => {

    const theme = useTheme();
    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [currentEmail, setCurrentEmail] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [emailPassword, setEmailPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false); // Flag to track OTP sent status
    const [otpSentError, setOtpSentError] = useState(''); // Error message for OTP sending failure
    const [isUpdating, setIsUpdating] = useState(false); // Loading state for email update
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [tabIndex, setTabIndex] = useState(0); // State to track selected tab

    // Function to simulate API call for email and password verification
    const verifyEmailPassword = async (email, password) => {
        // Replace with actual API call for verifying email and password
        if (email === 'user@example.com' && password === 'password123') {
            return true;
        }
        return false;
    };

    // Function to simulate sending OTP to new email
    const sendOtpToNewEmail = async (email) => {
        // Replace with actual API call to send OTP
        if (email === 'new@example.com') {
            return { success: true };
        }
        return { success: false, error: 'Failed to send OTP' };
    };

    // Function to handle updating email
    const handleUpdateEmail = async () => {
        // Verify current email and password
        const isValidUser = await verifyEmailPassword(currentEmail, emailPassword);
        if (isValidUser) {
            const otpResponse = await sendOtpToNewEmail(newEmail);
            if (otpResponse.success) {
                setIsOtpSent(true); // Show OTP input field
                setOtpSentError(''); // Reset error message
            } else {
                setOtpSentError(otpResponse.error);
            }
        } else {
            setOtpSentError('Invalid email or password.');
        }
    };

    // Function to handle OTP verification
    const handleVerifyOtp = () => {
        // Replace with actual OTP verification logic
        if (otp === '123456') {
            alert('Email updated successfully!');
            setIsOtpSent('');
            setCurrentEmail('');
            setNewEmail('');
            setEmailPassword('')
        } else {
            alert('Invalid OTP.');
        }
    };
    const toggleDrawer = () => setDrawerOpen((prev) => !prev);

    // Handle tab change
    const handleTabChange = (event, newIndex) => {
        setTabIndex(newIndex);
    };



    return (
        <Box
            maxWidth='md'
            elevation={0}
            sx={{
                p: 4,
                borderRadius: 2,
                mx: 'auto',
                mt: 5,
                minHeight: "100vh",
                backgroundColor: 'white',
            }}
        >
            <Typography variant="body2" fontWeight="bold" mb={3}  >
                Email and password updation
            </Typography>

            {/* Tabs for Update Email and Update Password */}
            <Tabs value={tabIndex} onChange={handleTabChange} >
                <Tab label="Update Email" />
                <Tab label="Update Password" />
            </Tabs>

            <Divider sx={{ mb: 3 }} />

            {tabIndex === 0 && (
                <Box maxWidth='sm' mx='auto'>

                    <Grid container spacing={2} mb={4} justifyContent='center'>
                        <Grid item xs={12} md={8}>
                            <TextField
                                label="Current Email"
                                fullWidth
                                variant="outlined"
                                type="email"
                                value={currentEmail}
                                onChange={(e) => setCurrentEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TextField
                                label="New Email"
                                fullWidth
                                variant="outlined"
                                type="email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={8}>
                            <TextField
                                label="Password for Verification"
                                fullWidth
                                variant="outlined"
                                type="password"
                                value={emailPassword}
                                onChange={(e) => setEmailPassword(e.target.value)}
                            />
                        </Grid>

                        {otpSentError && <Alert severity="error">{otpSentError}</Alert>}

                        <Grid item xs={12} textAlign="right">
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleUpdateEmail}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    fontSize: '1rem',
                                    textTransform: 'capitalize',
                                    borderRadius: '8px',
                                }}
                            >
                                {isUpdating ? 'Updating...' : 'Update Email'}
                            </Button>
                        </Grid>
                    </Grid>

                    {isOtpSent && (
                        <>
                            <Divider sx={{ mb: 3 }} />
                            <Typography variant="h6" fontWeight="bold" mb={2}>
                                Enter OTP
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="OTP Sent to New Email"
                                        fullWidth
                                        variant="outlined"
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12} textAlign="right">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        size="large"
                                        onClick={handleVerifyOtp}
                                        sx={{
                                            px: 3,
                                            py: 1,
                                            fontSize: '1rem',
                                            textTransform: 'capitalize',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        Verify OTP
                                    </Button>
                                </Grid>
                            </Grid>
                        </>
                    )}
                </Box>
            )}

            {tabIndex === 1 && (
                <Box>
                    {/* Update Password Section */}

                    <Grid container spacing={2} justifyContent="center">
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Current Password"
                                fullWidth
                                variant="outlined"
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="New Password"
                                fullWidth
                                variant="outlined"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} textAlign="right">
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => alert('Password updated successfully!')}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    fontSize: '1rem',
                                    textTransform: 'capitalize',
                                    borderRadius: '8px',
                                }}
                            >
                                Update Password
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            )}
        </Box>
    )
}

export default EmailandPassword