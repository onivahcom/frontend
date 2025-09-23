import React from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const NotAuthorized = () => {

    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 5 },
                    maxWidth: 420,
                    textAlign: "center",
                    borderRadius: 3,
                }}
            >
                {/* Icon */}
                <LockOutlinedIcon sx={{ color: "grey", fontSize: 50, mb: 2 }} />

                {/* Title */}
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Access Denied
                </Typography>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" mb={3}>
                    🚫 You don’t have permission to view this page.
                    Please contact your administrator if you think this is a mistake.
                </Typography>

                {/* Back Button */}
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate(-1)}
                    fullWidth
                    sx={{ borderRadius: 2 }}
                >
                    Go Back
                </Button>

            </Paper>
        </Box>
    );
};

export default NotAuthorized;
