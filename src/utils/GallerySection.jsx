import React from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    Box
} from "@mui/material";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";

export default function GallerySection() {
    const images = [
        {
            id: "01",
            src: "https://img.freepik.com/free-photo/full-shot-smiley-people-posing-wedding_23-2149956422.jpg",
            alt: "Modern office building with glass windows and gray sky",
        },
        {
            id: "02",
            src: "https://img.freepik.com/free-photo/portrait-people-wearing-graphic-eye-makeup_23-2151120778.jpg",
            alt: "White house with black roof and blue sky with clouds",
        },
        {
            id: "03",
            src: "https://img.freepik.com/free-photo/black-boy-playing-guitar_23-2148171660.jpg",
            alt: "City skyline with tall buildings emerging from fog",
        },
        {
            id: "04",
            src: "https://cdn.pixabay.com/photo/2024/08/01/19/25/couple-8938067_1280.jpg",
            alt: "Modern building with white and yellow panels and railings",
        },
    ];

    return (
        <Container maxWidth="md" sx={{ py: 10, textAlign: "center" }}>
            {/* Small Heading */}
            <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="text.primary"
                sx={{ mb: 1, letterSpacing: 1 }}
                data-aos='fade-up'
            >
                UNIQUE STAYS & EXPERIENCES
            </Typography>

            {/* Main Heading */}
            <Typography
                variant="h4"
                fontWeight="bold"
                color="text.primary"
                sx={{ mb: 2 }}
                data-aos='fade-up'
            >
                What Makes a Trip Unforgettable?
            </Typography>

            {/* Description */}
            <Typography
                data-aos='fade-up'
                component='div'
                variant="body2"
                sx={{ color: 'text.secondary', maxWidth: 500, mx: 'auto', mb: 6, px: 2 }}
            >
                From cozy cabins to luxury villas, and from cooking classes to city tours —
                we connect you with places and experiences that turn every journey into a
                story worth telling.
            </Typography>


            {/* Image Grid */}
            <Splide
                options={{
                    type: "slide",
                    perPage: 4, // default for lg+
                    perMove: 1,
                    gap: "1rem",
                    breakpoints: {
                        1200: { perPage: 3 }, // md
                        900: { perPage: 2 },  // sm
                        600: { perPage: 1 },  // xs
                    },
                    pagination: true,
                    arrows: true,
                }}
                data-aos="fade-up"
            >
                {images.map(({ id, src, alt }) => (
                    <SplideSlide key={id}>
                        <Card
                            sx={{
                                width: "100%",
                                height: 250,
                                borderRadius: 8,
                                overflow: "hidden",
                                position: "relative",
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={src}
                                alt={alt}
                                sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                            <Box
                                sx={{
                                    position: "absolute",
                                    bottom: 16,
                                    left: 16,
                                    color: "white",
                                    fontWeight: "bold",
                                    fontSize: 28,
                                    userSelect: "none",
                                }}
                            >
                                {id}
                            </Box>
                        </Card>
                    </SplideSlide>
                ))}
            </Splide>

        </Container>
    );
}
