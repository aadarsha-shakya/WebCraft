import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';
import './YourWeb.css'; // Import YourWeb.css for styling
import './CartPanel.css'; // Import CartPanel.css for styling
import { useCart } from './CartContext'; // Import useCart hook
import CartPanel from './CartPanel'; // Import CartPanel

function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [branding, setBranding] = useState({});
    const [footerSettings, setFooterSettings] = useState({});
    const [components, setComponents] = useState({}); // Add components state
    const { addToCart } = useCart(); // Use useCart hook
    const { productId } = useParams();
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    const navigate = useNavigate();
    const [isCartOpen, setIsCartOpen] = useState(false); // State to toggle cart panel

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
    }, [productId, userId, navigate]);

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
                if (response.data.error) {
                    alert(response.data.error); // Show error message
                    navigate('/YourWeb'); // Redirect to home page or another appropriate route
                    return;
                }
                setProduct(response.data);
            })
            .catch(error => {
                console.error("Error fetching product details:", error);
                alert("Failed to load product details. Please try again.");
                navigate('/YourWeb'); // Redirect to home page or another appropriate route
            });
    };

    const handleVariantChange = (variantId) => {
        const selected = product.variants.find(variant => variant.id === parseInt(variantId));
        setSelectedVariant(selected);
        setSelectedSize(''); // Reset size selection when variant changes
        setQuantity(1); // Reset quantity to 1 when variant changes
    };

    const handleSizeChange = (e) => {
        setSelectedSize(e.target.value);
    };

    const handleQuantityChange = (action) => {
        if (!selectedVariant) {
            alert("Please select a variant.");
            return;
        }
        if (action === 'increment') {
            if (quantity < selectedVariant.quantity) {
                setQuantity(quantity + 1);
            } else {
                alert("Not enough stock available.");
            }
        } else if (action === 'decrement') {
            setQuantity(Math.max(1, quantity - 1)); // Ensure quantity doesn't go below 1
        }
    };

    const addToCartHandler = () => {
        if (!selectedVariant) {
            alert("Please select a variant.");
            return;
        }
        if (!selectedSize) {
            alert("Please select a size.");
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
            size: selectedSize,
            imageUrl: product.product_images[0] || 'default.jpg', // Main image
        };
        addToCart(cartItem);
        alert("Added to cart!");
    };

    const renderNavbar = () => {
        switch (components.navigation_type) { // Use components instead of branding
            case 'basic':
                return (
                    <nav className="navbar">
                        <div className="navbar-left">
                            <Link to="/YourWeb" className="brand-link">
                                <img src={`/uploads/${branding.brand_logo || 'default.jpg'}`} alt="Brand Logo" className="brand-logo" />
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
                    <header className="your-web-header" style={{ backgroundColor: branding.primary_color || '#fff', fontFamily: branding.font_family || 'sans-serif' }}>
                        <div className="logo-container">
                            {branding.brand_logo && (
                                <Link to="/YourWeb" className="brand-link">
                                    <img src={`/uploads/${branding.brand_logo || 'default.jpg'}`} alt="Brand Logo" className="brand-logo" />
                                </Link>
                            )}
                        </div>
                        <div className="brand-info">
                            <h1>{branding.brand_name || 'Default Brand'}</h1>
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
                    <header className="your-web-header" style={{ backgroundColor: branding.primary_color || '#fff', fontFamily: branding.font_family || 'sans-serif' }}>
                        <div className="brand-info">
                            <h1>{branding.brand_name || 'Default Brand'}</h1>
                        </div>
                        <div className="logo-container">
                            {branding.brand_logo && (
                                <Link to="/YourWeb" className="brand-link">
                                    <img src={`/uploads/${branding.brand_logo || 'default.jpg'}`} alt="Brand Logo" className="brand-logo" />
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
                                <img src={`/uploads/${branding.brand_logo || 'default.jpg'}`} alt="Brand Logo" className="brand-logo" />
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
                            <i className="fas fa-whatsapp"></i>
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
                                Rs {selectedVariant ? selectedVariant.crossed_price : product.variants[0]?.crossed_price}
                            </p>
                            <p className="selling-price">
                                Rs {selectedVariant ? selectedVariant.selling_price : product.variants[0]?.selling_price}
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
                                value={selectedSize}
                                onChange={handleSizeChange}
                                disabled={!selectedVariant}
                            >
                                <option value="">Select a size</option>
                                {selectedVariant && selectedVariant.sizes && selectedVariant.sizes.map((size) => (
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
                            <button className="add-to-cart" onClick={addToCartHandler}>
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
            <CartPanel isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
        </div>
    );
}

export default ProductDetail;