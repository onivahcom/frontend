import React, { useState } from 'react';
import axios from 'axios';

export default function Booking() {
    const [amount, setAmount] = useState(1000);

    const handleBook = async () => {
        const { data } = await axios.post('https://backend.onivah.com/api/payments/book', {
            userId: 'user1234',
            hostId: 'host1234',
            amount
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
                alert('Payment Authorized! Payment ID: ' + response.razorpay_payment_id);
                try {
                    const res = axios.post('https://backend.onivah.com/api/payments/save-payment', {
                        userId: 'user123',
                        hostId: 'host123',
                        amount,
                        orderId: order.id,
                        paymentId: response.razorpay_payment_id,
                    });
                    alert('Booking saved, waiting for vendor approval!');
                } catch (err) {
                    console.error(err);
                    alert('Failed to save booking!');
                }
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <div>
            <h1>Book Property</h1>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)} />
            <button onClick={handleBook}>Book Now</button>
        </div>
    );
}
