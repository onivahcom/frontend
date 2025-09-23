import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
    Box,
    Typography,
    CircularProgress,
    Container,
    Card,
    CardContent,
    Grid,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CardMedia,
    CardActions,
    Button,
    Chip,
} from '@mui/material';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';
import { StarHalf } from '@mui/icons-material';

const LocationBasedServices = () => {
    const [searchParams] = useSearchParams();
    const cityParam = searchParams.get('city');           // e.g. "Mathavaram,Ambattur,Poonamallee"
    const detectedCity = searchParams.get('detectedcity'); // e.g. "Chennai"

    const nearbyCounties = cityParam
        ? cityParam.split(',').map(city => city.trim())
        : [];

    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!cityParam) {
            setError('No city provided in the URL');
            return;
        }

        const fetchServices = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await backendApi.post(`/api/services/by-location`, {
                    nearbyCounties,
                    stateDistrict: detectedCity,
                    page: "LOCATION_SERVICES"
                });
                setServices(res.data.services);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching services');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, [cityParam]);

    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleChange = (e) => {
        setSelectedCategory(e.target.value);
    };

    const uniqueCategories = useMemo(() => {
        const cats = [...new Set(services.map(s => s.category))];
        return ['All', ...cats];
    }, [services]);

    const filteredServices = useMemo(() => {
        return selectedCategory === 'All'
            ? services
            : services.filter(s => s.category === selectedCategory);
    }, [services, selectedCategory]);


    return (
        <Box>
            <Header />
            <Container sx={{ py: 5, mt: 5, bgcolor: "#f8f8f8" }}>
                <Typography
                    variant="body2"
                    align="left"
                    sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        mb: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        flexWrap: 'wrap'
                    }}
                >
                    Services

                    {/*in <Box component="span" sx={{ color: 'primary.main' }}>{nearbyCounties}</Box> */}
                    — curated just for your area
                </Typography>

                <Typography
                    variant="caption"
                    align="left"
                    sx={{
                        color: 'text.secondary',
                        mb: 2
                    }}
                >
                    Browse trusted vendors and top-rated services available near you.
                </Typography>


                <Box>

                    {loading && (
                        <Box display="flex" justifyContent="center" my={4}>
                            <CircularProgress />
                        </Box>
                    )}

                    {error && <Alert severity="error">{error}</Alert>}

                    {!loading && !error && services.length > 0 && (
                        <Box sx={{ width: "100%" }}>

                            <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
                                <FormControl size='small' sx={{ mb: 2, width: 200, }}>
                                    <InputLabel>Filter by Category</InputLabel>
                                    <Select
                                        value={selectedCategory}
                                        label="Filter by Category"
                                        onChange={handleChange}
                                    >
                                        {uniqueCategories.map((cat) => (
                                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Grid container spacing={2}>
                                {filteredServices.map((service) => (
                                    <Grid item xs={12} sm={6} md={3} lg={2} key={service._id}>
                                        <Link to={`/category/${service.category}/${service.linkedServiceId}`} style={{ textDecoration: "none" }}>
                                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 0, cursor: "pointer", borderRadius: 4 }}>
                                                {service.images && (
                                                    <CardMedia
                                                        component="img"
                                                        height="160"
                                                        image={service.images.CoverImage[0]}
                                                        alt={service.additionalFields.businessName}
                                                        sx={{ borderRadius: 4 }}
                                                    />
                                                )}
                                                <CardContent sx={{ flexGrow: 1 }}>
                                                    <Typography
                                                        gutterBottom
                                                        variant="caption"
                                                        component="div"
                                                        sx={{
                                                            fontWeight: 500,
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 1,
                                                            WebkitBoxOrient: 'vertical',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'normal'
                                                        }}
                                                    >
                                                        {service.additionalFields.businessName}
                                                    </Typography>


                                                    <Box sx={{ display: 'flex', justifyContent: 'start', alignItems: 'center', mt: 1 }}>
                                                        {/* Price */}
                                                        <Typography variant="caption" sx={{ color: "#666" }}>
                                                            From:  ₹{service.additionalFields.priceRange || "N/A"}
                                                        </Typography>

                                                        {/* Rating */}
                                                        <Box sx={{ display: 'flex', alignItems: 'center', }}>
                                                            <StarHalf sx={{ fontSize: 14, color: '#666', ml: 2 }} />
                                                            <Typography variant="caption" sx={{ color: '#666', fontWeight: 500 }}>
                                                                5.0
                                                            </Typography>
                                                        </Box>
                                                    </Box>


                                                    <Chip
                                                        variant='filled'
                                                        sx={{ borderRadius: 4, bgcolor: "#f2f2f2", color: "grey", mt: 1 }}
                                                        label={
                                                            service.category
                                                                .replace(/[_-]/g, ' ')
                                                                .replace(/\b\w/g, (char) => char.toUpperCase())
                                                        }
                                                        size="small"
                                                    />
                                                </CardContent>
                                                {/* <CardActions>
                                                <Button size="small">View</Button>
                                                <Button size="small">Book</Button>
                                            </CardActions> */}
                                            </Card>
                                        </Link>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}


                    {!loading && !error && services.length === 0 && (
                        <Typography>No services found for this location.</Typography>
                    )}


                </Box>

            </Container>
            <FooterComponent />
        </Box>

    );
};

export default LocationBasedServices;
