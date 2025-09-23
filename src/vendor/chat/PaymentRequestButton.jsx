import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    InputAdornment,
    Box,
    Divider,
    useTheme,
    useMediaQuery,
    Grid
} from '@mui/material';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import PaymentsIcon from '@mui/icons-material/Payments';
import { CreditCard, Lock, WarningAmberRounded } from '@mui/icons-material';
import axios from 'axios';
import { apiUrl, backendApi } from '../../Api/Api';

const PaymentRequestButton = ({ vendor, onPaymentRequest, customerId, conversationId }) => {
    const [open, setOpen] = useState(false);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [note, setNote] = useState('');
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


    const handleOpen = () => {
        setOpen(true);
        setAmount('');
        setError('');
    };

    const handleClose = () => {
        setOpen(false);
        setAmount('');
        setError('');
    };

    const handlePaymentRequest = async () => {
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue) || amountValue <= 0) {
            setError('Please enter a valid amount greater than ₹0');
            return;
        }

        try {
            const res = await backendApi.post(`/api/payments/create-link`, {
                amount: amountValue,
                note,
                vendorId: vendor._id,
                customerId: customerId,        // ✅ Include customerId
                conversationId // pass this in
            });

            const { paymentLink, paymentId } = res.data;

            console.log(paymentLink, amountValue, note, paymentId);

            // Send to parent handler (chat message trigger)
            onPaymentRequest({
                link: paymentLink,
                amount: amountValue,
                note,
                paymentId
            });

            handleClose();
        } catch (err) {
            console.error("Failed to generate payment link", err);
            setError("Unable to generate payment link. Try again.");
        }
    };



    return (
        <>
            <Button
                variant={isMobile ? "text" : "outlined"}
                startIcon={<CurrencyRupeeIcon />}
                onClick={handleOpen}
                sx={{ ml: 1 }}
            >
                {isMobile ? '' : 'Request'}
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        overflow: 'hidden',
                        boxShadow: 6,
                    },
                }}
            >
                {/* Header */}
                <Box
                    p={2.5}
                    display="flex"
                    alignItems="center"
                    gap={1.5}
                    borderBottom="1px solid #e0e0e0"
                    bgcolor="background.paper"
                >
                    <Typography variant="body5" fontWeight={600} color="text.secondary">
                        Request Payment
                    </Typography>
                </Box>


                {/* Dialog Content */}
                <DialogContent sx={{ p: 3, bgcolor: "#fafafa" }}>

                    <Grid container spacing={4}>
                        {/* Left Column: Form Section */}
                        <Grid item xs={12} md={6} mx="auto">
                            <Box >
                                {/* Secure Badge */}
                                <Box display="flex" alignItems="center" gap={1} mb={2}>
                                    <Lock fontSize="small" color="action" />
                                    <Typography variant="caption" color="text.secondary">
                                        Secure powered by Onivah
                                    </Typography>
                                </Box>

                                {/* Business Info */}
                                <Typography variant="subtitle2" mb={0.5}>
                                    From: {vendor?._id || "Business"}
                                </Typography>

                                <Typography variant="subtitle2" fontWeight={400} component='div' color="grey.700" mb={4}>
                                    Send a secure payment request. Enter the amount and (optionally) a note for the customer.
                                </Typography>

                                {/* Amount Input */}
                                <TextField
                                    label="Amount (INR)"
                                    type="number"
                                    fullWidth
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    error={!!error}
                                    helperText={error}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CurrencyRupeeIcon fontSize="small" />
                                            </InputAdornment>
                                        ),
                                        inputProps: { min: 0 },
                                    }}
                                    sx={{ mb: 2 }}
                                />

                                {/* Note Input */}
                                <TextField
                                    label="Add a note (optional)"
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    maxRows={4}
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="E.g. Consultation fee for July"
                                    sx={{ mb: 2 }}
                                />

                                {/* Expiry Message */}
                                <Box
                                    mt={2}
                                    p={1.5}
                                    bgcolor="#fffaec"
                                    border="1px solid #ffeeba"
                                    borderRadius={2}
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                >
                                    <WarningAmberRounded fontSize="small" color="warning" />
                                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                                        This payment link will automatically expire in <strong>24 hours</strong>.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Right Column: Summary */}
                        {/* {amount && !error && ( */}
                        <Grid item xs={12} md={6}>
                            <Box
                                p={3}
                                bgcolor="#f5efff"
                                border="1px solid #e0e0e0"
                                borderRadius={3}
                                boxShadow={0}
                            >
                                {/* Title */}
                                <Button
                                    startIcon={<CreditCard />}
                                    disableRipple
                                    disableElevation
                                    variant="text"
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: '1.25rem', // equivalent to h6
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        cursor: 'default',
                                        paddingLeft: 0,
                                        '&:hover': {
                                            backgroundColor: 'transparent'
                                        }
                                    }}
                                >
                                    Summary
                                </Button>

                                {/* Amount Row */}
                                <Box
                                    display="flex"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    mb={2}
                                >
                                    <Typography variant="body1" color="text.secondary">
                                        Amount to Pay
                                    </Typography>
                                    <Typography variant="h6" fontWeight={700} color="primary.main">
                                        ₹{parseFloat(amount).toFixed(2)}
                                    </Typography>
                                </Box>

                                {/* Optional Note */}
                                {note && (
                                    <>
                                        <Divider sx={{ mb: 2 }} />
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            fontWeight={500}
                                            gutterBottom
                                        >
                                            Note
                                        </Typography>
                                        <Typography variant="body2" color="text.primary" fontStyle="italic">
                                            {note}
                                        </Typography>
                                    </>
                                )}

                                {/* Expiry */}
                                <Divider sx={{ my: 2 }} />
                                <Box display="flex" alignItems="center" gap={1}>
                                    <WarningAmberRounded fontSize="small" color="warning" />
                                    <Typography variant="caption" color="text.secondary">
                                        Link will automatically expire in <strong>24 hours</strong>.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* )} */}
                    </Grid>

                </DialogContent>

                {/* Actions */}
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose} color="inherit">
                        Cancel
                    </Button>
                    <Button
                        onClick={handlePaymentRequest}
                        variant="contained"
                        disableElevation
                        color="primary"
                        sx={{ px: 3 }}
                    >
                        Send Request
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PaymentRequestButton;
