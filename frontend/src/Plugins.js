import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Logo from './assets/WebCraft.png';
import './Plugins.css';
import AramexLogo from './assets/aramex.png';      
import PathaoLogo from './assets/pathaologo.avif';     
import WhatsappLogo from './assets/whatsapplogo.jpg'; 
import GoogleAnalyticsLogo from './assets/googleanalytics.png'; 


function Plugins() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clearing tokens)
    navigate('/Login'); // Redirect to login page
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Main Links</h2>
        <ul>
          <li>
            <Link to="/dashboard">
              <i className="fas fa-home"></i> Home
            </Link>
          </li>
          <li>
            <Link to="/StoreUsers">
              <i className="fas fa-users"></i> Store Users
            </Link>
          </li>
          <li>
            <Link to="/Categories">
              <i className="fas fa-th"></i> Categories
            </Link>
          </li>
          <li>
            <Link to="/Products">
              <i className="fas fa-box"></i> Products
            </Link>
          </li>
          <li>
            <Link to="/Customers">
              <i className="fas fa-user"></i> Customers
            </Link>
          </li>
          <li>
            <Link to="/Orders">
              <i className="fas fa-shopping-cart"></i> Orders
            </Link>
          </li>
          <li>
            <Link to="/Issues">
              <i className="fas fa-exclamation-circle"></i> Issues
            </Link>
          </li>
          <li>
            <Link to="/BarcodeGeneration">
              <i className="fas fa-barcode"></i> Barcode Scanner
            </Link>
          </li>
          <li>
            <Link to="/Settlement">
              <i className="fas fa-wallet"></i> Settlement
            </Link>
          </li>
          <li>
            <Link to="/Analytics">
              <i className="fas fa-chart-line"></i> Analytics
            </Link>
          </li>
          
        </ul>

        <h2>Customizations</h2>
        <ul>
          <li>
            <Link to="/Pages">
              <i className="fas fa-file"></i> Pages
            </Link>
          </li>
          <li>
            <Link to="/Plugins">
              <i className="fas fa-plug"></i> Plugins
            </Link>
          </li>
          <li>
            <Link to="/Appearance">
              <i className="fas fa-paint-brush"></i> Appearance
            </Link>
          </li>
          <li>
            <Link to="/StoreSettings">
              <i className="fas fa-cog"></i> Store Setting
            </Link>
          </li>
          <li>
            <Link to="/PaymentSettings">
              <i className="fas fa-credit-card"></i> Payment Setting
            </Link>
          </li>
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

          {/* Icons */}
          <div className="header-icons">
            <Link to="/YourWeb" className="header-icon">
              <i className="fas fa-globe"></i>
            </Link>

            {/* W Icon with Dropdown */}
            <div
              className={`header-icon w-icon ${isDropdownOpen ? "open" : ""}`}
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
          </div>
        </header>

        {/* CONTENT */}
        <main className="content">
      <h1>Plugins</h1>

      {/* Plugins Boxes */}
      <div className="plugins-grid">
        {/* Box 1: Whatsapp Chat */}
        <div className="plugin-box">
          <img src={WhatsappLogo} alt="Whatsapp Logo" className="plugin-logo" />
          <h3>Whatsapp Chat</h3>
          <p>Show whatsapp chat box on your website</p>
          <button className="configure-button">Configure</button>
        </div>

        {/* Box 2: Pathao Parcel */}
        <div className="plugin-box">
          <img src={PathaoLogo} alt="Pathao Logo" className="plugin-logo" />
          <h3>Pathao Parcel</h3>
          <p>Ship order to Pathao parcel dashboard</p>
          <button className="configure-button">Configure</button>
        </div>

        {/* Box 3: Aramex */}
        <div className="plugin-box">
          <img src={AramexLogo} alt="Aramex Logo" className="plugin-logo" />
          <h3>Aramex</h3>
          <p>Ship order to Aramex dashboard</p>
          <button className="configure-button">Configure</button>
        </div>

        {/* Box 4: Google Analytics */}
        <div className="plugin-box">
          <img src={GoogleAnalyticsLogo} alt="Google Analytics Logo" className="plugin-logo" />
          <h3>Google Analytics</h3>
          <p>Analyze real-time traffic, user-interaction statistics on your website</p>
          <button className="configure-button">Configure</button>
        </div>
      </div>
    </main>
      </div>
    </div>
  );
}

export default Plugins;
