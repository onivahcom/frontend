import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS styles
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Stack,
    Paper,
} from "@mui/material";
import { VerifiedUser, Payment, SupportAgent } from "@mui/icons-material";

const WelcomeSection = () => {
    useEffect(() => {
        AOS.init({
            duration: 1000, // animation duration
            once: true, // whether animation should happen only once
            offset: 100, // offset (in px) from the original trigger point
        });
    }, []);

    return (
        <Box
            sx={{
                mt: { xs: 0, md: 7 },
                py: { xs: 10, md: 14 },
                bgcolor: "white",
                overflow: "hidden"
            }}
        >
            <Container maxWidth="lg">
                <Grid container spacing={{ xs: 8, md: 12 }} alignItems="center">

                    {/* Left Side - Text */}
                    <Grid item xs={12} md={6} data-aos="fade-right">
                        <Stack spacing={3}>
                            <Box>
                                <Typography
                                    variant="overline"
                                    sx={{
                                        color: "primary.main",
                                        fontWeight: 700,
                                        letterSpacing: 2,
                                    }}
                                >
                                    ABOUT US
                                </Typography>

                                <Typography
                                    variant="h4"
                                    fontWeight={800}
                                    gutterBottom
                                    sx={{ color: "text.primary", lineHeight: 1.3 }}
                                >
                                    Stay Different. <br /> Stay Connected.
                                </Typography>
                            </Box>

                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ lineHeight: 1.7 }}
                            >
                                <strong>YourBrand</strong> helps travelers find unique, trusted
                                stays — from cozy apartments to luxury villas — hosted by real
                                people.
                                Safe bookings, verified hosts, and 24/7 support make your trips
                                effortless and memorable.
                            </Typography>

                            {/* Action Buttons */}
                            <Stack direction="row" spacing={2} sx={{ pt: 1 }}>
                                <Button variant="contained" color="primary" size="large" data-aos="zoom-in">
                                    Explore Stays
                                </Button>
                                <Button variant="outlined" color="primary" size="large" data-aos="zoom-in" data-aos-delay="200">
                                    Become a Host
                                </Button>
                            </Stack>

                            {/* Trust Badges */}
                            <Stack
                                direction={{ xs: "row", sm: "row" }}
                                spacing={{ xs: 3, sm: 4 }}
                                justifyContent={{ xs: "center", sm: "flex-start" }}
                                sx={{ pt: 3 }}
                                data-aos="fade-up"
                                data-aos-delay="400"
                            >
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <VerifiedUser color="primary" />
                                    <Typography variant="body2" fontWeight={600} sx={{ display: { xs: "none", sm: "block" } }}>
                                        Verified Hosts
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <Payment color="primary" />
                                    <Typography variant="body2" fontWeight={600} sx={{ display: { xs: "none", sm: "block" } }}>
                                        Secure Payments
                                    </Typography>
                                </Stack>

                                <Stack direction="row" spacing={1.5} alignItems="center">
                                    <SupportAgent color="primary" />
                                    <Typography variant="body2" fontWeight={600} sx={{ display: { xs: "none", sm: "block" } }}>
                                        24/7 Support
                                    </Typography>
                                </Stack>
                            </Stack>
                        </Stack>
                    </Grid>

                    {/* Right Side - Image with overlay card */}
                    <Grid item xs={12} md={6} data-aos="fade-left">
                        <Box sx={{ position: "relative" }}>
                            <Box
                                component="img"
                                src="https://cdn.pixabay.com/photo/2024/08/22/09/51/cake-8988890_640.jpg"
                                alt="About us"
                                sx={{
                                    width: { xs: '90%', md: "80%" },
                                    maxHeight: { xs: 280, sm: 380, md: 400 },
                                    borderRadius: 4,
                                    objectFit: "cover",
                                    display: "block",
                                    mx: "auto",
                                }}
                            />

                            {/* Floating Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    position: "absolute",
                                    bottom: { xs: -20, sm: -30 },
                                    left: { xs: 20, sm: 30 },
                                    bgcolor: "white",
                                    color: "black",
                                    p: { xs: 2, sm: 3 },
                                    borderRadius: 10,
                                    maxWidth: 220,
                                }}
                            // data-aos="zoom-in-up"
                            // data-aos-delay="600"
                            >
                                <Typography variant="h6" fontWeight={700}>
                                    10k+ Stays
                                </Typography>
                                <Typography variant="body2">
                                    Across 50+ cities worldwide.
                                </Typography>
                            </Paper>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default WelcomeSection;
