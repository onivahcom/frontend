import React from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import { Message } from '@mui/icons-material';
import { apiUrl, backendApi } from '../../Api/Api';

const InitiateChat = ({ userId, vendorId, serviceId, serviceCategory, onConversationCreated }) => {
    const handleStartConversation = async () => {
        try {
            const res = await backendApi.post(`/api/conversations`, {
                userId,
                vendorId,
                serviceId,
                serviceCategory
            });
            if (res.data?.conversation) {
                onConversationCreated(res.data.conversation);
            }
        } catch (error) {
            console.log('Failed to start conversation', error);
            alert('Error starting conversation');
        }
    };

    return (
        <Button
            endIcon={<Message />}
            sx={{
                // maxWidth: 300,
                height: "50%",
                borderRadius: "10px",
                // width: 'fit-content',
                fontWeight: 600,
                background: "linear-gradient(45deg, #6d4d94, #9b59b6)",
                color: "#fff",
                transition: "0.3s ease",
                '&:hover': {
                    background: "linear-gradient(45deg, #5a3e7b, #884ea0)",
                    transform: "scale(1.02)",
                },
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)"
            }}
            variant='contained'
            onClick={handleStartConversation}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
            Chat Now
        </Button>
    );
};

export default InitiateChat;
