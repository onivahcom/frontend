import React, { useState, useEffect } from "react";
import {
    AppBar,
    Toolbar,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    CssBaseline,
    useMediaQuery,
    Collapse,
    Grid,
    Card,
    Avatar,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Settings as SettingsIcon,
    Inbox,
    RequestPage,
    Brightness4 as Brightness4Icon,
    Brightness7 as Brightness7Icon,
    Email,
    ExpandLess,
    ExpandMore,
    Person2,
    ApprovalRounded,
    FindInPage,
} from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import { Outlet, useNavigate } from "react-router-dom";
import Logout from "@mui/icons-material/Logout";
import adminAxios from "../Api/Api";
import VerifiedUser from "@mui/icons-material/VerifiedUser";

const AdminDashboard = ({ adminData }) => {

    const navigate = useNavigate();
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const [isOpen, setIsOpen] = useState(isLargeScreen);
    const [isDarkMode, setIsDarkMode] = useState(false);
    // Track dropdown open states by menu id
    const [openDropdown, setOpenDropdown] = useState({});


    useEffect(() => {
        if (isLargeScreen) setIsOpen(true);
    }, [isLargeScreen]);



    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Define menu items, with some containing children (sub-dropdown items)
    const menuItems = [
        { id: "home", label: "Home", icon: <HomeIcon />, path: "/admin-dashboard", permission: "dashboard" },

        {
            id: "reports",
            label: "Reports",
            icon: <Person2 />,
            children: [
                { id: "user", label: "Users", path: "/admin-dashboard/list/users", permission: "view_users" },
                { id: "vendor", label: "Vendors", path: "/admin-dashboard/list/vendors", permission: "view_vendors" },
            ],
        },

        { id: "manage_users", label: "Manage Users", icon: <FindInPage />, path: "/admin-dashboard/manage-users", permission: "manage_users" },

        { id: "inbox", label: "Inbox", icon: <Inbox />, path: "/admin-dashboard/inbox", permission: "view_inbox" },

        { id: "compose", label: "Compose Email", icon: <Email />, path: "/admin-dashboard/compose", permission: "compose_mail" },

        {
            id: "Services",
            label: "Services",
            icon: <RequestPage />,
            children: [
                { id: "requests", label: "Requests", path: "/admin-dashboard/requests", permission: "view_requests" },
                { id: "approved", label: "Approved", path: "/admin-dashboard/requests/approved", permission: "view_approved_requests" },
                { id: "declined", label: "Declined", path: "/admin-dashboard/requests/declined", permission: "view_declined_requests" },
            ],
        },

        {
            id: "settings",
            label: "Settings",
            icon: <SettingsIcon />,
            children: [
                { id: "create_user", label: "Create User", icon: <HomeIcon />, path: "/admin-dashboard/create-user", permission: "create_user" },
                { id: "admin_users", label: "Admin Users", icon: <VerifiedUser />, path: "/admin-dashboard/admin-users", permission: "admin_users" },
                { id: "approval_logs", label: "Approval Logs", icon: <ApprovalRounded />, path: "/admin-dashboard/approval-logs", permission: "approval_logs" },

            ],
        },

        { id: "logout", label: "Log Out", icon: <Logout />, path: "/admin-login", },

    ];

    const filterMenuByPermissions = (menu, permissions) => {
        return menu
            .map(item => {
                if (item.children) {
                    // recursively filter children
                    const filteredChildren = filterMenuByPermissions(item.children, permissions);
                    return filteredChildren.length > 0 ? { ...item, children: filteredChildren } : null;
                }
                // if item requires a permission but admin doesn't have it → hide
                if (item.permission && !permissions.includes(item.permission)) {
                    return null;
                }

                return item;
            })
            .filter(Boolean); // remove nulls
    };



    // Render a single menu item; if it has children, render a nested dropdown
    const renderMenuItem = (item) => {
        const hasChildren = Array.isArray(item.children) && item.children.length > 0;

        return (
            <React.Fragment key={item.id}>
                <ListItem
                    onClick={async () => {
                        if (hasChildren) {
                            setOpenDropdown((prev) => ({
                                ...prev,
                                [item.id]: !prev[item.id],
                            }));
                        } else {
                            if (item.path === "logout") {
                                try {
                                    const res = await adminAxios.post("/logout", {}, { withCredentials: true });

                                    // Only alert strings/numbers, never raw objects/promises
                                    alert(res.data.message || "Logged out successfully!");

                                    // redirect to login page
                                    navigate("/admin-login");
                                } catch (err) {
                                    console.error("Logout failed:", err);
                                    alert(err.response?.data?.message || "Error during logout");
                                }
                            } else {
                                navigate(item.path);
                                if (!isLargeScreen) {
                                    setIsOpen(false);
                                }
                            }
                        }
                    }}

                    sx={{

                        cursor: "pointer",
                        mb: 1,
                        justifyContent: isOpen ? "flex-start" : "center",
                        // color: "inherit",
                        "&:hover": {
                            bgcolor: "#564d94",
                            color: "white", // affects both text and icon
                            borderBottom: "1px solid grey",
                            "& .MuiListItemIcon-root": {
                                color: "white",
                            },
                        },
                    }}
                >
                    <ListItemIcon
                        sx={{
                            minWidth: 0,
                            mr: isOpen ? 2 : 0,
                            fontSize: "small",
                            // color: "inherit", // inherit from parent
                        }}
                    >
                        {item.icon}
                    </ListItemIcon>

                    {isOpen && (
                        <ListItemText
                            primary={item.label}
                            primaryTypographyProps={{
                                fontSize: "0.85rem",
                                fontWeight: 500,
                            }}
                        />
                    )}

                    {hasChildren && isOpen && (openDropdown[item.id] ? <ExpandLess /> : <ExpandMore />)}
                </ListItem>

                {hasChildren && (
                    <Collapse in={openDropdown[item.id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {item.children.map((child) => (
                                <ListItem
                                    key={child.id}
                                    onClick={() => {
                                        navigate(child.path);
                                        if (!isLargeScreen) {
                                            setIsOpen(false)
                                        }
                                    }}
                                    sx={{
                                        cursor: "pointer",
                                        pl: 7,
                                        mb: 1,
                                        bgcolor: "white",
                                        "&:hover": {
                                            bgcolor: "#564d94",
                                            color: "white", // affects both text and 
                                            "& .MuiListItemIcon-root": {
                                                bgcolor: "#564d94",
                                                color: "white",
                                            },
                                        },
                                    }}
                                >
                                    <ListItemText
                                        primary={child.label}
                                        primaryTypographyProps={{
                                            fontSize: "0.85rem",
                                            fontWeight: 500,
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>

        );
    };


    const allowedMenu = filterMenuByPermissions(menuItems, adminData.permissions || []);

    const drawerContent = (
        <List>
            {allowedMenu.map((item) => renderMenuItem(item))}
        </List>
    );


    return (
        <Box
            sx={{
                display: "flex",
                minHeight: "100vh",
            }}
        >
            <CssBaseline />

            {/* AppBar */}
            <AppBar
                elevation={0}
                position="fixed"
                sx={{
                    bgcolor: '#564d94',
                    color: "white",
                    zIndex: theme.zIndex.drawer + 1,
                }}
            >
                <Toolbar>
                    <IconButton onClick={() => setIsOpen(!isOpen)} edge="start" sx={{ marginRight: 2 }}>
                        <MenuIcon sx={{ color: "white" }} />
                    </IconButton>
                    <Typography variant="body5" fontWeight={500} sx={{ flexGrow: 1, fontWeight: 400 }}>
                        Welcome {" "}
                        <Box
                            component="span"
                            sx={{
                                fontWeight: 600,
                                color: '#673AB7',
                                backgroundColor: '#f3e5f5',
                                px: 1,
                                borderRadius: '8px',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                            }}
                        >
                            {adminData.username}
                        </Box>
                    </Typography>
                    <Box sx={{ flexGrow: 0, ml: 4 }}>
                        <Tooltip title="Open settings">
                            <IconButton size="small" onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="https://mui.com/static/images/avatar/2.jpg" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {['Profile', 'Log Out'].map((setting) => (
                                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                    <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>


                </Toolbar>
            </AppBar>

            {/* Drawer */}
            <Drawer
                variant={isLargeScreen ? "permanent" : "temporary"}
                open={isOpen}
                onClose={() => setIsOpen(false)}
                sx={{
                    overflowY: "auto", // still allows scrolling
                    "& .MuiDrawer-paper": {
                        mt: 8,
                        width: isOpen ? 250 : 70,
                        transition: "width 0.3s",
                        overflowX: "hidden",
                        overflowY: "auto", // still allows scrolling
                        bgcolor: "#f8f8f8",

                        // Hide scrollbars
                        "&::-webkit-scrollbar": { display: "none" },
                        scrollbarWidth: "none", // Firefox
                        msOverflowStyle: "none", // IE/Edge
                    },
                }}
            >
                {drawerContent}
            </Drawer>


            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 2,
                    ml: isLargeScreen ? (isOpen ? "250px" : "70px") : 0,
                    transition: "margin-left 0.3s",
                }}
            >
                <Toolbar />


                <Outlet context={{ adminData }} />
            </Box>

        </Box >
    );
};

export default AdminDashboard;
