import React, { useEffect, useState } from "react";
import axios from "axios";
import { useOutletContext } from "react-router-dom";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Stack,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    useMediaQuery,
    Divider,
    Grid,
    IconButton,
    FormControlLabel,
    Checkbox,
    Tooltip,

} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { DateCalendar, LocalizationProvider, PickersDay, StaticDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from "dayjs";
import Close from "@mui/icons-material/Close";
import { styled } from '@mui/material/styles';
import { AccessTime, Cancel, CancelScheduleSend, CheckCircle, NavigateNext } from "@mui/icons-material";
import { backendApi } from "../Api/Api";
import RejectBookingDialog from "../vendorUtils/RejectBookingDialog";

// Custom styled day for highlighting
const HighlightedDay = styled(PickersDay)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: "50%",
    "&:hover": {
        backgroundColor: theme.palette.primary.dark,
    },
}));

export default function OrdersPage() {

    const { vendor } = useOutletContext();


    const [bookings, setBookings] = useState([]);
    const [tab, setTab] = useState(0);

    const [open, setOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [autoBook, setAutoBook] = useState(true); // auto-selected by default
    const [loading, setLoading] = useState(false);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // xs and sm

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);



    useEffect(() => {
        if (!selectedBooking) return;

        // Push a new history state so that back button can be intercepted
        window.history.pushState({ dialogOpen: true }, "");

        const handlePopState = (e) => {
            if (selectedBooking) {
                setSelectedBooking(false); // close dialog
                window.history.pushState(null, ""); // restore state
            }
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
            if (selectedBooking) window.history.back(); // clean up
        };
    }, [selectedBooking, setSelectedBooking]);


    useEffect(() => {
        if (vendor?._id) {
            backendApi
                .get(`/api/payments/get-bookings?vendorId=${vendor._id}`)
                .then((res) => setBookings(res.data))
                .catch((err) => console.log(err));
        }
    }, [vendor]);

    const approveBooking = async (id) => {

        try {
            setLoading(true);
            const payload = {
                autoBook,
                selectedBookings: autoBook ? selectedBooking : [],
            };
            await backendApi.post(
                `/api/payments/booking/${id}/approve`,
                payload
            );
            alert("Booking approved & payment captured!");
            setBookings((prev) =>
                prev.map((b) =>
                    b._id === id ? { ...b, status: "captured" } : b
                )
            );
        } catch (error) {
            alert("Failed to approve booking!");
        }
        finally {
            setLoading(false); // stop animation
        }
    };

    const handleRejectClick = (id) => {
        setSelectedBookingId(id);
        setDialogOpen(true);
    };

    const handleConfirmReject = async (reason) => {
        if (!selectedBookingId) return;

        await backendApi.post(
            `/api/payments/booking/${selectedBookingId}/reject`,
            {
                reason,
                rejectedById: selectedBooking.hostId,
                rejectedByModel: "vendor"
            }
        );
        setBookings((prev) =>
            prev.map((b) => (b._id === selectedBookingId ? { ...b, status: "rejected", rejectReason: reason } : b))
        );

        setDialogOpen(false);
    };


    // const rejectBooking = async (id) => {
    //     await backendApi.post(`/api/payments/booking/${id}/reject`);
    //     alert("Booking rejected");
    //     setBookings((prev) => prev.map((b) => (b._id === id ? { ...b, status: "rejected" } : b)));
    // };

    // Group bookings by status
    const categorized = {
        authorized: bookings.filter((b) => b.status === "authorized"),
        captured: bookings.filter((b) => b.status === "captured"),
        rejected: bookings.filter((b) => b.status === "rejected"),
    };

    // Open dialog with details
    const handleOpen = (booking) => {
        setSelectedBooking(booking);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedBooking(null);
    };

    const handleChange = (event) => {
        setAutoBook(event.target.checked);
    };

    const formatAmount = (amount) =>
        new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(amount);


    const renderTable = (list, actions = true) => {
        if (isMobile) {
            return (
                <Grid container spacing={2}>
                    {list.map((b) => (
                        <Grid item xs={12} key={b._id}>
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    boxShadow: 0,
                                    bgcolor: "#f8f8f8",
                                    border: "1px solid #ddd",
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                {/* Top Row: User + Status */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar
                                            src={b.userId?.profilePic}
                                            alt={b.userId?.firstname}
                                            sx={{ width: 40, height: 40 }}
                                        />
                                        <Box>
                                            <Typography variant="body1" fontWeight={500}>
                                                {(b.userId?.firstname || "Unknown").slice(0, 12)}
                                                {b.userId?.firstname?.length > 12 && "..."}{" "}
                                                {b.userId?.lastname || ""}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                Order: {b.razorpayOrderId.slice(-6).toUpperCase()}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Chip
                                        label={
                                            b.status === "authorized"
                                                ? "Pending"
                                                : b.status === "captured"
                                                    ? "Approved"
                                                    : "Declined"
                                        }
                                        color={
                                            b.status === "captured"
                                                ? "success"
                                                : b.status === "rejected"
                                                    ? "error"
                                                    : "warning"
                                        }
                                        size="small"
                                        variant="outlined"
                                    />
                                </Stack>

                                {/* Middle Row: Amount + Date */}
                                <Stack spacing={1} sx={{ p: 2, borderRadius: 2, boxShadow: 0, bgcolor: 'background.paper' }}>
                                    {/* Amount Row */}
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Amount
                                        </Typography>
                                        <Typography variant="h6" fontWeight={600} color="primary">
                                            {formatAmount(b.amount)}
                                        </Typography>
                                    </Stack>

                                    {/* Divider */}
                                    <Divider sx={{ my: 0.5 }} />

                                    {/* Date Row */}
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Date
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(b.createdAt).toLocaleString()}
                                        </Typography>
                                    </Stack>
                                </Stack>

                                {/* Action Button */}
                                <Box display="flex" justifyContent="flex-end">
                                    <Button
                                        endIcon={<NavigateNext />}
                                        size="small"
                                        variant="text"
                                        onClick={() => handleOpen(b)}
                                    >
                                        View
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            );
        }


        // Desktop view - Table
        return (
            <TableContainer
                component={Paper}
                elevation={0}
                sx={{ borderRadius: 2, boxShadow: 0, maxWidth: 900, mx: "auto" }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: "grey.100" }}>
                            <TableCell>User</TableCell>
                            <TableCell>Order ID</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {list.map((b, i) => (
                            <TableRow key={b._id} sx={{ bgcolor: i % 2 === 0 ? "white" : "grey.50" }}>
                                <TableCell>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar src={b.userId?.profilePic} alt={b.userId?.firstname} />
                                        <Typography variant="body2">
                                            {b.userId?.firstname || "Unknown"}
                                        </Typography>
                                    </Stack>
                                </TableCell>

                                <TableCell>{b.razorpayOrderId.slice(-6).toUpperCase()}</TableCell>
                                <TableCell>{formatAmount(b.amount)}</TableCell>
                                <TableCell>{new Date(b.createdAt).toLocaleString()}</TableCell>
                                <TableCell>
                                    {b.status === "captured" && (
                                        <Tooltip title="Booking confirmed " arrow>
                                            <Box display="flex" alignItems="center" gap={0.5} sx={{ cursor: "pointer" }}>
                                                <CheckCircle sx={{ color: "green", fontSize: 20 }} />
                                            </Box>
                                        </Tooltip>
                                    )}
                                    {b.status === "failed" && (
                                        <Tooltip title="Failed" arrow>
                                            <Box display="flex" alignItems="center" gap={0.5} sx={{ cursor: "pointer" }}>
                                                <Cancel sx={{ color: "red", fontSize: 20 }} />
                                            </Box>
                                        </Tooltip>
                                    )}
                                    {b.status === "rejected" && (
                                        <Tooltip title="Rejected" arrow>
                                            <Box display="flex" alignItems="center" gap={0.5} sx={{ cursor: "pointer" }}>
                                                <CancelScheduleSend sx={{ color: "red", fontSize: 20 }} />
                                            </Box>
                                        </Tooltip>
                                    )}
                                    {b.status === "authorized" && (
                                        <Tooltip title="Pending" arrow>
                                            <Box display="flex" alignItems="center" gap={0.5} sx={{ cursor: "pointer" }}>
                                                <AccessTime sx={{ color: "orange", fontSize: 20 }} />
                                            </Box>
                                        </Tooltip>
                                    )}
                                </TableCell>

                                <TableCell align="right">
                                    <Button endIcon={<NavigateNext />} size="small" variant="text" onClick={() => handleOpen(b)}>
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    const bookedDates = (selectedBooking?.package?.dates || []).map((d) =>
        dayjs(d)
    );
    return (
        <Box maxWidth='md' mx='auto' sx={{ p: { xs: 1, md: 3 }, mt: 4, minHeight: "100vh" }}>

            {loading && (
                <Box
                    sx={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999,
                    }}
                >
                    <iframe src="https://lottie.host/embed/d1dc8cb1-c563-4c8f-9d11-ba947a531218/rW3rmc9Bqs.lottie" style={{ boxShadow: 0, border: "none" }}></iframe>
                </Box>
            )}


            <Typography variant="h6" gutterBottom fontWeight="bold">
                Manage Orders
            </Typography>

            {/* Tabs for categories */}
            <Tabs value={tab}
                onChange={(e, newVal) => setTab(newVal)}
                sx={{ mb: 6 }}
                variant="scrollable"          // ✅ make tabs scrollable
                scrollButtons="auto"          // ✅ show buttons only when needed
                allowScrollButtonsMobile
            >
                <Tab label={`Pending (${categorized.authorized.length})`} />
                <Tab label={`Approved (${categorized.captured.length})`} />
                <Tab label={`Declined (${categorized.rejected.length})`} />
            </Tabs>

            {/* Render categories */}
            {tab === 0 && renderTable(categorized.authorized, true)}
            {tab === 1 && renderTable(categorized.captured, false)}
            {tab === 2 && renderTable(categorized.rejected, false)}

            {/* Order Details Dialog */}
            {selectedBooking && (
                <Dialog
                    open={!!selectedBooking}
                    onClose={handleClose}
                    fullScreen
                    fullWidth
                    maxWidth='lg'
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            p: 1,
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                        },
                    }}
                >
                    {/* Header */}
                    <DialogTitle
                        sx={{
                            borderBottom: "1px solid #e0e0e0",
                            display: "flex",
                            alignItems: "center",
                            mb: 4,
                            justifyContent: "space-between",
                            px: { xs: 2, sm: 3 }, // padding horizontal
                            py: { xs: 1, sm: 2 }, // padding vertical
                            bgcolor: "background.paper", // subtle background
                        }}
                    >
                        <Typography
                            // variant="h6"
                            fontWeight={600}
                            sx={{
                                fontSize: { xs: "1rem", sm: "1.25rem" }, // responsive font
                                color: "text.primary",
                            }}
                        >
                            #{selectedBooking.razorpayOrderId} {/* short ID for clarity */}
                        </Typography>

                        <IconButton
                            onClick={handleClose}
                            color="inherit"
                            sx={{
                                bgcolor: "grey.100",
                                "&:hover": { bgcolor: "grey.200" },
                                width: 36,
                                height: 36,
                            }}
                        >
                            <Close fontSize="small" />
                        </IconButton>
                    </DialogTitle>


                    {/* Content */}
                    <DialogContent
                        sx={{
                            flex: 1,
                            px: { xs: 1, sm: 3 },
                            py: 2,
                        }}
                    >
                        <Grid container spacing={3} sx={{ height: "100%" }}>
                            {/* Left Column: Booking Info */}
                            <Grid item xs={12} md={5} sx={{ height: { xs: 'auto', md: '100%' } }}>
                                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, display: "flex", flexDirection: "column", gap: 2, height: "100%", border: '1px solid #dddd' }}>
                                    {/* Booking ID & Status */}
                                    <Stack
                                        direction={isMobile ? 'column' : 'row'}
                                        justifyContent={isMobile ? 'flex-start' : 'space-between'}
                                        alignItems={isMobile ? 'flex-start' : 'center'}
                                        spacing={isMobile ? 1 : 0} // optional spacing for mobile vertical stack
                                    >
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Payment Id</Typography>
                                            <Typography variant="body1" fontWeight={500}>{selectedBooking.razorpayPaymentId}</Typography>
                                        </Box>

                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Status</Typography>

                                            <Chip
                                                label={
                                                    selectedBooking.status === "authorized"
                                                        ? "Pending"
                                                        : selectedBooking.status === "captured"
                                                            ? "Approved"
                                                            : "Declined"
                                                }
                                                color={
                                                    selectedBooking.status === "captured"
                                                        ? "success"
                                                        : selectedBooking.status === "rejected"
                                                            ? "error"
                                                            : "warning"
                                                }
                                                size="small"
                                                variant="filled"
                                            />
                                        </Box>
                                    </Stack>

                                    {/* Amount */}
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Amount</Typography>
                                        <Typography variant="h6" fontWeight={600} color="success.main">
                                            {formatAmount(selectedBooking.amount)}
                                        </Typography>
                                    </Box>

                                    {/* User Info */}
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary">Booked By</Typography>
                                        <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                                            <Avatar
                                                src={selectedBooking.userId?.profilePic}
                                                alt={selectedBooking.userId?.firstname}
                                                sx={{ width: 48, height: 48 }}
                                            />
                                            <Box>
                                                <Typography variant="body1">
                                                    {selectedBooking.userId?.firstname} {selectedBooking.userId?.lastname}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {selectedBooking.userId?.city || "Unknown City"}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Paper>
                            </Grid>

                            {/* Right Column: Package + Calendar */}
                            <Grid
                                item
                                xs={12}
                                md={7}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                    height: { xs: "auto", md: "100%" }, // adjust based on DialogTitle height
                                    overflowY: "auto", // scrollbar only appears when content overflows
                                }}
                            >
                                {/* Package Card */}
                                <Paper elevation={0} sx={{ p: 3, borderRadius: 2, border: '1px solid #dddd' }}>
                                    <Typography variant="subtitle2" color="text.secondary">Package</Typography>
                                    <Typography variant="body1" mb={2}>{selectedBooking.package?.title || "N/A"}</Typography>

                                    {selectedBooking.package?.description && (
                                        <>
                                            <Typography variant="subtitle2" color="text.secondary">Description</Typography>
                                            <Typography variant="body2" mb={2}>{selectedBooking.package.description}</Typography>
                                        </>
                                    )}

                                    {selectedBooking.package?.additionalRequest && (
                                        <>
                                            <Typography variant="subtitle2" color="text.secondary">Additional Request</Typography>
                                            <Typography variant="body2">{selectedBooking.package.additionalRequest}</Typography>
                                        </>
                                    )}
                                </Paper>

                                <FormControlLabel
                                    sx={{ display: tab === 0 ? 'block' : "none" }}
                                    control={
                                        <Checkbox
                                            size="small"
                                            checked={autoBook}
                                            onChange={handleChange}
                                            color="primary"
                                        />
                                    }
                                    label={
                                        <Typography variant="caption" color="textSecondary">
                                            Enable this to automatically mark selected dates as{" "}
                                            <Box component="span" sx={{ color: "red", fontWeight: 500 }}>
                                                booked
                                            </Box>{" "} for your service.
                                        </Typography>

                                    }
                                />

                                {/* Calendar Card */}
                                {bookedDates.length > 0 && (
                                    <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, border: '1px solid #dddd' }} elevation={0}>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            Booked Dates ({bookedDates.length})
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
                                    </Paper>
                                )}


                            </Grid>
                        </Grid>


                    </DialogContent>

                    {/* Actions fixed at bottom */}
                    <DialogActions
                        sx={{
                            borderTop: "1px solid #e0e0e0",
                            px: { xs: 2, sm: 3 },
                            justifyContent: "space-between",
                            flexShrink: 0,
                        }}
                    >
                        <Button onClick={handleClose} color="inherit">Close</Button>
                        <Stack direction="row" spacing={1} sx={{ display: selectedBooking.status === 'authorized' ? 'block' : "none" }}>
                            <Button color="error" variant="outlined" onClick={() => handleRejectClick(selectedBooking._id)}>
                                Reject
                            </Button>
                            <Button color="primary" variant="contained" onClick={() => approveBooking(selectedBooking._id)}>
                                Approve
                            </Button>
                        </Stack>
                    </DialogActions>


                </Dialog>

            )
            }

            <RejectBookingDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onConfirm={handleConfirmReject}
            />

        </Box >
    );
}
