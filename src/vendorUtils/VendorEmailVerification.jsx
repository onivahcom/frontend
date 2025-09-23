import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Typography, CircularProgress, Alert, Box, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';
import { apiUrl, backendApi } from '../Api/Api';

const VendorEmailVerification = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading'); // 'loading', 'verified', 'expired'
    const [countdown, setCountdown] = useState(5); // Countdown timer

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const response = await backendApi.get(`/vendor/signup/verify/${token}`);
                if (response.data.success) {
                    setStatus('verified');
                    setTimeout(() => {
                        navigate(`${response.data.redirectTo}?email=${response.data.userEmail}`);
                    }, 5000); // Delay for user to read the success message
                } else {
                    setStatus('expired');
                    setTimeout(() => {
                        // alert(response.data.message || 'Verification link has expired. Please request a new link.');
                        navigate(`${response.data.redirectTo}`);
                    }, 5000);

                }
            } catch (error) {
                console.error('Error verifying token:', error);
                setStatus('expired');
                setTimeout(() => {
                    // alert('Verification failed. Please try again.');
                    navigate(`${error.response.data.redirectTo}`);
                }, 5000);
                // Use error.response safely if it exists
                // if (error.response?.data?.redirectTo) {
                //     setTimeout(() => {
                //         alert('Verification link has expired. Please request a new link.');
                //         navigate(`${error.response.data.redirectTo}`);
                //     }, 5000);
                // }
            }
        };

        if (token) {
            verifyUser();
        }
    }, [token, navigate]);

    useEffect(() => {
        // Countdown timer for status changes
        if (status === 'verified' || status === 'expired') {
            const interval = setInterval(() => {
                setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);

            return () => clearInterval(interval); // Cleanup interval
        }
    }, [status]);


    return (
        <>
            <Box
                sx={{
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: '#f9f9f9',
                    borderRadius: '16px',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                    maxWidth: '600px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            >
                <Header />
                {/* Background Image Section */}
                <Box
                    sx={{
                        mt: 10,
                        width: '100%',
                        height: '200px',
                        borderRadius: '10px',
                        overflow: 'hidden',
                        marginBottom: '20px',
                    }}
                >
                    <Box
                        component="img"
                        src="https://img.freepik.com/free-vector/wedding-setup-pink-medieval-castle-ballroom_107791-29682.jpg"
                        alt="Wedding Setup"
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            filter: 'brightness(85%)', // Slight dimming
                        }}
                    />
                </Box>

                {/* Status Messages */}
                {status === 'loading' && (
                    <>
                        <CircularProgress sx={{ color: '#4b769f' }} />
                        <Typography
                            variant="h6"
                            sx={{
                                marginTop: '20px',
                                color: '#333',
                                fontWeight: 500,
                                fontFamily: 'Arial, sans-serif',
                            }}
                        >
                            Verifying your email. Please wait...
                        </Typography>
                    </>
                )}

                {status === 'verified' && (
                    <Alert
                        severity="none"
                        sx={{
                            marginTop: '20px',
                            padding: '20px',
                            backgroundColor: '#1f8a6612',
                            color: '#d32f2f',
                            borderRadius: '10px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <CheckCircleOutlineIcon sx={{ marginRight: '10px', color: 'green' }} />
                        <Box alignItems="center">
                            <Typography
                                color='green'
                                variant="h6"
                                sx={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}
                            >
                                Email Verified Successfully!
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    marginTop: '10px',
                                    color: '#4b4b4b',
                                    fontFamily: 'Arial, sans-serif',
                                }}
                            >
                                Redirecting to password setup in {countdown} seconds...
                            </Typography>
                            <Button
                                href="http://localhost:3001/vendor-login"
                                variant="outlined"
                                color="success"
                                sx={{
                                    marginTop: '15px',
                                    textTransform: 'none',
                                    bgcolor: '#ffffff',
                                    '&:hover': {
                                        bgcolor: '#f0f0f0',
                                    },
                                }}
                            >
                                Click here if not redirected
                            </Button>
                        </Box>
                    </Alert>
                )}

                {status === 'expired' && (
                    <Alert
                        severity="none"
                        sx={{
                            marginTop: '20px',
                            padding: '20px',
                            backgroundColor: '#fbeaea',
                            color: '#d32f2f',
                            borderRadius: '10px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <ErrorOutlineIcon sx={{ marginRight: '10px', color: '#d32f2f' }} />
                        <Box >
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }}
                            >
                                Verification Failed
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    marginTop: '10px',
                                    color: '#4b4b4b',
                                    fontFamily: 'Arial, sans-serif',
                                }}
                            >
                                Redirecting in {countdown} seconds...
                            </Typography>
                            <Button
                                href="http://localhost:3001/vendor-login"
                                variant="outlined"
                                color="error"
                                sx={{
                                    marginTop: '15px',
                                    textTransform: 'none',
                                    bgcolor: '#ffffff',
                                    '&:hover': {
                                        bgcolor: '#f0f0f0',
                                    },
                                }}
                            >
                                Click here if not redirected
                            </Button>
                        </Box>
                    </Alert>
                )}


            </Box>
            <FooterComponent />
        </>
    );
};

export default VendorEmailVerification;
