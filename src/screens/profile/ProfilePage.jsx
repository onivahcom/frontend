import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Grid,
    Typography,
    Avatar,
    TextField,
    Select,
    MenuItem,
    IconButton,
    IconButton as AppBarIconButton,
    Paper,
    Button,
} from "@mui/material";
import {
    CameraAlt,
    Menu as MenuIcon,
    Close as CloseIcon,
    ErrorOutline,
    Edit,
    CheckCircle,
} from "@mui/icons-material";
import { Country, State, City } from "country-state-city";
import { InputLabel, FormControl } from '@mui/material';
import axios from "axios";
import PhoneNumber from "../../components/PhoneNumber";
import { useOutletContext } from "react-router-dom";
import { apiUrl, backendApi } from "../../Api/Api";



const ProfilePage = () => {

    const fileInputRef = useRef(null);
    const { userData } = useOutletContext();
    const [phoneVerification, setPhoneVerification] = useState(false)

    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const [selectedCountry, setSelectedCountry] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    const [isEditable, setIsEditable] = useState(false); // State to toggle edit mode
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


    const toggleEdit = () => {
        setIsEditable((prev) => !prev);
    };

    const getIsoCodeFromCountryName = (name) => {
        const found = countries.find(c => c.name === name);
        return found ? found.isoCode : '';
    };

    // profile handling
    const handleInputChange = (field, value) => {
        setProfileDetails((prevDetails) => ({
            ...prevDetails,
            [field]: value,
        }));
    };

    // Function to handle the country change
    const handleCountryChange = (e) => {
        const selectedCountryCode = e.target.value;
        setSelectedCountry(selectedCountryCode); // ISO code like 'US'

        const selectedCountry = countries.find(
            (country) => country.isoCode === selectedCountryCode
        );

        // Reset dependent values
        setSelectedState('');
        setSelectedCity('');

        setProfileDetails({
            ...profileDetails,
            country: selectedCountry?.name || '',
            state: '',
            city: ''
        });
    };

    // Function to handle the state change
    const handleStateChange = (e) => {
        const selectedStateCode = e.target.value;
        setSelectedState(selectedStateCode);  // Update dropdown state

        const selectedState = states.find(state => state.isoCode === selectedStateCode);

        setProfileDetails({
            ...profileDetails,
            state: selectedState?.name || '',  // Store state name
            city: '' // Reset city when state changes
        });

        setSelectedCity(''); // Also reset selectedCity
    };

    // Function to handle the city change
    const handleCityChange = (e) => {
        const selectedCityName = e.target.value;
        setSelectedCity(selectedCityName);

        setProfileDetails({
            ...profileDetails,
            city: selectedCityName
        });
    };

    const handlePhone = async (phone) => {
        try {
            const response = await backendApi.post(`/profile/send-otp`, { phone });
            alert(response.data.message)
            setPhoneVerification(true)
        } catch (err) {
            setPhoneVerification(false)
            alert(err.response.data.message)
            console.log(err);
        }
    }

    const handleIconClick = () => {
        fileInputRef.current.click(); // Trigger hidden file input
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // 👉 Show local preview immediately
            const imageUrl = URL.createObjectURL(file);
            setProfileDetails((prev) => ({
                ...prev,
                profilePic: imageUrl, // local preview
            }));

            // 📦 Prepare form data
            const formData = new FormData();
            formData.append("profilePic", file);

            // 🛰 Upload to backend
            const response = await backendApi.post(
                `/api/profile/${profileDetails.userId}/upload-profile-pic`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        // Authorization: `Bearer ${token}`, // if protected route
                    },
                    withCredentials: true // if using cookies/session
                }
            );

            // ✅ Get CloudFront URL and update actual state
            const uploadedUrl = response.data.profilePicUrl;

            setProfileDetails((prev) => ({
                ...prev,
                profilePic: uploadedUrl, // now use real CloudFront URL
            }));

        } catch (error) {
            console.error("Error uploading profile picture:", error);
            alert("Failed to upload profile picture.");
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await backendApi.post(`/profile_save`, profileDetails);
            console.log('Profile saved successfully:', response.data);
            toggleEdit()
            alert('Profile saved successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error saving profile');
        }
    };

    return (
        <Box maxWidth='md' mx='auto' sx={{ p: 2, mt: 4, minHeight: "100vh" }}>

            <Typography variant="h6" mb={2}>
                Profile
            </Typography>
            <Grid container spacing={2} alignItems="center">
                {/* <Grid item xs={12} md={4}>
                    <Box
                        component="img"
                        src="https://cdn.pixabay.com/photo/2020/09/19/09/40/sunset-5584004_1280.jpg"
                        alt="Sample"
                        sx={{
                            display: { xs: "none", md: "flex" },
                            width: '100%',
                            height: 500,
                            borderRadius: 5,
                            boxShadow: 0,
                            objectFit: "cover"
                        }}
                    />
                </Grid> */}
                <Grid item xs={12} md={12}>

                    <Paper elevation={0} sx={{ p: 1, mb: 4, boxShadow: 0 }}>
                        <Box
                            display="flex"
                            flexDirection="row"
                            alignItems="flex-start"
                            mb={3}
                        >
                            <Avatar
                                src={profileDetails.profilePic}
                                alt="User profile picture"
                                sx={{ width: 96, height: 96, mr: 2 }}
                            />
                            <IconButton
                                onClick={handleIconClick}
                                sx={{
                                    bgcolor: "primary.main",
                                    color: "white",
                                    "&:hover": {
                                        bgcolor: "primary.dark",
                                    },
                                }}
                            >
                                <CameraAlt />
                            </IconButton>

                            {/* Hidden file input */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                            />
                        </Box>

                        {/* Edit Button */}

                        <Grid container spacing={2} justifyContent="end">
                            {/* Edit/Cancel Button */}
                            <Grid item>
                                <Button
                                    endIcon={!isEditable && <Edit />}
                                    variant="outlined"
                                    onClick={toggleEdit}
                                    sx={{
                                        boxShadow: 0,
                                        // '&:hover': {
                                        //     backgroundColor: isEditable ? '#d32f2f' : '#388e3c', // Hover effect
                                        // },
                                        // color: isEditable ? 'black' : 'white',
                                        fontWeight: isEditable ? 'bold' : 'normal',
                                        padding: '8px 16px',
                                        mb: 2, // Margin-bottom for spacing between buttons
                                    }}
                                >
                                    {isEditable ? "Cancel" : "Edit"}
                                </Button>
                            </Grid>

                            {/* Save Profile Button */}
                            {isEditable && (
                                <Grid item>
                                    <Button
                                        endIcon={isEditable && <CheckCircle />}
                                        variant="contained"
                                        sx={{
                                            fontWeight: 'bold',
                                            padding: '8px 16px',
                                            borderRadius: '8px', // Rounded corners
                                            width: '150px', // Fixed width for alignment
                                            mb: 2,
                                        }}
                                        onClick={handleSubmit}
                                    >
                                        Save Profile
                                    </Button>
                                </Grid>
                            )}
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="First Name"
                                    fullWidth
                                    value={profileDetails.firstname}
                                    onChange={(e) => handleInputChange('firstname', e.target.value)}
                                    disabled={!isEditable}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Last Name"
                                    fullWidth
                                    value={profileDetails.lastname}
                                    onChange={(e) => handleInputChange('lastname', e.target.value)}
                                    disabled={!isEditable}
                                />
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <TextField
                                    variant="outlined"
                                    label="Email Address"
                                    fullWidth
                                    value={profileDetails.email}
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} sm={12}>
                                <PhoneNumber usedPhone={userData.phone} onsubmit={handlePhone} verifyOpen={phoneVerification} userData={userData} />
                            </Grid>

                            {/* Country Dropdown */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Select Country</InputLabel>
                                    <Select
                                        value={isEditable ? getIsoCodeFromCountryName(profileDetails.country) : selectedCountry}
                                        onChange={(e) => handleCountryChange(e)}   // Use the handleCountryChange function
                                        label="Select Country"
                                        disabled={!isEditable}
                                    >
                                        <MenuItem value="">
                                            <em>Select Country</em>
                                        </MenuItem>
                                        {countries.map((country) => (
                                            <MenuItem key={country.isoCode} value={country.isoCode}>
                                                {country.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* State Dropdown */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Select State</InputLabel>
                                    <Select
                                        value={selectedState}
                                        onChange={handleStateChange}
                                        label="Select State"
                                        disabled={!selectedCountry || !isEditable}
                                    >
                                        <MenuItem value="">
                                            <em>Select State</em>
                                        </MenuItem>
                                        {states.map((state) => (
                                            <MenuItem key={state.isoCode} value={state.isoCode}>
                                                {state.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>


                            {/* City Dropdown */}
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Select City</InputLabel>
                                    <Select
                                        value={selectedCity}
                                        onChange={handleCityChange}
                                        label="Select City"
                                        disabled={!selectedState || !isEditable}
                                    >
                                        <MenuItem value="">
                                            <em>Select City</em>
                                        </MenuItem>
                                        {cities.map((city) => (
                                            <MenuItem key={city.name} value={city.name}>
                                                {city.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>


                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Zip Code"
                                    fullWidth
                                    value={profileDetails.zipcode}
                                    onChange={(e) => handleInputChange('zipcode', e.target.value)}
                                    disabled={!isEditable}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    )
}

export default ProfilePage