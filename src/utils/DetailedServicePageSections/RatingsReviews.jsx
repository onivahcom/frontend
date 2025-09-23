import { Avatar, Box, Card, Grid, LinearProgress, Rating, Typography } from '@mui/material';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import React from 'react'

const RatingsReviews = ({ feedback }) => {
    return (
        <Grid item xs={12}>
            <Card
                sx={{
                    borderRadius: 4,
                    p: 3,
                    bgcolor: "background.paper",
                    boxShadow: "0 2px 16px rgba(0,0,0,0.03)",
                }}
                elevation={0}
            >
                <Typography variant="h6" fontWeight={600} mb={3}>
                    Ratings & Reviews
                </Typography>

                {/* Rating Summary */}
                <Grid item xs={12} sm={6} mx='auto'>
                    <Box sx={{ p: 2, borderRadius: 2, border: "1px solid #dddd" }}>

                        <Grid container spacing={2} alignItems="center" sx={{ p: 4 }}>
                            {/* LEFT: Average Rating */}
                            <Grid item xs={12} md={4}>
                                <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 'bold', fontSize: '3rem', lineHeight: 1 }}
                                    >
                                        4.5
                                        <Typography color='textSecondary' variant="span" sx={{ fontSize: '1rem', fontWeight: 500, lineHeight: 1 }}>/5</Typography>

                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        (50 New Reviews)
                                    </Typography>
                                </Box>
                            </Grid>

                            {/* RIGHT: Star Distribution */}
                            <Grid item xs={12} md={8}>
                                {[5, 4, 3, 2, 1].map((star) => {
                                    const count = {
                                        5: 30,
                                        4: 12,
                                        3: 5,
                                        2: 2,
                                        1: 1,
                                    }[star];
                                    const total = 50;
                                    const percentage = (count / total) * 100;

                                    return (
                                        <Box
                                            key={star}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                mb: 1,
                                            }}
                                        >
                                            {/* Star Number */}
                                            <Box sx={{ minWidth: 30 }}>
                                                <Typography variant="body2" fontWeight={500}>
                                                    {star} ★
                                                </Typography>
                                            </Box>

                                            {/* Progress Bar */}
                                            <Box sx={{ flex: 1, mx: 2 }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={percentage}
                                                    sx={{
                                                        height: 10,
                                                        borderRadius: 5,
                                                        backgroundColor: "#e0e0e0",
                                                        "& .MuiLinearProgress-bar": {
                                                            backgroundColor: "#fbc02d",
                                                        },
                                                    }}
                                                />
                                            </Box>

                                            {/* Count */}
                                            <Box sx={{ minWidth: 30 }}>
                                                <Typography variant="body2" color="text.secondary">
                                                    {count}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                {/* Review Carousel */}

                <Grid item xs={12}>
                    {feedback.length > 0 ?
                        <Splide
                            options={{
                                type: "loop", // ✅ use loop or slide (not fade)
                                perPage: 1,   // default for mobile
                                gap: "1rem",
                                arrows: false,
                                autoplay: false,
                                pagination: true,
                                breakpoints: {
                                    600: { perPage: 1 }, // small screens (xs)
                                    960: { perPage: 2 }, // medium screens (sm/md)
                                    1280: { perPage: 3 }, // large screens (lg+)
                                },
                            }}
                            aria-label="User Reviews"
                        >
                            {feedback.map((review, index) => (
                                <SplideSlide key={review._id}>
                                    <Box
                                        key={index}
                                        sx={{
                                            display: "flex",
                                            flexDirection: { xs: "column", sm: "row" },
                                            alignItems: { xs: "flex-start", sm: "center" },
                                            gap: 2,
                                            p: 3,
                                            bgcolor: "#ffff",
                                            borderRadius: 3,
                                            boxShadow: 0,
                                            transition: "transform 0.3s",
                                        }}
                                    >
                                        <Avatar
                                            src={review.userId.profilePic}
                                            alt={review.userId.firstname}
                                            sx={{ width: 60, height: 60, flexShrink: 0 }}
                                        />

                                        <Box sx={{ width: "100%" }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    mb: 1,
                                                }}
                                            >
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{ fontWeight: 600, color: "text.primary" }}
                                                >
                                                    {review.userId.firstname}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(review.createdAt).toLocaleDateString("en-GB")}
                                                </Typography>
                                            </Box>

                                            <Rating name="read-only" value={review.rating} readOnly size="small" sx={{ mb: 1 }} />

                                            <Typography
                                                variant="body2"
                                                sx={{ color: "text.secondary", lineHeight: 1.5, fontStyle: "italic" }}
                                            >
                                                {review.feedback}
                                            </Typography>
                                        </Box>
                                    </Box>

                                </SplideSlide>
                            ))}
                        </Splide>
                        :
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: 200, // ensures some space
                                bgcolor: "background.paper",
                                borderRadius: 2,
                                p: 3,
                                boxShadow: 0,
                            }}
                        >
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                No reviews for this service.
                                <br />
                                Be the first to write a review!
                            </Typography>
                        </Box>
                    }
                </Grid>
            </Card>
        </Grid>
    )
}

export default RatingsReviews