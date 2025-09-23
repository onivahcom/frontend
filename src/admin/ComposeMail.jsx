import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles for Quill
import { Box, TextField, Button, Typography, Grid, CircularProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { apiUrl } from '../Api/Api';
import axios from 'axios';
import adminAxios from '../Api/Api';

const ComposeMail = () => {
    const [recipient, setRecipient] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await adminAxios.post(`/send-email`, { recipient, subject, message });
            setStatus('Email Sent Successfully!');
        } catch (err) {
            setStatus('Failed to send email. Please try again.');
        } finally {
            setSending(false);
        }
    };


    return (
        <Box sx={{ width: '80%', margin: 'auto', mt: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Compose Mail
            </Typography>

            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    {/* Recipient Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="To"
                            variant="outlined"
                            fullWidth
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            required
                        />
                    </Grid>

                    {/* Subject Field */}
                    <Grid item xs={12}>
                        <TextField
                            label="Subject"
                            variant="outlined"
                            fullWidth
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            required
                        />
                    </Grid>

                    {/* Quill Text Editor */}
                    <Grid item xs={12}>
                        <Typography variant="h6" gutterBottom>
                            Message
                        </Typography>
                        <ReactQuill
                            value={message}
                            onChange={setMessage}
                            theme="snow"
                            placeholder="Write your message here"
                        />
                    </Grid>

                    {/* Send Button */}
                    <Grid item xs={12} display="flex" justifyContent="center">
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ padding: 1, fontSize: '1rem', maxWidth: 200 }}
                            disabled={sending}
                        >
                            {sending ? <CircularProgress size={24} color="secondary" /> : 'Send'}
                        </Button>
                    </Grid>
                </Grid>
            </form>

            {/* Status Message */}
            {status && (
                <Box sx={{ mt: 3, textAlign: 'center', color: 'green' }}>
                    <CheckCircle sx={{ fontSize: 40, color: 'green', mb: 1 }} />
                    <Typography variant="h6">{status}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ComposeMail;
