import React from "react";
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Container, IconButton, Button, Avatar, Chip } from "@mui/material";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import { useNavigate, useOutletContext } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import VendorStatics from "../vendorUtils/VendorStatics";
import OrderNotification from "../vendorUtils/OrderNotification";
import PendingNotifications from "../vendorUtils/PendingNotifications";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const VendorDashboard = () => {

    const { vendor } = useOutletContext();
    const navigate = useNavigate();

    const stats = [
        {
            title: "Total Sales",
            value: '0',
            color: ["#E8F5E9", "#C8E6C9"], // Soft green
            icon: <TrendingUpIcon fontSize="medium" color="success" />,
            path: '',
        },
        {
            title: "Total Orders",
            value: <OrderNotification vendorId={vendor._id} />,
            color: ["#E3F2FD", "#BBDEFB"], // Soft blue
            icon: <ShoppingCartIcon fontSize="medium" color="primary" />,
            path: 'orders',
        },
        {
            title: "Revenue",
            value: '0',
            color: ["#FFF3E0", "#FFE0B2"], // Soft orange
            icon: <AttachMoneyIcon fontSize="medium" sx={{ color: "#FB8C00" }} />,
            path: '',
        },
        {
            title: "Pending Orders",
            value: <PendingNotifications vendorId={vendor._id} />,
            color: ["#FFEBEE", "#FFCDD2"], // Soft red
            icon: <HourglassBottomIcon fontSize="medium" sx={{ color: "grey" }} />,
            path: 'orders',
        },
    ];


    const recentOrders = [
        { id: "#1234", customer: "John Doe", amount: "$250", status: "Completed" },
        { id: "#1235", customer: "Jane Smith", amount: "$150", status: "Pending" },
        { id: "#1236", customer: "Mark Johnson", amount: "$320", status: "Processing" }
    ];

    const tutorials = [
        { src: "https://videos.pexels.com/video-files/7514346/7514346-uhd_2560_1440_25fps.mp4", title: "How to Add a Service" },
        { src: "https://videos.pexels.com/video-files/7514346/7514346-uhd_2560_1440_25fps.mp4", title: "Managing Bookings" },
        { src: "https://videos.pexels.com/video-files/7514346/7514346-uhd_2560_1440_25fps.mp4", title: "Respond to Leads" },
        { src: "https://videos.pexels.com/video-files/7514346/7514346-uhd_2560_1440_25fps.mp4", title: "Customize Your Profile" },
    ];

    const heroSlides = [
        {
            title: "Welcome to Your Vendor Hub",
            subtitle: "Manage your services efficiently and reach more customers.",
            image: "https://img.freepik.com/free-photo/wedding-archway-backyard-happy-wedding-couple-outdoors-before-wedding-ceremony_8353-11057.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid&w=740",
        },
        {
            title: "Boost Your Visibility",
            subtitle: "Keep your listings updated to attract more bookings.",
            image: "https://img.freepik.com/free-photo/3d-black-friday-celebration_23-2151848871.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid&w=740",
        },
        {
            title: "Need Help?",
            subtitle: "Check out our tutorial videos or reach support anytime.",
            image: "https://img.freepik.com/free-photo/portrait-man-working-as-telemarketer_23-2151230021.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid&w=740",
        },
    ];

    return (

        <Container maxWidth="xl" disableGutters sx={{ px: { xs: 2, md: 4 }, py: { xs: 2, md: 3 } }}>
            <Box width="100%">
                {/* Dashboard Title */}
                <Typography
                    variant="body5"
                    component='div'
                    fontWeight={700}
                    gutterBottom
                    sx={{
                        textAlign: "left",
                        pl: { xs: 0, md: 1 },
                    }}
                >
                    Welcome Back {vendor?.firstName},
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, pl: { xs: 0, md: 1 }, }}>
                    Manage your services, stay on top of bookings, and connect with customers like never before.
                </Typography>

                <Box sx={{ py: 4 }}>
                    <Splide
                        options={{
                            type: 'loop',
                            perPage: 1,
                            arrows: false,
                            pagination: true,
                            autoplay: true,
                            interval: 5000,
                            speed: 800,
                        }}
                        aria-label="Vendor Dashboard Hero"
                    >
                        {heroSlides.map((slide, index) => (
                            <SplideSlide key={index}>
                                <Box
                                    sx={{
                                        position: "relative",
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        height: { xs: 200, sm: 200, md: 200 },
                                    }}
                                >
                                    <img
                                        src={slide.image}
                                        alt={slide.title}
                                        style={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                            filter: "brightness(0.6)",
                                        }}
                                    />
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            textAlign: "center",
                                            color: "#fff",
                                            px: 2,
                                        }}
                                    >
                                        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', md: '3rem' } }} fontWeight={700} mb={1}>
                                            {slide.title}
                                        </Typography>
                                        <Typography variant="subtitle1" mb={2}>
                                            {slide.subtitle}
                                        </Typography>
                                        {index === 2 && (
                                            <Button variant="contained" color="secondary">
                                                Watch Tutorials
                                            </Button>
                                        )}
                                    </Box>
                                </Box>
                            </SplideSlide>
                        ))}
                    </Splide>
                </Box>

                {/* STATS GRID */}
                <Grid container spacing={2} sx={{ py: 4 }}>
                    {stats.map((stat, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                            <Card
                                onClick={() => navigate(`/vendor-dashboard/${stat.path}`)}
                                sx={{
                                    cursor: "pointer",
                                    bgcolor: "#f8f8f8",
                                    borderRadius: 3,
                                    p: 3,
                                    boxShadow: '0px 0px 2px 2px #0000',
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    textAlign: "center",
                                    gap: 1.5,
                                    height: "100%",
                                    transition: "transform 0.25s ease-in-out",
                                    "&:hover": {
                                        boxShadow: 0, filter: "brightness(0.95)",
                                    },
                                }}
                            >
                                <IconButton sx={{ bgcolor: 'rgb(0 0 0 / 6%)' }} fontSize={{ xs: 28, sm: 32 }}>{stat.icon}</IconButton>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ fontSize: { xs: 12, sm: 14 }, fontWeight: 500, color: "text.secondary" }}
                                >
                                    {stat.title}
                                </Typography>
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{ fontSize: { xs: 18, sm: 22, md: 24 }, color: "text.primary" }}
                                >
                                    {stat.value}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* SALES CHART */}
                <Box mt={5}>
                    <VendorStatics />
                </Box>

                <Box sx={{ mt: 5, py: 4 }}>
                    <Typography variant="h5" fontWeight={700} gutterBottom>
                        🎥 Vendor Tutorials
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Learn how to make the most of your dashboard with these quick walkthroughs.
                    </Typography>

                    <Splide
                        options={{
                            type: "loop",
                            perPage: 4,
                            gap: "1rem",
                            breakpoints: {
                                1200: { perPage: 3 },  // md
                                900: { perPage: 2 },  // sm
                                600: { perPage: 1 },  // xs
                            },
                            pagination: true,
                            arrows: true,
                        }}
                        aria-label="Vendor Tutorial Videos"
                    >
                        {tutorials.map((tutorial, index) => (
                            <SplideSlide key={index}>
                                <Box sx={{ position: "relative", borderRadius: 3, overflow: "hidden", boxShadow: 3 }}>
                                    <video
                                        src={tutorial.src}
                                        muted
                                        playsInline
                                        // poster="https://cdn.pixabay.com/photo/2016/08/27/03/02/youtube-1623577_1280.png" // small thumbnail instead of full video
                                        preload="none" // don’t load until needed
                                        style={{
                                            width: "100%",
                                            height: "200px",
                                            objectFit: "cover",
                                            transition: "transform 0.4s ease-in-out",
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.play()}  // play only on hover
                                        onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                                    />
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            bgcolor: "rgba(0,0,0,0.6)",
                                            px: 1.5,
                                            py: 0.5,
                                            borderBottomRightRadius: 12,
                                        }}
                                    >
                                        <Typography variant="caption" color="white" fontWeight={600}>
                                            Tutorial
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            width: "100%",
                                            bgcolor: "rgba(0,0,0,0.9)",
                                            px: 2,
                                            py: 1,
                                        }}
                                    >
                                        <Typography variant="body2" color="white" fontWeight={500}>
                                            {tutorial.title}
                                        </Typography>
                                    </Box>
                                </Box>
                            </SplideSlide>
                        ))}
                    </Splide>

                </Box>

                {/* RECENT ORDERS TABLE */}
                <Box mt={5} maxWidth='sm'>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                        Recent Orders
                    </Typography>

                    <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #eee' }}>
                        <Table stickyHeader size="large">
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#f9f9f9' }}>
                                    <TableCell sx={{ fontWeight: 600 }}>Order ID</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Customer</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                    <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {recentOrders.map((order) => (
                                    <TableRow key={order.id} hover>
                                        <TableCell>{order.id}</TableCell>
                                        <TableCell>{order.customer}</TableCell>
                                        <TableCell>{order.amount}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={order.status}
                                                size="small"
                                                sx={{
                                                    backgroundColor:
                                                        order.status === "Completed"
                                                            ? "#e0f7e9"
                                                            : order.status === "Pending"
                                                                ? "#fff8e1"
                                                                : "#fdecea",
                                                    color:
                                                        order.status === "Completed"
                                                            ? "#2e7d32"
                                                            : order.status === "Pending"
                                                                ? "#ff9800"
                                                                : "#d32f2f",
                                                    fontWeight: 500,
                                                }}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>



                </Box>
            </Box>
        </Container>


    );
};

export default VendorDashboard;
