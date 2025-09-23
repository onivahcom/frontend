import React, { useState } from 'react'
import { Button, Box, Grid, Paper, AccordionSummary, AccordionDetails, useMediaQuery, useTheme, Avatar, Divider, Drawer, IconButton } from "@mui/material";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import { Accordion, } from '@mui/material';
import {
    ExpandMore, Public, Security, Build

} from '@mui/icons-material';
import { ListItem, ListItemButton, ListItemText, List } from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';







const navItems = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Growth', path: '/growth' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Partner', path: '/partner' },
    { label: 'Sign In/ Log In', path: '/vendor-login' }
];

const Rough5 = () => {

    const theme = useTheme();
    const navigate = useNavigate();

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Shubadinam
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem button key={item.label}>
                        <ListItemText primary={item.label} sx={{ textAlign: 'center' }} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    const handleNavigation = (path) => {
        navigate(path); // navigate programmatically
    };

    const features = [
        {
            title: 'Reach a Global Audience',
            description: 'Connect with millions of users worldwide.',
            icon: <Public sx={{ fontSize: 32, color: '#fff' }} />,
            iconBg: '#1976d2',
        },
        {
            title: 'Easy Setup',
            description: 'Create and manage your listings effortlessly.',
            icon: <Build sx={{ fontSize: 32, color: '#fff' }} />,
            iconBg: '#388e3c',
        },
        {
            title: 'Safe & Secure',
            description: 'Your transactions are safe and secure with us.',
            icon: <Security sx={{ fontSize: 32, color: '#fff' }} />,
            iconBg: '#f57c00',
        },
    ];

    const testimonials = [
        {
            name: 'Sarah, Event Organizer',
            feedback: 'Great platform! It helped me reach more clients and streamline my bookings.',
            avatar: 'https://i.pravatar.cc/150?img=47', // Replace with your own image if desired
        },
        {
            name: 'David, Property Owner',
            feedback: 'Amazing experience! I started getting bookings within the first week.',
            avatar: 'https://i.pravatar.cc/150?img=32',
        },
    ];


    return (
        <div>


            <AppBar component="nav" position="sticky" color="default" elevation={0} sx={{ backdropFilter: 'blur(40px)' }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        ONIVAH
                    </Typography>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        {navItems.map((item) => (
                            <Button
                                key={item.label}
                                onClick={() => handleNavigation(item.path)}
                                sx={{ color: '#333' }}
                            >
                                {item.label} {/* ✅ render just the label string */}
                            </Button>
                        ))}
                    </Box>


                    {/* Mobile Menu Button */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerToggle}
                        sx={{ display: { md: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>

            {/* Drawer for Mobile */}
            <Drawer
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better performance on mobile
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 250 },
                }}
            >
                {drawer}
            </Drawer>
            {/* <Header /> */}
            <Box
                sx={{
                    p: 2,
                    position: "relative",
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: { xs: "auto", md: "100vh" },
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                }}
            >
                {/* Overlay for better readability */}
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
                    }}
                />
                <Container sx={{ position: "relative", zIndex: 1 }}>
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{
                            fontWeight: "bold",
                            fontSize: isMobile ? "2rem" : "3rem", // Adjust font size based on screen size
                        }}
                    >
                        Unleash Your Business Potential
                    </Typography>
                    <Typography
                        variant="h5"
                        paragraph
                        sx={{
                            fontSize: isMobile ? "1rem" : "1.2rem", // Adjust font size based on screen size
                        }}
                    >
                        Reach millions of customers looking for quality services and products, just like yours.
                    </Typography>

                    {/* Action buttons */}
                    <Grid
                        container
                        spacing={2}
                        justifyContent="start"
                        alignItems="center"
                        sx={{ mt: 4 }}
                    >
                        <Grid item xs={6} sm="auto">
                            <Button
                                fullWidth={isMobile}
                                variant="contained"
                                color="primary"
                                size={isMobile ? "medium" : "large"}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: isMobile ? "1rem" : "1.1rem",
                                }}
                            >
                                Get Started
                            </Button>
                        </Grid>

                        <Grid item xs={6} sm="auto">
                            <Button
                                fullWidth={isMobile}
                                variant="outlined"
                                color="white"
                                size={isMobile ? "medium" : "large"}
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: isMobile ? "1rem" : "1.1rem",
                                }}
                            >
                                Learn More
                            </Button>
                        </Grid>
                    </Grid>

                    {/* Image Gallery for more visual appeal */}
                    <Grid
                        container
                        spacing={2}
                        sx={{ mt: 4 }}
                        justifyContent="center"
                        direction={isMobile ? "column" : "row"} // Stack images vertically on mobile
                    >
                        <Grid item xs={12} sm={4}>
                            <Box
                                sx={{
                                    width: "100%",
                                    height: 180,
                                    backgroundImage:
                                        "url('https://plus.unsplash.com/premium_photo-1661962495669-d72424626bdc?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bHV4dXJ5JTIwaG90ZWx8ZW58MHx8MHx8fDA%3D')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box
                                sx={{
                                    width: "100%",
                                    height: 180,
                                    backgroundImage:
                                        "url('https://images.unsplash.com/photo-1427097829427-56a905bf7004?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHBvb2x8ZW58MHx8MHx8fDA%3D')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Box
                                sx={{
                                    width: "100%",
                                    height: 180,
                                    backgroundImage:
                                        "url('https://images.unsplash.com/photo-1576694667642-6f289dd54187?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjB3ZWRkaW5nfGVufDB8fDB8fHww')",
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
                                }}
                            />
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: { xs: 4, md: 8 }, backgroundColor: '#f9fafb' }}>
                <Container maxWidth="lg">
                    <Typography
                        color='primary'
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', }}
                    >
                        How It Works
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="textSecondary"
                        sx={{ mb: { xs: 3, md: 5 } }}
                    >
                        A simple process to get you up and running!
                    </Typography>
                    <Grid container spacing={4}>
                        {[
                            {
                                title: ' Sign Up',
                                description: 'Sign up and create your vendor account.',
                            },
                            {
                                title: 'Customize Your Listing',
                                description: 'Add photos, descriptions, and prices.',
                            },
                            {
                                title: ' Start Earning',
                                description: 'Start receiving bookings and sales.',
                            },
                        ].map((step, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: 4,
                                        backgroundColor: "#fefaff",
                                        borderRadius: 3,
                                        textAlign: 'center',
                                        height: '100%',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                            boxShadow: 10,
                                        },
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 60,
                                            height: 60,
                                            margin: '0 auto 16px',
                                            borderRadius: '50%',
                                            backgroundColor: '#6d4d94',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: '1.25rem',
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {index + 1}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: '600', mb: 1 }}>
                                        {step.title}
                                    </Typography>
                                    <Typography color="textSecondary">{step.description}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>


            <Box sx={{ py: { xs: 4, md: 10 }, backgroundColor: '#f9fafb' }}>
                <Container maxWidth="lg">
                    <Typography
                        color="primary"
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                    >
                        Why Partner with Us?
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="textSecondary"
                        sx={{ mb: { xs: 4, md: 8 } }}
                    >
                        Unlock growth with a trusted and powerful platform.
                    </Typography>

                    <Grid container spacing={6} alignItems="center">
                        {/* Steps Section */}
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={4}>
                                {features.map((step, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Paper
                                            elevation={1}
                                            sx={{
                                                p: 6,
                                                backgroundColor: '#fefaff',
                                                borderRadius: 3,
                                                textAlign: 'left',
                                                display: "flex",
                                                justifyContent: "space-evenly",
                                                flexDirection: { xs: 'column', md: "row" },
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-6px)',
                                                    boxShadow: 4,
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 50,
                                                    height: 50,
                                                    mb: 1,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#6d4d94',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    fontSize: '1.1rem',
                                                }}
                                            >
                                                {index + 1}
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {step.title}
                                                </Typography>
                                                <Typography color="textSecondary">{step.description}</Typography>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        {/* Image Section */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    aspectRatio: '21:9', // Maintain aspect ratio
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://videos.openai.com/vg-assets/assets%2Ftask_01jscrb20afxetsk97kxdga9pd%2Fimg_3.webp?st=2025-04-25T15%3A06%3A00Z&se=2025-05-01T16%3A06%3A00Z&sks=b&skt=2025-04-25T15%3A06%3A00Z&ske=2025-05-01T16%3A06%3A00Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=8ebb0df1-a278-4e2e-9c20-f2d373479b3a&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=EC8MJl17noFtCC7%2BKNg8KMhKu%2F1nERrajjqoo4Ann2Q%3D&az=oaivgprodscus"
                                    alt="How It Works"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                        </Grid>

                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: "#f4f4f4" }}>
                <Container>
                    <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
                        Hear from Our Vendors
                    </Typography>
                    <Grid container spacing={4}>
                        {testimonials.map((testimonial, index) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        p: 4,
                                        height: '100%',
                                        borderRadius: 3,
                                        backgroundColor: '#ffffff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                                        “{testimonial.feedback}”
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <Avatar
                                            src={testimonial.avatar}
                                            alt={testimonial.name}
                                            sx={{ width: 48, height: 48, mr: 2 }}
                                        />
                                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                                            {testimonial.name}
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: "#fff" }}>
                <Container>
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', mb: 2 }}
                    >
                        See Your Growth Potential
                    </Typography>
                    <Typography
                        variant="h6"
                        align="center"
                        color="textSecondary"
                        sx={{ mb: 6 }}
                    >
                        Join a growing community of vendors and grow your revenue.
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
                        {[
                            { stat: '5 Million+', label: 'Customers served globally' },
                            { stat: '100,000+', label: 'Vendors growing their businesses' },
                            { stat: '50%+', label: 'Growth in first year' },
                        ].map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Paper
                                    elevation={4}
                                    sx={{
                                        p: 4,
                                        textAlign: 'center',
                                        borderRadius: 3,
                                        backgroundColor: '#f9f9ff',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: 6,
                                        },
                                    }}
                                >
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#6d4d94', mb: 1 }}>
                                        {item.stat}
                                    </Typography>
                                    <Typography color="textSecondary">{item.label}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: { xs: 6, md: 10 }, backgroundColor: "#f9fafb" }}>
                <Container maxWidth="md">
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold' }}
                    >
                        Frequently Asked Questions
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="textSecondary"
                        sx={{ mb: 4 }}
                    >
                        Everything you need to know about getting started.
                    </Typography>

                    {[
                        {
                            question: "How do I list my product/service?",
                            answer: "You can sign up and create a listing directly from your dashboard. The process is simple and user-friendly.",
                        },
                        {
                            question: "What are the transaction fees?",
                            answer: "We charge a small fee for each successful transaction made on the platform to maintain quality and support.",
                        },
                    ].map((item, index) => (
                        <Accordion
                            key={index}
                            disableGutters
                            elevation={1}
                            sx={{
                                mb: 2,
                                borderRadius: 2,
                                '&:before': { display: 'none' },
                                backgroundColor: '#fff',
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore />}
                                sx={{ px: 2, py: 1.5 }}
                            >
                                <Typography variant="subtitle1" fontWeight={600}>
                                    {item.question}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 2, pb: 2 }}>
                                <Typography color="textSecondary">{item.answer}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Container>
            </Box>

            <Box sx={{ py: 6, backgroundColor: "#333", color: "#fff" }}>
                <Container>
                    <Grid container spacing={4}>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">VendorMarket</Typography>
                            <Typography>Helping vendors reach new customers globally.</Typography>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Typography variant="h6">Contact Us</Typography>
                            <Button color="inherit">Email</Button>
                            <Button color="inherit">Phone</Button>
                            <Button color="inherit">Facebook</Button>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </div>
    )
}

export default Rough5