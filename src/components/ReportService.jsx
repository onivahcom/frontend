import { useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Typography,
    Box,
    Alert,
} from "@mui/material";
import FlagIcon from "@mui/icons-material/Flag";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import axios from "axios";
import { Report } from "@mui/icons-material";
import { apiUrl, backendApi } from "../Api/Api";

export default function ReportDialog({ vendorId, serviceId, categoryName, userData }) {

    const [open, setOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const defaultReasons = [
        { label: "Inaccurate Information", icon: <ReportProblemIcon color="warning" /> },
        { label: "Spam/Irrelevant", icon: <ErrorOutlineIcon color="error" /> },
        { label: "Fake Vendor", icon: <WarningAmberIcon color="error" /> },
        { label: "Other", icon: <FlagIcon color="action" /> },
    ];

    const handleSubmit = async () => {
        const reason = selectedReason === "Other" ? customReason : selectedReason;
        if (!reason) {
            setError("Please select or enter a reason.");
            return;
        }
        setError("");

        try {
            await backendApi.post(`/report-service`, {
                userId: userData?._id,        // 👈 pass logged-in userId
                vendorId,
                serviceId,
                categoryName,
                reason,
            });
            setSuccess(true);
            setTimeout(() => {
                setOpen(false);
                setSelectedReason("");
                setCustomReason("");
                setSuccess(false);
            }, 2000);
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Button
                startIcon={<Report />}
                variant="text"
                color="inherit"
                size="small"
                onClick={() => setOpen(true)}
            >
                Report This Service
            </Button>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: { borderRadius: "16px", p: 1 },
                }}
            >
                <DialogTitle sx={{ fontWeight: "bold", fontSize: "1.3rem" }}>
                    Report This Service
                </DialogTitle>

                <DialogContent dividers>
                    <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                        Help us keep the platform safe by letting us know what’s wrong with
                        this listing.
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Report submitted successfully ✅
                        </Alert>
                    )}

                    <RadioGroup
                        value={selectedReason}
                        onChange={(e) => {
                            setSelectedReason(e.target.value);
                            if (error && selectedReason !== "Other") {
                                setError("");
                            }
                        }}
                    >
                        {defaultReasons.map((r, i) => (
                            <Box
                                key={i}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    mb: 1,
                                    p: 1,
                                    borderRadius: "8px",
                                    "&:hover": { bgcolor: "grey.100" },
                                }}
                            >
                                <FormControlLabel
                                    value={r.label}
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography>{r.label}</Typography>
                                        </Box>
                                    }
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                        ))}
                    </RadioGroup>

                    {selectedReason === "Other" && (
                        <TextField
                            margin="dense"
                            label="Enter reason"
                            fullWidth
                            value={customReason}
                            onChange={(e) => setCustomReason(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                    )}


                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        sx={{ px: 3, borderRadius: "8px", bgcolor: "black", color: "white" }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
