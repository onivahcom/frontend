// // pages/MessagesPage.jsx
// import React from 'react';
// import { useOutletContext, Outlet } from 'react-router-dom';
// import VendorConversationsList from "../../vendor/chat/VendorConversationsList";
// import { Box, } from '@mui/material';

// const VendorMessagesPage = () => {

//     const { vendor } = useOutletContext();

//     return (
//         <Box display="flex" height="90vh">
//             {/* Left side: List of conversations */}
//             <Box
//                 width={{ xs: '100%', md: '30%' }}
//                 borderRight={{ md: '1px solid #ddd' }}
//                 overflow="auto"
//             >
//                 <VendorConversationsList />
//             </Box>

//             {/* Right side: renders child routes like <VendorConversationView /> */}
//             <Box
//                 display={{ xs: 'none', md: 'block' }}
//                 width="70%"
//                 overflow="auto"
//             >
//                 <Outlet context={{ vendor }} />
//             </Box>
//         </Box>
//     );
// };

// export default VendorMessagesPage;


// pages/MessagesPage.jsx
import React, { useEffect } from 'react';
import { useOutletContext, Outlet, useLocation } from 'react-router-dom';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import VendorConversationsList from '../../vendor/chat/VendorConversationsList';
import socket from '../../socket';

const VendorMessagesPage = () => {
    const { vendor } = useOutletContext();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const location = useLocation();
    const isChatOpen = location.pathname.split('/').length > 3;

    useEffect(() => {
        if (!vendor?._id) return;

        socket.emit("setup", { userId: vendor._id });

        console.log("[Client] 🛠️ Emitted setup with:", vendor._id);
    }, [vendor]);

    return (
        <Box display="flex" height="100vh">
            {/* Show Conversations List */}
            {(!isMobile || !isChatOpen) && (
                <Box
                    width={{ xs: '100%', md: '30%' }}
                    borderRight={{ md: '1px solid #ddd' }}
                    overflow="auto"
                >
                    <VendorConversationsList />
                </Box>
            )}

            {/* Show Chat View */}
            {(!isMobile || isChatOpen) && (
                <Box
                    width={{ xs: '100%', md: '70%' }}
                    display="block"
                    overflow="auto"
                >
                    <Outlet context={{ vendor }} />
                </Box>
            )}
        </Box>
    );
};

export default VendorMessagesPage;
