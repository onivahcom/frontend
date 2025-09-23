import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography, Box, CircularProgress, Grid, Stack } from '@mui/material';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';

const PhoneNumber = ({ usedPhone, onsubmit, verifyOpen, userData }) => {

    useEffect(() => {
        setShowVerifyOption(verifyOpen)
    }, [verifyOpen])

    const [isEditable, setIsEditable] = useState(false);
    const [phone, setPhone] = useState(usedPhone);  // Initially empty, or set a default Indian phone number if required
    const [isVerified, setIsVerified] = useState(false);
    const [showVerifyOption, setShowVerifyOption] = useState(verifyOpen);  // To track if we should show the verify option
    const [otp, setOtp] = useState('');
    const [canResendOtp, setCanResendOtp] = useState(true);  // Track resend button state

    const handlePhoneChange = (value) => {
        const formattedPhoneNumber = value ? `+${value}` : "";

        console.log("Phone number with country code:", formattedPhoneNumber);
        setPhone(formattedPhoneNumber);
    };

    const handleEditClick = () => {
        setIsEditable(true);
        setShowVerifyOption(false);  // Reset verify option when editing
    };

    const handleCancelClick = () => {
        setIsEditable(false);
        setShowVerifyOption(false);  // Reset verify option when cancelling
    };

    const handleVerifyClick = () => {
        onsubmit(phone);
        // setShowVerifyOption(true);
    };

    const handleConfirmVerification = () => {

        if (!otp || otp.trim() === '') { // Check if otp is empty or null
            alert('Please enter a valid OTP.');
            return; // Exit function if OTP is empty or null
        }

        if (userData._id) {
            // If OTP is not empty or null, proceed with the request
            backendApi.post(`/profile/verify-otp`, { otp, phone, userId: userData._id })  // Pass userData.id
                .then((response) => {
                    if (response.data.success) {
                        setIsVerified(true);
                        setIsEditable(false);
                        setShowVerifyOption(!verifyOpen);
                    } else {
                        console.log(response.data);
                        alert(response.data.message,);
                    }
                })
                .catch((error) => {
                    alert('Incorrect OTP. Please try again.');
                });
        }
    };


    const handleResendOtp = () => {
        if (!canResendOtp) return;

        setCanResendOtp(false);
        setTimeout(() => {
            setCanResendOtp(true);
            alert('OTP Resent');
        }, 2000);
    };

    return (
        <>

            <Grid spacing={0} container>

                <Grid item xs={10}>
                    {/* Phone Input */}
                    {isEditable ? (
                        <PhoneInput
                            country="IN"
                            value={phone}
                            onChange={handlePhoneChange}
                            inputStyle={{ width: '100%', borderRadius: '5px', fontSize: '16px' }}
                        />
                    ) : (
                        <TextField
                            label='Phone'
                            fullWidth
                            disabled={true}
                            value={phone}
                            variant="outlined"
                            InputProps={{
                                readOnly: true,
                            }}
                        />
                    )}
                </Grid>
                <Grid item xs={2}>

                    {/* Toggle Edit Button */}
                    {!isEditable && (

                        <Button onClick={handleEditClick} variant="text" sx={{ marginTop: 2, width: '100%', maxWidth: 150 }}>
                            {!phone ? 'Add' : 'Change'}
                        </Button>
                    )}
                </Grid>
            </Grid>


            {/* Show Cancel Button while editing */}
            {isEditable && (
                <Grid container spacing={2}>
                    <Grid item xs={6}>

                        <Button onClick={handleCancelClick} variant="outlined" color="secondary" sx={{ marginTop: 2, width: '100%' }}>
                            Cancel
                        </Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button
                            onClick={handleVerifyClick}
                            variant="outlined"
                            color="primary"
                            sx={{ marginTop: 2, width: '100%' }}
                            disabled={!phone}
                        >
                            Verify
                        </Button>
                    </Grid>

                </Grid>
            )}

            {/* Show verification if phone is entered */}
            {phone && isEditable && !isVerified && (
                <>


                    {/* Display verification option */}
                    {showVerifyOption && (
                        <Box sx={{ marginTop: 2 }}>
                            <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
                                Enter the OTP to verify the phone number.
                            </Typography>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />

                            <Grid container>

                                <Grid item xs={6}>
                                    <Button
                                        onClick={handleResendOtp}
                                        variant="text"
                                        sx={{ marginTop: 1, width: '100%', textTransform: 'none' }}
                                        disabled={!canResendOtp}
                                    >
                                        {canResendOtp ? 'Resend OTP' : 'Please wait before resending'}
                                    </Button>
                                </Grid>
                                <Grid item xs={6}>
                                    <Button
                                        onClick={handleConfirmVerification}
                                        variant="contained"
                                        sx={{ width: '100%' }}
                                    >
                                        Confirm OTP
                                    </Button>
                                </Grid>
                            </Grid>



                        </Box>
                    )}


                </>
            )}

            {/* Display verification status */}
            {isVerified && (
                <Typography variant="body2" color="green" sx={{ marginTop: 2 }}>
                    Phone Verified!
                </Typography>
            )}

            {/* If no phone is entered, show empty field */}
            {!phone && isEditable && (
                <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                    Please enter a phone number to verify.
                </Typography>
            )}
        </>
    );
};

export default PhoneNumber;
