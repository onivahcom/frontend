import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Button,
    Box,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Stack,
    DialogActions,
    TextField, Drawer, Slide, useTheme, useMediaQuery, Chip, Divider, Card, CardMedia, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { apiUrl } from '../Api/Api';
import { NavigateNext } from '@mui/icons-material';
import adminAxios from '../Api/Api';
import Close from '@mui/icons-material/Close';
import { formatCategory } from '../components/RemoveUnderscore';
import { useOutletContext } from 'react-router-dom';

const RequestedServices = () => {


    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detect small screens
    const { adminData } = useOutletContext();

    const [requestedServices, setRequestedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentImages, setCurrentImages] = useState([]); // array of image URLs
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [currentImage, setCurrentImage] = useState(null);
    const [pdfUrl, setPdfUrl] = useState("");
    const [searchText, setSearchText] = useState("");
    const [filterCategory, setFilterCategory] = useState("");
    const [sortBy, setSortBy] = useState(""); // "date" or "category"




    useEffect(() => {
        const fetchRequestedServices = async () => {
            try {
                const response = await adminAxios.get(`/requested-services`);
                console.log(response.data);
                setRequestedServices(response.data);
                setLoading(false);
            } catch (error) {
                console.log('Error fetching requested services:', error);
                setLoading(false);
            }
        };

        fetchRequestedServices();
    }, []);

    const fetchSignedUrl = async () => {

        try {
            const res = await adminAxios.get(`/pdf/signed-url/${selectedService.file.publicId}`);
            if (res.data.success) {
                setPdfUrl(res.data.signedUrl);
            }
        } catch (err) {
            console.log("Error fetching signed URL:", err);
        }
    };

    const handleImageClick = (images, index) => {
        setCurrentImages(images);
        setCurrentImageIndex(index);
        setCurrentImage(images[index]);
        setOpenDialog(true);
    };

    const handleNextImage = () => {
        if (currentImageIndex < currentImages.length - 1) {
            const newIndex = currentImageIndex + 1;
            setCurrentImageIndex(newIndex);
            setCurrentImage(currentImages[newIndex]);
        }
    };

    const handlePrevImage = () => {
        if (currentImageIndex > 0) {
            const newIndex = currentImageIndex - 1;
            setCurrentImageIndex(newIndex);
            setCurrentImage(currentImages[newIndex]);
        }
    };


    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCurrentImage(null);
        setCurrentImageIndex(0);
    };


    const [open, setOpen] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState("");
    const [reason, setReason] = useState("");



    const [selectedService, setSelectedService] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Approve a service
    const handleApprove = (serviceId) => {

        if (!serviceId || !adminData?.id) {
            console.log(serviceId, adminData);
            alert(`Missing Id's`);
            return
        };

        adminAxios
            .post(
                "/approve-service",
                { serviceId, adminId: adminData?.id },
                { withCredentials: true }
            )
            .then((res) => {
                // Remove approved service from list
                setRequestedServices((prev) => prev.filter((s) => s._id !== serviceId));

                // Close drawer and reset selected service
                setDrawerOpen(false);
                setSelectedService(null);

                alert("Service approved successfully!");
            })
            .catch((err) => {
                console.error(err.response?.data || err.message);
            });
    };


    // View details of a service
    const handleViewDetails = async (service) => {
        try {
            setSelectedService({ ...service });
            setDrawerOpen(true);
        } catch (err) {
            console.error('Error fetching service details:', err);
        }
    };




    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setSelectedService(null);
    };

    const handleDeclineDialog = (email) => {
        setSelectedEmail(email);
        setOpen(true);
    };

    const handleCloseDeclineDialog = () => {
        setOpen(false);
        setReason("");
    };

    const handleConfirmDecline = async (id) => {
        if (!reason.trim()) {
            alert("Please provide a reason for declining.");
            return;
        }

        try {
            await adminAxios.put(`/decline-service/${id}`, { reason });
            alert("Service request declined successfully.");
            handleCloseDrawer();
            handleCloseDeclineDialog(); // Close the dialog
            setRequestedServices(requestedServices.filter((service) => service._id !== id)); // Remove from UI
        } catch (error) {
            console.error("Error declining request:", error);
            alert("Failed to decline the request.");
        }
    };

    const filteredServices = requestedServices
        .filter((service) => {
            const searchLower = searchText.toLowerCase();
            return (
                service.fullName.toLowerCase().includes(searchLower) ||
                service.email.toLowerCase().includes(searchLower)
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
        return <Typography variant="h6" align="center">Loading...</Typography>;
    }

    return (
        <Box sx={{ padding: { xs: 1, md: 3 } }}>
            <Typography variant="body2" fontWeight={500} align="left" gutterBottom>
                Requested Services
            </Typography>

            <Box sx={{ bgcolor: "#f8f8f8", p: 2, borderRadius: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    {/* Search Input */}
                    <Grid item xs={12} sm={6} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            label="Search by name/email"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                    </Grid>

                    {/* Category Dropdown */}
                    <Grid item xs={6} sm={3} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={filterCategory}
                                label="Category"
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                <MenuItem value="">All</MenuItem>
                                {Array.from(new Set(requestedServices.map(s => s.category))).map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {cat.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Sort Dropdown */}
                    <Grid item xs={6} sm={3} md={2}>
                        <FormControl fullWidth size="small">
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
                    </Grid>

                    {/* Clear Filters Button */}
                    <Grid item xs={12} sm={12} md={2}>
                        <Button
                            fullWidth
                            size="small"
                            variant="text"
                            onClick={() => {
                                setSortBy(null);
                                setFilterCategory(null);
                                setSearchText('');
                            }}
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                </Grid>
            </Box>


            <Grid container spacing={2}>
                {filteredServices.map((service, index) => (
                    <Grid item xs={6} lg={3} key={index}>
                        <Box
                            sx={{
                                p: 2,
                                borderRadius: 2,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                bgcolor: "white",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                height: "100%",
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                position: "relative", // needed for absolute chip
                                "&:hover": {
                                    transform: "translateY(-4px)",
                                    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
                                },
                            }}
                            onClick={() => handleViewDetails(service)}
                        >
                            {/* Cover Image */}
                            <Box
                                component="img"
                                src={service?.images?.CoverImage?.[0] || "/placeholder.jpg"}
                                alt={service.fullName}
                                sx={{
                                    width: "100%",
                                    height: 150,
                                    borderRadius: 2,
                                    objectFit: "cover",
                                    mb: 1.5,
                                }}
                            />

                            {/* Category Chip - absolute */}
                            <Chip
                                label={formatCategory(service.category)}
                                color="default"
                                sx={{
                                    fontSize: "0.75rem",
                                    fontWeight: 500,
                                    bgcolor: "white",
                                    border: "1px solid #ddd",
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                }}
                            />

                            {/* Name */}
                            <Typography
                                variant="subtitle1"
                                fontWeight={600}
                                sx={{
                                    color: "#1e1e1e",
                                    mb: 0.5,
                                    textAlign: "center",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {service.fullName}
                            </Typography>

                            {/* Business Name */}
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "#666",
                                    mb: 1,
                                    textAlign: "center",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {service.additionalFields.businessName}
                            </Typography>

                            {/* Action */}
                            <Button
                                endIcon={<NavigateNext />}
                                size="small"
                                variant="text"
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    width: "100%",
                                    color: "#1976d2",
                                    fontWeight: 500,
                                }}
                            >
                                View
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            {/* Slide Drawer for Details */}
            <Drawer anchor="bottom" open={drawerOpen} onClose={handleCloseDrawer} sx={{ p: 2 }}>
                <Slide direction="up" in={drawerOpen} mountOnEnter unmountOnExit>
                    <Box sx={{ width: '100%', padding: "20px", mt: 10, position: "relative" }}>

                        {selectedService ? (
                            <>
                                {/* <Typography variant="body1"><strong>Name:</strong> {selectedService.fullName}</Typography>
                                <Typography variant="body1"><strong>Email:</strong> {selectedService.email}</Typography> */}

                                {selectedService.additionalFields && Object.keys(selectedService.additionalFields).length > 0 && (
                                    <TableContainer elevation={0} component={Paper} sx={{
                                        marginTop: 2, borderRadius: "8px", maxWidth: 900, placeSelf: "center", maxHeight: 500, // set max height for scroll
                                        overflow: "auto",
                                    }}>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow
                                                    sx={{
                                                        position: "sticky",
                                                        top: 0,
                                                        backgroundColor: "#564d94",
                                                        color: "white",
                                                        zIndex: 10,
                                                    }}
                                                >
                                                    <TableCell
                                                        colSpan={2}
                                                        sx={{ fontWeight: "bold", color: "white", fontSize: "1rem" }}
                                                    >
                                                        Service Details
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            width: "50px",
                                                            textAlign: "right",
                                                            color: "white",
                                                        }}
                                                    >
                                                        <IconButton sx={{ p: 0 }} onClick={handleCloseDrawer}>
                                                            <Close sx={{ fontSize: 20, color: "white" }} />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow sx={{ backgroundColor: "#f8f8f8" }}>
                                                    <TableCell align='center' colSpan={4} sx={{ fontWeight: "bold", p: 2 }}>{selectedService.additionalFields.businessName}</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>



                                                <TableRow >
                                                    <TableCell colSpan={2} sx={{ textTransform: "capitalize", fontWeight: "500", color: "gray" }}>
                                                        Name
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedService.fullName}
                                                    </TableCell>
                                                </TableRow>
                                                <TableRow >
                                                    <TableCell colSpan={2} sx={{ textTransform: "capitalize", fontWeight: "500", color: "gray" }}>
                                                        Email
                                                    </TableCell>
                                                    <TableCell>
                                                        {selectedService.email}
                                                    </TableCell>
                                                </TableRow>

                                                {Object.entries(selectedService.additionalFields).filter(([key]) => key !== "groupedUrls").map(([key, value]) => (


                                                    <TableRow key={key}>
                                                        <TableCell colSpan={2} sx={{ textTransform: "capitalize", fontWeight: "500", color: "gray" }}>
                                                            {key.replace(/([A-Z])/g, ' $1')}
                                                        </TableCell>
                                                        <TableCell>

                                                            {

                                                                key === "customFields" && (value) ? (
                                                                    <Box sx={{ marginTop: "5px" }}>
                                                                        {Array.isArray(value) ? (
                                                                            <Table sx={{ minWidth: 450, maxWidth: 900 }} aria-label="custom fields table">

                                                                                <TableBody>
                                                                                    {value.map((item, index) => (
                                                                                        <TableRow key={index}>
                                                                                            <TableCell sx={{ color: "#333", fontWeight: 500 }}> {index + 1}. {' '} {item.name}</TableCell>
                                                                                            <TableCell sx={{ textAlign: "left", color: "#333", whiteSpace: "pre-line", }}>
                                                                                                {item.value}
                                                                                            </TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                </TableBody>
                                                                            </Table>
                                                                        ) : (
                                                                            <Typography variant="body2" color="text.secondary">
                                                                                No service details available.
                                                                            </Typography>
                                                                        )}
                                                                    </Box>
                                                                ) :
                                                                    key === "generatedWhyUs" && value ? (
                                                                        <Box sx={{ marginTop: "5px" }}>
                                                                            {(() => {
                                                                                let parsed = [];
                                                                                try {
                                                                                    parsed = typeof value === "string" ? JSON.parse(value) : value;
                                                                                } catch (e) {
                                                                                    parsed = [];
                                                                                }

                                                                                return Array.isArray(parsed) && parsed.length > 0 ? (
                                                                                    <Table sx={{ minWidth: 450, maxWidth: 900 }} aria-label="generated why us table">
                                                                                        <TableBody>
                                                                                            {parsed.map(({ title, description }, index) => (
                                                                                                <TableRow key={index}>
                                                                                                    <TableCell sx={{ color: "#333", fontWeight: 600, width: "35%" }}>
                                                                                                        {index + 1}. {title}
                                                                                                    </TableCell>
                                                                                                    <TableCell
                                                                                                        sx={{
                                                                                                            textAlign: "left",
                                                                                                            color: "#555",
                                                                                                            whiteSpace: "pre-line",
                                                                                                        }}
                                                                                                    >
                                                                                                        {description}
                                                                                                    </TableCell>
                                                                                                </TableRow>
                                                                                            ))}
                                                                                        </TableBody>
                                                                                    </Table>
                                                                                ) : (
                                                                                    <Typography variant="body2" color="text.secondary">
                                                                                        No details available.
                                                                                    </Typography>
                                                                                );
                                                                            })()}
                                                                        </Box>

                                                                    )
                                                                        :
                                                                        Array.isArray(value) && value.every(item => typeof item === "object") ? (
                                                                            value.map((obj, idx) => (
                                                                                <Box key={idx} sx={{ mb: 1 }}>
                                                                                    {Object.entries(obj).map(([k, v]) => (
                                                                                        <Typography key={k} variant="body2">
                                                                                            <strong>{k}:</strong> {v?.toString?.() || "N/A"}
                                                                                        </Typography>
                                                                                    ))}
                                                                                    <Divider sx={{ my: 1 }} />
                                                                                </Box>
                                                                            ))
                                                                        ) :
                                                                            typeof value === "object" ? (
                                                                                <Box>
                                                                                    {Object.entries(value).map(([subKey, subVal]) => (
                                                                                        <Typography key={subKey} variant="body2">
                                                                                            <strong>{subKey}:</strong> {subVal?.toString?.() || "N/A"}
                                                                                        </Typography>
                                                                                    ))}
                                                                                </Box>
                                                                            ) :
                                                                                (
                                                                                    <Typography variant="body2">{value?.toString?.() || "N/A"}</Typography>
                                                                                )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}


                                                {Object.entries(selectedService.images).map(([folder, urls], folderIdx) => (
                                                    <TableRow key={urls}>
                                                        <TableCell colSpan={2}>Images</TableCell>
                                                        <TableCell>
                                                            <Box key={folderIdx} sx={{ bgcolor: "#f8f8f8", mb: 2, width: "100%", p: 2 }}>
                                                                <Typography variant="subtitle2" gutterBottom>
                                                                    {folder.replace(/([A-Z])/g, ' $1').trim()}
                                                                </Typography>
                                                                <Grid container spacing={2} sx={{ width: "100%" }}>
                                                                    {urls.map((url, idx) => (
                                                                        <Grid item key={idx} xs={4} sm={3} md={4}>
                                                                            <CardMedia
                                                                                onClick={() => handleImageClick(urls, idx)}  // pass full array + index
                                                                                component="img"
                                                                                height="140"
                                                                                image={url}
                                                                                alt={`${folder} image ${idx + 1}`}
                                                                                sx={{ objectFit: 'cover', width: '100%', borderRadius: 1, cursor: 'pointer' }}
                                                                            />
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                                <TableRow>
                                                    <TableCell colSpan={2}>Aadhaar</TableCell>
                                                    <TableCell>
                                                        <Box display="flex" flexDirection="column" gap={1}>
                                                            <Button
                                                                sx={{ maxWidth: 150 }}
                                                                variant="text"
                                                                color="primary"
                                                                onClick={fetchSignedUrl}
                                                            >
                                                                Preview PDF
                                                            </Button>

                                                            {pdfUrl && (
                                                                <Box
                                                                    display="flex"
                                                                    flexDirection="column"
                                                                    gap={1}
                                                                    mt={1}
                                                                    width="100%"
                                                                >
                                                                    {/* PDF Preview */}
                                                                    <Box
                                                                        sx={{
                                                                            position: "relative",
                                                                            width: "100%",
                                                                            pt: "56.25%", // 16:9 aspect ratio
                                                                        }}
                                                                    >
                                                                        <iframe
                                                                            src={pdfUrl}
                                                                            title="PDF Preview"
                                                                            style={{
                                                                                position: "absolute",
                                                                                top: 0,
                                                                                left: 0,
                                                                                width: "100%",
                                                                                height: "100%",
                                                                                border: "1px solid #ccc",
                                                                                borderRadius: 4,
                                                                            }}
                                                                        />
                                                                    </Box>

                                                                    {/* Download Button */}
                                                                    <Button
                                                                        sx={{ maxWidth: 150 }}
                                                                        variant="contained"
                                                                        component="a"
                                                                        href={pdfUrl}
                                                                        download="Aadhaar.pdf"
                                                                    >
                                                                        Download PDF
                                                                    </Button>
                                                                </Box>
                                                            )}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>





                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                                <Stack
                                    sx={{ width: "100%", p: 3 }}
                                    direction={isMobile ? "row" : "row"}
                                    spacing={2}
                                    justifyContent={isMobile ? "center" : "center"}
                                    alignItems="center"
                                >
                                    <Button
                                        size="small"
                                        variant="contained"
                                        sx={{
                                            display: selectedService._id ? "block" : "none",
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            backgroundColor: "#4caf50",
                                            "&:hover": { backgroundColor: "#388e3c" },
                                            borderRadius: "8px",
                                            width: isMobile ? "fit-content" : "100px",
                                        }}
                                        onClick={() => handleApprove(selectedService._id)}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="warning"
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            borderRadius: "8px",
                                            borderColor: "#d32f2f",
                                            "&:hover": { backgroundColor: "#ffebee", borderColor: "#b71c1c" },
                                            width: isMobile ? "fit-content" : "100px",
                                        }}
                                        onClick={() => handleDeclineDialog(selectedService.email)}
                                    >
                                        Decline
                                    </Button>

                                    <Button
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                            textTransform: "none",
                                            fontWeight: "bold",
                                            borderRadius: "8px",
                                            width: isMobile ? "fit-content" : "100px",
                                        }}
                                        onClick={handleCloseDrawer}
                                    >
                                        Close
                                    </Button>
                                </Stack>





                            </>
                        ) : (
                            <Typography variant="body2">No details available.</Typography>
                        )}
                    </Box>
                </Slide>
            </Drawer>


            {/* Image Preview Dialog */}
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(0,0,0,0.9)',
                        boxShadow: 24,
                        borderRadius: 2,
                        overflow: 'hidden',
                    },
                }}
            >
                <DialogContent
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        minHeight: '60vh',
                        padding: 4,
                    }}
                >
                    {/* Close Button */}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseDialog}
                        sx={{
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>

                    {/* Prev Arrow */}
                    <IconButton
                        onClick={handlePrevImage}
                        disabled={currentImageIndex === 0}
                        sx={{
                            position: 'absolute',
                            left: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
                        }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>

                    {/* Image */}
                    {currentImage ? (
                        <img
                            src={currentImage}
                            alt="Preview"
                            style={{
                                height: 400,
                                width: 500,
                                maxHeight: '400px',
                                maxWidth: '100%',
                                borderRadius: '10px',
                                objectFit: 'cover',
                            }}
                        />
                    ) : (
                        <Typography color="white">No Image</Typography>
                    )}

                    {/* Next Arrow */}
                    <IconButton
                        onClick={handleNextImage}
                        disabled={currentImageIndex === currentImages.length - 1}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'white',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            '&:hover': { backgroundColor: 'rgba(0,0,0,0.6)' },
                        }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>
                </DialogContent>
            </Dialog>



            {/* Decline Confirmation Dialog */}
            <Dialog open={open} onClose={handleCloseDeclineDialog} maxWidth="xl">
                <DialogTitle sx={{ bgcolor: "#dddd" }}>Decline Request</DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    <Typography variant='body5' sx={{ mt: 2 }} component="div" color='textSecondary'>Write a detailed description for declining the request.</Typography>
                    <p><strong>To :</strong> {selectedEmail}</p>
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Reason for Declining"
                        variant="outlined"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        sx={{ marginTop: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeclineDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleConfirmDecline(selectedService._id)} variant="contained" color="error">
                        Confirm Decline
                    </Button>
                </DialogActions>
            </Dialog>


        </Box >
    );
};

export default RequestedServices;
