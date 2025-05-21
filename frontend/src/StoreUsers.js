import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Logo from './assets/WebCraft.png';

function StoreUsers() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'Hybrid'); // Load mode from localStorage or default to 'Hybrid'
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clearing tokens)
    navigate('/Login'); // Redirect to login page
  };

  // Update mode based on button click and save to localStorage
  const selectMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode); // Save mode to localStorage
  };

  // Determine which links to show based on the mode
  const getLinks = () => {
    const hybridLinks = [
      { name: 'Home', icon: 'fa-home', path: '/dashboard' },
      { name: 'Store Users', icon: 'fa-users', path: '/StoreUsers' },
      { name: 'Categories', icon: 'fa-th', path: '/Categories' },
      { name: 'Products', icon: 'fa-box', path: '/Products' },
      { name: 'Customers', icon: 'fa-user', path: '/Customers' },
      { name: 'Orders', icon: 'fa-shopping-cart', path: '/Orders' },
      { name: 'Issues', icon: 'fa-exclamation-circle', path: '/Issues' },
      { name: 'Barcode Scanner', icon: 'fa-barcode', path: '/BarcodeGeneration' },
      { name: 'Instore', icon: 'fa-store', path: '/Instore' },
      { name: 'Settlement', icon: 'fa-wallet', path: '/Settlement' },
      { name: 'Analytics', icon: 'fa-chart-line', path: '/Analytics' },
      { name: 'Customization', type: 'header', className: 'customization-header' }, // Customization header
      { name: 'Pages', icon: 'fa-file', path: '/Pages' },
      { name: 'Plugins', icon: 'fa-plug', path: '/Plugins' },
      { name: 'Appearance', icon: 'fa-paint-brush', path: '/Appearance' },
      { name: 'Store Setting', icon: 'fa-cog', path: '/StoreSettings' },
      { name: 'Payment Setting', icon: 'fa-credit-card', path: '/PaymentSettings' },
    ];
    const onlineLinks = [
      { name: 'Home', icon: 'fa-home', path: '/dashboard' },
      { name: 'Store Users', icon: 'fa-users', path: '/StoreUsers' },
      { name: 'Categories', icon: 'fa-th', path: '/Categories' },
      { name: 'Products', icon: 'fa-box', path: '/Products' },
      { name: 'Customers', icon: 'fa-user', path: '/Customers' },
      { name: 'Orders', icon: 'fa-shopping-cart', path: '/Orders' },
      { name: 'Issues', icon: 'fa-exclamation-circle', path: '/Issues' },
      { name: 'Barcode Scanner', icon: 'fa-barcode', path: '/BarcodeGeneration' },
      { name: 'Settlement', icon: 'fa-wallet', path: '/Settlement' },
      { name: 'Analytics', icon: 'fa-chart-line', path: '/Analytics' },
      { name: 'Customization', type: 'header', className: 'customization-header' }, // Customization header
      { name: 'Pages', icon: 'fa-file', path: '/Pages' },
      { name: 'Plugins', icon: 'fa-plug', path: '/Plugins' },
      { name: 'Appearance', icon: 'fa-paint-brush', path: '/Appearance' },
      { name: 'Store Setting', icon: 'fa-cog', path: '/StoreSettings' },
      { name: 'Payment Setting', icon: 'fa-credit-card', path: '/PaymentSettings' },
    ];
    const instoreLinks = [
      { name: 'Home', icon: 'fa-home', path: '/dashboard' },
      { name: 'Issues', icon: 'fa-exclamation-circle', path: '/Issues' },
      { name: 'Barcode Scanner', icon: 'fa-barcode', path: '/BarcodeGeneration' },
      { name: 'Instore', icon: 'fa-store', path: '/Instore' },
      { name: 'Settlement', icon: 'fa-wallet', path: '/Settlement' },
      { name: 'Analytics', icon: 'fa-chart-line', path: '/Analytics' },
    ];
    switch (mode) {
      case 'Hybrid':
        return hybridLinks;
      case 'Online':
        return onlineLinks;
      case 'Instore':
        return instoreLinks;
      default:
        return hybridLinks;
    }
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Main Links</h2>
        <ul>
          {getLinks().map((link) => (
            <li key={link.name}>
              {link.type === 'header' ? (
                <h3 className={link.className}>{link.name}</h3>
              ) : (
                <Link to={link.path}>
                  <i className={`fas ${link.icon}`}></i> {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </aside>
      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        {/* HEADER PANEL */}
        <header className="dashboard-header">
          {/* Logo - Clickable to navigate to the dashboard */}
          <div className="logo">
            <Link to="/dashboard">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
          {/* Header Icons */}
          <div className="header-icons">
            <Link to="/YourWeb" className="header-icon">
              <i className="fas fa-globe"></i>
            </Link>
            {/* W Icon with Dropdown */}
            <div
              className={`header-icon w-icon ${isDropdownOpen ? 'open' : ''}`}
              onClick={toggleDropdown}
            >
              W
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/Accounts" className="dropdown-item">
                    <i className="fas fa-user"></i> Accounts
                  </Link>
                  <Link to="/Subscription" className="dropdown-item">
                    <i className="fas fa-dollar-sign"></i> Subscription
                  </Link>
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              )}
            </div>
            {/* Mode Toggle Button */}
            <div className="mode-toggle">
              <div className="toggle-container">
                <button
                  className={`toggle-button ${mode === 'Instore' ? 'active' : ''}`}
                  onClick={() => selectMode('Instore')}
                >
                  <i className="fas fa-store"></i>
                </button>
                <button
                  className={`toggle-button ${mode === 'Hybrid' ? 'active' : ''}`}
                  onClick={() => selectMode('Hybrid')}
                >
                  <i className="fas fa-code-branch"></i>
                </button>
                <button
                  className={`toggle-button ${mode === 'Online' ? 'active' : ''}`}
                  onClick={() => selectMode('Online')}
                >
                  <i className="fas fa-globe"></i>
                </button>
              </div>
            </div>
          </div>
        </header>
        {/* CONTENT */}
        <main className="content">
          <h1>StoreUsers</h1>
          <p>This is a store users page.</p>
        </main>
      </div>
    </div>
  );
}

export default StoreUsers;