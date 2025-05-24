import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CartPanel.css'; // Import CartPanel.css for styling
import { useCart } from './CartContext'; // Import useCart hook

// Helper function to clean up image/filename strings
const cleanFilename = (filename) => {
    return filename ? filename.replace(/^<|>$/g, "") : "";
};

const CartPanel = ({ isOpen, setIsOpen }) => {
    const { cartItems, updateCartItemQuantity, removeCartItem, clearCart } = useCart(); // Use useCart hook
    const navigate = useNavigate();

    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.sellingPrice * item.quantity, 0);
    };

    const updateQuantity = (index, action) => {
        updateCartItemQuantity(index, action);
    };

    const removeItem = (index) => {
        removeCartItem(index);
    };

    const handleCheckout = () => {
        navigate('/Checkout', { state: { cartItems } });
        clearCart(); // Clear the cart after navigating to checkout
    };

    return (
        <div className={`cart-panel ${isOpen ? 'open' : ''}`}>
            <div className="cart-header">
                <button className="close-button" onClick={toggleCart}>
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h2>Shopping Cart</h2>
            </div>
            <ul className="cart-items">
                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <li key={index} className="cart-item">
                            <img
                                src={`http://localhost:8081/uploads/${cleanFilename(item.imageUrl || 'default.jpg')}`}
                                alt={item.productName}
                                className="cart-item-image"
                            />
                            <div className="cart-item-details">
                                <p>{item.productName}</p>
                                <p>Variant: {item.variantName}</p>
                                <p>Size: {item.size}</p>
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(index, 'decrement')}>-</button>
                                    <input type="number" value={item.quantity} readOnly />
                                    <button onClick={() => updateQuantity(index, 'increment')}>+</button>
                                </div>
                                <p>Price: Rs {item.sellingPrice}</p>
                                <button className="remove-button" onClick={() => removeItem(index)}>Remove</button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="cart-item empty-cart">
                        <p>Your cart is empty</p>
                    </li>
                )}
            </ul>
            <div className="cart-total">
                <p>Total: Rs {getTotalPrice()}</p>
            </div>
            <button className="checkout-button" onClick={handleCheckout}>
                CHECKOUT
            </button>
            <button className="clear-cart-button" onClick={clearCart}>
                CLEAR CART
            </button>
        </div>
    );
};

export default CartPanel;