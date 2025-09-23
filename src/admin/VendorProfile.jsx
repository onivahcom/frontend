import React, { useEffect, useState } from 'react';
import {
    useParams,
    Link as RouterLink,
} from 'react-router-dom';
import {
    Avatar,
    Box,
    Button,
    CircularProgress,
    Container,
    Divider,
    Link,
    Paper,
    Typography,
} from '@mui/material';
import adminAxios from '../Api/Api';
import LocationOn from '@mui/icons-material/LocationOn';
import Email from '@mui/icons-material/Email';
import { Phone } from '@mui/icons-material';

const VendorProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(true);

    useEffect(() => {
        setLoading(true);
        setError(null);

        adminAxios.get(`/vendor/${id}`)
            .then((response) => {
                console.log(response.data);
                setUser(response.data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setError('Failed to fetch user data');
                setLoading(false);
            });
    }, [id]);

    if (loading)
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '60vh',
                }}
            >
                <CircularProgress />
            </Box>
        );

    if (!user)
        return (
            <Container sx={{ mt: 5 }}>
                <Typography variant="h6" color="error">
                    Vendor not found.
                </Typography>
                <Button
                    component={RouterLink}
                    to="/admin-dashboard/list/vendors"
                    variant="outlined"
                    sx={{ mt: 2 }}
                >
                    Back to Vendors List
                </Button>
            </Container>
        );

    return (
        <Box sx={{ mt: 5, width: '100%' }}>
            {/* Back Button */}
            <Button
                component={RouterLink}
                to="/admin-dashboard/list/vendors"
                variant="text"
                sx={{ mb: 3 }}
            >
                ← Back to Vendors List
            </Button>

            {/* User Card */}
            <Paper
                sx={{
                    p: 4,
                    borderRadius: 3,
                    boxShadow: 0,
                    border: "1px solid #ddd",
                    bgcolor: '#f8f8f8',
                    maxWidth: 700,
                    mx: 'auto',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'center', sm: 'flex-start' },
                        gap: 4,
                    }}
                >
                    {/* Profile Section */}
                    <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                        <Avatar
                            src={user.profilePic}
                            alt={`${user.firstName} ${user.lastName}`}
                            sx={{
                                width: 100,
                                height: 100,
                                mb: 1.5,
                                border: '2px solid',
                                borderColor: 'divider',
                            }}
                        />
                        <Typography variant="h6" fontWeight={600}>
                            {user.firstName} {user.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {user.role}
                        </Typography>
                    </Box>

                    {/* Divider for desktop */}
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{ display: { xs: 'none', sm: 'block' } }}
                    />

                    {/* Contact Information */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            sx={{ mb: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}
                        >
                            Contact Information
                        </Typography>

                        <Box sx={{ display: 'grid', rowGap: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Email fontSize="small" color="action" />
                                <Typography variant="body2">{user.email}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Phone fontSize="small" color="action" />
                                <Typography variant="body2">{user.phone}</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn fontSize="small" color="action" />
                                <Typography variant="body2">{user.address}</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>

    );
}

export default VendorProfile;