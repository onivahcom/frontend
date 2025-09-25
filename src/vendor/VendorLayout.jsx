import React, { useEffect, useRef, useState } from "react";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
    Box,
    CssBaseline,
    Divider,
    Paper,
    Autocomplete,
    TextField,
    Menu,
    MenuItem,
    Card,
    Avatar,
    Badge
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AccountCircle, Chat, Edit, HomeRepairServiceSharp, Mail, Notifications } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import logo from '../svg/logo.svg';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WorkIcon from '@mui/icons-material/Work';
import FooterComponent from "../components/FooterComponent";
import axios from "axios";
import { apiUrl, backendApi } from "../Api/Api";
import OrderNotification from "../vendorUtils/OrderNotification";
import PendingNotifications from "../vendorUtils/PendingNotifications";

const drawerWidth = '100%'; // Sidebar width




const VendorLayout = ({ vendor }) => {



    const navigate = useNavigate();
    const [unseenCount, setUnseenCount] = useState(null)
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const isMenuOpen = Boolean(anchorEl);
    const location = useLocation();
    const pathAfterDashboard = location.pathname.replace('/vendor-dashboard/', '');
    const isMessageRelated = pathAfterDashboard.startsWith('messages');


    const navOptions = [
        {
            text: "Dashboard",
            path: "/vendor-dashboard",
            icon: <DashboardIcon fontSize="small" />,
            badge: 0,
        },
        {
            text: "Messages",
            path: "/vendor-dashboard/messages",
            icon: <Chat fontSize="small" />,
            badge: unseenCount,
        },
        {
            text: "Notifications",
            path: "/vendor-dashboard/notifications",
            icon: <WorkIcon fontSize="small" />,
            badge: 0,
        },
        {
            text: "Orders",
            path: "/vendor-dashboard/orders",
            icon: <ListAltIcon fontSize="small" />,
            badge: <PendingNotifications vendorId={vendor?._id} />,
        },
        {
            text: "Manage Services",
            path: "/vendor-dashboard/manage-services",
            icon: <HomeRepairServiceSharp fontSize="small" />,
            badge: 0,
        },
        {
            text: "Manage Gallery",
            path: "/vendor-dashboard/manage-gallery",
            icon: <PhotoLibraryIcon fontSize="small" />,
            badge: 0,
        },
        {
            text: "Manage Dates",
            path: "/vendor-dashboard/available-dates",
            icon: <EventAvailableIcon fontSize="small" />,
            badge: 0,
        },
        {
            text: "Apply for service",
            path: "/vendor-dashboard/vendor-services",
            icon: <WorkIcon fontSize="small" />,
            badge: 0,
        },

    ];


    const fetchUnseenMessageCount = async (id) => {
        const res = await backendApi.get(`/vendor/unseen-count/${id}`);
        setUnseenCount(res.data.unseenCount);
    };

    useEffect(() => {
        if (vendor?._id) fetchUnseenMessageCount(vendor?._id);
    }, [])

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // You can handle each action individually
    const handleProfileClick = () => {
        handleMenuClose();
    };

    const handleLogout = () => {
        handleMenuClose();
    };

    const handleSidebarToggle = () => {
        setSidebarOpen(!sidebarOpen); // Toggle sidebar for larger screens
    };

    const handleNavigation = (path) => {
        if (path === 'Log Out') {
            localStorage.removeItem('vendor_token');
        }
        if (path === 'Messaging') {
            window.open(path, '_blank');
        }
        setSidebarOpen(false);
        navigate(path);
    };


    const handleSettings = () => {
        setSidebarOpen(false);
        navigate('/vendor-dashboard/settings');
    }

    const MemoizedAutocomplete = React.memo(() => {
        const [searchInput, setSearchInput] = useState("");
        const uniqueIdRef = useRef("search-field-" + Math.random().toString(36).substring(2, 8));

        const handleSelect = (event, value) => {
            if (value) {
                navigate(value.path);
            }
        };

        return (
            <Autocomplete
                size="small"
                options={navOptions}
                getOptionLabel={(option) => option.text}
                filterOptions={(options, state) =>
                    state.inputValue === ""
                        ? []
                        : options.filter((option) =>
                            option.text.toLowerCase().includes(state.inputValue.toLowerCase())
                        )
                }
                sx={{
                    width: 250,
                    bgcolor: "#fff",
                    borderRadius: 3,
                    display: { xs: "none", md: "block" },
                }}
                value={null}
                onChange={handleSelect}
                inputValue={searchInput}
                onInputChange={(event, value, reason) => {
                    if (reason === 'input' || reason === 'clear') {
                        setSearchInput(value);
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Search..."
                        variant="outlined"
                        size="small"
                        inputProps={{
                            ...params.inputProps,
                            name: uniqueIdRef.current,
                            id: uniqueIdRef.current,
                            autoComplete: "new-password",
                        }}
                    />
                )}
            />
        );
    });

    const drawer = (
        <Box
            sx={{
                width: drawerWidth,
                bgcolor: "#ffffff",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                px: 2,
                overflowY: "auto",
                scrollbarWidth: "none", // Firefox
                msOverflowStyle: "none", // IE/Edge
                "&::-webkit-scrollbar": {
                    display: "none", // Chrome, Safari, Opera
                },
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                <img src={logo} alt="Onivah Logo" style={{ width: 160, height: 60 }} />

                <IconButton
                    onClick={handleSidebarToggle} // This should toggle the drawer open/close
                >
                    <Close sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>
            <Divider />

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1,
                    mt: 2,
                    borderRadius: 2,
                    backgroundColor: "#f6f0ff",
                    // border: "1px solid #cac1e0",
                }}
            >
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar
                        src={vendor.profilePic || "/placeholder.jpg"}
                        alt={vendor.fullname}
                        sx={{ width: 56, height: 56 }}
                    />
                    <Typography variant="body5" component='div' fontWeight={600}>
                        {vendor.firstName || "User"}
                        <Typography variant="caption" color="textSecondary" component='div' fontWeight={600}>
                            Dashboard
                        </Typography>
                    </Typography>
                </Box>

                <IconButton
                    onClick={() => { navigate('/vendor-dashboard/settings'); setSidebarOpen(false) }}
                    sx={{
                        "&:hover": {
                            bgcolor: "secondary",
                        },
                    }}
                >
                    <Edit sx={{ fontSize: 20 }} />
                </IconButton>
            </Box>


            <List sx={{ py: 2, pb: 5 }}>
                {navOptions.map((item, index) => (
                    <ListItem
                        key={index}
                        sx={{
                            p: 2,
                            bgcolor: '#f5f5f5',
                            borderRadius: 2,
                            mb: 1,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: "space-between",
                            gap: 1.5,
                            '&:hover': {
                                // bgcolor: '#e0e0e0',
                                bgcolor: "#7b55aa",
                            },
                            '&:hover .list-text': {
                                fontWeight: 600,
                                color: "white"
                            },
                            '&:hover .list-icon': {
                                color: "white", // icon color on hover
                            }
                        }}
                        onClick={() => handleNavigation(item.path)}
                    >
                        <Typography variant="body2" className="list-text">{item.text}</Typography>
                        {/* Badge for all items */}
                        <Badge
                            className="list-icon"
                            badgeContent={item.badge}
                            color="error"
                            showZero={false} // hide if 0
                        >
                            {item.icon}
                        </Badge>
                    </ListItem>


                ))}
            </List>

            <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2 }} />

                <List>
                    <ListItem
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            mb: 1,
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: '#e0e0e0',
                            },
                            '&:hover .list-text': {
                                fontWeight: 600,
                            },
                        }}
                        onClick={handleSettings}
                    >
                        <Typography className="list-text">Settings</Typography>
                    </ListItem>

                    <ListItem
                        sx={{
                            p: 2,
                            borderRadius: 2,
                            cursor: 'pointer',
                            '&:hover': {
                                bgcolor: '#ffecec',
                            },
                            '&:hover .list-text': {
                                fontWeight: 600,
                                color: 'error.main',
                            },
                        }}
                    // onClick={handleLogout}
                    >
                        <Typography className="list-text" color="error.main">Logout</Typography>
                    </ListItem>
                </List>
            </Box>
        </Box>
    );


    return (
        <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#121212" }}>
            <CssBaseline />

            <Drawer
                anchor="right"
                variant="temporary"
                open={sidebarOpen}
                onClose={handleSidebarToggle}
                sx={{
                    display: { xs: "block", md: "block" },
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        bgcolor: "#fff",
                    },
                }}
            >
                {drawer}
            </Drawer>


            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    overflowX: "hidden", // Prevent overflow
                    width: {
                        xs: "100%",
                        md: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
                    },
                    transition: "all 0.3s ease-in-out",
                    display: "flex",
                    flexDirection: "column",
                    mb: isMessageRelated ? 0 : 1,
                    px: isMessageRelated ? 0 : 0

                }}
            >
                <AppBar position="static" elevation={0} sx={{
                    bgcolor: "#fff",
                    borderBottomLeftRadius: 6,
                    borderBottomRightRadius: 6,
                }}>
                    <Toolbar sx={{ display: isMessageRelated ? "none" : "flex", gap: 2, alignItems: "center", }}>
                        {/* <IconButton #f7f2ff
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={handleSidebarToggle}
                            sx={{ display: { xs: "none", md: "block" } }}
                        >
                            <MenuIcon />
                        </IconButton> */}

                        <svg width="160" height="60" viewBox="0 0 260 100" xmlns="http://www.w3.org/2000/svg" fill="none">
                            <circle cx="60" cy="55" r="25" stroke="#6D4D94" strokeWidth="3" fill="none" />

                            <circle cx="95" cy="45" r="25" stroke="#e4c6ff" strokeWidth="3" fill="none" />

                            <polygon points="95,12 90,22 95,27 100,22" fill="#EFB7B7" stroke="#EFB7B7" strokeWidth="1" />
                            <line x1="95" y1="12" x2="95" y2="27" stroke="#fff" strokeWidth="0.6" />
                            <line x1="90" y1="22" x2="100" y2="22" stroke="#fff" strokeWidth="0.6" />

                            <text x="135" y="60" fontFamily="'Playfair Display', serif" font-size="26" fontWeight={600} fill="#6D4D94" letterSpacing="1">
                                Onivah
                            </text>
                        </svg>

                        {/* Push remaining items to the right */}
                        <Box sx={{ flexGrow: 1 }} />


                        <MemoizedAutocomplete />

                        {/* <IconButton
                            edge="end"
                            onClick={() => navigate("/vendor-dashboard/orders")}
                        >
                            <Badge
                                badgeContent={<OrderNotification vendorId={vendor?._id} />}
                                color="error"
                                showZero={false}
                            >
                                <Notifications fontSize="medium" />
                            </Badge>
                        </IconButton> */}


                        {/* message notification */}
                        <IconButton
                            edge="end"
                            onClick={() => navigate("/vendor-dashboard/messages")}
                        >
                            <Badge badgeContent={unseenCount} color="error">
                                <Mail fontSize="medium" />
                            </Badge>
                        </IconButton>

                        {/* profile pic */}
                        <IconButton
                            edge="end"
                            onClick={handleSidebarToggle}
                            sx={{
                                color: 'primary.dark',
                            }}
                        >
                            {vendor?.profilePic ? (
                                <Avatar
                                    src={vendor.profilePic}
                                    alt="Profile Picture"
                                    sx={{ width: 32, height: 32, fontSize: 16 }}
                                />
                            ) : (
                                <Box
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AccountCircle sx={{ fontSize: 32 }} />
                                </Box>
                            )}
                        </IconButton>

                        {/* menu  */}
                        {/* <IconButton
                            edge="end"
                            sx={{ color: "primary.dark" }}
                            aria-label="menu"
                        // onClick={handleProfileMenuOpen}
                        >
                            <MenuIcon fontSize="medium" />
                        </IconButton>

                        <Menu
                            anchorEl={anchorEl}
                            open={isMenuOpen}
                            onClose={handleMenuClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                            <MenuItem onClick={handleProfileClick}>Settings</MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu> */}


                    </Toolbar>
                </AppBar>

                <Paper elevation={0} sx={{
                    minHeight: "calc(100vh - 64px)",
                    borderRadius: 2,
                    mt: isMessageRelated ? 0 : 1,
                }}>
                    <Outlet context={{ vendor }} /> {/* Using context to pass vendor */}
                </Paper>

                <Box sx={{ display: isMessageRelated ? "none" : "block", }}>
                    <FooterComponent />
                </Box>
            </Box>
        </Box>
    );
};

export default VendorLayout;