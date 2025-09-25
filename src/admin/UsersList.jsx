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
    DialogActions,
    Button,
    Grid,
    IconButton,
    Card
} from "@mui/material";
import { RemoveRedEye } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import PaginationWrapper from "./Utils/PaginationWrapper";
import adminAxios, { apiUrl } from "../Api/Api";
import { Link } from "react-router-dom";
import { useTheme, useMediaQuery } from "@mui/material";


const UsersList = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedUsers, setSelectedUsers] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await adminAxios.get(`/list/users`);
                setUsers(res.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search input
    const filteredUsers = users.filter((users) =>
        Object.values(users)
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
                User Profiles
            </Typography>

            {/* Search Field */}
            <Box justifySelf='end'>
                <TextField
                    fullWidth
                    variant="outlined"
                    size="small"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ mb: 2, maxWidth: 300, }}
                />
            </Box>

            {/* Responsive Table */} {/* Table container */}

            {isMobile ? (
                // ✅ Mobile - Grid / Card View
                <Grid container spacing={2}>
                    {filteredUsers.map((user, index) => (
                        <Grid item xs={12} key={user._id}>
                            <Card
                                sx={{
                                    borderRadius: 2,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                                    p: 2,
                                    cursor: "pointer",
                                    "&:hover": { boxShadow: "0 6px 16px rgba(0,0,0,0.1)" },
                                }}
                                onClick={() => setSelectedUsers(user)}
                            >
                                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                                    <Avatar
                                        src={user.profilePic}
                                        alt={`${user.firstname} ${user.lastname}`}
                                        sx={{ width: 48, height: 48, mr: 2 }}
                                    />
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="600">
                                            {user.firstname} {user.lastname}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            {user.email}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Grid container spacing={1}>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            Phone
                                        </Typography>
                                        <Typography variant="body2">{user.phone}</Typography>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            City
                                        </Typography>
                                        <Typography variant="body2">{user.city}</Typography>
                                    </Grid>
                                </Grid>

                                {/* Action */}
                                <Box sx={{ textAlign: "right", mt: 1 }}>
                                    <IconButton
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedUsers(user);
                                        }}
                                    >
                                        <RemoveRedEye sx={{ color: "grey" }} />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                // ✅ Desktop - Keep Table
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

                        <PaginationWrapper
                            data={filteredUsers}
                            defaultRowsPerPage={5}
                            renderRow={(user, index) => (
                                <TableRow
                                    key={user._id}
                                    hover
                                    sx={{ cursor: "pointer" }}
                                    onClick={() => setSelectedUsers(user)}
                                >
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>
                                        <Avatar
                                            src={user.profilePic}
                                            alt={`${user.firstname} ${user.lastname}`}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                    </TableCell>
                                    <TableCell>{user.firstname} {user.lastname}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.city}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedUsers(user);
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
            )}


            {/* Dialog for users Details */}
            {selectedUsers && (
                <Dialog
                    open={!!selectedUsers}
                    onClose={() => setSelectedUsers(null)}
                    maxWidth="sm"
                    fullWidth
                    fullScreen
                >
                    <DialogTitle
                        sx={{
                            textAlign: "left",
                            position: "relative",
                            fontSize: '1rem',
                            paddingRight: "40px" // to avoid overlap with close icon
                        }}
                    >
                        User Profile
                        <IconButton
                            aria-label="close"
                            onClick={() => setSelectedUsers(null)}
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
                                src={selectedUsers.profilePic}
                                alt={`${selectedUsers.firstName} ${selectedUsers.lastName}`}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    boxShadow: 3,
                                    border: "3px solid white",
                                }}
                            />

                            <Box>
                                <Typography variant="h6" fontWeight="bold">
                                    {selectedUsers.firstName} {selectedUsers.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {selectedUsers.email}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Joined : {new Date(selectedUsers.entry_Time).toLocaleString()}
                                </Typography>
                                <Link style={{ fontSize: "0.75rem" }} to={`/admin-dashboard/users/${selectedUsers._id}`}>
                                    View User Profile
                                </Link>

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
                                    <Typography variant="body1">{selectedUsers.phone}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Entry Time
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(selectedUsers.entry_Time).toLocaleString()}
                                    </Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        City
                                    </Typography>
                                    <Typography variant="body1">{selectedUsers.city}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        State
                                    </Typography>
                                    <Typography variant="body1">{selectedUsers.state}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Country
                                    </Typography>
                                    <Typography variant="body1">{selectedUsers.country}</Typography>
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        Pincode
                                    </Typography>
                                    <Typography variant="body1">{selectedUsers.zipcode}</Typography>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="caption" color="text.secondary">
                                        Address
                                    </Typography>
                                    <Typography variant="body1">
                                        {selectedUsers.addressLine1}, {selectedUsers.addressLine2}
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

export default UsersList;
