import React from "react";
import {
    Box,
    Button,
    Container,
    Grid,
    Paper,
    Typography,
    useTheme,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import EmailIcon from "@mui/icons-material/Email";
import CommentIcon from "@mui/icons-material/Comment";
import Header from "../components/Header";
import FooterComponent from "../components/FooterComponent";
import ContactForm from "../utils/ContactForm";

const ContactCard = ({ icon, iconBg, title, subtitle, action, actionType }) => {
    return (
        <Paper
            elevation={0}
            sx={{
                p: 4,
                border: "1px solid #ddd",
                bgcolor: "#ffff",
                maxWidth: 300,
                mx: "auto",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                borderRadius: 2,
            }}
        >
            <Box
                sx={{
                    mb: 3,
                    p: 2,
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: iconBg,
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    mx: "auto",
                }}
                aria-hidden="true"
            >
                {icon}
            </Box>

            <Box textAlign="center">
                <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="text.primary"
                    gutterBottom
                >
                    {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {subtitle}
                </Typography>
            </Box>

            <Box mt={4} textAlign="center">

                <Typography
                    variant="body2"
                    color="text.primary"
                    fontWeight={600}
                    sx={{ wordBreak: "break-word" }}
                >
                    {action}
                </Typography>

            </Box>
        </Paper>
    );
};

export default function ContactPage() {
    const theme = useTheme();

    return (
        <Box>
            <Header />
            <Box
                component="section"
                sx={{
                    pt: { xs: 12, sm: 16 },
                    pb: { xs: 8, sm: 10 },
                    px: { xs: 1, sm: 5, md: 8, lg: 12 },
                    bgcolor: "#fbfbff",
                }}
            >
                <Container maxWidth="lg" sx={{ textAlign: "center" }}>
                    <Typography
                        variant="h4"
                        fontWeight={800}
                        color="#1B2A41"
                        sx={{ lineHeight: 1.2 }}
                    >
                        We are here for you,
                        <br />
                        contact us at{" "}
                        <Box component="span" color="primary.main">
                            anytime
                        </Box>
                    </Typography>

                    <Typography
                        variant="body1"
                        color="#1B2A41"
                        sx={{ mt: 2, maxWidth: 600, mx: "auto", mb: 6 }}
                    >
                        Have any questions about our services or just want to talk with us? Please
                        reach out.
                    </Typography>

                    <Grid
                        container
                        spacing={{ xs: 3, sm: 4 }}
                        justifyContent="center"
                        sx={{ mt: 6 }}
                    >
                        <Grid item xs={12} sm={6} md={4}>
                            <ContactCard
                                icon={<ChatIcon />}
                                iconBg="#BBD1FF"
                                title="Chat Now"
                                subtitle="Right from this website"
                                action="Start chat"
                                actionType="text"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <ContactCard
                                icon={<EmailIcon />}
                                iconBg="#D9C9FF"
                                title="Email Us"
                                subtitle="From your email app"
                                action="support@doormat.ca"
                                actionType="text"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <ContactCard
                                icon={<CommentIcon />}
                                iconBg="#FFBDBD"
                                title="Call or text us"
                                subtitle="From your phone"
                                action="+91 9876543210"
                                actionType="text"
                            />
                        </Grid>
                    </Grid>

                    <Box
                        sx={{
                            mt: 6,
                            maxWidth: 500,
                            mx: "auto",
                            bgcolor: "white",
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: "grey.300",
                            py: 2,
                            px: 3,
                            mb: 4,
                            color: "#1B2A41",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            textAlign: "center",
                        }}
                    >
                        We'll get back to you as soon as possible. Our team is available 8am–6pm
                        on weekdays.
                    </Box>



                    <ContactForm />

                </Container>


            </Box>
            <FooterComponent />
        </Box>
    );
}
