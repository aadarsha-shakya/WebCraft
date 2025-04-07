import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './Checkout.css'; // Import the CSS file for styling
import { useCart } from './CartContext'; // Import useCart hook

const Checkout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, clearCart } = useCart(); // Use useCart hook
    const [orderDetails, setOrderDetails] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        orderNote: '',
        cityDistrict: '', // Default city district
        address: '',
        landmark: '',
        paymentMethod: 'cash_on_delivery', // Default payment method
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Use useMemo to memoize cartItems
    const memoizedCartItems = useMemo(() => location.state ? location.state.cartItems : cartItems, [location.state, cartItems]);

    // Function to calculate total price
    const calculateTotalPrice = useCallback(() => {
        const total = memoizedCartItems.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
        setTotalPrice(total);
    }, [memoizedCartItems]);

    useEffect(() => {
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
                // Implement Khalti payment logic here
            } else {
                // Simulate sending order details to the backend for cash on delivery
                const response = await axios.post('/api/orders', {
                    ...orderDetails,
                    cartItems: memoizedCartItems,
                    totalPrice,
                });
                if (response.status === 200) {
                    alert('Order placed successfully!');
                    // Clear the cart after successful order placement
                    clearCart();
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
                                placeholder="Ram Bahadur"
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
                                placeholder="ram@gmail.com"
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
                                placeholder="9800000000"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="orderNote">Order Note (any message for us)</label>
                            <textarea
                                id="orderNote"
                                name="orderNote"
                                value={orderDetails.orderNote}
                                onChange={handleInputChange}
                                placeholder="I was searching for this product for so long"
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
                            <select
                                id="cityDistrict"
                                name="cityDistrict"
                                value={orderDetails.cityDistrict}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select City/District</option>
                                <option value="kathmandu">Kathmandu (Inside Valley)</option>
                                <option value="pokhara">Pokhara (Outside Valley)</option>
                                <option value="chitwan">Chitwan (Outside Valley)</option>
                                <option value="nuwakot">Nuwakot (Outside Valley)</option>
                            </select>
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
                                placeholder="Kathmandu, Nayabazar"
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
                                placeholder="Nepa Banquet"
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
                        {memoizedCartItems.map((item, index) => (
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