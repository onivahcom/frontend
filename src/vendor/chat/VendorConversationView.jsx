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
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { apiUrl, backendApi } from '../../Api/Api';
import { ArrowBack, ChatBubbleOutline, DoneAll } from '@mui/icons-material';
import { useMediaQuery, useTheme } from '@mui/material';
import PaymentRequestButton from './PaymentRequestButton';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import EmojiPicker from 'emoji-picker-react';
import Payments from '@mui/icons-material/Payments';
import socket from '../../socket';


const VendorConversationView = () => {

    const { vendor } = useOutletContext();

    const { conversationId } = useParams();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [vendorPic, setVendorPic] = useState('');
    const [userPic, setUserPic] = useState('');
    const [serviceName, setServiceName] = useState('');

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const userId = vendor?._id;

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    //  Listen for incoming messages
    // useEffect(() => {
    //     socket.on("receiveMessage", (msg) => {
    //         setMessages((prev) => [...prev, msg]);
    //     });

    //     return () => {
    //         socket.off("receiveMessage"); // Clean up
    //     };
    // }, []);

    // Fetch messages when conversationId changes
    const fetchMessages = async () => {
        try {
            const res = await backendApi.get(`/api/messages/${conversationId}`);
            // console.log(res.data);
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
    //         console.log("bluetick set in vendor");

    //     };

    //     socket.on("seenUpdated", handleSeenUpdate);
    //     return () => socket.off("seenUpdated", handleSeenUpdate);
    // }, [conversationId]);

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


    useEffect(() => {

        if (conversationId) fetchMessages();

    }, [conversationId]);






    // useEffect(() => {
    //     if (!userId) return;

    //     const handleReceiveMessage = (msg) => {
    //         setMessages((prev) => [...prev, msg]);
    //     };

    //     socket.on("receiveMessage", handleReceiveMessage);

    //     return () => {
    //         socket.off("receiveMessage", handleReceiveMessage);
    //     };
    // }, [userId]);

    // useEffect(() => {
    //     if (!conversationId || !userId) return;

    //     socket.emit("markAsSeen", {
    //         conversationId,
    //         userId,
    //     });
    // }, [conversationId, userId]);

    // useEffect(() => {
    //     if (conversationId) fetchMessages();
    //     if (conversationId && userId) {
    //         socket.emit("markAsSeen", { conversationId, userId });
    //     }
    //     const handleSeenUpdate = ({ conversationId: updatedConvId }) => {
    //         if (updatedConvId === conversationId) {
    //             console.log("afad");
    //             fetchMessages(); // Your custom function to re-fetch messages
    //         }
    //     };

    //     socket.on("seenUpdated", handleSeenUpdate);

    //     return () => {
    //         socket.off("seenUpdated", handleSeenUpdate); // Cleanup to avoid duplicate listeners
    //     };
    // }, [conversationId]);


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
            conversationId: conversationId,
            senderId: vendor?._id, // Current sender's ID
            senderRole: 'vendor', // or 'vendor' depending on who's logged in
            seenBy: [vendor?._id], // only sender has seen it

        };

        try {
            const res = await backendApi.post(`/api/messages`, msgObj);
            // socket.emit("sendMessage", msgObj);
            // setMessages((prev) => [...prev, res.data]);
            setNewMessage('');
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const handlePaymentRequestMessage = async ({ link, amount, note }) => {
        // console.log("adf");
        const formattedAmount = `₹${parseFloat(amount).toFixed(2)}`;
        const messageText = `💰 *Payment Request*\nAmount: ${formattedAmount}` +
            (note ? `\nNote: ${note}` : '') +
            `\n\n👉 [Pay Now](${link})`;

        const msgObj = {
            text: messageText,
            conversationId,
            senderId: vendor._id,
            senderRole: 'vendor',
            type: 'payment_request' // used by frontend to render as payment message
        };

        try {
            const res = await backendApi.post(`/api/messages`, msgObj);
            setMessages((prev) => [...prev, res.data]);
            // fetchMessages();
        } catch (err) {
            console.error('Failed to send payment message:', err);
        }
    };





    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const otherUser = messages.find(msg => msg.senderId !== vendor?._id);


    return (
        <Box height="100%" display="flex" flexDirection="column">
            {/* Message List */}
            <Box flexGrow={1} overflow="auto" >
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
                    size="small"
                    fullWidth
                    variant="outlined"
                    multiline
                    maxRows={4}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    sx={{
                        ml: 1,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ccc', // default border
                            },
                            '&:hover fieldset': {
                                borderColor: '#ccc', // hover color
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#ccc', // light blue or any lighter color
                                // boxShadow: '0 0 0 2px rgba(144, 202, 249, 0.2)', // optional soft glow
                            },
                        },
                    }}
                />


                <PaymentRequestButton vendor={vendor}
                    onPaymentRequest={handlePaymentRequestMessage}
                    customerId={otherUser?.senderId}
                    conversationId={conversationId}
                />

                <IconButton
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    sx={{
                        ml: 1,
                        bgcolor: 'primary.main',
                        color: 'white',
                        borderRadius: '50%',
                        width: 40,
                        height: 40,
                        boxShadow: 1,
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            bgcolor: 'primary.dark',
                            transform: 'scale(1.05)',
                        },
                        '&:disabled': {
                            bgcolor: 'grey.300',
                            color: 'grey.600',
                            cursor: 'not-allowed',
                        }
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>

            </Paper>
        </Box >
    );
};

export default VendorConversationView;
