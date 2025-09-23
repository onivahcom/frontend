import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, TextField, Grid, useMediaQuery, Badge, ListItem, ListItemAvatar, Avatar, Drawer, List, ListItemText, Divider, Paper, Card, } from '@mui/material';

import { IconButton, Stack, Dialog, DialogTitle, DialogContent, useScrollTrigger, Slide } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Tooltip from '@mui/material/Tooltip';
import EmailIcon from '@mui/icons-material/Email';
import { apiUrl, backendApi } from '../Api/Api';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import GoogleLogin from './GoogleLogin/GoogleLogin';
import CloseIcon from '@mui/icons-material/Close'; // Import Close icon
import Settings from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutOutlined from '@mui/icons-material/LogoutOutlined';
import HomeIcon from '@mui/icons-material/Home'; // Using a home icon for Home
import InfoIcon from '@mui/icons-material/Info'; // Using an info icon for About
import ArticleIcon from '@mui/icons-material/Article'; // Using an article icon for Blogs
import ContactMailIcon from '@mui/icons-material/ContactMail';
import SearchPopup from './SearchPopup';
import { FavoriteBorderOutlined, Phone, SupportAgentTwoTone, Visibility, Delete, ShoppingBag, FavoriteSharp, Apps, Widgets, ChatBubbleOutline, ArrowForward } from '@mui/icons-material';

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useFavorites } from '../Favourites/FavoritesContext';
import Close from '@mui/icons-material/Close';
import ListingServiceCount from './ListingServiceCount';
import withLoadingAndError from '../hoc/withLoadingAndError';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Event, AccountCircle } from '@mui/icons-material'; // You can add more icons as needed
import Home from '@mui/icons-material/Home';
import { useUser } from '../context/UserContext';
import MenuServiceDropdown from './MenuServiceDropdown';
import RatingbasedSearch from './RatingbasedSearch';
import Edit from '@mui/icons-material/Edit';

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

        <Slide appear={false} direction="up" in={trigger}>
            {children}
        </Slide>
    );
}


const Header = ({ loading, setLoading, error, setError }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const isMobile = useMediaQuery('(max-width:600px)'); // Adjust the breakpoint as needed
    const { favorites, toggleFavorite } = useFavorites(); // Get global favorites
    const { setUser } = useUser();
    const [token, setToken] = useState(false);
    const [userData, setUserData] = useState(null);




    const [drawerOpen, setDrawerOpen] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [serachBoxOpen, setSearchBoxOpen] = useState(false);
    const open = Boolean(anchorEl);

    useEffect(() => {
        const fetchProtectedData = async () => {

            let refreshInProgress = false;

            try {
                const response = await backendApi.get(`/protected-route`, {
                    withCredentials: true,
                });
                setToken(true)
                setUserData(response.data.user);
                setUser(response.data.user);
            } catch (error) {
                setToken(false)
                if (error.response?.status === 403) {

                    try {
                        const refreshRes = await backendApi.get(`/refreshToken/refresh`, {
                            withCredentials: true,
                        });
                        const retryRes = await backendApi.get(`/protected-route`, {
                            withCredentials: true,
                        });
                        setUserData(retryRes.data.user);
                        setUser(retryRes.data.user)
                        return;
                    } catch (refreshError) {
                        return;
                    }
                }

            } finally {
                setLoading(false);
            }
        };

        fetchProtectedData();
    }, [navigate]);


    const handleSearchBox = () => {
        setSearchBoxOpen(true);
    };

    const handleCloseSearchBox = () => {
        setSearchBoxOpen(false);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setOpenMenu(false)
    };

    const [loginType, setLoginType] = useState('email');
    const [loginOpen, setLoginOpen] = useState(false);
    const [signupOpen, setSignupOpen] = useState(false);
    const [loginInput, setLoginInput] = useState('');
    const [showOTPField, setShowOTPField] = useState(false);
    const [otp, setOtp] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const menuActions = {
        'Home': () => navigate("/"),
        'About': () => navigate("/about"),
        'Contact': () => navigate("/contact"),
        'Blogs': () => navigate("/blogs"),
        'Profile': () => navigate("/profile"),
        'Become a Vendor': () => navigate("/become-a-vendor"),

        'Log In': () => setLoginOpen(true),
        'Sign Up': () => setSignupOpen(true),
        'Help center': () => console.log('Help center clicked'),
        'Messages': () => window.open("/messages", "_blank"),

        'Log Out': async () => {
            try {
                await backendApi.post(`/refreshToken/logout-all`, {}, { withCredentials: true });
            } catch (err) {
                console.warn("⚠️ Logout failed:", err.response?.data || err.message);
            } finally {
                window.location.reload();
            }
            navigate("/");
        }
    };

    const handleMenuItemClick = (text) => {
        const action = menuActions[text];
        if (typeof action === "function") action();
        else console.log('Unknown action');
    };

    const toggleLoginType = () => {
        setLoginType(prevType => (prevType === 'phone' ? 'email' : 'phone'));
        setLoginInput('');
        setShowOTPField(false);
    };

    // phone handler
    const handlePhoneChange = (value, country) => {

        const formattedPhone = `+${value.replace(/^(\+)?/, '')}`; // Add '+' if not already there
        // setFormData({
        //     ...formData,
        //     phone: value, // Store only the phone number
        //     dialCode: country.dialCode,
        // });
        setLoginInput(formattedPhone) // Handle phone input
    };

    // Handle OTP request
    const handleSendOtp = async () => {
        if (loginInput.trim() === "") {
            setSnackbarOpen(true)
            setSnackbarSeverity("error");
            setSnackbarMessage(`Please fill the ${loginType} field`);
            return
        }
        setLoading(true)

        try {
            const response = await backendApi.post(`/${loginOpen ? "login" : "signup"}/send-otp`, {
                [loginType === 'phone' ? 'phone' : 'email']: loginInput,
                userType: loginType // Send userType as 'phone' or 'email'
            });
            if (response.data.success) {
                setLoading(false)
                setShowOTPField(true);
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
                setLoginOpen(false)
            } else {
                setLoading(false)
                setSnackbarSeverity('error');
                setSnackbarMessage(response.data.message || 'Invalid OTP');
                setSnackbarOpen(true);
            }

            window.location.reload();
        } catch (error) {
            setLoading(false)
            console.log('Error verifying OTP:', error);
            setSnackbarOpen(true);
            setSnackbarSeverity('error');
            setSnackbarMessage('An error occurred while verifying the OTP. Please try again.');
        }
    };

    const menuItems = [
        { text: 'Home', icon: <HomeIcon fontSize="small" color='white' />, visible: isMobile },
        { text: 'About', icon: <InfoIcon fontSize="small" color='white' />, visible: isMobile },
        { text: 'Testimonials', icon: <ArticleIcon fontSize="small" color='white' />, visible: isMobile },
        // { text: 'Blogs', icon: <ArticleIcon fontSize="small" color='white' />, visible: isMobile },
        { text: 'Contact', icon: <ContactMailIcon fontSize="small" color='white' />, visible: isMobile },
        { text: 'Log In', icon: null, visible: !token },
        { text: 'Sign Up', icon: null, visible: !token },
        { text: 'Profile', icon: <AccountCircleIcon fontSize="small" color='white' />, visible: !!token },
        { text: 'Messages', icon: <ChatBubbleOutline fontSize="small" color='white' />, visible: !!token },
        { text: 'Become a Vendor', icon: <Settings fontSize="small" color='white' />, visible: true },
        { text: 'Help Center', icon: <SupportAgentTwoTone fontSize="small" color='white' />, visible: true },
        { text: 'Log Out', icon: <LogoutOutlined fontSize='small' color='white' />, visible: !!token },
    ];

    const bottomNav = [
        {
            label: 'Favorites',
            icon: <FavoriteSharp fontSize='small' />,
            onClick: () => setDrawerOpen(!drawerOpen),
        },
        {
            label: 'Home',
            icon: <Home fontSize='small' />,
            onClick: () => navigate('/'),
        },
        {
            label: 'Search',
            icon: <Widgets fontSize='small' />,
            onClick: () => setSearchBoxOpen(!serachBoxOpen),
        },
        {
            label: token ? 'Profile' : 'Log In',
            icon: <AccountCircle fontSize='small' />,
            onClick: () => {
                token ? navigate('/profile') : setLoginOpen(!loginOpen);
            },
        },
    ];

    const [openMenu, setOpenMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const menuRef = useRef(null);

    const handleToggleMenu = () => {
        setOpenMenu((prev) => !prev);
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

    // set value index to null for bottom nav
    useEffect(() => {
        const handleClickOutside = () => setValue(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
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


    // Handler for changing the selected menu
    const [value, setValue] = useState(null);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleNavigate = (category, productId) => {
        navigate(`/category/${category}/${productId}`);
    };

    const handleViewAll = () => {
        navigate(`/favorites`);
    };


    return (
        <Box >
            {/* App Bar */}

            <HideOnScroll>
                <AppBar
                    position='fixed' //fixed'
                    elevation={0}
                    sx={{
                        zIndex: 999,
                        // top: scrolled || location.pathname !== '/' || location.search ? 0 : 0,
                        backgroundColor: scrolled || location.pathname !== '/' || location.search ? 'white' : 'rgba(255, 255, 255, 0)',
                        backdropFilter: scrolled || location.pathname !== '/' || location.search ? 'blur(90px)' : 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                        borderBottomRightRadius: scrolled || location.search ? 3 : 0,
                        borderBottomLeftRadius: scrolled || location.search ? 3 : 0,
                        transition: 'transform 0.3s ease',
                    }}

                >
                    <Toolbar sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", }}>

                        {/* logo svg */}
                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                            <svg width="160" height="60" viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg" fill="none">
                                <circle cx="60" cy="55" r="25" stroke="#6D4D94" strokeWidth="3" fill="none" />

                                <circle cx="95" cy="45" r="25" stroke="#e4c6ff" strokeWidth="3" fill="none" />

                                <polygon points="95,12 90,22 95,27 100,22" fill="#EFB7B7" stroke="#EFB7B7" strokeWidth="1" />
                                <line x1="95" y1="12" x2="95" y2="27" stroke="#fff" strokeWidth="0.6" />
                                <line x1="90" y1="22" x2="100" y2="22" stroke="#fff" strokeWidth="0.6" />

                                <text x="135" y="60" fontFamily="'Playfair Display', serif" fontSize="26" fontWeight={600} fill="#6D4D94" letterSpacing="1">
                                    Onivah
                                </text>
                            </svg>
                        </Box>

                        {/* mobile menu */}
                        <Box>
                            {
                                !isMobile && (
                                    <Stack direction="row" spacing={2} sx={{ flexGrow: 1 }}>
                                        {[
                                            { text: 'Home', link: '/' },
                                            { text: 'About', link: '/about' },
                                            // { text: 'Testimonials', link: '/testimonials' },
                                            // { text: 'Blogs', link: '/blogs' },
                                            { text: 'Contact', link: '/contact' },
                                        ].map(({ text, link }) => (
                                            <Button
                                                size="small"
                                                key={link}
                                                component={Link}
                                                to={link}
                                                sx={{
                                                    position: "relative",
                                                    textTransform: "none",
                                                    fontSize: "0.875rem",
                                                    color: "grey",
                                                    "&::after": {
                                                        content: '""',
                                                        position: "absolute",
                                                        left: 0,
                                                        bottom: 0,
                                                        width: 0,
                                                        height: "2px",
                                                        backgroundColor: "primary.main",
                                                        transition: "width 0.3s ease",
                                                    },
                                                    "&:hover": {
                                                        color: "black",
                                                    },
                                                    "&:hover::after": {
                                                        width: "100%",
                                                    },
                                                }}
                                            >
                                                {text}
                                            </Button>

                                        ))}
                                        <MenuServiceDropdown />

                                        {/* <div className="dropdown">
                                            <button className="dropdown-button" style={{
                                                color: "grey",
                                            }}>Services ▾</button>
                                            <Box className="dropdown-content" sx={{
                                                px: { xs: 1, sm: 3 },
                                                py: 3,
                                                bgcolor: '#f3eaff',
                                                borderRadius: 2,
                                                maxWidth: 1000,
                                                mx: 'auto',
                                                maxHeight: "auto",
                                                overflow: "auto",
                                                zIndex: 999999,
                                            }}>

                                                <Grid container spacing={3}>
                                                    {services.map((service, index) => (
                                                        <Grid item xs={6} sm={6} md={3} key={index}>
                                                            <Paper
                                                                elevation={5}
                                                                sx={{
                                                                    height: 80,
                                                                    cursor: "pointer",
                                                                    mb: 2,
                                                                    borderRadius: 3,
                                                                    bgcolor: '#1E1E2F',
                                                                    color: '#fff',
                                                                    transition: 'transform 0.2s ease-in-out',
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    '&:hover': {
                                                                        transform: 'scale(1.04)',
                                                                        boxShadow: 12,
                                                                    },
                                                                }}
                                                            >
                                                                <Box
                                                                    sx={{
                                                                        width: '30%',
                                                                        height: '100%',
                                                                        borderTopRightRadius: '50%',
                                                                        borderBottomRightRadius: '50%',
                                                                        overflow: 'hidden',
                                                                        mr: 2,
                                                                        boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={service.image}
                                                                        alt={service.name}
                                                                        style={{
                                                                            width: '100%',
                                                                            height: '100%',
                                                                            objectFit: 'cover',
                                                                        }}
                                                                    />
                                                                </Box>

                                                                <Typography variant="subtitle2" sx={{ color: "white" }}>
                                                                    {service.text}
                                                                </Typography>
                                                            </Paper>
                                                        </Grid>
                                                    ))}
                                                </Grid>

                                            </Box>
                                        </div> */}
                                    </Stack>
                                )
                            }

                        </Box>

                        {/* search pop ups #007BFF */}
                        <Dialog
                            open={serachBoxOpen}
                            onClose={handleCloseSearchBox}
                            maxWidth="md"
                            fullWidth
                            sx={{
                                '& .MuiDialog-paper': {
                                    borderRadius: 3,
                                    boxShadow: 6,
                                }
                            }}
                        >

                            <DialogContent
                                sx={{
                                    overflowY: "auto",
                                    maxHeight: "70vh",
                                    p: { xs: 0, md: 1 },
                                }}
                            >
                                <Grid
                                    container
                                    alignItems="center"
                                    direction={{ xs: "column", md: "row" }}
                                >
                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        sx={{
                                            textAlign: "center",
                                            order: { xs: 2, md: 1 },
                                            p: 2
                                        }}
                                    >
                                        <img
                                            src="https://cdn.pixabay.com/photo/2017/12/13/13/49/wedding-3016803_1280.jpg"
                                            alt="Popup Illustration"
                                            style={{
                                                width: "100%",
                                                // maxWidth: "300px",
                                                // height: '100%',
                                                borderRadius: "8px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Grid>

                                    <Grid
                                        item
                                        xs={12}
                                        md={6}
                                        sx={{
                                            width: "100%",
                                            m: 0,
                                            p: 2,
                                            order: { xs: 1, md: 2 },
                                        }}
                                    >
                                        <Typography
                                            variant='h6'
                                            sx={{
                                                width: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                mb: 2,
                                                fontWeight: 500,
                                                textTransform: 'none',
                                                background: 'linear-gradient(90deg, #7e57c2, #6a1b9a, #512da8)', // dark lavender tones
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    opacity: 0.9,
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                        >
                                            Explore
                                            <IconButton size='small' onClick={handleCloseSearchBox} sx={{ color: "grey.600" }}>
                                                <CloseIcon sx={{ fontSize: 16 }} />
                                            </IconButton>
                                        </Typography>
                                        <SearchPopup oncloseSearchPop={handleCloseSearchBox} />
                                    </Grid>
                                </Grid>

                            </DialogContent>

                        </Dialog>

                        {/* header right menu */}
                        <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>

                            {/* search */}

                            {/* on use of this lists the total numbers of services in the category */}
                            <RatingbasedSearch />

                            {/* <ListingServiceCount color={scrolled || location.pathname !== '/' || location.search ? 'black' : "black"} /> */}

                            {/* explore */}
                            <Typography
                                onClick={handleSearchBox}
                                sx={{
                                    display: { xs: 'none', md: 'block' },
                                    ml: 2,
                                    mr: 2,
                                    cursor: 'pointer',
                                    fontWeight: 600,
                                    fontSize: '1rem',
                                    textTransform: 'none',
                                    background: 'linear-gradient(90deg, #7e57c2, #6a1b9a, #512da8)', // dark lavender tones
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        opacity: 0.9,
                                        textDecoration: 'underline',
                                    },
                                }}
                            >
                                Explore
                            </Typography>

                            {/* Favorites Button with Count */}
                            <IconButton sx={{
                                marginRight: isMobile ? 0 : 0,
                            }} onClick={() => setDrawerOpen(!drawerOpen)} color="inherit">
                                <Badge badgeContent={favorites.length} color="error">
                                    <FavoriteBorderOutlined sx={{
                                        color: "grey",
                                    }} />
                                </Badge>
                            </IconButton>

                            {/* menu */}
                            <IconButton onClick={handleToggleMenu} size="small" sx={{ color: 'white' }}>
                                {openMenu ? (
                                    <CloseIcon
                                        sx={{
                                            color: 'black',
                                        }}
                                    />
                                ) : userData?.profilePic ? (
                                    <Avatar
                                        src={userData.profilePic}
                                        alt="Profile"
                                        sx={{
                                            width: 32,
                                            height: 32,
                                            borderColor: scrolled || location.pathname !== '/' || location.search ? 'white' : 'black',
                                        }}
                                    />
                                ) : (
                                    <MenuIcon
                                        sx={{
                                            color: "black"
                                            //  scrolled || location.pathname !== '/' || location.search ? 'white' : 'black',
                                        }}
                                    />
                                )}
                            </IconButton>


                        </Box>
                    </Toolbar>
                </AppBar>
            </HideOnScroll >

            {/* Dropdown Menu */}
            < Box
                ref={menuRef}
                sx={{
                    height: isMobile ? '100%' : 'auto',
                    position: 'fixed',
                    top: isMobile ? '0px' : '67px',
                    right: isMobile ? '0%' : '1%',
                    width: isMobile ? '100%' : '250px',
                    borderRadius: isMobile ? 0 : 3,
                    backgroundColor: '#ffff',
                    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
                    zIndex: 9999,
                    transition: 'opacity 0.3s ease, transform 0.3s ease',
                    transform: openMenu ? 'translateX(0)' : 'translateX(-20px)',
                    opacity: openMenu ? 1 : 0,
                    visibility: openMenu ? 'visible' : 'hidden',
                    transformOrigin: 'top center',
                    overflow: 'hidden',
                    padding: openMenu ? 0 : 0,
                }}
            >
                <Stack
                    direction="column" sx={{
                        display: openMenu ? 'block' : 'none',
                    }}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', padding: '8px', mb: isMobile ? 3 : '0px', }}>
                        {/* Logo on the left */}
                        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: "space-between" }}>
                            <svg role='link' href='/' width="180" height="40" viewBox="0 0 220 60" xmlns="http://www.w3.org/2000/svg" fill="none">
                                <g transform="translate(10,10)">
                                    <circle cx="14" cy="20" r="10" stroke="#EFB7B7" strokeWidth="2.5" fill="none" />

                                    <circle cx="24" cy="15" r="10" stroke="#EFB7B7" strokeWidth="2.5" fill="none" />

                                    <polygon points="24,4 22,8 24,10 26,8" fill="#EFB7B7" />
                                </g>
                                <text x="60" y="38" fontFamily="'Playfair Display', serif" fontSize="30" fill="#3E3E3E" letterSpacing="1">
                                    Onivah
                                </text>
                            </svg>
                        </Box>

                        {/* Close icon on the right */}
                        <IconButton size='small' sx={{ display: { xs: 'flex', md: 'none' }, bgcolor: "#f8f8f8", mr: 1 }} onClick={() => setOpenMenu(false)}>
                            <CloseIcon sx={{ color: 'grey' }} />
                        </IconButton>
                    </Stack>

                    <Card sx={{ display: userData && isMobile ? "flex" : "none", alignItems: "center", p: 2, borderRadius: 3, boxShadow: 2 }}>

                        {/* Left: Profile Image */}
                        <Avatar
                            src={userData?.profilePic}
                            alt={userData?.firstname}
                            sx={{ width: 64, height: 64, mr: 2 }}
                        />

                        {/* Middle: Name & Description */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="body1" fontWeight={600}>
                                {userData?.firstname}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                My Account
                            </Typography>
                        </Box>

                        {/* Right: Edit Icon */}
                        <IconButton color="primary" role={NavLink} href='/profile'>
                            <Edit />
                        </IconButton>

                    </Card>

                    {menuItems.filter(item => item.visible).map((item, index) => (
                        <MenuItem
                            key={index}
                            onClick={() => { handleMenuItemClick(item.text); handleClose(); }}
                            sx={{
                                color: isMobile ? 'black' : "grey",
                                fontWeight: 600,
                                justifyContent: 'space-between',
                                alignItems: { xs: 'none', md: "center" },
                                mb: { xs: 1, md: 0 },
                                bgcolor: isMobile ? '#f8f8f8' : "none",
                                borderBottom: isMobile ? '1px solid #f8f8f8' : "none",
                                '& .menu-icon': { color: 'grey' },
                                '&:hover': {
                                    borderRadius: 0,
                                    backgroundColor: '#f2f2f2',
                                    color: 'black',
                                    '& .menu-icon': { color: 'black' } //  change icon color on hover
                                }
                            }}

                        >
                            <Typography variant="subtitle2" gutterBottom sx={{
                                // color: "white",
                                py: isMobile ? 1 : 0,
                                ml: isMobile ? 2 : 0,
                                //  borderBottom: "1px solid grey",
                            }}>
                                {item.text}
                            </Typography>
                            {item.icon && (
                                <ListItemIcon className="menu-icon" sx={{ justifySelf: 'flex-end', color: "white" }}>
                                    {item.icon}
                                </ListItemIcon>
                            )}
                        </MenuItem>

                    ))}
                </Stack>
            </Box >

            {/* login dialog */}
            < Dialog open={loginOpen || signupOpen}
                onClose={() => {
                    setLoginOpen(false);
                    setSignupOpen(false);
                }}
                maxWidth={false} >
                <DialogContent sx={{ padding: 0, maxWidth: 900, bgcolor: "#ffff", }} fullWidth>

                    <Grid container spacing={2}>

                        {/* Left Side Image */}

                        <Grid
                            item
                            xs={6}
                            sm
                            sx={{
                                display: { xs: 'none', md: 'block' },
                                justifyContent: 'center',
                                alignItems: 'center',
                                m: 2
                            }}
                        >
                            <img
                                src="https://cdn.pixabay.com/photo/2017/12/03/19/08/wedding-2995641_1280.jpg"
                                alt="Login Illustration"
                                style={{ maxWidth: '100%', height: 450, borderRadius: '8px' }}
                            />
                        </Grid>

                        {/* Right Side Content */}
                        <Grid item xs={12} md={6} sx={{ p: 2 }}>
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
                                        }}
                                        aria-label="close"
                                        sx={{
                                            position: 'absolute',
                                            top: 8,
                                            right: 20,
                                            backgroundColor: "#ddd",
                                            '&:hover': {
                                                backgroundColor: "#cccc"
                                            }
                                        }}
                                    >
                                        <CloseIcon sx={{ fontSize: 16 }} />
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
                                            inputProps={{
                                                inputMode: 'numeric',  // bring up numeric keypad on mobile
                                                pattern: '[0-9]*',     // optional pattern for browsers
                                                maxLength: 6,          // optional, if OTP has fixed length
                                            }}
                                        />
                                        <Stack direction='row' justifyContent='space-evenly' sx={{ mt: 2 }}>
                                            <Button
                                                size='medium'
                                                variant="contained"
                                                sx={{ color: 'white', minWidth: 120 }}
                                                onClick={handleVerifyOtp}
                                            >
                                                {loading ? 'Verifying' : 'Verify'}
                                            </Button>
                                            <Button
                                                size='medium'
                                                variant="outlined"
                                                disabled={loading}
                                                sx={{ minWidth: 120 }}
                                                onClick={handleSendOtp}
                                            >
                                                {loading ? 'Resending' : 'Resend'}
                                            </Button>
                                        </Stack>
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
                                                backgroundColor: '#c74040',
                                                borderRadius: 2,
                                                padding: '12px 0',
                                                fontSize: '1rem',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    backgroundColor: '#9d3535',
                                                    boxShadow: '0px 10px 20px rgba(158, 49, 49, 0.4)',
                                                    transform: 'translateY(-2px)',
                                                },
                                                '&:active': {
                                                    transform: 'translateY(1px)',
                                                    boxShadow: '0px 6px 12px rgba(158, 49, 49, 0.3)',
                                                },
                                            }}
                                            onClick={toggleLoginType}
                                        >
                                            {`Continue with ${loginType === 'phone' ? 'Email' : 'Phone'}`}
                                        </Button>

                                    </Grid>

                                </Grid>
                            </Box>
                        </Grid>


                    </Grid>
                </DialogContent>
            </Dialog >

            {/* Slide-in Drawer for Favorites */}
            < Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    "& .MuiDrawer-paper": {
                        width: { xs: "100vw", md: "50vw" }, // Half-screen width
                        maxWidth: "400px",
                        backgroundColor: "#f9f9f9", // Soft light background
                        color: "#333",
                        padding: "20px",
                    }
                }}
            >
                {/* Top Header with Close Icon */}
                < Box display="flex" alignItems="center" justifyContent="space-between" mb={2} sx={{ position: "relative" }} >
                    <Typography variant="body2" color='inherit' fontWeight={500}>
                        Favorites ({favorites.length})
                    </Typography>
                    <IconButton onClick={() => setDrawerOpen(false)}>
                        <Close />
                    </IconButton>
                </Box >
                <Typography
                    variant="caption"
                    color='grey'
                    sx={{ mb: 2, textAlign: "left", }} // Blue highlight
                >
                    Add items to your wishlist now so you don't forget to add to cart later
                </Typography>

                <List>
                    {favorites.length > 0 ? (
                        favorites.map((service) => (
                            <ListItem
                                key={service._id}
                                sx={{
                                    cursor: "pointer",
                                    background: "#ffffff", // White card background
                                    padding: "12px",
                                    marginBottom: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    boxShadow: 0,
                                    borderBottom: '1px solid #dddd',
                                    transition: "0.3s",
                                    "&:hover": { boxShadow: "0px 6px 12px rgba(0,0,0,0.15)" }
                                }}
                            >
                                {/* Service Image */}
                                {service.images && (
                                    <img
                                        src={service.images.CoverImage?.[0]}
                                        alt={service.businessName}
                                        width={60} height={60}
                                        style={{
                                            borderRadius: "8px",
                                            marginRight: "15px",
                                            objectFit: "cover",
                                        }}
                                    />
                                )}

                                {/* Service Details */}
                                <ListItemText
                                    onClick={() => handleNavigate(service.category, service._id)}
                                    sx={{ flexGrow: 1, }}
                                    primary={
                                        <Typography variant='body2' color='inherit' sx={{
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 1, // You can change this to 2, 3, 4 as needed
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}> {/* Deep Blue */}
                                            {service.businessName}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="grey">
                                            {service.category
                                                ?.replace(/_/g, " ") // Remove underscores
                                                .split(" ") // Split into words
                                                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Convert to Pascal Case
                                                .join(" ")}
                                        </Typography>
                                    }

                                />

                                {/* View & Delete Buttons */}
                                <Stack direction="row" spacing={1} >
                                    <IconButton
                                        onClick={() => navigate(`/category/${service.category}/${service._id}`)}
                                    >
                                        <ShoppingBag color='primary' />
                                    </IconButton>

                                    <IconButton
                                        onClick={() => toggleFavorite(service)}
                                    >
                                        <Delete />
                                    </IconButton>
                                </Stack>

                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ color: "grey", textAlign: "center" }}>No favorites added.</Typography>
                    )}
                </List>

                <Box
                    display="flex"
                    flexDirection='row'
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        width: "90%",
                        p: 2,
                        backgroundColor: "#fff", // optional: contrast background if overlapping content
                    }}
                >
                    {/* Close Button */}
                    <Button
                        size='small'
                        fullWidth
                        variant="outlined"
                        color="primary"
                        sx={{ maxWidth: 100, }}
                        onClick={() => setDrawerOpen(false)}
                    >
                        Close
                    </Button>

                    {/* View All Button */}
                    <Button
                        size='small'
                        fullWidth
                        variant="contained"
                        sx={{ maxWidth: 100, color: "white" }}
                        onClick={() => handleViewAll()}
                    >
                        View All
                    </Button>
                </Box>

            </Drawer >

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={2000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <HideOnScrollBottomNav>
                <BottomNavigation
                    value={value}
                    onChange={handleChange}
                    showLabels
                    sx={{
                        display: { xs: 'flex', md: 'none' },
                        position: 'fixed',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.9)', // semi-transparent white
                        backdropFilter: 'blur(10px)', // adds blur behind the nav
                        color: '#000', // text/icon color

                        p: 1,
                        zIndex: 99999,
                        borderTop: '1px solid #ddd',
                        borderTopRightRadius: 20,
                        borderTopLeftRadius: 20,
                        justifyContent: 'space-evenly',
                        // boxShadow: '0px -2px 15px rgba(0, 0, 0, 0.2)',
                        boxShadow: 0,
                    }}
                >
                    {bottomNav.map((item, index) => (
                        <BottomNavigationAction
                            key={index}
                            label={item.label}
                            icon={item.icon}
                            onClick={(e) => {
                                e.stopPropagation();
                                item.onClick?.();
                                setValue(index);
                            }}
                            sx={{
                                color: '#686868',
                                '&.Mui-selected': {
                                    color: 'darkpurple',
                                },
                                '& .MuiBottomNavigationAction-label': {
                                    fontSize: '0.65rem', // consistent font size
                                    fontWeight: 500,
                                    transition: 'none', // disables animation on selection
                                    '&.Mui-selected': {
                                        fontSize: '0.75rem', // override again for selected
                                        fontWeight: 500,
                                    },
                                },
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                            }}
                        />
                    ))}

                </BottomNavigation>
            </HideOnScrollBottomNav>
        </Box >
    )
}

export default withLoadingAndError(Header);