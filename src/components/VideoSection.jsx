import React from 'react';
import {
    Box,
    Typography,
    Avatar,
    Button,
    Stack,
    IconButton,
    Grid,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const VideoSection = () => {
    return (
        <Box maxWidth="md" mx="auto" sx={{ backgroundColor: '#fafafa', py: { xs: 10, md: 10 } }}>
            <Box px={{ xs: 2, sm: 3 }}>
                <Grid container
                    columnSpacing={{ xs: 0, sm: 8 }}
                    rowSpacing={{ xs: 6, sm: 0 }}
                    alignItems="center">
                    {/* Left: Image with Play */}
                    <Grid item xs={12} sm={6} data-aos='fade-up'>
                        <Box

                            onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                            sx={{
                                position: 'relative',
                                borderRadius: 6,
                                overflow: 'hidden',
                                width: '100%',
                                cursor: 'pointer',
                                boxShadow: 0,
                            }}
                        >
                            <Box
                                component="img"
                                src="https://img.freepik.com/free-photo/portrait-people-wearing-graphic-eye-makeup_23-2151120778.jpg"
                                alt="Couple enjoying a cozy Airbnb stay"
                                sx={{
                                    width: '100%',
                                    height: { xs: 200, sm: 300, md: 400 },
                                    objectFit: 'cover',
                                }}
                            />
                            <IconButton
                                aria-label="Play video"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
                                }}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    '&:hover': { backgroundColor: 'rgba(255,255,255,1)' },
                                    width: { xs: 48, sm: 56, md: 64 },
                                    height: { xs: 48, sm: 56, md: 64 },
                                    boxShadow: 3,
                                }}
                            >
                                <PlayArrowIcon sx={{ fontSize: { xs: 28, sm: 32, md: 36 }, }} />
                            </IconButton>
                        </Box>
                    </Grid>

                    {/* Right: Text Content */}
                    <Grid item xs={12} sm={6} data-aos='fade-up'>
                        <Box sx={{ maxWidth: 420, mx: { xs: 'auto', md: 'auto' }, textAlign: { xs: 'center', sm: 'left' } }}>
                            {/* Avatars & Title */}
                            <Stack
                                direction="row"
                                spacing={-1}
                                justifyContent={{ xs: 'center', md: 'flex-start' }}
                                flexWrap="wrap"
                            >
                                {[
                                    'https://randomuser.me/api/portraits/women/45.jpg',
                                    'https://randomuser.me/api/portraits/men/22.jpg',
                                    'https://randomuser.me/api/portraits/women/68.jpg',
                                ].map((src, index) => (
                                    <Avatar
                                        key={index}
                                        src={src}
                                        alt={`Host ${index + 1}`}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            border: '2px solid white',
                                            boxShadow: 1,
                                        }}
                                    />
                                ))}
                                <Typography
                                    variant="body2"
                                    sx={{ ml: 2, color: '#555', mt: { xs: 1, sm: 0 } }}
                                >
                                    Trusted by <strong>20+</strong> superhosts worldwide
                                </Typography>
                            </Stack>

                            {/* Heading */}
                            <Typography
                                variant="h4"
                                fontWeight="bold"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    color: '#222',
                                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                                }}
                            >
                                Experience unique stays and stories
                            </Typography>

                            {/* Description */}
                            <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ lineHeight: 1.7 }}
                            >
                                Step inside the world of our hosts and discover the places, people,
                                and passions that make every Airbnb stay unforgettable.
                                From cozy cabins to modern lofts, your next adventure starts here.
                            </Typography>

                            {/* Buttons */}
                            <Stack
                                direction='row'
                                spacing={2}
                                sx={{ mt: 4 }}
                                justifyContent={{ xs: 'center', md: 'flex-start' }}
                            >
                                <Button
                                    variant="contained"
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: 14,
                                        borderRadius: 2,
                                        py: 1.2,
                                    }}
                                >
                                    Start exploring
                                </Button>
                                <Button
                                    variant="outlined"
                                    endIcon={<ArrowForwardIcon />}
                                    sx={{
                                        textTransform: 'none',
                                        fontSize: 14,
                                        borderRadius: 2,
                                        py: 1.2,
                                        borderColor: '#ddd',
                                        color: '#222',
                                        '&:hover': { borderColor: '#aaa' },
                                    }}
                                >
                                    Watch Stories
                                </Button>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    );
};

export default VideoSection;
