import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
    Button,
    Snackbar,
    FormHelperText,
    Paper,
    Grid,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Header from '../components/Header';
import FooterComponent from '../components/FooterComponent';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { apiUrl, backendApi } from '../Api/Api';
import axios from 'axios';

const VendorPassword = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { email, phone } = location.state || {};  // Destructuring the state

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Handle form submission
    const handleSubmit = async (e) => {

        if (!email || !phone) {
            setError('Something went wrong!');
            setOpenSnackbar(true);
            navigate("/vendor-login")
            return;
        }

        e.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setOpenSnackbar(true);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setOpenSnackbar(true);
            return;
        }

        try {
            // Make API call to backend to save the password
            const response = await backendApi.post(`/vendor/set-password`, {
                email,
                phone,
                password,
            }, { withCredentials: true });

            if (response.data.success) {
                // localStorage.setItem('vendor_token', response.data.token);

                setSuccessMessage('Password successfully set');
                setOpenSnackbar(true);

                // Navigate to vendor-services page
                setTimeout(() => navigate('/vendor-dashboard'), 2000);
            } else {
                setError(response.data.message || 'An error occurred');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setError('Failed to set password. Please try again.');
            setOpenSnackbar(true);
        }
    };
    // Toggle password visibility
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    // Close the Snackbar
    const handleSnackbarClose = () => setOpenSnackbar(false);

    return (
        <Box>
            <Header />
            <Box
                sx={{
                    backgroundImage: `url(https://img.freepik.com/free-photo/beautiful-flowers-arrangement_23-2149347306.jpg?uid=R133306793&ga=GA1.1.1773690977.1730112906&semt=ais_hybrid&w=740)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: 2,
                }}
            >


                {/* Right Side - Form */}
                <Box sx={{
                    maxWidth: 420,
                    width: "100%",
                    borderRadius: 4,
                    backdropFilter: "blur(8px)",
                    backgroundColor: "rgba(255,255,255,0.85)",
                    textAlign: "center",
                }}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: 4,
                            borderRadius: 2,
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <Typography variant="h5" align="center" gutterBottom>
                            Set Your Password
                        </Typography>
                        <Typography variant="body2" color="textSecondary" align="center" gutterBottom>
                            Create a strong password to secure your account.
                        </Typography>
                        <form onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal" error={Boolean(error)}>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowPassword}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>

                            <FormControl fullWidth margin="normal" error={Boolean(error)}>
                                <InputLabel htmlFor="confirmPassword">Confirm Password</InputLabel>
                                <Input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleClickShowConfirmPassword}>
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                {error && <FormHelperText>{error}</FormHelperText>}
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{
                                    marginTop: 3,
                                    paddingY: 1.5,
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    textTransform: 'none',
                                }}
                            >
                                Set Password
                            </Button>
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                display="block"
                                mt={2}
                            >
                                Need help? Contact support@onivah.com
                            </Typography>
                        </form>

                        <Snackbar
                            open={openSnackbar}
                            autoHideDuration={6000}
                            onClose={handleSnackbarClose}
                            anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position it at the top right
                            message={successMessage || error}
                        />
                    </Paper>
                </Box>
            </Box>
            <FooterComponent />
        </Box>
    );
};

export default VendorPassword;
