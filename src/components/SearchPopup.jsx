import React, { useState, useEffect, useRef } from 'react';
import { AppBar, Toolbar, Typography, Button, CssBaseline, Box, Container, TextField, Grid, InputAdornment, useMediaQuery, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';
import withLoadingAndError from "../hoc/withLoadingAndError"
import { useLocation, useNavigate } from 'react-router-dom';
import DestinationMenu from '../components/DestinationMenu';
import CheckinMenu from '../components/CheckinMenu';
import CategoryMenu from '../components/CategoryMenu';
import HeroVideo from './HeroVideo';
import RoughTwo from '../rough/Rough2';


const SearchPopup = ({ setLoading, setError, oncloseSearchPop }) => {

    const location = useLocation();
    const navigate = useNavigate();

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info"); // success, error, warning, info


    const SearchBox = styled(Box)(({ theme }) => ({
        display: 'flex',
        marginTop: theme.spacing(4),
        minWidth: "80%",
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        position: 'absolute',
        top: '60%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        // padding: theme.spacing(3),
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

        // Check if at least one of the values is selected
        if (!category) {
            setSnackbarMessage("Please select a category.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }
        // if (!location && (!datesChoosed || datesChoosed.length === 0) && !category) {
        //     alert("Please select at least one event detail (location, dates, or category).");
        //     return;
        // }

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
            setLoading(false);
            if (response.data.success && response.data.service.length > 0) {
                // Navigate only if venues exist
                navigate(`/?${queryParams.toString()}`);
            } else {
                // Show an alert if no data is found
                alert("No service found for the selected location or category.");
            }
            oncloseSearchPop();
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <Grid container spacing={2} alignItems="center" direction={{ xs: 'column', sm: 'column' }} sx={{ p: { xs: 0, md: 1 }, width: "100%" }}>


            <Grid item xs={12} sm={4} md={3} sx={{ width: "100%" }}>

                <DestinationMenu onLocationSelect={locationHandler} defaultLocation={customerChoice.location} />

            </Grid>
            <Grid item xs={12} sm={4} md={3} sx={{ width: "100%" }}>
                <CheckinMenu onDateSelect={dateHandler} defaultDates={customerChoice.datesChoosed} />
                {/* <RoughTwo /> */}
            </Grid>
            <Grid item xs={12} sm={4} md={3} sx={{ width: "100%" }}>
                <CategoryMenu onCategorySelect={categoryHandler} defaultCategory={customerChoice.category} />

            </Grid>
            <Grid item xs={12} sm={12} md={12} sx={{ width: "100%", textAlign: 'center', }}>
                {/* <Box sx={{ textAlign: 'center', cursor: 'pointer', p: 1, borderRadius: '8px' }}> */}

                <Button
                    sx={{ color: "white" }}
                    variant='contained'
                    size='large'
                    startIcon={<SearchIcon fontSize='medium' />}
                    onClick={handleSearch}
                >
                    Search
                </Button>

                {/* </Box> */}
            </Grid>

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
        </Grid>
    )
}

export default withLoadingAndError(SearchPopup);