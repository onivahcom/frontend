import React, { useState } from "react";
import {
    Box,
    Grid,
    Paper,
    Typography,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    TextField,
    Button,
    Avatar,
    Divider,
} from "@mui/material";
import adminAxios from "../Api/Api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { SearchOff } from "@mui/icons-material";
import ErrorOutline from "@mui/icons-material/ErrorOutline";

const ManageUsers = () => {

    const [filterBy, setFilterBy] = useState("phone");
    const [userType, setUserType] = useState("customer");
    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);   // ✅ user data
    const [error, setError] = useState(null);     // ❌ error message
    const [loading, setLoading] = useState(false); // ⏳ loading state

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (filterBy === "phone" && !query) {
            setError("Enter valid phone number");
            return
        } else if (query === '') {
            setError("Kindly fill the missing field");
        } else {
            setError(null);
        }

        const formattedQuery = filterBy === "phone" ? `+${query}` : query;

        setLoading(true);
        setError(null);
        setResult(null);
        try {
            const res = await adminAxios.post(
                "/search/manage-users",
                { filterBy, userType, formattedQuery },
                { withCredentials: true }
            );

            if (res.data && res.data.data) {
                setResult(res.data.data);   // ✅ success state
            } else {
                setError("No user found."); // ❌ explicitly handle no data
            }
        } catch (err) {
            console.error(err);

            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong, please try again.");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <Box
            sx={{
                p: { xs: 2, md: 4 },
                bgcolor: "background.default",
                minHeight: "100vh",
            }}
        >





            <Grid container spacing={3}
            // mx={result?.length > 0 ? 'auto' : 0}
            >
                {/* Left: Form */}
                <Grid item xs={12} md={6} >
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, md: 4 },
                            borderRadius: 3,
                        }}
                    >
                        <Typography variant="h6" fontWeight={500} gutterBottom>
                            Manage Customers & Vendors
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Search and manage users by phone, ID, or email.
                        </Typography>

                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2} mt={2}>
                                {/* Filter By Dropdown */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Filter By</InputLabel>
                                        <Select
                                            label="Filter By"
                                            value={filterBy}
                                            onChange={(e) => setFilterBy(e.target.value)}
                                        >
                                            <MenuItem value="phone">Phone</MenuItem>
                                            <MenuItem value="id">ID</MenuItem>
                                            <MenuItem value="email">Email</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* User Type Dropdown */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>User Type</InputLabel>
                                        <Select
                                            label="User Type"
                                            value={userType}
                                            onChange={(e) => setUserType(e.target.value)}
                                        >
                                            <MenuItem value="customer">Customer</MenuItem>
                                            <MenuItem value="vendor">Vendor</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* Input Field */}
                                <Grid item xs={12}>
                                    {filterBy === "phone" ? (
                                        <PhoneInput
                                            country={"in"}
                                            value={query}
                                            onChange={(value) => setQuery(value)}
                                            inputStyle={{
                                                width: "100%",
                                                height: "56px",
                                                borderRadius: "8px",
                                                fontSize: "16px",
                                            }}
                                            buttonStyle={{
                                                borderRadius: "8px 0 0 8px",
                                            }}
                                        />
                                    ) : (
                                        <TextField
                                            fullWidth
                                            type={filterBy === "email" ? "email" : "text"}
                                            label={
                                                filterBy === "id" ? "Enter User ID" : "Enter Email"
                                            }
                                            required
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                        />
                                    )}
                                </Grid>

                                {/* Submit Button */}
                                <Grid item xs={6}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        size="large"
                                        disabled={loading}
                                        sx={{ borderRadius: 2 }}
                                    >
                                        {loading ? 'Searching' : 'Search'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Paper>
                </Grid>

                {/* Right: Result */}
                {result ? (
                    <Grid item xs={12} md={6} sx={{ mt: { xs: 0, md: 10 } }}>
                        <Paper
                            elevation={0}
                            sx={{
                                border: "1px solid #dddd",
                                p: { xs: 2, md: 4 },
                                borderRadius: 3,
                            }}
                        >
                            <Box display="flex" alignItems="center" mb={3}>
                                <Avatar
                                    src={result.profilePic || ""}
                                    sx={{ width: 70, height: 70, mr: 2 }}
                                />
                                <Box>
                                    <Typography variant="h6" fontWeight={600}>
                                        {result.firstName || result.firstname}{" "}
                                        {result.lastName || result.lastname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {result.email || "No Email"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {result.phone || "No Phone"}
                                    </Typography>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        City
                                    </Typography>
                                    <Typography variant="body1">{result.city || "N/A"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        State
                                    </Typography>
                                    <Typography variant="body1">{result.state || "N/A"}</Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Country
                                    </Typography>
                                    <Typography variant="body1">
                                        {result.country || "N/A"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Zip / Pincode
                                    </Typography>
                                    <Typography variant="body1">
                                        {result.pincode || result.zipcode || "N/A"}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary">
                                        Address
                                    </Typography>
                                    <Typography variant="body1">
                                        {result.addressLine1 || ""} {result.addressLine2 || ""}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )
                    :
                    <Grid item xs={12} md={6} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {!error && !result && (
                            <Box
                                textAlign="center"
                                mt={6}
                                color="text.secondary"
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                            >
                                <SearchOff sx={{ fontSize: 56, mb: 2, color: "text.disabled" }} />
                                <Typography variant="h6" gutterBottom>
                                    Search for a User
                                </Typography>
                                <Typography variant="body2" maxWidth={320}>
                                    Enter a phone number, email, or ID to find customers and vendors quickly.
                                </Typography>
                            </Box>
                        )}

                        {error && (
                            <Box
                                textAlign="center"
                                mt={6}
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                            >
                                {error === "No user found" ? (
                                    <>
                                        <SearchOff sx={{ fontSize: 56, mb: 2, color: "text.disabled" }} />
                                        <Typography variant="h6" gutterBottom>
                                            No Users Found
                                        </Typography>
                                        <Typography variant="body2" maxWidth={320} color="text.secondary">
                                            We couldn’t find any customer or vendor matching your search.
                                            Try checking the details or using another filter.
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <ErrorOutline sx={{ fontSize: 56, mb: 2, color: "grey" }} />
                                        <Typography variant="body2" maxWidth={320} color="error">
                                            {error || "Something went wrong. Please try again later."}
                                        </Typography>
                                    </>
                                )}
                            </Box>
                        )}
                    </Grid>
                }
            </Grid>
        </Box>

    );
};

export default ManageUsers;
