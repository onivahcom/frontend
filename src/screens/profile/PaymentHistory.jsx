import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Box,
    Typography,
    Card,
    CardContent,
    CircularProgress,
    Chip,
    Divider,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Avatar,
    useMediaQuery,
    Button,
    Paper,
    CardMedia,
    TextField,
    MenuItem,
    InputAdornment,
} from "@mui/material";
import { NavigateNext, Visibility } from "@mui/icons-material";
import { apiUrl, backendApi } from "../../Api/Api";
import { NavLink, useOutletContext } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import { LocalizationProvider, PickersDay } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from "@mui/x-date-pickers";
import { styled } from '@mui/material/styles';
import dayjs from "dayjs";
import { formatCategory } from "../../components/RemoveUnderscore";
import { CheckCircle, Cancel, AccessTime } from "@mui/icons-material"
import Close from "@mui/icons-material/Close";
import Search from "@mui/icons-material/Search";


// Custom styled day for highlighting
const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: "50%",
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
    },
}));


const PaymentHistory = () => {
    const { userData } = useOutletContext();
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // 🔍 filter + search states
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        if (!selectedPayment) return;

        // Push a new history state so that back button can be intercepted
        window.history.pushState({ dialogOpen: true }, "");

        const handlePopState = (e) => {
            if (selectedPayment) {
                setSelectedPayment(false); // close dialog
                window.history.pushState(null, ""); // restore state
            }
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            if (selectedPayment) window.history.back(); // clean up
        };
    }, [selectedPayment, setSelectedPayment]);


    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await backendApi.get(
                    `/get-bookings?userId=${userData?._id}`
                );
                setPayments(res.data || []);
            } catch (err) {
                console.error("Error fetching payments:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [userData?._id]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                <CircularProgress />
            </Box>
        );
    }

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

    // Convert package dates to Date objects
    const bookedDates = (selectedPayment?.package?.dates || []).map((d) =>
        dayjs(d)
    );
    // ✅ filtering + searching logic
    const filteredPayments = payments.filter((p) => {
        const matchesStatus =
            statusFilter === "all" || p.status === statusFilter;

        const matchesSearch =
            searchQuery === "" ||
            p.serviceId?.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p._id?.toString().toLowerCase().includes(searchQuery.toLowerCase());

        return matchesStatus && matchesSearch;
    });


    return (
        <Box maxWidth='md' mx='auto' sx={{ p: { xs: 0, md: 3 }, mt: 4, minHeight: "100vh" }}>
            <Typography variant="h6" fontWeight={500} gutterBottom>
                Payment History
            </Typography>

            <Box display="flex" sx={{ flexDirection: "row", justifyContent: "end", width: "100%", py: 2 }} gap={2} mb={2} >
                <TextField
                    size="small"
                    placeholder="Search by name or ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                />

                <TextField
                    select
                    size="small"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    label="Filter by status"
                    sx={{ minWidth: 160 }}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="captured">Captured</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                    <MenuItem value="authorized">Pending</MenuItem>
                </TextField>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {filteredPayments.length === 0 ? (
                <Typography color="text.secondary">No payments found.</Typography>
            ) : isMobile ? (
                // 👉 Mobile view → Cards
                filteredPayments.map((payment) => (
                    <Card
                        key={payment._id}
                        sx={{
                            mb: 2,
                            bgcolor: "#f8f8f8",
                            boxShadow: 0,
                            display: "flex",
                            p: 1,
                            alignItems: "flex-start",
                            position: "relative"
                        }}
                    >
                        {/* Cover Image */}
                        <CardMedia
                            component="img"
                            image={payment.serviceId?.coverImg || "/placeholder.png"}
                            alt={payment.serviceId?.businessName || "Service"}
                            sx={{
                                width: 100,
                                height: 100,
                                borderRadius: 2,
                                objectFit: "cover",
                                mr: 2,
                            }}
                        />

                        {/* Details */}
                        <CardContent
                            sx={{
                                flex: 1,
                                p: 0,
                                "&:last-child": { pb: 0 },
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                ₹{payment.amount} – {payment.package?.title || "No Package"}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}
                            >
                                {payment.category} • {payment.serviceId?.businessName || "N/A"}
                            </Typography>

                            <Typography variant="body2" color="text.secondary">
                                {new Date(payment.createdAt).toLocaleString()}
                            </Typography>

                            <Box
                                mt={1}
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{ position: "absolute", top: 0, right: 0 }}
                            >
                                {/* Status Icon */}
                                {payment.status === "captured" && (
                                    <CheckCircle sx={{ color: "green" }} />
                                )}
                                {payment.status === "failed" && <Cancel sx={{ color: "red" }} />}
                                {payment.status === "authorized" && (
                                    <AccessTime sx={{ color: "orange" }} />
                                )}
                            </Box>
                            <Button
                                endIcon={<NavigateNext />}
                                size="small"
                                variant="text"
                                onClick={() => setSelectedPayment(payment)}
                            >
                                View
                            </Button>
                        </CardContent>
                    </Card>

                ))
            ) : (
                // 👉 Desktop view → Table
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Service</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPayments.map((payment, idx) => (
                            <TableRow key={payment._id}>

                                <TableCell>{idx + 1}</TableCell>

                                {/* Service image + name */}
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <CardMedia
                                            component="img"
                                            image={payment.serviceId?.coverImg || "/placeholder.png"}
                                            alt={payment.serviceId?.businessName || "Service"}
                                            sx={{
                                                width: 50,
                                                height: 50,
                                                borderRadius: 1,
                                                objectFit: "cover",
                                            }}
                                        />
                                        <Typography variant="body2">
                                            {payment.serviceId?.businessName || "N/A"}
                                        </Typography>
                                    </Box>
                                </TableCell>

                                {/* Amount */}
                                <TableCell>₹{payment.amount}/-</TableCell>

                                {/* Category */}
                                <TableCell>{formatCategory(payment.category)}</TableCell>

                                {/* Status (with icon like mobile) */}
                                <TableCell>
                                    {payment.status === "captured" && (
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <CheckCircle sx={{ color: "green", fontSize: 20 }} />
                                            {/* <Typography variant="body2">Captured</Typography> */}
                                        </Box>
                                    )}
                                    {payment.status === "failed" && (
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <Cancel sx={{ color: "red", fontSize: 20 }} />
                                            {/* <Typography variant="body2">Failed</Typography> */}
                                        </Box>
                                    )}
                                    {payment.status === "authorized" && (
                                        <Box display="flex" alignItems="center" gap={0.5}>
                                            <AccessTime sx={{ color: "orange", fontSize: 20 }} />
                                            {/* <Typography variant="body2">Pending</Typography> */}
                                        </Box>
                                    )}
                                </TableCell>

                                {/* Date */}
                                <TableCell>
                                    {new Date(payment.createdAt).toLocaleString()}
                                </TableCell>

                                {/* Actions */}
                                <TableCell align="right">
                                    <Button
                                        endIcon={<NavigateNext />}
                                        size="small"
                                        variant="text"
                                        onClick={() => setSelectedPayment(payment)}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

            )}

            {/* 👉 Dialog for Details */}
            <Dialog
                open={!!selectedPayment}
                onClose={() => setSelectedPayment(null)}
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
                    Payment Details
                    <IconButton onClick={() => setSelectedPayment(null)} size="small">
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    {selectedPayment && (
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
                                            src={selectedPayment.hostId?.profilePic}
                                            alt="Host"
                                            sx={{ width: 64, height: 64 }}
                                        />
                                        <Box>
                                            <Typography fontWeight={600}>
                                                {selectedPayment.hostId?.firstName}{" "}
                                                {selectedPayment.hostId?.lastName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {selectedPayment.hostId?.city}
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
                                            src={selectedPayment.serviceId?.coverImg}
                                            alt={selectedPayment.serviceId?.businessName}
                                            sx={{ width: 72, height: 72, borderRadius: 2 }}
                                            variant="rounded"
                                        />
                                        <Box>
                                            <Typography fontWeight={500}>
                                                {selectedPayment.serviceId?.businessName || "N/A"}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Category: {formatCategory(selectedPayment.category)}
                                            </Typography>
                                            <NavLink style={{ fontSize: 12 }} to={`/?category=${selectedPayment.category}`}>View</NavLink>
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
                                            <Typography>{selectedPayment.package?.title}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography fontWeight={500} color='textSecondary' variant="caption">Amount</Typography>
                                            <Typography>₹{selectedPayment.package?.amount} /-</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography fontWeight={500} color='textSecondary' variant="caption">Description</Typography>
                                            <Typography variant="body2">
                                                {selectedPayment.package?.description}
                                            </Typography>
                                        </Grid>
                                        {selectedPayment.package?.additionalRequest && (
                                            <Grid item xs={12}>
                                                <Typography fontWeight={500} color='textSecondary' variant="caption">
                                                    Additional Request
                                                </Typography>
                                                <Typography>
                                                    {selectedPayment.package.additionalRequest}
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
                                                            const isBooked = bookedDates.some((d) =>
                                                                d.isSame(props.day, "day")
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
                                            <Typography color="success.main" fontWeight={500}>₹{selectedPayment.amount}</Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography fontWeight={500} color='textSecondary' component='div' variant="caption">Status</Typography>
                                            <StatusChip status={selectedPayment.status === "authorized" ? 'Pending' : selectedPayment.status === "captured" ? 'Captured' : 'Failed'} />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography fontWeight={500} color='textSecondary' variant="caption"> Order ID</Typography>
                                            <Typography variant="body2">
                                                {selectedPayment.razorpayOrderId}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography fontWeight={500} color='textSecondary' variant="caption">Payment ID</Typography>
                                            <Typography variant="body2">
                                                {selectedPayment.razorpayPaymentId}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
            </Dialog>



        </Box>
    );
};

export default PaymentHistory;
