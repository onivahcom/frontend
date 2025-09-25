import React, { useEffect, useState } from "react";
import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";
import AOS from "aos";
import "aos/dist/aos.css";

const HeroVideo = () => {
    const theme = useTheme();
    const isXs = useMediaQuery(theme.breakpoints.down("sm")); // xs/sm screens
    const tagline = "Find. Book. Celebrate.";
    const [words, setWords] = useState([]);

    useEffect(() => {
        setWords(tagline.split(" ")); // Split by words
        AOS.init({ duration: 1000, once: true });
    }, []);

    return (
        <Box
            maxWidth="xl"
            mx="auto"
            sx={{
                borderRadius: 10,
                mt: 10,
                position: "relative",
                height: { xs: "80vh", sm: "70vh", md: "90vh", lg: "95vh", xl: "80vh" },
                width: "100%",
                overflow: "hidden",
            }}
        >
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
                {isXs ?
                    <source
                        src="https://videos.openai.com/vg-assets/assets%2Ftask_01jvgc2dwdeswrnm28fhsz73zc%2Ftask_01jvgc2dwdeswrnm28fhsz73zc_genid_dd0ac9e6-a8f8-43e4-8a96-f4e5fec28a71_25_05_18_00_18_764399%2Fvideos%2F00000_808889886%2Fmd.mp4?st=2025-09-25T09%3A42%3A29Z&se=2025-10-01T10%3A42%3A29Z&sks=b&skt=2025-09-25T09%3A42%3A29Z&ske=2025-10-01T10%3A42%3A29Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=1af02b11-169c-463d-b441-d2ccfc9f02c8&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=WiHMQiJtZV%2Bllku9BHg2D4x5KUoiGMOSB1L0tXadcok%3D&az=oaivgprodscus"
                        type="video/mp4"
                    />
                    // <source
                    //     src="https://videos.openai.com/vg-assets/assets%2Ftask_01jpmyeymfejyaa1efcebf6aef%2Ftask_01jpmyeymfejyaa1efcebf6aef_genid_037bac7f-f4b7-4c8b-8fa7-c0b80bac71ba_25_03_18_15_39_685303%2Fvideos%2F00000_7490631%2Fmd.mp4?st=2025-09-25T10%3A36%3A05Z&se=2025-10-01T11%3A36%3A05Z&sks=b&skt=2025-09-25T10%3A36%3A05Z&ske=2025-10-01T11%3A36%3A05Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=1af02b11-169c-463d-b441-d2ccfc9f02c8&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=1MOrXMC1UCDsFCNVic%2BTDQyWNVI3E9Cbegdu5aLUMY8%3D&az=oaivgprodscus"
                    //     type="video/mp4"
                    // />
                    :
                    <source
                        src="https://videos.openai.com/vg-assets/assets%2Ftask_01jpmyeymfejyaa1efcebf6aef%2Ftask_01jpmyeymfejyaa1efcebf6aef_genid_037bac7f-f4b7-4c8b-8fa7-c0b80bac71ba_25_03_18_15_39_685303%2Fvideos%2F00000_7490631%2Fmd.mp4?st=2025-09-25T10%3A36%3A05Z&se=2025-10-01T11%3A36%3A05Z&sks=b&skt=2025-09-25T10%3A36%3A05Z&ske=2025-10-01T11%3A36%3A05Z&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skoid=1af02b11-169c-463d-b441-d2ccfc9f02c8&skv=2019-02-02&sv=2018-11-09&sr=b&sp=r&spr=https%2Chttp&sig=1MOrXMC1UCDsFCNVic%2BTDQyWNVI3E9Cbegdu5aLUMY8%3D&az=oaivgprodscus"
                        type="video/mp4"
                    />

                }
            </video>

            {/* Overlay Text */}
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "white",
                    textAlign: "center",
                    zIndex: 2,
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    gap: 2,
                    justifyContent: "center",
                    alignItems: "center",
                    px: 2,
                    maxWidth: "90%",
                }}
            >
                {words.map((word, wIdx) => (
                    <Typography
                        key={wIdx}
                        component="h1"
                        variant={isXs ? "h4" : "h4"}
                        sx={{
                            fontWeight: 700,
                            display: "flex",
                            gap: 0.5,
                        }}
                    >
                        {word.split("").map((letter, lIdx) => (
                            <Box
                                key={lIdx}
                                component="span"
                                sx={{
                                    opacity: 0,
                                    display: "inline-block",
                                    filter: "blur(8px)",
                                    animation: `blurReveal 0.6s forwards`,
                                    animationDelay: `${(wIdx * word.length + lIdx) * 0.06}s`,
                                }}
                            >
                                {letter}
                            </Box>
                        ))}
                    </Typography>
                ))}
            </Box>

            {/* CSS animation */}
            <style>
                {`
          @keyframes blurReveal {
            0% {
              opacity: 0;
              filter: blur(8px);
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              filter: blur(0);
              transform: translateY(0);
            }
          }
        `}
            </style>
        </Box>
    );
};

export default HeroVideo;
