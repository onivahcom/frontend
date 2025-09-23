import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Divider,
    TextField,
    IconButton,
    Paper,
    Button,
    Avatar,
    Card,
    CardContent,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { apiUrl, backendApi } from '../../Api/Api';
import { ArrowBack, ChatBubbleOutline, DoneAll, Payments } from '@mui/icons-material';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from 'emoji-picker-react';
import socket from '../../socket';


const ConversationView = () => {

    const { userData } = useOutletContext();

    const { conversationId } = useParams();

    const location = useLocation();
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [messages, setMessages] = useState([]);
    const [serviceName, setServiceName] = useState('');
    const [vendorPic, setVendorPic] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [userPic, setUserPic] = useState('');
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [conversations, setConversations] = useState([]);

    const userId = userData?._id;

    const fetchMessages = async () => {
        try {
            const res = await backendApi.get(`/api/messages/${conversationId}`);
            setMessages(res.data.messages);
            setServiceName(res.data.serviceName);
            setUserPic(res.data.userPic)
            setVendorPic(res.data.vendorPic)
        } catch (err) {
            console.log('Error fetching messages:', err);
        }
    };

    useEffect(() => {
        if (!conversationId || !userId) return;

        socket.emit("markAsSeen", {
            conversationId,
            userId,
        });

        const handleReceiveMessage = (msg) => {

            if (msg.conversationId === conversationId) {
                // Auto-mark as seen since user is inside this conversation
                socket.emit("markAsSeen", {
                    conversationId: msg.conversationId,
                    userId,
                });
                // Update UI immediately (optimistic)
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("receiveMessage", handleReceiveMessage);

        return () => {
            socket.off("receiveMessage", handleReceiveMessage);
        };

    }, [conversationId, userId]);

    // useEffect(() => {
    //     const handleSeenUpdate = ({ conversationId: updatedConvId }) => {
    //         if (updatedConvId === conversationId) {
    //             fetchMessages(); // OR update message state manually
    //         }
    //         console.log("bluetick set in user");

    //     };

    //     socket.on("seenUpdated", handleSeenUpdate);
    //     return () => socket.off("seenUpdated", handleSeenUpdate);
    // }, [conversationId]);



    useEffect(() => {

        if (conversationId) fetchMessages();

    }, [conversationId]);

    useEffect(() => {
        const handleSeenConfirmation = ({ conversationId: seenConvId, seenBy }) => {
            // console.log("Seen confirmation received:", seenConvId, seenBy);

            if (seenConvId === conversationId) {
                // Just update message state or UI to reflect blue tick
                setMessages((prev) =>
                    prev.map((msg) =>
                        msg.senderId === userId && !msg.seenBy.includes(seenBy)
                            ? { ...msg, seenBy: [...msg.seenBy, seenBy] }
                            : msg
                    )
                );
            }
        };

        socket.on("seenConfirmation", handleSeenConfirmation);
        return () => socket.off("seenConfirmation", handleSeenConfirmation);
    }, [conversationId]);



    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [messages]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);


    const handleSend = async () => {
        const trimmed = newMessage.trim();
        if (!trimmed) return;

        const msgObj = {
            text: trimmed,
            conversationId: conversationId || location.state?.conversationData?._id,
            senderId: userId || location.state?.userId, // Current sender's ID
            senderRole: 'user', // or 'vendor' depending on who's logged in
            seenBy: [userId],
        };

        try {
            const res = await backendApi.post(`/api/messages`, msgObj);

            // Emit real-time to all users
            // socket.emit("sendMessage", msgObj);

            // setMessages((prev) => [...prev, res.data]);
            setNewMessage('');

        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const otherUser = messages.find(msg => msg.senderId !== userId?._id);


    return (
        <Box height="100%" display="flex" flexDirection="column" >
            {/* Message List */}
            <Box flexGrow={1} overflow="auto" key={conversationId}>
                {messages.length === 0 ? (
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

                ) : (

                    <Box
                        sx={{
                            minHeight: '80vh',
                            pb: 5,
                            bgcolor: "#eee",
                            backgroundImage: `url(https://img.freepik.com/free-vector/decorative-vintage-white-design-background_1017-27562.jpg)`,
                            backgroundAttachment: "fixed", // This keeps the image fixed while scrolling
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "cover", // Or "contain", depending on your layout
                            backgroundPosition: "center",
                        }}
                    >

                        <Box
                            display="flex"
                            alignItems="center"
                            p={1.5}
                            // pb={1.5}
                            mb={2}
                            sx={{
                                borderBottom: '1px solid #eee',
                                bgcolor: 'white',
                                position: 'sticky',
                                top: 0,
                                zIndex: 10,
                            }}
                        >
                            {isMobile && (
                                <IconButton onClick={() => navigate('/messages')} sx={{ mr: 0.5 }}>
                                    <ArrowBack sx={{ fontSize: 18 }} />
                                </IconButton>
                            )}

                            {/* Avatar + Name */}
                            <Avatar
                                src={vendorPic || "https://placehold.co/300"} // replace with actual avatar if available
                                alt="User"
                                sx={{ width: 40, height: 40, mr: 1 }}
                            />

                            <Box overflow="hidden">
                                <Typography
                                    variant="subtitle1"
                                    fontWeight="500"
                                    noWrap
                                    title={serviceName || 'User'}
                                >
                                    {serviceName || 'User'}
                                </Typography>
                            </Box>
                        </Box>

                        {messages.map((msg, idx) => {
                            const isCurrentUser = msg.senderId === userId;
                            // || location.state?.conversationData?.userId; // replace with your current user check

                            return (
                                <Box
                                    key={idx}
                                    display="flex"
                                    justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
                                    mb={1.5}
                                    px={1}
                                >
                                    <Box
                                        display="flex"
                                        alignItems="flex-end"
                                        gap={1}
                                        flexDirection={isCurrentUser ? 'row-reverse' : 'row'}
                                        maxWidth="85%"
                                    >
                                        {/* Avatar */}
                                        <Avatar
                                            sx={{
                                                width: 32,
                                                height: 32,
                                            }}
                                            src={isCurrentUser ? userPic : vendorPic || "https://placehold.co/300"}
                                        />

                                        {/* Message Bubble */}
                                        <Box
                                            sx={{
                                                backgroundColor: isCurrentUser ? '#f7f6ff' : '#fff',
                                                color: 'text.primary',
                                                borderRadius: 2,
                                                px: 1.5,
                                                py: 1,
                                                maxWidth: '100%',
                                                position: 'relative',
                                                boxShadow: 1,
                                                borderTopLeftRadius: isCurrentUser ? 12 : 4,
                                                borderTopRightRadius: isCurrentUser ? 4 : 12,
                                                borderBottomLeftRadius: 12,
                                                borderBottomRightRadius: 12,
                                                whiteSpace: 'pre-line',
                                            }}
                                        >
                                            {/* Message Text */}

                                            {msg.type === 'payment_request' ? (

                                                <Card
                                                    sx={{
                                                        width: 'fit-content',
                                                        borderRadius: 3,
                                                        boxShadow: 0,
                                                        gap: 2,
                                                        p: 2,
                                                        bgcolor: '#f2f2f2',
                                                    }}
                                                >

                                                    <CardContent sx={{ p: 0, }}>

                                                        <Typography
                                                            variant="body2"
                                                            component='div'
                                                            color="text.primary"
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={1}
                                                            mb={1}
                                                        >
                                                            Payment Request
                                                        </Typography>

                                                        <Box
                                                            component="img"
                                                            src="https://img.freepik.com/premium-photo/colorful-dynamic-animations-display-when-transaction-is-completed-adding-visually-satisfying_216520-106165.jpg"
                                                            alt="Payment"
                                                            sx={{
                                                                width: 200,
                                                                height: 100,
                                                                borderRadius: 2,
                                                                objectFit: 'cover',
                                                            }}
                                                        />

                                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Amount
                                                            </Typography>
                                                            <Typography variant="body2" fontWeight={600}>
                                                                ₹{parseFloat(msg.text.match(/₹([\d.]+)/)?.[1] || 0).toFixed(2)}
                                                            </Typography>
                                                        </Box>

                                                        {msg.text.includes('Note:') && (
                                                            <Box mb={1}>
                                                                <Typography variant="body2" color="text.secondary">
                                                                    Note
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    fontStyle="italic"
                                                                    sx={{ whiteSpace: 'pre-line' }}
                                                                >
                                                                    {msg.text.match(/Note:\s(.+)\n?/)?.[1]}
                                                                </Typography>
                                                            </Box>
                                                        )}

                                                        {msg.text.match(/\[Pay Now\]\((.*?)\)/) && (
                                                            <Button
                                                                href={msg.text.match(/\[Pay Now\]\((.*?)\)/)[1]}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                variant="contained"
                                                                size="small"
                                                                startIcon={<Payments />}
                                                                sx={{ textTransform: 'none', mt: 1, borderRadius: 1 }}
                                                            >
                                                                Pay Now
                                                            </Button>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            )
                                                :
                                                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                                    {msg.text}
                                                </Typography>
                                            }
                                            {/* Timestamp and Tick */}
                                            <Box
                                                display="flex"
                                                alignItems="center"
                                                justifyContent="flex-end"
                                                gap={0.5}
                                                mt={0.5}
                                            >
                                                <Typography
                                                    variant="caption"
                                                    sx={{ fontSize: '0.7rem', color: 'text.secondary' }}
                                                >
                                                    {new Date(msg.sentAt).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                        hour12: true,
                                                    })}
                                                </Typography>

                                                {/* Seen Tick */}
                                                {isCurrentUser && (
                                                    msg.seenBy?.some(id => id !== userId) ? (
                                                        <DoneAll sx={{ fontSize: 16, color: '#34B7F1' }} /> // Blue ticks
                                                    ) : (
                                                        <DoneAll sx={{ fontSize: 16, color: '#999' }} /> // Grey ticks
                                                    )
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                </Box>


                            );
                        })}
                    </Box>


                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Paper
                component="form"
                elevation={1}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    p: 3,
                    borderTop: '1px solid #f8f8f8',
                }}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                }}
            >

                <Box position="relative">
                    <IconButton onClick={() => setShowEmojiPicker(prev => !prev)}>
                        <EmojiEmotionsIcon color='primary' />
                    </IconButton>

                    {showEmojiPicker && (
                        <Box position="absolute" bottom={60} left={10} zIndex={999}>
                            <EmojiPicker
                                onEmojiClick={(emojiData) =>
                                    setNewMessage((prev) => prev + emojiData.emoji)
                                }
                            />
                        </Box>
                    )}

                </Box>

                <TextField
                    inputRef={inputRef}
                    placeholder="Type a message..."
                    size='small'
                    maxRows={4}
                    fullWidth
                    variant="outlined"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={{ ml: 1, }}
                />
                <IconButton
                    sx={{ bgcolor: "#eeee" }}
                    color="primary"
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                >
                    <SendIcon />
                </IconButton>
            </Paper>
        </Box>
    );
};

export default ConversationView;



{/* <Box
    key={idx}
    display="flex"
    justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
    mb={1.5}
    p={2}
>
    <Box
        display="flex"
        alignItems="flex-end"
        gap={1}
        flexDirection={isCurrentUser ? 'row-reverse' : 'row'}
    >
        <Avatar
            sx={{
                width: 32,
                height: 32,
                fontSize: 14,
            }}
            src={isCurrentUser ? userPic : vendorPic || "https://placehold.co/300"}
        />

        {isCurrentUser && (
            <Box display="flex" alignItems="center" justifyContent="center" mt={0.5}>
                {msg.seenBy?.some(id => id !== userId) ? (
                    <DoneAll fontSize="small" sx={{ color: '#2196f3' }} />
                ) : (
                    <DoneAll fontSize="small" sx={{ color: '#9e9e9e' }} />
                )}
            </Box>
        )}

        <Box
            maxWidth="70%"
            p={1.5}
            borderRadius={2.5}
            sx={{
                backgroundColor: 'grey.100',
                color: 'text.primary',
                borderTopLeftRadius: isCurrentUser ? 16 : 4,
                borderTopRightRadius: isCurrentUser ? 4 : 16,
                whiteSpace: 'pre-line',
                transition: 'all 0.2s ease-in-out',
            }}
        >
            <Typography
                variant="caption"
                fontWeight="medium"
                color="primary"
                sx={{
                    mb: 0.5,
                    display: 'block',
                    maxWidth: 120,
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                }}
                title={isCurrentUser ? 'You' : msg.senderId}
            >
                {isCurrentUser ? 'You' : serviceName}
            </Typography>


            {msg.type === 'payment_request' ? (

                <Card
                    sx={{
                        width: 'fit-content',
                        borderRadius: 3,
                        boxShadow: 0,
                        gap: 2,
                        p: 2,
                        bgcolor: '#f2f2f2',
                    }}
                >

                    <CardContent sx={{ p: 0, }}>

                        <Typography
                            variant="body2"
                            component='div'
                            color="text.primary"
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={1}
                        >
                            Payment Request
                        </Typography>

                        <Box
                            component="img"
                            src="https://img.freepik.com/premium-photo/colorful-dynamic-animations-display-when-transaction-is-completed-adding-visually-satisfying_216520-106165.jpg"
                            alt="Payment"
                            sx={{
                                width: 200,
                                height: 100,
                                borderRadius: 2,
                                objectFit: 'cover',
                            }}
                        />

                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                                Amount
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                                ₹{parseFloat(msg.text.match(/₹([\d.]+)/)?.[1] || 0).toFixed(2)}
                            </Typography>
                        </Box>

                        {msg.text.includes('Note:') && (
                            <Box mb={1}>
                                <Typography variant="body2" color="text.secondary">
                                    Note
                                </Typography>
                                <Typography
                                    variant="body2"
                                    fontStyle="italic"
                                    sx={{ whiteSpace: 'pre-line' }}
                                >
                                    {msg.text.match(/Note:\s(.+)\n?/)?.[1]}
                                </Typography>
                            </Box>
                        )}

                        {msg.text.match(/\[Pay Now\]\((.*?)\)/) && (
                            <Button
                                href={msg.text.match(/\[Pay Now\]\((.*?)\)/)[1]}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="contained"
                                size="small"
                                startIcon={<Payments />}
                                sx={{ textTransform: 'none', mt: 1, borderRadius: 1 }}
                            >
                                Pay Now
                            </Button>
                        )}
                    </CardContent>
                </Card>

            ) : (
                <Typography variant="body2">{msg.text}</Typography>
            )}

            <Box display="flex" justifyContent="flex-end" mt={0.5}>
                <Typography
                    variant="caption"
                    color='text.secondary'
                    sx={{ fontSize: '0.7rem' }}
                >
                    {new Date(msg.sentAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                </Typography>
            </Box>
        </Box>
    </Box>
</Box> */}