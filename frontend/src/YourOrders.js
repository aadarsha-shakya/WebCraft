import React from 'react';
import { useNavigate } from 'react-router-dom';
import './YourOrders.css'; // Import the CSS file for styling

const YourOrders = () => {
    const navigate = useNavigate();

    const handleOkClick = () => {
        navigate('/YourWeb');
    };

    return (
        <div className="your-orders-container">
            <div className="order-success">
                <div className="tick-icon">&#10004;</div>
                <h1>Thank you for your purchase!</h1>
                <p>Your order has been placed successfully.</p>
                <button className="ok-button" onClick={handleOkClick}>OK</button>
            </div>
        </div>
    );
};

export default YourOrders;