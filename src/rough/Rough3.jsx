import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function VendorAccept() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:4000/api/payments/get-bookings?vendorId=host1234')
            .then(res => setBookings(res.data))
            .catch(err => console.error(err));
    }, []);

    const approveBooking = async (id) => {
        await axios.post(`http://localhost:4000/api/payments/booking/${id}/approve`);
        alert('Booking approved & payment captured!');
        // refresh list
        setBookings(bookings.filter(b => b._id !== id));
    };

    const rejectBooking = async (id) => {
        await axios.post(`http://localhost:4000/api/payments/booking/${id}/reject`);
        alert('Booking rejected');
        setBookings(bookings.filter(b => b._id !== id));
    };

    return (
        <div>
            <h2>Pending Bookings</h2>
            {bookings.map(b => (
                <div key={b._id}>
                    <p>User: {b.userId}</p>
                    <p>Amount: ₹{b.amount}</p>
                    <button onClick={() => approveBooking(b._id)}>Approve</button>
                    <button onClick={() => rejectBooking(b._id)}>Reject</button>
                </div>
            ))}
        </div>
    );
}
