import { Close, Image, ImageSearch } from '@mui/icons-material'
import { Box, Button, Card, Grid, IconButton, ImageList, ImageListItem, Modal, Stack, Tab, Tabs, useMediaQuery } from '@mui/material'
import { Splide, SplideSlide } from '@splidejs/react-splide'
import React, { useState } from 'react'
import theme from '../../Themes/theme'

const ImageSection = ({ previewImages, allImageUrls, images }) => {

    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState("CoverImage");

    const handleTabChange = (event, newValue) => setTab(newValue);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Grid item xs={12} md={8}>
            <Card
                sx={{
                    height: { xs: 280, md: 400 },
                    borderRadius: 4,
                    overflow: "hidden",
                    position: "relative",
                    boxShadow: 0,
                }}
                elevation={0}
            >
                <Grid container spacing={0.5} sx={{ height: "100%" }}>
                    {/* Large Left Image */}
                    {allImageUrls.length > 0 && (
                        <Grid
                            item
                            xs={12}
                            md={allImageUrls.length > 1 ? 6 : 12} // full width if only 1 image
                            sx={{ height: { xs: allImageUrls.length > 1 ? 140 : "100%", md: "100%" } }}
                        >
                            <Box
                                component="img"
                                src={allImageUrls[0]}
                                alt="Main"
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    borderRadius: {
                                        xs: allImageUrls.length > 1 ? "12px 12px 0 0" : 2,
                                        md: allImageUrls.length > 1 ? "12px 0 0 12px" : 2,
                                    },
                                    cursor: "pointer",
                                }}
                                onClick={() => handleOpen(0)}
                            />
                        </Grid>
                    )}

                    {/* Right Side Collage (2x2 grid) */}
                    {allImageUrls.length > 1 && previewImages.length > 1 && (
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={0.5} sx={{ height: "100%" }}>
                                {previewImages.slice(1, 5).map((img, idx) => {
                                    const borderRadius = [
                                        "0 12px 0 0", // top-right
                                        "0 0 0 0",    // top-left
                                        "0 0 0 0",    // bottom-left
                                        "0 0 12px 0", // bottom-right
                                    ];

                                    return (
                                        <Grid
                                            item
                                            xs={6}
                                            sx={{ height: { xs: 70, md: "50%" } }}
                                            key={idx}
                                        >
                                            <Box
                                                component="img"
                                                src={img}
                                                alt={`Collage ${idx + 1}`}
                                                sx={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                    borderRadius: { md: borderRadius[idx] },
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => handleOpen(idx + 1)}
                                            />
                                            {idx === 3 && previewImages.length > 5 && (
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        top: 0,
                                                        left: 0,
                                                        width: "100%",
                                                        height: "100%",
                                                        bgcolor: "rgba(0,0,0,0.5)",
                                                        display: "flex",
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        color: "#fff",
                                                        fontWeight: "bold",
                                                        fontSize: "0.95rem",
                                                        cursor: "pointer",
                                                        borderRadius: { md: borderRadius[idx] },
                                                    }}
                                                    onClick={handleOpen}
                                                >
                                                    +{previewImages.length - 4} More
                                                </Box>
                                            )}
                                        </Grid>
                                    );
                                })}
                            </Grid>
                        </Grid>
                    )}
                </Grid>

                {/* Overlay Button */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: 12,
                        right: 12,
                        bgcolor: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        px: 2,
                        py: 0.5,
                        borderRadius: 3,
                        fontSize: 14,
                        cursor: "pointer",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                    }}
                    onClick={handleOpen}
                >
                    + View Photos
                </Box>
            </Card>





            {/* Dialog for All Photos */}
            <Modal open={open} onClose={handleClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        bgcolor: "background.default",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {/* Header */}
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        px={3}
                        py={2}
                        sx={{
                            borderBottom: 1,
                            borderColor: "divider",
                            backgroundColor: "background.paper",
                            zIndex: 10,
                        }}
                    >
                        <Button variant='text' size='large' color='inherit' startIcon={<Image />}>
                            Image Gallery
                        </Button>

                        <IconButton
                            onClick={handleClose}
                            sx={{
                                color: "text.secondary",
                                transition: "0.2s",
                                "&:hover": {
                                    transform: "rotate(90deg)",
                                    color: "error.main",
                                },
                            }}
                        >
                            <Close />
                        </IconButton>
                    </Stack>

                    {/* Tabs */}
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        variant="scrollable"
                        scrollButtons="auto"
                        sx={{
                            px: 3,
                            borderBottom: 1,
                            borderColor: "divider",
                            ".MuiTab-root": {
                                fontWeight: 500,
                                textTransform: "capitalize",
                            },
                            ".Mui-selected": {
                                color: "primary.main",
                            },
                        }}
                    >
                        {Object.keys(images).map((key) => (
                            <Tab key={key} label={key} value={key} />
                        ))}
                    </Tabs>

                    {/* Main Body Grid Layout */}
                    <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
                        {/* Left - Scrollable Image Grid */}
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: "auto",
                                p: 3,
                            }}
                        >
                            <Grid container spacing={2}>
                                {images[tab]?.map((img, idx) => (
                                    <Grid item xs={6} sm={4} md={3} lg={2} key={idx}>
                                        <Box
                                            component="img"
                                            src={img}
                                            alt={`Image ${idx}`}
                                            sx={{
                                                width: "100%",
                                                height: 200,
                                                borderRadius: 2,
                                                objectFit: "cover",
                                                transition: "all 0.3s ease",
                                                boxShadow: 0,
                                                cursor: "pointer",
                                                "&:hover": {
                                                    boxShadow: 6,
                                                },
                                            }}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>


                    </Box>
                </Box>
            </Modal>

        </Grid>
    )
}

export default ImageSection