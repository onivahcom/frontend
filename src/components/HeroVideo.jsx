import React, { useEffect } from "react";
import {
    Box,
    Typography,
    Button,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AOS from "aos";
import "aos/dist/aos.css";
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Parallax } from "react-parallax";
import { purple } from "@mui/material/colors";
import { Card, CardMedia, } from "@mui/material";


const HeroVideo = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("xl"));

    useEffect(() => {
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <Box maxWidth="xl" mx="auto" sx={{
            borderRadius: 10,
            mt: 10,
            position: "relative",
            height: { xs: "80vh", sm: '70vh', md: "90vh", lg: "95vh", xl: "80vh" },
            width: "100%", overflow: "hidden"
        }}>
            {/* <Splide
                options={{
                    type: 'fade',
                    rewind: true,
                    autoplay: false,
                    interval: 6000,
                    pauseOnHover: true,
                    arrows: false,
                    pagination: false,
                    cover: true,
                    height: '100vh',
                }}
                style={{ width: '100%', height: '100%', }}
            >
                {
                    [
                        // 'https://img.freepik.com/free-photo/portrait-people-wearing-graphic-eye-makeup_23-2151120778.jpg',
                        'https://res.cloudinary.com/duhk3ldw7/image/upload/v1754388902/SHF00337_livmq6.jpg',
                        // require("../images/hero/SHF00337.jpg"),
                        require("../images/hero/SHF00343.jpg"),
                        // "https://cdn.pixabay.com/photo/2016/11/18/22/21/bride-1837148_1280.jpg",
                    ]
                        .map(
                            (src, idx) => (
                                <SplideSlide key={idx}>
                                    <Parallax
                                        bgImage={src}
                                        strength={300}
                                        bgImageStyle={{

                                            objectFit: "cover",
                                            height: "100%",
                                            width: "100%",
                                            top: "0%",
                                            position: "absolute"
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                height: "100vh",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                textAlign: "center",
                                                // background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5))",
                                                background: "rgba(0, 0, 0, 0.3)", // overlay
                                                px: 2,
                                                color: "#fff",
                                            }}
                                        >
                                            <Box zIndex={2}>
                                                <Typography
                                                    variant="h3"
                                                    fontWeight="bold"
                                                    gutterBottom
                                                    data-aos="fade-up"
                                                >
                                                    Capturing{" "}
                                                    <Typography variant="h3" fontWeight="bold" component="span" sx={{ color: "#e4c6ff" }}>
                                                        Love & Light
                                                    </Typography>
                                                </Typography>
                                                <Typography
                                                    variant="body5"
                                                    sx={{ maxWidth: "700px" }}
                                                    data-aos="fade-up"
                                                    data-aos-delay="300"
                                                >
                                                    Turning beautiful moments into timeless memories.
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    sx={{ display: { xs: "none", md: "none" }, mt: 4, mx: "auto" }}
                                                    endIcon={<ArrowForwardIcon />}
                                                >
                                                    Book Now
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Parallax>
                                </SplideSlide>

                            )
                        )}
            </Splide> */}
            {/* <Parallax
                bgImage='https://res.cloudinary.com/duhk3ldw7/image/upload/v1754388902/SHF00337_livmq6.jpg'
                strength={300}
                bgImageStyle={{

                    objectFit: "cover",
                    height: "100%",
                    width: "100%",
                    top: "0%",
                    position: "absolute"
                }}
            >
                <Box
                    sx={{
                        height: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        textAlign: "center",
                        borderRadius: 8,
                        // background: "linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0.5))",
                        background: "rgba(0, 0, 0, 0.3)", // e4c6ff overlay
                        px: 2,
                        color: "#fff",
                    }}
                >
                    <Box zIndex={2}>
                        <Typography
                            variant="h3"
                            fontWeight="bold"
                            gutterBottom
                            data-aos="fade-up"
                        >
                            Capturing{" "}
                            <Typography variant="h3" fontWeight="bold" component="span" sx={{ color: purple[100] }}>
                                Love & Light
                            </Typography>
                        </Typography>
                        <Typography
                            variant="body5"
                            sx={{ maxWidth: "700px" }}
                            data-aos="fade-up"
                            data-aos-delay="300"
                        >
                            Turning beautiful moments into timeless memories.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{ display: { xs: "none", md: "none" }, mt: 4, mx: "auto" }}
                            endIcon={<ArrowForwardIcon />}
                        >
                            Book Now
                        </Button>
                    </Box>
                </Box>
            </Parallax> */}


            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transform: "translate(-50%, -50%)",
                    zIndex: -1,
                }}
            >
                <source src="https://www.pexels.com/download/video/31139772/" type="video/mp4" />
                Your browser does not support the video tag.
            </video>


        </Box >
    );
};

export default HeroVideo;
