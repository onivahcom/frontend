import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import { apiUrl, backendApi } from "../Api/Api";
import { useUser } from "../context/UserContext";
import { useLocation } from "react-router-dom";

const RazorpayPayment = ({ amount, buttonAction, currency = "INR", productName = "Test Shop", description = "Test Transaction", bookingDetails }) => {

    const [loading, setLoading] = useState(false);

    const handleBook = async () => {

        const { data } = await backendApi.post(`/api/payments/book`, {
            userId: bookingDetails.userId,
            hostId: bookingDetails.vendorId,
            amount,
            package: {
                title: bookingDetails.package.title,
                description: bookingDetails.package.description,
                price: bookingDetails.package.price,
                dates: bookingDetails.selectedDate,
                additionalRequest: bookingDetails.additionalRequest || ""
            },
            serviceName: bookingDetails.businessName || '',
            category: bookingDetails.category,
            serviceId: bookingDetails._id
        });

        const { order } = data;

        // Razorpay checkout
        const options = {
            key: 'rzp_test_DZs8IAfrdKP18K',
            amount: order.amount,
            currency: order.currency,
            order_id: order.id,
            name: 'Demo Booking',
            handler: function (response) {
                // alert('Payment Authorized! Payment ID: ' + response.razorpay_payment_id);
                try {
                    setLoading(true)

                    const res = backendApi.post(`/api/payments/save-payment`, {
                        userId: bookingDetails.userId,
                        hostId: bookingDetails.vendorId,
                        amount,
                        orderId: order.id,
                        paymentId: response.razorpay_payment_id,
                    });
                    alert('Payment Authorized, waiting for vendor approval!');
                } catch (err) {
                    console.error(err);
                    alert('Failed to save booking!');
                } finally {
                    setLoading(false)
                }
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };



    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;

        // script.onload = () => {
        //     const payBtn = document.getElementById("rzp-button1");
        //     if (payBtn) {
        //         payBtn.addEventListener("click", handleBook);
        //     }
        // };

        document.body.appendChild(script);

        return () => {
            // const payBtn = document.getElementById("rzp-button1");
            // if (payBtn) {
            //     payBtn.removeEventListener("click", handleBook);
            // }
            document.body.removeChild(script);

        };
    }, []);

    return (
        <div style={{ padding: "50px", display: buttonAction ? 'block' : "none" }}>
            <Button id="rzp-button1"
                onClick={handleBook}   // <- call latest state
                fullWidth
                variant="contained"
                color="primary"
                disabled={
                    !bookingDetails?.userId ||          // user missing
                    !bookingDetails?._id || // service missing
                    !bookingDetails?.vendorId || // vendor missing
                    loading                 // still loading
                }
                sx={{ py: 1.5, fontWeight: "medium" }}
            >
                Pay{" "} ₹{amount}/-
            </Button>
        </div>
    );
};

export default RazorpayPayment;
