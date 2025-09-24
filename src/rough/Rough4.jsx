import React, { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Avatar,
    Chip,
    Button,
    TextField,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Rating,
    Divider,
    Stack,
    Collapse,
    useMediaQuery,
    Drawer,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style
import "react-date-range/dist/theme/default.css"; // theme style
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import { IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import theme from "../Themes/theme";
import CurrencyRupee from "@mui/icons-material/CurrencyRupee";
import { Close } from "@mui/icons-material";

export default function VendorServicePage() {

    const isMobile = useMediaQuery(theme.breakpoints.down("lg"));
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [expanded, setExpanded] = useState(false);
    const [open, setOpen] = useState(false);

    const packages = [
        {
            title: "Package 1",
            details: ["2 nights stay", "Breakfast included", "Free WiFi"],
            price: "5000",
        },
        {
            title: "Package 2",
            details: ["3 nights stay", "All meals included", "Pool access"],
            price: "8000",
        },
    ];

    const fullText = `Escape to a peaceful beachside retreat with breathtaking ocean views. Enjoy fully air-conditioned rooms, modern amenities, a private patio, and easy access to local attractions. Perfect for a relaxing getaway with friends or family, combining comfort, style, and convenience.`;

    const showReadMore = fullText.length


    return (
        <Box p={{ xs: 2, md: 4 }} maxWidth='xl' mx='auto' >



            <Grid container spacing={3}>

                {/* header */}
                <Grid item xs={12} sx={{
                    position: "sticky",
                    display: "flex",
                    top: 0,
                    zIndex: 1100,
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    bgcolor: "rgba(255,255,255,0.7)", // semi-transparent white
                    backdropFilter: "blur(8px)",       // main blur effect
                    WebkitBackdropFilter: "blur(8px)", // Safari support
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                }}
                >
                    {/* Left side: Back */}
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconButton
                            size="small"
                            sx={{
                                mr: 1,
                                bgcolor: "grey.100",
                                "&:hover": { bgcolor: "grey.200" },
                            }}
                            onClick={() => window.history.back()}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </IconButton>
                        <Typography variant="subtitle1" fontWeight={500} color="textSecondary">
                            Back
                        </Typography>
                    </Box>

                    {/* Right side: Share & Favorite */}
                    <Box>
                        <IconButton
                            size="small"
                            sx={{
                                mr: 1,
                                bgcolor: "grey.100",
                                "&:hover": { bgcolor: "grey.200" },
                            }}
                        >
                            <ShareIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            size="small"
                            sx={{
                                bgcolor: "grey.100",
                                "&:hover": { bgcolor: "grey.200" },
                            }}
                        >
                            <FavoriteBorderIcon fontSize="small" />
                        </IconButton>
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                fontWeight: 600,
                                textTransform: "none",
                                borderRadius: 2,
                                px: 2,
                                ml: 1
                            }}
                            onClick={() => setOpen(true)}
                        >
                            Reserve
                        </Button>
                    </Box>

                    {/* Bottom Drawer for Booking Summary */}
                    <Drawer
                        anchor={isMobile ? "bottom" : "right"}
                        open={open}
                        onClose={() => setOpen(false)}
                        PaperProps={{
                            sx: {
                                borderTopLeftRadius: { xs: 16, md: 16 },
                                borderTopRightRadius: { xs: 16, md: 0 },
                                borderBottomLeftRadius: { xs: 16, md: 16 },
                                height: { xs: "50vh", md: '100vh' }, // Half screen
                                width: { xs: 'auto', md: 350 },
                                p: 2,
                            },
                        }}
                    >
                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                        >
                            <Typography variant="h6" fontWeight={600}>
                                Booking Summary
                            </Typography>

                            <IconButton
                                size="small"
                                onClick={() => setOpen(false)} // <-- pass your close handler
                                sx={{
                                    bgcolor: "grey.100",
                                    "&:hover": { bgcolor: "grey.200" },
                                }}
                            >
                                <Close fontSize="small" />
                            </IconButton>
                        </Stack>

                        <Divider sx={{ mb: 2 }} />

                        {/* Example summary content */}
                        <Card
                            sx={{
                                borderRadius: 3,
                                p: 3,
                                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                bgcolor: "background.paper",
                            }}
                        >

                            {/* Dates */}
                            <Stack spacing={1.2} mb={2}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Check-in
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        25 Sep 2025
                                    </Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2" color="text.secondary">
                                        Check-out
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        28 Sep 2025
                                    </Typography>
                                </Stack>
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            {/* Total */}
                            <Stack direction="row" justifyContent="space-between" mb={3}>
                                <Typography variant="subtitle1" fontWeight={600}>
                                    Total
                                </Typography>
                                <Typography
                                    variant="h6"
                                    fontWeight={700}
                                    color="primary.main"
                                >
                                    ₹12,500
                                </Typography>
                            </Stack>

                            {/* CTA */}
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    fontWeight: 600,
                                    fontSize: "1rem",
                                    textTransform: "none",
                                }}
                            >
                                Confirm & Pay
                            </Button>
                        </Card>

                    </Drawer>
                </Grid>

                {/* 🔹 Row 1: Hero Gallery (Collage Style) */}
                <Grid item xs={12} md={8}>
                    <Card
                        sx={{
                            height: { xs: 280, md: 400 },
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            boxShadow: 0,
                        }}
                        elevation={0}
                    >
                        <Grid container spacing={0.5} sx={{ height: "100%" }}>
                            {/* Large Left Image */}
                            <Grid item xs={12} md={6} sx={{ height: { xs: 140, md: "100%" } }}>
                                <Box
                                    component="img"
                                    src="https://cdn.pixabay.com/photo/2024/02/08/04/37/vietnam-8560197_640.jpg"
                                    alt="Main"
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                        borderRadius: { md: "12px 0 0 12px", xs: "12px 12px 0 0" },
                                    }}
                                />
                            </Grid>

                            {/* Right Side Collage (2x2 grid) */}
                            <Grid item xs={12} md={6}>
                                <Grid container spacing={0.5} sx={{ height: "100%" }}>
                                    <Grid item xs={6} sx={{ height: { xs: 70, md: "50%" } }}>
                                        <Box
                                            component="img"
                                            src="https://cdn.pixabay.com/photo/2023/09/04/10/29/couple-8232473_640.jpg"
                                            alt="Collage 1"
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: "0 12px 0 0",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sx={{ height: { xs: 70, md: "50%" } }}>
                                        <Box
                                            component="img"
                                            src="https://cdn.pixabay.com/photo/2023/08/29/10/32/rings-8220935_640.jpg"
                                            alt="Collage 2"
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sx={{ height: { xs: 70, md: "50%" } }}>
                                        <Box
                                            component="img"
                                            src="https://cdn.pixabay.com/photo/2022/11/22/02/06/wedding-7608565_640.jpg"
                                            alt="Collage 3"
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={6} sx={{ height: { xs: 70, md: "50%" } }}>
                                        <Box
                                            component="img"
                                            src="https://cdn.pixabay.com/photo/2023/05/26/12/31/couple-8019370_640.jpg"
                                            alt="Collage 4"
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover",
                                                borderRadius: { md: "0 0 12px 0" },
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>

                        {/* Overlay Button: View More Photos */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 12,
                                right: 12,
                                bgcolor: "rgba(0,0,0,0.6)",
                                color: "#fff",
                                px: 2,
                                py: 0.5,
                                borderRadius: 3,
                                fontSize: 14,
                                cursor: "pointer",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                            }}
                        >
                            + View Photos
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            height: "100%",
                            borderRadius: 4,
                            p: 3,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            bgcolor: "grey.50",
                            boxShadow: 0,
                        }}
                        elevation={0}
                    >
                        <CardContent sx={{ p: 0 }}>
                            {/* Service Title */}
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                gutterBottom
                                sx={{ lineHeight: 1.2 }}
                            >
                                Cozy Beachside Villa
                            </Typography>

                            {/* Host Info */}
                            <Box display="flex" alignItems="center" gap={1} mb={2}>
                                <Avatar
                                    src="https://randomuser.me/api/portraits/women/44.jpg"
                                    alt="Host"
                                    sx={{ width: 32, height: 32 }}
                                />
                                <Typography variant="body1" fontWeight={600}>
                                    Hosted by Sarah
                                </Typography>
                                <VerifiedUser fontSize="small" />
                            </Box>

                            {/* Short Description */}
                            <Box sx={{ mb: 2 }}>
                                <Collapse in={expanded || !showReadMore} collapsedSize={80}>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {expanded || !showReadMore ? fullText : `${fullText.slice(0, 300)}...`}
                                    </Typography>
                                </Collapse>

                                {showReadMore && (
                                    <Typography
                                        variant="caption"
                                        color="primary.main"
                                        component="span"
                                        onClick={() => setExpanded(!expanded)}
                                        sx={{ fontWeight: 600, ml: 0.5, cursor: "pointer", userSelect: "none" }}
                                    >
                                        {expanded ? " Show Less" : " Read More"}
                                    </Typography>
                                )}
                            </Box>

                            {/* Quick Highlights */}
                            <Grid container spacing={1.5} alignItems="center">
                                {/* Verified */}
                                <Grid item xs="auto">
                                    <Chip
                                        icon={<CheckCircleIcon />}
                                        label="Verified"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderColor: "primary.main",
                                            color: "primary.main",
                                            fontWeight: 500,
                                            letterSpacing: 0.5,
                                            "& .MuiChip-icon": {
                                                color: "primary.main",
                                            },
                                        }}
                                    />
                                </Grid>

                                {/* Rating & Reviews */}
                                <Grid item xs="auto">
                                    <Chip
                                        label="4.8 (120 Reviews)"
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            borderColor: "primary.main",
                                            color: "primary.main",
                                            fontWeight: 500,
                                        }}
                                    />
                                </Grid>

                                {/* Highlight / Top Rated */}
                                <Grid item xs="auto">
                                    <Chip
                                        label="Top Rated"
                                        size="small"
                                        variant="filled"
                                        sx={{
                                            bgcolor: "primary.main",
                                            color: "white",
                                            fontWeight: 500,
                                            textTransform: "capitalize",
                                        }}
                                    />
                                </Grid>
                            </Grid>





                        </CardContent>
                    </Card>
                </Grid>

                {/* 🔹 Row 2: Highlights - Connected Strip */}
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            display: "flex",
                            flexDirection: { xs: "column", sm: "row" },
                            flexWrap: "wrap",
                            gap: 1,
                            p: 1,
                            boxShadow: 0,
                            bgcolor: "background.paper",
                        }}
                    >
                        {[
                            "Free Parking for all guests and vehicles",
                            "Fully Air-Conditioned Comfortable Rooms",
                            "Near the Beautiful Beach with Scenic Views",
                            "24x7 Support to Ensure a Smooth Stay",
                        ].map((h, i) => (
                            <Box
                                key={i}
                                sx={{
                                    flex: { xs: "1 1 100%", sm: "1 1 calc(25% - 8px)" }, // responsive width
                                    py: 3,
                                    px: 2,
                                    textAlign: "center",
                                    borderRadius: 3,
                                    bgcolor: "#f9f9f9",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-3px)",
                                        bgcolor: "grey.100",
                                        cursor: "pointer",
                                    },
                                }}
                            >
                                <Typography fontWeight={600} variant="body2">
                                    {h}
                                </Typography>
                            </Box>
                        ))}
                    </Card>
                </Grid>

                {/* Amenities */}
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            p: 3,
                            bgcolor: "background.paper",
                            boxShadow: 0,
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" mb={2} fontWeight={600}>
                            Amenities
                        </Typography>
                        <Box display="flex" gap={1.2} flexWrap="wrap">
                            {["WiFi", "TV", "Kitchen", "Balcony", "Swimming Pool", "Gym"].map(
                                (a, i) => (
                                    <Chip
                                        key={i}
                                        label={a}
                                        sx={{
                                            borderRadius: "20px",
                                            px: 1.5,
                                            fontWeight: 500,
                                            bgcolor: "grey.100",
                                            "&:hover": { bgcolor: "grey.200" },
                                        }}
                                    />
                                )
                            )}
                        </Box>
                    </Card>
                </Grid>

                {/* 🔹 Row 3: Pricing & Custom Fields */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 4, p: 3, boxShadow: 0 }}>
                        <Typography variant="h6" fontWeight={600} mb={3}>
                            Offerings
                        </Typography>

                        <Grid container spacing={2}>
                            {packages.map((pkg, i) => {
                                const isSelected = selectedPackage === i;

                                return (
                                    <Grid item xs={12} sm={6} key={i}>
                                        <Card
                                            onClick={() => setSelectedPackage(i)}
                                            sx={{
                                                p: 3,
                                                borderRadius: 3,
                                                border: isSelected ? "2px solid #1976d2" : "1px solid #e0e0e0",
                                                bgcolor: isSelected ? "rgba(25,118,210,0.08)" : "grey.50",
                                                cursor: "pointer",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                minHeight: 250,
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    borderColor: "#1976d2",
                                                    bgcolor: "rgba(25,118,210,0.04)",
                                                    boxShadow: "0 6px 20px rgba(0,0,0,0.05)",
                                                },
                                            }}
                                            elevation={0}
                                        >
                                            {/* Package Title */}
                                            <Box mb={2}>
                                                <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                                    {pkg.title}
                                                </Typography>

                                                {/* Package Details */}
                                                <Box component="ul" sx={{ pl: 3, mt: 0, mb: 1 }}>
                                                    {pkg.details.map((d, j) => (
                                                        <li key={j}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {d}
                                                            </Typography>
                                                        </li>
                                                    ))}
                                                </Box>
                                            </Box>

                                            {/* Price */}
                                            <Box textAlign="right">
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={600}
                                                    display='flex'
                                                    flexDirection='row'
                                                    justifyContent='end'
                                                    alignItems='center'
                                                    color={isSelected ? "primary.main" : "primary"}
                                                >
                                                    <CurrencyRupee color="primary" sx={{ fontSize: 18 }} />    {pkg.price}
                                                </Typography>
                                            </Box>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card
                        elevation={0}
                        sx={{
                            borderRadius: 4,
                            p: 3,
                            bgcolor: "background.paper",
                            boxShadow: 0,
                        }}
                    >
                        <Typography variant="h6" fontWeight={600} mb={3}>
                            Featured
                        </Typography>

                        <Grid container spacing={2}>
                            {[
                                {
                                    title: "Special Requests",
                                    details:
                                        "Guests can request extra pillows, vegan meals, or early check-in. Please specify your requests in advance.",
                                },
                                {
                                    title: "Rules",
                                    details: [
                                        "No smoking inside rooms",
                                        "Pets are not allowed",
                                        "Quiet hours after 10 PM",
                                    ],
                                },
                            ].map((field, i) => (
                                <Grid item xs={12} sm={6} key={i}>
                                    <Card
                                        sx={{
                                            p: 2.5,
                                            borderRadius: 3,
                                            bgcolor: "grey.50",
                                            boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
                                            cursor: "default",
                                            height: "100%",
                                            display: "flex",
                                            minHeight: 250,
                                            flexDirection: "column",
                                        }}
                                        elevation={0}
                                    >
                                        <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                            {field.title}
                                        </Typography>

                                        {Array.isArray(field.details) ? (
                                            <Box component="ul" sx={{ pl: 3, mt: 1, mb: 0 }}>
                                                {field.details.map((d, j) => (
                                                    <li key={j}>
                                                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                                                            {d}
                                                        </Typography>
                                                    </li>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" mt={1} lineHeight={1.6}>
                                                {field.details}
                                            </Typography>
                                        )}
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Grid>

                {/* 🔹 Row 4: Availability & Why Choose Us */}
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            p: { xs: 2, md: 3 },
                            boxShadow: 0,
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                        }}
                        elevation={0}
                    >
                        {/* Title Section */}
                        <Box
                            sx={{
                                width: "100%",
                                textAlign: "left", // left-align title
                            }}
                        >
                            <Typography variant="h6" fontWeight={600} mb={3}>
                                Check Availability
                            </Typography>
                            {/* Optional subtitle */}
                            <Typography variant="body2" color="text.secondary">
                                Select your preferred dates
                            </Typography>
                        </Box>

                        {/* Calendar Section */}
                        <Box
                            sx={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center", // centers calendar horizontally
                                "& .rdrCalendarWrapper": { border: "none", fontFamily: "inherit" },
                                "& .rdrDay": { borderRadius: "50%" },
                                "& .rdrDay:hover": { backgroundColor: "#1976d2", color: "#fff" },
                                "& .rdrSelected, & .rdrStartEdge, & .rdrEndEdge": {
                                    backgroundColor: "#1976d2",
                                    color: "#fff",
                                },
                                "& .rdrMonthAndYearPickers, & .rdrMonthName": {
                                    color: "#1976d2",
                                    fontWeight: 600,
                                },
                            }}
                        >
                            <DateRange
                                editableDateInputs={true}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                ranges={dateRange}
                                minDate={new Date()}
                                direction="horizontal"
                                onChange={(item) => setDateRange([item.selection])}
                                months={isMobile ? 1 : 2}
                            />
                        </Box>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            p: 3,
                            bgcolor: "background.paper",
                            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" fontWeight={600} mb={3}>
                            Why Choose Us?
                        </Typography>

                        <Grid container spacing={2}>
                            {[
                                {
                                    title: "Professional Staff",
                                    description:
                                        "Our team is highly trained and experienced, ensuring top-notch service with meticulous attention to every detail of your event. ",
                                },
                                {
                                    title: "Affordable Pricing",
                                    description:
                                        "We provide competitive pricing that offers great value without compromising on quality. Our transparent rates help you plan your budget effectively while still enjoying premium services.",
                                },
                                {
                                    title: "Flexible Packages",
                                    description:
                                        "Tailor services to match your specific needs, whether it's catering, décor, or entertainment, ensuring a unique and personalized experience.",
                                },
                                {
                                    title: "24/7 Support",
                                    description:
                                        "We are available around the clock to assist you before, during, and after your event. Any questions, changes, or emergencies are handled promptly by our dedicated support team.",
                                },
                            ]
                                .map((feature, i) => (
                                    <Grid item xs={12} sm={6} key={i}>
                                        <Card
                                            sx={{
                                                p: 2,
                                                borderRadius: 3,
                                                bgcolor: "grey.50",
                                                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                                                transition: "all 0.3s ease",
                                                "&:hover": { boxShadow: "0 4px 14px rgba(0,0,0,0.08)" },
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                            }}
                                            elevation={0}
                                        >
                                            <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                                {feature.title}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {feature.description}
                                            </Typography>
                                        </Card>
                                    </Grid>
                                ))}
                        </Grid>
                    </Card>
                </Grid>

                {/* 🔹 Row 5: Ratings & Reviews */}
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            p: 3,
                            bgcolor: "background.paper",
                            boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" fontWeight={600} mb={3}>
                            Ratings & Reviews
                        </Typography>

                        <Grid container spacing={3}>
                            {[
                                {
                                    user: "User A",
                                    role: "Frequent Traveler",
                                    rating: 4,
                                    comment:
                                        "Great service! Highly recommend. Amazing experience, very professional. Rooms were clean and spacious, and the staff was very attentive.",
                                    date: "Sep 20, 2025",
                                    highlights: ["Clean Rooms", "Friendly Staff"],
                                },
                                {
                                    user: "User B",
                                    role: "First-Time Guest",
                                    rating: 5,
                                    comment:
                                        "Amazing experience, very professional. Loved the location and the amenities provided. Will definitely come back again!",
                                    date: "Sep 18, 2025",
                                    highlights: ["Excellent Location", "All-Inclusive Amenities"],
                                },
                                {
                                    user: "User C",
                                    role: "Returning Guest",
                                    rating: 4.5,
                                    comment:
                                        "Good communication and service. The meals were delicious and the check-in process was smooth. Perfect for a weekend getaway.",
                                    date: "Sep 15, 2025",
                                    highlights: ["Smooth Check-in", "Delicious Meals"],
                                },
                            ].map((review, i) => (
                                <Grid item xs={12} sm={6} md={4} key={i}>
                                    <Card
                                        sx={{
                                            p: 3,
                                            borderRadius: 3,
                                            bgcolor: "grey.50",
                                            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                                            transition: "all 0.3s ease",
                                            "&:hover": { boxShadow: "0 6px 20px rgba(0,0,0,0.08)" },
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "space-between",
                                        }}
                                        elevation={0}
                                    >
                                        {/* Reviewer Info */}
                                        <Box display="flex" flexDirection="column" mb={1}>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {review.user}
                                            </Typography>
                                        </Box>

                                        {/* Rating */}
                                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                                            <Rating value={review.rating} precision={0.5} readOnly size="small" />
                                            <Typography variant="body2" fontWeight={600}>
                                                {review.rating.toFixed(1)}
                                            </Typography>
                                        </Box>

                                        {/* Comment */}
                                        <Typography variant="body2" color="text.secondary" mb={1} lineHeight={1.6}>
                                            {review.comment}
                                        </Typography>

                                        {/* Date */}
                                        <Typography
                                            variant="caption"
                                            color="text.disabled"
                                            sx={{ mt: "auto", textAlign: "right" }}
                                        >
                                            {review.date}
                                        </Typography>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Grid>

                {/* 🔹 Row 6: FAQs */}
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            p: 3,
                            bgcolor: "background.paper",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" fontWeight={600} mb={3}>
                            FAQs
                        </Typography>

                        <Grid container spacing={2}>
                            {[
                                { question: "What is the check-in time?", answer: "Check-in starts at 2 PM. Early check-in can be requested." },
                                { question: "Are pets allowed?", answer: "No, pets are not allowed in the property." },
                                { question: "Is breakfast included?", answer: "Yes, breakfast is included in most packages." },
                                { question: "Can I cancel my booking?", answer: "Yes, cancellation is possible up to 48 hours before arrival." },
                            ].map((faq, i) => (
                                <Grid item xs={12} key={i}>
                                    <Accordion
                                        sx={{
                                            borderRadius: 3,
                                            bgcolor: "grey.50",
                                            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                                            "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.08)" },
                                        }}
                                    >
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            sx={{
                                                "& .MuiAccordionSummary-content": { ml: 1 },
                                                py: 1.5,
                                            }}
                                        >
                                            <Typography fontWeight={600}>{faq.question}</Typography>
                                        </AccordionSummary>
                                        <AccordionDetails sx={{ pt: 0 }}>
                                            <Typography color="text.secondary" lineHeight={1.6}>
                                                {faq.answer}
                                            </Typography>
                                        </AccordionDetails>
                                    </Accordion>
                                </Grid>
                            ))}
                        </Grid>
                    </Card>
                </Grid>

                {/* 🔹 Row 7: Feedback Section */}
                <Grid item xs={12}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            p: { xs: 2, md: 3 },
                            bgcolor: "background.paper",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Leave Feedback
                        </Typography>

                        <Box display="flex" flexDirection="column" gap={2}>
                            {/* Rating */}
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body1" fontWeight={500}>
                                    Your Rating:
                                </Typography>
                                <Rating />
                            </Box>

                            {/* Feedback Text */}
                            <TextField
                                fullWidth
                                label="Write your feedback"
                                placeholder="Share your experience..."
                                multiline
                                rows={4}
                                variant="outlined"
                                sx={{
                                    borderRadius: 2,
                                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                                }}
                            />

                            {/* Submit Button */}
                            <Box textAlign={{ xs: "center", md: "right" }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        borderRadius: 3,
                                        px: 4,
                                        py: 1.5,
                                        textTransform: "none",
                                        fontWeight: 600,
                                        "&:hover": { boxShadow: "0 4px 12px rgba(25,118,210,0.3)" },
                                    }}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Box>
                    </Card>
                </Grid>

                {/* 🔹 Row 8: Meet Your Host */}
                <Grid container spacing={2}>
                    {/* Host Profile */}
                    <Grid item xs={12} md={4}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                p: 3,
                                textAlign: "center",
                                bgcolor: "grey.50",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                            }}
                            elevation={0}
                        >
                            <Box position="relative" display="inline-block" mb={2}>
                                <Avatar
                                    src="https://cdn.pixabay.com/photo/2016/03/23/18/35/avatar-1277519_1280.png"
                                    sx={{ width: 80, height: 80 }}
                                />
                                <CheckCircleIcon
                                    color="success"
                                    sx={{
                                        position: "absolute",
                                        bottom: 0,
                                        right: 0,
                                        bgcolor: "background.paper",
                                        borderRadius: "50%",
                                        border: "2px solid white",
                                        fontSize: 20,
                                    }}
                                />
                            </Box>
                            <Typography variant="subtitle1" fontWeight={600}>
                                Host Name
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Verified Host
                            </Typography>
                        </Card>
                    </Grid>

                    {/* Host Bio */}
                    <Grid item xs={12} md={8}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                p: 3,
                                bgcolor: "background.paper",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                            }}
                            elevation={0}
                        >
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                About the Host
                            </Typography>
                            <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                                This is a short bio of the host. Highlight their expertise, experience,
                                and what makes them special. You can also include a few guest reviews
                                about their service here for credibility.
                            </Typography>
                            <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                                {["Friendly", "Professional", "Experienced", "Verified"].map((tag, i) => (
                                    <Chip key={i} label={tag} size="small" sx={{ borderRadius: 2 }} />
                                ))}
                            </Box>
                        </Card>
                    </Grid>
                </Grid>

            </Grid>
        </Box>
    );
}
