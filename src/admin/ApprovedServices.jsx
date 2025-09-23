import React, { useEffect, useState } from "react";
import {
    Card, CardContent, Typography, Grid, CircularProgress, Box,
    FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle,
    DialogContent, DialogActions, Button, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, Tooltip, Stack, TextField
} from "@mui/material";
import axios from "axios";
import adminAxios from "../Api/Api";
import { Person } from "@mui/icons-material";
import Email from "@mui/icons-material/Email";
import Category from "@mui/icons-material/Category";
import { formatCategory } from "../components/RemoveUnderscore";

const ApprovedServices = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [open, setOpen] = useState(false);
    const [selectedService, setSelectedService] = useState(null);

    const [searchText, setSearchText] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [sortBy, setSortBy] = useState(""); // "date" or "category"


    useEffect(() => {
        const fetchApprovedServices = async () => {
            try {
                const response = await adminAxios.get(`/approved-services`);
                setServices(response.data);
            } catch (error) {
                console.error("Error fetching approved services:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApprovedServices();
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

    const filteredServices = services
        .filter((service) => {
            const searchLower = searchText.toLowerCase();
            return (
                service.fullName.toLowerCase().includes(searchLower) ||
                service.email.toLowerCase().includes(searchLower) ||
                service.additionalFields.businessName.toLowerCase().includes(searchLower)

            );
        })
        .filter((service) => {
            return filterCategory ? service.category === filterCategory : true;
        })
        .sort((a, b) => {
            if (sortBy === "date") return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === "category") return a.category.localeCompare(b.category);
            return 0;
        });


    if (loading) {
        return <Box display="flex" justifyContent="center" mt={5}><CircularProgress /></Box>;
    }

    return (
        <Box sx={{ padding: { xs: 1, md: 3 }, bgcolor: "#f8f8f8", }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="body1" fontWeight={500} gutterBottom>
                    Approved Services
                </Typography>

            </Box>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2,
                    mb: 2,
                    py: 3,
                    maxWidth: '100%',
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "#f8f8f8"
                }}
            >
                {/* Search Input */}
                <TextField
                    size="small"
                    label="Search by name/email"
                    value={searchText}
                    sx={{ width: '50%' }}
                    onChange={(e) => setSearchText(e.target.value)}
                />

                {/* Category Dropdown */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={filterCategory}
                        label="Category"
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {Array.from(new Set(services.map(s => s.category))).map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Sort Dropdown */}
                <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select
                        value={sortBy}
                        label="Sort By"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                        <MenuItem value="category">Category</MenuItem>
                    </Select>
                </FormControl>

                <Button size='small' sx={{ minWidth: 150 }} variant='text' onClick={() => {
                    setSortBy(null);
                    setFilterCategory(null);
                    setSearchText('');
                }}>
                    Clear Filters
                </Button>

            </Box>

            {/* Services List */}
            <Grid container spacing={3}>
                {filteredServices.length === 0 ? (
                    <Typography>No approved services available.</Typography>
                ) : (
                    filteredServices.map((service) => (
                        <Grid item key={service._id} xs={6} sm={6} md={3} >
                            <Card
                                sx={{
                                    position: "relative",
                                    // minHeight: 250,
                                    cursor: "pointer",
                                    borderRadius: 3,
                                    boxShadow: 0,
                                }}
                                onClick={() => handleOpenDialog(service)}
                            >
                                <CardContent sx={{ textAlign: "left" }}>
                                    {/* Service Image */}
                                    {service.images.CoverImage && (
                                        <Box
                                            sx={{
                                                mt: 1,
                                                borderRadius: 2,
                                                overflow: "hidden",
                                                display: "flex",
                                                justifyContent: "center",
                                                height: { xs: 120, md: 180 },
                                            }}
                                        >
                                            <img
                                                src={service.images?.CoverImage?.[0]}
                                                alt="Service"
                                                style={{
                                                    width: "100%",
                                                    objectFit: "cover",
                                                    borderRadius: "8px",
                                                }}
                                            />
                                        </Box>
                                    )}

                                    {/* Category Chip */}
                                    <Box sx={{ mt: 2, display: "flex", justifyContent: "center", position: "absolute", top: 0, right: 0 }}>
                                        <Chip
                                            variant="filled"
                                            label={formatCategory(service.category)}
                                            sx={{
                                                bgcolor: "#f8f8f8",
                                                textTransform: "capitalize",
                                            }}
                                        />
                                    </Box>

                                    {/* Full Name */}
                                    <Tooltip title={service.additionalFields.businessName || ""} sx={{ bgcolor: "black !important" }}>
                                        <Typography
                                            align="left"
                                            variant="body1"
                                            sx={{
                                                fontWeight: "medium",
                                                mt: 1,
                                                display: "-webkit-box",
                                                WebkitBoxOrient: "vertical",
                                                WebkitLineClamp: 1, // You can change this to 2, 3, 4 as needed
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                cursor: "default", // optional: prevents text selection cursor
                                            }}
                                        >
                                            {service.additionalFields.businessName}
                                        </Typography>
                                    </Tooltip>


                                    {/* owned by */}
                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 0.5 }}>
                                        Owned By:   {service.fullName}
                                    </Typography>

                                    {/* Email */}
                                    <Typography variant="body2" color="textSecondary" sx={{
                                        fontWeight: "medium",
                                        mt: 0.5,
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 1, // You can change this to 2, 3, 4 as needed
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        cursor: "default", // optional: prevents text selection cursor
                                    }}>
                                        {service.email}
                                    </Typography>
                                </CardContent>

                            </Card>

                        </Grid>
                    ))
                )}
            </Grid>

            {/* Service Details Dialog */}
            <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="md">
                {selectedService && (
                    <>
                        {/* Header Section with Background */}
                        <DialogTitle
                            sx={{
                                background: "#dddd",
                                color: "black",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "16px 24px"
                            }}
                        >
                            {selectedService.additionalFields.businessName} -  Details
                            <Button onClick={handleCloseDialog} >✖</Button>
                        </DialogTitle>

                        <DialogContent sx={{ padding: 3, mt: 3 }}>
                            {/* User Info Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 3,
                                    mb: 3,
                                    borderRadius: 3,
                                    background: "linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)",
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    gutterBottom
                                    sx={{
                                        fontWeight: "bold",
                                        mb: 2,
                                    }}
                                >
                                    Service Information
                                </Typography>

                                <Stack spacing={1.5}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Person fontSize="small" color="action" />
                                        <Typography> {selectedService.fullName}</Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Email fontSize="small" color="action" />
                                        <Typography> {selectedService.email}</Typography>
                                    </Box>

                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Category fontSize="small" color="action" />
                                        <Typography>{formatCategory(selectedService.category)}</Typography>
                                    </Box>
                                </Stack>
                            </Paper>


                            {/* Additional Details Section */}
                            {selectedService.additionalFields && (
                                <Paper sx={{ padding: 2, mb: 2, boxShadow: 0, borderRadius: 2 }}>
                                    <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
                                        Additional Details
                                    </Typography>

                                    <TableContainer component={Paper} elevation={0} sx={{ boxShadow: 0 }}>
                                        <Table>
                                            <TableHead>
                                                <TableRow sx={{ background: "#f5f5f5" }}>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Field</TableCell>
                                                    <TableCell sx={{ fontWeight: "bold" }}>Value</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {Object.entries(selectedService.additionalFields).map(([key, value]) => {
                                                    if (
                                                        key === "images" ||
                                                        key.toLowerCase().includes("grouped")
                                                    ) {
                                                        return null;
                                                    }

                                                    let displayValue;

                                                    // Custom pricing (array of { name, value })
                                                    if (key === "customPricing" && Array.isArray(value)) {
                                                        displayValue = (
                                                            <Box>
                                                                {value.map((item, index) => (
                                                                    <Typography key={index}>{item.name}: ₹{item.value}</Typography>
                                                                ))}
                                                            </Box>
                                                        );
                                                    }

                                                    // Custom fields (array of { name, value } or object)
                                                    else if (key === "customFields" && typeof value === "object" && value !== null) {
                                                        if (Array.isArray(value)) {
                                                            displayValue = (
                                                                <Box>
                                                                    {value.map((field, index) => (
                                                                        <Typography key={index}>{field.name}: {field.value}</Typography>
                                                                    ))}
                                                                </Box>
                                                            );
                                                        } else {
                                                            displayValue = (
                                                                <Box>
                                                                    {Object.entries(value).map(([k, v], index) => (
                                                                        <Typography key={index}>{k}: {v}</Typography>
                                                                    ))}
                                                                </Box>
                                                            );
                                                        }
                                                    }

                                                    // Simple array
                                                    else if (Array.isArray(value)) {
                                                        displayValue = value.join(", ");
                                                    }

                                                    // Object
                                                    else if (typeof value === "object" && value !== null) {
                                                        displayValue = JSON.stringify(value);
                                                    }

                                                    // Primitive (string, number, etc.)
                                                    else {
                                                        displayValue = value;
                                                    }

                                                    return (
                                                        <TableRow key={key}>
                                                            <TableCell sx={{ textTransform: "capitalize" }}>{key}</TableCell>
                                                            <TableCell>{displayValue}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>



                                        </Table>
                                    </TableContainer>
                                </Paper>
                            )}


                            {/* Service Images Section */}
                            {selectedService.images && (
                                <Paper elevation={0} sx={{ padding: 2, boxShadow: 0, borderRadius: 2 }}>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>Images</Typography>
                                    <Grid container spacing={2}>
                                        {Object.values(selectedService.images)
                                            .flat()
                                            .map((img, index) => (
                                                <Grid item key={index} xs={6} sm={3}>
                                                    <Box
                                                        component="img"
                                                        src={img}
                                                        alt={`Service ${index + 1}`}
                                                        sx={{
                                                            width: "100%",
                                                            height: 120,
                                                            objectFit: "cover",
                                                            borderRadius: 2,
                                                            transition: "transform 0.3s",
                                                            "&:hover": { transform: "scale(1.05)" },
                                                        }}
                                                    />
                                                </Grid>
                                            ))}

                                    </Grid>
                                </Paper>
                            )}
                        </DialogContent>

                        <DialogActions sx={{ padding: 2 }}>
                            <Button onClick={handleCloseDialog} variant="contained" color="inherit">
                                Close
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

        </Box >
    );
};

export default ApprovedServices;
