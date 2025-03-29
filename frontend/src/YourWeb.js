import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './YourWeb.css';

function YourWeb() {
    const [branding, setBranding] = useState({});
    const [components, setComponents] = useState({});
    const [footerSettings, setFooterSettings] = useState({});
    const [sections, setSections] = useState([]);
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    const navigate = useNavigate(); // Import and use navigate

    useEffect(() => {
        if (userId) {
            fetchBranding(userId);
            fetchComponents(userId);
            fetchFooterSettings(userId);
            fetchSections(userId); // Fetch sections
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

    const fetchSections = (userId) => {
        fetch(`http://localhost:8081/api/sections/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setSections(data);
                }
            })
            .catch(error => console.error("Error fetching sections:", error));
    };

    const renderNavbar = () => {
        switch (components.navigation_type) {
            case 'basic':
                return (
                    <nav className="navbar">
                        <div className="navbar-left">
                            <Link to="/" className="brand-link">
                                <img src={`/uploads/${branding.brand_logo}`} alt="Brand Logo" className="brand-logo" />
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
                                    <img src={`/uploads/${branding.brand_logo}`} alt="Brand Logo" className="brand-logo" />
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
                                    <img src={`/uploads/${branding.brand_logo}`} alt="Brand Logo" className="brand-logo" />
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
                                <img src={`/uploads/${branding.brand_logo}`} alt="Brand Logo" className="brand-logo" />
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

    const renderSection = (section) => {
        switch (section.type) {
            case 'Full Image':
                return (
                    <div key={section.id} className="full-image-section">
                        <img src={`/uploads/${section.image}`} alt={section.title || "Full Image"} className="full-image" />
                        {section.link && (
                            <a href={section.link} target="_blank" rel="noopener noreferrer" className="full-image-link">
                                Visit Link
                            </a>
                        )}
                    </div>
                );
            case 'Image with Content':
                return (
                    <div key={section.id} className="image-with-content-section">
                        <img src={`/uploads/${section.image}`} alt={section.title || "Image with Content"} className="section-image" />
                        <div className="section-content">
                            <h2>{section.title}</h2>
                            <p>{section.description}</p>
                            {section.button1_label && section.button1_url && (
                                <a href={section.button1_url} target="_blank" rel="noopener noreferrer" className="section-button">
                                    {section.button1_label}
                                </a>
                            )}
                            {section.button2_label && section.button2_url && (
                                <a href={section.button2_url} target="_blank" rel="noopener noreferrer" className="section-button">
                                    {section.button2_label}
                                </a>
                            )}
                        </div>
                    </div>
                );
            case 'Category Grid':
                return (
                    <div key={section.id} className="category-grid-section">
                        <h2>{section.title}</h2>
                        <div className="category-grid">
                            {JSON.parse(section.categories).map((category, index) => (
                                <div key={index} className="category-item">
                                    {category}
                                </div>
                            ))}
                        </div>
                    </div>
                );
            case 'Image Slider':
                return (
                    <div key={section.id} className="image-slider-section">
                        <div className="image-slider">
                            {JSON.parse(section.images).map((image, index) => (
                                <img key={index} src={`/uploads/${image}`} alt={`Image ${index + 1}`} className="slider-image" />
                            ))}
                        </div>
                    </div>
                );
            case 'FAQ':
                return (
                    <div key={section.id} className="faq-section">
                        <h2>{section.title}</h2>
                        <div className="faq-list">
                            {JSON.parse(section.questions).map((question, index) => (
                                <div key={index} className="faq-item">
                                    <h3>{question.question}</h3>
                                    <p>{question.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="your-web-container" style={{ fontFamily: branding.fontFamily, backgroundColor: branding.primaryColor }}>
            {/* HEADER */}
            {renderNavbar()}
            {/* MAIN CONTENT */}
            <main className="your-web-main">
                {sections.map(renderSection)} {/* Render sections here */}
            </main>
            {/* FOOTER */}
            {renderFooter()}
        </div>
    );
}

export default YourWeb;