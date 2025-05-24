// PaymentSuccess.js
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Optionally, you can perform additional actions here, like showing a success message
        // For now, we'll just redirect to the YourOrders page
        navigate('/YourOrders');
    }, [navigate]);

    return (
        <div>
            <h1>Payment Successful</h1>
            <p>Your order has been placed successfully!</p>
        </div>
    );
};

export default PaymentSuccess;