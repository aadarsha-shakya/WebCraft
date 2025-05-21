import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import './StoreSettings.css';
import Logo from './assets/WebCraft.png';

function StoreSettings() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null); // Store logged-in user's ID
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'Hybrid'); // Load mode from localStorage or default to 'Hybrid'

  // State for each section with default values
  const [formData, setFormData] = useState({
    storeName: '',
    businessCategory: '',
    contactNumber: '',
    storeAddress: '',
    contactEmail: '',
  });
  const [socialAccounts, setSocialAccounts] = useState({
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    whatsappNumber: '',
  });
  const [deliveryCharges, setDeliveryCharges] = useState({
    insideValley: '',
    outsideValley: '',
  });
  const [domainSettings, setDomainSettings] = useState({
    subdomain: '',
    customDomain: '',
  });
  const [businessRegistration, setBusinessRegistration] = useState({
    registeredBusinessName: '',
    registeredAddress: '',
    businessPhoneNumber: '',
    panNumber: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    branchName: '',
  });

  // Track the active section
  const [activeSection, setActiveSection] = useState('storeDetails');

  // Fetch user ID and pre-fill data on component load
  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');
    if (!loggedInUserId) {
      alert('User not logged in. Redirecting to login...');
      window.location.href = '/login'; // Redirect to login page
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
        storeName: storeDetailsResponse.data.store_name || '',
        businessCategory: storeDetailsResponse.data.business_category || '',
        contactNumber: storeDetailsResponse.data.contact_number || '',
        storeAddress: storeDetailsResponse.data.store_address || '',
        contactEmail: storeDetailsResponse.data.contact_email || '',
      });
      setSocialAccounts({
        facebookUrl: socialAccountsResponse.data.facebook_url || '',
        instagramUrl: socialAccountsResponse.data.instagram_url || '',
        tiktokUrl: socialAccountsResponse.data.tiktok_url || '',
        whatsappNumber: socialAccountsResponse.data.whatsapp_number || '',
      });
      setDeliveryCharges({
        insideValley: deliveryChargesResponse.data.inside_valley || '',
        outsideValley: deliveryChargesResponse.data.outside_valley || '',
      });
      setDomainSettings({
        subdomain: domainSettingsResponse.data.subdomain || '',
        customDomain: domainSettingsResponse.data.custom_domain || '',
      });
      setBusinessRegistration({
        registeredBusinessName: businessRegistrationResponse.data.registered_business_name || '',
        registeredAddress: businessRegistrationResponse.data.registered_address || '',
        businessPhoneNumber: businessRegistrationResponse.data.business_phone_number || '',
        panNumber: businessRegistrationResponse.data.pan_number || '',
        bankName: businessRegistrationResponse.data.bank_name || '',
        accountNumber: businessRegistrationResponse.data.account_number || '',
        accountName: businessRegistrationResponse.data.account_name || '',
        branchName: businessRegistrationResponse.data.branch_name || '',
      });
    } catch (error) {
      console.error('Error fetching initial data:', error);
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
    if (!stateData.storeName && !stateData.facebookUrl && !stateData.insideValley && !stateData.subdomain && !stateData.registeredBusinessName) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const response = await axios.post(apiEndpoint, { userId, ...stateData });
      if (response.data.status === 'created' || response.data.status === 'updated') {
        alert(successMessage);
      } else {
        alert('Failed to save data.');
      }
    } catch (error) {
      console.error('Error saving data:', error.response?.data || error.message);
      alert('An error occurred while saving data.');
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  // Handle logout
  const handleLogout = () => {
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
          <div className="logo">
            <Link to="/dashboard">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
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
          <h1>Store Settings Page</h1>
          {/* Navigation Buttons */}
          <div className="store-settings-tabs">
            <button
              className={`store-settings-tab-button ${
                activeSection === 'storeDetails' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('storeDetails')}
            >
              Store Details
            </button>
            <button
              className={`store-settings-tab-button ${
                activeSection === 'socialAccounts' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('socialAccounts')}
            >
              Social Accounts
            </button>
            <button
              className={`store-settings-tab-button ${
                activeSection === 'deliveryCharges' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('deliveryCharges')}
            >
              Delivery Charges
            </button>
            <button
              className={`store-settings-tab-button ${
                activeSection === 'domainSettings' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('domainSettings')}
            >
              Domain Settings
            </button>
            <button
              className={`store-settings-tab-button ${
                activeSection === 'businessRegistration' ? 'active' : ''
              }`}
              onClick={() => setActiveSection('businessRegistration')}
            >
              Business Registration
            </button>
          </div>
          {/* Conditional Rendering of Sections */}
          {activeSection === 'storeDetails' && (
            <form
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'http://localhost:8081/api/storedetails',
                  formData,
                  'Store details saved successfully!'
                )
              }
              className="store-settings-form"
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
              <button type="submit" className="store-settings-save-button">Save Changes</button>
            </form>
          )}
          {activeSection === 'socialAccounts' && (
            <form
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'http://localhost:8081/api/socialaccounts',
                  socialAccounts,
                  'Social accounts saved successfully!'
                )
              }
              className="store-settings-form"
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
              <button type="submit" className="store-settings-save-button">Save Changes</button>
            </form>
          )}
          {activeSection === 'deliveryCharges' && (
            <form
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'http://localhost:8081/api/deliverycharges',
                  deliveryCharges,
                  'Delivery charges saved successfully!'
                )
              }
              className="store-settings-form"
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
              <button type="submit" className="store-settings-save-button">Save Changes</button>
            </form>
          )}
          {activeSection === 'domainSettings' && (
            <form
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'http://localhost:8081/api/domainsettings',
                  domainSettings,
                  'Domain settings saved successfully!'
                )
              }
              className="store-settings-form"
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
              <button type="submit" className="store-settings-save-button">Save Changes</button>
            </form>
          )}
          {activeSection === 'businessRegistration' && (
            <form
              onSubmit={(e) =>
                handleSubmit(
                  e,
                  'http://localhost:8081/api/businessregistration',
                  businessRegistration,
                  'Business registration saved successfully!'
                )
              }
              className="store-settings-form"
            >
              <h3>Business Registration</h3>
              <input
                type="text"
                name="registeredBusinessName"
                placeholder="Registered Business Name *"
                value={businessRegistration.registeredBusinessName}
                onChange={(e) => handleInputChange(e, setBusinessRegistration)}
                required
              />
              <input
                type="text"
                name="registeredAddress"
                placeholder="Registered Address *"
                value={businessRegistration.registeredAddress}
                onChange={(e) => handleInputChange(e, setBusinessRegistration)}
                required
              />
              <input
                type="text"
                name="businessPhoneNumber"
                placeholder="Business Phone Number *"
                value={businessRegistration.businessPhoneNumber}
                onChange={(e) => handleInputChange(e, setBusinessRegistration)}
                required
              />
              <input
                type="text"
                name="panNumber"
                placeholder="PAN Number *"
                value={businessRegistration.panNumber}
                onChange={(e) => handleInputChange(e, setBusinessRegistration)}
                required
              />
              <input
                type="text"
                name="bankName"
                placeholder="Bank Name *"
                value={businessRegistration.bankName}
                onChange={(e) => handleInputChange(e, setBusinessRegistration)}
                required
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Account Number *"
                value={businessRegistration.accountNumber}
                onChange={(e) => handleInputChange(e, setBusinessRegistration)}
                required
              />
              <input
                type="text"
                name="accountName"
                placeholder="Account Name *"
                value={businessRegistration.accountName}
                onChange={(e) => handleInputChange(e, setBusinessRegistration)}
                required
              />
              <input
                type="text"
                name="branchName"
                placeholder="Branch Name *"
                value={businessRegistration.branchName}
                onChange={(e) => handleInputChange(e, setBusinessRegistration)}
                required
              />
              <button type="submit" className="store-settings-save-button">Save Changes</button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}

export default StoreSettings;