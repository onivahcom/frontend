import React, { useState } from 'react';
import {
    Box, TextField, Button, Typography, Alert, Divider, InputAdornment,
    Grid, Card, CardMedia, CardContent, CardActions, ThemeProvider
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import theme from '../Themes/theme';

const AddVenue = () => {
    const [venueData, setVenueData] = useState({
        name: '',
        bio: '',
        amount: '',
        description: '',
        state: '',
        city: '',
        country: '',
        pincode: '',
    });
    const [venueImages, setVenueImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [message, setMessage] = useState('');

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + venueImages.length > 3) {
            alert('You can only upload up to 3 images.');
            return;
        }

        const newImagePreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newImagePreviews]);
        setVenueImages(prev => [...prev, ...files]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVenueData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitting Venue:', venueData, venueImages);
        setMessage('Venue submitted successfully and is waiting for approval.');
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ p: 4, backgroundColor: '#f5f5f5', borderRadius: '12px', boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom color="primary" align="start">
                    Add Your Venue
                </Typography>
                <Divider sx={{ mb: 2 }} />

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Venue Name"
                                variant="outlined"
                                name="name"
                                value={venueData.name}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#fff' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Bio"
                                variant="outlined"
                                name="bio"
                                multiline
                                rows={4}
                                value={venueData.bio}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#fff' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Amount (per night)"
                                variant="outlined"
                                name="amount"
                                value={venueData.amount}
                                onChange={handleChange}
                                required
                                type="number"
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#fff' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                variant="outlined"
                                name="description"
                                multiline
                                rows={10}
                                value={venueData.description}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#fff' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="State"
                                variant="outlined"
                                name="state"
                                value={venueData.state}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#fff' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="City"
                                variant="outlined"
                                name="city"
                                value={venueData.city}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#fff' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Country"
                                variant="outlined"
                                name="country"
                                value={venueData.country}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#fff' }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Pincode"
                                variant="outlined"
                                name="pincode"
                                value={venueData.pincode}
                                onChange={handleChange}
                                required
                                sx={{ mb: 2, borderRadius: '8px', backgroundColor: '#fff' }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ mb: 2 }}>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<PhotoCamera />}
                                    fullWidth
                                    sx={{ borderRadius: '8px', }}
                                >
                                    Upload Images (up to 3)
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageChange}
                                    />
                                </Button>
                            </Box>
                        </Grid>

                        {imagePreviews.length > 0 && (
                            <Grid item xs={12}>
                                <Grid container spacing={2}>
                                    {imagePreviews.map((preview, index) => (
                                        <Grid item xs={12} md={4} key={index}>
                                            <Card sx={{ borderRadius: '8px', boxShadow: 2, '&:hover': { boxShadow: 4 } }}>
                                                <CardMedia
                                                    component="img"
                                                    image={preview}
                                                    alt={`Venue Preview ${index + 1}`}
                                                    sx={{
                                                        height: 200,
                                                        objectFit: 'cover',
                                                        borderTopLeftRadius: '8px',
                                                        borderTopRightRadius: '8px',
                                                    }}
                                                />
                                                <CardContent>
                                                    {/* <Typography variant="body2" color="text.secondary">
                                                        Venue Image {index + 1}
                                                    </Typography> */}
                                                </CardContent>
                                                <CardActions>
                                                    <Button size="small" color="error">Remove</Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        )}

                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ mb: 2, mt: 2, width: '200px', textAlign: "center", borderRadius: '20px' }}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {message && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        {message}
                    </Alert>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default AddVenue;
