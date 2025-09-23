import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar,
    MenuItem,
    IconButton,
    useMediaQuery,
    useTheme,
    Drawer,
    AppBar,
    Toolbar,
    IconButton as AppBarIconButton,
    Button,
    Divider,
    Badge,
    Menu,
} from "@mui/material";
import {
    Person,
    Email,
    Notifications,
    Menu as MenuIcon,
    Close as CloseIcon,
    BookOnline,
    Cancel,
    Chat,
} from "@mui/icons-material";
import FooterComponent from "../../components/FooterComponent";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import Logout from "@mui/icons-material/Logout";
import Payment from "@mui/icons-material/Payment";
import Favorite from "@mui/icons-material/Favorite";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../../Api/Api";
import axios from "axios";
import { Country, State, City } from "country-state-city";


const offerImages = [
    {
        src: 'https://cdn.pixabay.com/photo/2019/05/24/18/41/marriage-4226896_640.jpg',
        offer: '50% OFF',
    },
    {
        src: 'https://cdn.pixabay.com/photo/2016/11/14/04/25/happy-valentines-day-1822585_640.jpg',
        offer: 'Buy 1 Get 1 Free',
    },
    {
        src: 'https://cdn.pixabay.com/photo/2018/01/22/13/07/valentines-day-background-3098951_640.jpg',
        offer: 'Mega Sale - Today Only!',
    },
];

const ProfileLayout = ({ userData }) => {

    const theme = useTheme();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const isSmallScreen = useMediaQuery(theme.breakpoints.down("lg"));
    const [drawerOpen, setDrawerOpen] = useState(false);


    const [activeItem, setActiveItem] = useState("");
    const location = useLocation(); // gives current URL info

    // useEffect(() => {
    //     // get the hash without the '#' symbol
    //     const hash = location.hash ? location.hash.substring(1) : "personal-info";
    //     setActiveItem(hash);
    // }, [location.hash]);

    const [anchorEl, setAnchorEl] = useState(null);


    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [incompleteFields, setIncompleteFields] = useState([]);

    const [profileDetails, setProfileDetails] = useState({
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        zipcode: userData.zipcode,
        userId: userData._id,
        profilePic: userData.profilePic || "https://placehold.co/100x100"

    });

    useEffect(() => {
        if (!userData) return;

        // Incomplete fields check
        const fields = [];
        if (!userData.firstname) fields.push("First Name");
        if (!userData.lastname) fields.push("Last Name");
        if (!userData.email) fields.push("Email Address");
        if (!userData.phone) fields.push("Phone Number");
        if (!userData.country) fields.push("Country");
        if (!userData.state) fields.push("State");
        if (!userData.city) fields.push("City");
        if (!userData.zipcode) fields.push("Zip Code");
        setIncompleteFields(fields);

        // Set profileDetails directly
        setProfileDetails({
            ...profileDetails,
            country: userData.country || '',
            state: userData.state || '',
            city: userData.city || ''
        });

        // Set selectedCountry ISO
        const selectedCountryObj = countries.find(c => c.name === userData.country);
        if (selectedCountryObj) {
            setSelectedCountry(selectedCountryObj.isoCode);
        }
    }, [userData, countries]);

    useEffect(() => {
        if (selectedCountry) {
            const stateList = State.getStatesOfCountry(selectedCountry);
            setStates(stateList);
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (profileDetails.state && states.length > 0) {
            const matchedState = states.find(s => s.name === profileDetails.state);
            if (matchedState) {
                setSelectedState(matchedState.isoCode);
            }
        }
    }, [profileDetails.state, states]);

    useEffect(() => {
        if (selectedCountry && selectedState) {
            const cityList = City.getCitiesOfState(selectedCountry, selectedState);
            setCities(cityList);
        } else {
            setCities([]);
        }
    }, [selectedCountry, selectedState]);

    useEffect(() => {
        if (profileDetails.city && cities.length > 0) {
            const matchedCity = cities.find(c => c.name === profileDetails.city);
            if (matchedCity) {
                setSelectedCity(matchedCity.name);
            }
        }
    }, [profileDetails.city, cities]);


    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            const statesList = State.getStatesOfCountry(selectedCountry); // Get states of selected country
            setStates(statesList);
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedState) {
            const citiesList = City.getCitiesOfState(selectedCountry, selectedState); // Get cities of selected state
            setCities(citiesList);
        } else {
            setCities([]);
        }
    }, [selectedState, selectedCountry]);

    const toggleDrawer = () => setDrawerOpen((prev) => !prev);

    const handleClick = (item) => {
        if (item.path === 'messages') {
            navigate(`/messages`)
            return;
        }
        setActiveItem(item.path);
        navigate(`/profile/${item.path.toLowerCase().replace(/\s+/g, "-")}`);
        if (drawerOpen) toggleDrawer();
    };


    const SidebarContent = (
        <Box
            bgcolor="white"
            color="black"
            display="flex"
            flexDirection="column"
            height="100%"
            sx={{
                overflowY: "auto",
                py: 3,
                px: 2,
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE/Edge
                "&::-webkit-scrollbar": {
                    display: "none", // Chrome, Safari, Opera
                },
            }}
        >
            {/* Top Section - Avatar */}
            <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Avatar
                    sx={{ bgcolor: "secondary.main", width: 48, height: 48 }}
                    src={userData?.profilePic}
                >
                    {userData?.name?.[0] ?? "U"}
                </Avatar>

                <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                        {userData?.firstname || "User"}
                    </Typography>
                    <Typography variant="body2" color="grey.700">
                        Dashboard
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", mb: 2 }} />

            {/* Navigation Items */}
            <Box flex={1}>
                <List disablePadding sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {
                        [
                            { text: "Personal Info", icon: <Person />, path: "" },
                            { text: "Messages", icon: <Chat />, path: "messages" },
                            { text: "Wishlist", icon: <Favorite />, path: "favorites" },
                            { text: "Bookings", icon: <BookOnline />, path: "bookings" },
                            { text: "Payments", icon: <Payment />, path: "payments" },
                            { text: "Cancellations", icon: <Cancel />, path: "cancellations" },
                            { text: "Emails & Password", icon: <Email />, path: "emails-&-password" },
                            {
                                text: "Notifications",
                                icon: (
                                    <Badge
                                        color="error"
                                        badgeContent={incompleteFields?.length || 0}
                                        invisible={!incompleteFields || incompleteFields.length === 0}
                                    >
                                        <Notifications />
                                    </Badge>
                                ),
                                path: "notifications",
                            },
                        ].map((item, index) => (
                            <ListItem
                                button
                                key={item.text}
                                onClick={() => handleClick(item)}
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: 2,
                                    px: 2,
                                    py: 1,
                                    color: activeItem === item.text ? "white" : "black",
                                    backgroundColor: activeItem === item.text ? "primary.light" : "#f8f8f8",
                                    transition: "background 0.3s ease",
                                    border: "1px solid transparent",
                                    "&:hover": {
                                        border: item.text ? "1px solid #ddd" : "transparent",
                                        backgroundColor: activeItem === item.text ? "primary.light" : "transparent",
                                    },
                                }}
                            >
                                <ListItemIcon sx={{ color: activeItem === item.text ? "white" : "grey", minWidth: 36 }}>{item.icon}</ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    primaryTypographyProps={{
                                        fontSize: 15,
                                        fontWeight: activeItem === item.text ? "bold" : "normal",
                                    }}
                                />
                            </ListItem>
                        ))}
                </List>
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 2 }} />

            {/* Footer Section */}
            <Box mt="auto">
                <ListItem
                    button
                    // onClick={handleLogout} // your logout function here
                    sx={{
                        borderRadius: 2,
                        px: 2,
                        py: 1.5,
                        color: "black",
                        "&:hover": {
                            backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                    }}
                >
                    <ListItemIcon sx={{ color: "black", minWidth: 36 }}>
                        <Logout />
                    </ListItemIcon>
                    <ListItemText
                        primary="Sign Out"
                        primaryTypographyProps={{ fontSize: 15 }}
                    />
                </ListItem>
            </Box>
        </Box >
    );

    const OfferSlider = () => {
        return (
            <Box maxWidth='md' mx='auto'>
                <Splide
                    options={{
                        type: 'loop',
                        perPage: 1,
                        autoplay: true,
                        interval: 3000,
                        pauseOnHover: true,
                        arrows: isSmallScreen ? false : true,
                        pagination: true,
                        cover: true
                    }}
                    aria-label="Offers Slider"
                >
                    {offerImages.map((item, index) => (
                        <SplideSlide key={index}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                }}
                            >
                                <img
                                    src={item.src}
                                    alt={`Slide ${index + 1}`}
                                    style={{ width: '100%', height: isSmallScreen ? 200 : 200, display: 'block', objectFit: "cover" }}
                                />
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 16,
                                        left: 16,
                                        background: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        px: 2,
                                        py: 1,
                                        borderRadius: 1,
                                        fontWeight: 'bold',
                                        fontSize: '0.75rem',
                                    }}
                                >
                                    {item.offer}
                                </Box>
                            </Box>
                        </SplideSlide>
                    ))}
                </Splide>
            </Box >
        );
    };


    return (
        <Box>
            {/* Header */}

            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    backdropFilter: "blur(10px)",
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    color: "text.primary",
                    zIndex: 1300,
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    {/* Logo */}
                    <Box display="flex" alignItems="center" gap={1}>
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

                    {/* Right Section */}
                    <Box display="flex" alignItems="center" gap={2}>
                        {/* Desktop Only Nav (optional) */}
                        <Box
                            sx={{
                                display: { xs: "none", md: "flex" },
                                gap: 2,
                                alignItems: "center",
                            }}
                        >
                            {[
                                { label: "Home", path: "/" },
                                { label: "About", path: "/about" },
                                { label: "Testimonials", path: "/testimonials" },
                                { label: "Offers", path: "/offers" },
                                { label: "Support", path: "/support" },
                            ].map((link, index) => (
                                <Typography
                                    key={index}
                                    fontWeight={600}
                                    variant="body2"
                                    onClick={() => navigate(link.path)} // if using react-router
                                    sx={{ mr: 2, color: 'grey', cursor: "pointer", "&:hover": { color: 'black' } }}
                                >
                                    {link.label}
                                </Typography>
                            ))}
                        </Box>

                        {/* <Button variant="contained" size="medium" sx={{ boxShadow: 0 }}>
                        </Button> */}

                        <Button
                            size="small"
                            component={NavLink}
                            to="/"
                            variant='contained'
                            sx={{ textTransform: "none" }}
                        >
                            Explore
                        </Button>

                        <IconButton
                            edge="end"
                            onClick={toggleDrawer}
                            // onClick={handleAvatarClick}
                            size="small" sx={{ p: 0 }}>
                            <Avatar
                                src={userData?.profilePic || ""}
                                alt="Profile Picture"
                                sx={{ width: 32, height: 32, bgcolor: "secondary.main" }}
                            >
                                {/* Fallback: show first letter of user’s name if image not available */}
                                {userData?.firstname?.[0]?.toUpperCase() || "U"}
                            </Avatar>
                        </IconButton>


                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            PaperProps={{ sx: { mt: 1.5, minWidth: 180, borderRadius: 2, boxShadow: 0 } }}
                        >
                            <MenuItem onClick={() => navigate("/profile")}>My Profile</MenuItem>
                            <MenuItem onClick={() => navigate("/settings")}>Settings</MenuItem>
                            <Divider />
                            <MenuItem
                            //  onClick={handleLogout}
                            >Logout</MenuItem>
                        </Menu>

                        {/* Menu Icon (always visible) */}
                        {/* <IconButton edge="end" onClick={toggleDrawer}>
                            <MenuIcon />
                        </IconButton> */}
                    </Box>
                </Toolbar>
            </AppBar>




            {/* Drawer for sidebar menu */}
            <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer} sx={{ zIndex: 1301, }}
                PaperProps={{
                    sx: {
                        width: '100%', // Full width on all screens
                        maxWidth: isSmallScreen ? '100vw' : '30vw', // Prevent scrollbars
                    },
                }} >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', }} p={2}>
                    <Box display="flex" alignItems="center" gap={1}>
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
                    <IconButton onClick={toggleDrawer}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {SidebarContent}
            </Drawer>

            {/* Main content */}
            <Box flex={1} p={{ xs: 1, md: 3 }} overflow="auto">
                <OfferSlider />
                <Outlet context={{ userData, activeItem, setActiveItem }} />
            </Box>

            <FooterComponent />
        </Box>
    );


};

export default ProfileLayout;
