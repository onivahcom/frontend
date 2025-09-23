import axios from "axios";
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Paper,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    IconButton,
} from "@mui/material";
import { RemoveRedEye } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import PaginationWrapper from "./Utils/PaginationWrapper";
import adminAxios, { apiUrl } from "../Api/Api";


const VendorsList = () => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedVendor, setSelectedVendor] = useState(null);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await adminAxios.get(`/list/vendor`);
                setVendors(res.data);
            } catch (err) {
                console.error("Error fetching vendors:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    // Filter vendors based on search input
    const filteredVendors = vendors.filter((vendor) =>
        Object.values(vendor)
            .join(" ")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Vendor Profiles
            </Typography>

            {/* Search Field */}
            <Box justifySelf='end'>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search vendors..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2, maxWidth: 300, }}
                />
            </Box>

            {/* Responsive Table */} {/* Table container */}

            <TableContainer component={Paper} elevation={0} sx={{ overflowX: "auto" }}>
                <Table size="medium">
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Profile</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    {/* PaginationWrapper will only render TableBody rows */}
                    <PaginationWrapper
                        data={filteredVendors}
                        defaultRowsPerPage={5}
                        renderRow={(vendor, index) => (
                            <TableRow
                                key={vendor._id}
                                hover
                                sx={{ cursor: "pointer" }}
                                onClick={() => setSelectedVendor(vendor)}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>
                                    <Avatar
                                        src={vendor.profilePic}
                                        alt={`${vendor.firstName} ${vendor.lastName}`}
                                        sx={{ width: 40, height: 40 }}
                                    />
                                </TableCell>
                                <TableCell>{vendor.firstName} {vendor.lastName}</TableCell>
                                <TableCell>{vendor.email}</TableCell>
                                <TableCell>{vendor.phone}</TableCell>
                                <TableCell>{vendor.city}</TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedVendor(vendor);
                                        }}
                                    >
                                        <RemoveRedEye sx={{ color: "grey" }} />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        )}
                    />
                </Table>
            </TableContainer>





            {/* Dialog for Vendor Details */}
            {selectedVendor && (
                <Dialog
                    open={!!selectedVendor}
                    onClose={() => setSelectedVendor(null)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle
                        sx={{
                            textAlign: "left",
                            position: "relative",
                            fontSize: '1rem',
                            paddingRight: "40px" // to avoid overlap with close icon
                        }}
                    >
                        Vendor Profile
                        <IconButton
                            aria-label="close"
                            onClick={() => setSelectedVendor(null)}
                            sx={{
                                position: "absolute",
                                right: 8,
                                top: 8,
                                color: (theme) => theme.palette.grey[500],
                            }}
                        >
                            <Close />
                        </IconButton>
                    </DialogTitle>

                    <DialogContent dividers>
                        {/* Profile Header */}
                        <Box
                            display="flex"
                            alignItems="center"
                            textAlign="left"
                            mb={3}
                            gap={2} // spacing between avatar and text
                        >
                            <Avatar
                                src={selectedVendor.profilePic}
                                alt={`${selectedVendor.firstName} ${selectedVendor.lastName}`}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    boxShadow: 3,
                                    border: "3px solid white",
                                }}
                            />

                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {selectedVendor.firstName} {selectedVendor.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedVendor.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Joined : {new Date(selectedVendor.entry_Time).toLocaleString()}
                                </Typography>

                            </Box>
                        </Box>


                        {/* Details Section */}
                        <Box
                            sx={{
                                backgroundColor: "#f9f9f9",
                                borderRadius: 2,
                                p: 2,
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Phone
                                    </Typography>
                                    <Typography variant="body1">{selectedVendor.phone}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Entry Time
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(selectedVendor.entry_Time).toLocaleString()}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        City
                                    </Typography>
                                    <Typography variant="body1">{selectedVendor.city}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        State
                                    </Typography>
                                    <Typography variant="body1">{selectedVendor.state}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Country
                                    </Typography>
                                    <Typography variant="body1">{selectedVendor.country}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Pincode
                                    </Typography>
                                    <Typography variant="body1">{selectedVendor.pincode}</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Address
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedVendor.addressLine1}, {selectedVendor.addressLine2}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </DialogContent>


                </Dialog>
            )}

        </Box>
    );
};

export default VendorsList;
