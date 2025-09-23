import React, { useState } from 'react';
import { Box, Button, Container, Typography, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import theme from '../Themes/theme';
import '@splidejs/react-splide/css';

const Showcases = () => {
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const slides = [
        {
            title: 'Party Hall',
            image: 'https://img.freepik.com/free-photo/new-clean-luxury-restaurant-european-style-amara-dolce-vita-luxury-hotel-resort-tekirova-kemer-turkey_146671-18744.jpg',
            description: 'Spacious and elegant venues perfect for hosting your wedding celebrations with grandeur.'
        },
        {
            title: 'Convention Center',
            image: 'https://img.freepik.com/free-photo/waiter-keeps-salver-with-snacks_8353-9582.jpg',
            description: 'Large-scale spaces suitable for elaborate wedding events, receptions, and gatherings.'
        },
        {
            title: 'Farm Land',
            image: 'https://images.pexels.com/photos/6578458/pexels-photo-6578458.jpeg',
            description: 'Serene and scenic farmlands ideal for rustic and intimate outdoor weddings.'
        },
        {
            title: 'Beach Wedding',
            image: 'https://images.pexels.com/photos/7648306/pexels-photo-7648306.jpeg',
            description: 'Tie the knot with the sound of waves and a picturesque sunset as your backdrop.'
        },
        {
            title: 'Photography',
            image: 'https://img.freepik.com/free-photo/dslr-camera-with-strap-hanging-photographer-rsquo-s-shoulder_53876-123605.jpg',
            description: 'Capture every beautiful moment with our professional wedding photography services.'
        },
        {
            title: 'Catering',
            image: 'https://img.freepik.com/free-photo/waiter-keeps-salver-with-snacks_8353-9582.jpg',
            description: 'Delight your guests with gourmet menus tailored to your wedding theme and preferences.'
        },
        {
            title: 'Decors',
            image: 'https://images.pexels.com/photos/6578458/pexels-photo-6578458.jpeg',
            description: 'From floral arches to dreamy lighting—elevate your event with stunning decorations.'
        },
        {
            title: 'Event Planner',
            image: 'https://images.pexels.com/photos/7648306/pexels-photo-7648306.jpeg',
            description: 'Let our expert planners handle everything so you can enjoy your big day stress-free.'
        },
        {
            title: 'Makeup Artist',
            image: 'https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg',
            description: 'Professional bridal makeup services to make you look flawless throughout the ceremony.'
        },
        {
            title: 'Wedding Attire',
            image: 'https://images.pexels.com/photos/27048277/pexels-photo-27048277/free-photo-of-woman-hands-holding-man-bow-tie.jpeg',
            description: 'A curated selection of traditional and modern wedding outfits for both bride and groom.'
        },
        {
            title: 'Jewelry',
            image: 'https://images.pexels.com/photos/2106685/pexels-photo-2106685.jpeg',
            description: 'Exquisite wedding jewelry that adds elegance and tradition to your celebration.'
        },
        {
            title: 'Personal Care: Bride/Groom',
            image: 'https://images.pexels.com/photos/6764935/pexels-photo-6764935.jpeg',
            description: 'Luxury grooming and spa packages designed especially for the bride and groom.'
        },
        {
            title: 'Mehandi',
            image: 'https://images.pexels.com/photos/13102907/pexels-photo-13102907.jpeg',
            description: 'Traditional and intricate mehndi designs to beautify your hands for the special day.'
        },
        {
            title: 'Garlands',
            image: 'https://images.pexels.com/photos/13102907/pexels-photo-13102907.jpeg',
            description: 'Fresh flower garlands and varmalas for your rituals and ceremonies.'
        },
        {
            title: 'Customized Return Gifts',
            image: 'https://images.pexels.com/photos/2106685/pexels-photo-2106685.jpeg',
            description: 'Personalized and memorable return gifts that thank your guests in style.'
        },
        {
            title: 'Wedding Cakes',
            image: 'https://images.pexels.com/photos/6764935/pexels-photo-6764935.jpeg',
            description: 'Elegant wedding cakes crafted to match your theme and taste preferences.'
        },
        {
            title: 'Fun Activities / Music, DJ, Pattu Katcheri',
            image: 'https://images.pexels.com/photos/13102907/pexels-photo-13102907.jpeg',
            description: 'Entertain your guests with live music, DJs, traditional katcheris, and more fun events.'
        }
    ];


    const formatCategory = (str) => {
        return str
            .split(' ')
            .map((word, index) =>
                index === 0 ? word.toLowerCase() : word.charAt(0).toLowerCase() + word.slice(1).toLowerCase()
            )
            .join('_');
    };

    const handleRouting = (page) => {
        const pageTitle = formatCategory(page);
        navigate(`/service/${pageTitle}`);
    };

    const handlers = useSwipeable({
        trackMouse: true,
    });

    return (
        <Container maxWidth='md' sx={{ mb: 8, mt: 4, my: 10 }}>
            <Box sx={{ p: { xs: 2, sm: 4 } }}>
                <Typography
                    color='black'
                    textAlign="center"
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 1,
                        // color: '#5c3d77'
                    }}
                    data-aos='fade-up'
                >
                    Celebrate Your  <Typography variant="h4"
                        fontWeight="bold" component="span" sx={{ color: 'primary.main' }}>
                        Dream Wedding
                    </Typography>
                </Typography>
                <Typography
                    textAlign='center'
                    data-aos='fade-up'
                    variant="body2"
                    sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 2 }}
                >
                    Discover everything you need to make your wedding unforgettable — curated just for you.
                </Typography>
            </Box>

            <Splide
                options={{
                    perPage: 4,
                    gap: '1em',
                    arrows: true,
                    pagination: false,
                    breakpoints: {
                        600: { perPage: 2 },
                        900: { perPage: 2 },
                        1200: { perPage: 3 }
                    }
                }}
                aria-label="Wedding Services Carousel"
                {...handlers}
                data-aos='fade-up'
            >
                {slides.map((slide, index) => (
                    <SplideSlide key={index}>
                        <Box
                            onClick={() => handleRouting(slide.title)}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            sx={{
                                position: 'relative',
                                width: "100%",
                                height: 250,
                                borderRadius: 6,
                                overflow: 'hidden',
                                cursor: 'pointer',
                                boxShadow: hoveredIndex === index
                                    ? '0 6px 30px rgba(0,0,0,0.2)'
                                    : '0 4px 16px rgba(0,0,0,0.1)',
                            }}                      >
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    backgroundImage: `url(${slide.image})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    filter: hoveredIndex === index ? 'brightness(50%)' : 'brightness(90%)',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    background: `
                                    linear-gradient(
                                        to top,
                                        rgba(0, 0, 0, 0.8) 0%,
                                        rgba(0, 0, 0, 0.6) 70%,
                                        rgba(0, 0, 0, 0.3) 90%,
                                        rgba(0, 0, 0, 0) 100%
                                    )
                                `,
                                    color: 'white',
                                    p: 2,
                                }}
                            >
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                    {slide.title}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: '#dddddd',
                                        // padding: 'calc(0.5rem + 2px)',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}
                                >
                                    {slide.description}
                                </Typography>


                            </Box>
                        </Box>
                    </SplideSlide>
                ))}
            </Splide>
        </Container>
    );
};

export default Showcases;
