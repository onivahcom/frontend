import React from 'react';
import { Avatar, Box, Button, Container, Grid, Link, TextField, ThemeProvider, Typography, IconButton, Divider } from '@mui/material';
import theme from '../Themes/theme';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import CreditCardIcon from '@mui/icons-material/CreditCard';

import LinkedInIcon from '@mui/icons-material/LinkedIn';

const FooterComponent = () => {
    return (
        <ThemeProvider theme={theme}>
            {/* e8d8ff */}
            <Divider sx={{ borderColor: '#f8f8f8', py: 1, bgcolor: '#ffff', }} />

            <Box component="footer" sx={{ borderTop: '1px solid #f8f8f8', bgcolor: '#f8f8f8', color: '#333', py: 6, }}>



                <Container maxWidth="lg">
                    {/* Grid Links */}
                    <Grid container spacing={4} justifyContent="space-between">
                        {/* About */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                About
                            </Typography>
                            {['How it works', 'Careers', 'Blog', 'Investor Relations'].map((item, idx) => (
                                <Link key={idx} href="#" variant="body2" underline="hover" display="block" sx={{ color: '#555', mb: 0.5 }}>
                                    {item}
                                </Link>
                            ))}
                        </Grid>

                        {/* Support */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Support
                            </Typography>
                            {['Help Center', 'Cancellation Options', 'Trust & Safety', 'Contact Us'].map((item, idx) => (
                                <Link key={idx} href="#" variant="body2" underline="hover" display="block" sx={{ color: '#555', mb: 0.5 }}>
                                    {item}
                                </Link>
                            ))}
                        </Grid>

                        {/* Shop */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Shop Categories
                            </Typography>
                            {['Fashion', 'Electronics', 'Home & Living', 'Beauty & Wellness'].map((item, idx) => (
                                <Link key={idx} href="#" variant="body2" underline="hover" display="block" sx={{ color: '#555', mb: 0.5 }}>
                                    {item}
                                </Link>
                            ))}
                        </Grid>

                        {/* Language / Currency */}
                        <Grid item xs={12} sm={6} md={3}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">
                                Social
                            </Typography>
                            <Box mb={1}>
                                🌐 <Typography component="span" variant="body2" ml={1}>+91 98765 43210</Typography>
                            </Box>
                            <Box>
                                💱 <Typography component="span" variant="body2" ml={1}>onivah@gmail.com</Typography>
                            </Box>

                            <Box display="flex" gap={2} mt={2}>
                                <IconButton
                                    sx={{
                                        bgcolor: "#3b5998",
                                        p: 0.8,
                                        color: "#fff",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            bgcolor: "#2d4373", // darker Facebook blue
                                            boxShadow: "0 4px 12px rgba(59, 89, 152, 0.4)",
                                        },
                                    }}
                                    size="small"
                                >
                                    <FacebookIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                    sx={{
                                        bgcolor: "#1DA1F2",
                                        p: 0.8,
                                        color: "#fff",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            bgcolor: "#0d8ddb",
                                            boxShadow: "0 4px 12px rgba(29, 161, 242, 0.4)",
                                        },
                                    }}
                                    size="small"
                                >
                                    <TwitterIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                    sx={{
                                        bgcolor: "#E1306C",
                                        p: 0.8,
                                        color: "#fff",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            bgcolor: "#c41e5e",
                                            boxShadow: "0 4px 12px rgba(225, 48, 108, 0.4)",
                                        },
                                    }}
                                    size="small"
                                >
                                    <InstagramIcon fontSize="small" />
                                </IconButton>

                                <IconButton
                                    sx={{
                                        bgcolor: "#0077b5",
                                        p: 0.8,
                                        color: "#fff",
                                        transition: "all 0.3s ease",
                                        "&:hover": {
                                            bgcolor: "#005983",
                                            boxShadow: "0 4px 12px rgba(0, 119, 181, 0.4)",
                                        },
                                    }}
                                    size="small"
                                >
                                    <LinkedInIcon fontSize="small" />
                                </IconButton>
                            </Box>



                            {/* Social */}
                            {/* <Box display="flex" gap={2} mt={2}>
                                {[FacebookIcon, TwitterIcon, InstagramIcon].map((Icon, idx) => (
                                    <Icon key={idx} sx={{ fontSize: 24, color: "#555", cursor: "pointer", '&:hover': { color: '#000' } }} />
                                ))}
                            </Box> */}
                        </Grid>
                    </Grid>

                    <Box maxWidth='lg' sx={{ p: 2, mx: "auto", mt: 5 }}>
                        <Box sx={{ bgcolor: '#826e9a', py: 5, borderRadius: 5 }}>
                            <Container maxWidth="lg">
                                <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="h6" fontWeight="bold" sx={{ color: "white" }}>Stay in the loop</Typography>
                                        <Typography variant="body2" sx={{ color: "white" }}>Be the first to hear about our deals and latest updates.</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }}>
                                            <TextField fullWidth placeholder="Enter your email" variant="outlined" size="small" sx={{ bgcolor: "white" }} />
                                            <Button sx={{ width: "fit-content", px: 2, bgcolor: 'primary.dark' }} variant="contained" size="small">Subscribe</Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Container>
                        </Box>
                    </Box>

                    {/* Divider + Bottom Section */}
                    <Box mt={6} pt={4} borderTop="1px solid grey" display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" color="textSecondary">
                            &copy; {new Date().getFullYear()} onivah — All rights reserved
                        </Typography>
                        <Box display="flex" gap={3} mt={{ xs: 2, sm: 0 }}>
                            <Link href="#" variant="body2" color="textSecondary" underline="hover">Privacy</Link>
                            <Link href="#" variant="body2" color="textSecondary" underline="hover">Terms</Link>
                            <Link href="#" variant="body2" color="textSecondary" underline="hover">Sitemap</Link>
                        </Box>
                    </Box>
                </Container>
            </Box>

        </ThemeProvider>
    );
};

export default FooterComponent;