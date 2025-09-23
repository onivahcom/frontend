import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
} from '@mui/material';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        eventType: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await backendApi.post(`/user/contact`, formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            alert(response.data.message || 'Form submitted successfully!');
            setFormData({
                fullName: '',
                email: '',
                phoneNumber: '',
                eventType: '',
                message: '',
            });
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Something went wrong, please try again.');
        }
    };

    return (
        <Grid item xs={12} md={6}>
            <Box
                sx={{
                    background: "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(14px)",
                    borderRadius: 4,
                    p: { xs: 3, sm: 5 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
                data-aos="fade-up"
            >
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", height: "100%" }}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
                            Get in Touch
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
                            We'd love to be part of your story. Reach out for a free consultation!
                        </Typography>

                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Full Name"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Phone"
                                    type="tel"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    fullWidth
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Event Type</InputLabel>
                                    <Select
                                        name="eventType"
                                        value={formData.eventType}
                                        onChange={handleChange}
                                    >
                                        <MenuItem value="catering">Catering</MenuItem>
                                        <MenuItem value="mandapam">Mandapam</MenuItem>
                                        <MenuItem value="decors">Decors</MenuItem>
                                        <MenuItem value="mehendi">Mehendi</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </Box>

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        sx={{
                            mt: 4,
                            py: 1.5,
                            fontWeight: "bold",
                            borderRadius: 3,
                            fontSize: "1rem",
                            textTransform: "none",
                            alignSelf: "flex-start",
                        }}
                    >
                        Submit
                    </Button>
                </form>
            </Box>
        </Grid>
    );
};

export default ContactForm;
