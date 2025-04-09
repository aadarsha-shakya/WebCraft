import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderConfirmation.css'; // Import the CSS file for styling

const OrderConfirmation = () => {
    const navigate = useNavigate();

    useEffect(() => {
        alert('Order Successful!');
    }, []);

    return (
        <div className="order-confirmation-container">
            <h1>Order Confirmation</h1>
            <p>Thank you for your purchase!</p>
            <p>Your order has been placed successfully.</p>
            <button className="back-to-home-button" onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    );
};

export default OrderConfirmation;