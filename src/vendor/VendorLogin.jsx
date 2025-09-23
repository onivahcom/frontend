import React, { useState } from 'react';
import { Box, Button, Card, Container, TextField, CardContent, Grid, Stack, Typography, List, ListItem, ListItemIcon, ListItemText, Paper, Avatar, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Radio, RadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';
import { apiUrl, backendApi } from '../Api/Api';
import { Snackbar, Alert } from '@mui/material'; // Material UI Snackbar and Alert component
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';
import PhoneInput from 'react-phone-input-2';
import CheckCircle from '@mui/icons-material/CheckCircle';
import { Login, PersonAdd, Phone } from '@mui/icons-material';
import Email from '@mui/icons-material/Email';

const VendorLogin = () => {
    const navigate = useNavigate();
    const [isSignup, setIsSignup] = useState(true);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [contactType, setContactType] = useState('email');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // State variables for OTP inputs
    const [emailOtp, setEmailOtp] = useState('');
    const [phoneOtp, setPhoneOtp] = useState('');

    // Flags to track if OTP is sent
    const [isEmailOtpSent, setIsEmailOtpSent] = useState(false);
    const [isPhoneOtpSent, setIsPhoneOtpSent] = useState(false);

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // success or error


    const sendOtp = async (type) => {
        let endpoint = '/send-otp';
        let payload;

        if (type === 'email') {
            payload = { type, email };  // Send email field
        } else if (type === 'phone') {
            payload = { type, phone };  // Send phone field
        }

        try {

            const response = await backendApi.post(`/vendor${endpoint}`, payload);
            console.log(response.data.message);
            if (type === 'email') {
                setIsEmailOtpSent(true);
            } else if (type === 'phone') {
                setIsPhoneOtpSent(true);
            }

        } catch (error) {
            alert(error.response ? error.response.data.message : error)
            console.log('Error sending OTP:', error.response ? error.response.data.message : error);
        }
    };


    // Function to verify OTP (email or phone)
    const verifyOtp = async (type) => {
        let otp;
        let endpoint;
        let payload;

        // Determine which OTP to verify based on the type (email or phone)
        if (type === 'email') {
            otp = emailOtp;  // OTP entered by the user for email
            endpoint = '/verify-email-otp';
            payload = { otp, email };  // Send OTP and email to backend
        } else if (type === 'phone') {
            otp = phoneOtp;  // OTP entered by the user for phone
            endpoint = '/verify-phone-otp';
            payload = { otp, phone };  // Send OTP and phone to backend
        }

        try {
            // Send the OTP to the backend for verification
            const response = await backendApi.post(`/vendor/${endpoint}`, payload);

            // Handle success: OTP verified
            console.log(response.data.message);
            if (type === 'email') {
                setIsEmailVerified(true);
            } else if (type === 'phone') {
                setIsPhoneVerified(true);
            }
        } catch (error) {
            // Handle error: Invalid OTP or network error
            if (error.response) {
                console.error(error.response.data.message);
            } else {
                console.error('Error verifying OTP:', error.message);
            }
        }
    };




    const handleSubmit = async (event) => {
        event.preventDefault();
        if (isSignup) {
            if (isEmailVerified && isPhoneVerified) {
                // Enable password set and navigate
                navigate('/vendor/password_setup', {
                    state: { email, phone }
                });
            }
        } else {

            if ((!email && !phone) || !password) {
                setSnackbarMessage('Please fill the missing fields');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
                return;
            }

            let payload = {};

            if (contactType === 'email' && email) {
                payload = { email, password };
            } else if (contactType === 'phone' && phone) {
                payload = { phone, password };
            }

            try {
                const response = await backendApi.post(`/vendor/vendor-login`, payload, { withCredentials: true });

                if (response.data.success) {
                    // localStorage.setItem('vendor_token', response.data.token);
                    setSnackbarMessage('Login successful');
                    setSnackbarSeverity('success');
                    navigate(`/vendor-dashboard`)

                } else {
                    setSnackbarMessage(response.data.message);
                    setSnackbarSeverity('error');
                }
                setOpenSnackbar(true);
            } catch (error) {
                console.log('Error during login:', error);
                setSnackbarMessage(error.response?.data?.message || 'Failed to login. Please try again.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            }
        }
    };


    return (

        <Box sx={{ bgcolor: "#f5f1ff", }}>
            <Header />

            <Grid maxWidth='lg' container sx={{ mt: 10, placeSelf: "center", borderRadius: 5, py: 5, px: { xs: 1, md: 5 } }}>
                {/* Left Section: Image */}
                {/* <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src="https://marketplace.canva.com/EAFrSTbEw-k/2/0/1067w/canva-vxEFUNsmOoU.jpg"
                        alt="section-img"
                        sx={{
                            width: "100%",
                            height: { xs: 300, md: 600 },
                            objectFit: { xs: "cover", md: "contain" },
                            borderRadius: 5,
                        }}
                    />
                </Grid> */}

                {/* LEFT SIDE - Engaging Content */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        order: { xs: 2, md: 1 },
                        background: "#6e48aa",
                        color: "white",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        borderRadius: 5,
                        p: 6,
                        mb: 4,
                    }}
                >

                    <Typography
                        fontWeight="bold"
                        gutterBottom
                        sx={{
                            fontSize: {
                                xs: "1.5rem", // ~24px on mobile
                                sm: "2rem",   // ~32px on tablets
                                md: "2.5rem", // ~40px on medium screens
                            },
                        }}
                    >
                        Turn Your Passion Into Bookings
                    </Typography>

                    <Typography
                        sx={{
                            mb: { xs: 2, md: 4 },
                            fontSize: {
                                xs: "0.9rem", // ~14px
                                sm: "1rem",   // ~16px
                                md: "1.25rem", // ~20px
                            },
                        }}
                    >
                        Join thousands of vendors growing their business with us.
                    </Typography>


                    {/* Key Benefits */}
                    <List>
                        {[
                            "Fast payouts and easy management",
                            "Reach more customers effortlessly",
                            "24/7 vendor support team",
                        ].map((text, i) => (
                            <ListItem key={i} sx={{ pl: 0 }}>
                                <ListItemIcon>
                                    <CheckCircle sx={{ color: "white", fontSize: { xs: 18, sm: 22, md: 24 } }} />
                                </ListItemIcon>
                                <ListItemText
                                    primary={text}
                                    primaryTypographyProps={{
                                        sx: {
                                            fontSize: {
                                                xs: "0.9rem",  // ~14px on mobile
                                                sm: "1rem",    // ~16px on tablets
                                                md: "1.1rem",  // ~17-18px on medium screens
                                            },
                                            // fontWeight: 500,
                                        },
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                    {/* Testimonial */}
                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            mt: { xs: 2, md: 4 },
                            pb: 1,
                        }}
                    >
                        <Paper
                            sx={{
                                minWidth: 280,
                                maxWidth: 280,
                                p: 3,
                                bgcolor: "rgba(255,255,255,0.1)",
                                backdropFilter: "blur(6px)",
                                color: "white",
                                borderRadius: 3,
                                flexShrink: 0, // Prevent shrinking
                            }}
                            elevation={0}
                        >
                            <Typography variant="body1" fontStyle="italic">
                                "I doubled my bookings in 3 months with this platform."
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                                <Avatar src="https://randomuser.me/api/portraits/women/44.jpg" />
                                <Box sx={{ ml: 2 }}>
                                    <Typography variant="subtitle2">Priya Sharma</Typography>
                                    <Typography variant="caption">Decor Vendor</Typography>
                                </Box>
                            </Box>
                        </Paper>

                    </Box>

                </Grid>


                {/* Right Section: Content */}
                <Grid
                    item
                    xs={12}
                    md={6}
                    sx={{
                        order: { xs: 1, md: 2 },
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: { xs: 'left', md: 'center' }
                    }}
                >
                    {/* <CardContent sx={{ textAlign: { xs: 'left', md: 'center' } }}> */}

                    {/* Login Dialog */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: "center"
                    }}>

                        <Container maxWidth="xs">

                            {/* Heading */}
                            <Typography
                                variant="h4"
                                component="h1"
                                sx={{
                                    mt: 2,
                                    fontWeight: "bold",
                                    letterSpacing: "1px",
                                }}
                                gutterBottom
                            >
                                Become a{" "}
                                <Box component="span" sx={{ color: "primary.main" }}>
                                    Vendor
                                </Box>
                            </Typography>


                            {/* Subheading */}
                            <Typography
                                variant="subtitle2"
                                color='textSecondary'
                                sx={{
                                    mb: 1,
                                    lineHeight: 1.6,
                                    maxWidth: 400,
                                }}
                            >
                                Welcome back! Access your dashboard to manage bookings, view inquiries,
                                and enhance your services to provide the perfect wedding experience.
                            </Typography>

                            <Typography
                                sx={{
                                    borderRadius: 2,
                                    px: { xs: 2, md: 0 },
                                    py: 1,
                                    mt: 4,
                                    mb: 4,
                                    width: "fit-content",
                                    display: "flex",       // 👈 makes text + icon inline
                                    alignItems: "center",  // 👈 vertical center
                                    gap: 1                 // 👈 spacing between icon and text
                                }}
                            >
                                {isSignup ? (
                                    <>
                                        <PersonAdd fontSize="small" />
                                        <Typography variant="body2" component="div" sx={{ fontWeight: 500 }}>
                                            Create Your Account
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <Login fontSize="small" />
                                        <Typography variant="body2" component="div" sx={{ fontWeight: 500 }}>
                                            Welcome Back
                                        </Typography>
                                    </>
                                )}
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <Grid container >
                                    {isSignup ? (
                                        <>
                                            <Grid container spacing={3}>
                                                {/* Email Field */}
                                                <Grid item xs={12}>
                                                    <TextField
                                                        label="Email"
                                                        variant="outlined"
                                                        fullWidth
                                                        sx={{ bgcolor: "#fff" }}
                                                        value={email}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </Grid>

                                                {/* Email OTP Actions */}
                                                {email && !isEmailOtpSent && (
                                                    <Grid item xs={12} container spacing={2} direction="row" alignItems="center" sx={{ display: isEmailVerified ? "none" : "block" }}>
                                                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{
                                                                    maxWidth: 150,
                                                                }}
                                                                onClick={() => sendOtp('email')}
                                                                fullWidth
                                                            >
                                                                Verify Email
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {isEmailOtpSent && (
                                                    <Grid item xs={12} sx={{ display: isEmailVerified ? "none" : "block" }}>
                                                        <TextField
                                                            label="Enter Email OTP"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={emailOtp}
                                                            type='tel'
                                                            onChange={(e) => setEmailOtp(e.target.value)}
                                                            required
                                                        />
                                                    </Grid>
                                                )}

                                                {isEmailOtpSent && (
                                                    <Grid item xs={12} container spacing={2} direction="row" alignItems="center" sx={{ display: isEmailVerified ? "none" : "flex" }}>
                                                        <Grid item xs={6}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => verifyOtp('email')}
                                                                fullWidth
                                                                disabled={!emailOtp}
                                                            >
                                                                Verify OTP
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Button
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={() => sendOtp('email')}
                                                                fullWidth
                                                            >
                                                                Resend OTP
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {isEmailVerified && (
                                                    <Grid item xs={12}>
                                                        <Alert severity="success" icon={false}>
                                                            <span style={{ fontSize: '16px', marginRight: '10px' }}>✔</span> Email Verified
                                                        </Alert>
                                                    </Grid>
                                                )}

                                                {/* Phone Field */}
                                                <Grid item xs={12}>
                                                    {/* <TextField
                                                        label="Phone"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        required
                                                    /> */}
                                                    <PhoneInput
                                                        country={'in'}
                                                        value={phone}
                                                        onChange={(phone) => setPhone(phone)}
                                                        inputStyle={{
                                                            width: '100%',
                                                            height: '56px', // match MUI TextField height
                                                            fontSize: '16px'
                                                        }}
                                                        containerStyle={{ width: '100%' }}
                                                        specialLabel="Phone"
                                                        inputProps={{
                                                            required: true,
                                                            name: 'phone',
                                                        }}
                                                    />
                                                </Grid>

                                                {/* Phone OTP Actions */}
                                                {phone && !isPhoneOtpSent && (
                                                    <Grid item xs={12} container spacing={2} direction="row" alignItems="center" sx={{ display: isPhoneVerified ? "none" : "flex" }}>
                                                        <Grid item xs={12} display="flex" justifyContent="flex-end">
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                sx={{
                                                                    maxWidth: 150,
                                                                }}
                                                                onClick={() => sendOtp('phone')}
                                                                fullWidth
                                                            >
                                                                Verify Phone
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {isPhoneOtpSent && (
                                                    <Grid item xs={12} sx={{ display: isPhoneVerified ? "none" : "flex" }}>
                                                        <TextField
                                                            label="Enter Phone OTP"
                                                            variant="outlined"
                                                            fullWidth
                                                            value={phoneOtp}
                                                            onChange={(e) => setPhoneOtp(e.target.value)}
                                                            required
                                                        />
                                                    </Grid>
                                                )}

                                                {isPhoneOtpSent && (
                                                    <Grid item xs={12} container spacing={2} direction="row" alignItems="center" sx={{ display: isPhoneVerified ? "none" : "flex" }}>
                                                        <Grid item xs={6}>
                                                            <Button
                                                                variant="contained"
                                                                color="primary"
                                                                onClick={() => verifyOtp('phone')}
                                                                fullWidth
                                                                disabled={!phoneOtp}
                                                            >
                                                                Verify OTP
                                                            </Button>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Button
                                                                variant="outlined"
                                                                color="secondary"
                                                                onClick={() => sendOtp('phone')}
                                                                fullWidth
                                                            >
                                                                Resend OTP
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                )}

                                                {isPhoneVerified && (
                                                    <Grid item xs={12}>
                                                        <Alert severity="success" icon={false}>
                                                            <span style={{ fontSize: '16px', marginRight: '10px' }}>✔</span> Phone Verified
                                                        </Alert>
                                                    </Grid>
                                                )}

                                                {/* Set Password Button (enabled after both OTPs are verified) */}
                                                {/* {isEmailVerified && isPhoneVerified && (
                                                                <Grid item xs={12}>
                                                                    <Button
                                                                        variant="contained"
                                                                        color="primary"
                                                                        fullWidth
                                                                        onClick={() => console.log('Setting password')}
                                                                    >
                                                                        Set Password
                                                                    </Button>
                                                                </Grid>
                                                            )} */}
                                            </Grid>
                                        </>
                                    ) : (
                                        <>
                                            <Grid item xs={12} sx={{ mb: 2 }}>
                                                {/* <Typography variant="subtitle1" component='div' color='textSecondary' sx={{ mb: 2 }}>
                                                    Login via
                                                </Typography> */}
                                                <ToggleButtonGroup
                                                    value={contactType}
                                                    exclusive
                                                    onChange={(e, newValue) => newValue && setContactType(newValue)}
                                                    fullWidth
                                                    sx={{ borderRadius: 2, mb: 2 }}
                                                >
                                                    <ToggleButton value="email" sx={{ textTransform: "none", flex: 1 }}>
                                                        <Email sx={{ mr: 1 }} /> Email
                                                    </ToggleButton>
                                                    <ToggleButton value="phone" sx={{ textTransform: "none", flex: 1 }}>
                                                        <Phone sx={{ mr: 1 }} /> Phone
                                                    </ToggleButton>
                                                </ToggleButtonGroup>
                                            </Grid>
                                            {contactType === 'email' && (
                                                <Grid item xs={12} mb={2}>
                                                    <TextField
                                                        label="Email"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={email}
                                                        sx={{ bgcolor: "white" }}
                                                        onChange={(e) => setEmail(e.target.value)}
                                                        required
                                                    />
                                                </Grid>
                                            )}
                                            {contactType === 'phone' && (
                                                <Grid item xs={12} mb={2}>
                                                    {/* <TextField
                                                        label="Phone"
                                                        variant="outlined"
                                                        fullWidth
                                                        value={phone}
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        required
                                                    /> */}
                                                    <PhoneInput
                                                        country={'in'}
                                                        value={phone}
                                                        onChange={(phone) => setPhone(phone)}
                                                        inputStyle={{
                                                            width: '100%',
                                                            height: '56px', // match MUI TextField height
                                                            fontSize: '16px'
                                                        }}
                                                        containerStyle={{ width: '100%' }}
                                                        specialLabel="Phone"
                                                        inputProps={{
                                                            required: true,
                                                            name: 'phone',
                                                        }}
                                                    />
                                                </Grid>
                                            )}
                                            <Grid item xs={12} mb={2}>
                                                <TextField
                                                    label="Password"
                                                    type="password"
                                                    variant="outlined"
                                                    fullWidth
                                                    value={password}
                                                    sx={{ bgcolor: "#ffff" }}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                        </>
                                    )}


                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        sx={{ mt: 4, p: '12px 0px' }}
                                        fullWidth
                                        disabled={
                                            isSignup
                                                ? !isEmailVerified || !isPhoneVerified  // Disable if email or phone are not verified
                                                : (!email && !phone) || !password // Disable if neither email nor phone are filled, or password is not filled
                                        }
                                    >
                                        {isSignup ? 'Set Password' : 'Log In'}
                                    </Button>
                                </Grid>
                            </form>
                            {error && <Typography color="error" variant="body2">{error}</Typography>}
                            {success && <Typography color="primary" variant="body2">{success}</Typography>}
                            <Grid container justifyContent="center" sx={{ mt: 2 }}>
                                <Button onClick={() => setIsSignup(!isSignup)} sx={{ color: "grey" }}>
                                    {isSignup ? (
                                        <>
                                            Already have an account?&nbsp;
                                            <Typography component="span" variant='subtitle2' color="primary" sx={{ textDecoration: "underline" }} >
                                                Login
                                            </Typography>
                                        </>
                                    ) : (
                                        <>
                                            Need an account?&nbsp;
                                            <Typography component="span" variant='subtitle2' color="primary" sx={{ textDecoration: "underline" }} >
                                                Sign up
                                            </Typography>
                                        </>
                                    )}
                                </Button>

                            </Grid>
                        </Container>





                    </Box>



                    {/* Extra Details */}
                    <Box mt={2} sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '0.85rem',
                                display: 'block',
                                mb: 1,
                            }}
                        >
                            Trouble logging in?
                        </Typography>
                        <Typography
                            variant="caption"
                            component="a"
                            href="#contact-support"
                            sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            Contact our support team
                        </Typography>
                    </Box>

                    {/* Decorative Divider */}
                    <Box
                        sx={{
                            width: '50%',
                            height: '2px',
                            backgroundColor: 'primary.main',
                            mx: 'auto',
                            mt: 5,
                        }}
                    />
                    {/* </CardContent> */}
                </Grid>



                {/* Snackbar to display messages */}
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={6000}
                    onClose={() => setOpenSnackbar(false)}
                    anchorOrigin={{
                        vertical: 'top', // Position the Snackbar at the top
                        horizontal: 'right', // Position the Snackbar at the right
                    }}
                >
                    <Alert
                        onClose={() => setOpenSnackbar(false)}
                        severity={snackbarSeverity}
                        sx={{ width: '100%' }}
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

            </Grid>

            <FooterComponent />

        </Box>
    );
};

export default VendorLogin;
