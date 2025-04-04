import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProductFilter.css';

function ProductFilter() {
    const [branding, setBranding] = useState({});
    const [components, setComponents] = useState({});
    const [footerSettings, setFooterSettings] = useState({});
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 }); // Default price range
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedVariants, setSelectedVariants] = useState([]);
    const [selectedSizes, setSelectedSizes] = useState([]);
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    const navigate = useNavigate(); // Import and use navigate

    useEffect(() => {
        if (userId) {
            fetchBranding(userId);
            fetchComponents(userId);
            fetchFooterSettings(userId);
            fetchProducts(userId);
        } else {
            console.error("User ID not found in localStorage");
            alert("User ID not found. Please log in again.");
            navigate('/Login');
        }
    }, [userId, navigate]); // Include navigate in the dependency array

    const fetchBranding = (userId) => {
        fetch(`http://localhost:8081/api/branding/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setBranding(data);
                }
            })
            .catch(error => console.error("Error fetching branding:", error));
    };

    const fetchComponents = (userId) => {
        fetch(`http://localhost:8081/api/components/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setComponents(data);
                }
            })
            .catch(error => console.error("Error fetching components:", error));
    };

    const fetchFooterSettings = (userId) => {
        fetch(`http://localhost:8081/api/footer/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setFooterSettings(data);
                }
            })
            .catch(error => console.error("Error fetching footer settings:", error));
    };

    const fetchProducts = async (userId) => {
        try {
            const response = await fetch(`http://localhost:8081/api/products?userId=${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data);
            setFilteredProducts(data); // Initialize filtered products with all products
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const handlePriceChange = (event) => {
        const value = event.target.value;
        const [min, max] = value.split(',').map(Number);
        setPriceRange({ min, max });
        applyFilters();
    };

    const handleCategoryChange = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
        applyFilters();
    };

    const handleVariantChange = (variant) => {
        setSelectedVariants(prev => {
            if (prev.includes(variant)) {
                return prev.filter(v => v !== variant);
            } else {
                return [...prev, variant];
            }
        });
        applyFilters();
    };

    const handleSizeChange = (size) => {
        setSelectedSizes(prev => {
            if (prev.includes(size)) {
                return prev.filter(s => s !== size);
            } else {
                return [...prev, size];
            }
        });
        applyFilters();
    };

    const applyFilters = () => {
        let filtered = products;
        // Filter by price range
        filtered = filtered.filter(product => {
            const sellingPrices = product.variants ? product.variants.map(variant => variant.selling_price) : [];
            const minSellingPrice = Math.min(...sellingPrices);
            const maxSellingPrice = Math.max(...sellingPrices);
            return minSellingPrice >= priceRange.min && maxSellingPrice <= priceRange.max;
        });
        // Filter by categories
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(product => selectedCategories.includes(product.category_name));
        }
        // Filter by variants
        if (selectedVariants.length > 0) {
            filtered = filtered.filter(product => {
                const productVariantNames = product.variants ? product.variants.map(variant => variant.variant_name) : [];
                return selectedVariants.every(selectedVariant =>
                    productVariantNames.includes(selectedVariant)
                );
            });
        }
        // Filter by sizes
        if (selectedSizes.length > 0) {
            filtered = filtered.filter(product => {
                const productSizes = product.variants ? product.variants.map(variant => variant.size) : [];
                return selectedSizes.every(selectedSize =>
                    productSizes.includes(selectedSize)
                );
            });
        }
        setFilteredProducts(filtered);
    };

    const renderProductCard = (product) => {
        const mainImage = product.product_images ? product.product_images[0] : null;
        const sellingPrices = product.variants ? product.variants.map(variant => variant.selling_price) : [];
        const lowestPrice = Math.min(...sellingPrices);
        const crossedPrices = product.variants ? product.variants.map(variant => variant.crossed_price) : [];
        const crossedPrice = Math.max(...crossedPrices);
        return (
            <Link to={`/ProductDetail/${product.id}`} className="product-item">
                {mainImage && (
                    <img src={`/uploads/${mainImage}`} alt={product.product_name} />
                )}
                <h3>{product.product_name}</h3>
                <div className="price-container">
                    {crossedPrice > lowestPrice && (
                        <p className="crossed-price">Rs {crossedPrice}</p>
                    )}
                    <p className="selling-price">Rs {lowestPrice}</p>
                </div>
                {crossedPrice > lowestPrice && (
                    <button className="save-badge">SAVE Rs {crossedPrice - lowestPrice}</button>
                )}
            </Link>
        );
    };

    const renderNavbar = () => {
        switch (components.navigation_type) {
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
                            <button className="card-button">
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
                                <button className="card-button">
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
                                <button className="card-button">
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
                            <button className="card-button">
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

    return (
        <div className="your-web-container">
            {/* HEADER */}
            {renderNavbar()}
            {/* MAIN CONTENT */}
            <main className="your-web-main">
                <div className="filter-and-products">
                    {/* FILTER SECTION */}
                    <div className="filter-section-box">
                        <h2>FILTER BY:</h2>
                        {/* Price Filter */}
                        <div className="filter-group">
                            <label htmlFor="price-range">Price</label>
                            <input
                                type="range"
                                id="price-range"
                                min="0"
                                max="10000"
                                step="100"
                                value={`${priceRange.min},${priceRange.max}`}
                                onChange={handlePriceChange}
                            />
                            <span>Rs {priceRange.min}</span>
                            <span>Rs {priceRange.max}</span>
                        </div>
                        {/* Category Filter */}
                        <div className="filter-group">
                            <label>Category</label>
                            {Array.from(new Set(products.map(product => product.category_name))).map(category => (
                                <div key={category} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        id={`category-${category}`}
                                        checked={selectedCategories.includes(category)}
                                        onChange={() => handleCategoryChange(category)}
                                    />
                                    <label htmlFor={`category-${category}`}>{category}</label>
                                </div>
                            ))}
                        </div>
                        {/* Variant Filter */}
                        <div className="filter-group">
                            <label>Product Variants</label>
                            {Array.from(new Set(products.flatMap(product => product.variants ? product.variants.map(variant => variant.variant_name) : []))).map(variantName => (
                                <div key={variantName} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        id={`variant-${variantName}`}
                                        checked={selectedVariants.includes(variantName)}
                                        onChange={() => handleVariantChange(variantName)}
                                    />
                                    <label htmlFor={`variant-${variantName}`}>{variantName}</label>
                                </div>
                            ))}
                        </div>
                        {/* Size Filter */}
                        <div className="filter-group">
                            <label>Product Sizes</label>
                            {Array.from(new Set(products.flatMap(product => product.variants ? product.variants.map(variant => variant.size) : []))).map(size => (
                                <div key={size} className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        id={`size-${size}`}
                                        checked={selectedSizes.includes(size)}
                                        onChange={() => handleSizeChange(size)}
                                    />
                                    <label htmlFor={`size-${size}`}>{size}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* PRODUCTS SECTION */}
                    <div className="products-section">
                        <h1>All Products</h1>
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <div key={product.id}>
                                    {renderProductCard(product)}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
            {/* FOOTER */}
            {renderFooter()}
        </div>
    );
}

export default ProductFilter;