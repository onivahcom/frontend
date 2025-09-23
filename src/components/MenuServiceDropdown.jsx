import React, { useState } from 'react';
import { Box, Button, Grid, Typography, Modal } from '@mui/material';
import ArrowForward from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';


const services = [
    {
        text: "Wedding Hall",
        link: "/mandabam", // maps to 'Mandabam'
        image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Photography",
        link: "/photography",
        image: "https://images.unsplash.com/photo-1519183071298-a2962cc0c61b?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Catering",
        link: "/catering",
        image: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Decors",
        link: "/decors",
        image: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Makeup Artist",
        link: "/makeup_artist",
        image: "https://images.unsplash.com/photo-1531884077868-44d9a4840e63?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Wedding Attire",
        link: "/wedding_attire",
        image: "https://images.unsplash.com/photo-1514996937319-344454492b37?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Jewelry",
        link: "/jewelry",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Personal Care",
        link: "/personal_care/brides",
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Mehandi",
        link: "/mehandi",
        image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Garlands",
        link: "/", // 🚨 not found in venueCategory (needs adding)
        image: "https://images.unsplash.com/photo-1517414204280-37c8c51b085a?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Customized Gifts",
        link: "/", // 🚨 not found in venueCategory (needs adding)
        image: "https://images.unsplash.com/photo-1530023367847-cdd38a9b53f1?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Wedding Cakes",
        link: "/", // 🚨 not found in venueCategory (needs adding)
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
    },
    {
        text: "Music / DJ",
        link: "/", // 🚨 not found in venueCategory (needs adding)
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    },
];


const MenuServiceDropdown = () => {

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [hoveredImage, setHoveredImage] = useState('https://img.freepik.com/free-photo/black-boy-playing-guitar_23-2148171660.jpg');

    return (
        <>
            <Button
                onClick={() => setOpen(!open)}
                variant="text"
                sx={{
                    color: 'grey',
                    '&:hover': {
                        color: "black",
                    },
                }}
                endIcon={<span style={{ fontSize: 12 }}>▾</span>}
            >
                Services
            </Button>

            <Modal
                sx={{ zIndex: 99 }}
                open={open}
                onClose={() => { setOpen(false); setHoveredImage(''); }}
                closeAfterTransition
                BackdropProps={{
                    sx: { bgcolor: 'rgba(0,0,0,0.4)', position: "absolute", top: 70, }, // Transparent grey backdrop here
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 75,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        bgcolor: '#f5f5f5',
                        borderRadius: 2,
                        maxWidth: 900,
                        width: '90vw',
                        maxHeight: 500,
                        p: 3,
                        overflowY: 'auto',
                        boxShadow: 0,
                        outline: 'none',
                    }}
                    onMouseLeave={() => setHoveredImage('')}
                >
                    <Grid container spacing={3}>
                        {/* Left: Service list */}
                        <Grid item xs={12} md={6}>
                            <Grid container spacing={1}>
                                {services.map((service, index) => (
                                    <Grid
                                        onClick={() => navigate(`/service${service.link}`)}
                                        item
                                        xs={6}
                                        key={index}
                                        onMouseEnter={() => setHoveredImage(service.image || '')}
                                        sx={{
                                            borderRadius: 2,
                                            // bgcolor: hoveredImage === service.image ? '#e0e0e0' : 'transparent',
                                            cursor: 'pointer',
                                            fontSize: '0.85rem',
                                            fontWeight: 500,
                                            p: 1,
                                            userSelect: 'none',
                                            textAlign: 'left',
                                            transition: 'background-color 0.2s ease',
                                            color: "grey",
                                            '&:hover': {
                                                color: "black",
                                                bgcolor: '#f2f2f2',
                                            },
                                        }}
                                    >
                                        {service.text}
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>

                        {/* Right: Preview image */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    height: '100%',
                                    maxHeight: 240,
                                }}
                            >
                                <img
                                    src={hoveredImage || 'https://img.freepik.com/free-photo/portrait-people-wearing-graphic-eye-makeup_23-2151120778.jpg'}
                                    alt="Preview"
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        display: 'block',
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </>
    );
}

export default MenuServiceDropdown;
