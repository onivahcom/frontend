import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, Grid, useMediaQuery, Badge, ListItem, ListItemAvatar, Avatar, Drawer, List, ListItemText, } from '@mui/material';

import { IconButton, Stack, Dialog, DialogTitle, DialogContent, useScrollTrigger, Slide } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon

import Settings from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import HomeIcon from '@mui/icons-material/Home'; // Using a home icon for Home
import InfoIcon from '@mui/icons-material/Info'; // Using an info icon for About
import ArticleIcon from '@mui/icons-material/Article'; // Using an article icon for Blogs
import ContactMailIcon from '@mui/icons-material/ContactMail';
import { FavoriteBorderOutlined, Phone, SupportAgentTwoTone, Visibility, Delete, ShoppingBag, FavoriteSharp, Apps, Widgets } from '@mui/icons-material';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useFavorites } from '../Favourites/FavoritesContext';
import Close from '@mui/icons-material/Close';
import withLoadingAndError from '../hoc/withLoadingAndError';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Event, AccountCircle } from '@mui/icons-material'; // You can add more icons as needed
import Home from '@mui/icons-material/Home';
import GoogleLogin from '../components/GoogleLogin/GoogleLogin';


const services = [
    { text: "Venues", link: "/" },
    { text: "Photography", link: "/about" },
    { text: "Catering", link: "/blogs" },
    { text: "Decors", link: "/contact" },
    { text: "Makeup Artist", link: "/contact" },
    { text: "Wedding Attire", link: "/contact" },
    { text: "Jewelry", link: "/contact" },
    { text: "Personal Care", link: "/contact" },
    { text: "Mehandi", link: "/contact" },
    { text: "Garlands", link: "/contact" },
    { text: "Customized Gifts", link: "/contact" },
    { text: "Wedding Cakes", link: "/contact" },
    { text: "Music / DJ", link: "/contact" },
];

function HideOnScroll({ children }) {
    const trigger = useScrollTrigger({ threshold: 0 }); // More responsive to slight scrolls
    return (
        <Slide appear={false} direction="down" in={!trigger}>
            {children}
        </Slide>
    );
}

function HideOnScrollBottomNav({ children }) {
    const trigger = useScrollTrigger({ threshold: 0 }); // More responsive to slight scrolls
    return (
        <Slide appear={false} direction="up" in={!trigger}>
            {children}
        </Slide>
    );
}






const UserLogin = ({ loading, setLoading, error, setError, buttonAction }) => {



    const isMobile = useMediaQuery('(max-width:600px)'); // Adjust the breakpoint as needed

    const token = localStorage.getItem('onivah_token'); // Check for token in local storage

    const location = useLocation();
    const navigate = useNavigate();

    const [loginType, setLoginType] = useState('email'); // 'phone' or 'email'
    const [loginOpen, setLoginOpen] = useState(true);
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginInput, setLoginInput] = useState(''); // Store phone or email input
    const [showOTPField, setShowOTPField] = useState(false); // Display OTP field after request
    const [otp, setOtp] = useState('');

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // 'success', 'error', 'warning', 'info'

    const handleMenuItemClick = (text) => {
        switch (text) {
            case 'Log In':
                setLoginOpen(true)
                console.log('Log In clicked');
                break;
            case 'Sign Up':
                setSignupOpen(true)
                console.log('Sign Up clicked');
                break;
            case 'Become a Vendor':
                window.location.href = "/vendor-login";
                break;
            case 'Help center':
                console.log('Help center clicked');
                break;
            case 'Profile':
                navigate("/profile")
                break;
            case 'Log Out':
                localStorage.removeItem("onivah_token");
                navigate("/")
                break;
            case 'Home':
                window.location.href = "/";
                break;
            case 'About':
                window.location.href = "/about";
                break;
            case 'Contact':
                window.location.href = "/contact";
                break;
            case 'Blogs':
                window.location.href = "/blogs";
                break;
            default:
                console.log('Unknown action');
        }
    };

    const toggleLoginType = () => {
        setLoginType(prevType => (prevType === 'phone' ? 'email' : 'phone'));
        setLoginInput('');
        setShowOTPField(false);
    };

    // phone handler
    const handlePhoneChange = (value, country) => {
        console.log(value);

        // setFormData({
        //     ...formData,
        //     phone: value, // Store only the phone number
        //     dialCode: country.dialCode,
        // });
        setLoginInput(value) // Handle phone input


    };

    // Handle OTP request
    const handleSendOtp = async () => {
        setLoading(true)
        if (loginInput.trim() === "") {
            return alert(`Please fill the ${loginType} field !`)
        }

        try {
            const response = await backendApi.post(`/${loginOpen ? "login" : "signup"}/send-otp`, {
                [loginType === 'phone' ? 'phone' : 'email']: loginInput,
                userType: loginType // Send userType as 'phone' or 'email'
            });
            if (response.data.success) {
                setLoading(false)
                setShowOTPField(true); // Display OTP field if request is successful
                setSnackbarSeverity('success');
                setSnackbarMessage(response.data.message);
                setSnackbarOpen(true);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            setLoading(false)
            alert(error.response.data.message);
            console.log('Error sending OTP:', error);
        }
    };

    // Handle OTP verification
    const handleVerifyOtp = async () => {
        setLoading(true)
        try {
            const response = await backendApi.post(`/login/verify-otp`, {
                loginInput, otp, signUp: !loginOpen,
            }, { withCredentials: true });
            if (response.data.success) {
                const token = response.data.token;

                setSnackbarSeverity('success');
                setSnackbarMessage('Verification successful!');
                setSnackbarOpen(true);

                // Close the appropriate modal based on the flow
                if (loginOpen) {
                    setLoginOpen(false);
                } else {
                    setSignupOpen(false);
                }
                setLoading(false)
                localStorage.setItem("onivah_token", token);

                const pathSegments = window.location.pathname.split('/');

                if (pathSegments[1] === "checkout") {
                    window.location.reload();
                }


                setLoginOpen(false)
            } else {
                setLoading(false)
                setSnackbarSeverity('error');
                setSnackbarMessage(response.data.message || 'Invalid OTP');
                setSnackbarOpen(true);
            }
        } catch (error) {
            setLoading(false)
            console.error('Error verifying OTP:', error);
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('An error occurred while verifying the OTP. Please try again.');
        }
    };


    const [openMenu, setOpenMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false); // State to track scroll
    const menuRef = useRef(null); // Create a ref for the dropdown menu

    const handleToggleMenu = () => {
        setOpenMenu((prev) => !prev); // Toggle the menu open state
    };

    // Close the menu if clicked outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenu(false);
            }
        };

        // Attach event listener for clicks outside
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // Clean up the event listener on component unmount
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Track scrolling to change AppBar color
    useEffect(() => {
        const handleScroll = () => {
            requestAnimationFrame(() => {
                setScrolled(window.scrollY > 70);
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);




    return (
        <Box sx={{ display: buttonAction ? 'block' : "none" }}>



            <Grid container spacing={2}>


                {/* Right Side Content */}
                <Grid item xs={12} md={12} sx={{ m: 2 }}>
                    <Box sx={{ p: 2 }}>
                        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                            {loginOpen ? "Log In" : "Sign Up"}
                            <IconButton
                                edge="end"
                                color="inherit"
                                size='small'
                                onClick={() => {
                                    setLoginOpen(false);
                                    setSignupOpen(false);
                                }} // Close the dialog when clicked
                                aria-label="close"
                                sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 20,
                                    backgroundColor: "lightgray",
                                    '&:hover': {
                                        backgroundColor: "#cccc"
                                    }
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>

                        {loginType === 'phone' ? (
                            <Grid item xs={12} sm={12}>
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

                        <Typography variant='subtitle2' color='text.secondary' sx={{ p: 1 }}> We will send you a verification code.</Typography>
                        {!showOTPField ? (
                            <Button
                                variant="contained"
                                fullWidth
                                disabled={loading}
                                sx={{ color: 'white', p: 1, fontSize: "1rem" }}
                                onClick={handleSendOtp}
                            >
                                {loading ? 'Sending OTP' : 'Continue'}
                            </Button>
                        ) : (
                            <Box>
                                <TextField
                                    label="Enter OTP"
                                    variant="outlined"
                                    fullWidth
                                    disabled={loading}
                                    margin="normal"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{ color: 'white', p: 1, fontSize: "1rem", mb: 1 }}
                                    onClick={handleVerifyOtp}
                                >
                                    {loading ? 'Verifying OTP' : 'Verify OTP'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    disabled={loading}
                                    sx={{ p: 1, fontSize: "1rem" }}
                                    onClick={handleSendOtp}
                                >
                                    {loading ? 'Resending OTP' : 'Resend OTP'}
                                </Button>
                            </Box>
                        )}

                        <Typography sx={{ textAlign: "center", marginTop: 2 }}> OR</Typography>

                        <Grid container spacing={2} sx={{ marginTop: 1 }}>

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

                        </Grid>
                    </Box>
                    <Stack direction='row' sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography>
                            {loginOpen ? "Don't have an account?" : "Already have an account?"}
                        </Typography>
                        <Button
                            onClick={() => {
                                setLoginOpen(!loginOpen);
                                setSignupOpen(!signupOpen);
                            }}
                        >
                            {loginOpen ? "Sign Up" : "Login"}
                        </Button>
                    </Stack>

                </Grid>


            </Grid>


            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </Box >
    )
}

export default withLoadingAndError(UserLogin);