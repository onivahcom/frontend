import React, { useEffect } from 'react';
import { Box, Typography, Grid, Card, CardContent, Avatar, Container, CardMedia, Button, CardActions } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';
import Showcases from '../components/Showcases';
import Aos from 'aos';

const AboutUs = () => {

    const isMobile = useMediaQuery('(max-width:600px)');

    useEffect(() => {
        Aos.init({
            duration: 1000, // You can customize this and other options here
            easing: 'ease-in-out-cubic', // Optional easing
        });

        // Cleanup AOS when the component unmounts
        return () => {
            Aos.refresh(); // To reset AOS on component unmount if needed
        };
    }, []); //


    return (
        <Box>
            <Header />

            <Container sx={{ mt: 15 }}>
                {/* About Us Section */}
                <Box textAlign="center" mb={5} >
                    <Typography variant="h5" mx='auto' sx={{ bgcolor: "#faf4fe", width: "fit-content", p: 1, borderRadius: 5, fontWeight: 600 }} gutterBottom>
                        About Us
                    </Typography>
                    <Typography variant="subtitle2" component='div' maxWidth='md' color="grey" sx={{ mx: 'auto', }}>
                        We help make your dream events come to life. From finding the perfect venue to connecting you with talented photographers, caterers, and planners, we provide everything you need for a flawless celebration.
                    </Typography>
                </Box>

                {/* Our Mission Section */}

                <Grid
                    container
                    // spacing={2}
                    alignItems="stretch" // #452558 Ensures both sides have equal height
                    sx={{
                        backgroundColor: '#f8f8f8',
                        // backgroundColor: '#dedede69',
                        borderRadius: 3,
                        padding: isMobile ? 2 : 4,
                        overflow: "hidden"
                    }}
                >
                    <Grid
                        item
                        xs={12} // Full width on mobile, or adjust based on the screen size
                        md={6}  // Half width on medium screens and above
                        sx={{
                            padding: isMobile ? 2 : 3,
                            borderRadius: 2,
                            // boxShadow: isMobile ? 'none' : '0px 4px 12px rgba(0, 0, 0, 0.05)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',  // Centers the content vertically
                        }}
                        data-aos="fade-right"
                    >
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                            Our Mission
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.8, mt: 1 }}>
                            At Dream Occasions, our mission is to make event planning simple, enjoyable, and stress-free.
                            We connect you with top-rated professionals and venues to ensure your special moments are unforgettable.
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ lineHeight: 1.8, mt: 1 }}>
                            At Dream Occasions, our mission is to make event planning simple, enjoyable, and stress-free.
                            We connect you with top-rated professionals and venues to ensure your special moments are unforgettable.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                marginTop: 3,
                                padding: '12px 24px',
                                borderRadius: 2,
                                alignSelf: 'flex-start',
                                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                                transition: "transform 0.2s ease",
                                '&:hover': {
                                    transform: "scale(1.1)",
                                    boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
                                },
                            }}
                        >
                            Book Now
                        </Button>
                    </Grid>

                    <Grid
                        item
                        xs={12} // Full width on mobile, or adjust based on the screen size
                        md={6}  // Half width on medium screens and above
                        sx={{ display: 'flex', justifyContent: 'center' }}
                        data-aos="fade-left"
                    >
                        <CardMedia
                            component="img"
                            height="100%"  // Ensures the image stretches to the full height of the box
                            image="https://cdn.pixabay.com/photo/2016/08/08/12/08/wedding-rings-1578187_640.jpg"
                            alt="Our mission image"
                            sx={{
                                borderRadius: 3,
                                transition: 'transform 0.3s ease',
                                objectFit: 'cover',  // Ensures the image covers the entire height
                            }}
                        />
                    </Grid>
                </Grid>





                {/* Services Section */}
                <Box mb={3} mt={4}>
                    <Showcases />
                </Box>

                {/* Meet Our Team Section */}
                <Box mb={8} px={3}>
                    <Typography variant="h4" gutterBottom color="inherit" sx={{ textAlign: "center", p: 4, fontWeight: 700 }} data-aos="fade-up">
                        Meet Our Team
                    </Typography>

                    <Grid container spacing={4} justifyContent="center">
                        {[
                            {
                                name: "Emily ",
                                role: "Founder & CEO",
                                img: "https://images.pexels.com/photos/8528852/pexels-photo-8528852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            },
                            {
                                name: "John Doe",
                                role: "Creative Director",
                                img: "https://images.pexels.com/photos/17049832/pexels-photo-17049832/free-photo-of-elegant-man-in-armchair.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            },
                            {
                                name: "Jane",
                                role: "Lead Developer",
                                img: "https://images.pexels.com/photos/2102415/pexels-photo-2102415.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            },
                            {
                                name: " Johnson",
                                role: "Founder & CEO",
                                img: "https://images.pexels.com/photos/8528852/pexels-photo-8528852.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
                            },
                        ].map((teamMember, index) => (
                            <Grid item xs={12} sm={6} md={2} key={index}>
                                <Card
                                    elevation={0}
                                    sx={{
                                        cursor: "pointer",
                                        borderRadius: 4,
                                        textAlign: "center",
                                        p: 3,
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            transform: "translateY(-6px)",
                                            boxShadow: 0,
                                            bgcolor: "#f8f8f8"
                                        },
                                    }}
                                    data-aos="fade-up"
                                >
                                    <Avatar
                                        alt={teamMember.name}
                                        src={teamMember.img}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            mx: "auto",
                                            mb: 2,
                                            border: "4px solid #eee",
                                        }}
                                    />
                                    <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                        {teamMember.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {teamMember.role}
                                    </Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>



                {/* Call to Action Section */}
                <Box
                    sx={{
                        mt: 8,
                        py: 8,
                        px: 3,
                        textAlign: "center",
                        position: "relative",
                        backgroundImage:
                            "url('https://images.pexels.com/photos/169198/pexels-photo-169198.jpeg?auto=compress&cs=tinysrgb&w=1600')",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                    {/* Overlay */}
                    <Box
                        sx={{
                            position: "absolute",
                            inset: 0,
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 0,
                        }}
                    />

                    {/* Content */}
                    <Box sx={{ position: "relative", zIndex: 2, color: "#fff" }} data-aos="zoom-in">
                        <Typography
                            variant="h4"
                            fontWeight={700}
                            sx={{
                                mb: 2,
                                fontSize: { xs: "1.8rem", sm: "2.2rem" },
                                color: "#fff",
                            }}
                        >
                            Ready to Plan Your Dream Wedding?
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 4,
                                maxWidth: 600,
                                mx: "auto",
                                color: "rgba(255,255,255,0.9)",
                            }}
                        >
                            Let us turn your special day into an unforgettable memory. Reach out now and let's bring your vision to life.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                px: 5,
                                py: 1.5,
                                fontSize: "1rem",
                                borderRadius: 3,
                                fontWeight: 600,
                                textTransform: "none",
                            }}
                        >
                            Get in Touch
                        </Button>
                    </Box>
                </Box>

            </Container >

            <FooterComponent />
        </Box >
    );
};

export default AboutUs;
