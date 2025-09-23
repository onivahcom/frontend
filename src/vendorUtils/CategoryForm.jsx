import React, { useEffect, useRef, useState } from "react";
import {
    TextField,
    Button,
    Grid,
    Typography,
    Box,
    Stepper,
    Step,
    StepLabel,
    InputAdornment,
    Paper,
    IconButton,
    Autocomplete,
    Alert,
    Divider,
    Card,
    CardContent,
    Stack,
    ListItem,
    ListItemIcon,
    ListItemText,
    List,
    FormControl,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    MenuItem,
    FormHelperText,
    InputLabel,
    Select,
    Rating,
    useMediaQuery,
    Avatar,
} from "@mui/material";
import {
    LocationOn,
    Business,
    AccountBox,
    Shield,
    Description,
    Add,
    NavigateBefore,
    NavigateNext,
    CheckCircle,
    Done,
    Remove,
    ErrorOutline,
    PendingActions,
} from "@mui/icons-material";
import withLoadingAndError from "../hoc/withLoadingAndError";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { apiUrl, backendApi } from "../Api/Api";
import { NavLink, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import ImageUploader from "./ImageUploader";
import ReusableSnackbar from "../utils/ReusableSnackbar";
import WhyChooseUsGenerator from "./WhyChooseUsGenerator";
import Star from "@mui/icons-material/Star";
import theme from "../Themes/theme";
import CustomFieldsDemo from "./CustomFieldsDemo";
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import VerifiedUser from "@mui/icons-material/VerifiedUser";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { State, City } from "country-state-city";
import HostCard from "../utils/DetailedServicePageSections/HostCard";


const icons = [
    <StarIcon color="primary" sx={{ fontSize: 30 }} />,
    <ThumbUpIcon color="primary" sx={{ fontSize: 30 }} />,
    <VerifiedUserIcon color="primary" sx={{ fontSize: 30 }} />,
    <InfoIcon color="primary" sx={{ fontSize: 30 }} />,
];

const DynamicForm = ({ fields, onSubmit, setLoading, setError, loading, error }) => {

    const formDataRef = useRef(null);

    const { vendor } = useOutletContext();
    const navigate = useNavigate();
    const location = useLocation();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Read the `tab` query param from URL
    const searchParams = new URLSearchParams(location.search);
    const initialTab = parseInt(searchParams.get('tab')) || 0;

    const [imageFolders, setImageFolders] = useState([
        {
            id: Date.now(), // unique id for this folder
            folderName: "CoverImage",
            images: [],
        },
    ]);
    const [locations, setLocations] = useState([]); // Store fetched locations
    const [isCoverImageValid, setIsCoverImageValid] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [showAll, setShowAll] = useState(false);
    const detailsRef = useRef(null);

    useEffect(() => {


        const fetchCities = async () => {
            try {

                const tamilNadu = State.getStatesOfCountry("IN").find(s => s.name === "Tamil Nadu");
                const districts = City.getCitiesOfState("IN", tamilNadu.isoCode);

                // ✅ Extract only city names
                const districtNames = districts.map(d => d.name);
                setLocations(districtNames || []);
                // const response = await axios.post('https://countriesnow.space/api/v0.1/countries/state/cities', {
                //     country: 'India',
                //     state: 'Tamil Nadu'
                // });
                // setLocations(response.data.data || []);
            } catch (error) {
                console.error('Error fetching cities:', error);
            }
        };

        fetchCities();
    }, []);

    const [images, setImages] = useState([]);
    const [isCoverImageEmpty, setIsCoverImageEmpty] = useState(false);

    const [formData, setFormData] = useState({
        vendorId: vendor?._id,
        fullName: "",
        lastName: "",
        email: "",
        phone: "",
        addressLine1: "",
        addressLine2: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
        businessName: "",
        description: "",
        gstNumber: "",
        aadharNumber: "",
        availableLocations: [],
        amenities: [""],
        thingsToKnow: [""],
        offers: [""],
    });


    // Populate formData when vendor loads
    useEffect(() => {
        if (vendor) {

            const getValidValue = (prefVal, currentVal) => {
                return prefVal && prefVal.trim() !== "" ? prefVal : currentVal;
            };

            setFormData((prev) => ({
                ...prev,
                email: vendor.email || "",
                phone: vendor.phone ? String(vendor.phone) : "",
                fullName: getValidValue(vendor.firstName, prev.fullName),
                lastName: getValidValue(vendor.lastName, prev.lastName),
                addressLine1: getValidValue(vendor.addressLine1, prev.addressLine1),
                addressLine2: getValidValue(vendor.addressLine2, prev.addressLine2),
                city: getValidValue(vendor.city, prev.city),
                state: getValidValue(vendor.state, prev.state),
                country: getValidValue(vendor.country, prev.country),
                pincode: getValidValue(vendor.pincode, prev.pincode),
            }));

        }
    }, [vendor]);

    const [customFields, setCustomFields] = useState([]);
    const [customPricing, setCustomPricing] = useState([{ title: "", description: "", price: 0 }]);
    const [generatedWhyUs, setGeneratedWhyUs] = useState([]);
    const [activeStep, setActiveStep] = useState(initialTab);

    const steps = ["Profile", "Business Details", "Confirmation"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "description" ? value.trimStart() : value, // trims start while typing
        }));
    };

    // Handle location selection
    const handleLocationChange = (event, newValue) => {
        setFormData({ ...formData, availableLocations: newValue }); // Store as an array
    };

    const handleAadharChange = (e) => {
        let value = e.target.value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");
        setFormData({ ...formData, aadharNumber: value });
    };

    const handleAddCustomField = () => {
        setCustomFields([...customFields, { name: "", type: "text", value: "" }]);
    };

    const handleArrayChange = (field, index, value) => {
        const updated = [...formData[field]];
        updated[index] = value;
        setFormData({ ...formData, [field]: updated });
    };

    const handleAddItem = (field) => {
        setFormData({ ...formData, [field]: [...formData[field], ""] });
    };

    const handleRemoveItem = (field, index) => {
        const updated = [...formData[field]];
        updated.splice(index, 1);
        setFormData({ ...formData, [field]: updated });
    };

    const handleAddCustomPricingField = () => {
        setCustomPricing([...customPricing, { title: "", description: "", price: 0 }]);
    };

    const handleCustomFieldChange = (index, key, newValue) => {
        setCustomFields(prevFields =>
            prevFields.map((field, i) =>
                i === index ? { ...field, [key]: newValue } : field
            )
        );
    };

    const handleCustomPricingChange = (index, key, newValue) => {
        setCustomPricing((prev) => {
            const updatedFields = [...prev];
            updatedFields[index] = {
                ...updatedFields[index],
                [key]: key === "price" ? Number(newValue) : newValue
            };
            return updatedFields;
        });
    };

    const handleNext = () => {
        window.scrollTo(0, 0);

        if (validateFields(activeStep)) {
            if (activeStep < steps.length - 1) {
                const nextStep = activeStep + 1;
                setActiveStep(nextStep);

                // ✅ Update URL with new tab step
                const newSearchParams = new URLSearchParams(location.search);
                newSearchParams.set('tab', nextStep);
                navigate({ search: newSearchParams.toString() }, { replace: true });
            }
        }
    };

    const handleBack = () => {
        window.scrollTo(0, 0);

        const prevStep = activeStep - 1;
        setActiveStep(prevStep);

        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.set('tab', prevStep);
        navigate({ search: newSearchParams.toString() }, { replace: true });
    };

    let isValid = true;
    const errorMessages = [];

    // demo details
    const [showDemo, setShowDemo] = useState(false);

    const handleOpen = () => setShowDemo(true);
    const handleClose = () => setShowDemo(false);

    // validate
    const validateFields = (step) => {

        if (step === 0) {
            // Validate fields for Step 0
            const requiredFields = [
                "fullName",
                "lastName",
                "email",
                "phone",
                "addressLine1",
                "country",
                "city",
                "state",
                "pincode",
            ];
            requiredFields.forEach((field) => {
                if (!formData[field] || formData[field].trim() === "") {
                    isValid = false;
                    errorMessages.push(`${field} is required`);
                }
            });
        } else if (step === 1) {
            // Validate fields for Step 1
            const requiredFields = [
                "businessName",
                "description",
                "aadharNumber",
                "availableLocations",
            ];
            requiredFields.forEach((field) => {
                if (!formData[field] ||
                    (typeof formData[field] === "string" && formData[field].trim() === "") ||
                    (Array.isArray(formData[field]) && formData[field].length === 0)) {
                    isValid = false;
                    errorMessages.push(`${field.replace(/([A-Z])/g, ' $1')} is required`);
                }
            });
            if (!isCoverImageEmpty) {
                isValid = false;
                errorMessages.push(`Upload Cover Image!`);
            }

            const isCustomPricingEmpty = customPricing.some((item) => {
                const titleEmpty = typeof item.title !== "string" || item.title.trim() === "";
                const descriptionEmpty =
                    typeof item.description !== "string" || item.description.trim() === "";
                const priceEmpty =
                    item.price === null ||
                    (typeof item.price === "string" && item.price.trim() === "") ||
                    (typeof item.price === "number" && item.price <= 0);

                // console.log("Incomplete entry:", titleEmpty || descriptionEmpty || priceEmpty);
                return titleEmpty || descriptionEmpty || priceEmpty;
            });

            if (isCustomPricingEmpty) {
                isValid = false;
                errorMessages.push("All custom pricing fields (title, description, price) must be filled!");
            }


        }
        if (!isValid) {
            setSnackbar({
                open: true,
                message: errorMessages[0],  // show only the first error
                severity: 'error',
            });

        }
        return isValid;
    };

    const handleSubmit = async (e) => {

        if (activeStep === steps.length - 1) {
            const data = formDataRef.current;

            if (!data) {
                alert("No form data to upload. Please upload images first.");
                return;
            }

            try {
                // 🔥 Upload images first
                const response = await backendApi.post(
                    `/api/s3/upload-images`,
                    data,
                    {
                        headers: { "Content-Type": "multipart/form-data" }
                    }
                );

                const { groupedUrls } = response.data; // ✅ Get uploaded image URLs

                const finalData = {
                    ...formData,
                    customPricing,
                    customFields,
                    generatedWhyUs,
                    file, // raw file object
                    groupedUrls
                };
                onSubmit(finalData);

            } catch (error) {
                console.log("Upload error:", error);
                alert("Error uploading images: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const MAX_KB = 10;

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            const fileSizeKB = selected.size / 1024;
            if (fileSizeKB < MAX_KB) {
                setError(`File must be at least ${MAX_KB}KB.`);
                setFile(null);
                setPreviewUrl('');
            } else {
                setError('');
                setFile(selected);
                const fileURL = URL.createObjectURL(selected);
                setPreviewUrl(fileURL);
            }
        }
    };

    const handleImageUploadFormData = (formData) => {
        formDataRef.current = formData;

        let folderMap = null;

        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
            if (key === "folderMap") {
                try {
                    folderMap = JSON.parse(value);

                } catch (err) {
                    console.error("Invalid folderMap JSON:", err);
                }
            }
        }

        // Validate CoverImage folder
        const hasCoverImage = folderMap?.some(
            item => item.folderName === "CoverImage"
        );

        setIsCoverImageValid(!!hasCoverImage); // true if found, false if not
    };

    const handleFolderReceive = (folders) => {
        setImages(folders)
        if (folders.length > 0 && folders[0].images.length === 0) {
            setIsCoverImageEmpty(false);
        } else {
            setIsCoverImageEmpty(true);
        }
    };

    const scrollToDetails = () => {
        setShowAll(true);
        setTimeout(() => {
            detailsRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100); // slight delay to allow render
    };

    const handleGeneratedReasons = (reasons) => {
        setGeneratedWhyUs(reasons); // Store in state
    };

    const requiredFields = [
        "fullName",
        "lastName",
        "email",
        "phone",
        "addressLine1",
        "country",
        "city",
        "state",
        "pincode",
    ];

    // Find missing fields
    const missingFields = requiredFields.filter(
        (field) => !formData[field] || formData[field].trim() === ""
    );

    // const HostCard = () => {

    //     return (
    //         <Box sx={{ mt: 3, p: 2, borderRadius: 3, boxShadow: 0, borderTop: "1px solid #ddd", borderBottom: "1px solid #ddd", }}>
    //             {/* Host Header */}
    //             <Box sx={{ display: "flex", alignItems: "center", gap: 2, }}>
    //                 <Avatar
    //                     src={vendor?.profilePic || undefined}
    //                     sx={{ width: 64, height: 64, bgcolor: "grey.200" }}
    //                 >
    //                     {!vendor?.profilePic && <AccountCircle sx={{ fontSize: 40, color: "grey.600" }} />}
    //                 </Avatar>
    //                 <Box>
    //                     <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
    //                         <Typography variant="subtitle1" fontWeight={600}>
    //                             Hosted by {vendor?.firstName || "User"}
    //                         </Typography>
    //                         <VerifiedUser sx={{ fontSize: 18 }} />
    //                     </Box>

    //                     <Typography variant="body2" color="text.secondary">
    //                         {vendor?.hostingYears || 1} years hosting
    //                     </Typography>
    //                 </Box>
    //             </Box>

    //             {/* Listing Highlights */}
    //             <Box sx={{ mt: 2 }}>
    //                 <Box
    //                     sx={{
    //                         display: "flex",
    //                         justifyContent: "space-between",
    //                         gap: 2,
    //                         flexWrap: "wrap", // responsive
    //                     }}
    //                 >
    //                     {formData.amenities?.slice(0, 3).map((highlight, idx) =>
    //                         highlight ? (
    //                             <Box
    //                                 key={idx}
    //                                 sx={{
    //                                     flex: "1 1 30%",
    //                                     textAlign: "center",
    //                                     bgcolor: "grey.100",
    //                                     borderRadius: 2,
    //                                     p: 1.5,
    //                                     display: "flex",
    //                                     alignItems: "center",
    //                                     justifyContent: "center",
    //                                     gap: 1,
    //                                 }}
    //                             >
    //                                 <Star fontSize="small" color="primary" />
    //                                 <Typography variant="body2" fontWeight={500}>
    //                                     {highlight}
    //                                 </Typography>
    //                             </Box>
    //                         ) : null
    //                     )}
    //                 </Box>
    //             </Box>

    //         </Box>

    //     );
    // };

    // Helper: render a dynamic field section
    const renderSection = (field, label, placeholder, subtitle) => (
        <Paper
            elevation={0}
            sx={{ borderRadius: 3, bgcolor: "#f8f8f8", p: 2 }}
        >
            <Box sx={{ display: "flex", flexDirection: "column", mb: 2 }}>
                <Typography variant="subtitle1" component='div' fontWeight={600} gutterBottom>{label}</Typography>
                <Typography variant="body2" component='div' color="textSecondary" sx={{ maxWidth: 600 }} gutterBottom>
                    {subtitle}
                </Typography>
            </Box>

            <Stack spacing={2}>
                {formData[field].map((item, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 1 }}>
                        <TextField
                            sx={{ bgcolor: "white" }}
                            variant="outlined"
                            value={item}
                            onChange={(e) => handleArrayChange(field, idx, e.target.value)}
                            fullWidth
                            placeholder={placeholder}
                            // multiline={field === "amenities"}
                            rows={field === "amenities" ? 2 : 1}
                            inputProps={{ maxLength: field === "amenities" ? 30 : 30 }}
                            helperText={`${item.length}/${field === "amenities" ? 30 : 30} characters`}
                        />

                        {formData[field].length > 1 && (
                            <IconButton
                                onClick={() => handleRemoveItem(field, idx)}
                                color="grey"
                                size="small"
                            >
                                <Remove />
                            </IconButton>
                        )}
                        {idx === formData[field].length - 1 && (
                            <IconButton
                                onClick={() => handleAddItem(field)}
                                color="grey"
                                size="small"
                            >
                                <Add />
                            </IconButton>
                        )}
                    </Box>
                ))}
            </Stack>
        </Paper>
    );

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <>
                        <Grid container spacing={3} sx={{ p: 2 }}>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="fullName"
                                    label="Full Name"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountBox />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="lastName"
                                    label="Last Name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    fullWidth
                                    disabled
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    disabled
                                    name="addressLine1"
                                    label="Address Line 1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationOn />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    disabled
                                    name="addressLine2"
                                    label="Address Line 2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="country"
                                    label="Country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="city"
                                    label="City"
                                    value={formData.city}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="state"
                                    label="State"
                                    value={formData.state}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <TextField
                                    name="pincode"
                                    label="Pincode"
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                    disabled
                                />
                            </Grid>

                            <Grid item xs={12} md={12}>

                                <Typography
                                    variant="subtitle2"
                                    gutterBottom
                                    align="left"
                                    color="textSecondary"
                                    sx={{
                                        borderLeft: 4,
                                        borderColor: "purple",
                                        bgcolor: "#fcfaff",
                                        px: 2,
                                        py: 1,
                                        fontSize: "0.8rem",
                                        borderRadius: 1,
                                        fontStyle: "italic",
                                        userSelect: "none",
                                        width: "fit-content"
                                    }}
                                >
                                    Note: The above details are business holders current info (such as location, address and name as in id proof). *
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                );
            case 1:
                return (
                    <Box sx={{ p: { xs: 0, sm: 4 }, bgcolor: "background.paper", borderRadius: 2, boxShadow: 0 }}>

                        <Grid container>

                            <Typography variant="subtitle2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>Business Info</Typography>

                            {/* Business info (proof) */}
                            <Grid container spacing={3} sx={{ mb: 2, p: 2 }}>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="gstNumber"
                                        label="GST Number"
                                        value={formData.gstNumber}
                                        onChange={handleChange}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Shield />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="aadharNumber"
                                        label="Aadhar Number"
                                        value={formData.aadharNumber}
                                        onChange={handleAadharChange}
                                        fullWidth
                                        required
                                        inputProps={{ maxLength: 14 }}
                                    />
                                </Grid>

                                {/* doc upload */}
                                <Grid item xs={12} md={4} display='flex' justifyContent='center' alignItems='center'>
                                    <Button variant="outlined" component="label">
                                        Upload Adhaar
                                        <input type="file" required hidden onChange={handleFileChange} />
                                    </Button>
                                    {file && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            {file.name}
                                        </Typography>
                                    )}
                                </Grid>
                                {error && (
                                    <Grid item>
                                        <Alert severity="error">{error}</Alert>
                                    </Grid>
                                )}
                                {/* {previewUrl && (
                                    <Grid item>
                                        {file?.type.includes('image') ? (
                                            <img src={previewUrl} alt="Preview" style={{ width: '100%', maxHeight: 200, objectFit: 'contain' }} />
                                        ) : file?.type === 'application/pdf' ? (
                                            <iframe
                                                src={previewUrl}
                                                title="PDF Preview"
                                                width="100%"
                                                height="200"
                                                style={{ border: '1px solid #ccc' }}
                                            />
                                        ) : (
                                            <Typography variant="body2" color="textSecondary">No preview available</Typography>
                                        )}
                                    </Grid>
                                )} */}

                            </Grid>

                            <Typography component='div' variant="subtitle2" color="textSecondary" gutterBottom sx={{ mb: 2 }}>Business details</Typography>

                            {/* Business details */}
                            <Grid container spacing={3} sx={{ mb: 2, p: 2 }}>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        name="businessName"
                                        label="Business Name"
                                        value={formData.businessName}
                                        onChange={handleChange}
                                        fullWidth
                                        placeholder="Business Name"
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Business />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={8} >
                                    <Autocomplete
                                        multiple
                                        options={locations}
                                        getOptionLabel={(option) => option}
                                        value={formData.availableLocations} // Now it's an array
                                        onChange={handleLocationChange}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Available Locations" placeholder="Select locations..." fullWidth required />
                                        )}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        name="description"
                                        label="About Service"
                                        value={formData.description}
                                        onChange={handleChange}
                                        fullWidth
                                        multiline
                                        rows={5}
                                        required
                                        inputProps={{
                                            maxLength: 200, // enforce max characters
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Description />
                                                </InputAdornment>
                                            ),
                                        }}
                                        helperText={`${formData.description.length}/200 characters`}
                                    />
                                </Grid>


                                <Grid item xs={12}>
                                    {renderSection(
                                        "amenities",
                                        "Amenities of the Service",
                                        "Enter a short description",
                                        "Selling points that make the listing attractive at a glance."
                                    )}
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    {renderSection(
                                        "thingsToKnow",
                                        "Things to Know",
                                        "Enter an important note",
                                        "These notes will be shown to customers as helpful info before booking."
                                    )}
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    {renderSection(
                                        "offers",
                                        "What this Place Offers",
                                        "Enter an amenity",
                                        "This list appears in the amenities section of the service details."
                                    )}
                                </Grid>


                            </Grid>

                            {/* custom pricing */}
                            <Grid item xs={12} >

                                <Paper elevation={0} sx={{ px: 2, bgcolor: "#f8f8f8", width: "100%", py: 4 }}>

                                    <Stack direction={{ xs: "column", sm: "row", bgcolor: "#f8f8f8", }} justifyContent='space-between' alignItems={{ xs: 'end', md: 'center' }} spacing={2}>

                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                Add Custom Pricing
                                            </Typography>
                                            <Typography variant="body5" component='div' color="textSecondary" sx={{ maxWidth: 600 }} gutterBottom>
                                                This is the field where you can showcase your pricing and you can give the descriptions of the pricings in the below section
                                            </Typography>
                                        </Box>

                                        <Button
                                            startIcon={<Add />}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddCustomPricingField}
                                            sx={{ mb: 2 }}
                                        >
                                            Add
                                        </Button>
                                    </Stack>


                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        {customPricing.map((field, index) => (
                                            <React.Fragment key={index}>
                                                {/* Title */}
                                                <Grid item xs={12} sm={4}>
                                                    <TextField
                                                        sx={{ bgcolor: "white" }}
                                                        label={`Title ${index + 1}`}
                                                        value={field.title}
                                                        fullWidth
                                                        placeholder="Basic Plan"
                                                        onChange={(e) =>
                                                            handleCustomPricingChange(index, "title", e.target.value)
                                                        }
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>

                                                {/* Description */}
                                                <Grid item xs={12} sm={5}>
                                                    <TextField
                                                        sx={{ bgcolor: "white" }}
                                                        label={`Description ${index + 1}`}
                                                        value={field.description}
                                                        fullWidth
                                                        placeholder="Includes catering and decoration"
                                                        onChange={(e) =>
                                                            handleCustomPricingChange(index, "description", e.target.value)
                                                        }
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>

                                                {/* Price */}
                                                <Grid item xs={12} sm={2}>
                                                    <TextField
                                                        sx={{ bgcolor: "white" }}
                                                        label={`Price ${index + 1}`}
                                                        value={field.price}
                                                        fullWidth
                                                        placeholder="4000"
                                                        type="number"
                                                        onChange={(e) =>
                                                            handleCustomPricingChange(index, "price", e.target.value)
                                                        }
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>

                                                {/* Delete Button */}
                                                <Grid item xs={12} sm={1} sx={{ display: "flex", alignItems: "center" }}>
                                                    <IconButton
                                                        onClick={() => {
                                                            const updated = [...customPricing];
                                                            updated.splice(index, 1);
                                                            setCustomPricing(updated);
                                                        }}
                                                        color="grey"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>
                                            </React.Fragment>
                                        ))}
                                    </Grid>

                                </Paper>
                            </Grid>

                            <Grid item xs={12} sx={{ bgcolor: "#fff", py: 2 }} />

                            <Grid item xs={12}>
                                <Paper elevation={0} sx={{ px: 2, bgcolor: "#f8f8f8", width: "100%", py: 4 }}>
                                    <Stack
                                        direction={{ xs: "column", sm: "row" }}
                                        justifyContent="space-between"
                                        alignItems={{ xs: "end", md: "center" }}
                                        spacing={2}
                                    >
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                Add Custom Fields{" "}
                                                <Button variant="text" onClick={handleOpen}>
                                                    View Demo
                                                </Button>
                                            </Typography>
                                            <Typography variant="body5" color="textSecondary" gutterBottom>
                                                Add fields with custom values to boost your profile
                                            </Typography>
                                        </Box>

                                        <Button
                                            startIcon={<Add />}
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAddCustomField}
                                            sx={{ mb: 2 }}
                                        >
                                            Add
                                        </Button>
                                    </Stack>

                                    <Dialog open={showDemo} onClose={handleClose} fullWidth maxWidth="md">
                                        <DialogTitle fontWeight={500} sx={{ bgcolor: "#f8f8f8" }}>Demo</DialogTitle>
                                        <DialogContent dividers>
                                            <CustomFieldsDemo />
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={handleClose}>Close</Button>
                                        </DialogActions>
                                    </Dialog>

                                    {customFields.map((field, index) => (
                                        <Grid container spacing={2} sx={{ mt: 2, mb: 5 }}>

                                            <React.Fragment key={index}>
                                                <Grid item xs={12} sm={3}>
                                                    <TextField
                                                        sx={{ bgcolor: "white" }}
                                                        label="Heading"
                                                        value={field.name}
                                                        fullWidth
                                                        placeholder='Title '
                                                        onChange={(e) => handleCustomFieldChange(index, "name", e.target.value)}
                                                        helperText="Enter the title of the section"
                                                        InputLabelProps={{ shrink: true }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} sm={2}>
                                                    <FormControl fullWidth sx={{ bgcolor: "white" }}>
                                                        <InputLabel shrink>Type</InputLabel>
                                                        <Select
                                                            displayEmpty
                                                            value={field.type}
                                                            onChange={(e) => handleCustomFieldChange(index, "type", e.target.value)}
                                                            label="Field Type"
                                                        >
                                                            <MenuItem value="text">Text</MenuItem>
                                                            <MenuItem value="list">List</MenuItem>
                                                            <MenuItem value="mixed">Mixed</MenuItem>
                                                        </Select>
                                                        <FormHelperText>Showing as</FormHelperText>
                                                    </FormControl>
                                                </Grid>

                                                <Grid item xs={12} sm={5}>
                                                    {field.type === "text" && (
                                                        <TextField
                                                            sx={{ bgcolor: "white" }}
                                                            label="Description"
                                                            value={field.value}
                                                            fullWidth
                                                            placeholder='Describe this section'
                                                            multiline
                                                            onChange={(e) => handleCustomFieldChange(index, "value", e.target.value)}
                                                            helperText="Describe this section"
                                                            InputLabelProps={{ shrink: true }}
                                                        />
                                                    )}
                                                    {field.type === "list" && (
                                                        <Autocomplete
                                                            multiple
                                                            freeSolo
                                                            options={[]} // Optional suggestions can go here
                                                            value={
                                                                Array.isArray(field.value)
                                                                    ? field.value
                                                                    : typeof field.value === "string"
                                                                        ? field.value.split(",").filter(Boolean)
                                                                        : []
                                                            }
                                                            onChange={(event, newValue) => {
                                                                // Remove empty strings & trim spaces
                                                                const cleanValue = newValue
                                                                    .map((item) => item.trim())
                                                                    .filter((item) => item !== "");
                                                                handleCustomFieldChange(index, "value", cleanValue);
                                                            }}
                                                            renderTags={(value, getTagProps) =>
                                                                value.map((option, index) => (
                                                                    <Chip
                                                                        key={index}
                                                                        variant="outlined"
                                                                        label={option}
                                                                        {...getTagProps({ index })}
                                                                    />
                                                                ))
                                                            }
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    sx={{ bgcolor: "white" }}
                                                                    label="List Items"
                                                                    placeholder="Type and press Enter"
                                                                    helperText="Press Enter to add multiple items"
                                                                    InputLabelProps={{ shrink: true }}
                                                                />
                                                            )}
                                                        />
                                                    )}


                                                    {field.type === "mixed" && (
                                                        <Box>
                                                            <Typography variant="body2" sx={{ mb: 2 }}>
                                                                Mixed Input (Text + List)
                                                            </Typography>

                                                            {/* Short Note Input */}
                                                            <TextField
                                                                sx={{ bgcolor: "white", mb: 1 }}
                                                                label="Short Note"
                                                                value={field.value?.text || ""}
                                                                onChange={(e) =>
                                                                    handleCustomFieldChange(index, "value", {
                                                                        ...field.value,
                                                                        text: e.target.value,
                                                                    })
                                                                }
                                                                fullWidth
                                                                InputLabelProps={{ shrink: true }}
                                                            />

                                                            {/* List Input */}
                                                            <Autocomplete
                                                                multiple
                                                                freeSolo
                                                                options={[]}
                                                                value={
                                                                    Array.isArray(field.value?.list)
                                                                        ? field.value.list
                                                                        : typeof field.value?.list === "string"
                                                                            ? field.value.list.split(",").filter(Boolean)
                                                                            : []
                                                                }
                                                                onChange={(event, newValue) => {
                                                                    const cleanList = newValue
                                                                        .map((item) => item.trim())
                                                                        .filter((item) => item !== "");

                                                                    handleCustomFieldChange(index, "value", {
                                                                        ...field.value,
                                                                        list: cleanList,
                                                                    });
                                                                }}
                                                                renderTags={(value, getTagProps) =>
                                                                    value.map((option, index) => (
                                                                        <Chip
                                                                            key={index}
                                                                            variant="outlined"
                                                                            label={option}
                                                                            {...getTagProps({ index })}
                                                                        />
                                                                    ))
                                                                }
                                                                renderInput={(params) => (
                                                                    <TextField
                                                                        {...params}
                                                                        sx={{ bgcolor: "white" }}
                                                                        label="List Items"
                                                                        placeholder="Type and press Enter"
                                                                        helperText="Press Enter to add multiple items"
                                                                        InputLabelProps={{ shrink: true }}
                                                                    />
                                                                )}
                                                            />
                                                        </Box>
                                                    )}

                                                </Grid>


                                                <Grid item xs={12} sm={2} sx={{ display: "flex", alignItems: "center", justifyContent: "end" }}>
                                                    <IconButton
                                                        onClick={() => {
                                                            const updated = [...customFields];
                                                            updated.splice(index, 1);
                                                            setCustomFields(updated);
                                                        }}
                                                        color="grey"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Grid>


                                            </React.Fragment>
                                        </Grid>
                                    ))}
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sx={{ bgcolor: "#fff", py: 2 }} />

                            {/* why us generator */}
                            <Grid item xs={12} >
                                <Paper elevation={0} sx={{ p: 2, bgcolor: "#f8f8f8", width: "100%", }}>

                                    <Stack direction={{ xs: "column", sm: "column", bgcolor: "#f8f8f8", }} justifyContent='space-between' alignItems={{ xs: 'end', md: 'self-start' }} spacing={2}>

                                        <Box>
                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                                                Generate Why Us
                                            </Typography>
                                            <Typography variant="body5" color="textSecondary" gutterBottom>
                                                This generates the why choose your service based on the above details, you may also regenerate and edit.
                                            </Typography>
                                        </Box>

                                        {/* <Grid container spacing={2} sx={{ mt: 2 }}> */}
                                        {/* Generator Component */}
                                        <WhyChooseUsGenerator
                                            description={formData?.description || "We offer professional wedding services tailored to your special day."}
                                            customPricing={customPricing}
                                            customFields={customFields}
                                            onGenerate={handleGeneratedReasons}
                                        />
                                        {/* </Grid> */}
                                    </Stack>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} >
                                <ImageUploader onFormDataReady={handleImageUploadFormData} sendFoldersToParent={handleFolderReceive} imageFolders={imageFolders} setImageFolders={setImageFolders} />
                            </Grid>

                        </Grid>
                    </Box >

                );
            case 2:
                return (

                    < Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: '#f8f6ff',
                            minHeight: '100vh',
                            padding: { xs: 1, md: 2 },
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                width: '100%',
                                // maxWidth: 1200, // Restrict width for better readability
                                p: { xs: 1, md: 3 },
                                borderRadius: 4,
                                backgroundColor: '#fff',
                            }}
                        >

                            {/* Product Images Section */}
                            <Grid container spacing={3} >
                                <Grid item xs={12}>
                                    <Grid container spacing={2}> {/* This is needed! */}
                                        {/* Render CoverImage first */}
                                        {imageFolders
                                            .filter(folder => folder.folderName === "CoverImage" && folder.images.length > 0)
                                            .map(folder => (
                                                <Grid item xs={12} key={`cover-${folder.id}`}>
                                                    <Box sx={{ position: "relative" }}>
                                                        <img
                                                            src={folder.images[0].base64Preview}
                                                            alt="Cover"
                                                            style={{
                                                                width: "100%",
                                                                height: "350px",
                                                                objectFit: "cover",
                                                                borderRadius: "8px",
                                                            }}
                                                        />
                                                    </Box>
                                                </Grid>
                                            ))}

                                        {/* Render other folders */}
                                        {imageFolders
                                            .filter(folder => folder.folderName !== "CoverImage")
                                            .flatMap(folder =>
                                                folder.images.slice(0, 2).map((img, idx) => (
                                                    <Grid item xs={6} sm={4} md={3} key={`${folder.id}-${idx}`}>
                                                        <Box
                                                            sx={{
                                                                borderRadius: 2,
                                                                overflow: "hidden",
                                                                boxShadow: 1,
                                                                height: "100px",
                                                            }}
                                                        >
                                                            <img
                                                                src={img.base64Preview}
                                                                alt={`img-${idx}`}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100%",
                                                                    objectFit: "cover",
                                                                }}
                                                            />
                                                        </Box>
                                                    </Grid>
                                                ))
                                            )}

                                    </Grid>
                                </Grid>

                                {/* Right: Description */}
                                <Grid item xs={12} sm={8} mt={4} py={5}>
                                    <Typography variant="h6" mb={1}>
                                        About {formData?.businessName}
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        {formData?.description || 'Product Name'}
                                    </Typography>

                                    <HostCard
                                        vendorDetails={vendor}
                                        amenities={formData.amenities?.slice(0, 3) || []}
                                    />

                                    {/* highlights */}
                                    <Box mt={4}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="h6" gutterBottom sx={{ mb: 0 }}>
                                                Highlights
                                            </Typography>

                                            {customFields.length > 0 && (
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

                                        {customFields.length > 0 && (
                                            <>
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                                                    {customFields.slice(0, 3).map((field, index) => (
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

                                    {/* rating top */}
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", borderRadius: 4, mt: 4 }}>
                                        {/* rating */}

                                        <img src='https://img.freepik.com/premium-vector/5-gold-stars-rating-vector-illustration-isolated-transparent-background-high-quality-stars-with-shadows-web-app_532800-291.jpg' style={{ width: 100, height: 100, objectFit: "cover" }} />

                                        <Grid container justifyContent='space-evenly' sx={{ backgroundColor: "#f6f3ff", maxWidth: 400, borderRadius: 3, border: "1px solid #eeee", placeSelf: "center" }} >

                                            <Grid item xs={3} sx={{
                                                borderRadius: 0,
                                                m: 2,
                                                borderRight: '1px solid purple'
                                            }}>
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    flexDirection="column"
                                                >
                                                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 500 }}>
                                                        4.9
                                                    </Typography>
                                                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 500 }}>
                                                        Ratings
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                            <Grid item xs={3} sx={{
                                                borderRadius: 0,
                                                m: 2,
                                                pr: 4,
                                                borderRight: '1px solid purple'
                                            }}>

                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    justifyContent='center'
                                                    flexDirection="column"
                                                >
                                                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 500 }}>
                                                        Excellent
                                                    </Typography>
                                                    <Rating
                                                        name="rating-2"
                                                        value={4.5}
                                                        precision={0.1}
                                                        readOnly
                                                        icon={<Star sx={{ color: "gold", fontSize: "20px" }} />}
                                                        emptyIcon={<Star sx={{ color: "grey", fontSize: "20px" }} />}
                                                    />
                                                </Box>
                                            </Grid>

                                            <Grid item xs={3} >
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    flexDirection="column"
                                                    sx={{
                                                        borderRadius: 2,
                                                        padding: 2,
                                                    }}
                                                >
                                                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 500 }}>
                                                        4.9
                                                    </Typography>
                                                    <Typography variant="subtitle2" sx={{ color: "#333", fontWeight: 500 }}>
                                                        Reviews
                                                    </Typography>
                                                </Box>
                                            </Grid>

                                        </Grid>

                                    </Box>
                                </Grid>

                                {/* booking summary */}
                                <Grid item xs={12} sm={4} sx={{ mb: 2, p: 2 }}>
                                    <Box
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            backgroundColor: '#ffff',
                                            boxShadow: 2
                                        }}
                                    >
                                        {/* <Typography variant="h6" gutterBottom color="primary">
                                    Booking Summary
                                </Typography> */}
                                        <img src={imageFolders.find(folder => folder.folderName === "CoverImage")?.images[0]?.base64Preview || 'https://placehold.co/600'} style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: 4, }} />

                                        <Grid container spacing={2} mt={2}>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    dd/mm/yyy
                                                </Typography>

                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    dd/mm/yyy
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2" color="text.secondary">Days</Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    10
                                                </Typography>

                                            </Grid>
                                            <Grid item xs={6}>
                                                <Typography variant="subtitle2" color="text.secondary">Price</Typography>
                                                <Typography variant="body2" fontWeight={500}>
                                                    ₹ 3000</Typography>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <FormControl fullWidth size="small" sx={{ my: 1 }}>
                                                    <InputLabel id="location-label">Select Location</InputLabel>
                                                    <Select
                                                        labelId="location-label"
                                                        label="Select Location"
                                                        defaultValue={
                                                            formData.availableLocations?.[0] || ""
                                                        }

                                                    >
                                                        {formData.availableLocations?.map((loc, index) => (
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

                            </Grid>

                            {/* custom pricing */}
                            <Box sx={{ my: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                    Offerings
                                </Typography>
                                <Box
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr",
                                            sm: "1fr 1fr",
                                            md: "1fr 1fr 1fr",
                                        },
                                        gap: 3,
                                    }}
                                >
                                    {customPricing.map((option, index) => (
                                        <Card
                                            key={index}
                                            elevation={3}
                                            sx={{
                                                borderRadius: 4,
                                                border: "1px solid #ddd",
                                                bgcolor: "#ffff",
                                                transition: "all 0.3s ease",
                                                p: 2,
                                                boxShadow: 0,
                                                "&:hover": {
                                                    boxShadow: 0,
                                                    transform: "translateY(-3px)",
                                                },
                                            }}
                                        >
                                            <CardContent>
                                                <Typography
                                                    variant="h6"
                                                    sx={{ fontWeight: 600, mb: 1.5, color: "text.primary" }}
                                                >
                                                    {option.title}
                                                </Typography>

                                                <Divider sx={{ my: 1.5 }} />

                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                        mb: 1.5,
                                                    }}
                                                >
                                                    <Typography variant="body2" color="textSecondary">
                                                        {option.description}
                                                    </Typography>
                                                </Box>

                                                {option.price > 0 && (
                                                    <Stack direction="row" alignItems="baseline" spacing={0.5}>
                                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "primary.main" }}>
                                                            ₹{option.price.toLocaleString()}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            /- only
                                                        </Typography>
                                                    </Stack>
                                                )}


                                            </CardContent>
                                        </Card>
                                    ))}
                                </Box>
                            </Box>

                            {/* custom fields */}
                            <Box sx={{ my: 4 }}>
                                <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
                                    Highlights
                                </Typography>
                                {isMobile ? (

                                    <Box
                                        ref={detailsRef}
                                        sx={{
                                            display: "flex",
                                            overflowX: "auto",
                                            gap: 2,
                                            px: 1,
                                            py: 2,
                                            scrollSnapType: "x mandatory",
                                            "&::-webkit-scrollbar": { display: "none" },
                                            scrollbarWidth: "none",
                                        }}
                                    >
                                        {customFields.map((field, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    flex: "0 0 80%", // Take 80% of container width
                                                    minWidth: 300,  // Ensure cards aren't too small
                                                    scrollSnapAlign: "start",
                                                    position: "relative",
                                                }}
                                            >
                                                {/* ⭐ Top-right badge */}
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        top: 0,
                                                        right: 0,
                                                        background: "linear-gradient(135deg, #ff9800, #f44336)",
                                                        color: "white",
                                                        px: 1.2,
                                                        py: 0.6,
                                                        fontSize: 10,
                                                        fontWeight: "bold",
                                                        borderBottomLeftRadius: 6,
                                                        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                                        letterSpacing: 1,
                                                        textTransform: "uppercase",
                                                    }}
                                                >
                                                    ★ Featured
                                                </Box>

                                                <Paper
                                                    elevation={0}
                                                    sx={{
                                                        p: 3,
                                                        borderRadius: 3,
                                                        backgroundColor: "#fff",
                                                        border: "1px solid #e0e0e0",
                                                        width: "100%",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "space-between",
                                                        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: "text.primary",
                                                            mb: 0.5,
                                                            whiteSpace: "nowrap",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }}
                                                    >
                                                        {field?.name || `Custom Field ${index + 1}`}
                                                    </Typography>

                                                    <Box sx={{ flexGrow: 1 }}>
                                                        {field.type === "list" ? (
                                                            Array.isArray(field.value) ? (
                                                                <List dense disablePadding>
                                                                    {field.value
                                                                        .map((item) => item.trim())
                                                                        .filter((item) => item !== "")
                                                                        .map((point, idx) => (
                                                                            <ListItem key={idx} disableGutters sx={{ alignItems: "flex-start", pl: 0 }}>
                                                                                <ListItemIcon sx={{ minWidth: 30, mt: "4px" }}>
                                                                                    <Done sx={{ fontSize: 18, color: "primary.main" }} />
                                                                                </ListItemIcon>
                                                                                <ListItemText
                                                                                    primary={point}
                                                                                    primaryTypographyProps={{
                                                                                        fontSize: "0.9rem",
                                                                                        color: "text.secondary",
                                                                                    }}
                                                                                />
                                                                            </ListItem>
                                                                        ))}
                                                                </List>
                                                            ) : (
                                                                <Typography variant="body2" sx={{ fontSize: "0.95rem", color: "text.secondary", whiteSpace: "pre-line" }}>
                                                                    {field.value || "N/A"}
                                                                </Typography>
                                                            )
                                                        ) : field.type === "mixed" ? (
                                                            <>
                                                                {Array.isArray(field.value)
                                                                    ? field.value
                                                                        .map((item) => item.trim())
                                                                        .filter((item) => item !== "")
                                                                        .map((point, idx) => (
                                                                            <Chip key={idx} label={point} variant="outlined" sx={{ mr: 0.5, mb: 0.5 }} />
                                                                        ))
                                                                    : field.value}
                                                            </>
                                                        ) : (
                                                            <Typography variant="body2" sx={{ fontSize: "0.95rem", color: "text.secondary", whiteSpace: "pre-line" }}>
                                                                {field.value || "N/A"}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Paper>
                                            </Box>
                                        ))}
                                    </Box>

                                    // <Box sx={{ px: 1 }} ref={detailsRef}>
                                    //     {customFields.map((field, index) => (
                                    //         <Accordion
                                    //             defaultExpanded={index === 0}
                                    //             key={index}
                                    //             disableGutters
                                    //             sx={{
                                    //                 mb: 2,
                                    //                 backgroundColor: lightBackgrounds[index % lightBackgrounds.length],
                                    //                 borderRadius: 2,
                                    //                 boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                                    //                 '&:before': { display: 'none' },
                                    //             }}
                                    //         >
                                    //             <AccordionSummary
                                    //                 expandIcon={<ExpandMore />}
                                    //                 sx={{
                                    //                     padding: 2,
                                    //                     borderBottom: '1px solid rgba(0,0,0,0.05)',
                                    //                 }}
                                    //             >
                                    //                 <InfoOutlined
                                    //                     color="primary"
                                    //                     sx={{ fontSize: '1.2rem', mr: 1 }}
                                    //                 />
                                    //                 <Typography sx={{ fontWeight: 600, fontSize: '1rem' }}>
                                    //                     {field?.name || `Custom Field ${index + 1}`}
                                    //                 </Typography>
                                    //             </AccordionSummary>

                                    //             <AccordionDetails sx={{ px: 3, py: 2 }}>
                                    //                 {field?.value?.filter(v => v.trim()).length > 1 ? (
                                    //                     <List dense>
                                    //                         {field.value.map((point, idx) =>
                                    //                             point.trim() ? (
                                    //                                 <ListItem key={idx} disableGutters sx={{ mb: 1 }}>
                                    //                                     <ListItemIcon sx={{ minWidth: 30 }}>
                                    //                                         <CheckCircleOutline
                                    //                                             sx={{ fontSize: '1rem', color: 'primary.main' }}
                                    //                                         />
                                    //                                     </ListItemIcon>
                                    //                                     <ListItemText
                                    //                                         primary={point.trim()}
                                    //                                         primaryTypographyProps={{
                                    //                                             fontSize: '0.9rem',
                                    //                                             color: 'text.secondary',
                                    //                                             fontStyle: 'italic',
                                    //                                         }}
                                    //                                     />
                                    //                                 </ListItem>
                                    //                             ) : null
                                    //                         )}
                                    //                     </List>
                                    //                 ) : (
                                    //                     <Typography
                                    //                         variant="body2"
                                    //                         sx={{
                                    //                             color: 'text.secondary',
                                    //                             fontSize: '0.9rem',
                                    //                             fontStyle: 'italic',
                                    //                             pl: 1,
                                    //                         }}
                                    //                     >
                                    //                         {field?.value || 'N/A'}
                                    //                     </Typography>
                                    //                 )}
                                    //             </AccordionDetails>
                                    //         </Accordion>
                                    //     ))}
                                    // </Box>
                                ) : (
                                    // Desktop view remains grid layout (as before)
                                    <Grid container spacing={3} ref={detailsRef} sx={{ py: 6 }}>
                                        {customFields.map((field, index) => (
                                            <Grid item xs={12} sm={6} md={4} key={index} sx={{ display: "flex" }}>

                                                <Box sx={{ position: "relative", width: "100%" }}>
                                                    {/* ⭐ Top-left icon */}
                                                    <Box
                                                        sx={{
                                                            position: "absolute",
                                                            top: 0,
                                                            right: 0,
                                                            background: "linear-gradient(135deg, #ff9800, #f44336)", // 🔥 Gradient
                                                            color: "white",
                                                            px: 1.2,
                                                            py: 0.6,
                                                            fontSize: 10,
                                                            fontWeight: "bold",
                                                            borderBottomLeftRadius: 6,
                                                            boxShadow: "0 2px 6px rgba(0,0,0,0.2)", // subtle lift
                                                            letterSpacing: 1,
                                                            textTransform: "uppercase",
                                                        }}
                                                    >
                                                        ★ Featured
                                                    </Box>



                                                    <Paper
                                                        elevation={0}
                                                        sx={{
                                                            p: 3,
                                                            borderRadius: 3,
                                                            backgroundColor: "#ffff",
                                                            border: "1px solid #e0e0e0",
                                                            width: "100%",
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            justifyContent: "space-between",
                                                        }}
                                                    >
                                                        <Typography
                                                            variant="subtitle2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: "text.primary",
                                                                mb: 1,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {field?.name || `Custom Field ${index + 1}`}
                                                        </Typography>

                                                        <Box sx={{ flexGrow: 1 }}>
                                                            {field.type === "list" ? (
                                                                Array.isArray(field.value) ? (
                                                                    <List dense disablePadding>
                                                                        {field.value
                                                                            .map((item) => item.trim())
                                                                            .filter((item) => item !== "")
                                                                            .map((point, idx) => (
                                                                                <ListItem key={idx} disableGutters sx={{ alignItems: "flex-start", pl: 0 }}>
                                                                                    <ListItemIcon sx={{ minWidth: 30, mt: "4px" }}>
                                                                                        <Done sx={{ fontSize: 18, color: "primary.main" }} />
                                                                                    </ListItemIcon>
                                                                                    <ListItemText
                                                                                        primary={point}
                                                                                        primaryTypographyProps={{
                                                                                            fontSize: "0.9rem",
                                                                                            color: "text.secondary",
                                                                                        }}
                                                                                    />
                                                                                </ListItem>
                                                                            ))}
                                                                    </List>
                                                                ) : (
                                                                    <Typography
                                                                        variant="body2"
                                                                        sx={{
                                                                            fontSize: "0.95rem",
                                                                            color: "text.secondary",
                                                                            whiteSpace: "pre-line",
                                                                        }}
                                                                    >
                                                                        {field.value || "N/A"}
                                                                    </Typography>
                                                                )
                                                            ) : field.type === "mixed" ? (
                                                                <>
                                                                    {Array.isArray(field.value)
                                                                        ? field.value
                                                                            .map((item) => item.trim())
                                                                            .filter((item) => item !== "")
                                                                            .map((point, idx) => (
                                                                                <Chip
                                                                                    key={idx}
                                                                                    label={point}
                                                                                    variant="outlined"
                                                                                    sx={{ mr: 0.5, mb: 0.5 }}
                                                                                />
                                                                            ))
                                                                        : field.value}
                                                                </>
                                                            ) : (
                                                                // Text fallback
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontSize: "0.95rem",
                                                                        color: "text.secondary",
                                                                        whiteSpace: "pre-line",
                                                                    }}
                                                                >
                                                                    {field.value || "N/A"}
                                                                </Typography>
                                                            )}
                                                        </Box>

                                                    </Paper>
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Box>

                            <Divider sx={{ marginY: 3 }} />

                            {/* generated why us */}

                            <Typography
                                variant="h6"
                                align="center"
                                fontWeight={600}
                                gutterBottom
                                sx={{ mb: 2 }}
                            >
                                Why Choose{' '}
                                <Box component="span" sx={{ color: 'primary.main' }}>
                                    {formData.businessName}
                                </Box>
                            </Typography>


                            <Grid container spacing={3} >

                                {generatedWhyUs.map((reason, idx) => (
                                    <Grid item xs={12} sm={6} md={6} key={idx}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 3,
                                                display: 'flex',
                                                alignItems: 'flex-start',
                                                gap: 2,
                                                bgcolor: "#f8f8f8",
                                                borderRadius: 3,
                                                minHeight: 140,
                                                cursor: 'text',
                                            }}
                                        >
                                            <Box sx={{ mt: 0.5, }}>{icons[idx % icons.length]}</Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography
                                                    component="div"
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    variant="h6"
                                                    fontWeight={600}
                                                    gutterBottom
                                                    sx={{
                                                        mb: 1,
                                                        outline: 'none',
                                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.05)' },
                                                        cursor: 'text',
                                                    }}
                                                    onInput={(e) => {
                                                        generatedWhyUs[idx].title = e.currentTarget.textContent;
                                                    }}
                                                >
                                                    {reason.title}
                                                </Typography>

                                                <Typography
                                                    component="div"
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    variant="body2"
                                                    color="text.secondary"
                                                    sx={{
                                                        lineHeight: 1.5,
                                                        outline: 'none',
                                                        '&:hover': { backgroundColor: 'rgba(0,0,0,0.03)' },
                                                        cursor: 'text',
                                                    }}
                                                    onInput={(e) => {
                                                        generatedWhyUs[idx].description = e.currentTarget.textContent;
                                                    }}
                                                >
                                                    {reason.description}
                                                </Typography>
                                            </Box>

                                        </Paper>
                                    </Grid>
                                ))}

                            </Grid>

                        </Paper>
                    </Box >
                );
            default:
                return null;
        }
    };





    return (
        <Box>

            <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>
                            <Typography
                                sx={{
                                    typography: {
                                        xs: 'caption',
                                        md: 'body2',
                                    },
                                    textAlign: 'center',
                                }}
                            >
                                {label}
                            </Typography>
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>



            {
                loading ?
                    <Typography variant="body1" align="center" sx={{ p: 3 }}>Loading ...</Typography>
                    :
                    missingFields.length > 0 ? (
                        <Box
                            sx={{
                                minHeight: "100vh",
                                mt: 2,
                                p: 2,
                                borderRadius: 2,
                                textAlign: "center",
                            }}
                        >
                            {/* Big Icon */}
                            <PendingActions
                                sx={{ color: "#dddd", fontSize: 200, mb: 1 }}
                            />

                            {/* Text below icon */}
                            <Typography
                                variant="body2"
                                sx={{ fontWeight: 500, color: "grey" }}
                            >
                                Complete your profile to register a service <NavLink to='/vendor-dashboard/settings'> (Profile)</NavLink>.
                            </Typography>
                        </Box>

                    )
                        :
                        <Grid sx={{ mt: 5 }}>
                            <Grid item sx={{ display: activeStep === 0 ? 'flex' : "none" }} xs={12} mb={4} display='flex' alignItems='end' justifyContent='end'>
                                <Button
                                    size="small"
                                    sx={{ textAlign: "end", mr: 2 }}
                                    variant="outlined"
                                    onClick={() => navigate('/vendor-dashboard/settings')}
                                >
                                    Edit
                                </Button>
                            </Grid>

                            <form >
                                {renderStepContent(activeStep)}
                                <Box display="flex" justifyContent={activeStep === 0 ? "end" : "space-between"} mt={3} sx={{ p: 2 }}>
                                    {activeStep > 0 && (
                                        <Button startIcon={<NavigateBefore />} size="medium" variant="outlined" onClick={handleBack}>
                                            Back
                                        </Button>
                                    )}
                                    {activeStep === 0 ? (
                                        <Button endIcon={<NavigateNext />} size="medium" variant="contained" color="primary" onClick={handleNext}>
                                            Next
                                        </Button>
                                    ) : activeStep === 1 ? (
                                        <Button size="medium" variant="contained" color="primary" onClick={handleNext}>
                                            Preview
                                        </Button>
                                    ) : (
                                        <Button size="medium" variant="contained" color="primary" onClick={handleSubmit}>
                                            Submit
                                        </Button>
                                    )}

                                </Box>
                            </form>
                        </Grid>
            }

            <ReusableSnackbar
                open={snackbar.open}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </Box >
    );
};

export default withLoadingAndError(DynamicForm);
