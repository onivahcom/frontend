import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Divider,
    Typography,
    Stack,

} from "@mui/material";

const options = [
    "Not available",
    "Pricing issue",
    "Date already booked",
    "Incomplete details",
    "Other",
];


const RejectBookingDialog = ({ open, onClose, onConfirm }) => {

    const [reason, setReason] = useState("");
    const [selectedOption, setSelectedOption] = useState("Not available");

    const handleConfirm = () => {
        const finalReason = selectedOption === "Other" ? reason : selectedOption;
        onConfirm(finalReason);
        setReason("");
        setSelectedOption("Not available");
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: 600, fontSize: "1.2rem" }}>
                Reject Booking
            </DialogTitle>

            <Divider />

            <DialogContent>
                <Typography variant="body2" color="text.secondary" mb={1}>
                    Please select a reason for rejecting this booking:
                </Typography>

                <RadioGroup
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                >
                    <Stack spacing={1}>
                        {options.map((opt) => (
                            <FormControlLabel
                                key={opt}
                                value={opt}
                                control={<Radio />}
                                label={opt}
                            />
                        ))}
                    </Stack>
                </RadioGroup>

                {selectedOption === "Other" && (
                    <TextField
                        label="Custom reason"
                        placeholder="Type your reason here..."
                        fullWidth
                        margin="normal"
                        value={reason}
                        onChange={(e) => setReason(e.target.value.slice(0, 300))}
                        helperText={`${reason.length}/300`}
                        multiline
                        minRows={2}
                    />
                )}
            </DialogContent>

            <Divider />

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} color="inherit" variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color="error"
                    disabled={selectedOption === "Other" && reason.trim() === ""}
                >
                    Reject
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RejectBookingDialog;
