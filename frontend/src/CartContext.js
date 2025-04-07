import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Load cart items from localStorage
        const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        setCartItems(storedCartItems);
    }, []);

    useEffect(() => {
        // Save cart items to localStorage whenever they change
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item) => {
        const existingItemIndex = cartItems.findIndex(cartItem => 
            cartItem.productId === item.productId && 
            cartItem.variantId === item.variantId && 
            cartItem.size === item.size
        );
        if (existingItemIndex !== -1) {
            // Update the quantity of the existing item
            const updatedCartItems = cartItems.map((cartItem, index) => {
                if (index === existingItemIndex) {
                    return { ...cartItem, quantity: cartItem.quantity + item.quantity };
                }
                return cartItem;
            });
            setCartItems(updatedCartItems);
        } else {
            // Add the new item to the cart
            setCartItems(prevCartItems => [...prevCartItems, item]);
        }
    };

    const updateCartItemQuantity = (index, action) => {
        const updatedCartItems = cartItems.map((item, i) => {
            if (i === index) {
                if (action === 'increment') {
                    return { ...item, quantity: item.quantity + 1 };
                } else if (action === 'decrement') {
                    return { ...item, quantity: Math.max(1, item.quantity - 1) };
                }
            }
            return item;
        });
        setCartItems(updatedCartItems);
    };

    const removeCartItem = (index) => {
        const updatedCartItems = cartItems.filter((_, i) => i !== index);
        setCartItems(updatedCartItems);
    };

    const clearCart = () => {
        setCartItems([]);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            addToCart,
            updateCartItemQuantity,
            removeCartItem,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
};