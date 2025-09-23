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
    IconButton,
    TextField
} from '@mui/material';
import { apiUrl, backendApi } from '../../Api/Api';
import { ArrowBack, Chat, ChatBubbleOutline } from '@mui/icons-material';
import socket from '../../socket';
import { formatCategory } from '../../components/RemoveUnderscore';

const VendorConversationsList = () => {

    const { vendor } = useOutletContext();

    const [conversations, setConversations] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const { id: activeId } = useParams();
    const segments = location.pathname.split("/");
    const convoId = segments[segments.length - 1];
    const [searchQuery, setSearchQuery] = useState("");

    const vendorId = vendor?._id;

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
            if (!vendorId) return;

            try {
                // Fetch all conversations
                const [convsRes, unseenRes] = await Promise.all([
                    backendApi.get(`/api/conversations/vendor/${vendorId}`),
                    backendApi.get(`/api/messages/unseenCounts/${vendorId}`)
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
                // console.log(merged);
                setConversations(merged);

            } catch (err) {
                console.error('Error loading conversations or unseen counts:', err);
            }
        };

        loadConversations();
    }, [vendorId]);

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


    // useEffect(() => {

    //     if (!vendorId) return;

    //     backendApi.get(`/api/conversations/vendor/${vendorId}`)
    //         .then(res => {
    //             console.log(res.data);
    //             setConversations(res.data.conversations);
    //         })
    //         .catch(err => {
    //             console.error('Error fetching conversations:', err);
    //         });
    // }, [vendorId]);




    const handleSelect = (conversation) => {
        navigate(`/vendor-dashboard/messages/${conversation._id}`, {
            state: location.state // keep passing state for context
        });
    };


    // This is the temporary conversation from state
    const temporaryConversation = location.state?.conversationData?._id && !conversations.find(c => c._id === location.state.conversationData._id)
        ? [location.state.conversationData]
        : [];

    const allConversations = [...temporaryConversation, ...conversations].filter(conv =>
        conv.userId?.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.serviceName?.toLowerCase().includes(searchQuery.toLowerCase())

    );

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
                            onClick={() => navigate(-1)}
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
                                    // py: 1.5, px: 2, borderBottom: "1px solid #dddd" 
                                }}>
                                    <Box display="flex" alignItems="center" width="100%" gap={2}>
                                        {/* Avatar (only if new conversation from state) */}
                                        {/* {location.state?.conversationData?.vendorId &&
                                            conv._id === location.state.conversationData._id ? (
                                            <Avatar
                                                src={"https://placehold.co/600"} // Replace with dynamic vendor image
                                                alt="Vendor Avatar"
                                                sx={{ width: 48, height: 48 }}
                                            />
                                        ) : (
                                            <Avatar src={conv.userId?.profilePic || 'https://placehold.co/600'} sx={{ width: 48, height: 48 }}>
                                                {conv.userId?.profilePic || 'C'}
                                            </Avatar>
                                        )} */}
                                        <Avatar src={conv.userId?.profilePic || 'https://placehold.co/600'} sx={{ width: 40, height: 40 }} />
                                        <Badge
                                            badgeContent={conv.unseenCount}
                                            color="primary"
                                            overlap="circular"
                                            sx={{ position: "absolute", right: "10%" }}
                                        // invisible={conv.unseenCount === 0}
                                        >

                                        </Badge>

                                        {/* Text Section */}
                                        <Box flex={1}>
                                            <Typography variant="caption" fontWeight={500}>
                                                {` ${conv.userId?.firstname || conv.userId?._id || location.state?.conversationData?.serviceCategory}`}
                                            </Typography>

                                            {/* {location.state?.conversationData?.vendorId &&
                                                conv._id === location.state.conversationData._id && ( */}
                                            <Typography variant="caption" component='div' color="text.secondary" mt={0.5} sx={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 1,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "normal", // allows wrapping for line-clamp
                                            }}>
                                                to: {formatCategory(conv.serviceName) || location.state?.conversationData?.vendorId}
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

export default VendorConversationsList;
