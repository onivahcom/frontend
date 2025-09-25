import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, CardContent, Typography, Button, Box, Radio, Slide, TextField, ButtonBase } from '@mui/material';
import SpaIcon from '@mui/icons-material/Spa';
import PaletteIcon from '@mui/icons-material/Palette';
import FaceIcon from '@mui/icons-material/Face';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EventIcon from '@mui/icons-material/Event';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import DiamondIcon from '@mui/icons-material/Diamond';
import FavoriteIcon from '@mui/icons-material/Favorite';
import theme from '../Themes/theme';
import { Agriculture, BeachAccess, Celebration, CheckCircle, Hotel, LocationCity, LocationCitySharp, NavigateNext, Sailing, } from '@mui/icons-material';
import Aos from 'aos';
import "aos/dist/aos.css"; // AOS styles
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import ArrowForward from '@mui/icons-material/ArrowForward';


const venueCategory = [
    {
        name: 'Mandabam',
        route: 'mandabam',
        icon: <LocationCity fontSize="large" sx={{ color: '#FF5733' }} />,
        image: 'https://cdn.pixabay.com/photo/2017/07/31/19/44/people-2560382_640.jpg'
    },
    {
        name: 'Party Hall',
        route: 'party_hall',
        icon: <Celebration fontSize="large" sx={{ color: '#C70039' }} />,
        image: 'https://cdn.pixabay.com/photo/2016/11/29/06/17/audience-1867754_640.jpg'
    },
    {
        name: 'Convention Center',
        route: 'convention_center',
        icon: <LocationCityIcon fontSize="large" sx={{ color: '#900C3F' }} />,
        image: 'https://cdn.pixabay.com/photo/2016/06/30/20/17/hall-1489768_640.jpg'
    },
    {
        name: 'Resort',
        route: 'resort',
        icon: <Sailing fontSize="large" sx={{ color: '#FFC300' }} />,
        image: 'https://cdn.pixabay.com/photo/2019/12/18/10/02/maldives-4703551_640.jpg'
    },
    {
        name: 'Beach Wedding',
        route: 'beach_wedding',
        icon: <BeachAccess fontSize="large" sx={{ color: '#FF5733' }} />,
        image: 'https://cdn.pixabay.com/photo/2020/09/19/09/39/wedding-5584003_640.jpg'
    },
    {
        name: 'Farm Land',
        route: 'farm_land',
        icon: <Agriculture fontSize="large" sx={{ color: '#DAF7A6' }} />,
        image: 'https://cdn.pixabay.com/photo/2014/08/29/20/48/farm-431295_640.jpg'
    },
    {
        name: 'Catering',
        route: 'catering',
        icon: <RestaurantIcon fontSize="large" sx={{ color: '#4CAF50' }} />,
        image: 'https://cdn.pixabay.com/photo/2022/09/07/06/56/vegetables-7438072_640.jpg'
    },
    {
        name: 'Photography',
        route: 'photography',
        icon: <CameraAltIcon fontSize="large" sx={{ color: '#3F51B5' }} />,
        image: 'https://cdn.pixabay.com/photo/2023/01/18/13/09/camera-7726802_640.jpg'
    },
    {
        name: 'Decors',
        route: 'decors',
        icon: <EventIcon fontSize="large" sx={{ color: '#E91E63' }} />,
        image: 'https://cdn.pixabay.com/photo/2017/09/09/18/25/living-room-2732939_640.jpg'
    },
    {
        name: 'Event Planners',
        route: 'event_planners',
        icon: <EventIcon fontSize="large" sx={{ color: '#FF9800' }} />,
        image: 'https://cdn.pixabay.com/photo/2017/05/04/16/37/meeting-2284501_1280.jpg'
    },
    {
        name: 'Makeup Artist',
        route: 'makeup_artist',
        icon: <FaceIcon fontSize="large" sx={{ color: '#9C27B0' }} />,
        image: 'https://cdn.pixabay.com/photo/2017/10/06/21/09/makeup-2824659_640.jpg'
    },
    {
        name: 'Wedding Attire',
        route: 'wedding_attire',
        icon: <CheckroomIcon fontSize="large" sx={{ color: '#673AB7' }} />,
        image: 'https://cdn.pixabay.com/photo/2015/02/14/02/20/wedding-636021_640.jpg'
    },
    {
        name: 'Jewelry',
        route: 'jewelry',
        icon: <DiamondIcon fontSize="large" sx={{ color: '#FFC107' }} />,
        image: 'https://cdn.pixabay.com/photo/2021/09/15/09/18/rajasthani-6626357_640.jpg'
    },
    {
        name: 'Personal Care - Brides/Groom',
        route: 'personal_care/brides',
        icon: <FavoriteIcon fontSize="large" sx={{ color: '#F44336' }} />,
        image: 'https://cdn.pixabay.com/photo/2019/10/11/12/33/make-up-4541782_640.jpg'
    },
    {
        name: 'Nail Artist',
        route: 'nail_artist',
        icon: <SpaIcon fontSize="large" sx={{ color: '#4A90E2' }} />,
        image: 'https://cdn.pixabay.com/photo/2020/10/14/07/03/nail-art-5653459_1280.jpg'
    },
    {
        name: 'Mehandi',
        route: 'mehandi',
        icon: <PaletteIcon fontSize="large" sx={{ color: '#8BC34A' }} />,
        image: 'https://cdn.pixabay.com/photo/2020/06/03/06/20/beautiful-5253644_640.jpg'
    },
].sort((a, b) => a.name.localeCompare(b.name));


const VendorServices = () => {

    useEffect(() => {
        // Initialize AOS with custom settings
        Aos.init({
            duration: 1000, // Duration of the animation
            easing: "ease-out", // Easing function
            once: false, // Animations repeat on scrolling again
            offset: 200, // Offset, triggers animation when 200px away from viewport
            delay: 100, // Delay between animations if needed
        });

        // Re-initialize AOS on every render, which can be useful for dynamic content
        Aos.refresh();
    }, []);

    const [showVenues, setShowVenues] = useState(false)
    const [searchTerm, setSearchTerm] = useState('');

    const [selectedCategory, setSelectedCategory] = useState(null);
    const navigate = useNavigate();

    const handleSelect = (category) => {
        setSelectedCategory(category);
    };

    const handleNext = () => {
        if (selectedCategory) {
            navigate(`/vendor-dashboard/vendor-services/${selectedCategory.route}`);
        }
    };

    const handleVenueCategory = () => {
        setShowVenues(!showVenues)
    }

    return (
        <Box maxWidth='lg' mx='auto'>
            {/* <Header /> */}
            <Grid container spacing={1} p={1}>

                <Grid item xs={12} md={12}>
                    {/* <Box
                        sx={{
                            width: '100%',  // Ensures full width inside the Grid item
                            height: { xs: 200, sm: 250, md: 200 },  // Different heights for different screen sizes
                            backgroundImage: 'url("https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=600")',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            borderRadius: 2,
                        }}
                    /> */}
                </Grid>

                <Grid item xs={12} md={12} sx={{ bgcolor: "#f3f3f369" }}>



                    <Grid
                        container
                        // spacing={2}
                        sx={{
                            mt: 1,
                            // maxHeight: { xs: "50vh", md: "70vh" },
                            overflowY: 'auto',
                            padding: 0,
                        }}
                    >

                        <Grid item xs={12} sx={{ display: "flex", flexDirection: { xs: 'column', md: 'row' }, alignItems: "center", justifyContent: "space-between" }}>

                            <Typography
                                variant="h6"
                                gutterBottom
                                fontWeight={600}
                                sx={{ textAlign: 'left', p: 2 }}
                            >
                                Select Your Profile
                            </Typography>

                            <TextField
                                size='small'
                                placeholder="Search Services"
                                variant="standard"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                sx={{ maxWidth: 500, mb: 4, }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>



                        <Grid container sx={{ p: 0 }}>

                            {venueCategory
                                .filter((category) =>
                                    category.name.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map((category) => (

                                    <Grid item xs={6} sm={4} md={3} lg={3} key={category.name}>
                                        <Box
                                            onClick={() => handleSelect(category)}
                                            sx={{
                                                cursor: 'pointer',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                padding: selectedCategory?.name === category.name
                                                    ? 1
                                                    : 1,
                                                borderRadius: 10,
                                                bgcolor: selectedCategory?.name === category.name
                                                    ? "#eeee"
                                                    : 'primary',
                                            }}
                                        >

                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    width: {
                                                        xs: 150,
                                                        sm: 180,
                                                        md: 200,
                                                    },
                                                    height: {
                                                        xs: 150,
                                                        sm: 120,
                                                        md: 160,
                                                    },
                                                    borderRadius: 6,
                                                    overflow: 'hidden',
                                                    transition: 'all 0.3s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'scale(1.01)',
                                                    },
                                                    '&:hover .overlay': {
                                                        background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2))',
                                                    },
                                                }}
                                            >

                                                {/* ✅ Tick icon on selection */}
                                                {selectedCategory?.name === category.name && (
                                                    <CheckCircle
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            color: 'success.main',
                                                            backgroundColor: '#fff',
                                                            borderRadius: '50%',
                                                            fontSize: 28,
                                                            zIndex: 3,
                                                        }}
                                                    />
                                                )}

                                                {/* Background image */}
                                                <Box
                                                    component="img"
                                                    src={category.image}
                                                    alt={category.name}
                                                    sx={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />

                                                {/* Gradient overlay */}
                                                <Box
                                                    className="overlay"
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 0,
                                                        left: 0,
                                                        width: '100%',
                                                        height: '100%',
                                                        background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))',
                                                        transition: 'background 0.3s ease-in-out',
                                                        zIndex: 1,
                                                        borderRadius: 6,
                                                    }}
                                                />

                                                {/* Button over gradient */}
                                                <Button
                                                    fullWidth
                                                    variant="text"
                                                    endIcon={<ArrowForward />}
                                                    sx={{
                                                        position: 'absolute',
                                                        bottom: 4,
                                                        left: 0,
                                                        right: 0,
                                                        color: '#fff',
                                                        // fontWeight: 700,
                                                        textTransform: 'none',
                                                        justifyContent: 'center',
                                                        zIndex: 2,
                                                    }}
                                                >
                                                    {category.name}
                                                </Button>
                                            </Box>




                                        </Box>
                                    </Grid>
                                ))}

                        </Grid>

                    </Grid>

                    {/* Slide-in "Next" Button */}
                    <Box
                        sx={{
                            position: "fixed",  // Keep the button fixed at a position
                            bottom: "1%",         // Position it in the center vertically
                            left: { xs: "50%", md: "90%" },        // Center it horizontally
                            transform: "translate(-50%, -50%)", // Ensure exact center positioning
                            zIndex: 9999,       // High zIndex to overlay everything else
                            width: "100%",      // Full width to cover all content
                            display: "flex",
                            justifyContent: "center",  // Center the button
                            pointerEvents: "none",     // Disable interaction on overlaying element
                        }}
                    >
                        <Slide direction="up" in={Boolean(selectedCategory)} mountOnEnter unmountOnExit timeout={300}>
                            <Box display="flex" justifyContent="center">
                                <Button
                                    endIcon={<NavigateNext />}
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        p: 1.5,
                                        width: "200px",
                                        fontWeight: "bold",
                                        pointerEvents: "all", // Enable interaction for the button
                                    }}
                                    onClick={handleNext}
                                >
                                    Next
                                </Button>
                            </Box>
                        </Slide>
                    </Box>
                </Grid>
            </Grid>
        </Box >


    );
};

export default VendorServices;
