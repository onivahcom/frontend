import React, { useEffect, useState } from "react";
import {
    Card, CardContent, Typography, Grid, CircularProgress, Box,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Paper, Chip, FormControl, InputLabel, Select, MenuItem, Stack
} from "@mui/material";
import axios from "axios";
import adminAxios from "../Api/Api";

const DeleteService = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const response = await adminAxios.get(`/approved-services`);
            const uniqueCategories = [...new Set(response.data.map(service => service.category))];
            setCategories(uniqueCategories);
            setServices(response.data);
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (service) => {
        setSelectedService(service);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedService(null);
    };

    console.log(selectedService);

    const handleDeleteService = async () => {
        if (!selectedService) return;

        try {
            const category = selectedService.category; // Keep category as it is
            const id = selectedService._id.toString();

            const response = await adminAxios.delete(`/delete-service/${id}`);

            if (response.status === 200) {
                setServices(services.filter(service => service._id !== id));
                handleCloseDialog();
            } else {
                console.error("Failed to delete service:", response.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const filteredServices = selectedCategory
        ? services.filter(service => service.category === selectedCategory)
        : services;


    if (loading) {
        return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ padding: 3 }}>

            <Stack direction={{ xs: 'column', md: 'row' }} justifyContent='space-between' alignItems='center' spacing={2} mb={4}>
                <Typography variant="h5" gutterBottom>
                    Delete Services
                </Typography>
                <FormControl size="small" sx={{ width: { xs: '100%', md: '50%' } }}>
                    <Select
                        displayEmpty
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <MenuItem value="" disabled>Filter by Categories</MenuItem>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Stack>

            <Grid container spacing={3}>
                {filteredServices.length === 0 ? (
                    <Typography align="center" p={3}>No services available.</Typography>
                ) : (
                    filteredServices.map((service) => (
                        <Grid item key={service._id} xs={12} sm={6} md={4}>
                            <Card sx={{
                                minHeight: 200,
                                cursor: "pointer",
                                borderRadius: 3,
                                boxShadow: 1,
                                transition: "0.3s",
                                "&:hover": { boxShadow: 6, transform: "translateY(-5px)" },
                            }} onClick={() => handleOpenDialog(service)}>
                                <CardContent sx={{ textAlign: "center" }}>
                                    {/* Service Image */}
                                    {service.additionalFields.images?.length > 0 && (
                                        <Box sx={{ mt: 1, borderRadius: 2, overflow: "hidden", display: "flex", justifyContent: "center" }}>
                                            <img
                                                src={`data:image/jpeg;base64,${service.additionalFields.images[0].base64}`}
                                                alt="Service"
                                                style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                                            />
                                        </Box>
                                    )}
                                    <Chip color="primary" variant="filled" label={service.category} sx={{ mt: 1, fontWeight: "bold", color: "white" }} />
                                    <Typography variant="body1" sx={{ fontWeight: "medium", mt: 1 }}>
                                        {service.additionalFields.businessName}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                {selectedService && (
                    <>
                        <DialogTitle sx={{ background: "#b71c1c", color: "white", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px" }}>
                            Confirm Delete
                        </DialogTitle>

                        <DialogContent sx={{ padding: 3, mt: 3 }}>
                            <Paper sx={{ padding: 2, mb: 2, boxShadow: 3, borderRadius: 2 }}>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>Are you sure you want to delete this service?</Typography>
                                <Typography><strong>Name:</strong> {selectedService.fullName}</Typography>
                                <Typography><strong>Email:</strong> {selectedService.email}</Typography>
                                <Typography><strong>Category:</strong> {selectedService.category}</Typography>
                            </Paper>
                        </DialogContent>

                        <DialogActions sx={{ padding: 2 }}>
                            <Button onClick={handleCloseDialog} variant="contained" color="primary">Cancel</Button>
                            <Button onClick={handleDeleteService} variant="contained" color="error">Delete</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
};

export default DeleteService;
