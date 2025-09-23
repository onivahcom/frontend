import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Paper,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import BlockIcon from '@mui/icons-material/Block';
import LockIcon from '@mui/icons-material/Lock';
import CreditCardIcon from '@mui/icons-material/CreditCard';

const features = [
    {
        title: 'Modern Cards',
        description: 'Up-to-date payment methods for convenience and efficiency.',
        icon: <WalletIcon fontSize="medium" sx={{ color: '#E65100' }} />,
        bgColor: '#FFF3E0',
    },
    {
        title: 'No Extra Fees',
        description: 'Transparent pricing with no hidden charges.',
        icon: <BlockIcon fontSize="medium" sx={{ color: '#0288D1' }} />,
        bgColor: '#E0F7FA',
    },
    {
        title: 'Super Secure',
        description: 'Advanced security measures to protect your transactions.',
        icon: <LockIcon fontSize="medium" sx={{ color: '#F9A825' }} />,
        bgColor: '#FFF8E1',
    },
    {
        title: 'Contactless Payments',
        description: 'Convenient and hygienic transactions with tap-and-go technology.',
        icon: <CreditCardIcon fontSize="medium" sx={{ color: '#388E3C' }} />,
        bgColor: '#E8F5E9',
    },
];

const Highlights = () => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <Box maxWidth="md" mx="auto" sx={{ bgcolor: '#fff', my: { xs: 6, sm: 10 }, px: 2 }}>
            <Box textAlign="center">
                <Typography
                    color='black'
                    textAlign="center"
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        marginBottom: 1,
                        // color: '#5c3d77'
                    }}
                    data-aos='fade-up'
                >
                    Custom-built for financial exchanges
                </Typography>
                <Typography
                    data-aos='fade-up'
                    variant="body2"
                    sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
                >
                    Our platform offers secure and efficient transaction capabilities, tailored to meet diverse payment needs with robust features.
                </Typography>
            </Box>

            <Grid container spacing={2} mt={5}>
                {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Paper
                            elevation={0}
                            sx={{
                                bgcolor: feature.bgColor,
                                borderRadius: 2,
                                p: 3,
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: 1,
                            }}
                            data-aos='fade-up'
                            data-aos-delay={index * (isMobile ? 0 : 200)}
                        >
                            <Box sx={{ fontSize: 24 }}>{feature.icon}</Box>
                            <Typography variant="body1" fontWeight="600">
                                {feature.title}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" lineHeight={1.5}>
                                {feature.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Highlights;
