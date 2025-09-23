import React, { useState, useEffect } from "react";
import {
    Box,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
} from "@mui/material";
import { useOutletContext } from "react-router-dom";
import CustomAlert from "../utils/CustomAlert";
import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import axios from "axios";
import { apiUrl, backendApi } from "../Api/Api";
import { Camera, CameraAlt } from "@mui/icons-material";

const VendorProfileForm = () => {
    const { vendor } = useOutletContext();

    const normalizeText = (text) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const [isEditing, setIsEditing] = useState(false);
    const [vendorProfile, setVendorProfile] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        profilePic: "",
        vendorId: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState("");
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [showAlert, setAlert] = useState(false);
    const [showPicAlert, setProfilePicAlert] = useState(false);



    // Initialize form values from vendor context
    useEffect(() => {
        if (vendor) {
            setVendorProfile({
                phone: vendor.phone || "",
                email: vendor.email || "",
                firstName: vendor.firstName || "",
                lastName: vendor.lastName || "",
                addressLine1: vendor.addressLine1 || "",
                addressLine2: vendor.addressLine2 || "",
                city: vendor.city || "",
                state: vendor.state || "",
                country: vendor.country || "",
                pincode: vendor.pincode || "",
                profilePic: vendor.profilePic || "",
                vendorId: vendor._id,
            });
        }
    }, [vendor]);

    // Fetch countries on mount
    useEffect(() => {
        fetch("https://countriesnow.space/api/v0.1/countries")
            .then(res => res.json())
            .then(data => setCountries(data.data.map(c => c.country)))
            .catch(console.error);
    }, []);

    // Fetch states when country changes
    useEffect(() => {
        if (vendorProfile.country) {
            fetch("https://countriesnow.space/api/v0.1/countries/states", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country: vendorProfile.country }),
            })
                .then(res => res.json())
                .then(data => setStates(data.data.states.map(s => s.name)))
                .catch(console.error);
        } else {
            setStates([]);
        }
    }, [vendorProfile.country]);

    // Fetch cities when state changes
    useEffect(() => {
        if (vendorProfile.country && vendorProfile.state) {
            fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    country: vendorProfile.country,
                    state: vendorProfile.state
                }),
            })
                .then(res => res.json())
                .then(data => setCities(data.data))
                .catch(console.error);
        } else {
            setCities([]);
        }
    }, [vendorProfile.country, vendorProfile.state]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate image type
        if (!file.type.startsWith("image/")) {
            alert("Please upload a valid image file.");
            return;
        }

        // Validate file size (max 1MB)
        const maxSize = 1 * 1024 * 1024; // 1MB
        if (file.size > maxSize) {
            alert("File size must be 1MB or less.");
            return;
        }

        const newPreviewUrl = URL.createObjectURL(file);

        // Compare with existing profilePic URL
        if (newPreviewUrl === vendorProfile.profilePic) {
            console.log("Same image selected. Skipping upload.");
            return;
        }

        setSelectedFile(file);
        setPreviewUrl(newPreviewUrl);

        // Upload image
        try {
            const formData = new FormData();
            formData.append("profilePic", file);

            const { data } = await backendApi.post(
                `/api/vendor/profile/${vendorProfile.vendorId}/upload-profile-pic`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                }
            );
            setProfilePicAlert(true)
            vendorProfile.profilePic = data.profilePicUrl;
        } catch (err) {
            console.error("Image upload failed:", err);
        }
    };

    // const handleImageChange = async (e) => {
    //     const file = e.target.files[0];
    //     if (!file) return;

    //     // Validate image type
    //     if (!file.type.startsWith("image/")) {
    //         alert("Please upload a valid image file.");
    //         return;
    //     }

    //     // Validate file size (max 1MB)
    //     const maxSize = 1 * 1024 * 1024; // 1MB
    //     if (file.size > maxSize) {
    //         alert("File size must be 1MB or less.");
    //         return;
    //     }

    //     const newPreviewUrl = URL.createObjectURL(file);

    //     // Check if image hasn't changed
    //     if (vendorProfile.profilePic && vendorProfile.profilePic.includes(newPreviewUrl)) {
    //         console.log("Same image selected. Skipping upload.");
    //         return;
    //     }

    //     setSelectedFile(file);
    //     setPreviewUrl(newPreviewUrl);

    //     // Upload to Cloudinary
    //     try {
    //         const formData = new FormData();
    //         formData.append("file", file);
    //         formData.append("upload_preset", "unsigned_upload");

    //         const { data } = await axios.post(
    //             "https://api.cloudinary.com/v1_1/duhk3ldw7/image/upload",
    //             formData
    //         );

    //         vendorProfile.profilePic = data.secure_url;
    //         setProfilePicAlert(true);
    //     } catch (err) {
    //         console.error("Cloudinary upload failed:", err);
    //     }
    // };



    const handleSave = async () => {
        if (vendor._id) {
            try {
                const res = await backendApi.put(`/vendor/profile/update/${vendorProfile.vendorId}`, vendorProfile,);
                setIsEditing(false);
                setAlert(true);
            } catch (err) {
                console.log("Error updating profile:", err);
            }
        } else {
            console.log("fad");
        }

    };


    return (
        <Box sx={{ p: 2 }}>
            {showAlert && (
                <CustomAlert
                    openInitially={showAlert}
                    onClose={() => setAlert(false)}
                    severity="success"
                    icon={<CheckCircleOutline />}
                    title="Updated"
                    message="Profile successfully updated."
                />
            )}

            {showPicAlert && (
                <CustomAlert
                    openInitially={showPicAlert}
                    onClose={() => setProfilePicAlert(false)}
                    severity="success"
                    icon={<CheckCircleOutline />}
                    title="Updated"
                    message="Profile Picture successfully updated."
                />
            )}


            <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 2, width: "100%" }}
            >
                {/* Profile Picture Section */}
                <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" flexDirection="row" alignItems="center">
                        <img
                            // src="https://res.cloudinary.com/duhk3ldw7/image/upload/v1752840825/it5tbflloryvd98sw7bo.webp"
                            src={vendorProfile.profilePic || previewUrl || "https://placehold.co/120"}
                            alt="Profile"
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                objectFit: "cover",
                                marginBottom: 10,
                            }}
                        />

                        <IconButton component="label">
                            <CameraAlt />
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageChange}
                            />
                        </IconButton>
                    </Box>
                </Grid>

                {/* Buttons Section */}
                <Grid
                    item
                    xs={12}
                    sm={6}
                    md="auto"
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    justifyContent="center"
                    alignItems={{ xs: "flex-end", sm: "flex-end" }}
                    gap={2}
                >
                    <Button variant="outlined" onClick={() => setIsEditing((prev) => !prev)}>
                        {isEditing ? "Cancel" : "Edit"}
                    </Button>
                    {isEditing && (
                        <Button variant="contained" onClick={handleSave}>
                            Save Changes
                        </Button>
                    )}
                </Grid>
            </Grid>




            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        value={vendor?.email || ""}
                        disabled
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Phone Number"
                        value={vendorProfile.phone || vendor?.phone || ""}
                        disabled={!isEditing}
                        onChange={e =>
                            setVendorProfile(prev => ({
                                ...prev,
                                'phone': e.target.value,
                            }))
                        }
                    />
                </Grid>

                {[
                    { label: "First Name", name: "firstName" },
                    { label: "Last Name", name: "lastName" },
                    { label: "Address Line 1", name: "addressLine1" },
                    { label: "Address Line 2", name: "addressLine2" },
                ].map(({ label, name }) => (
                    <Grid item xs={12} md={6} key={name}>
                        <TextField
                            fullWidth
                            label={label}
                            value={vendorProfile[name]}
                            disabled={!isEditing}
                            onChange={e =>
                                setVendorProfile(prev => ({
                                    ...prev,
                                    [name]: e.target.value,
                                }))
                            }
                        />
                    </Grid>
                ))}

                {/* Country Dropdown */}
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>Country</InputLabel>
                        <Select
                            label="Country"
                            value={vendorProfile.country}
                            onChange={e =>
                                setVendorProfile(prev => ({
                                    ...prev,
                                    country: e.target.value,
                                    state: "",
                                    city: "",
                                }))
                            }
                        >
                            {countries.map(c => (
                                <MenuItem key={c} value={c}>
                                    {c}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* State Dropdown */}
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>State</InputLabel>
                        <Select
                            label="State"
                            value={vendorProfile.state}
                            onChange={e =>
                                setVendorProfile(prev => ({
                                    ...prev,
                                    state: e.target.value,
                                    city: "",
                                }))
                            }
                        >
                            {states.map(s => (
                                <MenuItem key={s} value={s}>
                                    {s}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* City Dropdown */}
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth disabled={!isEditing}>
                        <InputLabel>City</InputLabel>
                        <Select
                            label="City"
                            value={vendorProfile.city}
                            onChange={e =>
                                setVendorProfile(prev => ({
                                    ...prev,
                                    city: normalizeText(e.target.value),
                                }))
                            }
                        >
                            {cities.map(c => (
                                <MenuItem key={c} value={c}>
                                    {normalizeText(c)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                {/* Pincode */}
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Pincode"
                        value={vendorProfile.pincode}
                        disabled={!isEditing}
                        onChange={e =>
                            setVendorProfile(prev => ({
                                ...prev,
                                pincode: e.target.value,
                            }))
                        }
                    />
                </Grid>

                <Grid container spacing={2} display="flex" justifyContent='end' sx={{ display: { xs: "block", md: "none" }, mb: 2, width: "100%", mt: 5 }}>
                    <Grid item>
                        <Button
                            variant="outlined"
                            onClick={() => setIsEditing(prev => !prev)}
                        >
                            {isEditing ? "Cancel" : "Edit"}
                        </Button>
                    </Grid>
                    {isEditing && (
                        <Grid item>
                            <Button variant="contained" onClick={handleSave}>
                                Save Changes
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};

export default VendorProfileForm;
