import { useEffect, useState } from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import InitiateChat from "../components/chat/InitiateChat";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BottomActionBar = ({ userData, serviceDetails, activeConversation, handleScroll, handleConversationCreated }) => {
    const [showBar, setShowBar] = useState(false);


    // Show when user scrolls down
    useEffect(() => {
        let lastScroll = window.scrollY;

        const handleScroll = () => {
            const currentScroll = window.scrollY;

            if (currentScroll < lastScroll && currentScroll > 900) {
                // Scrolling up
                setShowBar(true);
            } else {
                // Scrolling down or near top
                setShowBar(false);
            }

            lastScroll = currentScroll;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    if (!showBar) return null;

    return (
        <Paper
            elevation={8}
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 1300,
                bgcolor: "#fff",
                borderTop: "1px solid #ddd",
                px: { xs: 2, sm: 4, md: 6 },
                py: { xs: 1.5, sm: 2 },
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 1.5,
                boxShadow: "0 -2px 10px rgba(0,0,0,0.04)",
            }}
        >
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 500,
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                    color: "#333",
                    flex: 1,
                    minWidth: 180,
                }}
            >
                Interested in this service?
            </Typography>

            <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                <Button
                    size="small"
                    onClick={handleScroll}
                    variant="text"
                    color="inherit"
                    sx={{
                        textTransform: "none",
                        fontWeight: 500,
                        borderRadius: 2,
                    }}
                >
                    Availability
                </Button>

                {!activeConversation && (
                    <InitiateChat
                        userId={userData?._id}
                        vendorId={serviceDetails.vendorId}
                        serviceId={serviceDetails._id}
                        serviceCategory={serviceDetails.category}
                        serviceName={serviceDetails.additionalFields.businessName}
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
            </Box>
        </Paper>


    );
};

export default BottomActionBar;
