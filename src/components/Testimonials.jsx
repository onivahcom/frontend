import React from 'react';
import {
    Box,
    Grid,
    Avatar,
    Typography,
    Button,
    Paper,
    Stack,
    Chip,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const imageColumns = [
    [
        'https://storage.googleapis.com/a1aa/image/9d9705ca-85aa-4389-b5a5-07b7a47378aa.jpg',
        'https://storage.googleapis.com/a1aa/image/e37b20bd-2254-46cd-37f3-a072aefbc194.jpg',
    ],
    [
        'https://storage.googleapis.com/a1aa/image/7629c605-bfff-431b-979c-5a1d109b1037.jpg',
        'https://storage.googleapis.com/a1aa/image/f1118b5e-10ba-4f19-c822-07ccb5f32d0e.jpg',
    ],
    [
        'https://storage.googleapis.com/a1aa/image/71516947-8ee2-44cc-22a0-b1684f377f49.jpg',
        'https://storage.googleapis.com/a1aa/image/83a19f7e-c872-4dfb-2c7f-980477686d9a.jpg',
    ],
    ['https://storage.googleapis.com/a1aa/image/32afee69-aa2a-40a5-65fb-1c55e1bea8e4.jpg'],
    [
        'https://storage.googleapis.com/a1aa/image/39f5c783-d6f8-4fb6-1315-cce953681114.jpg',
        'https://storage.googleapis.com/a1aa/image/371b581d-ab12-4f03-b9f1-7429e542caa2.jpg',
    ],
    [
        'https://storage.googleapis.com/a1aa/image/ca2aa674-5092-49a1-b7c9-1cd171761ed5.jpg',
        'https://storage.googleapis.com/a1aa/image/6b585dbd-d0c5-4bfb-8382-58874cc4c364.jpg',
    ],
    [
        'https://storage.googleapis.com/a1aa/image/c057b391-4a40-46a5-36df-34f9be9bd478.jpg',
        'https://storage.googleapis.com/a1aa/image/0439f230-baa2-4afc-3ae4-5c89f85b7dc1.jpg',
    ],
];

const Testimonials = () => {


    return (
        <Box
            maxWidth='lg'
            mx='auto'
            sx={{
                // minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: { xs: 10, sm: 10 },
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 6,
                    p: { xs: 4, sm: 6, md: 8 },
                    // maxWidth: '1400px',
                    width: '100%',
                    bgcolor: '#f8f8f8',
                    position: 'relative',
                    overflow: 'visible',
                }}
            >
                {/* Image Grid */}
                <Grid container spacing={3} justifyContent="center">
                    {imageColumns.map((column, colIdx) => (
                        <Grid
                            item
                            key={colIdx}
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                mt:
                                    colIdx % 2 === 1
                                        ? 3
                                        : colIdx % 3 === 0
                                            ? -3
                                            : 0,
                            }}
                        >
                            {column.map((img, imgIdx) => {
                                const randomDelay = Math.floor(Math.random() * 500) + 100; // 100–600ms
                                return (
                                    <Avatar
                                        key={imgIdx}
                                        src={img}
                                        alt={`Testimonial ${imgIdx}`}
                                        variant="rounded"
                                        data-aos="zoom-out"
                                        data-aos-delay={randomDelay}
                                        sx={{
                                            width: { xs: 48, sm: 96, md: 96 },
                                            height: { xs: 64, sm: 128, md: 128 },
                                            objectFit: "cover",
                                            borderRadius: 2,
                                        }}
                                    />
                                );
                            })}
                        </Grid>
                    ))}
                </Grid>


                {/* Text Content */}
                <Box sx={{ mt: { xs: 6, sm: 8 }, textAlign: 'center' }}>
                    <Chip
                        label="Testimonials"
                        size="small"
                        sx={{
                            bgcolor: 'grey.200',
                            color: 'text.secondary',
                            fontWeight: 500,
                            mb: 2,
                        }}
                    />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Trusted by leaders
                        <br />
                        <Typography
                            component="span"
                            variant="h4"
                            fontWeight="bold"
                            color="text.disabled"
                        >
                            from various industries
                        </Typography>
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ maxWidth: 500, mx: 'auto', color: 'text.primary', mt: 1 }}
                    >
                        Learn why professionals trust our solutions to complete their customer journeys.
                    </Typography>


                    {/* Featured Testimonials */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={3}
                        justifyContent="center"
                        alignItems="stretch"
                        sx={{ mt: 4 }}
                    >
                        {[
                            {
                                text: "“Our wedding was magical! The team handled everything so smoothly that we could truly enjoy the moment.”",
                                avatar: "https://images.pexels.com/photos/1926620/pexels-photo-1926620.jpeg",
                                name: "Priya & Arjun"
                            },
                            {
                                text: "“As a photographer, working with them is a delight — every event is flawlessly planned and stunning.”",
                                avatar: "https://images.pexels.com/photos/2106685/pexels-photo-2106685.jpeg",
                                name: "Rakesh Sharma"
                            }
                        ].map((testimonial, index) => (
                            <Paper
                                key={index}
                                elevation={0}
                                sx={{
                                    p: 3,
                                    flex: 1,
                                    minHeight: 150,
                                    maxWidth: 400,
                                    borderRadius: 3,
                                    bgcolor: 'white',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                                    textAlign: 'left',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                    },
                                }}
                            >
                                <Typography variant="subtitle2" color='text.secondary' sx={{ fontStyle: 'italic', mb: 3 }}>
                                    {testimonial.text}
                                </Typography>
                                <Stack direction="row" justifyContent='right' spacing={2} alignItems="center">
                                    <Avatar
                                        src={testimonial.avatar}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                    <Typography variant="caption" fontWeight={600}>
                                        {testimonial.name}
                                    </Typography>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>




                    <Button
                        variant="contained"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                            mt: 4,
                            textTransform: 'none',
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                                bgcolor: 'grey.900',
                            },
                        }}
                    >
                        Read Success Stories
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
};

export default Testimonials;
