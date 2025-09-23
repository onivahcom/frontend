// pages/MessagesPage.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import ConversationsList from './ConversationsList';
import ConversationView from './ConversationView';

import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';
import socket from '../../socket';

const MessagesPage = ({ userData }) => {

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const location = useLocation();
    const isChatOpen = location.pathname.split('/').length > 2;

    useEffect(() => {
        if (!userData?._id) return;

        socket.emit("setup", { userId: userData._id });

    }, [userData?._id]);



    return (

        <Box display="flex" height="100vh">
            {/* Show Conversations List */}
            {(!isMobile || !isChatOpen) && (
                <Box
                    width={{ xs: '100%', md: '30%' }}
                    borderRight={{ md: '1px solid #ddd' }}
                    overflow="auto"
                >
                    <ConversationsList userData={userData} />
                </Box>
            )}

            {/* Show Chat View */}
            {(!isMobile || isChatOpen) && (
                <Box
                    width={{ xs: '100%', md: '70%' }}
                    display="block"
                    overflow="auto"
                >
                    <Outlet context={{ userData }} />
                </Box>
            )}
        </Box>
    );
};

export default MessagesPage;
