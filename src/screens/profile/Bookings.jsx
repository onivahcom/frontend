import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { apiUrl, backendApi } from "../../Api/Api";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableContainer,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Chip,
    Avatar,
    Box,
    useMediaQuery,
    Grid,
    TextField,
    MenuItem,
    Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import Close from "@mui/icons-material/Close";
import InitiateChat from "../../components/chat/InitiateChat";
import { formatCategory } from "../../components/RemoveUnderscore";
import { NavigateNext } from "@mui/icons-material";
import { LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from "@mui/x-date-pickers";
import { styled } from '@mui/material/styles';
import dayjs from "dayjs";

const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: "50%",
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
    },
}));


export default function Bookings({ activeConversation }) {

    const { userData } = useOutletContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const navigate = useNavigate();
    const location = useLocation();

    const [bookings, setBookings] = useState([]);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    console.log(selectedBooking);
    useEffect(() => {
        backendApi
            .get(`/get-bookings?userId=${userData._id}`)
            .then((res) => setBookings(res.data))
            .catch((err) => console.log(err));
    }, [userData]);

    const handleOpenDialog = (booking) => setSelectedBooking(booking);
    const handleCloseDialog = () => setSelectedBooking(null);

    const getStatusChip = (status) => {
        switch (status) {
            case "authorized":
                return <Chip label="Pending" color="warning" size="small" />;
            case "captured":
                return <Chip label="Confirmed" color="success" size="small" />;
            case "pending":
                return <Chip label="Failed" color="error" size="small" />;
            case "cancelled":
                return <Chip label="Cancelled" color="error" size="small" />;
            default:
                return <Chip label={status} color="default" size="small" />;
        }
    };

    const filteredBookings = bookings.filter((b) => {
        // Filter by search (matches package title or host name)
        const matchesSearch =
            b.package?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.hostId?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.hostId?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.serviceId?.businessName?.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by status
        const matchesStatus = statusFilter ? b.status === statusFilter : true;

        return matchesSearch && matchesStatus;
    });


    const handleConversationCreated = (newConversation) => {
        navigate(`/messages/${newConversation._id}`, {
            state: location.state // keep passing state for context
        });
    };

    const StatusChip = ({ status }) => (
        <Chip
            label={status}
            color={
                status === "Captured"
                    ? "success"
                    : status === "Failed"
                        ? "error"
                        : "warning"
            }
            size="small"
        />
    );

    return (
        <Box maxWidth='md' mx='auto' sx={{ p: 2, mt: 4, minHeight: "100vh" }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={4} gutterBottom>
                My Bookings
            </Typography>

            <Box display="flex" flexDirection={{ xs: "row", sm: "row" }} gap={2} mb={3} sx={{ maxWidth: 600, ml: 'auto' }}>
                <TextField
                    size="small"
                    fullWidth
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                <TextField
                    size="small"
                    select
                    label="Filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    sx={{ width: { xs: "60%", sm: 200 } }}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="authorized">Pending</MenuItem>
                    <MenuItem value="captured">Confirmed</MenuItem>
                    <MenuItem value="pending">Failed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                </TextField>
            </Box>


            {/* Desktop: Table */}
            {!isMobile && (
                <TableContainer elevation={0} component={Paper} sx={{ borderRadius: 2, overflow: "hidden" }}>
                    <Table size="medium">
                        <TableHead sx={{ background: theme.palette.grey[100] }}>
                            <TableRow>
                                <TableCell>S.No</TableCell>
                                <TableCell>Service</TableCell>
                                <TableCell>Order Id</TableCell>
                                <TableCell align="right">Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredBookings.map((b, idx) => (
                                <TableRow
                                    key={b._id}
                                    sx={{
                                        cursor: "pointer",
                                        // "&:nth-of-type(odd)": { backgroundColor: theme.palette.grey[50] },
                                    }}
                                    onClick={() => handleOpenDialog(b)}
                                >
                                    <TableCell>{idx + 1}</TableCell>
                                    <TableCell>
                                        <Box display="flex" alignItems="center" gap={1.5}>
                                            <img
                                                src={b.serviceId?.coverImg}
                                                alt="cover"
                                                style={{ width: 50, height: 50, borderRadius: 8 }}
                                            />
                                            <Typography variant="body2">{b.serviceId?.businessName}</Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{b.razorpayOrderId.slice(-6).toUpperCase()}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 500 }}>
                                        ₹{b.amount}/-
                                    </TableCell>
                                    <TableCell>{getStatusChip(b.status)}</TableCell>
                                    <TableCell align="right" fontWeight="bold">
                                        <Button endIcon={<NavigateNext />} >View</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Mobile: Cards */}
            {isMobile && (
                <Grid container spacing={2}>
                    {filteredBookings.map((b) => (
                        <Grid item xs={6} sm={6} md={4} lg={3} key={b._id}>
                            <Card
                                onClick={() => handleOpenDialog(b)}
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: 3,
                                    boxShadow: 0,
                                    transition: "transform 0.2s, box-shadow 0.2s",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: 0,
                                    },
                                    border: "none",
                                    overflow: "hidden",
                                    position: "relative"
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height={{ xs: 140, sm: 160 }}
                                    image={b.serviceId?.coverImg || "/placeholder.jpg"}
                                    alt="cover"
                                    sx={{ objectFit: "cover", width: "100%", borderRadius: 3 }}
                                />
                                <CardContent sx={{ px: 2, py: 1.5 }}>
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        fontWeight={600}
                                        sx={{
                                            display: "-webkit-box",
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {b.razorpayOrderId || "No Id"}
                                    </Typography>
                                    <Typography variant="caption" fontWeight="bold" >
                                        {formatCategory(b.category)}
                                    </Typography>
                                    {/* <Typography fontWeight="bold" color="primary">
                                        ₹{b.amount}
                                    </Typography> */}
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        sx={{ position: "absolute", top: 0, right: 0 }}
                                    >
                                        {getStatusChip(b.status, { size: "small" })}
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

            )}

            {/* Dialog for details */}


            <Dialog
                open={!!selectedBooking}
                onClose={() => setSelectedBooking(null)}
                maxWidth="lg"
                // fullWidth
                fullScreen
            >
                <DialogTitle
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    Booking Details
                    <IconButton onClick={() => setSelectedBooking(null)} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedBooking && (
                        <Grid container spacing={3}>
                            {/* ------------- Host Info ------------- */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={0} sx={{ p: { xs: 1, md: 3 }, borderRadius: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Host Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar
                                            src={selectedBooking.hostId?.profilePic}
                                            alt="Host"
                                            sx={{ width: 64, height: 64 }}
                                        />
                                        <Box>
                                            <Typography fontWeight={600}>
                                                {selectedBooking.hostId?.firstName}{" "}
                                                {selectedBooking.hostId?.lastName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedBooking.hostId?.city}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* ------------- Service Info ------------- */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={0} sx={{ p: { xs: 1, md: 3 }, borderRadius: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Service Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar
                                            src={selectedBooking.serviceId?.coverImg}
                                            alt={selectedBooking.serviceId?.businessName}
                                            sx={{ width: 72, height: 72, borderRadius: 2 }}
                                            variant="rounded"
                                        />
                                        <Box>
                                            <Typography fontWeight={500}>
                                                {selectedBooking.serviceId?.businessName || "N/A"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Category: {formatCategory(selectedBooking.category)}
                                            </Typography>
                                            <NavLink style={{ fontSize: 12 }} to={`/category/${selectedBooking.category}/${selectedBooking.serviceId?.serviceId}`}>View</NavLink>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* ------------- Package Info ------------- */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={0} sx={{ p: { xs: 1, md: 3 }, borderRadius: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Package Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography fontWeight={500} color='textSecondary' variant="caption">Title</Typography>
                                            <Typography>{selectedBooking.package?.title}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography fontWeight={500} color='textSecondary' variant="caption">Amount</Typography>
                                            <Typography>₹{selectedBooking.package?.amount}</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography fontWeight={500} color='textSecondary' variant="caption">Description</Typography>
                                            <Typography variant="body2">
                                                {selectedBooking.package?.description}
                                            </Typography>
                                        </Grid>
                                        {selectedBooking.package?.additionalRequest && (
                                            <Grid item xs={12}>
                                                <Typography fontWeight={500} color='textSecondary' variant="caption">
                                                    Additional Request
                                                </Typography>
                                                <Typography>
                                                    {selectedBooking.package.additionalRequest}
                                                </Typography>
                                            </Grid>
                                        )}
                                        <Grid item xs={12}>
                                            <Typography fontWeight={500} gutterBottom color='textSecondary' variant="caption">
                                                Booked Dates
                                            </Typography>
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>

                                                <DateCalendar
                                                    readOnly
                                                    views={["day"]}
                                                    disableHighlightToday
                                                    slots={{
                                                        day: (props) => {
                                                            const isBooked = selectedBooking?.package?.dates?.some((d) =>
                                                                dayjs(d).isSame(props.day, "day")
                                                            );

                                                            if (isBooked) {
                                                                return <HighlightedDay {...props} />;
                                                            }
                                                            return (
                                                                <PickersDay
                                                                    {...props}
                                                                    disabled
                                                                    sx={{ opacity: 0.4 }}
                                                                />
                                                            );
                                                        },
                                                    }}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>

                            {/* ------------- Payment Info ------------- */}
                            <Grid item xs={12} md={6}>
                                <Paper elevation={0} sx={{ p: { xs: 1, md: 3 }, borderRadius: 3 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Payment Information
                                    </Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography fontWeight={500} color='textSecondary' variant="caption">Amount Paid</Typography>
                                            <Typography color="success.main" fontWeight={500}>₹{selectedBooking.amount}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography fontWeight={500} color='textSecondary' component='div' variant="caption">Status</Typography>
                                            <StatusChip status={selectedBooking.status === "authorized" ? 'Pending' : selectedBooking.status === "captured" ? 'Captured' : 'Failed'} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography fontWeight={500} color='textSecondary' variant="caption"> Order ID</Typography>
                                            <Typography variant="body2">
                                                {selectedBooking.razorpayOrderId}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography fontWeight={500} color='textSecondary' variant="caption">Payment ID</Typography>
                                            <Typography variant="body2">
                                                {selectedBooking.razorpayPaymentId}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleCloseDialog} variant="outlined">
                        Close
                    </Button>

                    {!activeConversation && (
                        <InitiateChat
                            userId={userData?._id}
                            vendorId={selectedBooking?.hostId?._id}
                            serviceId={selectedBooking?.serviceId?.serviceId}
                            serviceCategory={selectedBooking?.serviceId?.category}
                            serviceName={selectedBooking?.serviceId?.businessName}
                            onConversationCreated={handleConversationCreated}
                            customButtonProps={{
                                variant: "contained",
                                sx: {
                                    textTransform: "none",
                                    // bgcolor: "#6d4d94",
                                    color: "#fff",
                                    borderRadius: 2,
                                    fontWeight: 500,
                                    '&:hover': {
                                        bgcolor: "#5c3f85",
                                    },
                                },
                            }}
                        />
                    )}
                </DialogActions>
            </Dialog>

        </Box>
    );
}
