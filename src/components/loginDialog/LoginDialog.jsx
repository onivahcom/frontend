import React, { useState, useEffect, useRef } from 'react';
import { Typography, Button, Box, TextField, Grid, Stack, CircularProgress, } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import { apiUrl, backendApi } from '../../Api/Api';
import GoogleLogin from '../GoogleLogin/GoogleLogin';
import { Phone } from '@mui/icons-material';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import { Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import withLoadingAndError from '../../hoc/withLoadingAndError';



const LoginDialog = ({ handleLogin, setLoading, setError, loading, error }) => {

    const [urlType, setUrlType] = useState("login")
    const [loginType, setLoginType] = useState('email'); // 'phone' or 'email'
    const [loginInput, setLoginInput] = useState(''); // Store phone or email input
    const [showOTPField, setShowOTPField] = useState(false); // Display OTP field after request
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    const toggleLoginType = () => {
        setLoginType(prevType => (prevType === 'phone' ? 'email' : 'phone'));
        setLoginInput('');
        setShowOTPField(false);
    };

    // phone handler
    const handlePhoneChange = (value, country) => {
        console.log(country.dialCode);

        // setFormData({
        //     ...formData,
        //     phone: value, // Store only the phone number
        //     dialCode: country.dialCode,
        // });
        // setLoginInput(e.target.value) // Handle phone input


    };

    const handleUrlType = () => {
        setShowOTPField(false)
        setPassword("")
        setOtp("")
        setUrlType(prevType => (prevType === "login" ? "signup" : "login"));
    }

    // Handle OTP request
    const handleSendOtp = async () => {
        if (loginInput.trim() === "") {
            setSnackbarMessage(`Please fill the ${loginType} field!`);
            setSnackbarSeverity('warning');
            setOpenSnackbar(true);
            return;
        }
        setLoading(true)
        try {
            setLoginInput('')
            const response = await backendApi.post(`/vendor/${urlType}/send-otp`, {
                [loginType === 'phone' ? 'phone' : 'email']: loginInput,
                userType: loginType, // 'phone' or 'email'
            }, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.data.success) {
                // if (loginType === 'phone') {
                setTimeout(() => {
                    setShowOTPField(true); // Display OTP field if request is successful
                }, 3000);
                // }
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity('success');
            } else {
                setSnackbarMessage(response.data.message);
                setSnackbarSeverity('error');
            }
            setLoading(false)
            setOpenSnackbar(true); // Show the snackbar after setting the message
        } catch (error) {
            if (error.response) {
                setSnackbarMessage(error.response.data.message || 'Failed to send OTP');
                setSnackbarSeverity('error');
            } else if (error.request) {
                setSnackbarMessage('No response from server. Please try again.');
                setSnackbarSeverity('error');
            } else {
                setSnackbarMessage(error.message);
                setSnackbarSeverity('error');
            }
            setOpenSnackbar(true);
            setLoading(false)
        }
    };


    // Handle OTP verification
    const handleVerifyOtp = async () => {
        try {
            const response = await backendApi.post(`/vendor/login/verify-otp`, {
                loginInput, otp
            }, { withCredentials: true });
            if (response.data.success) {
                const token = response.data.token;
                alert('Verification successful!');
                localStorage.setItem("onivah_token", token);
            } else {
                alert('Invalid OTP');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
        }
    };

    const handlePasswordSubmit = async () => {
        if (password.trim() === "") {
            setSnackbarMessage(`Please fill the password field!`);
            setSnackbarSeverity('warning');
            setOpenSnackbar(true);
            return;
        }
        alert('Verification successful!');
        // try {
        //     const response = await backendApi.post(`/vendor/login/password`, {
        //         loginInput, 
        //     });
        //     if (response.data.success) {
        //         const token = response.data.token;
        //         alert('Verification successful!');
        //         localStorage.setItem("onivah_token", token);
        //     } else {
        //         alert('Invalid OTP');
        //     }
        // } catch (error) {
        //     console.error('Error verifying OTP:', error);
        // }
    }



    return (
        <Grid item xs={12} sm={8} md={8} sx={{ m: 2 }}>
            <Box>
                <Typography variant='h6' align='left' textTransform={'capitalize'}>
                    {urlType}
                </Typography>

                {loginType === 'phone' ? (
                    <Grid item xs={12} sm={12} sx={{ mb: 2 }}>
                        <PhoneInput
                            country={'in'} // Default country set to India (IN)
                            // value={formData.phone}  // Bind value to the state
                            onChange={handlePhoneChange}
                            inputStyle={{
                                padding: "auto 300px !important"
                            }}
                            inputMode="numeric"
                            inputProps={{
                                required: true,
                                autoFocus: true
                            }}

                        />

                    </Grid>
                ) : (
                    <Grid item xs={12} sm={12}>
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            name="userEmail"
                            type="email"
                            onChange={(e) => setLoginInput(e.target.value)}  // Handle email input
                        />
                    </Grid>
                )}

                {(urlType === "signup") &&
                    < Typography variant='subtitle2' color='text.secondary' sx={{ p: 1 }}> We will send you a verification  {loginType === 'phone' ? "code to your phone" : "link to your email"}.</Typography>
                }

                {!showOTPField ? (
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{ color: 'white', p: 1, fontSize: '1rem' }}
                        onClick={handleSendOtp}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? (
                            <CircularProgress size={24} sx={{ color: 'white' }} /> // Show spinner when loading
                        ) : (
                            'Continue'
                        )}
                    </Button>



                ) : (
                    <Box>
                        {
                            loginType === "phone" ?
                                <>
                                    <TextField
                                        label="Enter OTP"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        sx={{ p: 1, fontSize: "1rem" }}
                                        onClick={handleSendOtp}
                                    >
                                        Resend OTP
                                    </Button>
                                </>
                                :
                                <>
                                    {/* <TextField
                                        label="Enter Password"
                                        variant="outlined"
                                        fullWidth
                                        margin="normal"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    /> */}
                                </>

                        }

                        <Button
                            variant="contained"
                            fullWidth
                            sx={{ color: 'white', p: 1, fontSize: "1rem", mb: 1 }}
                            onClick={() => (loginType === "phone" ? handleVerifyOtp() : handlePasswordSubmit())}
                        >
                            {loginType === "phone" ? "Verify OTP" : "Submit"}
                        </Button>
                    </Box>
                )}

                <Typography sx={{ textAlign: "center", marginTop: 2 }}> OR</Typography>



                <Grid container spacing={2} sx={{ marginTop: 1 }}>
                    {/* <Grid item xs={12}>
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        startIcon={<FacebookIcon />}
                                        sx={{ backgroundColor: '#3b5998', color: 'white' }}
                                    >
                                        Continue with Facebook
                                    </Button>
                                </Grid> */}
                    <Grid item xs={12}>
                        <GoogleLogin />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            fullWidth
                            startIcon={loginType === 'phone' ? <EmailIcon /> : <Phone />}
                            sx={{
                                backgroundColor: '#c74040', // Google Green
                                color: 'white',
                                borderRadius: 2, // Rounded edges for a modern look
                                padding: '12px 0', // More padding for a larger feel
                                fontSize: '1rem', // Larger text for prominence
                                // boxShadow: '0px 8px 16px rgba(199, 64, 64, 0.3)', // Soft shadow for depth
                                transition: 'all 0.3s ease', // Smooth transition for hover effects
                                '&:hover': {
                                    backgroundColor: '#9d3535', // Darker red on hover
                                    boxShadow: '0px 10px 20px rgba(158, 49, 49, 0.4)', // Enhanced shadow on hover
                                    transform: 'translateY(-2px)', // Slight lift effect
                                },
                                '&:active': {
                                    transform: 'translateY(1px)', // Button presses down slightly on click
                                    boxShadow: '0px 6px 12px rgba(158, 49, 49, 0.3)', // Subtle shadow on click
                                },
                            }}
                            onClick={toggleLoginType}
                        >
                            {`Continue with ${loginType === 'phone' ? 'Email' : 'Phone'}`}
                        </Button>

                    </Grid>

                    <Grid item xs={12} display="flex" justifyContent="center" gap={2}>
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'text.secondary',
                                fontSize: '0.85rem',
                                display: 'block',
                                mb: 1,
                            }}
                        >
                            Don't have an account?
                        </Typography>
                        <Typography
                            variant="body2"
                            component="a"
                            onClick={() => handleUrlType()}
                            sx={{
                                textDecoration: 'none',
                                color: 'primary.main',
                                fontWeight: 'bold',
                                textTransform: "capitalize",
                                cursor: 'pointer',
                                '&:hover': {
                                    textDecoration: 'underline',
                                },
                            }}
                        >
                            {urlType === "login" ? "signup" : "login"}
                        </Typography>
                    </Grid>

                </Grid>
            </Box>

            {/* Snackbar component */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000} // Automatically hide the snackbar after 6 seconds
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position it at the top right
            >
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>


        </Grid >

    )
}

export default withLoadingAndError(LoginDialog);