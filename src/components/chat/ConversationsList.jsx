import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import {
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Typography,
    Box,
    Avatar,
    Stack,
    Badge,
    TextField,
    IconButton
} from '@mui/material';
import { apiUrl, backendApi } from '../../Api/Api';
import { ArrowBack, Chat } from '@mui/icons-material';
import socket from '../../socket';
import { formatCategory } from '../RemoveUnderscore';

const ConversationsList = ({ userData }) => {


    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { id: activeId } = useParams();

    const segments = location.pathname.split("/");
    const convoId = segments[segments.length - 1];
    const [searchQuery, setSearchQuery] = useState("");

    // useEffect(() => {
    //     backendApi.get(`/api/conversations`)
    //         .then(res => setConversations(res.data))
    //         .catch(err => console.log(err));
    // }, [])

    const userId = userData?._id;

    useEffect(() => {
        socket.on("seenUpdated", ({ conversationId, userId: seenBy }) => {

            setConversations(prev =>
                prev.map(conv =>
                    conv._id === conversationId
                        ? { ...conv, unseenCount: 0 }
                        : conv
                )
            );
        });

        return () => {
            socket.off("seenUpdated");
        };
    }, []);


    useEffect(() => {
        const loadConversations = async () => {
            if (!userId) return;

            try {
                // Fetch all conversations
                const [convsRes, unseenRes] = await Promise.all([
                    backendApi.get(`/api/conversations/user/${userId}`),
                    backendApi.get(`/api/messages/unseenCounts/${userId}`)
                ]);

                const convs = convsRes.data.conversations;
                const unseenMap = unseenRes.data; // assuming this is an array of { conversationId, unseenCount }

                // Create a map for fast lookup
                const unseenCountMap = {};
                unseenMap.forEach(({ _id, unseenCount }) => {
                    unseenCountMap[_id] = unseenCount;
                });


                // Merge unseen count into conversations
                const merged = convs.map(conv => ({
                    ...conv,
                    unseenCount: unseenCountMap[conv._id] || 0
                }));

                setConversations(convs);

            } catch (err) {
                console.error('Error loading conversations or unseen counts:', err);
            }
        };

        loadConversations();
    }, [userId]);

    useEffect(() => {
        socket.on("newMessageNotification", ({ conversationId, senderId, message }) => {

            // Don't increment if you're already inside the chat
            if (conversationId === convoId) return;
            setConversations(prev =>
                prev.map(conv =>
                    conv._id === conversationId
                        ? { ...conv, unseenCount: (conv.unseenCount || 0) + 1 }
                        : conv
                )
            );
        });

        return () => {
            socket.off("newMessageNotification");
        };
    }, [convoId]);


    useEffect(() => {
        if (!convoId) return;

        setConversations(prev =>
            prev.map(conv =>
                conv._id === convoId
                    ? { ...conv, unseenCount: 0 }
                    : conv
            )
        );
    }, [convoId]);




    const handleSelect = (conversation) => {
        navigate(`/messages/${conversation._id}`, {
            state: location.state // keep passing state for context
        });
    };

    // This is the temporary conversation from state
    const temporaryConversation = location.state?.conversationData?._id && !conversations.find(c => c._id === location.state.conversationData._id)
        ? [location.state.conversationData]
        : [];

    // const allConversations = [...temporaryConversation, ...conversations];

    const allConversations = [...temporaryConversation, ...conversations].filter((conv) => {
        const query = searchQuery.toLowerCase();

        const category = conv.serviceCategory ? formatCategory(conv.serviceCategory).toLowerCase() : "";
        const name = conv.serviceName ? conv.serviceName.toLowerCase() : "";

        return category.includes(query) || name.includes(query);
    });


    return (
        <Box sx={{
            // bgcolor: '#f8f8f8',
            minHeight: '100vh',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
                width: 0,
                height: 0,
            },
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE 10+
        }}>
            <Box
                sx={{
                    bgcolor: 'white',
                    px: 3,
                    py: 2,
                    borderBottom: '1px solid #e0e0e0',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    width: "100%"
                }}
            >
                <Stack direction="column" alignItems="start" spacing={1} sx={{ width: "100%" }}>

                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", bgcolor: "#f8f8f8", mt: 2 }}>
                        <IconButton
                            size='small'
                            onClick={() => navigate('/')}
                            sx={{
                                bgcolor: '#f1f1f1',
                                '&:hover': { bgcolor: '#e0e0e0' },
                            }}
                        >
                            <ArrowBack sx={{ fontSize: 18 }} />
                        </IconButton>

                        <Typography
                            variant="h6"
                            component="div"
                            fontWeight={600}
                            color="primary.main"
                        >
                            Messaging
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 1.5,
                            bgcolor: '#ffffff',
                            boxShadow: 0,
                            borderRadius: 2,
                            width: "100%",
                        }}
                    >


                        <TextField
                            placeholder="Search users"
                            variant="outlined"
                            size="small"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{
                                flex: 1,
                                backgroundColor: '#f9f9f9',
                                borderRadius: 2,
                                '& fieldset': {
                                    borderColor: '#ccc',
                                },
                                '&:hover fieldset': {
                                    borderColor: '#aaa',
                                },
                            }}
                        />
                    </Box>

                </Stack>
            </Box>


            <List
                disablePadding
                sx={{
                    bgcolor: '#f8f8f8',
                }}
            >
                {allConversations.length === 0 ? (
                    <Box p={2}>
                        <Typography variant="body2" color="text.secondary" align="center">
                            No conversations found.
                        </Typography>
                    </Box>
                ) : (
                    allConversations.map((conv, index) => (
                        <React.Fragment key={conv._id}>

                            <ListItem disablePadding selected={activeId === conv._id}>
                                <ListItemButton onClick={() => handleSelect(conv)} sx={{

                                    backgroundColor: convoId === conv._id ? "#F0EBFF" : "#FFF",
                                    borderLeft: convoId === conv._id ? "4px solid #7B61FF" : "4px solid transparent",
                                    borderRadius: 2,
                                    py: 1.5,
                                    px: 2,
                                    cursor: "pointer",
                                    boxShadow: convoId === conv._id ? "0 0 8px rgba(123, 97, 255, 0.3)" : "none",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        backgroundColor: "#f9f9f9",
                                    },

                                    // py: 1.5, px: 2, borderBottom: "1px solid #dddd",
                                    // bgcolor: convoId === conv._id ? "blueviolet" : "red"
                                }}>
                                    <Box display="flex" alignItems="center" width="100%" gap={2}>
                                        {/* Avatar (only if new conversation from state) */}
                                        {/* {location.state?.conversationData?.vendorId &&
                                            conv._id === location.state.conversationData._id ? (
                                            <Avatar
                                                src="https://placehold.co/600" // Replace with dynamic vendor image
                                                alt="Vendor Avatar"
                                                sx={{ width: 48, height: 48 }}
                                            />
                                        ) : (
                                            <Avatar src={conv.vendorId.profilePic || 'https://placehold.co/600'} sx={{ width: 48, height: 48 }}>
                                                {conv.vendorId.profilePic || 'C'}
                                            </Avatar>

                                        )} */}

                                        <Badge
                                            badgeContent={conv.unseenCount}
                                            color="error"
                                            overlap="circular"
                                        // invisible={conv.unseenCount === 0}
                                        >
                                            <Avatar src={conv.serviceImage || 'https://placehold.co/600'} sx={{ width: 40, height: 40 }} />
                                        </Badge>

                                        {/* Text Section */}
                                        <Box flex={1}>
                                            <Typography variant="caption" fontWeight={500} sx={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "normal", // allows wrapping for line-clamp
                                            }}>
                                                {`${location.state?.conversationData?.serviceName || conv.serviceName || conv.serviceCategory}`}
                                            </Typography>

                                            {/* {location.state?.conversationData?.vendorId &&
                                                conv._id === location.state.conversationData._id && ( */}
                                            <Typography component='div' variant="caption" color="text.secondary" mt={0.5}>
                                                {/* to:   {formatCategory(conv.serviceCategory)} */}
                                                vendor:  {conv.vendorId?.firstName || location.state?.conversationData?.vendorId}
                                            </Typography>
                                            {/* )} */}
                                        </Box>
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                            {index !== allConversations.length - 1 && <Divider />}
                        </React.Fragment>

                    ))
                )}
            </List>
        </Box>
    );
};

export default ConversationsList;
