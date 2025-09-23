import React from "react";
import {
    Card,
    CardContent,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemButton,
    Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotificationsPage = () => {
    const navigate = useNavigate();

    // Dummy data (replace with API response later)
    const notifications = [
        {
            id: 1,
            title: "New Order Received",
            content: "You have received a new order from John Doe",
            url: "/vendor-dashboard/orders/123",
        },
        {
            id: 2,
            title: "Message from Client",
            content: "Riya sent you a new message",
            url: "/vendor-dashboard/messages/456",
        },
        {
            id: 3,
            title: "Service Approved",
            content: "Your catering service has been approved",
            url: "/vendor-dashboard/manage-services",
        },
    ];

    return (
        <Card sx={{ maxWidth: 800, margin: "auto", mt: 4, borderRadius: 3 }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Notifications
                </Typography>

                <List>
                    {notifications.length === 0 ? (
                        <Typography color="text.secondary">No notifications</Typography>
                    ) : (
                        notifications.map((notif, index) => (
                            <React.Fragment key={notif.id}>
                                <ListItem disablePadding>
                                    <ListItemButton onClick={() => navigate(notif.url)}>
                                        <ListItemText
                                            primary={notif.title}
                                            secondary={notif.content}
                                            primaryTypographyProps={{ fontWeight: 500 }}
                                            secondaryTypographyProps={{ color: "text.secondary" }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                {index < notifications.length - 1 && <Divider />}
                            </React.Fragment>
                        ))
                    )}
                </List>
            </CardContent>
        </Card>
    );
};

export default NotificationsPage;
