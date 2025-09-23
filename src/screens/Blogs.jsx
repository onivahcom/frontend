import React, { useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Card,
    CardContent,
    CardMedia,
    Button,
    Container,
    TextField,
    IconButton,
    InputAdornment,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';
import theme from '../Themes/theme';
import { Search } from '@mui/icons-material';

const blogs = [
    {
        title: 'Why Choose Mandabams for Traditional Weddings?',
        description: 'Explore the timeless charm of Mandabams and their importance in hosting traditional weddings with cultural authenticity.',
        image: 'https://t4.ftcdn.net/jpg/06/35/08/91/360_F_635089195_fYH8B50BYiYSylu8GRcqpTXhNHyGM51B.jpg',
        category: 'Weddings',
    },
    {
        title: 'Party Halls for Birthdays and More',
        description: 'Make your celebrations memorable with party halls designed for birthdays, anniversaries, and intimate gatherings.',
        image: 'https://www.chennaiconventioncentre.com/wp-content/uploads/2019/03/ccc-blog-824x412.jpg',
        category: 'Parties',
    },
    {
        title: 'Beach Weddings: A Dream Come True',
        description: 'Discover the magic of tying the knot by the sea. Tips and ideas for hosting a perfect beach wedding.',
        image: 'https://cdn0.weddingwire.in/vendor/5442/3_2/640/jpeg/whatsapp-image-2023-01-30-at-17-23-10-1_15_65442-168932744092706.jpeg',
        category: 'Weddings',
    },
    {
        title: 'Catering Services: Savor the Best',
        description: 'Learn why professional catering is essential for any event and how to choose the perfect menu.',
        image: 'https://kasikannucateringworld.in/assets/images/catering-services-in-chennai.webp',
        category: 'Catering',
    },
    {
        title: 'Decors That Set the Stage',
        description: 'Transform your venue with decors that capture your vision and theme perfectly.',
        image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?cs=srgb&dl=pexels-fotios-photos-1090638.jpg&fm=jpg',
        category: 'Decor',
    },
    {
        title: 'Wedding Photography Tips',
        description: 'Capture every precious moment with professional photography. Tips for choosing the best photographer.',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbgGPh7VKKDSRh5nbCm9GWEc15l2lz4HhLxA&s',
        category: 'Photography',
    },
];

const Blogs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    const filteredBlogs = blogs.filter((blog) => {
        const matchesCategory =
            selectedCategory === 'All' || blog.category === selectedCategory;
        const matchesSearch =
            blog.title.toLowerCase().includes(searchTerm) ||
            blog.description.toLowerCase().includes(searchTerm);
        return matchesCategory && matchesSearch;
    });

    return (
        <Box>
            <Header />

            <Container maxWidth='lg' sx={{ p: 2, backgroundColor: '#f8f9fa', minHeight: '100vh', mt: 10, borderRadius: 5 }}>

                <Box textAlign="center" mb={5} >
                    <Typography variant="h6" color='primary' mx='auto' sx={{ bgcolor: "#faf4fe", width: "fit-content", p: 1, borderRadius: 5, fontWeight: 600 }} gutterBottom>
                        Our Blogs
                    </Typography>
                    <Typography variant="p" component='div' maxWidth='md' color="grey" sx={{ mx: 'auto', }}>
                        Tips, ideas, and inspiration for planning your perfect event.
                    </Typography>
                </Box>


                {/* Search and Filter */}
                <Box
                    sx={{
                        mb: 4,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'center',
                        gap: 2,
                        alignItems: 'center',
                    }}
                >
                    <TextField
                        size='small'
                        placeholder="Search blogs..."
                        variant="outlined"
                        fullWidth
                        sx={{ maxWidth: { xs: '100%', md: '30%' } }}
                        onChange={handleSearch}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Box
                        sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: 1,
                        }}
                    >
                        {['All', 'Weddings', 'Parties', 'Catering', 'Decor', 'Photography'].map((category) => (
                            <Button
                                key={category}
                                variant={selectedCategory === category ? 'contained' : 'outlined'}
                                onClick={() => handleCategoryChange(category)}
                                sx={{ fontSize: { xs: '0.75rem', md: '1rem' } }}
                            >
                                {category}
                            </Button>
                        ))}
                    </Box>
                </Box>


                {/* Blogs Grid */}
                <Grid container spacing={4} sx={{ p: { xs: 0, md: 3 } }}>
                    {filteredBlogs.map((blog, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index} >
                            <Card
                                sx={{
                                    mx: 'auto',
                                    boxShadow: 0,
                                    bgcolor: "#ffff",
                                    borderRadius: 5,
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={blog.image}
                                    alt={blog.title}
                                    sx={{ borderRadius: 5 }}
                                />
                                <CardContent>
                                    <Typography
                                        variant="body2"
                                        component='div'
                                        color="primary"
                                        sx={{
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            fontWeight: 'bold',
                                            mb: 1,
                                        }}
                                    >
                                        {blog.title}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        color="textSecondary"
                                        sx={{
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {blog.description}
                                    </Typography>


                                    {/* <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                        <Button align="center" variant="contained" sx={{ mt: 2 }}>
                                            View All
                                        </Button>
                                    </Box> */}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>

            <FooterComponent />
        </Box >
    );
};

export default Blogs;
