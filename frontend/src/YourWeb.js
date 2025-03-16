import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './YourWeb.css';

function YourWeb() {
  const [branding, setBranding] = useState({});
  const [components, setComponents] = useState({});
  const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage

  useEffect(() => {
    fetchBranding(userId);
    fetchComponents(userId);
    if (branding.popupModalMessage) {
      alert(branding.popupModalMessage);
    }
  }, [userId, branding.popupModalMessage]);

  const fetchBranding = (userId) => {
    fetch(`/api/branding/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setBranding(data);
        }
      })
      .catch(error => console.error("Error fetching branding:", error));
  };

  const fetchComponents = (userId) => {
    fetch(`/api/components/${userId}`)
      .then(response => response.json())
      .then(data => {
        if (data) {
          setComponents(data);
        }
      })
      .catch(error => console.error("Error fetching components:", error));
  };

  const renderNavbar = () => {
    switch (components.navigationType) {
      case 'basic':
        return (
          <nav className="navbar-basic">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        );
      case 'withCategories':
        return (
          <nav className="navbar-with-categories">
            <Link to="/">Home</Link>
            <Link to="/categories">Categories</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        );
      case 'centeredLogo':
        return (
          <nav className="navbar-centered-logo">
            <div className="logo">
              <img src={branding.brandLogo} alt="Logo" />
            </div>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        );
      default:
        return (
          <nav className="navbar-basic">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        );
    }
  };

  return (
    <div className="your-web-container" style={{ fontFamily: branding.fontFamily }}>
      {/* HEADER */}
      <header className="your-web-header" style={{ backgroundColor: branding.primaryColor }}>
        <div className="logo">
          <Link to="/dashboard">
            <img src={branding.brandLogo} alt="Logo" />
          </Link>
        </div>
        <div className="top-bar-text">
          {components.topBarText}
        </div>
        {renderNavbar()}
      </header>

      {/* MAIN CONTENT */}
      <main className="your-web-main">
        <h1>Welcome to Your Web Page</h1>
        <p>This is your customized web page.</p>
      </main>

      {/* FOOTER */}
      <footer className="your-web-footer">
        <div className="footer-favicon">
          <img src={branding.brandFavicon} alt="Footer Favicon" />
        </div>
        <div className="social-links">
          {components.facebookUrl && (
            <a href={components.facebookUrl} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook-f"></i>
            </a>
          )}
          {components.instagramUrl && (
            <a href={components.instagramUrl} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {components.tiktokUrl && (
            <a href={components.tiktokUrl} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-tiktok"></i>
            </a>
          )}
        </div>
        <div className="footer-content">
          {components.footerContent}
        </div>
      </footer>
    </div>
  );
}

export default YourWeb;