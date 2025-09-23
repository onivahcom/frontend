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

const RecentlyViewed = () => {

    const [items, setItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecentlyViewed = async () => {
            try {
                const viewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

                if (!viewed.length || viewed.length < 3) return;

                // ✅ Fetch all details in parallel
                const promises = viewed.map(({ category, serviceId }) =>
                    backendApi.get(`/recently-viewed/${category}/${serviceId}`)
                );

                const responses = await Promise.all(promises);
                const data = responses.map((res) => res.data);

                setItems(data);
            } catch (error) {
                console.log("Error fetching recently viewed:", error);
            }
        };

        fetchRecentlyViewed();

    }, []);

    if (!items.length || items.length < 3) return null;

    return (

        <Box maxWidth='md' mx='auto' sx={{
            mt: { xs: 5, md: 15 },
            p: { xs: 1, md: 0 }
        }}>
            <Box mb={3} textAlign='center'>
                <Typography variant="h5" fontWeight={700} gutterBottom>
                    Recently Viewed
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    These are services you checked out recently. Don’t miss out—book your favorites before they’re gone!
                </Typography>
            </Box>


            <Splide
                options={{
                    perPage: 3,
                    gap: "1.5rem",
                    arrows: true,
                    pagination: false,
                    // autoWidth: items.length < 3, // only shrink to content if fewer items
                    // focus: items.length < 3 ? "center" : undefined, // center if fewer items than perPage
                    breakpoints: {
                        5000: { perPage: 4 },
                        1280: { perPage: 4 },
                        1024: { perPage: 3 },
                        768: { perPage: 2 },
                        480: { perPage: 2 },
                    },
                }}
                style={{
                    display: "flex",
                    justifyContent:
                        items.length < 3 ? "center" : "flex-start", // center items if fewer than perPage
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
                                position: "relative", // needed for absolute positioning of chip
                                boxShadow: 0,
                            }}
                        >
                            {/* Card Media / Image */}
                            <CardMedia
                                component="img"
                                height="180"
                                width='200'
                                image={item.coverImage[0] || "/placeholder.jpg"}
                                alt={item.category}
                                sx={{ objectFit: "cover", borderRadius: 3 }}
                            />

                            {/* Category Chip */}
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

                            {/* Card Content */}
                            <CardContent sx={{ px: 1, py: 1.5 }}>
                                <Typography variant='caption' textAlign="left" sx={{
                                    color: "#333",
                                    fontWeight: 600,
                                    mb: 1,
                                    display: "-webkit-box",
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                }}>
                                    {item.businessName}
                                </Typography>

                                {/* Locations Chip Scroll */}
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

    );
};

export default RecentlyViewed;
