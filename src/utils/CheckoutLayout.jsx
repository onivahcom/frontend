import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

import {
    Box,
    Button,
    Grid,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    Typography,
    Paper,
    FormControl,
    Card,
    CardContent,
    Divider,
} from "@mui/material";
import { Lock, ArrowDropDown, } from "@mui/icons-material";
import Header from "../components/Header";
import FooterComponent from "../components/FooterComponent";
import Swal from "sweetalert2";
import { apiUrl, backendApi } from "../Api/Api";
import RazorpayPayment from "./RazorpayPayment";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import UserLogin from "./UserLogin";
import { Country, State, City } from "country-state-city";
import axios from "axios";
import { useUser } from "../context/UserContext";

const CheckoutLayout = () => {

    const { state } = useLocation();
    const { user, setUser } = useUser();


    const [serviceDetails, setServiceDetails] = useState({
        _id: state._id,
        userId: state.userId,
        vendorId: state.vendorId,
        category: state.category,
        businessName: state.businessName,
        imageUrls: state.imageUrls,
        location: state.location,
        package: state.package,
        additionalRequest: "",
        selectedDate: state.selectedDate,
        isChecked: state.isChecked,
    });

    // Get existing customerChoice data from localStorage
    const customerChoiceRaw = localStorage.getItem('customerChoice');


    const [parsedChoice, setParsedChoice] = useState({ location: '', category: '', datesChoosed: [] });
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedState, setSelectedState] = useState(null);
    const [selectedCity, setSelectedCity] = useState(null);

    useEffect(() => {
        if (customerChoiceRaw) {
            try {
                setParsedChoice(JSON.parse(customerChoiceRaw));
            } catch (error) {
                console.error("Failed to parse localStorage data:", error);
            }
        }
    }, [customerChoiceRaw]);


    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem("onivah_token");
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    useEffect(() => {

        const fetchProtectedData = async () => {

            let refreshInProgress = false;

            try {
                const response = await backendApi.get(`/protected-route`, {
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                    withCredentials: true
                });

                const data = response.data;

                setUserData(data.user);
                setUser(data.user);
                setIsButtonDisabled(false)
                const backendLocation = {
                    country: data.user.country,
                    state: data.user.state,
                    city: data.user.city,
                };

                // Load all countries
                const countryList = Country.getAllCountries();
                setCountries(countryList);

                const country = countryList.find(
                    (c) => c.name?.toLowerCase() === backendLocation.country?.toLowerCase()
                );
                if (country) {
                    setSelectedCountry(country);
                    const stateList = State.getStatesOfCountry(country.isoCode);
                    setStates(stateList);

                    const state = stateList.find(
                        (s) => s.name?.toLowerCase() === backendLocation.state.toLowerCase()
                    );
                    if (state) {
                        setSelectedState(state);
                        const cityList = City.getCitiesOfState(country.isoCode, state.isoCode);
                        setCities(cityList);

                        const city = cityList.find(
                            (c) => c.name?.toLowerCase() === backendLocation.city?.toLowerCase()
                        );
                        if (city) {
                            setSelectedCity(city);
                        }
                    }
                }
            } catch (error) {

                if (error.response?.status === 403 && !refreshInProgress) {
                    refreshInProgress = true;

                    try {
                        const refreshRes = await backendApi.get(`/refreshToken/refresh`, {
                            withCredentials: true,
                        });

                        const retryRes = await backendApi.get(`/protected-route`, {
                            withCredentials: true,
                        });
                        setIsButtonDisabled(false)
                        setUserData(retryRes.data.user);
                        setUser(retryRes.data.user);
                        const backendLocation = {
                            country: retryRes.data.user.country,
                            state: retryRes.data.user.state,
                            city: retryRes.data.user.city,
                        };

                        // Load all countries
                        const countryList = Country.getAllCountries();
                        setCountries(countryList);

                        const country = countryList.find(
                            (c) => c.name?.toLowerCase() === backendLocation.country?.toLowerCase()
                        );
                        if (country) {
                            setSelectedCountry(country);
                            const stateList = State.getStatesOfCountry(country.isoCode);
                            setStates(stateList);

                            const state = stateList.find(
                                (s) => s.name?.toLowerCase() === backendLocation.state.toLowerCase()
                            );
                            if (state) {
                                setSelectedState(state);
                                const cityList = City.getCitiesOfState(country.isoCode, state.isoCode);
                                setCities(cityList);

                                const city = cityList.find(
                                    (c) => c.name?.toLowerCase() === backendLocation.city?.toLowerCase()
                                );
                                if (city) {
                                    setSelectedCity(city);
                                }
                            }
                        }
                    } catch (refreshError) {
                        // Handle expired refresh token (force logout)
                    } finally {
                        refreshInProgress = false;
                    }

                    return;
                }


                // 401 or other errors
                if (error.response?.status === 401) {
                    // setSnackbar({
                    //     open: true,
                    //     message: "Kindly login to continue.",
                    //     severity: "warning",
                    // });
                    // navigate("/");
                } else {
                    // setSnackbar({
                    //     open: true,
                    //     message: "Unexpected error occurred. Please try again.",
                    //     severity: "error",
                    // });
                }
            }
        };

        fetchProtectedData();
    }, []);


    useEffect(() => {
        if (userData) {

            // Define the keys you want to validate
            const keysToValidate = ["firstname", "email", "phone", "country", "state", "city", "zipcode"];

            const allValuesValid = keysToValidate.every((key) => {
                const value = userData[key];
                let isValid = true; // Track if the current value is valid


                if (typeof value !== "string") {
                    if (key === "phone") {
                        isValid = /^[0-9]{10}$/.test(value);
                        if (!isValid) {
                            // console.log(`Invalid phone number: ${value}`);
                        }
                    } else {
                        isValid = value !== null && value !== undefined;
                        if (!isValid) {
                            console.log(`Invalid value for key ${key}: ${value}`);
                        }
                    }
                } else {
                    // Apply validation based on key
                    switch (key) {
                        case "firstname":
                            isValid = value.trim().length > 1;
                            if (!isValid) {
                                // console.log(`Invalid first name: ${value}`);
                            }
                            break;
                        case "country":
                            isValid = value.trim().length > 0;
                            if (!isValid) {
                                isValid = selectedCountry !== null;
                                if (!isValid) {
                                    console.log(`Invalid ${key}: ${value}`);
                                }
                            }
                            break;

                        case "state":
                            isValid = value.trim().length > 0;
                            if (!isValid) {
                                isValid = selectedState !== null;
                                if (!isValid) {
                                    console.log(`Invalid ${key}: ${value}`);
                                }
                            }
                            break;

                        case "city":
                            isValid = value.trim().length > 0;
                            if (!isValid) {
                                isValid = selectedCity !== null;
                                if (!isValid) {
                                    console.log(`Invalid ${key}: ${value}`);
                                }
                            }
                            break;
                        case "email":
                            isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                            if (!isValid) {
                                // console.log(`Invalid email: ${value}`);
                            }
                            break;
                        case "zipcode":
                            isValid = /^[0-9]+$/.test(value.trim());
                            if (!isValid) {
                                // console.log(`Invalid zip code: ${value}`);
                            }
                            break;
                        default:
                            isValid = value.trim().length > 0;
                            if (!isValid) {
                                // console.log(`Invalid value for key ${key}: ${value}`);
                            }
                            break;
                    }
                }

                return isValid; // Return the validity status of the current key-value pair
            });

            // console.log("All values valid:", allValuesValid); // Log the final result
            setIsButtonDisabled(!allValuesValid); // Disable button if not all values are valid
        }
    }, [userData, selectedCountry, selectedState, selectedCity]);

    const handleCountryChange = (e) => {
        const country = countries.find((c) => c.isoCode === e.target.value);
        setSelectedCountry(country);
        setStates(State.getStatesOfCountry(country.isoCode));
        setSelectedState(null);
        setCities([]);
        setSelectedCity(null);
    };

    const handleStateChange = (e) => {
        const state = states.find((s) => s.isoCode === e.target.value);
        setSelectedState(state);
        const cityList = City.getCitiesOfState(selectedCountry.isoCode, state.isoCode);
        setCities(cityList);
        setSelectedCity(null);
    };

    const handleCityChange = (e) => {
        const city = cities.find((c) => c.name === e.target.value);
        setSelectedCity(city);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceDetails((prev) => ({ ...prev, [name]: value }));
    };


    const calculateDays = (dates) => {
        const start = new Date(dates[0]);
        const end = new Date(dates[dates.length - 1]);
        const diff = Math.abs(end - start);
        return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1;
    };

    const total = serviceDetails.package.price + 1;


    return (
        <Box >
            <Header />

            {/* Main Content */}
            <Grid maxWidth='xl' mx='auto' container sx={{ px: { xs: 0, md: 10 }, mt: 10 }}>
                {/* Checkout Section */}
                <Grid item xs={12} lg={6} sx={{ p: { xs: 1, md: 4 } }}>

                    {user ?

                        // <>

                        //     <Typography variant="h4" fontWeight="bold" mb={2}>
                        //         Checkout
                        //     </Typography>
                        //     <Paper elevation={0} sx={{ p: 4 }}>
                        //         <Typography variant="h6" fontWeight="medium" mb={2}>
                        //             Personal Information
                        //         </Typography>
                        //         <Box component="form">
                        //             <Box mb={2}>
                        //                 <InputLabel>
                        //                     Full name <span style={{ color: "red" }}>*</span>
                        //                 </InputLabel>
                        //                 <TextField
                        //                     fullWidth
                        //                     value={userData?.firstname}
                        //                     variant="outlined"
                        //                     size="small"
                        //                 />
                        //             </Box>
                        //             <Box mb={2}>
                        //                 <InputLabel>
                        //                     Email address <span style={{ color: "red" }}>*</span>
                        //                 </InputLabel>
                        //                 <TextField
                        //                     fullWidth
                        //                     value={userData?.email}
                        //                     variant="outlined"
                        //                     size="small"
                        //                 />
                        //             </Box>
                        //             <Box mb={2}>
                        //                 <InputLabel>
                        //                     Phone number <span style={{ color: "red" }}>*</span>
                        //                 </InputLabel>
                        //                 <Box display="flex" alignItems="center">
                        //                     <TextField
                        //                         fullWidth
                        //                         value={
                        //                             userData?.phone}
                        //                         variant="outlined"
                        //                         size="small"
                        //                     />
                        //                 </Box>
                        //             </Box>

                        //             <Box mb={2}>
                        //                 <InputLabel>
                        //                     Country <span style={{ color: "red" }}>*</span>
                        //                 </InputLabel>
                        //                 <FormControl fullWidth>
                        //                     <Select
                        //                         size="small"
                        //                         IconComponent={() => <ArrowDropDown />}
                        //                         value={selectedCountry?.isoCode || ""}
                        //                         onChange={handleCountryChange}
                        //                         error={!selectedCountry?.isoCode}
                        //                     >
                        //                         <MenuItem value="" disabled>
                        //                             Select Country
                        //                         </MenuItem>
                        //                         {countries.map((country) => (
                        //                             <MenuItem key={country.isoCode} value={country.isoCode}>
                        //                                 {country.name}
                        //                             </MenuItem>
                        //                         ))}
                        //                     </Select>
                        //                 </FormControl>
                        //             </Box>
                        //             <Box mb={2}>
                        //                 <InputLabel>
                        //                     State <span style={{ color: "red" }}>*</span>
                        //                 </InputLabel>
                        //                 <FormControl fullWidth disabled={!states.length}>
                        //                     <Select
                        //                         size="small"
                        //                         IconComponent={() => <ArrowDropDown />}
                        //                         value={selectedState?.isoCode || ""}
                        //                         onChange={handleStateChange}
                        //                         error={!selectedState?.isoCode}
                        //                     >
                        //                         <MenuItem value="" disabled>
                        //                             Select State
                        //                         </MenuItem>
                        //                         {states.map((state) => (
                        //                             <MenuItem key={state.isoCode} value={state.isoCode}>
                        //                                 {state.name}
                        //                             </MenuItem>
                        //                         ))}
                        //                     </Select>
                        //                 </FormControl>
                        //             </Box>
                        //             <Box mb={2}>

                        //             </Box>



                        //             <Box mb={2} display="flex" gap={2}>
                        //                 <Box flex={1}>
                        //                     <InputLabel>
                        //                         City <span style={{ color: "red" }}>*</span>
                        //                     </InputLabel>
                        //                     <FormControl fullWidth disabled={!cities.length}>
                        //                         <Select
                        //                             size="small"
                        //                             IconComponent={() => <ArrowDropDown />}
                        //                             labelId="city-label"
                        //                             value={selectedCity?.name || ""}
                        //                             onChange={handleCityChange}
                        //                             error={!selectedCity?.name}

                        //                         >
                        //                             <MenuItem value="" disabled>
                        //                                 Select City
                        //                             </MenuItem>
                        //                             {cities.map((city, idx) => (
                        //                                 <MenuItem key={idx} value={city.name}>
                        //                                     {city.name}
                        //                                 </MenuItem>
                        //                             ))}
                        //                         </Select>
                        //                     </FormControl>
                        //                 </Box>


                        //                 <Box flex={1}>
                        //                     <InputLabel>
                        //                         Zip Code <span style={{ color: "red" }}>*</span>
                        //                     </InputLabel>
                        //                     <TextField
                        //                         fullWidth
                        //                         value={userData?.zipcode}
                        //                         placeholder="Zip Code"
                        //                         variant="outlined"
                        //                         size="small"
                        //                     />
                        //                 </Box>
                        //             </Box>
                        //             {/* <Box mb={2}>
                        //             <InputLabel>Payment Method</InputLabel>
                        //             <RadioGroup row>
                        //                 <FormControlLabel
                        //                     value="credit_card"
                        //                     control={<Radio />}
                        //                     label="Credit Card"
                        //                 />
                        //                 <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                        //                 <FormControlLabel
                        //                     value="cod"
                        //                     control={<Radio />}
                        //                     label="Cash on Delivery"
                        //                 />
                        //             </RadioGroup>
                        //         </Box> */}
                        //             <Box mb={2}>
                        //                 <InputLabel>Additional Instructions</InputLabel>
                        //                 <TextField
                        //                     fullWidth
                        //                     placeholder="Enter any special instructions here"
                        //                     variant="outlined"
                        //                     size="small"
                        //                     multiline
                        //                     rows={3}
                        //                 />
                        //             </Box>
                        //         </Box>
                        //     </Paper>

                        // </>

                        <>
                            <Typography variant="h4" fontWeight="bold" >
                                Checkout
                            </Typography>

                            <Paper
                                elevation={0}
                                sx={{ p: 2, borderRadius: 3, maxWidth: 800, mx: "auto" }}
                            >
                                <Typography variant="body2" color='textSecondary' fontWeight="medium" mb={3}>
                                    Personal Information
                                </Typography>

                                <Box component="form">
                                    <Grid container spacing={3}>
                                        {/* Full Name */}
                                        <Grid item xs={12} md={6}>
                                            <InputLabel shrink>
                                                Full name <span style={{ color: "red" }}>*</span>
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                value={userData?.firstname}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>

                                        {/* Phone */}
                                        <Grid item xs={12} md={6}>
                                            <InputLabel shrink>
                                                Phone number <span style={{ color: "red" }}>*</span>
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                value={userData?.phone}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>


                                        {/* Email */}
                                        <Grid item xs={12}>
                                            <InputLabel shrink>
                                                Email address <span style={{ color: "red" }}>*</span>
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                value={userData?.email}
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>

                                        {/* Country */}
                                        <Grid item xs={12} md={6}>
                                            <InputLabel shrink>
                                                Country <span style={{ color: "red" }}>*</span>
                                            </InputLabel>
                                            <FormControl fullWidth>
                                                <Select
                                                    size="small"
                                                    IconComponent={() => <ArrowDropDown />}
                                                    value={selectedCountry?.isoCode || ""}
                                                    onChange={handleCountryChange}
                                                    error={!selectedCountry?.isoCode}
                                                >
                                                    <MenuItem value="" disabled>
                                                        Select Country
                                                    </MenuItem>
                                                    {countries.map((country) => (
                                                        <MenuItem key={country.isoCode} value={country.isoCode}>
                                                            {country.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* State */}
                                        <Grid item xs={12} md={6}>
                                            <InputLabel shrink>
                                                State <span style={{ color: "red" }}>*</span>
                                            </InputLabel>
                                            <FormControl fullWidth disabled={!states.length}>
                                                <Select
                                                    size="small"
                                                    IconComponent={() => <ArrowDropDown />}
                                                    value={selectedState?.isoCode || ""}
                                                    onChange={handleStateChange}
                                                    error={!selectedState?.isoCode}
                                                >
                                                    <MenuItem value="" disabled>
                                                        Select State
                                                    </MenuItem>
                                                    {states.map((state) => (
                                                        <MenuItem key={state.isoCode} value={state.isoCode}>
                                                            {state.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* City */}
                                        <Grid item xs={12} md={6}>
                                            <InputLabel shrink>
                                                City <span style={{ color: "red" }}>*</span>
                                            </InputLabel>
                                            <FormControl fullWidth disabled={!cities.length}>
                                                <Select
                                                    size="small"
                                                    IconComponent={() => <ArrowDropDown />}
                                                    value={selectedCity?.name || ""}
                                                    onChange={handleCityChange}
                                                    error={!selectedCity?.name}
                                                >
                                                    <MenuItem value="" disabled>
                                                        Select City
                                                    </MenuItem>
                                                    {cities.map((city, idx) => (
                                                        <MenuItem key={idx} value={city.name}>
                                                            {city.name}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>

                                        {/* Zip Code */}
                                        <Grid item xs={12} md={6}>
                                            <InputLabel shrink>
                                                Zip Code <span style={{ color: "red" }}>*</span>
                                            </InputLabel>
                                            <TextField
                                                fullWidth
                                                value={userData?.zipcode}
                                                placeholder="Zip Code"
                                                variant="outlined"
                                                size="small"
                                            />
                                        </Grid>

                                        {/* Additional Instructions */}
                                        <Grid item xs={12}>
                                            <InputLabel shrink>Additional Instructions</InputLabel>
                                            <TextField
                                                fullWidth
                                                placeholder="Enter any special instructions here"
                                                variant="outlined"
                                                size="small"
                                                multiline
                                                rows={3}
                                                name="additionalRequest"
                                                value={serviceDetails.additionalRequest}
                                                onChange={handleChange}
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Paper>

                        </>


                        // <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 } }}>
                        //     <Typography variant="h4" fontWeight="bold" mb={2}>
                        //         Checkout
                        //     </Typography>
                        //     <Typography variant="h6" fontWeight="medium" mb={2}>
                        //         Personal Information
                        //     </Typography>

                        //     <Box>
                        //         {/* Full Name */}
                        //         <Box mb={2}>
                        //             <InputLabel sx={{ fontWeight: 500 }}>Full Name</InputLabel>
                        //             <Typography variant="body1" color="text.primary">
                        //                 {userData?.firstname || "-"}
                        //             </Typography>
                        //         </Box>

                        //         {/* Email */}
                        //         <Box mb={2}>
                        //             <InputLabel sx={{ fontWeight: 500 }}>Email Address</InputLabel>
                        //             <Typography variant="body1" color="text.primary">
                        //                 {userData?.email || "-"}
                        //             </Typography>
                        //         </Box>

                        //         {/* Phone */}
                        //         <Box mb={2}>
                        //             <InputLabel sx={{ fontWeight: 500 }}>Phone Number</InputLabel>
                        //             <Typography variant="body1" color="text.primary">
                        //                 {userData?.phone || "-"}
                        //             </Typography>
                        //         </Box>

                        //         {/* Country & State */}
                        //         <Box mb={2} display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
                        //             <Box flex={1}>
                        //                 <InputLabel sx={{ fontWeight: 500 }}>Country</InputLabel>
                        //                 <Typography variant="body1" color="text.primary">
                        //                     {selectedCountry?.name || "-"}
                        //                 </Typography>
                        //             </Box>
                        //             <Box flex={1}>
                        //                 <InputLabel sx={{ fontWeight: 500 }}>State</InputLabel>
                        //                 <Typography variant="body1" color="text.primary">
                        //                     {selectedState?.name || "-"}
                        //                 </Typography>
                        //             </Box>
                        //         </Box>

                        //         {/* City & Zip */}
                        //         <Box mb={2} display="flex" flexDirection={{ xs: "column", sm: "row" }} gap={2}>
                        //             <Box flex={1}>
                        //                 <InputLabel sx={{ fontWeight: 500 }}>City</InputLabel>
                        //                 <Typography variant="body1" color="text.primary">
                        //                     {selectedCity?.name || "-"}
                        //                 </Typography>
                        //             </Box>
                        //             <Box flex={1}>
                        //                 <InputLabel sx={{ fontWeight: 500 }}>Zip Code</InputLabel>
                        //                 <Typography variant="body1" color="text.primary">
                        //                     {userData?.zipcode || "-"}
                        //                 </Typography>
                        //             </Box>
                        //         </Box>

                        //         {/* Additional Instructions */}
                        //         <Box mb={2}>
                        //             <InputLabel sx={{ fontWeight: 500 }}>Additional Instructions</InputLabel>
                        //             <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                        //                 {userData?.instructions || "—"}
                        //             </Typography>
                        //         </Box>
                        //     </Box>
                        // </Paper>

                        :
                        <UserLogin buttonAction={!token} />
                    }
                </Grid>

                {/* Cart Review Section */}
                <Grid item xs={12} lg={6} sx={{ p: { xs: 1, md: 4 } }}>
                    <Typography variant="body2" color='textSecondary' fontWeight="medium" mb={2}>
                        Review
                    </Typography>
                    <Paper elevation={0} sx={{ p: 4, bgcolor: "#f8f8f8", borderRadius: 3 }}>
                        {/* Product Item */}
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: { xs: "column", sm: "row" }, // stack on mobile, side-by-side on desktop
                                alignItems: { xs: "flex-start", sm: "center" },
                                gap: 2,
                                mb: 3,
                                p: 2,
                                // border: "1px solid #e0e0e0",
                                borderRadius: 2,
                                // backgroundColor: "#fff",
                            }}
                        >
                            {/* Image */}
                            <Box
                                component="img"
                                src={serviceDetails.imageUrls}
                                alt="Service"
                                sx={{
                                    width: { xs: "100%", sm: 120 },
                                    height: { xs: "auto", sm: 120 },
                                    objectFit: "cover",
                                    borderRadius: 2,
                                }}
                            />

                            {/* Details */}
                            <Box sx={{ flex: 1 }}>
                                {/* Package Info */}
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    {serviceDetails.package.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    gutterBottom
                                    sx={{
                                        display: "-webkit-box",
                                        WebkitLineClamp: 1, // limit to 2 lines
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {serviceDetails.package.description}
                                </Typography>


                                {/* Price */}
                                <Box mt={1} >
                                    <Typography variant="body2" color="primary" fontWeight="bold">
                                        ₹{serviceDetails.package.price}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 1 }} />

                                {/* Service Name */}
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    {serviceDetails.name}
                                </Typography>

                                {/* Location */}
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    📍 {parsedChoice.location}
                                </Typography>

                                {/* Date Range */}
                                {Array.isArray(serviceDetails.selectedDate) &&
                                    serviceDetails.selectedDate.length > 0 && (
                                        <Typography variant="caption" color="text.secondary">
                                            📅 {serviceDetails.selectedDate[0]} –{" "}
                                            {serviceDetails.selectedDate[serviceDetails.selectedDate.length - 1]} (
                                            {calculateDays(serviceDetails.selectedDate)} day
                                            {serviceDetails.selectedDate.length > 1 ? "s" : ""})
                                        </Typography>
                                    )}
                            </Box>
                        </Box>

                        {/* Discount Code */}
                        {/* <Box mb={2}>
                            <InputLabel>Discount code</InputLabel>
                            <Box display="flex" mt={1}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    size="small"
                                // sx={{ borderRadius: "4px 0 0 4px" }}
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ borderRadius: "0 10px 10px 0" }}
                                >
                                    Apply
                                </Button>
                            </Box>
                        </Box> */}

                        {/* Summary */}
                        <Box mt={2}>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2">Subtotal</Typography>
                                <Typography variant="body2">${serviceDetails.package.price}</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2">Platform fee</Typography>
                                <Typography variant="body2">$1.00</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mb={1}>
                                <Typography variant="body2">Discount</Typography>
                                <Typography variant="body2">-</Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" mt={2}>
                                <Typography variant="h6">Total</Typography>
                                <Typography variant="h6">Rs. {total}</Typography>
                            </Box>
                        </Box>

                        <RazorpayPayment amount={total} buttonAction={isButtonDisabled} bookingDetails={serviceDetails} />
                        <Box display="flex" alignItems="center" >
                            <Lock fontSize="small" sx={{ mr: 1 }} />
                            <Typography variant="caption" color="textSecondary">
                                Secure Checkout - SSL Encrypted
                            </Typography>
                        </Box>
                        <Typography
                            variant="caption"
                            color="textSecondary"
                            sx={{ mt: 1 }}
                        >
                            Ensuring your financial and personal details are secure during
                            every transaction.
                        </Typography>

                    </Paper>
                </Grid>
            </Grid>
            <FooterComponent />

            {/* <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="warning"
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar> */}

        </Box >
    );
};

export default CheckoutLayout;
