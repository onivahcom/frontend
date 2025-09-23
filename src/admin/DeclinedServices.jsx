import React, { useEffect, useState } from "react";
import {
    Card, CardContent, Typography, Grid, CircularProgress, Box,
    FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Avatar
} from "@mui/material";
import axios from "axios";
import adminAxios from "../Api/Api";
import Close from "@mui/icons-material/Close";
import { Link } from "react-router-dom";
import { formatCategory } from "../components/RemoveUnderscore";

const DeclinedServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const fetchDeclinedServices = async () => {
            try {
                const response = await adminAxios.get(`/declined-services`);
                console.log(response.data);
                setServices(response.data);
            } catch (error) {
                console.error("Error fetching declined services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDeclinedServices();
    }, []);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleOpenDialog = (service) => {
        setSelectedService(service);
        setOpen(true);
    };

    const handleCloseDialog = () => {
        setOpen(false);
        setSelectedService(null);
    };

    const categories = ["All", ...new Set(services.map(service => service.category))];
    const filteredServices = selectedCategory === "All"
        ? services
        : services.filter(service => service.category === selectedCategory);

    if (loading) {
        return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ padding: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="body2" fontWeight={500} gutterBottom>
                    Declined Services
                </Typography>

                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Filter by Category</InputLabel>
                    <Select label="Filter by Category" value={selectedCategory} onChange={handleCategoryChange}>
                        {categories.map((category) => (
                            <MenuItem key={category} value={category}>{formatCategory(category)}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <Grid container spacing={3}>
                {filteredServices.length === 0 ? (
                    <Typography>No declined services available.</Typography>
                ) : (
                    filteredServices.map((service) => (
                        <Grid item key={service._id} xs={6} sm={6} md={3}>
                            <Card
                                sx={{
                                    minHeight: 250,
                                    cursor: "pointer",
                                    borderRadius: 3,
                                    boxShadow: 0,
                                    position: "relative"
                                }}
                                onClick={() => handleOpenDialog(service)}>
                                <CardContent sx={{ textAlign: "center" }}>
                                    {/* Service Image */}
                                    {service.images.CoverImage && (
                                        <Box
                                            sx={{
                                                mt: 1,
                                                borderRadius: 2,
                                                overflow: "hidden",
                                                display: "flex",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <img
                                                src={service.images?.CoverImage?.[0]}
                                                alt={service.additionalFields.businessName}
                                                style={{
                                                    width: "100%",
                                                    height: "180px",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </Box>
                                    )}
                                    <Chip color="error" variant="filled" label={formatCategory(service.category)} sx={{ mt: 1, color: "white", position: "absolute", top: 0, right: 0 }} />
                                    {/* Full Name */}
                                    <Typography variant="body1" sx={{ fontWeight: "medium", mt: 1 }}>
                                        {service.additionalFields.businessName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ fontWeight: "bold", color: "error.main" }}>
                                        Declined due to:
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="textSecondary"
                                        sx={{
                                            mt: 0.5,
                                            fontStyle: "italic",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            display: "block",
                                            maxWidth: "100%", // Ensure it applies correctly
                                        }}
                                    >
                                        {service.declineReason}
                                    </Typography>



                                </CardContent>
                            </Card>
                        </Grid>
                    ))
                )}
            </Grid>

            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
                {selectedService && (
                    <>
                        <DialogTitle
                            sx={{
                                bgcolor: "#f5f5f5",
                                color: "#333",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                fontWeight: 600,
                                fontSize: "1.2rem",
                                px: 3,
                                py: 1.5,
                                borderBottom: "1px solid #ddd",
                            }}
                        >
                            {selectedService.category} - Service Details
                            <IconButton onClick={handleCloseDialog} sx={{ color: "#666" }}>
                                <Close />
                            </IconButton>
                        </DialogTitle>

                        <DialogContent sx={{ px: 4, py: 3, bgcolor: "#fafafa" }}>
                            <Grid container spacing={3}>
                                {/* Service Information */}
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                            bgcolor: "#fff",
                                            height: "100%",
                                        }}
                                    >
                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 500, mb: 2, color: "#444" }}>
                                            Service Info
                                        </Typography>
                                        <Typography sx={{ mb: 1, color: "#555" }}>
                                            <strong>Name:</strong> {selectedService.fullName}
                                        </Typography>
                                        <Typography sx={{ mb: 1, color: "#555" }}>
                                            <strong>Email:</strong> {selectedService.email}
                                        </Typography>
                                        <Typography sx={{ mb: 1, color: "#555" }}>
                                            <strong>Category:</strong> {formatCategory(selectedService.category)}
                                        </Typography>
                                        <Typography sx={{ color: "#555", fontWeight: 500 }}>
                                            <strong style={{ color: "#b00020", }}>Decline Reason:</strong> {selectedService.declineReason}
                                        </Typography>
                                    </Paper>
                                </Grid>

                                {/* Owner Information */}
                                <Grid item xs={12} md={6}>
                                    <Paper
                                        sx={{
                                            p: 3,
                                            borderRadius: 2,
                                            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                                            bgcolor: "#fff",
                                            height: "100%",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography variant="body2" gutterBottom sx={{ fontWeight: 500, mb: 3, color: "#444" }}>
                                            Owner Info
                                        </Typography>

                                        <Avatar
                                            src={selectedService.vendorId?.profilePic || ""}
                                            alt={selectedService.vendorId?.firstName || "Owner"}
                                            sx={{ width: 80, height: 80, bgcolor: "#ccc", mb: 2 }}
                                        />
                                        <Typography sx={{ fontWeight: 600, color: "#555", mb: 1 }}>
                                            {selectedService.vendorId?.firstName || "N/A"}
                                        </Typography>
                                        <Link to={`/admin-dashboard/vendors/${selectedService.vendorId._id}`} sx={{ fontSize: "0.9rem", color: "#1976d2" }}>
                                            View Owner Details
                                        </Link>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </DialogContent>


                        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#fafafa" }}>
                            <Button
                                onClick={handleCloseDialog}
                                variant="outlined"
                                color="inherit"
                                size="medium"
                                sx={{ borderColor: "#ccc", color: "#444" }}
                            >
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>


        </Box>
    );
};

export default DeclinedServices;