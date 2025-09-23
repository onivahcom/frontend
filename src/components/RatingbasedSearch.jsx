import React, { useState } from 'react';
import axios from 'axios';
import {
    Box,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Alert,
    Card,
    CardContent,
    Stack,
    Chip,
    Grid,
    CardMedia,
    IconButton,
    Modal,
    Backdrop,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import LocationOn from '@mui/icons-material/LocationOn';
import { apiUrl, backendApi } from '../Api/Api';
import { useNavigate } from 'react-router-dom';
import { formatCategory } from './RemoveUnderscore';

const RatingbasedSearch = () => {

    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [rankedServices, setRankedServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSearch, setOpenSearch] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const res = await backendApi.post(`/search-ranked-services`, { query });
            setRankedServices(res.data.rankedServices || []);
        } catch (err) {
            setError('Failed to fetch ranked services.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpen = () => setOpenSearch(true);
    const handleClose = () => {
        setOpenSearch(false);
        setQuery('');
        setRankedServices([]);
        setError(null);
    };

    return (
        <>
            {/* Initial Search Icon Button */}
            {!openSearch && (

                <IconButton
                    size="small"
                    onClick={handleOpen}
                    aria-label="Open search"
                    sx={{
                        bgcolor: 'background.paper',
                        boxShadow: 0,
                        '&:hover': { bgcolor: 'grey.100' },
                    }}
                >
                    <SearchIcon fontSize="medium" />
                </IconButton>

            )}

            {/* Modal with grey backdrop and centered search form */}
            <Modal
                sx={{ zIndex: 9999 }}
                open={openSearch}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                        sx: { bgcolor: 'rgba(0, 0, 0, 0.6)', p: 2, },
                    },
                }}
                aria-labelledby="search-services-title"
                aria-describedby="search-services-description"
            >
                <Box
                    component="form"
                    onSubmit={handleSearch}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        borderRadius: 2,
                        p: 4,
                        width: { xs: '90%', sm: 600 },
                        maxHeight: '90vh',
                        overflowY: "auto",
                        outline: 'none',
                        // Hide scrollbar for WebKit browsers (Chrome, Safari)
                        '&::-webkit-scrollbar': {
                            display: 'none',
                        },
                    }}
                >
                    {/* Close button top-right */}
                    <IconButton
                        onClick={handleClose}
                        sx={{ position: 'absolute', top: 8, right: 8 }}
                        aria-label="Close search"
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component="div"
                        gutterBottom
                        fontWeight={600}
                        align="left"
                        mb={2}
                    >
                        Search
                    </Typography>

                    <Typography
                        variant="caption"
                        component="div"
                        sx={{
                            p: 1.5,
                            mb: 6,
                            borderLeft: '6px solid #4d73ff85', // mild orange border
                            backgroundColor: '#f2f6ff', // very light orange background
                            color: 'black', // deep orange text
                            fontStyle: 'italic',
                            borderRadius: 1,
                            userSelect: 'none',
                            lineHeight: 1.4,
                        }}
                    >
                        You can search by service name or relevant keywords like &quot;hall,&quot; &quot;party,&quot;, and more.
                    </Typography>


                    <Box display="flex" gap={2} flexDirection={{ xs: 'column', sm: 'row' }} sx={{ mb: 6 }}>
                        <TextField
                            size='medium'
                            label="Search your preferences..."
                            variant="outlined"
                            fullWidth
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            disabled={loading}
                            autoFocus
                        />

                        <Button
                            size='medium'
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading || !query.trim()}
                            sx={{ minWidth: 120 }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                        </Button>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <Grid container spacing={3}>
                        {rankedServices.length === 0 && !loading && (
                            <Typography variant="caption" align="center" color="text.secondary" sx={{ width: '100%' }}>
                                No services found. Try a different query.
                            </Typography>
                        )}

                        {rankedServices.map((service) => (
                            <Grid item xs={6} sm={6} md={4} key={service._id}>
                                <Card onClick={() => {
                                    window.open(`/category/${service.category}/${service.linkedServiceId}`, "_blank", "noopener,noreferrer");
                                    // navigate(`/category/${service.category}/${service.linkedServiceId}`);
                                    handleClose();
                                }}
                                    sx={{
                                        cursor: "pointer",
                                        position: 'relative',
                                        boxShadow: 0,
                                        borderRadius: 2,
                                        transition: 'transform 0.2s ease',
                                        '&:hover': {
                                            boxShadow: 0,
                                        },
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                    }}
                                >
                                    {service.images?.CoverImage && (
                                        <CardMedia
                                            component="img"
                                            height="120"
                                            image={service.images.CoverImage[0]}
                                            alt={service.additionalFields.businessName || 'Service Image'}
                                            sx={{ borderRadius: 4 }}
                                        />
                                    )}

                                    <CardContent sx={{ flexGrow: 1, }}>

                                        {/* Category chip top right */}
                                        <Chip
                                            label={formatCategory(service.category) || 'N/A'}
                                            size="small"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                right: 0,
                                                color: '#ffff',
                                                bgcolor: 'black',
                                                fontSize: '0.75rem'
                                            }}
                                        />

                                        <Typography
                                            variant="body2"
                                            component="div"
                                            fontWeight={500}
                                            gutterBottom
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'normal',
                                            }}
                                        >
                                            {service.additionalFields?.businessName || 'No Name'}
                                        </Typography>

                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                mb: 1,
                                            }}
                                        >
                                            {service.additionalFields?.description || 'No description available'}
                                        </Typography>

                                        {/* Locations chips with icon */}
                                        <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" sx={{
                                            display: '-webkit-box',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'normal', // allow wrapping but clamp after 1 line
                                            maxWidth: '100px',    // optional max width to control chip width
                                        }}>
                                            {service.additionalFields?.availableLocations?.map((loc, index) => (
                                                <Chip
                                                    key={index}
                                                    label={loc}
                                                    size="small"
                                                    variant="outlined"
                                                    icon={<LocationOn />}
                                                    sx={{
                                                        color: 'black',
                                                        bgcolor: '#f8f8f8',
                                                        fontSize: '0.55rem',
                                                        alignItems: 'center',
                                                        '& .MuiChip-icon': {
                                                            marginLeft: 0,
                                                            color: 'grey',
                                                            fontSize: 14
                                                        },
                                                    }}
                                                />
                                            ))}
                                        </Stack>

                                    </CardContent>


                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Modal >
        </>
    );
};

export default RatingbasedSearch;
