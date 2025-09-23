import React, { useState, useEffect } from "react";
import {
    Typography,
    Box,
    Grid,
    Card,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import {
    Inventory,
    PendingActions,
    CheckCircle,
    People,
} from "@mui/icons-material";
import adminAxios from "../Api/Api";
import VisitorStats from "./visitorStats";
import { alpha } from "@mui/material/styles";
import { NavLink } from "react-router-dom";

const AdminHome = () => {
    const [servicesData, setServicesData] = useState({
        approved: {},
        pending: {},
        declined: {},
        categories: [],
    });

    useEffect(() => {
        adminAxios.get(`/fetch/dashboard-details`)
            .then(response => setServicesData(response.data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);


    return (
        <div>
            {/* Welcome Section */}
            <Typography variant="subtitle2" color="inherit" gutterBottom>
                Welcome to Admin Dashboard 👋
            </Typography>
            <Typography variant="p" component='div' color="grey">
                Manage your services, requests, and user interactions efficiently.
            </Typography>

            {/* Quick Stats Cards */}
            <Grid container spacing={3} sx={{ mt: 3 }}>
                {[
                    { title: "Approved Services", key: "approved", color: "#4CAF50", icon: <Inventory />, link: "requests/approved" },
                    { title: "Pending Requests", key: "pending", color: "#FFC107", icon: <PendingActions />, link: "requests" },
                    { title: "Declined Requests", key: "declined", color: "#F44336", icon: <CheckCircle />, link: "requests/declined" },
                    { title: "Active Users", key: "users", color: "#3F51B5", icon: <People />, link: "requests" }
                ].map((status, index) => (
                    <Grid item xs={6} md={3} key={index}>
                        <Card
                            component={NavLink}
                            to={`/admin-dashboard/${status.link}`}
                            sx={{
                                textDecoration: "none",
                                p: 2,
                                borderRadius: 3,
                                border: "1px solid #ddd",
                                backgroundColor: "#f8f8f8",
                                boxShadow: 0,
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
                                    transform: "translateY(-3px)",
                                },
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                textAlign: "center",
                            }}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: alpha(status.color, 0.1),
                                    color: status.color,
                                    width: 56,
                                    height: 56,
                                    mb: 2,
                                }}
                            >
                                {status.icon}
                            </Avatar>
                            <Typography variant="body2" fontWeight={600} color="text.secondary">
                                {status.title}
                            </Typography>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    mt: 1,
                                    color: "text.primary",
                                }}
                            >
                                {servicesData[status.key]?.count ?? 0}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>


            <VisitorStats />


            {/* Services Category Details */}
            <Grid container spacing={3} sx={{ mt: 3 }}>

                <Grid item xs={12} md={6}>
                    <Typography variant="subtitle2" sx={{ mb: 4 }} gutterBottom>
                        Service Details by Category
                    </Typography>
                    <TableContainer component={Paper} elevation={0}>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: "#aaaa" }}>
                                    <TableCell sx={{ color: "black", }}>S.No</TableCell>
                                    <TableCell sx={{ color: "black", }}>Category Name</TableCell>
                                    <TableCell sx={{ color: "black", }} align="right">Total Services</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {servicesData.categories.length > 0 ? (
                                    servicesData.categories.map((category, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell>
                                                {category.name
                                                    .replace(/([a-z])([A-Z])/g, "$1 $2") // Split PascalCase
                                                    .replace(/_/g, " ") // Replace underscores
                                                    .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize words
                                                }
                                            </TableCell>
                                            <TableCell align="right">{category.count}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={2} align="center">
                                            No category data available
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>

        </div>
    );
};

export default AdminHome;
