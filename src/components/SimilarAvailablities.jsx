import React, { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    Box,
    Chip,
} from "@mui/material";
import { backendApi } from "../Api/Api";
import LocationOn from "@mui/icons-material/LocationOn";
import { formatCategory } from "./RemoveUnderscore";
import { useNavigate } from "react-router-dom";

const SimilarAvailablities = () => {

    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPreferredDates = async () => {
            try {
                const preferences = JSON.parse(localStorage.getItem("customerChoice")) || {};
                const dates = preferences.datesChoosed || [];

                if (!Array.isArray(dates) || dates.length < 1) return;

                // ✅ Send the entire dates array to backend
                const res = await backendApi.post("/similar-availables/preferred-dates", { dates });

                setItems(res.data); // assuming backend responds with relevant items
            } catch (error) {
                console.log("Error fetching preferred dates:", error);
            }
        };

        fetchPreferredDates();
    }, []);


    if (!items.length || items.length < 1) return null;

    return (

        <Box
            maxWidth="md"
            mx="auto"
            sx={{
                mt: { xs: 5, md: 15 },
                p: { xs: 1, md: 0 },
            }}
        >
            <Box mb={3} textAlign="center">
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Available on similar dates
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Looking for options? Here are services ready on similar dates.
                </Typography>
            </Box>

            {/* ✅ Mobile (xs) - Splide Carousel */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Splide
                    options={{
                        perPage: 2,
                        gap: "1rem",
                        arrows: true,
                        pagination: false,
                        breakpoints: {
                            768: { perPage: 2 },
                            480: { perPage: 2 },
                        },
                    }}
                >
                    {items.map((item, index) => (
                        <SplideSlide key={index}>
                            <Card
                                onClick={() => navigate(`/category/${item.category}/${item._id}`)}
                                sx={{
                                    cursor: "pointer",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    position: "relative",
                                    boxShadow: 0,
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="180"
                                    image={item.coverImage || "/placeholder.jpg"}
                                    alt={item.category}
                                    sx={{ objectFit: "cover", borderRadius: 3 }}
                                />

                                <Chip
                                    label={formatCategory(item.category)}
                                    size="small"
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        right: 0,
                                        bgcolor: "black",
                                        color: "white",
                                        fontWeight: 600,
                                    }}
                                />

                                <CardContent sx={{ px: 1, py: 1.5 }}>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: "#333",
                                            fontWeight: 600,
                                            mb: 1,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {item.businessName}
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            overflowX: "auto",
                                            gap: 1,
                                            mt: 1,
                                            "&::-webkit-scrollbar": {
                                                display: "none",
                                            },
                                            scrollbarWidth: "none",
                                            scrollBehavior: "smooth",
                                        }}
                                    >
                                        {(item.availableLocations || []).map((location, i) => (
                                            <Chip
                                                icon={<LocationOn />}
                                                key={i}
                                                label={location}
                                                size="small"
                                                sx={{
                                                    backgroundColor: "#f0f0f0",
                                                    color: "#333",
                                                    fontSize: "0.65rem",
                                                    flexShrink: 0,
                                                    "& .MuiChip-icon": {
                                                        fontSize: "0.8rem", // smaller than default
                                                        marginLeft: "2px",  // optional: tighten spacing
                                                        marginRight: "4px",
                                                    },
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </CardContent>
                            </Card>
                        </SplideSlide>
                    ))}
                </Splide>
            </Box>

            {/* ✅ Desktop (md+) - Grid */}
            <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "repeat(4, 1fr)", gap: 2 }}>
                {items.map((item, index) => (
                    <Card
                        key={index}
                        onClick={() => navigate(`/category/${item.category}/${item._id}`)}
                        sx={{
                            cursor: "pointer",
                            borderRadius: 2,
                            overflow: "hidden",
                            position: "relative",
                            boxShadow: 0,
                        }}
                    >
                        <CardMedia
                            component="img"
                            height="180"
                            image={item.coverImage || "/placeholder.jpg"}
                            alt={item.category}
                            sx={{ objectFit: "cover", borderRadius: 3 }}
                        />

                        <Chip
                            label={formatCategory(item.category)}
                            size="small"
                            sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                bgcolor: "black",
                                color: "white",
                                fontWeight: 600,
                            }}
                        />

                        <CardContent sx={{ px: 1, py: 1.5 }}>
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "#333",
                                    fontWeight: 600,
                                    mb: 1,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {item.businessName}
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    overflowX: "auto",
                                    gap: 1,
                                    mt: 1,
                                    "&::-webkit-scrollbar": {
                                        display: "none",
                                    },
                                    scrollbarWidth: "none",
                                    scrollBehavior: "smooth",
                                }}
                            >
                                {(item.availableLocations || []).map((location, i) => (
                                    <Chip
                                        icon={<LocationOn />}
                                        key={i}
                                        label={location}
                                        size="small"
                                        sx={{
                                            backgroundColor: "#f0f0f0",
                                            color: "#333",
                                            fontSize: "0.65rem",
                                            flexShrink: 0,
                                            "& .MuiChip-icon": {
                                                fontSize: "0.8rem", // smaller than default
                                                marginLeft: "2px",  // optional: tighten spacing
                                                marginRight: "4px",
                                            },
                                        }}
                                    />
                                ))}
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </Box>


    );
};

export default SimilarAvailablities;
