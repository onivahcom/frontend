import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Card,
    CardContent,
    IconButton,
    Chip,
    Grid,
    Fab,
    TextField,
    Skeleton,
} from "@mui/material";
import { Edit, Delete, Add as AddIcon, LocationOff, Timer } from "@mui/icons-material";
import { useNavigate, useOutletContext } from "react-router-dom";
import { apiUrl, backendApi } from "../Api/Api";
import axios from "axios";
import withLoadingAndError from "../hoc/withLoadingAndError";
import LocationCity from "@mui/icons-material/LocationCity";
import LocationOn from "@mui/icons-material/LocationOn";

const ManageServices = ({ setLoading, setError, loading, error }) => {
    const { vendor } = useOutletContext();
    const navigate = useNavigate();

    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true)
                const res = await backendApi.get(`/vendor/fetch/services?email=${vendor?.email}`, { withCredentials: true });
                setServices(res.data.services);
                setLoading(false)
            } catch (err) {
                setLoading(false)
                console.log("Error fetching services:", err);
            }
            finally {
                setLoading(false)
            }
        };

        fetchServices();
    }, []);


    const handleEdit = (service) => {
        navigate(`/vendor-dashboard/edit/${service.category}/${service.linkedServiceId}`)
    };

    const handleDelete = (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this service?");
        if (confirmDelete) {
            setServices(prev => prev.filter(s => s._id !== id));
        }
    };

    const handleAddService = () => {
        navigate('/vendor-dashboard/vendor-services')
    };

    const filteredServices = services.filter(service => {
        const nameMatch = service?.additionalFields?.businessName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const statusMatch =
            statusFilter === "All" ||
            (statusFilter === "Live" && service.isApproved) ||
            (statusFilter === "Declined" && service.declined) ||
            (statusFilter === "Pending" && !service.isApproved && !service.declined);

        return nameMatch && statusMatch;
    });



    return (
        <Box p={2} maxWidth="md" mx="auto">
            <Typography variant="body5" color="inherit" fontWeight={500} component='div' mb={5}>
                Manage Your Services
            </Typography>

            <Box display="flex" gap={2} mb={3} flexDirection={{ xs: "row", sm: "row" }} justifyContent='end'>
                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="🔍 Search by business name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: 600 }}
                />
                <TextField
                    select
                    size="small"
                    variant="outlined"
                    label="Filter by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ width: 200 }}
                    SelectProps={{ native: true }}
                >
                    <option value="All">All</option>
                    <option value="Live">Live</option>
                    <option value="Pending">Pending</option>
                    <option value="Declined">Declined</option>
                </TextField>
            </Box>

            {
                loading ?
                    <Box sx={{ p: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                            {/* Left: Text lines */}
                            <Grid item xs={8}>
                                <Skeleton variant="text" height={24} width="80%" />
                                <Skeleton variant="text" height={20} width="60%" />
                            </Grid>

                            {/* Right: Square Image */}
                            <Grid item xs={4}>
                                <Skeleton variant="rectangular" width="100%" sx={{ aspectRatio: '1 / 1', borderRadius: 2 }} />
                            </Grid>
                        </Grid>
                    </Box>
                    :

                    <Grid container spacing={3}>
                        {filteredServices.map((service) => {

                            const coverImage = service.images?.CoverImage[0] || "https://placehold.co/300";
                            // ✅ Dynamically find first group other than CoverImage
                            const additionalGroupKey = Object.keys(service.images).find(
                                (key) => key !== "CoverImage" && Array.isArray(service.images[key]) && service.images[key].length > 0
                            );

                            const additionalImages = additionalGroupKey ? service.images[additionalGroupKey] : ['https://placehold.co/300', 'https://placehold.co/300'];

                            return (
                                <Grid item xs={12} key={service._id}>
                                    <Card
                                        sx={{
                                            borderRadius: 4,
                                            overflow: "hidden",
                                            boxShadow: 0,
                                            backgroundColor: "#f5f5f5",
                                            py: 2
                                        }}
                                    >
                                        <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}>
                                            {/* Left Content */}
                                            <Box flex={1} p={2}>
                                                <Box display="flex" justifyContent="space-between" sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "start", sm: "center" } }} >
                                                    <Box
                                                        display="flex"
                                                        alignItems="center"
                                                        flexDirection='row'
                                                        justifyContent="space-between"
                                                        gap={1}
                                                    >
                                                        <Typography
                                                            variant="h6"
                                                            component="div"
                                                            fontWeight={600}
                                                            sx={{
                                                                flexGrow: 1,
                                                                minWidth: 200,
                                                                wordBreak: 'break-word'
                                                            }}
                                                        >
                                                            {service.additionalFields?.businessName}
                                                        </Typography>

                                                        <Box gap={1} sx={{ display: !service.isApproved ? 'none' : 'flex' }}>
                                                            <IconButton
                                                                onClick={() => handleEdit(service)}
                                                                sx={{
                                                                    p: 0.5,
                                                                    bgcolor: '#eeee',
                                                                    '&:hover': { bgcolor: '#dbefff' },
                                                                    borderRadius: 2,
                                                                }}
                                                            >
                                                                <Edit color="inherit" sx={{ fontSize: 18, }} />
                                                            </IconButton>

                                                            <IconButton
                                                                onClick={() => handleDelete(service._id)}
                                                                sx={{
                                                                    p: 0.5,
                                                                    bgcolor: '#eeee',
                                                                    '&:hover': { bgcolor: '#ffd6d6' },
                                                                    borderRadius: 2,
                                                                }}
                                                            >
                                                                <Delete color="inherit" sx={{ fontSize: 18, }} />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>

                                                </Box>

                                                <Box display="flex" justifyContent="space-between" flexDirection='row' alignItems='start' sx={{ mt: 2, mb: 2, }} >

                                                    <Typography component='div' variant="caption" sx={{ color: "#5a4747", }}>
                                                        created at -    {new Date(service.createdAt).toLocaleDateString("en-GB")}
                                                    </Typography>

                                                    <Chip
                                                        icon={service.isApproved ? <LocationOn /> : service.declined ? <LocationOff /> : <Timer />}
                                                        label={service.isApproved ? "Live" : service.declined ? "Rejected" : "Pending"}
                                                        color={service.isApproved ? "success" : service.declined ? "error" : "warning"}
                                                        size="small"
                                                        sx={{ fontWeight: "bold", textTransform: "uppercase" }}
                                                    />
                                                </Box>

                                                <Typography variant="body2" color="textSecondary" sx={{
                                                    mb: 1,
                                                    overflow: "hidden",
                                                    display: "-webkit-box",
                                                    WebkitBoxOrient: "vertical",
                                                    WebkitLineClamp: 5,
                                                }}>
                                                    {service.additionalFields?.description}

                                                </Typography>



                                            </Box>

                                            {/* Right Image Section */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: { xs: "column", sm: "row" },
                                                    gap: 1,
                                                    width: { xs: "100%", sm: 180 },
                                                    height: { xs: 180, sm: 180 },
                                                }}
                                            >
                                                {additionalImages.length > 0 ? (
                                                    <Box
                                                        sx={{
                                                            display: "grid",
                                                            gridTemplateColumns: "1fr 1fr",
                                                            gridTemplateRows: "auto auto",
                                                            width: "100%",
                                                            height: "100%",
                                                            gap: "2px",
                                                        }}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={coverImage || 'https://placehold.co/600x400'}
                                                            alt="Cover"
                                                            sx={{
                                                                gridColumn: "1 / 3",
                                                                width: "100%",
                                                                height: 100,
                                                                objectFit: "cover",
                                                                borderRadius: 2,
                                                            }}
                                                        />
                                                        {additionalImages.slice(0, 3).map((img, idx) => (
                                                            <Box
                                                                key={idx}
                                                                component="img"
                                                                src={img.url || img}
                                                                alt={`extra-${idx}`}
                                                                sx={{
                                                                    width: "100%",
                                                                    height: 80,
                                                                    objectFit: "cover",
                                                                    borderRadius: 2,
                                                                }}
                                                            />
                                                        ))}
                                                    </Box>
                                                ) : (
                                                    <Box
                                                        component="img"
                                                        src={coverImage}
                                                        alt="Cover"
                                                        sx={{
                                                            width: "100%",
                                                            height: 180,
                                                            objectFit: "cover",
                                                            borderRadius: 2,
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })}
                    </Grid>
            }
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: "fixed", bottom: 5, right: 24 }}
                onClick={handleAddService}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

export default withLoadingAndError(ManageServices);
