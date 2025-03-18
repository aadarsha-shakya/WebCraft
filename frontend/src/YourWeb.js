import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './YourWeb.css';

function YourWeb() {
    const [branding, setBranding] = useState({});
    const [components, setComponents] = useState({});
    const [footerSettings, setFooterSettings] = useState({});
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    const navigate = useNavigate(); // Import and use navigate

    useEffect(() => {
        if (userId) {
            fetchBranding(userId);
            fetchComponents(userId);
            fetchFooterSettings(userId);
        } else {
            console.error("User ID not found in localStorage");
            alert("User ID not found. Please log in again.");
            navigate('/Login');
        }
    }, [userId, navigate]); // Include navigate in the dependency array

    useEffect(() => {
        if (branding.popup_modal_enabled && branding.popup_modal_image) {
            alert(`Click here to visit: ${branding.popup_modal_link}`);
            window.open(`/uploads/${branding.popup_modal_image}`, '_blank');
        }
    }, [branding.popup_modal_enabled, branding.popup_modal_image, branding.popup_modal_link]);

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

    const renderNavbar = () => {
        switch (components.navigation_type) {
            case 'basic':
                return (
                    <nav className="navbar">
                        <div className="navbar-left">
                            <Link to="/" className="brand-link">
                                <img src={`/uploads/${branding.brand_logo}`} alt="Logo" className="brand-logo" />
                            </Link>
                        </div>
                        <div className="navbar-right">
                            <Link to="/">Home</Link>
                            <Link to="/categories">Categories</Link>
                            <Link to="/about">About</Link>
                            <Link to="/contact">Contact</Link>
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
                                <Link to="/" className="brand-link">
                                    <img src={`/uploads/${branding.brand_logo}`} alt="Logo" className="brand-logo" />
                                </Link>
                            )}
                        </div>
                        <div className="brand-info">
                            <h1>{branding.brand_name}</h1>
                        </div>
                        <nav className="navbar-with-categories">
                            <div className="navbar-right">
                                <Link to="/">Home</Link>
                                <Link to="/categories">Categories</Link>
                                <Link to="/about">About</Link>
                                <Link to="/contact">Contact</Link>
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
                                    <img src={`/uploads/${branding.brand_logo}`} alt="Logo" className="brand-logo" />
                                </Link>
                            )}
                        </div>
                        <nav className="navbar-centered-logo">
                            <div className="navbar-right">
                                <Link to="/YourWeb">Home</Link>
                                <Link to="/about">About</Link>
                                <Link to="/contact">Contact</Link>
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
                            <Link to="/" className="brand-link">
                                <img src={`/uploads/${branding.brand_logo}`} alt="Logo" className="brand-logo" />
                            </Link>
                        </div>
                        <div className="navbar-right">
                            <Link to="/">Home</Link>
                            <Link to="/categories">Categories</Link>
                            <Link to="/about">About</Link>
                            <Link to="/contact">Contact</Link>
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
        <div className="your-web-container" style={{ fontFamily: branding.fontFamily, backgroundColor: branding.primaryColor }}>
            {/* HEADER */}
            {renderNavbar()}

            {/* MAIN CONTENT */}
            <main className="your-web-main">
                <h1>Welcome to Your Web Page</h1>
                <p>This is your customized web page.</p>
            </main>

            {/* FOOTER */}
            {renderFooter()}
        </div>
    );
}

export default YourWeb;