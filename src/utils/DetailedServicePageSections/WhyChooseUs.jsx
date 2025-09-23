import React from 'react'
import { Box, Card, Grid, Typography } from '@mui/material';
import { Star, Business, Storefront, Event, LocalOffer, People } from "@mui/icons-material";

// Default icons list
const defaultIcons = [
    <Business key="business" sx={{ color: "primary.main" }} />,
    <Storefront key="store" sx={{ color: "primary.main" }} />,
    <Star key="star" sx={{ color: "primary.main" }} />,
    <Event key="event" sx={{ color: "primary.main" }} />,
    <LocalOffer key="offer" sx={{ color: "primary.main" }} />,
    <People key="people" sx={{ color: "primary.main" }} />,
];

const WhyChooseUs = ({ whyChooseUs }) => {
    return (

        <Grid item xs={12} md={6}>
            <Card
                sx={{
                    borderRadius: 4,
                    p: 3,
                    bgcolor: "background.paper",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
                }}
                elevation={0}
            >
                <Typography variant="h6" fontWeight={600} mb={3}>
                    Why Choose Us?
                </Typography>

                <Grid container spacing={2}>
                    {(() => {
                        let parsedWhyUs = [];

                        try {
                            // Handle if backend sends a string instead of array
                            parsedWhyUs = Array.isArray(whyChooseUs)
                                ? whyChooseUs
                                : JSON.parse(whyChooseUs || "[]");
                        } catch (e) {
                            console.error("Invalid whyChooseUs JSON:", e);
                        }

                        return parsedWhyUs.map((item, i) => (
                            <Grid item xs={12} sm={6} key={i} sx={{ display: "flex" }}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: 3,
                                        bgcolor: "grey.50",
                                        boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
                                        transition: "all 0.3s ease",
                                        "&:hover": { boxShadow: "0 4px 14px rgba(0,0,0,0.08)" },
                                        height: "100%", // ✅ Uniform height
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Typography variant="subtitle1" fontWeight={600} mb={1}>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.description}
                                    </Typography>
                                </Card>
                            </Grid>
                        ));
                    })()}
                </Grid>
            </Card>
        </Grid>


    )
}

export default WhyChooseUs