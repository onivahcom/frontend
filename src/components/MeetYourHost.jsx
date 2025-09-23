import React from "react";
import { Box, Grid, Avatar, Typography, Button, IconButton, Card, Chip } from "@mui/material";
import { Facebook, Instagram, LinkedIn, Chat } from "@mui/icons-material";
import InitiateChat from "./chat/InitiateChat";
import VerifiedUser from "@mui/icons-material/VerifiedUser";

export default function MeetYourHost() {
    const dummyHost = {
        name: "Rishikesh Sharma",
        role: "Wedding Planner & Designer",
        bio: "Passionate about creating unforgettable weddings. I ensure every detail is perfect and personalized for each couple.",
        photo: "https://randomuser.me/api/portraits/women/24.jpg",
        socials: {
            fb: "https://facebook.com",
            insta: "https://instagram.com",
            linkedin: "https://linkedin.com",
        },
    };

    const handleMessage = () => {
        alert(`Messaging ${dummyHost.name}... (dummy action)`);
    };

    return (
        <>
            {/* 🔹 Row 8: Meet Your Host */}
            <Grid container spacing={2}>
                {/* Host Profile */}
                <Grid item xs={12} md={4}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            p: 3,
                            textAlign: "center",
                            bgcolor: "grey.50",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
                        }}
                        elevation={0}
                    >
                        <Box position="relative" display="inline-block" mb={2}>
                            <Avatar
                                src="https://cdn.pixabay.com/photo/2016/03/23/18/35/avatar-1277519_1280.png"
                                sx={{ width: 80, height: 80 }}
                            />
                            <VerifiedUser
                                color="success"
                                sx={{
                                    position: "absolute",
                                    bottom: 0,
                                    right: 0,
                                    bgcolor: "background.paper",
                                    borderRadius: "50%",
                                    border: "2px solid white",
                                    fontSize: 20,
                                }}
                            />
                        </Box>
                        <Typography variant="subtitle1" fontWeight={600}>
                            Host Name
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Verified Host
                        </Typography>
                    </Card>
                </Grid>

                {/* Host Bio */}
                <Grid item xs={12} md={8}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            p: 3,
                            bgcolor: "background.paper",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.03)",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                        elevation={0}
                    >
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            About the Host
                        </Typography>
                        <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                            This is a short bio of the host. Highlight their expertise, experience,
                            and what makes them special. You can also include a few guest reviews
                            about their service here for credibility.
                        </Typography>
                        <Box mt={2} display="flex" flexWrap="wrap" gap={1}>
                            {["Friendly", "Professional", "Experienced", "Verified"].map((tag, i) => (
                                <Chip key={i} label={tag} size="small" sx={{ borderRadius: 2 }} />
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}
