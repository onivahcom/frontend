// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiUrl, backendApi } from '../Api/Api';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [vendor, setVendor] = useState(null);

    useEffect(() => {
        // const token = localStorage.getItem('vendor_token');

        // if (!token) {
        //     return navigate('/vendor-login'); // Redirect if no token
        // }

        const verifyToken = async () => {
            try {
                const response = await backendApi.get(`/vendor/verify-token`, { withCredentials: true });

                if (response.data.success) {
                    setIsAuthenticated(true);
                    setVendor(response.data.vendor); // Set the vendor data
                } else {
                    localStorage.removeItem('vendor_token');
                    setIsAuthenticated(false);
                    navigate('/vendor-login');
                }
            } catch (error) {
                localStorage.removeItem('vendor_token');
                setIsAuthenticated(false);
                navigate('/vendor-login');
            }
        };

        verifyToken();
    }, [navigate]);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // You can show a loading spinner or similar
    }

    return (
        <>
            {/* {React.Children.map(children, (child) => */}
            {React.cloneElement(children, { vendor })}
            {/* )} */}
        </>
    );
};

export default ProtectedRoute;
