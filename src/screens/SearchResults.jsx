import React, { useEffect, useState } from 'react';
import { Card, CardMedia, CardContent, Typography, IconButton, Grid } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios';
import withLoadingAndError from '../hoc/withLoadingAndError';
import { apiUrl, backendApi } from '../Api/Api';
import { Link } from 'react-router-dom';

const SearchResults = ({ loading, setLoading, error, setError }) => {
    const [topPicksData, setTopPicksData] = useState([]);

    // Fetch top picks data from the API
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await backendApi.get(`/landing/toppicks`);

                setTopPicksData(response.data.top_picks);
            } catch (err) {
                setError('Error fetching top picks');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [setLoading, setError]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <Grid container spacing={5}>
            {topPicksData.map(pick => (
                <Grid item xs={12} sm={6} md={4} key={pick._id}>
                    <Link to={`/category/${pick.venue_id}`} style={{ textDecoration: 'none' }} target='_blank'>
                        <Card
                            sx={{
                                position: 'relative',
                                borderRadius: 2,
                                overflow: 'hidden',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                            }}
                        >
                            <CardMedia component="img" height="140" image={pick.imageUrl} alt={pick.name} /> {/* Display first image */}
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Typography variant="body5" sx={{ fontWeight: "500" }} gutterBottom>{pick.name}</Typography>
                                <Typography variant="body2" color="text.secondary">Price: {pick.price}</Typography>
                                <Typography variant="body2" color="text.secondary">Ratings: {pick.ratings} <StarIcon fontSize="small" sx={{ color: "black", }} /></Typography>
                                <IconButton aria-label="add to favorites" color="error" sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                                    <FavoriteIcon sx={{ color: "white" }} />
                                </IconButton>
                            </CardContent>
                        </Card>
                    </Link>
                </Grid>
            ))}
        </Grid>
    );
};

// Enhance the TopPicks component with loading and error handling
export default withLoadingAndError(SearchResults);
