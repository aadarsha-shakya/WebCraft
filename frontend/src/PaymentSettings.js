import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './PaymentSettings.css';
import Logo from './assets/WebCraft.png';
import KhaltiLogo from './assets/Khalti.png';
import axios from 'axios';

function PaymentSettings() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');
    if (!loggedInUserId) {
      alert('User not logged in. Redirecting to login...');
      window.location.href = '/login';
    } else {
      setUserId(loggedInUserId);
      fetchKhaltiKeys(loggedInUserId);
    }
  }, []);

  const fetchKhaltiKeys = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/khalti_keys/${userId}`);
      if (response.data && response.data.length > 0) {
        setSecretKey(response.data[0].secret_key);
        setPublicKey(response.data[0].public_key);
      }
    } catch (error) {
      console.error('Error fetching Khalti keys:', error);
      alert('An error occurred while fetching Khalti keys.');
    }
  };

  const handleLogout = () => {
    navigate('/Login');
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey || !publicKey) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/api/saveKhaltiKeys', {
        secretKey,
        publicKey,
        userId, // Pass userId in the request body
      });
      if (response.data.status === 'updated') {
        alert('Khalti keys updated successfully!');
      } else {
        alert('Khalti keys saved successfully!');
      }
    } catch (error) {
      console.error('Error saving Khalti keys:', error);
      alert('An error occurred while saving Khalti keys.');
    }
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
            <div className="header-icon w-icon" onClick={handleLogout}>
              W
              <div className="dropdown-menu">
                <Link to="/Accounts" className="dropdown-item"><i className="fas fa-user"></i> Accounts</Link>
                <Link to="/Subscription" className="dropdown-item"><i className="fas fa-dollar-sign"></i> Subscription</Link>
                <button className="dropdown-item logout" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="content">
          <h2>Self Purchased Payment Services</h2>
          <div className="payment-box">
            <img src={KhaltiLogo} alt="Khalti Payment" className="payment-logo" />
            <div className="payment-info">
              <label className="switch">
                <input type="checkbox" />
                <span className="slider round"></span>
              </label>
              <i className="fas fa-cog settings-icon" onClick={toggleSettings}></i>
            </div>
          </div>

          {isSettingsOpen && (
            <div className="khalti-settings-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="secretKey">Secret Key:</label>
                  <input
                    type="text"
                    id="secretKey"
                    value={secretKey}
                    onChange={(e) => setSecretKey(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="publicKey">Public Key:</label>
                  <input
                    type="text"
                    id="publicKey"
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    required
                  />
                </div>
                <button type="submit">Save</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default PaymentSettings;