import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { apiUrl, backendApi } from "../Api/Api";
import ReusableSnackbar from "../utils/ReusableSnackbar";
import { Box, CircularProgress } from "@mui/material";
import { UserProvider, useUser } from "../context/UserContext";

const ProtectedRoute = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const { user, setUser } = useUser();

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    useEffect(() => {
        const fetchProtectedData = async () => {
            try {
                const response = await backendApi.get(`/protected-route`, {
                    withCredentials: true,
                    headers: { 'Cache-Control': 'no-cache' }
                });
                setUserData(response.data.user);
                setUser(response.data.user)
            }
            catch (error) {
                if (error.response?.status === 403) {
                    try {
                        const refreshRes = await backendApi.get(`/refreshToken/refresh`, {
                            withCredentials: true,
                        });
                        const retryRes = await backendApi.get(`/protected-route`, {
                            withCredentials: true,
                        });
                        setUserData(retryRes.data.user);
                        setUser(retryRes.data.user)
                        return;
                    } catch (refreshError) {
                        setSnackbar({
                            open: true,
                            message: "Session expired. Please log in again.",
                            severity: "warning",
                        });
                        navigate("/");
                        return;
                    }
                }

                // 401 or other errors
                if (error.response?.status === 401) {
                    setSnackbar({
                        open: true,
                        message: "Kindly login to continue.",
                        severity: "warning",
                    });
                    navigate("/");
                }
                else {
                    setSnackbar({
                        open: true,
                        message: "Something went wrong. Please try again later.",
                        severity: "error",
                    });
                }
            } finally {
                setLoading(false);
            }

        };

        fetchProtectedData();
    }, [navigate]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            {userData ? React.cloneElement(children, { userData }) : null}
            <ReusableSnackbar
                open={snackbar.open}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                message={snackbar.message}
                severity={snackbar.severity}
            />
        </>
    );
};

export default ProtectedRoute;
