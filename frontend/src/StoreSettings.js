import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import './Dashboard.css';
import './StoreSettings.css';

import Logo from './assets/WebCraft.png';

function StoreSettings() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // Store logged-in user's ID

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  const handleLogout = () => {
    navigate('/Login'); // Redirect to login page
  };

  // State for each section with default values
  const [formData, setFormData] = useState({
    storeName: "",
    businessCategory: "",
    contactNumber: "",
    storeAddress: "",
    contactEmail: "",
  });

  const [socialAccounts, setSocialAccounts] = useState({
    facebookUrl: "",
    instagramUrl: "",
    tiktokUrl: "",
    whatsappNumber: "",
  });

  const [deliveryCharges, setDeliveryCharges] = useState({
    insideValley: "",
    outsideValley: "",
  });

  const [domainSettings, setDomainSettings] = useState({
    subdomain: "",
    customDomain: "",
  });

  const [businessRegistration, setBusinessRegistration] = useState({
    registeredBusinessName: "",
    registeredAddress: "",
    businessPhoneNumber: "",
    panNumber: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
    branchName: "",
  });

  // Track the active section
  const [activeSection, setActiveSection] = useState("storeDetails");

  // Fetch user ID and pre-fill data on component load
  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    if (!loggedInUserId) {
      alert("User not logged in. Redirecting to login...");
      window.location.href = "/login"; // Redirect to login page
    } else {
      setUserId(loggedInUserId);
      fetchInitialData(loggedInUserId);
    }
  }, []);

  // Fetch initial data for all sections
  const fetchInitialData = async (userId) => {
    try {
      const [
        storeDetailsResponse,
        socialAccountsResponse,
        deliveryChargesResponse,
        domainSettingsResponse,
        businessRegistrationResponse,
      ] = await Promise.all([
        axios.get(`http://localhost:8081/api/storedetails?userId=${userId}`),
        axios.get(`http://localhost:8081/api/socialaccounts?userId=${userId}`),
        axios.get(`http://localhost:8081/api/deliverycharges?userId=${userId}`),
        axios.get(`http://localhost:8081/api/domainsettings?userId=${userId}`),
        axios.get(`http://localhost:8081/api/businessregistration?userId=${userId}`),
      ]);

      // Pre-fill form data with default values if the response is empty
      setFormData({
        storeName: storeDetailsResponse.data.store_name || "",
        businessCategory: storeDetailsResponse.data.business_category || "",
        contactNumber: storeDetailsResponse.data.contact_number || "",
        storeAddress: storeDetailsResponse.data.store_address || "",
        contactEmail: storeDetailsResponse.data.contact_email || "",
      });

      setSocialAccounts({
        facebookUrl: socialAccountsResponse.data.facebook_url || "",
        instagramUrl: socialAccountsResponse.data.instagram_url || "",
        tiktokUrl: socialAccountsResponse.data.tiktok_url || "",
        whatsappNumber: socialAccountsResponse.data.whatsapp_number || "",
      });

      setDeliveryCharges({
        insideValley: deliveryChargesResponse.data.inside_valley || "",
        outsideValley: deliveryChargesResponse.data.outside_valley || "",
      });

      setDomainSettings({
        subdomain: domainSettingsResponse.data.subdomain || "",
        customDomain: domainSettingsResponse.data.custom_domain || "",
      });

      setBusinessRegistration({
        registeredBusinessName: businessRegistrationResponse.data.registered_business_name || "",
        registeredAddress: businessRegistrationResponse.data.registered_address || "",
        businessPhoneNumber: businessRegistrationResponse.data.business_phone_number || "",
        panNumber: businessRegistrationResponse.data.pan_number || "",
        bankName: businessRegistrationResponse.data.bank_name || "",
        accountNumber: businessRegistrationResponse.data.account_number || "",
        accountName: businessRegistrationResponse.data.account_name || "",
        branchName: businessRegistrationResponse.data.branch_name || "",
      });
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  // Handle input changes for each section
  const handleInputChange = (e, setState) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  // Submit handlers for each section
  const handleSubmit = async (e, apiEndpoint, stateData, successMessage) => {
    e.preventDefault();
    try {
      const response = await axios.post(apiEndpoint, { userId, ...stateData });
      if (response.data.status === "created" || response.data.status === "updated") {
        alert(successMessage);
      } else {
        alert("Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error.response?.data || error.message);
      alert("An error occurred while saving data.");
    }
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
            <Link to="/Instore">
              <i className="fas fa-store"></i> Instore
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
          <div className="logo">
            <Link to="/dashboard">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
          <div className="header-icons">
            <Link to="/YourWeb" className="header-icon">
              <i className="fas fa-globe"></i>
            </Link>
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
        <main>
          <div>
            <h1>Store Settings Page</h1>
            {/* Navigation Buttons */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
              <button onClick={() => setActiveSection("storeDetails")}>
                Store Details
              </button>
              <button onClick={() => setActiveSection("socialAccounts")}>
                Social Accounts
              </button>
              <button onClick={() => setActiveSection("deliveryCharges")}>
                Delivery Charges
              </button>
              <button onClick={() => setActiveSection("domainSettings")}>
                Domain Settings
              </button>
              <button onClick={() => setActiveSection("businessRegistration")}>
                Business Registration
              </button>
            </div>
            {/* Conditional Rendering of Sections */}
            {activeSection === "storeDetails" && (
              <form
                onSubmit={(e) =>
                  handleSubmit(
                    e,
                    "http://localhost:8081/api/storedetails",
                    formData,
                    "Store details saved successfully!"
                  )
                }
              >
                <h3>Store Details</h3>
                <input
                  type="text"
                  name="storeName"
                  placeholder="Store Name *"
                  value={formData.storeName}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  required
                />
                <input
                  type="text"
                  name="businessCategory"
                  placeholder="Business Category *"
                  value={formData.businessCategory}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  required
                />
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="Contact Number *"
                  value={formData.contactNumber}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  required
                />
                <input
                  type="text"
                  name="storeAddress"
                  placeholder="Store Address *"
                  value={formData.storeAddress}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  required
                />
                <input
                  type="email"
                  name="contactEmail"
                  placeholder="Contact Email Address *"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange(e, setFormData)}
                  required
                />
                <button type="submit">Save Changes</button>
              </form>
            )}
            {activeSection === "socialAccounts" && (
              <form
                onSubmit={(e) =>
                  handleSubmit(
                    e,
                    "http://localhost:8081/api/socialaccounts",
                    socialAccounts,
                    "Social accounts saved successfully!"
                  )
                }
              >
                <h3>Social Accounts</h3>
                <input
                  type="url"
                  name="facebookUrl"
                  placeholder="Facebook URL"
                  value={socialAccounts.facebookUrl}
                  onChange={(e) => handleInputChange(e, setSocialAccounts)}
                />
                <input
                  type="url"
                  name="instagramUrl"
                  placeholder="Instagram URL"
                  value={socialAccounts.instagramUrl}
                  onChange={(e) => handleInputChange(e, setSocialAccounts)}
                />
                <input
                  type="url"
                  name="tiktokUrl"
                  placeholder="TikTok URL"
                  value={socialAccounts.tiktokUrl}
                  onChange={(e) => handleInputChange(e, setSocialAccounts)}
                />
                <input
                  type="text"
                  name="whatsappNumber"
                  placeholder="WhatsApp Number"
                  value={socialAccounts.whatsappNumber}
                  onChange={(e) => handleInputChange(e, setSocialAccounts)}
                />
                <button type="submit">Save Changes</button>
              </form>
            )}
            {activeSection === "deliveryCharges" && (
              <form
                onSubmit={(e) =>
                  handleSubmit(
                    e,
                    "http://localhost:8081/api/deliverycharges",
                    deliveryCharges,
                    "Delivery charges saved successfully!"
                  )
                }
              >
                <h3>Delivery Charges</h3>
                <input
                  type="number"
                  name="insideValley"
                  placeholder="Inside Valley"
                  value={deliveryCharges.insideValley}
                  onChange={(e) => handleInputChange(e, setDeliveryCharges)}
                />
                <input
                  type="number"
                  name="outsideValley"
                  placeholder="Outside Valley"
                  value={deliveryCharges.outsideValley}
                  onChange={(e) => handleInputChange(e, setDeliveryCharges)}
                />
                <button type="submit">Save Changes</button>
              </form>
            )}
            {activeSection === "domainSettings" && (
              <form
                onSubmit={(e) =>
                  handleSubmit(
                    e,
                    "http://localhost:8081/api/domainsettings",
                    domainSettings,
                    "Domain settings saved successfully!"
                  )
                }
              >
                <h3>Domain Settings</h3>
                <input
                  type="text"
                  name="subdomain"
                  placeholder="Subdomain"
                  value={domainSettings.subdomain}
                  onChange={(e) => handleInputChange(e, setDomainSettings)}
                />
                <input
                  type="text"
                  name="customDomain"
                  placeholder="Custom Domain"
                  value={domainSettings.customDomain}
                  onChange={(e) => handleInputChange(e, setDomainSettings)}
                />
                <button type="submit">Save Changes</button>
              </form>
            )}
            {activeSection === "businessRegistration" && (
              <form
                onSubmit={(e) =>
                  handleSubmit(
                    e,
                    "http://localhost:8081/api/businessregistration",
                    businessRegistration,
                    "Business registration saved successfully!"
                  )
                }
              >
                <h3>Business Registration</h3>
                <input
                  type="text"
                  name="registeredBusinessName"
                  placeholder="Registered Business Name *"
                  value={businessRegistration.registeredBusinessName}
                  onChange={(e) =>
                    handleInputChange(e, setBusinessRegistration)
                  }
                  required
                />
                <input
                  type="text"
                  name="registeredAddress"
                  placeholder="Registered Address *"
                  value={businessRegistration.registeredAddress}
                  onChange={(e) =>
                    handleInputChange(e, setBusinessRegistration)
                  }
                  required
                />
                <input
                  type="text"
                  name="businessPhoneNumber"
                  placeholder="Business Phone Number *"
                  value={businessRegistration.businessPhoneNumber}
                  onChange={(e) =>
                    handleInputChange(e, setBusinessRegistration)
                  }
                  required
                />
                <input
                  type="text"
                  name="panNumber"
                  placeholder="PAN Number *"
                  value={businessRegistration.panNumber}
                  onChange={(e) =>
                    handleInputChange(e, setBusinessRegistration)
                  }
                  required
                />
                <input
                  type="text"
                  name="bankName"
                  placeholder="Bank Name *"
                  value={businessRegistration.bankName}
                  onChange={(e) =>
                    handleInputChange(e, setBusinessRegistration)
                  }
                  required
                />
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Account Number *"
                  value={businessRegistration.accountNumber}
                  onChange={(e) =>
                    handleInputChange(e, setBusinessRegistration)
                  }
                  required
                />
                <input
                  type="text"
                  name="accountName"
                  placeholder="Account Name *"
                  value={businessRegistration.accountName}
                  onChange={(e) =>
                    handleInputChange(e, setBusinessRegistration)
                  }
                  required
                />
                <input
                  type="text"
                  name="branchName"
                  placeholder="Branch Name *"
                  value={businessRegistration.branchName}
                  onChange={(e) =>
                    handleInputChange(e, setBusinessRegistration)
                  }
                  required
                />
                <button type="submit">Save Changes</button>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default StoreSettings;