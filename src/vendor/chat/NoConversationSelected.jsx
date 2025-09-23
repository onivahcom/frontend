// NoConversationSelected.jsx
import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { ChatBubbleOutline } from '@mui/icons-material';

const NoConversationSelected = () => (
    <Box
        height="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        px={2}
    >
        <ChatBubbleOutline sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />

        <Typography variant="h6" color="text.secondary" gutterBottom>
            No messages yet
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
            Once you start a conversation, you'll see it here.
        </Typography>

        <Button variant="text" color="primary">
            Start Chatting
        </Button>
    </Box>
);

export default NoConversationSelected;
