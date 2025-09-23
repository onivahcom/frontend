import React from 'react';
import { Box, Typography } from '@mui/material';

const MessageBubble = ({ message, isOwn }) => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: isOwn ? 'flex-end' : 'flex-start',
                mb: 1
            }}
        >
            <Box
                sx={{
                    maxWidth: '60%',
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: isOwn ? '#1976d2' : '#eee',
                    color: isOwn ? 'white' : 'black'
                }}
            >
                <Typography variant="body2">{message.text}</Typography>
                <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                    {new Date(message.sentAt).toLocaleTimeString()}
                </Typography>
            </Box>
        </Box>
    );
};

export default MessageBubble;
