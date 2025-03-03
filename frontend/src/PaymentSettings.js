import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Logo from './assets/WebCraft.png';
import QRPaymentLogo from './assets/QRPayment.png'; // Add appropriate image paths
import CardPaymentLogo from './assets/CardPayment.png';
import KhaltiLogo from './assets/Khalti.png';
import './PaymentSettings.css';


function PaymentSettings() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    navigate('/Login');
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Main Links</h2>
        <ul>
          <li><Link to="/dashboard"><i className="fas fa-home"></i> Home</Link></li>
          <li><Link to="/StoreUsers"><i className="fas fa-users"></i> Store Users</Link></li>
          <li><Link to="/Categories"><i className="fas fa-th"></i> Categories</Link></li>
          <li><Link to="/Products"><i className="fas fa-box"></i> Products</Link></li>
          <li><Link to="/Customers"><i className="fas fa-user"></i> Customers</Link></li>
          <li><Link to="/Orders"><i className="fas fa-shopping-cart"></i> Orders</Link></li>
          <li><Link to="/Issues"><i className="fas fa-exclamation-circle"></i> Issues</Link></li>
          <li><Link to="/BarcodeGeneration"><i className="fas fa-barcode"></i> Barcode Scanner</Link></li>
          <li><Link to="/Settlement"><i className="fas fa-wallet"></i> Settlement</Link></li>
          <li><Link to="/Analytics"><i className="fas fa-chart-line"></i> Analytics</Link></li>
          <li><Link to="/Inventory"><i className="fas fa-warehouse"></i> Inventory</Link></li>
        </ul>

        <h2>Customizations</h2>
        <ul>
          <li><Link to="/Pages"><i className="fas fa-file"></i> Pages</Link></li>
          <li><Link to="/Plugins"><i className="fas fa-plug"></i> Plugins</Link></li>
          <li><Link to="/Appearance"><i className="fas fa-paint-brush"></i> Appearance</Link></li>
          <li><Link to="/StoreSettings"><i className="fas fa-cog"></i> Store Setting</Link></li>
          <li><Link to="/PaymentSettings"><i className="fas fa-credit-card"></i> Payment Setting</Link></li>
        </ul>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        {/* HEADER PANEL */}
        <header className="dashboard-header">
          <div className="logo">
            <Link to="/dashboard">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>

          <div className="header-icons">
            <Link to="/YourWeb" className="header-icon">
              <i className="fas fa-globe"></i>
            </Link>
            <div className={`header-icon w-icon ${isDropdownOpen ? "open" : ""}`} onClick={toggleDropdown}>
              W
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/Accounts" className="dropdown-item"><i className="fas fa-user"></i> Accounts</Link>
                  <Link to="/Subscription" className="dropdown-item"><i className="fas fa-dollar-sign"></i> Subscription</Link>
                  <button className="dropdown-item logout" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="content">
          <h1>Payment Settings</h1>
          
          <h2>WebCraft Payment Fulfillment Service</h2>
          <div className="payment-box">
            <img src={QRPaymentLogo} alt="QR Payment" className="payment-logo" />
            <div className="payment-info">
              <p>Supports all wallets and mobile banking applications</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <div className="payment-box">
            <img src={CardPaymentLogo} alt="Card Payment" className="payment-logo" />
            <div className="payment-info">
              <p>Supports all major cards of any country</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          <h2>Self Purchased Payment Services</h2>
          <div className="payment-box">
            <img src={KhaltiLogo} alt="Khalti Payment" className="payment-logo" />
            <div className="payment-info">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
              <i className="fas fa-cog settings-icon"></i>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default PaymentSettings;
