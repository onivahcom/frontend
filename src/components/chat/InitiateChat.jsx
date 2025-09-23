import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { ChatBubbleTwoTone, Message } from '@mui/icons-material';
import { apiUrl, backendApi } from '../../Api/Api';
import ReusableSnackbar from '../../utils/ReusableSnackbar';

const InitiateChat = ({ userId, vendorId, serviceId, serviceCategory, serviceName, onConversationCreated }) => {

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    const handleStartConversation = async () => {
        try {
            const res = await backendApi.post(`/api/conversations`, {
                userId,
                vendorId,
                serviceId,
                serviceName,
                serviceCategory
            });
            // if (res.data?.conversation) {
            //     onConversationCreated(res.data.conversation);
            // }
            if (res.data?.conversation && typeof onConversationCreated === "function") {
                onConversationCreated(res.data.conversation);
            }

        } catch (error) {
            console.log(error);
            setSnackbar({
                open: true,
                message: error?.response?.data?.error || error?.error || "Something went wrong. Please log in again.",
                severity: "info",
            });
        }
    };

    return (
        <>
            <Button
                variant='contained'
                endIcon={<ChatBubbleTwoTone />}
                sx={{
                    borderRadius: 2,
                    fontWeight: 600,
                }}
                onClick={handleStartConversation}
            >
                Chat Now
            </Button>

            <ReusableSnackbar
                open={snackbar.open}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                message={snackbar.message}
                severity={snackbar.severity}
            />

        </>
    );
};

export default InitiateChat;
