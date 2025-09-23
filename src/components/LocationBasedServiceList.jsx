import React, { useEffect, useState } from "react";
import {
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Alert,
    Box,
    Button,
    Chip,
    Stack,
    Switch,
    Tooltip,
    AlertTitle,
    Skeleton,
} from "@mui/material";
import axios from "axios";
import { apiUrl, backendApi } from "../Api/Api";
import { Fragment } from 'react';
import IconButton from '@mui/material/IconButton';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { is } from "date-fns/locale";
import { InfoOutlined, LocationOff } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import { Link, useNavigate } from "react-router-dom";
import LocationOn from "@mui/icons-material/LocationOn";


const LocationBasedServiceList = () => {

    const navigate = useNavigate();

    const [detectedCity, setDetectedCity] = useState("");
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [locationError, setLocationError] = useState("");
    const [isLocation, setLocation] = useState(false);
    const [showPrompt, setShowPrompt] = useState(null);
    const [nearbyAreas, setAreas] = useState([]);

    useEffect(() => {
        const locSession = sessionStorage.getItem("locSession");
        if (locSession) {
            setShowPrompt(false);
        } else {
            setShowPrompt(true);
        }
    }, [showPrompt]);

    const fetchNearbyCounties = async (lat, lon) => {
        const radiusMeters = 20000; // 20 km

        const query = `
            [out:json];
            (
              relation["boundary"="administrative"]["admin_level"="6"](around:${radiusMeters},${lat},${lon});
            );
            out tags;
        `;

        const url = "https://overpass-api.de/api/interpreter";

        try {
            const response = await axios.post(url, query, {
                headers: { "Content-Type": "text/plain" }
            });

            const elements = response.data.elements;
            const counties = elements.map(el => el.tags.name).filter(Boolean);
            setAreas(counties)
            return counties;
        } catch (err) {
            return [];
        }
    };

    // Detect location and get city
    const getLocationAndFetchCity = () => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.permissions.query({ name: "geolocation" }).then((status) => {
            if (status.state === "denied") {
                setLocationError("Location permission is denied. Please enable it in your browser settings.");
                setLoading(false);
                return;
            }

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    if (latitude && longitude) setLocation(true);

                    try {
                        const roundedLat = parseFloat(latitude.toFixed(5));
                        const roundedLon = parseFloat(longitude.toFixed(5));

                        // Step 1: Get nearby counties
                        const nearbyCounties = await fetchNearbyCounties(roundedLat, roundedLon);

                        // Step 2: Reverse geocode for fallback
                        const response = await axios.get(
                            `https://us1.locationiq.com/v1/reverse?key=pk.01195e278386bb9365b5a81d59e01220&lat=${roundedLat}&lon=${roundedLon}&format=json&accept-language=en`
                        );

                        const address = response.data.address;
                        const stateDistrict = address.state_district?.trim() || "";
                        setDetectedCity(stateDistrict)

                        // Step 3: Send to backend
                        if (nearbyCounties.length > 0) {
                            fetchServices(nearbyCounties, stateDistrict);
                        } else {
                            // If no nearby counties, directly use state district
                            fetchServices([], stateDistrict);
                        }
                    } catch (err) {
                        setLocationError("Error determining your city.");
                    } finally {
                        setLoading(false);
                    }
                },
                () => {
                    setLocationError("Could not access your location. Please allow location access.");
                    setLoading(false);
                }
            );
        });
    };

    const fetchServices = async (nearbyCounties, stateDistrict) => {
        try {
            const res = await backendApi.post(`/api/services/by-location`, {
                nearbyCounties,
                stateDistrict
            });

            setServices(res.data.services);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                console.warn("No services available near your location.");
            } else {
                console.error("Failed to fetch services:", err);
            }
        }
    };

    useEffect(() => {
        getLocationAndFetchCity();
    }, [navigate]);

    const handleClose = () => {
        setShowPrompt(false);
        sessionStorage.setItem("locSession", "true");
    };

    return (
        <Box maxWidth='lg' mx='auto' sx={{ py: 5, overflow: "hidden", }}>

            {loading && (
                <Box sx={{ width: '100%', display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <iframe
                        src="https://lottie.host/embed/5e9fdb49-e921-44bc-a0af-d5edd9010516/bfxQlx9Tqi.lottie"
                        style={{ border: 'none', boxShadow: 'none' }}
                    />
                </Box>
            )}


            {!loading && locationError && (
                <Grid
                    container
                    // spacing={3}
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        position: "relative",
                        maxWidth: 700,
                        mx: 'auto',
                        display: showPrompt ? 'flex' : "flex",
                        my: 4,
                        p: 3,
                        bgcolor: '#f9f9f9',
                        borderRadius: 3,
                        boxShadow: 0,
                        textAlign: { xs: 'center', md: 'left' },
                    }}
                >

                    <IconButton
                        onClick={handleClose}
                        sx={{ position: "absolute", top: 0, right: 0 }}
                    >
                        <Close sx={{ fontSize: 14 }} />
                    </IconButton>

                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src="https://img.freepik.com/free-photo/mobile-app-location-digital-art_23-2151762911.jpg"
                            alt="Location Access"
                            sx={{
                                width: '100%',
                                height: 'auto',
                                maxWidth: 200,
                                borderRadius: 2,
                                mx: { xs: 'auto', md: 0 },
                                display: 'block',
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={8}>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            For a better experience, please enable location access in your browser settings.
                            <br />
                            <br />
                            <strong>🔒 → Site settings → Location: Allow → Reload</strong>
                        </Typography>

                        <Button
                            variant="text"
                            size="medium"
                            onClick={getLocationAndFetchCity}
                            sx={{ textTransform: 'none', mt: 1 }}
                        >
                            Retry Location Access
                        </Button>
                    </Grid>
                </Grid>
            )}

            {!loading && !locationError && services.length > 0 && (

                <Box sx={{ width: "100%", p: 2 }}>
                    <Typography data-aos='fade-up' variant="h4" align="center" fontWeight={700} gutterBottom>
                        Discover Trusted Services Near You
                    </Typography>

                    <Typography
                        data-aos='fade-up'
                        align="center"
                        variant="subtitle1"
                        color="text.secondary"
                        gutterBottom
                        sx={{ mb: 3 }}
                    >
                        Curated just for <strong style={{ color: "rebeccapurple" }}>{"you"}</strong>. Choose from top-rated professionals.
                    </Typography>


                    <Splide
                        data-aos='fade-up'
                        options={{
                            type: 'slide',
                            perPage: 4,
                            perMove: 1,
                            gap: '1rem',
                            breakpoints: {
                                1200: { perPage: 3 },
                                768: { perPage: 2 },
                                480: { perPage: 1 },
                            },
                            pagination: true,
                            arrows: false,
                            drag: true,
                        }}
                        className={services.length < 4 ? "center-slides" : ""}
                    >
                        {services.map((service, index) => (
                            <SplideSlide key={service._id} >
                                <Link to={`/category/${service.category}/${service.linkedServiceId}`} style={{ textDecoration: "none", }}>
                                    <Card
                                        // data-aos-delay={index * 200}
                                        sx={{
                                            cursor: "pointer",
                                            borderRadius: 3,
                                            boxShadow: 0,
                                            height: '100%',
                                            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                            '&:hover': {
                                                boxShadow: 0,
                                            },
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        {service.images?.CoverImage?.[0] && (
                                            <CardMedia
                                                component="img"
                                                height="180"
                                                image={service.images.CoverImage[0]}
                                                alt={service.additionalFields.businessName}
                                                sx={{ objectFit: 'cover', borderRadius: 4 }}
                                            />
                                        )}
                                        <CardContent sx={{ flexGrow: 1, bgcolor: "#f8f8f8", }}>
                                            {service.category && (
                                                <Box mt={1} sx={{ position: "absolute", top: 10, right: 10 }}>
                                                    <Chip
                                                        sx={{ borderRadius: 4, mb: 1, color: "white", bgcolor: "black" }}
                                                        label={
                                                            service.category
                                                                .replace(/[_-]/g, ' ')
                                                                .replace(/\b\w/g, (char) => char.toUpperCase())
                                                        }
                                                        size="medium"
                                                    />
                                                </Box>
                                            )}
                                            <Typography variant="body2"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 1,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                                fontWeight={600}
                                                gutterBottom
                                            >
                                                {service.additionalFields.businessName}
                                            </Typography>
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    display: '-webkit-box',
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: 'vertical',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {service.additionalFields.description}
                                            </Typography>

                                            {Array.isArray(service.additionalFields.availableLocations) &&
                                                service.additionalFields.availableLocations.map((location, index) => (
                                                    <Chip
                                                        size="small"
                                                        key={index}
                                                        icon={<LocationOn sx={{ fontSize: '12px !important' }} color="info" />}
                                                        label={location}
                                                        variant='filled'
                                                        aria-label={`location ${location}`}
                                                        sx={{
                                                            maxWidth: 200,
                                                            textTransform: "none",
                                                            borderRadius: 2,
                                                            border: "1px solid #ddd",
                                                            bgcolor: "#fff",
                                                            mr: 1,
                                                            mt: 1,
                                                            "& .MuiChip-label": {
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                paddingLeft: 1,
                                                            },
                                                        }}
                                                    />
                                                ))}

                                        </CardContent>
                                    </Card>
                                </Link>
                            </SplideSlide>
                        ))}

                        {/* Explore more slide */}
                        <SplideSlide>
                            <Link
                                to={`/services?city=${encodeURIComponent(nearbyAreas)}&detectedcity=${encodeURIComponent(detectedCity)}`}
                                style={{ textDecoration: "none" }}
                            >
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        boxShadow: 0,
                                        bgcolor: "#f8f8f8",
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexDirection: 'column',
                                        borderRadius: 3,
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                        },
                                    }}

                                >
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <IconButton sx={{ bgcolor: '#ffff', p: 4 }} size="large" color="primary">
                                            <ArrowForwardIcon fontSize="large" />
                                        </IconButton>
                                        <Typography variant="caption" component='div' mt={2} color='text.secondary' fontWeight={600}>
                                            Explore near your area / {detectedCity}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        </SplideSlide>
                    </Splide>

                </Box>
            )
            }

        </Box >
    );
};

export default LocationBasedServiceList;
