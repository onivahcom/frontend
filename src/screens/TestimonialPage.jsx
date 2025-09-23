import React, { useState } from "react";
import {
    Box,
    Typography,
    Avatar,
    Grid,
    Rating,
    Paper,
    Container,
    Pagination,
} from "@mui/material";
import Header from "../components/Header";
import FooterComponent from "../components/FooterComponent";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import FeedbackSection from "../utils/FeedbackSection";

// Sample Testimonials
const testimonials = [
    {
        name: "Aarav & Meera",
        date: "March 2024",
        location: "Udaipur, India",
        avatar: "/couples/aarav-meera.jpg",
        rating: 5,
        message: "Absolutely magical! The team captured every emotion and made our big day unforgettable.",
    },
    {
        name: "Rohan & Priya",
        date: "February 2024",
        location: "Goa, India",
        avatar: "/couples/rohan-priya.jpg",
        rating: 4.5,
        message: "We loved every moment working with them. Our wedding memories are now timeless.",
    },
    {
        name: "Vikram & Anjali",
        date: "December 2023",
        location: "Jaipur, India",
        avatar: "/couples/vikram-anjali.jpg",
        rating: 5,
        message: "Truly the best experience! Every moment was beautifully captured and turned into art.",
    },
    {
        name: "Kabir & Sana",
        date: "November 2023",
        location: "Manali, India",
        avatar: "/couples/kabir-sana.jpg",
        rating: 4,
        message: "The team blended into our celebration and still captured the essence of every ritual.",
    },
    {
        name: "Ayaan & Ishita",
        date: "October 2023",
        location: "Kerala, India",
        avatar: "/couples/ayaan-ishita.jpg",
        rating: 5,
        message: "Couldn’t have asked for better. Every photo felt like a moment frozen in time.",
    },
    {
        name: "Siddharth & Tanya",
        date: "September 2023",
        location: "Rajasthan, India",
        avatar: "/couples/sid-tanya.jpg",
        rating: 4.5,
        message: "Elegant, timeless and emotional—just like our day. Thank you, team Onivah!",
    },
    {
        name: "Rohan & Priya",
        date: "February 2024",
        location: "Goa, India",
        avatar: "/couples/rohan-priya.jpg",
        rating: 4.5,
        message: "We loved every moment working with them. Our wedding memories are now timeless.",
    },
    {
        name: "Vikram & Anjali",
        date: "December 2023",
        location: "Jaipur, India",
        avatar: "/couples/vikram-anjali.jpg",
        rating: 5,
        message: "Truly the best experience! Every moment was beautifully captured and turned into art.",
    },
    {
        name: "Kabir & Sana",
        date: "November 2023",
        location: "Manali, India",
        avatar: "/couples/kabir-sana.jpg",
        rating: 4,
        message: "The team blended into our celebration and still captured the essence of every ritual.",
    },
];

// Pagination config
const itemsPerPage = 6;

const TestimonialPage = () => {
    const [page, setPage] = useState(1);
    const pageCount = Math.ceil(testimonials.length / itemsPerPage);
    const paginatedTestimonials = testimonials.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <Box>
            <Header />

            {/* Hero Section */}
            <Box maxWidth="lg" mx="auto" sx={{ p: 2 }}>
                <Box
                    sx={{
                        borderRadius: 5,
                        mt: 10,
                        height: { xs: 320, md: 420 },
                        backgroundImage:
                            "url('https://cdn.pixabay.com/photo/2020/11/09/13/46/villa-weddng-5726750_1280.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                    }}
                >
                    <Box
                        sx={{
                            borderRadius: 5,
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                            background:
                                "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.6))",
                        }}
                    />
                    <Typography
                        variant="h3"
                        sx={{
                            zIndex: 1,
                            fontFamily: "'Playfair Display', serif",
                            fontWeight: 600,
                            textAlign: "center",
                            px: 2,
                        }}
                    >
                        Love Notes from Happy Clients 💍
                    </Typography>
                </Box>
            </Box>

            {/* Testimonials */}
            <Container maxWidth="lg" sx={{ py: 8 }}>
                <Grid container spacing={4}>
                    {paginatedTestimonials.map((t, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 4,
                                    borderRadius: 4,
                                    height: "100%",
                                    background:
                                        "linear-gradient(145deg, #f9f4ff, #ffffff)",
                                    border: "1px solid #f0e8e2",
                                    boxShadow: 0,
                                    // 
                                    transition: "transform 0.3s ease",
                                    "&:hover": {
                                        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.06), 0px 4px 12px rgba(0, 0, 0, 0.04)",
                                        transform: "translateY(-4px)",
                                    },
                                }}
                            >
                                <Box mb={2}>
                                    <FormatQuoteIcon
                                        fontSize="large"
                                        sx={{ color: "#c5bbd3", fontSize: 40 }}
                                    />
                                </Box>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        fontStyle: "italic",
                                        mb: 2,
                                        color: "#555",
                                    }}
                                >
                                    “{t.message}”
                                </Typography>

                                <Box display="flex" alignItems="center" gap={2}>
                                    <Avatar
                                        src={t.avatar}
                                        alt={t.name}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                    <Box>
                                        <Typography fontWeight="bold" sx={{ fontSize: 16 }}>
                                            {t.name}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: "#9e9e9e" }}>
                                            {t.location} • {t.date}
                                        </Typography>
                                        <Rating
                                            value={t.rating}
                                            precision={0.5}
                                            readOnly
                                            size="small"
                                        />
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                {/* Pagination */}
                <Box mt={6} display="flex" justifyContent="center">
                    <Pagination
                        count={pageCount}
                        page={page}
                        onChange={(event, value) => setPage(value)}
                        color="primary"
                        shape="rounded"
                        size="large"
                    />
                </Box>
            </Container>

            <Container maxWidth="lg" sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                <FeedbackSection />
            </Container>

            <FooterComponent />
        </Box>
    );
};

export default TestimonialPage;
