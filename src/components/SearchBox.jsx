import React, { useState, useEffect, } from 'react';
import { Button, Box, Grid, Snackbar, Alert, Typography, } from '@mui/material';
import { styled } from '@mui/system';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';
import withLoadingAndError from "../hoc/withLoadingAndError"
import { useLocation, useNavigate } from 'react-router-dom';
import DestinationMenu from '../components/DestinationMenu';
import CheckinMenu from '../components/CheckinMenu';
import CategoryMenu from '../components/CategoryMenu';

const SearchBox = ({ setLoading, setError }) => {

    const location = useLocation();
    const navigate = useNavigate();

    const SearchBox = styled(Box)(({ theme }) => ({
        display: "flex",
        marginTop: theme.spacing(0),
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        padding: theme.spacing(3), // Adds spacing inside the box for better appearance

        // Mobile (Default)
        position: "relative",
        top: "0%",
        left: "0%",
        transform: "none",

        [theme.breakpoints.up("md")]: {
            marginTop: theme.spacing(4),
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "80%",
        },
        [theme.breakpoints.up("xl")]: {
            marginTop: theme.spacing(4),
            position: "absolute",
            top: "85%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            minWidth: "60%",
        },

    }));


    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const defaultLocation = queryParams.get('location') || '';
        const defaultDates = queryParams.getAll('datesChoosed'); // Use getAll to retrieve all selected dates
        const defaultCategory = queryParams.get('category') || '';

        // Update the customerChoice state with default values from the query params
        setCustomerChoice({
            location: defaultLocation,
            datesChoosed: defaultDates,
            category: defaultCategory
        });

    }, [location.search]);


    const [customerChoice, setCustomerChoice] = useState({
        location: '',
        datesChoosed: [],
        category: ''
    });

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // success, error, warning, info

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    // Function to update customerChoice
    const updateCustomerChoice = (newChoice) => {
        setCustomerChoice((prevChoice) => ({
            ...prevChoice,
            ...newChoice // Merge new values with the previous state
        }));
    };

    // Example of how you would handle selecting a location
    const locationHandler = (selectedLocation) => {
        updateCustomerChoice({ location: selectedLocation }); // Update only the location
    };

    // Example of how you would handle selecting dates
    const dateHandler = (selectedDates) => {
        updateCustomerChoice({ datesChoosed: selectedDates }); // Update only the dates
    };

    // Example of how you would handle selecting a category
    const categoryHandler = (selectedCategory) => {
        updateCustomerChoice({ category: selectedCategory }); // Update only the category
    };

    // Search handler
    const handleSearch = async () => {
        const { location, datesChoosed, category } = customerChoice;
        localStorage.setItem('customerChoice', JSON.stringify(customerChoice));

        // Ensure category is always selected
        if (!category) {
            setSnackbarMessage("Please select a category.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }
        // Construct query parameters dynamically based on which values are present
        const queryParams = new URLSearchParams();

        if (location) queryParams.append('location', location);
        if (Array.isArray(datesChoosed) && datesChoosed.length > 0) {
            datesChoosed.forEach(date => {
                queryParams.append('datesChoosed', date);
            });
        }
        if (category) queryParams.append('category', category);

        try {
            setLoading(true);
            const response = await backendApi.get(`/header/search?${queryParams.toString()}`);
            if (response.data.success && response.data.service.length > 0) {
                // Navigate only if venues exist
                navigate(`/?${queryParams.toString()}`);
            } else {
                setSnackbarMessage("No service found for the selected location or category.");
                setSnackbarSeverity("info");
                setSnackbarOpen(true);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setSnackbarMessage("An error occurred while searching. Please try again.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
            setLoading(false);
        }
    };



    return (
        <  >
            {/* #faf4fe */}
            <SearchBox
                maxWidth="lg"
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: { xs: 4, md: '62px' },
                    // border: "1px solid #ddd",
                    boxShadow: 0,
                    bgcolor: { xs: "#f8f4fd", md: "#f4edff" },
                }}
            >

                <Box sx={{ display: { xs: "block", md: "none" }, textAlign: "center", mb: 3 }}>
                    {/* Title */}
                    <Typography
                        variant="h6"
                        fontWeight="bold"
                        sx={{ mb: 1 }}
                    >
                        Plan Your Occasions
                    </Typography>

                    {/* Tagline */}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ maxWidth: 280, mx: "auto" }}
                    >
                        From venues to decor, book everything you need in just a few taps.
                    </Typography>
                </Box>

                <Grid
                    container
                    gap={3}
                    display='flex'
                    alignItems="center"
                    justifyContent='center'
                    direction={{ xs: "column", sm: "row" }}
                    sx={{ py: { xs: 2, md: 0 } }}
                >
                    {/* Location */}
                    <Grid item xs={12} sm={6} md={3} sx={{ width: '100%' }}>
                        <DestinationMenu
                            onLocationSelect={locationHandler}
                            defaultLocation={customerChoice.location}
                        />
                    </Grid>

                    {/* Dates */}
                    <Grid item xs={12} sm={6} md={3} sx={{ width: '100%' }}>
                        <CheckinMenu
                            onDateSelect={dateHandler}
                            defaultDates={customerChoice.datesChoosed}
                        />
                    </Grid>

                    {/* Category */}
                    <Grid item xs={12} sm={6} md={3} sx={{ width: '100%' }}>
                        <CategoryMenu
                            onCategorySelect={categoryHandler}
                            defaultCategory={customerChoice.category}
                        />
                    </Grid>

                    {/* Search button */}
                    <Button
                        sx={{
                            py: 1.5,
                            color: "white",
                            width: { xs: "50%", sm: "auto" },
                            borderRadius: "30px",
                            fontWeight: 600,
                            textTransform: "none",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                        variant="contained"
                        size="medium"
                        startIcon={<SearchIcon />}
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </Grid>
            </SearchBox>


            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </ >
    )
}

export default withLoadingAndError(SearchBox);