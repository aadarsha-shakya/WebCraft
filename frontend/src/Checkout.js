import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Checkout.css'; // Import the CSS file for styling

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]); // Simulate cart items
    const [orderDetails, setOrderDetails] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        orderNote: '',
        cityDistrict: '',
        address: '',
        landmark: '',
        paymentMethod: 'cash_on_delivery', // Default payment method
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Function to calculate total price
    const calculateTotalPrice = useCallback(() => {
        const total = cartItems.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
        setTotalPrice(total);
    }, [cartItems]);

    // Simulate fetching cart items
    useEffect(() => {
        // Replace this with actual cart data retrieval logic
        const mockCartItems = [
            {
                productId: 1,
                productName: 'Product A',
                variantName: 'Red',
                size: 'M',
                quantity: 1,
                sellingPrice: 1200,
                imageUrl: '/uploads/product_a.jpg',
            },
        ];
        setCartItems(mockCartItems);
        calculateTotalPrice();
    }, [calculateTotalPrice]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };

    const handlePaymentMethodChange = (method) => {
        setOrderDetails((prevDetails) => ({
            ...prevDetails,
            paymentMethod: method,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (orderDetails.paymentMethod === 'khalti') {
            } else {
                // Simulate sending order details to the backend for cash on delivery
                const response = await axios.post('/api/orders', {
                    ...orderDetails,
                    cartItems,
                    totalPrice,
                });

                if (response.status === 200) {
                    alert('Order placed successfully!');
                    // Redirect to order confirmation page
                    navigate('/order-confirmation');
                }
            }
        } catch (error) {
            console.error('Error placing order:', error);
            setError('Failed to place the order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            <button className="back-button" onClick={handleBack}>Back</button>
            <div className="checkout-content">
                {/* General Information */}
                <div className="section">
                    <h2>1. General Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="fullName">Full Name *</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={orderDetails.fullName}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={orderDetails.email}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phoneNumber">Phone Number *</label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={orderDetails.phoneNumber}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="orderNote">Order Note (any message for us)</label>
                            <textarea
                                id="orderNote"
                                name="orderNote"
                                value={orderDetails.orderNote}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                </div>

                {/* Delivery Address */}
                <div className="section">
                    <h2>2. Delivery Address</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="cityDistrict">City / District *</label>
                            <input
                                type="text"
                                id="cityDistrict"
                                name="cityDistrict"
                                value={orderDetails.cityDistrict}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="address">Address *</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={orderDetails.address}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="landmark">Landmark</label>
                            <input
                                type="text"
                                id="landmark"
                                name="landmark"
                                value={orderDetails.landmark}
                                onChange={handleInputChange}
                            />
                        </div>
                    </form>
                </div>

                {/* Payment Methods */}
                <div className="section">
                    <h2>3. Payment Methods</h2>
                    <div className="payment-methods">
                        <div
                            className={`payment-method ${orderDetails.paymentMethod === 'cash_on_delivery' ? 'selected' : ''}`}
                            onClick={() => handlePaymentMethodChange('cash_on_delivery')}
                        >
                            <img src="/images/cash-on-delivery.png" alt="Cash on Delivery" />
                            <p>Cash on Delivery</p>
                        </div>
                        <div
                            className={`payment-method ${orderDetails.paymentMethod === 'khalti' ? 'selected' : ''}`}
                            onClick={() => handlePaymentMethodChange('khalti')}
                        >
                            <img src="/images/khalti-logo.png" alt="Khalti" />
                            <p>Khalti</p>
                        </div>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <ul>
                        {cartItems.map((item, index) => (
                            <li key={index}>
                                <img src={`/uploads/${item.imageUrl}`} alt={item.productName} style={{ width: '50px', height: '50px' }} />
                                <span>{item.productName}</span>
                                <span>Variant: {item.variantName}</span>
                                <span>Size: {item.size}</span>
                                <span>Rs {item.sellingPrice} x {item.quantity}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="summary-total">
                        <p>Sub-total</p>
                        <p>Rs {totalPrice}</p>
                    </div>
                    <div className="summary-total">
                        <p>Total</p>
                        <p>Rs {totalPrice}</p>
                    </div>
                    {error && <p className="error">{error}</p>}
                    <button type="submit" className="place-order-button" disabled={loading} onClick={handleSubmit}>
                        {loading ? 'Placing Order...' : 'Place Order'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;