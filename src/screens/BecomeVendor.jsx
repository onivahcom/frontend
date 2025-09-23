import React, { useEffect, useRef, useState } from 'react'
import { Button, Box, Grid, Paper, AccordionSummary, AccordionDetails, useMediaQuery, useTheme, Avatar, Divider, Drawer, IconButton, Stack } from "@mui/material";
import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import { Accordion, } from '@mui/material';
import {
    ExpandMore, Public, Security, Build
} from '@mui/icons-material';
import { ListItem, ListItemButton, ListItemText, List } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { NavLink, useNavigate } from 'react-router-dom';
import FooterComponent from '../components/FooterComponent';
import Close from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupIcon from "@mui/icons-material/Group";
import { Star, StarBorder } from "@mui/icons-material";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/react-splide/css'; // defa




const features = [
    {
        id: 'f1',
        icon: <CheckCircleIcon />,
        title: 'Easy Onboarding',
        description: 'Get started effortlessly with our intuitive onboarding process. Create your vendor account in minutes, add your services, set pricing, and go live without any technical hassle. Our step-by-step guidance ensures a smooth setup experience, even if you’re new to online platforms.',
    },
    {
        id: 'f2',
        icon: <AttachMoneyIcon />,
        title: 'Boost Revenue',
        description: 'Maximize your earnings by reaching a wider audience through our powerful platform. Our system helps you showcase your services to potential customers, manage bookings efficiently, and leverage promotional tools to increase visibility and revenue. Focus on your business while we help you grow.',
    },
    {
        id: 'f3',
        icon: <GroupIcon />,
        title: 'Trusted Community',
        description: 'Join a reliable network of vendors and customers who value transparency and quality. Benefit from a supportive ecosystem where reviews, ratings, and communication tools help you build trust, foster long-term relationships, and enhance your reputation in the market.',
    },
];

const testimonials = [
    {
        id: "t1",
        text: "Our ad campaigns finally speak to the right audience with clarity resulting in high CTR and ROI.",
        subtext: "Trust her work, that the words that she delivered completely transformed our brand presence.",
        name: "Kathrine Katija",
        role: "Marketing Manager, ABC Ad Services",
        rating: 5,
        image: "https://storage.googleapis.com/a1aa/image/3c51f65b-9037-4c56-7a49-2b119560af25.jpg",
    },
    {
        id: "t2",
        text: "Working with her team was a game-changer. Our social engagement skyrocketed!",
        subtext: "Their strategy and execution brought tangible results to our campaigns.",
        name: "David Miller",
        role: "CEO, Creative Solutions",
        rating: 5,
        image: "https://cdn.pixabay.com/photo/2018/01/15/09/17/woman-3083516_640.jpg",
    },
    {
        id: "t3",
        text: "Professional and reliable. Their content elevated our brand presence significantly.",
        subtext: "We couldn’t be happier with the quality and results delivered.",
        name: "Anna Smith",
        role: "Founder, Startup XYZ",
        rating: 5,
        image: "https://storage.googleapis.com/a1aa/image/8e101e32-4be4-4382-4537-93494e15ab85.jpg",
    },
];

const BecomeVendor = () => {

    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Create refs for each section
    const heroRef = useRef(null);
    const howItWorksRef = useRef(null);
    const whyusRef = useRef(null);
    const growthRef = useRef(null);
    const faqRef = useRef(null);
    const testimonialsRef = useRef(null);

    const navItems = [
        { label: "Home", ref: heroRef },
        { label: "How It Works", ref: howItWorksRef },
        { label: "Why Us", ref: whyusRef },
        { label: "Testimonials", ref: testimonialsRef },
        { label: "FAQ", ref: faqRef },
        { label: "Sign Up/ Log In", path: "/vendor-login" }, // external route
    ];

    const [mobileOpen, setMobileOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Auto change testimonial every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);


    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    // Scroll function
    const handleScroll = (ref) => {
        ref.current?.scrollIntoView({ behavior: "smooth" });
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <List sx={{ p: 2, display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h6" sx={{ my: 2 }}>
                    Onivah
                </Typography>
                <IconButton onClick={handleDrawerToggle}>
                    <Close />
                </IconButton>
            </List>
            <Divider />
            <List
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "start",
                }}
            >
                {navItems.map((item) => (
                    <ListItem button key={item.label}>
                        {item.path ? (
                            <ListItemText
                                primary={item.label}
                                sx={{ textAlign: "start", cursor: "pointer" }}
                                onClick={() => handleNavigation(item.path)} // normal navigation
                            />
                        ) : (
                            <ListItemText
                                primary={item.label}
                                sx={{ textAlign: "start", cursor: "pointer" }}
                                onClick={() => handleScroll(item.ref)} // scroll to section
                            />
                        )}
                    </ListItem>
                ))}
            </List>

        </Box>
    );

    const handleNavigation = (path) => {
        navigate(path); // navigate programmatically
    };


    const steps = [
        {
            title: "Sign Up",
            description:
                "Quickly create your vendor account in just a few steps. Add your basic information and get ready to showcase your services to millions of potential customers.",
            image:
                "https://cdn.pixabay.com/photo/2017/07/31/19/44/people-2560382_640.jpg",
        },
        {
            title: "List Your Services",
            description:
                "Add detailed listings for your services — upload photos, write descriptions, set pricing, and highlight what makes your offerings unique. Make it easy for customers to choose you.",
            image:
                "https://cdn.pixabay.com/photo/2016/11/29/06/17/audience-1867754_640.jpg",
        },
        {
            title: "Get Booked",
            description:
                "Once your listings are live, start receiving bookings from customers instantly. Manage your orders, track payments, and grow your business seamlessly.",
            image:
                "https://cdn.pixabay.com/photo/2019/12/18/10/02/maldives-4703551_640.jpg",
        },
    ];

    return (
        <>

            <AppBar component="nav" position="sticky" color="default" elevation={0} sx={{
                bgcolor: "rgba(255, 255, 255, 0.6)", // light frosted effect
                backdropFilter: 'blur(20px)', // apply the blur
                WebkitBackdropFilter: 'blur(20px)', // for Safari support
                borderBottom: '1px solid rgba(255, 255, 255, 0.3)' // optional subtle border
            }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    {/* Logo */}
                    <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                        ONIVAH
                    </Typography>

                    {/* Desktop Menu */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>

                        {navItems.map((item, idx) =>
                            item.path ? (
                                <Button
                                    variant='contained'
                                    component={NavLink}
                                    key={item.label}
                                    to={item.path}
                                    sx={{ textTransform: "none" }}
                                >
                                    {item.label}
                                </Button>

                            ) : (
                                <Button
                                    key={item.label}
                                    onClick={() => handleScroll(item.ref)}
                                    sx={{ color: '#333' }}
                                >
                                    {item.label}
                                </Button>
                            )
                        )}

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
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%' },
                }}
            >
                {drawer}
            </Drawer>

            {/* <Header /> */}

            {/* hero */}
            <Box ref={heroRef}
                sx={{
                    overflow: "hidden",
                    minHeight: { xs: '80vh', md: "auto" },
                    py: { xs: 5, md: 10 },
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#333",
                    background: "linear-gradient(135deg, rgba(200,180,255,0.4) 0%, rgba(255,255,255,0.5) 50%, rgba(220,200,255,0.4) 100%)",
                }}
            >
                <Container sx={{ position: "relative", zIndex: 1 }}>
                    {/* Hero Text */}
                    <Typography
                        data-aos='fade-up'
                        variant="h2"
                        gutterBottom
                        align="center"
                        sx={{
                            fontWeight: "bold",
                            fontSize: { xs: "2rem", md: "3rem" },
                        }}
                    >
                        Unleash Your{' '}
                        <Box component="span" sx={{ color: 'primary.main' }}>
                            Business
                        </Box>{' '}
                        Potential
                    </Typography>

                    <Typography
                        maxWidth={600}
                        mx='auto'
                        component='div'
                        data-aos='fade-up'
                        variant="h5"
                        align='center'
                        sx={{
                            fontSize: { xs: "1rem", md: "1.2rem" },
                        }}
                    >
                        Reach millions of customers looking for quality services and products, just like yours.
                    </Typography>

                    {/* Action Buttons */}
                    <Stack direction='row' gap={2} sx={{ mt: 4, justifyContent: "center" }} data-aos='fade-up'>
                        <Button
                            fullWidth={{ xs: true, sm: false }}
                            variant="contained"
                            size="large"
                            sx={{ bgcolor: "black", color: "white" }}
                        >
                            Get Started
                        </Button>
                        <Button
                            fullWidth={{ xs: true, sm: false }}
                            variant="outlined"
                            color="inherit"
                            size="large"
                        >
                            Learn More
                        </Button>
                    </Stack>

                    {/* Image Gallery */}
                    <Box
                        data-aos='zoom-out'
                        data-aos-delay={1000}
                        sx={{
                            mt: 4,
                            display: "flex",
                            gap: 1,
                            py: 5,
                            overflowX: { xs: "auto", md: "visible" },
                            flexWrap: { xs: "nowrap", md: "wrap" },
                            justifyContent: "center",
                            "&::-webkit-scrollbar": { display: "none" }, // Chrome, Safari
                            scrollbarWidth: "none", // Firefox
                            msOverflowStyle: "none", // IE 10+
                        }}
                    >
                        {/* Left large image */}
                        <Box
                            sx={{
                                flex: { xs: "0 0 50%", md: "0 0 32%" },
                                height: { xs: 200, md: 360 },
                                backgroundImage: `url('https://cdn.pixabay.com/photo/2020/08/14/21/11/wedding-5489103_640.jpg')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: 2,
                                boxShadow: 0,
                            }}
                        />

                        {/* Middle two stacked images */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                flex: { xs: "0 0 35%", md: "0 0 32%" },
                            }}
                        >
                            <Box
                                sx={{
                                    height: { xs: 95, md: 175 },
                                    backgroundImage: `url('https://cdn.pixabay.com/photo/2016/11/18/22/21/bride-1837148_640.jpg')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: 2,
                                    boxShadow: 0,
                                }}
                            />
                            <Box
                                sx={{
                                    height: { xs: 95, md: 175 },
                                    backgroundImage: `url('https://cdn.pixabay.com/photo/2025/04/29/23/27/ai-generated-9568091_1280.jpg')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                    borderRadius: 2,
                                    boxShadow: 0,
                                }}
                            />
                        </Box>

                        {/* Right large image */}
                        <Box
                            sx={{
                                flex: { xs: "0 0 50%", md: "0 0 32%" },
                                height: { xs: 200, md: 360 },
                                backgroundImage: `url('https://cdn.pixabay.com/photo/2019/11/20/12/15/figure-4639905_640.jpg')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: 2,
                                boxShadow: 0,
                            }}
                        />
                    </Box>



                </Container>
            </Box>

            {/* how it works */}
            <Box ref={howItWorksRef}
                sx={{
                    py: { xs: 6, md: 10 },
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        data-aos='fade-up'
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', mb: 2, color: "black" }}
                    >
                        How It Works
                    </Typography>
                    <Typography
                        data-aos='fade-up'
                        variant="subtitle1"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: { xs: 4, md: 6 } }}
                    >
                        Get started in just 3 simple steps – sign up, customize your listing, and start growing your business today.
                    </Typography>

                    <Grid container spacing={4} sx={{
                        display: 'flex',
                        alignItems: "center",
                        justifyContent: 'center',
                    }}>
                        {[
                            {
                                title: 'Sign Up',
                                description: 'Quickly create your vendor account in just a few steps. Add your basic information and get ready to showcase your services to millions of potential customers.',
                                icon: <AccountCircleIcon />,
                            },
                            {
                                title: 'List Your Services',
                                description: 'Add detailed listings for your services — upload photos, write descriptions, set pricing, and highlight what makes your offerings unique. Make it easy for customers to choose you.',
                                icon: <ListAltIcon />,
                            },
                            {
                                title: 'Get Booked',
                                description: 'Once your listings are live, start receiving bookings from customers instantly. Manage your orders, track payments, and grow your business seamlessly.',
                                icon: <ShoppingCartIcon />,
                            },
                        ].map((step, index) => (
                            <Grid item xs={10} sm={6} md={4} key={index} data-aos='fade-up'>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2, md: 5 },
                                        borderRadius: 3,
                                        textAlign: 'center',
                                        height: '100%',
                                        position: 'relative',
                                        backgroundColor: '#fcf9ff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 50,
                                            height: 50,
                                            borderRadius: '50%',
                                            bgcolor: 'primary.main',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#fff',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            position: 'absolute',
                                            top: -20,
                                            right: 0,
                                        }}
                                    >
                                        {step.icon}
                                    </Box>

                                    <Box sx={{ mt: 2 }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 600,
                                                mb: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: "center"
                                            }}
                                        >
                                            {step.title}
                                        </Typography>

                                        <Typography variant='body2' >{step.description}</Typography>
                                    </Box>

                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                </Container>
            </Box>

            {/* <Box
                sx={{
                    py: { xs: 6, md: 10 },
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                <Container maxWidth="lg">
                    <Typography
                        data-aos="fade-up"
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: "bold", mb: 2, color: "black" }}
                    >
                        How It Works
                    </Typography>
                    <Typography
                        data-aos="fade-up"
                        variant="subtitle1"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: { xs: 4, md: 6 } }}
                    >
                        Get started in just 3 simple steps – sign up, customize your listing,
                        and start growing your business today.
                    </Typography>

                    {steps.map((step, index) => (
                        <Grid
                            container
                            spacing={4}
                            key={index}
                            sx={{
                                mb: { xs: 6, md: 10 },
                                py: 6,
                                px: { xs: 2, md: 4 }, 
                                alignItems: "center",
                                justifyContent: "space-between",
                                flexDirection: index % 2 === 0 ? "row" : "row-reverse",
                            }}
                        >
                            <Grid item xs={12} md={5}>
                                <Box
                                    component="img"
                                    src={step.image}
                                    alt={step.title}
                                    sx={{
                                        width: "100%",
                                        borderRadius: 5,
                                        boxShadow: 0,
                                        objectFit: "cover",
                                        maxHeight: 280,
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={5}>
                                <Box sx={{ p: { xs: 1, md: 3 } }}> 
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: "bold", mb: 2, color: "primary.main" }}
                                    >
                                        {`Step ${index + 1}`}
                                    </Typography>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: "bold", mb: 1, color: "black" }}
                                    >
                                        {step.title}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {step.description}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                    ))}

                </Container>
            </Box> */}

            {/* why onivah */}
            <Box sx={{ py: { xs: 4, md: 10 }, backgroundColor: '#f9fafb' }} ref={whyusRef}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', color: "black" }}
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
                        {/* Features Section */}
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={4} sx={{ overflow: "hidden" }}>
                                {features.map((feature) => (
                                    <Grid item xs={12} key={feature.id} data-aos='fade-right'>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: { xs: 4, md: 5 },
                                                border: "1px solid #ddd",
                                                backgroundColor: '#ffff',
                                                borderRadius: 3,
                                                display: 'flex',
                                                flexDirection: { xs: 'column', md: 'row' },
                                                alignItems: 'center',
                                                gap: 3,
                                                textAlign: { xs: 'center', md: 'left' },
                                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-6px)',
                                                    boxShadow: 4,
                                                },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#6d4d94',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#fff',
                                                    flexShrink: 0,
                                                    fontSize: '1.8rem',
                                                }}
                                            >
                                                {feature.icon}
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {feature.title}
                                                </Typography>
                                                <Typography variant='subtitle2' color="textSecondary">{feature.description}</Typography>
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
                                    // aspectRatio: '21/9',
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://cdn.pixabay.com/photo/2023/02/10/17/49/wedding-7781406_640.jpg"
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

            {/* testimonial */}
            <Box sx={{ py: { xs: 8, md: 16 }, backgroundColor: "#f7f7f7", fontFamily: "'Merriweather', serif" }} ref={testimonialsRef}>
                <Container maxWidth="lg">
                    {/* Header */}
                    <Box textAlign="center" maxWidth={600} mx="auto">
                        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mb={1}>
                            <Box sx={{ width: 12, height: 1.5, bgcolor: "red", transform: "rotate(12deg)" }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                WHAT CLIENTS SAY
                            </Typography>
                        </Stack>
                        <Typography variant="h4" fontWeight={600} mb={1} lineHeight={1.2}>
                            Honest Feedback
                            <br />
                            From Valued People
                        </Typography>
                        <Typography variant="body2" color="text.secondary" maxWidth={480} mx="auto">
                            Real feedback from businesses and individuals who trusted my content to elevate their brands.
                            Their words reflect the impact of my work.
                        </Typography>
                    </Box>

                    {/* Main content */}
                    <Grid
                        container
                        // spacing={2}
                        py={10}
                        justifyContent="center"
                        alignItems="center" // make children stretch
                        sx={{ height: "100%" }}
                    >
                        {/* Images Column */}
                        <Grid
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'row', md: "column" },
                                overflow: "hidden",
                                height: "100%", // make it take full container height
                            }}
                        >
                            {testimonials.map((client, idx) => (
                                <Grid item key={client.id}>
                                    <Avatar
                                        src={client.image}
                                        alt={client.name}
                                        variant="rounded"
                                        onClick={() => setActiveIndex(idx)}
                                        sx={{
                                            mb: 2,
                                            mr: 1,
                                            borderRadius: 5,
                                            width: activeIndex === idx ? { xs: 180, md: 120 } : { xs: 80, md: 120 },
                                            height: activeIndex === idx ? { xs: 120, md: 180 } : 120,
                                            transition: "all 1s ease",
                                            cursor: "pointer",
                                        }}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        {/* Testimonial Column */}
                        <Grid
                            item
                            xs={12}
                            sm={8}
                            sx={{
                                display: 'flex',       // make it a flex container
                                alignItems: 'center',  // vertically center the Paper                          
                                height: "100%",
                                p: { xs: "1%", md: "6%" },
                                bgcolor: "white",
                                borderRadius: 5
                            }}
                        >
                            <Paper
                                elevation={0}
                                sx={{
                                    p: { xs: 4, md: 6 },
                                    borderRadius: 3,
                                    height: "100%", // match parent container height
                                    position: "relative",
                                    flex: 1, // make paper stretch full height
                                    // border: "1px solid #ddd"

                                }}
                            >
                                {/* Decorative quote */}
                                <Box
                                    component="svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    sx={{ position: "absolute", top: 16, right: 16, width: 80, height: 80, color: "grey.100" }}
                                >
                                    <path d="M7.17 6.17a4 4 0 0 1 5.66 0l.71.7a4 4 0 0 1 0 5.66l-1.42 1.42a.5.5 0 0 1-.7-.7l1.42-1.42a3 3 0 0 0 0-4.24l-.7-.7a3 3 0 0 0-4.24 0l-3.54 3.54a.5.5 0 0 1-.7-.7l3.54-3.54z" />
                                    <path d="M14.83 17.83a4 4 0 0 1-5.66 0l-.7-.7a4 4 0 0 1 0-5.66l1.42-1.42a.5.5 0 0 1 .7.7l-1.42 1.42a3 3 0 0 0 0 4.24l.7.7a3 3 0 0 0 4.24 0l3.54-3.54a.5.5 0 0 1 .7.7l-3.54 3.54z" />
                                </Box>

                                {/* Text */}
                                <Box mb={4}>
                                    <Typography variant="h5" color="text.primary" mb={2} lineHeight={1.4}>
                                        {testimonials[activeIndex].text}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {testimonials[activeIndex].subtext}
                                    </Typography>
                                </Box>

                                {/* Footer */}
                                <Grid container justifyContent="space-between" alignItems="center" borderTop="1px dashed #d1d5db" pt={3}>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {testimonials[activeIndex].name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {testimonials[activeIndex].role}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={0.5} color="error.main">
                                        {Array.from({ length: 5 }).map((_, i) =>
                                            i < testimonials[activeIndex].rating ? <Star key={i} fontSize="small" /> : <StarBorder key={i} fontSize="small" />
                                        )}
                                    </Stack>
                                </Grid>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* faq */}
            <Box sx={{ py: 6, background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' }} ref={faqRef}>
                <Container maxWidth="md">
                    <Typography
                        variant="h4"
                        align="center"
                        gutterBottom
                        sx={{ fontWeight: 'bold', mb: 2 }}
                    >
                        Frequently Asked Questions
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        align="center"
                        color="textSecondary"
                        sx={{ mb: 6 }}
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
                            elevation={0}
                            sx={{
                                mb: 3,
                                borderRadius: 3,
                                backgroundColor: '#fff',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                '&:before': { display: 'none' },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMore sx={{ color: 'primary.main', fontSize: 28 }} />}
                                sx={{
                                    px: 3,
                                    py: 2,
                                    '& .MuiTypography-root': {
                                        fontWeight: 600,
                                        fontSize: { xs: '1rem', md: '1.125rem' },
                                        color: 'primary.dark',
                                    },
                                }}
                            >
                                <Typography>{item.question}</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{ px: 3, pb: 3 }}>
                                <Typography color="text.secondary" sx={{ fontSize: { xs: '0.9rem', md: '1rem' }, lineHeight: 1.6 }}>
                                    {item.answer}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Container>
            </Box>


            <FooterComponent />
        </>
    )
}

export default BecomeVendor