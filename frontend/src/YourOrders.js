import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './YourOrders.css'; // Import the CSS file for styling
import axios from 'axios';

const YourOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch the user's orders from the backend
        const fetchOrders = async () => {
            try {
                const loggedInUserId = localStorage.getItem('userId'); // Ensure userId is available
                if (!loggedInUserId) {
                    alert('User not logged in. Redirecting to login...');
                    window.location.href = '/login';
                    return;
                }
                const response = await axios.get(`http://localhost:8081/api/orders/user/${loggedInUserId}`);
                setOrders(response.data);
                alert('Order Successful!');
            } catch (error) {
                console.error('Error fetching orders:', error);
                alert('Failed to fetch orders.');
            }
        };

        fetchOrders();
    }, [navigate]);

    return (
        <div className="your-orders-container">
            <h1>Your Orders</h1>
            <p>Thank you for your purchase!</p>
            <p>Your order has been placed successfully.</p>
            <div className="order-details">
                <h2>Order Details</h2>
                <ul>
                    {orders.map((order) => (
                        <li key={order.id}>
                            <span><strong>Order ID:</strong> {order.id}</span>
                            <span><strong>Full Name:</strong> {order.full_name}</span>
                            <span><strong>Email:</strong> {order.email}</span>
                            <span><strong>Phone Number:</strong> {order.phone_number}</span>
                            <span><strong>Order Note:</strong> {order.order_note}</span>
                            <span><strong>City District:</strong> {order.city_district}</span>
                            <span><strong>Address:</strong> {order.address}</span>
                            <span><strong>Landmark:</strong> {order.landmark}</span>
                            <span><strong>Payment Method:</strong> {order.payment_method}</span>
                            <span><strong>Transaction ID:</strong> {order.transaction_id}</span>
                            <span><strong>Transaction Amount:</strong> Rs {order.transaction_amount}</span>
                            <span><strong>Transaction State:</strong> {order.transaction_state}</span>
                            <span><strong>Purchase Order ID:</strong> {order.purchase_order_id}</span>
                            <span><strong>Total Price:</strong> Rs {order.total_price}</span>
                            <span><strong>Cart Items:</strong> {JSON.stringify(JSON.parse(order.cart_items))}</span>
                            <span><strong>Created At:</strong> {new Date(order.created_at).toLocaleString()}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <button className="back-to-home-button" onClick={() => navigate('/')}>
                Back to Home
            </button>
        </div>
    );
};

export default YourOrders;