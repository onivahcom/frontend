import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    IconButton as AppBarIconButton,
    Paper,
    Button,
    Alert,
    useTheme,
} from "@mui/material";
import {
    Menu as MenuIcon,
    Close as CloseIcon,
    ErrorOutline,
} from "@mui/icons-material";
import { Country, State, City } from "country-state-city";
import { useOutletContext } from "react-router-dom";

const UserNotifications = () => {

    const { userData } = useOutletContext();

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [incompleteFields, setIncompleteFields] = useState([]);

    const [profileDetails, setProfileDetails] = useState({
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        phone: userData.phone,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        zipcode: userData.zipcode,
        userId: userData._id,
        profilePic: userData.profilePic || "https://placehold.co/100x100"

    });

    useEffect(() => {
        if (!userData) return;

        // Incomplete fields check
        const fields = [];
        if (!userData.firstname) fields.push("First Name");
        if (!userData.lastname) fields.push("Last Name");
        if (!userData.email) fields.push("Email Address");
        if (!userData.phone) fields.push("Phone Number");
        if (!userData.country) fields.push("Country");
        if (!userData.state) fields.push("State");
        if (!userData.city) fields.push("City");
        if (!userData.zipcode) fields.push("Zip Code");
        setIncompleteFields(fields);

        // Set profileDetails directly
        setProfileDetails({
            ...profileDetails,
            country: userData.country || '',
            state: userData.state || '',
            city: userData.city || ''
        });

        // Set selectedCountry ISO
        const selectedCountryObj = countries.find(c => c.name === userData.country);
        if (selectedCountryObj) {
            setSelectedCountry(selectedCountryObj.isoCode);
        }
    }, [userData, countries]);

    useEffect(() => {
        if (selectedCountry) {
            const stateList = State.getStatesOfCountry(selectedCountry);
            setStates(stateList);
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (profileDetails.state && states.length > 0) {
            const matchedState = states.find(s => s.name === profileDetails.state);
            if (matchedState) {
                setSelectedState(matchedState.isoCode);
            }
        }
    }, [profileDetails.state, states]);

    useEffect(() => {
        if (selectedCountry && selectedState) {
            const cityList = City.getCitiesOfState(selectedCountry, selectedState);
            setCities(cityList);
        } else {
            setCities([]);
        }
    }, [selectedCountry, selectedState]);

    useEffect(() => {
        if (profileDetails.city && cities.length > 0) {
            const matchedCity = cities.find(c => c.name === profileDetails.city);
            if (matchedCity) {
                setSelectedCity(matchedCity.name);
            }
        }
    }, [profileDetails.city, cities]);


    useEffect(() => {
        setCountries(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            const statesList = State.getStatesOfCountry(selectedCountry); // Get states of selected country
            setStates(statesList);
        } else {
            setStates([]);
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedState) {
            const citiesList = City.getCitiesOfState(selectedCountry, selectedState); // Get cities of selected state
            setCities(citiesList);
        } else {
            setCities([]);
        }
    }, [selectedState, selectedCountry]);



    return (
        <Box>
            <Typography
                variant="h5"
                fontWeight="bold"
                mb={3}
                textAlign="center"
                color="primary"
            >
                Notifications Center
            </Typography>
            <Paper
                elevation={0}
                sx={{
                    p: 4,
                    borderRadius: 3,
                    maxWidth: "600px",
                    margin: "0 auto",
                    textAlign: "center",
                }}
            >
                {incompleteFields.length > 0 ? (
                    <>
                        <Typography variant="h6" color="error" mb={2}>
                            Missing Information
                        </Typography>
                        <Alert severity="warning" sx={{ mb: 3 }}>
                            Please complete the following fields to ensure your profile is up-to-date:
                        </Alert>
                        <List
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "flex-start",
                                gap: 1,
                            }}
                        >
                            {incompleteFields.map((field, index) => (
                                <ListItem key={index} sx={{ p: 0 }}>
                                    <ListItemIcon>
                                        <ErrorOutline color="error" />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={field}
                                        primaryTypographyProps={{ fontWeight: "bold" }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                        <Box textAlign="center" mt={4}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                // onClick={() => setActiveItem("Personal Info")}
                                sx={{
                                    textTransform: "capitalize",
                                    borderRadius: "8px",
                                    px: 4,
                                    py: 1,
                                }}
                            >
                                Complete Profile Now
                            </Button>
                        </Box>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" color="success.main" textAlign="center">
                            🎉 All information is complete!
                        </Typography>
                        <Typography variant="body1" textAlign="center" mt={2}>
                            Your profile is up-to-date. No further action is required.
                        </Typography>
                    </>
                )}
            </Paper>
        </Box>
    )
}

export default UserNotifications;