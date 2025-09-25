import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, Typography, Container, Box, Button, Skeleton, InputLabel, Select, MenuItem, FormControl, Chip, Alert, CardContent, Card, Avatar } from '@mui/material';
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
import VerifiedUser from '@mui/icons-material/VerifiedUser';


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

                    <Grid container sx={{ p: { xs: 2, md: 1 } }} maxWidth='xl'>


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
                        {/* <Grid item xs={12} md={12} sx={{ mb: 2, p: 0 }}> */}
                        <ImageSection previewImages={previewImages} allImageUrls={allImageUrls} images={images} />
                        {/* </Grid> */}

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
                                            src="https://placehold.co/300"
                                            alt="Host"
                                            sx={{ width: 32, height: 32 }}
                                        />
                                        <Typography variant="body1" fontWeight={600}>
                                            Hosted by You
                                        </Typography>
                                        <VerifiedUser fontSize="small" />
                                    </Box>

                                    {/* Short Description */}
                                    <Box sx={{ mb: 2 }}>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                        >
                                            {serviceDetails.additionalFields?.description.slice(0, 150)}...
                                        </Typography>

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
                            </Card>
                        </Grid>

                        <EditDescriptionModal
                            open={openDescription}
                            handleClose={() => setOpenDescription(false)}
                            initialValue={description}
                            onSave={handleSave}
                        />

                        {/* service descrption */}
                        {serviceDetails.additionalFields?.customFields?.length > 0 && (
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
                                    {serviceDetails.additionalFields?.customFields.map((h, i) => (
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
                            <CustomPricing ref={detailsRef} pricings={serviceDetails.additionalFields?.customPricing || []}
                            // onSelect={(pkg) => setSelectedPackage(pkg)} 
                            />
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
                        <Grid item xs={12} md={6}>

                            <Alert
                                severity="warning"
                                variant="outlined"
                                sx={{
                                    fontSize: '0.75rem',
                                    fontStyle: 'italic',
                                    maxWidth: 400,
                                    borderRadius: 2,
                                    backgroundColor: '#fff8e1', // light warning yellow
                                    mt: { xs: 1, md: 0 },
                                    mb: 2
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

                            <DateStorer onDateChange={handleDateChange}
                                // bookedDates={serviceDetails?.dates.booked}
                                bookedDates={serviceDetails?.dates?.booked ?? []}

                            />
                        </Grid>



                        {/* Why Choose Us section */}
                        <WhyChooseUs
                            whyChooseUs={serviceDetails.additionalFields?.generatedWhyUs}
                        />

                        <Grid item xs={12} display='flex' justifyContent='end'>
                            <Alert
                                severity="warning"
                                variant="outlined"
                                sx={{
                                    fontSize: "0.75rem",
                                    fontStyle: "italic",
                                    maxWidth: 400,
                                    maxHeight: 'auto',
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
                        </Grid>

                        <EditWhyUsModal
                            open={openWhyUs}
                            handleClose={() => setOpenWhyUs(false)}
                            initialValue={serviceDetails.additionalFields?.generatedWhyUs || []}
                            customPricing={customPricing}
                            CustomFields={customFields}
                            onGenerate={handleGeneratedReasons}
                        />
                    </Grid>


                </Box >

            }

        </Box >
    );
};

export default withLoadingAndError(EditService);
