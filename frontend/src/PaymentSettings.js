import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./PaymentSettings.css";
import Logo from "./assets/WebCraft.png";
import KhaltiLogo from "./assets/Khalti.png";
import axios from "axios";

function PaymentSettings() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [userId, setUserId] = useState(null);
  const [mode, setMode] = useState(localStorage.getItem("mode") || "Hybrid"); // Load mode from localStorage or default to 'Hybrid'
  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    if (!loggedInUserId) {
      alert("User not logged in. Redirecting to login...");
      window.location.href = "/login";
    } else {
      setUserId(loggedInUserId);
      fetchKhaltiKeys(loggedInUserId);
    }
  }, []);

  const fetchKhaltiKeys = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/api/khalti_keys/${userId}`
      );
      if (response.data && response.data.length > 0) {
        setSecretKey(response.data[0].secret_key);
        setPublicKey(response.data[0].public_key);
      }
    } catch (error) {
      console.error("Error fetching Khalti keys:", error);
      alert("An error occurred while fetching Khalti keys.");
    }
  };

  const handleLogout = () => {
    navigate("/Login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prevState) => !prevState);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey || !publicKey) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8081/api/saveKhaltiKeys",
        {
          secretKey,
          publicKey,
          userId, // Pass userId in the request body
        }
      );
      if (response.data.status === "updated") {
        alert("Khalti keys updated successfully!");
      } else {
        alert("Khalti keys saved successfully!");
      }
    } catch (error) {
      console.error("Error saving Khalti keys:", error);
      alert("An error occurred while saving Khalti keys.");
    }
  };

  // Update mode based on button click and save to localStorage
  const selectMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem("mode", newMode); // Save mode to localStorage
  };

  // Determine which links to show based on the mode
  const getLinks = () => {
    const hybridLinks = [
      { name: "Home", icon: "fa-home", path: "/dashboard" },
      { name: "Store Users", icon: "fa-users", path: "/StoreUsers" },
      { name: "Categories", icon: "fa-th", path: "/Categories" },
      { name: "Products", icon: "fa-box", path: "/Products" },
      { name: "Customers", icon: "fa-user", path: "/Customers" },
      { name: "Orders", icon: "fa-shopping-cart", path: "/Orders" },
      { name: "Issues", icon: "fa-exclamation-circle", path: "/Issues" },
      {
        name: "Barcode Scanner",
        icon: "fa-barcode",
        path: "/BarcodeGeneration",
      },
      { name: "Instore", icon: "fa-store", path: "/Instore" },
      { name: "Settlement", icon: "fa-wallet", path: "/Settlement" },
      { name: "Analytics", icon: "fa-chart-line", path: "/Analytics" },
      {
        name: "Customization",
        type: "header",
        className: "customization-header",
      }, // Customization header
      { name: "Pages", icon: "fa-file", path: "/Pages" },
      { name: "Plugins", icon: "fa-plug", path: "/Plugins" },
      { name: "Appearance", icon: "fa-paint-brush", path: "/Appearance" },
      { name: "Store Setting", icon: "fa-cog", path: "/StoreSettings" },
      {
        name: "Payment Setting",
        icon: "fa-credit-card",
        path: "/PaymentSettings",
      },
    ];
    const onlineLinks = [
      { name: "Home", icon: "fa-home", path: "/dashboard" },
      { name: "Store Users", icon: "fa-users", path: "/StoreUsers" },
      { name: "Categories", icon: "fa-th", path: "/Categories" },
      { name: "Products", icon: "fa-box", path: "/Products" },
      { name: "Customers", icon: "fa-user", path: "/Customers" },
      { name: "Orders", icon: "fa-shopping-cart", path: "/Orders" },
      { name: "Issues", icon: "fa-exclamation-circle", path: "/Issues" },
      {
        name: "Barcode Scanner",
        icon: "fa-barcode",
        path: "/BarcodeGeneration",
      },
      { name: "Settlement", icon: "fa-wallet", path: "/Settlement" },
      { name: "Analytics", icon: "fa-chart-line", path: "/Analytics" },
      {
        name: "Customization",
        type: "header",
        className: "customization-header",
      }, // Customization header
      { name: "Pages", icon: "fa-file", path: "/Pages" },
      { name: "Plugins", icon: "fa-plug", path: "/Plugins" },
      { name: "Appearance", icon: "fa-paint-brush", path: "/Appearance" },
      { name: "Store Setting", icon: "fa-cog", path: "/StoreSettings" },
      {
        name: "Payment Setting",
        icon: "fa-credit-card",
        path: "/PaymentSettings",
      },
    ];
    const instoreLinks = [
      { name: "Home", icon: "fa-home", path: "/dashboard" },
      { name: "Issues", icon: "fa-exclamation-circle", path: "/Issues" },
      {
        name: "Barcode Scanner",
        icon: "fa-barcode",
        path: "/BarcodeGeneration",
      },
      { name: "Instore", icon: "fa-store", path: "/Instore" },
      { name: "Settlement", icon: "fa-wallet", path: "/Settlement" },
      { name: "Analytics", icon: "fa-chart-line", path: "/Analytics" },
    ];
    switch (mode) {
      case "Hybrid":
        return hybridLinks;
      case "Online":
        return onlineLinks;
      case "Instore":
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
              {link.type === "header" ? (
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

            {/* Mode Toggle Button */}
            <div className="mode-toggle">
              <div className="toggle-container">
                <button
                  className={`toggle-button ${
                    mode === "Instore" ? "active" : ""
                  }`}
                  onClick={() => selectMode("Instore")}
                >
                  <i className="fas fa-store"></i>
                </button>
                <button
                  className={`toggle-button ${
                    mode === "Hybrid" ? "active" : ""
                  }`}
                  onClick={() => selectMode("Hybrid")}
                >
                  <i className="fas fa-code-branch"></i>
                </button>
                <button
                  className={`toggle-button ${
                    mode === "Online" ? "active" : ""
                  }`}
                  onClick={() => selectMode("Online")}
                >
                  <i className="fas fa-globe"></i>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="content">
          <h2>Self Purchased Payment Services</h2>
          <div className="payment-box">
            <img
              src={KhaltiLogo}
              alt="Khalti Payment"
              className="payment-logo"
            />
            <div className="payment-info">
              <div className="payment-text">
                <p>
                  <strong>Khalti</strong>
                </p>
              </div>
              <i
                className="fas fa-cog settings-icon"
                onClick={toggleSettings}
              ></i>
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
