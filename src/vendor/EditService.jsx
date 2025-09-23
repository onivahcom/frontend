import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography, Container, Box, Button, Skeleton, InputLabel, Select, MenuItem, FormControl, Chip, Alert } from '@mui/material';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';
import withLoadingAndError from '../hoc/withLoadingAndError';
import { CheckCircle, Edit, NavigateNext, } from '@mui/icons-material';
import { Divider, } from '@mui/material';
import { useMediaQuery, useTheme } from "@mui/material";
import DateStorer from '../components/DateStorer';
import { format, parseISO } from 'date-fns';
import EditDescriptionModal from '../vendorUtils/EditDescriptionPopover';
import ImageSection from '../utils/DetailedServicePageSections/ImageSection';
import HostCard from '../utils/DetailedServicePageSections/HostCard';
import CustomPricing from '../utils/DetailedServicePageSections/CustomPricing';
import CustomFields from '../utils/DetailedServicePageSections/CustomFields';
import WhyChooseUs from '../utils/DetailedServicePageSections/WhyChooseUs';
import EditWhyUsModal from '../vendorUtils/EditWhyUsModal';
import EditOfferingsModal from '../vendorUtils/EditOfferingsModal';
import EditFieldsModal from '../vendorUtils/EditFieldsModal';


const EditService = ({ loading, setLoading, error, setError, }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const bookingRef = useRef(null);
    const navigate = useNavigate();
    const detailsRef = useRef(null);
    const { service, serviceId } = useParams();  // Destructure the params

    const customerChoiceRaw = localStorage.getItem('customerChoice');
    const [parsedChoice, setParsedChoice] = useState({ location: '', category: '', datesChoosed: [] });

    const serviceName = service;  // Extract 'photography' part
    const [serviceDetails, setService] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [openDescription, setOpenDescription] = useState(false);
    const [openWhyUs, setOpenWhyUs] = useState(false);
    const [openOfferings, setOfferingsOpen] = useState(false);
    const [openFields, setFieldsOpen] = useState(false);

    const [description, setDescription] = useState("");
    const [whyUs, setWhyUs] = useState([]);

    const customFields = serviceDetails?.additionalFields?.customFields || [];
    const customPricing = serviceDetails?.additionalFields?.customPricing || [];
    const allImageUrls = Object.values(serviceDetails?.images || {}).flat();
    const previewImages = allImageUrls;
    const images = serviceDetails?.images;


    useEffect(() => {
        if (customerChoiceRaw) {
            try {
                setParsedChoice(JSON.parse(customerChoiceRaw));
            } catch (error) {
                console.error("Failed to parse localStorage data:", error);
            }
        }
    }, [customerChoiceRaw]);

    const fetchvenueDetails = async () => {

        if (serviceId) {
            try {
                setLoading(true)
                const response = await backendApi.get(`/vendor/category/${serviceName}/${serviceId}`);
                setService(response.data);
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

    useEffect(() => {
        fetchvenueDetails();
    }, [serviceId]);

    const handleSave = async (updatedValue) => {
        setDescription(updatedValue);

        try {
            await backendApi.put(`/vendor/update-description`, {
                serviceId: serviceId, // Make sure this is passed correctly
                newDescription: updatedValue,
            },
                {
                    withCredentials: true
                },);
            fetchvenueDetails();
        } catch (err) {
            console.error('Failed to update description:', err);
        }
    };


    const handleDateChange = (updatedChoice) => {
        const newChoice = { ...parsedChoice, ...updatedChoice };
        setParsedChoice(newChoice);
    };


    const scrollToDetails = () => {
        // setShowAll(true);
        setTimeout(() => {
            detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // slight delay to allow render
    };

    const handleEdit = () => {
        navigate('/vendor-dashboard/manage-gallery', {
            state: { serviceId: serviceId },
        });
    };

    const handleAvailability = () => {
        navigate('/vendor-dashboard/available-dates', {
            state: { category: serviceDetails.category, businessName: serviceDetails.additionalFields?.businessName, id: serviceDetails._id },
        });
    };

    const handleGeneratedReasons = async (reasons) => {
        try {
            await backendApi.put(`/vendor/update-whyus`, {
                serviceId: serviceId, // Make sure this is passed correctly
                newWhyus: reasons,
            },
                {
                    withCredentials: true
                },);
            setOpenWhyUs(false);
            fetchvenueDetails();
        } catch (err) {
            console.error('Failed to update why us:', err);
        }
    };

    const updatePricing = async (pricing) => {
        try {
            await backendApi.put(`/vendor/update-pricings`, {
                serviceId: serviceId, // Make sure this is passed correctly
                pricings: pricing,
            },
                {
                    withCredentials: true
                },);
            setOfferingsOpen(false);
            fetchvenueDetails();
        } catch (err) {
            console.error('Failed to update why us:', err);
        }

    };

    const updateFields = async (fields) => {
        try {
            await backendApi.put(`/vendor/update-fields`, {
                serviceId: serviceId, // Make sure this is passed correctly
                fields: fields,
            },
                {
                    withCredentials: true
                },);
            setFieldsOpen(false);
            fetchvenueDetails();
        } catch (err) {
            console.error('Failed to update why us:', err);
        }

    };

    return (
        <Box>
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

                <Box sx={{ display: "flex", justifyContent: "center" }}>

                    <Grid container sx={{ p: { xs: 2, md: 5 } }} maxWidth='lg'>

                        {/* Business Name */}

                        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                            <Typography variant="h6" paragraph sx={{ mb: 0 }}>
                                {serviceDetails.additionalFields?.businessName}
                            </Typography>
                        </Grid>

                        {/* Alert */}
                        <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                            <Alert
                                severity="warning"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.75rem',
                                    fontStyle: 'italic',
                                    borderRadius: 2,
                                    backgroundColor: '#fff8e1',
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}
                            >
                                Note: You can manage your gallery by uploading new images or deleting existing ones.
                                <Button
                                    size="small"
                                    endIcon={<Edit />}
                                    variant="text"
                                    color="info"
                                    onClick={handleEdit}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        ml: 1,
                                    }}
                                >
                                    Edit Gallery
                                </Button>
                            </Alert>
                        </Grid>

                        {/*  images */}
                        <Grid item xs={12} md={12} sx={{ mb: 2, p: 0 }}>
                            <ImageSection previewImages={previewImages} allImageUrls={allImageUrls} images={images} />
                        </Grid>

                        {/* service descrption */}
                        <Grid item xs={12} md={8}>
                            <Typography variant="body1" fontWeight={500} mb={1}>
                                About {serviceDetails.additionalFields?.businessName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {serviceDetails.additionalFields?.description}
                            </Typography>

                            <Alert
                                severity="warning"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.75rem',
                                    fontStyle: 'italic',
                                    maxWidth: 400,
                                    borderRadius: 2,
                                    backgroundColor: '#fff8e1', // light warning yellow
                                    mt: { xs: 1, md: 2 },
                                    mb: 1
                                }}
                            >
                                Note: You can edit description.
                                <Button
                                    size='small'
                                    endIcon={<Edit />}
                                    variant="text"
                                    color='info'
                                    onClick={() => {
                                        setOpenDescription(true);
                                        setDescription(serviceDetails?.additionalFields?.description);
                                    }}
                                    sx={{
                                        borderRadius: 2,
                                        width: 'fit-content',
                                        textTransform: "none",
                                    }}
                                >
                                    Edit Description
                                </Button>
                            </Alert>

                            {/* host card */}
                            <HostCard vendorDetails={serviceDetails?.vendorDetails} amenities={serviceDetails.additionalFields?.amenities} />

                            <EditDescriptionModal
                                open={openDescription}
                                handleClose={() => setOpenDescription(false)}
                                initialValue={description}
                                onSave={handleSave}
                            />

                            <Divider sx={{ margin: '10px 0' }} />

                            {/* highlights */}
                            <Box mt={4}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="body2" fontWeight={500} gutterBottom sx={{ mb: 0 }}>
                                        Highlights
                                    </Typography>

                                    {serviceDetails.additionalFields.customFields.length > 0 && (
                                        <Button
                                            endIcon={<NavigateNext />}
                                            variant="text"
                                            size="small"
                                            onClick={scrollToDetails}
                                            sx={{
                                                px: 2,
                                                py: 0.5,
                                                color: "royalblue",
                                                borderColor: "royalblue",
                                                borderRadius: 2,
                                                fontSize: '0.75rem',
                                                textTransform: 'none',
                                                transition: 'all 0.2s ease',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(65, 105, 225, 0.1)', // light royal blue bg
                                                    borderColor: 'royalblue'
                                                }
                                            }}
                                        >
                                            View Additional Details
                                        </Button>
                                    )}
                                </Box>

                                {serviceDetails.additionalFields.customFields.length > 0 && (
                                    <>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                            {serviceDetails.additionalFields.customFields.slice(0, 3).map((field, index) => (
                                                <Chip
                                                    key={index}
                                                    label={field.name || `Custom Field ${index + 1}`}
                                                    variant="outlined"
                                                    sx={{
                                                        backgroundColor: 'white',
                                                        fontSize: '0.75rem',
                                                        color: 'black',
                                                        borderRadius: 2,

                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    </>
                                )}
                            </Box>

                        </Grid>

                        {/* booking summary */}
                        <Grid item xs={12} sm={4} sx={{ mb: 2, p: { xs: 1, md: 2 } }}>
                            <Box
                                sx={{
                                    p: { xs: 1, md: 2 },
                                    borderRadius: 2,
                                    backgroundColor: '#f5f2ffc4',
                                    border: "1px solid #eeee",
                                }}
                            >
                                <img src={allImageUrls[0]} style={{ width: "100%", height: isMobile ? "120px" : "200px", objectFit: "cover", borderRadius: '10px', }} />

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
                                        <FormControl fullWidth size="small" sx={{ my: 1 }}>
                                            <InputLabel id="location-label">Select Location</InputLabel>
                                            <Select
                                                labelId="location-label"
                                                label="Select Location"
                                                defaultValue={
                                                    parsedChoice.location?.[0] ||
                                                    serviceDetails.additionalFields.availableLocations?.[0] || ""
                                                }
                                                onChange={(e) => {
                                                    const selectedLocation = e.target.value;

                                                    // Get current customerChoice
                                                    const currentChoice = JSON.parse(localStorage.getItem("customerChoice")) || {};

                                                    // Update location field with selected value in an array
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
                                        variant="contained"
                                        color="primary"
                                        startIcon={<CheckCircle />}
                                        sx={{
                                            // maxWidth: 300,
                                            height: "50%",
                                            borderRadius: "10px",
                                            // width: 'fit-content',
                                            fontWeight: 600,
                                            background: "linear-gradient(45deg, #6d4d94, #9b59b6)",
                                            color: "#fff",
                                            transition: "0.3s ease",
                                            '&:hover': {
                                                background: "linear-gradient(45deg, #5a3e7b, #884ea0)",
                                                transform: "scale(1.02)",
                                            },
                                            boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
                                        }}
                                    >
                                        Reserve
                                    </Button>

                                </Box>
                            </Box>
                        </Grid>

                        <Divider sx={{ py: 3 }} />

                        {/* pricing */}

                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end", // push to the end horizontally
                                mt: 4, // margin top for spacing
                                width: "100%"
                            }}
                        >
                            <Alert
                                severity="warning"
                                variant="outlined"
                                sx={{
                                    fontSize: "0.75rem",
                                    fontStyle: "italic",
                                    maxWidth: 400,
                                    borderRadius: 2,
                                    backgroundColor: "#fff8e1",
                                }}
                                action={
                                    <Button
                                        size="small"
                                        endIcon={<Edit />}
                                        variant="text"
                                        color="info"
                                        onClick={() => setOfferingsOpen(true)}
                                        sx={{
                                            borderRadius: 2,
                                            width: "fit-content",
                                            textTransform: "none",
                                        }}
                                    >
                                        Edit Offerings
                                    </Button>
                                }
                            >
                                Note: You can edit Offerings.
                            </Alert>
                        </Box>
                        {
                            serviceDetails.additionalFields?.customPricing?.length > 0 &&
                            <Box ref={detailsRef} sx={{ width: "100%" }}>
                                <CustomPricing pricings={customPricing || []} />
                            </Box>
                        }
                        <EditOfferingsModal
                            open={openOfferings}
                            handleClose={() => setOfferingsOpen(false)}
                            initialValue={customPricing || []}
                            onSave={updatePricing}
                        />

                        {/* custom fields */}
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end", // push to the end horizontally
                                mb: 4, // margin top for spacing
                                width: "100%"
                            }}
                        >
                            <Alert
                                severity="warning"
                                variant="outlined"
                                sx={{
                                    fontSize: "0.75rem",
                                    fontStyle: "italic",
                                    maxWidth: 400,
                                    borderRadius: 2,
                                    backgroundColor: "#fff8e1",
                                }}
                                action={
                                    <Button
                                        size="small"
                                        endIcon={<Edit />}
                                        variant="text"
                                        color="info"
                                        onClick={() => setFieldsOpen(true)}
                                        sx={{
                                            borderRadius: 2,
                                            width: "fit-content",
                                            textTransform: "none",
                                        }}
                                    >
                                        Edit
                                    </Button>
                                }
                            >
                                Note: You can edit your custom fields.
                            </Alert>
                        </Box>
                        {
                            serviceDetails.additionalFields?.customFields?.length > 0 &&
                            <Box ref={detailsRef} sx={{ width: "100%" }}>
                                <CustomFields fields={customFields || []} />
                            </Box>
                        }
                        <EditFieldsModal
                            open={openFields}
                            handleClose={() => setFieldsOpen(false)}
                            initialValue={customFields || []}
                            onSave={updateFields}
                        />

                        {/* view availablity */}
                        <Grid sx={{ mt: 5, }} item xs={12} sm={6} md={8} lg={8} ref={bookingRef}
                        >
                            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'start', mb: 5 }}>

                                <Alert
                                    severity="warning"
                                    variant="outlined"
                                    sx={{
                                        fontSize: '0.75rem',
                                        fontStyle: 'italic',
                                        maxWidth: 400,
                                        borderRadius: 2,
                                        backgroundColor: '#fff8e1', // light warning yellow
                                        mt: { xs: 1, md: 0 }
                                    }}
                                >
                                    Note: You can manage your booking availability by setting the days and time slots you're open for appointments.
                                    <Button
                                        size='small'
                                        endIcon={<Edit />}
                                        variant="text"
                                        color='info'
                                        onClick={handleAvailability}
                                        sx={{
                                            borderRadius: 2,
                                            width: 'fit-content',
                                            textTransform: "none",
                                        }}
                                    >
                                        Manage Availability
                                    </Button>
                                </Alert>


                            </Box>


                            <DateStorer onDateChange={handleDateChange}
                                // bookedDates={serviceDetails?.dates.booked}
                                bookedDates={serviceDetails?.dates?.booked ?? []}

                            />
                        </Grid>

                        {/* booking summary */}
                        <Grid item xs={12} sm={6} md={4} lg={4}>
                            <Box component='img' src='https://placehold.co' sx={{ borderRadius: 4 }} />
                        </Grid>

                        {/*  Why Choose This Venue */}
                        <Box
                            sx={{
                                mb: 5,
                                py: 6,
                                px: { xs: 1, md: 3 },
                                borderRadius: 2,
                            }}
                        >
                            {/* Flex container for title & alert */}
                            <Box
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap", // so it stacks on small screens
                                    gap: 2,
                                    mb: 3,
                                }}
                            >
                                {/* Title */}
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{
                                        position: "relative",
                                        display: "inline-block",
                                        px: 2,
                                        "&::after": {
                                            content: '""',
                                            display: "block",
                                            width: "60%",
                                            height: "3px",
                                            borderRadius: "2px",
                                            background: "linear-gradient(90deg, #6a5acd, #b19cd9)",
                                            margin: "8px auto 0",
                                        },
                                    }}
                                >
                                    Why Choose{" "}
                                    <Box component="span" sx={{ color: "primary.main" }}>
                                        {serviceDetails.additionalFields.businessName}
                                    </Box>{" "}
                                    ?
                                </Typography>

                                {/* Alert */}
                                <Alert
                                    severity="warning"
                                    variant="outlined"
                                    sx={{
                                        fontSize: "0.75rem",
                                        fontStyle: "italic",
                                        maxWidth: 400,
                                        borderRadius: 2,
                                        backgroundColor: "#fff8e1",
                                    }}
                                    action={
                                        <Button
                                            size="small"
                                            endIcon={<Edit />}
                                            variant="text"
                                            color="info"
                                            onClick={() => {
                                                setOpenWhyUs(true);
                                            }}
                                            sx={{
                                                borderRadius: 2,
                                                width: "fit-content",
                                                textTransform: "none",
                                            }}
                                        >
                                            Edit Why Us
                                        </Button>
                                    }
                                >
                                    Note: You can edit description.
                                </Alert>
                            </Box>

                            {/* Why Choose Us section */}
                            <WhyChooseUs
                                whyChooseUs={serviceDetails.additionalFields?.generatedWhyUs}
                            />

                            <EditWhyUsModal
                                open={openWhyUs}
                                handleClose={() => setOpenWhyUs(false)}
                                initialValue={serviceDetails.additionalFields?.generatedWhyUs || []}
                                customPricing={customPricing}
                                CustomFields={customFields}
                                onGenerate={handleGeneratedReasons}
                            />


                        </Box>




                    </Grid >
                </Box >

            }

        </Box >
    );
};

export default withLoadingAndError(EditService);
