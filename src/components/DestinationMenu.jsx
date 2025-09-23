import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Box,
    TextField,
    IconButton,
    Typography,
    Button,
    Paper,
    useMediaQuery,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CloseIcon from "@mui/icons-material/Close";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Autocomplete from "@mui/material/Autocomplete";
import { State, City } from "country-state-city";
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { ArrowDropDown } from "@mui/icons-material";
import theme from "../Themes/theme";

const DestinationMenu = ({ onLocationSelect, defaultLocation }) => {

    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


    const [open, setOpen] = useState(false);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [coords, setCoords] = useState();
    const [showPopup, setShowPopup] = useState(false);

    // Load Tamil Nadu cities
    useEffect(() => {

        const tn = State.getStatesOfCountry("IN").find((s) => s.name === "Tamil Nadu");
        if (tn) {
            const districts = City.getCitiesOfState("IN", tn.isoCode);
            setMenuItems(districts.map((d) => d.name));
        }
        if (!coords) {
            setCoords([11.1271, 78.6569]);
        }
    }, []);

    useEffect(() => {
        if (defaultLocation) {
            setSelectedLocation(defaultLocation);
        }
    }, [defaultLocation]);

    useEffect(() => {
        if (selectedLocation) {
            fetchCoordinates(selectedLocation);
        }
    }, [selectedLocation]);




    // Geocode city → lat/lng
    const fetchCoordinates = async (city) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(
                    city
                )}&state=Tamil%20Nadu&country=India&format=json&accept-language=en`
            );
            const data = await res.json();
            console.log(data);
            if (data.length > 0) {
                setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                setShowPopup(true);
            }
        } catch (err) {
            console.error("Error fetching coordinates:", err);
        }
    };

    const handleSelect = (event, newValue) => {
        if (!newValue) return;
        setSelectedLocation(newValue);
        onLocationSelect?.(newValue);       // Update parent state
        fetchCoordinates(newValue);
    };

    const handleMyLocation = () => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(async (pos) => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            setCoords([lat, lon]);
            setShowPopup(true);

            const city = await reverseGeocode(lat, lon);
            setSelectedLocation(city);
        });
    };

    const reverseGeocode = async (lat, lon) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`
            );
            const data = await res.json();
            const address = data.address || {};
            return (
                address.city ||
                address.town ||
                address.village ||
                address.hamlet ||
                address.municipality ||
                address.county ||
                address.state ||
                data.display_name ||
                "Unknown Location"
            );
        } catch (err) {
            console.error("Reverse geocoding failed:", err);
            return "Unknown Location";
        }
    };

    // Map click handler
    const handleMapClick = async (event) => {

        const latLng = event.latLng; // extract from event

        if (!latLng || latLng.length !== 2) return;

        const [lat, lng] = latLng;
        setCoords([lat, lng]);
        setShowPopup(true);


        const city = await reverseGeocode(lat, lng);
        setSelectedLocation(city);
        onLocationSelect?.(city);       // Update parent state

    };

    return (
        <>
            <Box
                onClick={() => setOpen(true)}
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    minWidth: 220,                // minimum size
                    width: { xs: "100%", sm: '100%' }, // full width on mobile, auto on larger
                    px: 2.5,
                    py: 1.5,
                    borderRadius: 2,
                    bgcolor: "white",
                    cursor: "pointer",
                    border: "1.5px solid #eeee",
                    transition: "all 0.3s ease",
                    "&:hover": {
                        bgcolor: "#f5f5f5",
                        borderColor: "grey",
                    },
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <LocationOnIcon sx={{ color: "#555", fontSize: 14 }} />
                    <Typography variant="body2" sx={{ color: "#333" }}>
                        {selectedLocation || "Select Location"}
                    </Typography>
                </Box>
                <ArrowDropDown sx={{ color: "#555", fontSize: 14 }} />
            </Box>




            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                fullScreen={isMobile}
                maxWidth="md"
                PaperProps={{ sx: { borderRadius: 4, overflow: "hidden", backgroundColor: "#fafafa" } }}
            >
                <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2, borderBottom: "1px solid #eee" }}>
                    <Typography variant="h6" fontWeight="bold">
                        Choose your destination
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block", textAlign: "center" }}>
                            Some locations may not show instantly, but your selection will be saved correctly
                        </Typography>
                    </Typography>
                    <IconButton onClick={() => setOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ p: 0, position: "relative" }}>
                    {/* Autocomplete */}
                    <Paper elevation={0} sx={{ position: "absolute", top: 16, left: "50%", transform: "translateX(-50%)", width: "80%", p: 0, borderRadius: 3, zIndex: 1000, backgroundColor: "#fff" }}>
                        <Autocomplete
                            size="small"
                            options={menuItems}
                            value={selectedLocation || null}
                            onChange={handleSelect}
                            renderOption={(props, option) => <Box component="li" {...props}>{option}</Box>}
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    {...params}
                                    // label="Search city"
                                    placeholder="Search city"
                                    variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: <LocationOnIcon color="action" sx={{ mr: 1 }} />,
                                        sx: { border: "none", borderRadius: 2, backgroundColor: "#fff", "& .MuiOutlinedInput-notchedOutline": { border: "none" } },
                                    }}
                                />
                            )}
                        />
                    </Paper>

                    {/* Map */}
                    <Box sx={{ height: 500, width: "100%", borderRadius: 0, overflow: "hidden" }}>
                        <Map center={coords} zoom={12} height={500} onClick={handleMapClick}>
                            <ZoomControl />
                            <Marker anchor={coords} payload={1} onClick={() => setShowPopup(!showPopup)} />
                        </Map>
                    </Box>

                    {/* Popup */}
                    {showPopup && coords?.length === 2 && (
                        <Paper sx={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", p: 2, borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.25)", backgroundColor: "white", minWidth: 250, textAlign: "center" }}>
                            <Typography variant="subtitle1" fontWeight="bold">📍 {selectedLocation}</Typography>
                            <Typography variant="body2" color="text.secondary">Lat: {coords[0]?.toFixed(4)}, Lng: {coords[1]?.toFixed(4)}</Typography>
                        </Paper>
                    )}

                    {/* My Location Button */}
                    <Box sx={{ position: "absolute", bottom: 20, right: 20, zIndex: 1000 }}>
                        <Button variant="contained" color="primary" startIcon={<MyLocationIcon />} onClick={handleMyLocation} sx={{ borderRadius: "50px", px: 2, py: 1, fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                            My Location
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}
export default DestinationMenu;



