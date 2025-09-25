import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';
import { useLocation, useOutletContext } from 'react-router-dom';
import {
    Box, Radio, RadioGroup, FormControlLabel, Typography, Paper, Card, Stack, Grid
} from '@mui/material';
import ImageManager from '../vendorUtils/ImageManager';
import { Dialog, AppBar, Toolbar, IconButton, Slide } from "@mui/material";
import { Close } from "@mui/icons-material";


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ManageGallery = () => {
    const { vendor } = useOutletContext();
    const location = useLocation();
    const serviceIdFromState = location.state?.serviceId;

    const [services, setServices] = useState([]);
    const [selectedServiceId, setSelectedServiceId] = useState('');
    const [selectedService, setSelectedService] = useState(null);

    const [imageFolders, setImageFolders] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const formDataRef = useRef(null);

    const [openDialog, setOpenDialog] = React.useState(false);

    const handleServiceSelect = (service) => {
        handleRadioChange({ target: { value: service._id } });
        setSelectedService(service);
        setOpenDialog(true); // open fullscreen dialog
    };

    useEffect(() => {
        if (!openDialog) return;

        // Push a new history state so that back button can be intercepted
        window.history.pushState({ dialogOpen: true }, "");

        const handlePopState = (e) => {
            if (openDialog) {
                setOpenDialog(false); // close dialog
                window.history.pushState(null, ""); // restore state
            }
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            if (openDialog) window.history.back(); // clean up
        };
    }, [openDialog, setOpenDialog]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await backendApi.get(`/vendor/fetch/${vendor.email}/images`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setServices(res.data.services);
                    setSelectedService(null);

                    if (serviceIdFromState) {
                        const service = res.data.services.find(s => s._id === serviceIdFromState);
                        if (service) {
                            setSelectedServiceId(serviceIdFromState);
                            setSelectedService(service);
                            setOpenDialog(true)
                        }
                    }
                }
            } catch (error) {
                console.log('Failed to fetch gallery images', error);
            }
        };

        if (vendor?.vendorId) fetchImages();
    }, [vendor]);


    useEffect(() => {
        const savedFolders = localStorage.getItem("vendorImageFolders");
        if (savedFolders) {
            setImageFolders(JSON.parse(savedFolders));
        }
    }, []);

    const handleRadioChange = (e) => {
        const selectedId = e.target.value;
        setSelectedServiceId(selectedId);
        const service = services.find(s => s._id === selectedId);
        setSelectedService(service);
        setImageFolders([]);
        setDeletedImages([]);
        formDataRef.current = null;
        localStorage.removeItem("vendorImageFolders");
    };

    return (
        // <Box maxWidth='lg' mx='auto'>
        //     <Paper elevation={0} sx={{ p: 2, mt: 3, textAlign: "center", mb: 2 }}>
        //         <Typography variant="h5" fontWeight="bold">Manage Gallery</Typography>
        //         <Typography variant="body1" color="text.secondary">
        //             Select a service to manage gallery.
        //         </Typography>
        //     </Paper>
        //     <RadioGroup value={selectedServiceId} onChange={handleRadioChange} sx={{ p: 2 }}>
        //         {services.map((service) => {
        //             if (typeof service.category !== "string") return null; // Handle unexpected data

        //             const formattedCategory = service.category
        //                 .replace(/_/g, " ") // Replace underscores with spaces
        //                 .replace(/\b\w/g, (char) => char.toUpperCase()); // Convert to Pascal Case


        //             return (
        //                 <FormControlLabel
        //                     key={service._id}
        //                     value={service._id}
        //                     control={<Radio />}
        //                     label={`${formattedCategory} (${service.additionalFields.businessName || "N/A"})`}
        //                 />
        //             )
        //         })}
        //     </RadioGroup>

        //     {selectedService && (

        //         <ImageManager initialImagesFromDB={selectedService.images} vendor={vendor} category={selectedService.category} categoryId={selectedServiceId} serviceId={selectedService._id} />

        //     )}

        // </Box>

        <Box sx={{ maxWidth: 1000, mx: "auto", mt: 3, p: { xs: 1, md: 2 } }}>
            <Paper elevation={0} sx={{ p: 2, mt: 3, textAlign: "left", mb: 2 }}>
                <Typography variant="h5" fontWeight="bold">Manage Gallery</Typography>
                <Typography variant="body1" color="text.secondary">
                    Select a service to manage gallery.
                </Typography>
            </Paper>

            <Grid container spacing={2} p={{ xs: 1, md: 4 }}>
                {services.map((service, idx) => {
                    if (typeof service.category !== "string") return null;

                    const formattedCategory = service.category
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (char) => char.toUpperCase());

                    return (
                        <Grid item xs={12} sm={6} md={4} key={service._id}>
                            <Card
                                variant="outlined"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    cursor: "pointer",
                                    border: selectedServiceId === service._id ? "2px solid #7b55aa" : "1px solid #e0e0e0",
                                    borderRadius: 2,
                                    p: 1,
                                    transition: "0.25s",
                                    "&:hover": { bgcolor: "#f8f8f8" },
                                }}
                                onClick={() => handleServiceSelect(service)}
                            >

                                {service.images?.CoverImage ? (
                                    <Box
                                        component="img"
                                        src={service.images.CoverImage[0]}
                                        alt={formattedCategory}
                                        sx={{ width: 60, height: 60, borderRadius: 1, objectFit: "cover", mr: 2 }}
                                    />
                                ) : (
                                    <Box sx={{ width: 60, height: 60, borderRadius: 1, bgcolor: "grey.300", mr: 2 }} />
                                )}

                                <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1, justifyContent: "space-between" }}>

                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {service.additionalFields?.businessName || "N/A"}
                                    </Typography>
                                    <Radio
                                        size="small"
                                        checked={selectedServiceId === service._id}
                                        value={service._id}
                                        sx={{ ml: "auto" }}
                                    />
                                </Stack>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Fullscreen Dialog for ImageManager */}
            <Dialog
                fullScreen
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                TransitionComponent={Transition}
            >

                <AppBar elevation={0} sx={{ position: "relative", bgcolor: "#f8f8f8" }}>
                    <Toolbar sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                        <Typography
                            sx={{
                                // ml: 2,
                                flex: 1,
                                color: "#333", // dark gray instead of pure black for softer look
                                fontWeight: 600, // slightly bolder
                                letterSpacing: 0.5,
                                fontSize: { xs: 18, sm: 20, md: 22 }, // responsive size
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                            variant="h6"
                            component="div"
                        >
                            Gallery: <Typography variant="h6" component="span" sx={{ color: "#7b55aa" }}>{selectedService?.additionalFields?.businessName || "Service"}</Typography>
                        </Typography>


                        <IconButton edge="start" color="default" onClick={() => setOpenDialog(false)} aria-label="close">
                            <Close />
                        </IconButton>
                    </Toolbar>
                </AppBar>

                {selectedService && (
                    <ImageManager
                        initialImagesFromDB={selectedService.images}
                        vendor={vendor}
                        category={selectedService.category}
                        categoryId={selectedServiceId}
                        serviceId={selectedService._id}
                    />
                )}
            </Dialog>
        </Box>

    );
};

export default ManageGallery;
