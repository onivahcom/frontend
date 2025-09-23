import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, IconButton } from '@mui/material';
import { apiUrl } from '../Api/Api';
import { CheckCircle } from '@mui/icons-material';
import adminAxios from '../Api/Api';

const InboxPage = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await adminAxios.get(`/get/contacts`);
                setContacts(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching contact data:', err);
                setLoading(false);
            }
        };
        fetchContacts();
    }, []);

    const markAsRead = async (contactId) => {
        try {
            const response = await adminAxios.put(`/contacts/${contactId}/mark-read`);
            const updatedContact = response.data;
            setContacts((prevContacts) =>
                prevContacts.map((contact) =>
                    contact._id === updatedContact._id ? updatedContact : contact
                )
            );
        } catch (err) {
            console.error('Error marking contact as read:', err);
        }
    };

    if (loading) {
        return <Typography variant="h6" align="center">Loading...</Typography>;
    }

    return (
        <Box sx={{ marginTop: 5 }}>
            <Typography variant="h4" align="center" gutterBottom>
                Inbox
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Full Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Event Type</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.slice().reverse().map((contact, index) => (
                            <TableRow
                                key={index}
                                sx={{
                                    backgroundColor: contact.isRead ? '#f0f0f0' : 'white',
                                }}
                            >
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{contact.fullName}</TableCell>
                                <TableCell>{contact.email}</TableCell>
                                <TableCell>{contact.phoneNumber}</TableCell>
                                <TableCell>{contact.eventType}</TableCell>
                                <TableCell>{contact.message}</TableCell>
                                <TableCell>
                                    {contact.isRead ?

                                        <IconButton>
                                            <CheckCircle sx={{ color: 'green' }} />
                                        </IconButton>
                                        :

                                        <Button
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => markAsRead(contact._id)}
                                        >
                                            Mark as Read
                                        </Button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default InboxPage;
