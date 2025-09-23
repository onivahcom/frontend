import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl, backendApi } from "../Api/Api";

const PendingNotifications = ({ vendorId }) => {
    const [orderCount, setOrderCount] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await backendApi.get(`/vendor/pending-orders/count`, {
                    params: { vendorId },
                });
                setOrderCount(response.data.count);
            } catch (error) {
                console.error("Error fetching order count:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return (
        loading ? (
            <p>Loading orders...</p>
        ) : (
            <p>{orderCount}</p>
        )

    );
};

export default PendingNotifications;
