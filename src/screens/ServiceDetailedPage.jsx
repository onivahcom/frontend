import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography, Container, Box, Button, Skeleton, Accordion, AccordionSummary, AccordionDetails, Card, Stack, InputLabel, Select, MenuItem, FormControl, Chip, Menu, Drawer, CardContent, Collapse, Avatar, } from '@mui/material';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';
import withLoadingAndError from '../hoc/withLoadingAndError';
import FooterComponent from '../components/FooterComponent';
import Header from '../components/Header';
import { CheckCircle, ExpandMore, Favorite, FavoriteBorder, IosShare, NavigateNext, Close } from '@mui/icons-material';
import {
    TextField, Divider, IconButton,
} from '@mui/material';
import { useMediaQuery, useTheme } from "@mui/material";
import DateStorer from '../components/DateStorer';
import { format, parseISO } from 'date-fns';
import { useFavorites } from '../Favourites/FavoritesContext';
import FeedbackSection from '../utils/FeedbackSection';
import BottomActionBar from '../utils/BottomActionBar';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import ReportDialog from '../components/ReportService';
import MeetYourHost from '../components/MeetYourHost';
import HostCard from '../utils/DetailedServicePageSections/HostCard';
import CustomPricing from '../utils/DetailedServicePageSections/CustomPricing';
import CustomFields from '../utils/DetailedServicePageSections/CustomFields';
import WhyChooseUs from '../utils/DetailedServicePageSections/WhyChooseUs';
import RatingsReviews from '../utils/DetailedServicePageSections/RatingsReviews';
import ImageSection from '../utils/DetailedServicePageSections/ImageSection';
import ContentBasedSuggestions from '../components/recommendations/ContentBasedSuggestions';
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VerifiedUser from '@mui/icons-material/VerifiedUser';


const faqs = [
    {
        question: "How do I book a service on this platform?",
        answer: "You can check availability and confirm your booking by selecting a date and completing the inquiry or payment form.",
    },
    {
        question: "Can I check availability before booking?",
        answer: "Yes, most services have a real-time calendar. You can also chat with vendors to double-check availability.",
    },
    {
        question: "What is the cancellation and refund policy?",
        answer: "Cancellation policies differ by vendor. Most offer full refunds up to a certain period. Please check the policy listed on each service page.",
    },
    {
        question: "Are the prices final or negotiable?",
        answer: "The listed price is usually the base rate. You can request a custom quote or chat with the vendor to negotiate.",
    },
    {
        question: "Can I customize the service package?",
        answer: "Absolutely! You can choose add-ons like drone shots, special decor, or theme-based customization when available.",
    },
    {
        question: "How do payments work?",
        answer: "Payments can be made online securely. Vendors may accept full payment upfront or partial payments based on their policy.",
    },
];

const ServiceDetailedPage = ({ loading, setLoading, error, setError }) => {

    const theme = useTheme();
    const bookingRef = useRef(null);
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { favorites, toggleFavorite } = useFavorites(); // Use global favorites context
    const { service, serviceId } = useParams();  // Destructure the params
    const serviceName = service;  // Extract 'photography' part

    const [userData, setUserData] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const [serviceDetails, setService] = useState(null);
    const [feedback, setFeedback] = useState([]);


    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await backendApi.get(`/protected-route`, {
                    withCredentials: true,
                    headers: { 'Cache-Control': 'no-cache' }
                });
                setUserData(response.data.user);
            }
            catch (error) {
                if (error.response?.status === 403) {

                    try {
                        const refreshRes = await backendApi.get(`/refreshToken/refresh`, {
                            withCredentials: true,
                        });

                        const retryRes = await backendApi.get(`/protected-route`, {
                            withCredentials: true,
                        });
                        setUserData(retryRes.data.user);
                        return;
                    } catch (refreshError) {
                        setSnackbar({
                            open: true,
                            message: "Session expired. Please log in again.",
                            severity: "warning",
                        });
                        // navigate("/");
                        return;
                    }
                }

                // 401 or other errors
                if (error.response?.status === 401) {
                    setSnackbar({
                        open: true,
                        message: "Kindly login to continue.",
                        severity: "warning",
                    });
                }
                else {
                    setSnackbar({
                        open: true,
                        message: "Something went wrong. Please try again later.",
                        severity: "error",
                    });
                }
            } finally {
                setLoading(false);
            }

        };

        fetchProtectedData();
    }, [navigate]);

    // Get existing customerChoice data from localStorage
    const customerChoiceRaw = localStorage.getItem('customerChoice');
    const [parsedChoice, setParsedChoice] = useState({ location: '', category: '', datesChoosed: [] });
    const [selectedPackage, setSelectedPackage] = useState(null);

    useEffect(() => {
        if (customerChoiceRaw) {
            try {
                // If no location, set the first available location
                if (!parsedChoice.location && service?.additionalFields?.availableLocations?.length > 0) {
                    parsedChoice.location = service.additionalFields.availableLocations[0];
                }

                setParsedChoice(JSON.parse(customerChoiceRaw));
            } catch (error) {
                console.error("Failed to parse localStorage data:", error);
            }
        }
    }, [customerChoiceRaw]);

    function addRecentlyViewed(category, serviceId) {
        if (!category || !serviceId) return;

        let viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

        // Create new entry
        const newItem = { category, serviceId };

        // Remove if already exists (match both category + serviceId)
        viewed = viewed.filter(
            item => !(item.category === category && item.serviceId === serviceId)
        );

        // Add to start
        viewed.unshift(newItem);

        // Limit to last 6
        if (viewed.length > 6) viewed.pop();

        localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
    }


    useEffect(() => {
        const fetchvenueDetails = async () => {

            if (serviceId) {
                try {
                    setLoading(true)
                    const response = await backendApi.get(`/category/${serviceName}/${serviceId}`);
                    setService(response.data);
                    console.log(response.data);
                    addRecentlyViewed(response?.data?.category, response?.data?._id)
                    setFeedback(response.data.feedbacks)
                    setLoading(false)
                } catch (err) {
                    setLoading(false)
                    setService(null)
                    if (err.response) {
                        setError(err.response.data.error); // Access the error message from the response
                    } else {
                        setError('An unexpected error occurred'); // Generic error message
                    }
                }
            }
        };

        fetchvenueDetails();
    }, [serviceId]);


    const [anchorEl, setAnchorEl] = useState(null);
    const openShare = Boolean(anchorEl);

    const handleShareClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseShare = () => {
        setAnchorEl(null);
    };

    const handleSubmit = () => {
        // List of required fields
        const missingFields = [];

        if (!parsedChoice.location || parsedChoice.location.length === 0) missingFields.push("Location");
        if (!selectedPackage || Object.keys(selectedPackage).length === 0) missingFields.push("Package");
        if (!parsedChoice.datesChoosed || parsedChoice.datesChoosed.length === 0) missingFields.push("Date");
        if (!parsedChoice.datesChoosed || parsedChoice.datesChoosed.length === 0) missingFields.push("Date");

        if (missingFields.length > 0) {
            alert(`Please fill/select the following fields before proceeding:\n- ${missingFields.join("\n- ")}`);
            return;
        }

        // Prepare state object
        const stateData = {
            _id: serviceDetails._id,
            userId: userData?._id,
            vendorId: serviceDetails.vendorId,
            category: serviceDetails.category,
            imageUrls: serviceDetails.images.CoverImage[0],
            businessName: serviceDetails.additionalFields.businessName,
            location: parsedChoice.location,
            package: selectedPackage,
            selectedDate: parsedChoice.datesChoosed,
            isChecked: true,
        };

        // Log the values
        console.log("Navigating with state:", stateData);

        // Navigate
        navigate(`/checkout/${serviceDetails._id}`, { state: stateData });
    };


    const handleDateChange = (updatedChoice) => {
        const newChoice = { ...parsedChoice, ...updatedChoice };
        setParsedChoice(newChoice); // ✅ This triggers re-render
        // localStorage.setItem('customerChoice', JSON.stringify(newChoice));
    };


    const detailsRef = useRef(null);
    const fullText = serviceDetails?.additionalFields?.description;

    const showReadMore = fullText?.length

    const scrollToDetails = () => {
        // setShowAll(true);
        setTimeout(() => {
            detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // slight delay to allow render
    };

    const [activeConversation, setActiveConversation] = useState(null);

    const handleConversationCreated = (conversation) => {
        navigate(`/messages/${conversation._id}`, {
            state: {
                userId: userData._id,             // current user
                conversationData: {
                    _id: conversation._id,
                    serviceId: conversation.serviceId,
                    serviceCategory: conversation.serviceCategory,
                    userId: conversation.userId,
                    vendorId: conversation.vendorId,
                    createdAt: conversation.createdAt,
                }
            }
        });
    };


    const fields = serviceDetails?.additionalFields?.customFields || [];
    const allImageUrls = Object.values(serviceDetails?.images || {}).flat();
    const previewImages = allImageUrls;
    const images = serviceDetails?.images;
    const vendorDetails = serviceDetails?.vendorDetails;

    return (
        <Box p={{ xs: 2, md: 4 }} maxWidth='xl' mx='auto' >

            {error && <Typography variant="body2" color="error">{error}</Typography>} {/* Changed to show error message properly */}

            {
                loading && <Container maxWidth="lg">
                    <Grid container spacing={4} sx={{ mt: 5, minHeight: "100vh" }}>
                        {/* Left Side - Product Image */}
                        <Grid item xs={12} md={6}>
                            <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }} />
                        </Grid>

                        {/* Right Side - Product Details */}
                        <Grid item xs={12} md={6}>
                            <Box>
                                {/* Product Title Skeleton */}
                                <Skeleton variant="text" width="80%" height={40} />

                                {/* Price Skeleton */}
                                <Skeleton variant="text" width="30%" height={30} sx={{ mt: 1 }} />

                                {/* Description Skeleton */}
                                <Skeleton variant="text" width="100%" height={20} />
                                <Skeleton variant="text" width="95%" height={20} />
                                <Skeleton variant="text" width="90%" height={20} sx={{ mb: 2 }} />

                                {/* Rating Skeleton */}
                                <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
                                    {[...Array(5)].map((_, i) => (
                                        <Skeleton key={i} variant="circular" width={24} height={24} />
                                    ))}
                                </Box>

                                {/* Buttons Skeleton */}
                                <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                                    <Skeleton variant="rectangular" width={140} height={50} sx={{ borderRadius: 2 }} />
                                    <Skeleton variant="rectangular" width={140} height={50} sx={{ borderRadius: 2 }} />
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            }




            {
                serviceDetails &&

                <>
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
                                    onClick={handleShareClick}
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
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(serviceDetails);
                                    }}
                                >
                                    {favorites.some((item) => item._id === serviceDetails._id) ? (
                                        <Favorite fontSize='small' color="error" />
                                    ) : (
                                        <FavoriteBorder fontSize='small' sx={{ color: "gray" }} />
                                    )}
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
                                        height: { xs: "auto", md: '100vh' }, // Half screen
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
                                    <Typography variant="subtitle2" fontWeight={600}>
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

                                <Box
                                    sx={{
                                        p: { xs: 1, md: 2 },
                                        borderRadius: 2,
                                        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                                        bgcolor: "background.paper",
                                        border: "1px solid #eeee",
                                    }}
                                >
                                    <img src={allImageUrls[0]} style={{ width: "100%", height: isMobile ? "120px" : 150, objectFit: "cover", borderRadius: '10px', }} />

                                    <Grid container spacing={2} mt={2}>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                sx={{ cursor: !parsedChoice?.datesChoosed?.length ? "pointer" : "default", color: !parsedChoice?.datesChoosed?.length ? "primary.main" : "inherit" }}
                                                onClick={() => {
                                                    if (!parsedChoice?.datesChoosed?.length && bookingRef?.current) {
                                                        bookingRef.current.scrollIntoView({ behavior: "smooth" });
                                                    }
                                                    if (open) {
                                                        setOpen(false);
                                                    }
                                                }}
                                            >
                                                {parsedChoice?.datesChoosed?.[0]
                                                    ? format(parseISO(parsedChoice.datesChoosed[0]), "dd MMM yyyy")
                                                    : "Choose Date"}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                sx={{ cursor: !parsedChoice?.datesChoosed?.length ? "pointer" : "default", color: !parsedChoice?.datesChoosed?.length ? "primary.main" : "inherit" }}
                                                onClick={() => {
                                                    if (!parsedChoice?.datesChoosed?.length && bookingRef?.current) {
                                                        bookingRef.current.scrollIntoView({ behavior: "smooth" });
                                                    }
                                                    if (open) {
                                                        setOpen(false);
                                                    }
                                                }}
                                            >
                                                {parsedChoice?.datesChoosed?.at(-1)
                                                    ? format(parseISO(parsedChoice.datesChoosed.at(-1)), "dd MMM yyyy")
                                                    : "Choose Date"}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Days</Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                {parsedChoice.datesChoosed.length}</Typography>

                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography variant="subtitle2" color="text.secondary">Price/Day</Typography>
                                            <Typography variant="body2" fontWeight={500}>
                                                ₹{serviceDetails.additionalFields.priceRange}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth size="small">
                                                <InputLabel id="location-label">Select Location</InputLabel>
                                                <Select
                                                    labelId="location-label"
                                                    label="Select Location"
                                                    value={parsedChoice.location || ''} // controlled value
                                                    onChange={(e) => {
                                                        const selectedLocation = e.target.value;

                                                        setParsedChoice(prev => ({ ...prev, location: selectedLocation }));

                                                        const currentChoiceStr = localStorage.getItem("customerChoice");
                                                        let currentChoice = {};
                                                        try {
                                                            currentChoice = currentChoiceStr ? JSON.parse(currentChoiceStr) : {};
                                                        } catch (err) {
                                                            currentChoice = {};
                                                        }

                                                        const updatedChoice = {
                                                            ...currentChoice,
                                                            location: [selectedLocation],
                                                        };

                                                        localStorage.setItem("customerChoice", JSON.stringify(updatedChoice));
                                                    }}
                                                >
                                                    {serviceDetails.additionalFields.availableLocations?.map((loc, index) => (
                                                        <MenuItem key={index} value={loc}>
                                                            {loc}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>

                                        </Grid>

                                    </Grid>

                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 1,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <Button
                                            color="primary"
                                            onClick={handleSubmit}
                                            startIcon={<CheckCircle />}
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
                                            Pay & Reserve
                                        </Button>

                                    </Box>
                                </Box>

                            </Drawer>

                            {/* Share Menu (like YouTube) */}
                            <Menu
                                anchorEl={anchorEl}
                                open={openShare}
                                onClose={handleCloseShare}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                sx={{
                                    '& .MuiPaper-root': {
                                        borderRadius: 2,
                                        minWidth: 220,
                                        boxShadow: 4,
                                        py: 1,
                                    },
                                }}
                            >
                                <Typography
                                    variant="subtitle2"
                                    sx={{ px: 2, py: 1, color: 'text.secondary', fontWeight: 500 }}
                                >
                                    Share this service
                                </Typography>

                                <MenuItem
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        handleCloseShare();
                                    }}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        '&:hover': { backgroundColor: 'action.hover' },
                                    }}
                                >
                                    <ContentCopyIcon fontSize="small" sx={{ mr: 1.5, color: 'primary.main' }} />
                                    <Typography variant="body2">Copy Link</Typography>
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank');
                                        handleCloseShare();
                                    }}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        '&:hover': { backgroundColor: 'action.hover' },
                                    }}
                                >
                                    <WhatsAppIcon fontSize="small" sx={{ mr: 1.5, color: '#25D366' }} />
                                    <Typography variant="body2">WhatsApp</Typography>
                                </MenuItem>

                                <MenuItem
                                    onClick={() => {
                                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                                        handleCloseShare();
                                    }}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        '&:hover': { backgroundColor: 'action.hover' },
                                    }}
                                >
                                    <FacebookIcon fontSize="small" sx={{ mr: 1.5, color: '#4267B2' }} />
                                    <Typography variant="body2">Facebook</Typography>
                                </MenuItem>
                            </Menu>
                        </Grid>

                        {/* 🔹 Row 1: Hero Gallery (Collage Style) */}
                        <ImageSection previewImages={previewImages} allImageUrls={allImageUrls} images={images} />

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
                                        {serviceDetails.additionalFields.businessName}
                                    </Typography>

                                    {/* Host Info */}
                                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                                        <Avatar
                                            src="https://randomuser.me/api/portraits/women/44.jpg"
                                            alt="Host"
                                            sx={{ width: 32, height: 32 }}
                                        />
                                        <Typography variant="body1" fontWeight={600}>
                                            Hosted by {vendorDetails?.firstName}
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
                                                {expanded || !showReadMore ? fullText : `${fullText.slice(0, 400)}...`}
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
                                                icon={<CheckCircle />}
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
                        {serviceDetails.additionalFields.customFields.length > 0 && (
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
                                    {fields.map((h, i) => (
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
                                                {h.name}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Card>
                            </Grid>

                        )}

                        {/* Amenities */}
                        {serviceDetails.additionalFields?.amenities?.length > 0 && (
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
                                        {serviceDetails.additionalFields.amenities.map(
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
                        )}

                        {/* 🔹 Row 3: Pricing & Custom Fields */}
                        {
                            serviceDetails.additionalFields?.customPricing?.length > 0 &&
                            <CustomPricing ref={detailsRef} pricings={serviceDetails.additionalFields?.customPricing || []}
                                onSelect={(pkg) => setSelectedPackage(pkg)} // ✅ save in state
                            />
                        }

                        {/* custom fields */}
                        {
                            serviceDetails.additionalFields?.customFields?.length > 0 &&
                            <CustomFields fields={fields} />
                        }

                        {/* view availablity */}
                        <Grid item xs={12} md={6} ref={bookingRef}>
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
                                {/* <Box

                                    sx={{
                                        width: "100%",
                                        display: "flex",
                                        justifyContent: "center", // centers calendar horizontally
                                        "& .rdrCalendarWrapper": { border: "none", fontFamily: "inherit" },
                                        "& .rdrDay": { borderRadius: "50%" },
                                        // "& .rdrDay:hover": { backgroundColor: "#1976d2", color: "#fff" },
                                        // "& .rdrSelected, & .rdrStartEdge, & .rdrEndEdge": {
                                        //     backgroundColor: "#1976d2",
                                        //     color: "#fff",
                                        // },
                                        "& .rdrMonthAndYearPickers, & .rdrMonthName": {
                                            color: "#1976d2",
                                            fontWeight: 600,
                                        },
                                    }}
                                > */}
                                <DateStorer onDateChange={handleDateChange}
                                    bookedDates={serviceDetails?.dates?.booked ?? []}
                                    availableDates={serviceDetails?.dates?.available ?? []}
                                />
                                {/* </Box> */}
                            </Card>
                        </Grid>

                        <WhyChooseUs whyChooseUs={serviceDetails.additionalFields.generatedWhyUs} />

                        {/* review and rating */}
                        <RatingsReviews feedback={feedback} />

                        {/* faq */}
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
                                    {faqs.map((faq, i) => (
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
                                                    expandIcon={<ExpandMore />}
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

                        {/* feedback */}
                        <Grid item xs={12}>
                            <FeedbackSection serviceId={serviceDetails._id} category={serviceDetails.category} />
                        </Grid>

                        {/* Report Venue */}
                        <ReportDialog
                            vendorId={serviceDetails.vendorId}
                            serviceId={serviceDetails._id}
                            categoryName={serviceDetails.category}
                            userData={userData}
                        />


                        {/* meet your host */}
                        <MeetYourHost />

                        <ContentBasedSuggestions serviceId={serviceId} />


                        {/* bottom bar to show quick actions */}
                        {/* <BottomActionBar
                                userData={userData}
                                serviceDetails={serviceDetails}
                                activeConversation={activeConversation}
                                // handleScroll={handleScroll}
                                handleConversationCreated={handleConversationCreated}
                            /> */}

                    </Grid >
                </>
            }

            <FooterComponent />

        </Box >
    );
};

export default withLoadingAndError(ServiceDetailedPage);
