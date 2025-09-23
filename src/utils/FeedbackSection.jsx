// FeedbackSection.jsx
import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Rating,
    Paper,
    Snackbar,
    Alert,
} from "@mui/material";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { apiUrl, backendApi } from "../Api/Api";

export default function FeedbackSection({ serviceId, category }) {

    const { user } = useUser();
    const [rating, setRating] = useState(0);
    const [feedbackText, setFeedbackText] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {

        if (!user?._id) {
            setError("Kindly Login to submit your feedback.");
            return;
        }
        if (rating === 0) {
            setError("Please select a star rating before submitting.");
            return;
        }

        if (feedbackText.trim() === "") {
            setError("Please fill the message before submitting.");
            return;
        }


        try {
            const response = await backendApi.post(`/submit/feedback`, {
                serviceId,          // must be ObjectId-compatible string
                category,
                userId: user?._id || "",             // make sure you pass the logged-in user's ID
                rating,
                feedback: feedbackText,
            });

            if (response.status === 200) {
                setSubmitted(true);
                setRating(0);
                setFeedbackText("");
            } else {
                setError(response.data?.message || "Failed to submit feedback");
            }
        } catch (err) {
            console.error("Error submitting feedback:", err);
            setError(err.response?.data?.message || "Network error");
        }
    };



    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                p: 4,
                // maxWidth: 600,
                width: "100%",
                bgcolor: "transparent"
            }}
        >
            <Typography variant="h6" fontWeight={600} mb={2}>
                Leave Feedback
            </Typography>

            <Typography variant="subtitle1" color="text.secondary" mb={3}>
                How was your experience? Rate us and help improve our service.
            </Typography>

            <Box display="flex" flexDirection="column" gap={2}>
                {/* Rating */}
                <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1" fontWeight={500}>
                        Your Rating:
                    </Typography>
                    <Rating />
                </Box>

                <TextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Leave your feedback here (optional)"
                    variant="outlined"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    sx={{ mb: 3 }}
                />


                {error && (
                    <Alert
                        severity="error"
                        onClose={() => setError("")}
                        sx={{ mt: 2, mb: 2 }}
                    >
                        {error}
                    </Alert>
                )}

                {submitted && (
                    <Alert
                        severity="success"
                        autoHideDuration={4000}
                        onClose={() => setSubmitted(false)}
                        sx={{ mt: 2, mb: 2 }}
                    >
                        Thank you for your feedback!
                    </Alert>
                )}


                <Button
                    variant="contained"
                    size="medium"
                    onClick={handleSubmit}
                    sx={{
                        display: "block",
                        borderRadius: 2,
                        textTransform: "none",
                        width: "fit-content",
                        placeSelf: "end",
                    }}
                >
                    Submit
                </Button>

                {/* <Snackbar
                open={!!error}
                autoHideDuration={4000}
                onClose={() => setError("")}
            >
                <Alert severity="error" sx={{ width: "100%" }}>
                    {error}
                </Alert>
            </Snackbar> */}
            </Box>
        </Paper>
    );
}
