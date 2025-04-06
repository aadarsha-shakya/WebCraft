import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import Link here
import axios from 'axios';
import './ProductDetail.css';
import './YourWeb.css'; // Import YourWeb.css for styling
import './CartPanel.css'; // Import CartPanel.css for styling

function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [branding, setBranding] = useState({});
    const [footerSettings, setFooterSettings] = useState({});
    const [components, setComponents] = useState({}); // Add components state
    const [cartItems, setCartItems] = useState([]); // Cart state
    const [isCartOpen, setIsCartOpen] = useState(false); // State to toggle cart panel

    // Get productId from URL params
    const { productId } = useParams();
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage

    useEffect(() => {
        if (userId) {
            fetchBranding(userId);
            fetchFooterSettings(userId);
            fetchComponents(userId); // Fetch components
            fetchProductDetails(productId, userId);
        } else {
            console.error("User ID not found in localStorage");
            alert("User ID not found. Please log in again.");
            // Navigate to login page if needed
        }
    }, [productId, userId]);

    const fetchBranding = (userId) => {
        axios.get(`http://localhost:8081/api/branding/${userId}`)
            .then(response => {
                if (response.data) {
                    setBranding(response.data);
                }
            })
            .catch(error => console.error("Error fetching branding:", error));
    };

    const fetchFooterSettings = (userId) => {
        axios.get(`http://localhost:8081/api/footer/${userId}`)
            .then(response => {
                if (response.data) {
                    setFooterSettings(response.data);
                }
            })
            .catch(error => console.error("Error fetching footer settings:", error));
    };

    const fetchComponents = (userId) => {
        axios.get(`http://localhost:8081/api/components/${userId}`)
            .then(response => {
                if (response.data) {
                    setComponents(response.data);
                }
            })
            .catch(error => console.error("Error fetching components:", error));
    };

    const fetchProductDetails = (productId, userId) => {
        axios.get(`http://localhost:8081/api/products/${productId}?userId=${userId}`)
            .then(response => {
                setProduct(response.data);
            })
            .catch(error => {
                console.error("Error fetching product details:", error);
            });
    };

    // Handle variant selection
    const handleVariantChange = (variantId) => {
        const selected = product.variants.find(variant => variant.id === variantId);
        setSelectedVariant(selected);
        setQuantity(1); // Reset quantity to 1 when variant changes
    };

    // Handle quantity change
    const handleQuantityChange = (action) => {
        if (action === 'increment') {
            setQuantity(quantity + 1);
        } else if (action === 'decrement') {
            setQuantity(Math.max(1, quantity - 1)); // Ensure quantity doesn't go below 1
        }
    };

    // Add to Cart functionality
    const addToCart = () => {
        if (!selectedVariant) {
            alert("Please select a variant.");
            return;
        }
        const cartItem = {
            productId: product.id,
            variantId: selectedVariant.id,
            quantity,
            productName: product.product_name,
            sellingPrice: selectedVariant.selling_price,
            crossedPrice: selectedVariant.crossed_price,
            variantName: selectedVariant.variant_name,
            size: selectedVariant.size,
            imageUrl: product.product_images[0], // Main image
        };

        // Check if the item already exists in the cart
        const existingItemIndex = cartItems.findIndex(item => item.productId === cartItem.productId && item.variantId === cartItem.variantId);
        if (existingItemIndex !== -1) {
            // Update the quantity of the existing item
            const updatedCartItems = cartItems.map((item, index) => {
                if (index === existingItemIndex) {
                    return { ...item, quantity: item.quantity + cartItem.quantity };
                }
                return item;
            });
            setCartItems(updatedCartItems);
        } else {
            // Add the new item to the cart
            setCartItems(prevCartItems => [...prevCartItems, cartItem]);
        }
        alert("Added to cart!");
    };

    const renderNavbar = () => {
        switch (components.navigation_type) { // Use components instead of branding
            case 'basic':
                return (
                    <nav className="navbar">
                        <div className="navbar-left">
                            <Link to="/YourWeb" className="brand-link">
                                <img src={`/uploads/${branding.brand_logo}`} alt="Brand Logo" className="brand-logo" />
                            </Link>
                        </div>
                        <div className="navbar-right">
                            <Link to="/YourWeb">Home</Link>
                            <Link to="/ProductFilter">Shop</Link>
                            <button className="card-button" onClick={() => setIsCartOpen(true)}>
                                <i className="fas fa-shopping-cart"></i> Cart
                            </button>
                        </div>
                    </nav>
                );
            case 'withCategories':
                return (
                    <header className="your-web-header" style={{ backgroundColor: branding.primary_color, fontFamily: branding.font_family }}>
                        <div className="logo-container">
                            {branding.brand_logo && (
                                <Link to="/YourWeb" className="brand-link">
                                    <img src={`/uploads/${branding.brand_logo}`} alt="Brand Logo" className="brand-logo" />
                                </Link>
                            )}
                        </div>
                        <div className="brand-info">
                            <h1>{branding.brand_name}</h1>
                        </div>
                        <nav className="navbar-with-categories">
                            <div className="navbar-right">
                                <Link to="/YourWeb">Home</Link>
                                <Link to="/categories">Categories</Link>
                                <Link to="/ProductFilter">Shop</Link>
                                <button className="card-button" onClick={() => setIsCartOpen(true)}>
                                    <i className="fas fa-shopping-cart"></i> Cart
                                </button>
                            </div>
                        </nav>
                    </header>
                );
            case 'centeredLogo':
                return (
                    <header className="your-web-header" style={{ backgroundColor: branding.primary_color, fontFamily: branding.font_family }}>
                        <div className="brand-info">
                            <h1>{branding.brand_name}</h1>
                        </div>
                        <div className="logo-container">
                            {branding.brand_logo && (
                                <Link to="/YourWeb" className="brand-link">
                                    <img src={`/uploads/${branding.brand_logo}`} alt="Brand Logo" className="brand-logo" />
                                </Link>
                            )}
                        </div>
                        <nav className="navbar-centered-logo">
                            <div className="navbar-right">
                                <Link to="/YourWeb">Home</Link>
                                <Link to="/ProductFilter">Shop</Link>
                                <button className="card-button" onClick={() => setIsCartOpen(true)}>
                                    <i className="fas fa-shopping-cart"></i> Cart
                                </button>
                            </div>
                        </nav>
                    </header>
                );
            default:
                return (
                    <nav className="navbar">
                        <div className="navbar-left">
                            <Link to="/YourWeb" className="brand-link">
                                <img src={`/uploads/${branding.brand_logo}`} alt="Brand Logo" className="brand-logo" />
                            </Link>
                        </div>
                        <div className="navbar-right">
                            <Link to="/YourWeb">Home</Link>
                            <Link to="/ProductFilter">Shop</Link>
                            <button className="card-button" onClick={() => setIsCartOpen(true)}>
                                <i className="fas fa-shopping-cart"></i> Cart
                            </button>
                        </div>
                    </nav>
                );
        }
    };

    const renderFooter = () => {
        return (
            <footer className="your-web-footer">
                {footerSettings.description && (
                    <div className="footer-description">
                        {footerSettings.description}
                    </div>
                )}
                {footerSettings.copyright && (
                    <div className="footer-copyright">
                        {footerSettings.copyright}
                    </div>
                )}
                <div className="footer-links">
                    {footerSettings.shippingPolicy && (
                        <a href={footerSettings.shippingPolicy} target="_blank" rel="noopener noreferrer">
                            Shipping Policy
                        </a>
                    )}
                    {footerSettings.refundPolicy && (
                        <a href={footerSettings.refundPolicy} target="_blank" rel="noopener noreferrer">
                            Refund Policy
                        </a>
                    )}
                    {footerSettings.privacyPolicy && (
                        <a href={footerSettings.privacyPolicy} target="_blank" rel="noopener noreferrer">
                            Privacy Policy
                        </a>
                    )}
                    {footerSettings.termsOfService && (
                        <a href={footerSettings.termsOfService} target="_blank" rel="noopener noreferrer">
                            Terms of Service
                        </a>
                    )}
                </div>
                <div className="footer-socials">
                    {footerSettings.facebook && (
                        <a href={footerSettings.facebook} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                    )}
                    {footerSettings.youtube && (
                        <a href={footerSettings.youtube} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-youtube"></i>
                        </a>
                    )}
                    {footerSettings.instagram && (
                        <a href={footerSettings.instagram} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-instagram"></i>
                        </a>
                    )}
                    {footerSettings.whatsapp && (
                        <a href={footerSettings.whatsapp} target="_blank" rel="noopener noreferrer">
                            <i className="fab fa-whatsapp"></i>
                        </a>
                    )}
                </div>
            </footer>
        );
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    // Console log to verify the image URL
    console.log("Product Images:", product.product_images);

    return (
        <div className="your-web-container">
            {/* HEADER */}
            {renderNavbar()}
            {/* MAIN CONTENT */}
            <main className="your-web-main">
                <div className="product-detail-container">
                    {/* Product Image */}
                    <div className="product-image">
                        <img
                            src={`/uploads/${product.product_images[0] || 'default.jpg'}`}
                            alt={product.product_name}
                        />
                    </div>
                    {/* Product Info */}
                    <div className="product-info">
                        <h1>{product.product_name}</h1>
                        <div className="price-container">
                            <p className="crossed-price">
                                Rs {selectedVariant ? selectedVariant.crossed_price : product.variants[0].crossed_price}
                            </p>
                            <p className="selling-price">
                                Rs {selectedVariant ? selectedVariant.selling_price : product.variants[0].selling_price}
                            </p>
                            <span className="discount-badge">20% OFF</span>
                        </div>
                        <p>Shipping is calculated at checkout</p>
                        {/* Variant Selection */}
                        <div className="variant-selector">
                            <label>Choose Variant</label>
                            <select
                                value={selectedVariant?.id || ""}
                                onChange={(e) => handleVariantChange(e.target.value)}
                            >
                                <option value="">Select a variant</option>
                                {product.variants.map((variant) => (
                                    <option key={variant.id} value={variant.id}>
                                        {variant.variant_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Size Selection */}
                        <div className="size-selector">
                            <label>Choose Size</label>
                            <select
                                value={selectedVariant?.size || ""}
                                disabled={!selectedVariant}
                            >
                                <option value="">Select a size</option>
                                {selectedVariant && selectedVariant.sizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {/* Quantity Selector */}
                        <div className="quantity-selector">
                            <button onClick={() => handleQuantityChange("decrement")}>
                                -
                            </button>
                            <input type="number" value={quantity} readOnly />
                            <button onClick={() => handleQuantityChange("increment")}>
                                +
                            </button>
                        </div>
                        {/* Add to Cart Button */}
                        <div className="add-to-cart-container">
                            <button className="add-to-cart" onClick={addToCart}>
                                ADD TO CART
                            </button>
                        </div>
                    </div>
                </div>
                {/* Description */}
                <div className="description">
                    <h2>Description</h2>
                    <p>{product.product_description}</p>
                </div>
            </main>
            {/* FOOTER */}
            {renderFooter()}
            {/* Cart Panel */}
            <CartPanel cartItems={cartItems} isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
        </div>
    );
}

// CartPanel Component
const CartPanel = ({ cartItems, isOpen, setIsOpen }) => {
    const toggleCart = () => {
        setIsOpen(!isOpen);
    };

    const getTotalPrice = () => {
        return cartItems.reduce((total, item) => total + item.sellingPrice * item.quantity, 0);
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
                            <img src={`/uploads/${item.imageUrl}`} alt={item.productName} className="cart-item-image" />
                            <div className="cart-item-details">
                                <p>{item.productName}</p>
                                <p>Variant: {item.variantName}</p>
                                <p>Size: {item.size}</p>
                                <p>Quantity: {item.quantity}</p>
                                <p>Price: Rs {item.sellingPrice}</p>
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
            <button className="checkout-button" onClick={() => window.location.href = '/Checkout'}>
                CHECKOUT
            </button>
        </div>
    );
};

export default ProductDetail;