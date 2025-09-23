import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiUrl, backendApi } from "../Api/Api";

const OrderNotification = ({ vendorId }) => {
    const [orderCount, setOrderCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await backendApi.get(`/vendor/orders/count`, {
                    params: { vendorId },
                });
                setOrderCount(response.data.count || 0);
            } catch (error) {
                console.error("Error fetching order count:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    return orderCount; // 🔑 return just number, not JSX

};

export default OrderNotification;
