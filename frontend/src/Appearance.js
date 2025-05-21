import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Appearance.css';
import Logo from './assets/WebCraft.png';

const FooterEditor = ({ footer, onFooterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFooterChange({ ...footer, [name]: value });
  };
  return (
    <div className="footer-editor">
      <div className="box">
        <span>Description</span>
        <textarea
          name="description"
          value={footer.description}
          onChange={handleChange}
          placeholder="Write footer description here"
        />
      </div>
      <div className="box">
        <span>Copyright Information</span>
        <input
          type="text"
          name="copyright"
          value={footer.copyright}
          onChange={handleChange}
          placeholder="Enter copyright information"
        />
      </div>
      <div className="box">
        <span>Links</span>
        <input
          type="text"
          name="shippingPolicy"
          value={footer.shippingPolicy}
          onChange={handleChange}
          placeholder="Shipping Policy URL"
        />
        <input
          type="text"
          name="refundPolicy"
          value={footer.refundPolicy}
          onChange={handleChange}
          placeholder="Refund Policy URL"
        />
        <input
          type="text"
          name="privacyPolicy"
          value={footer.privacyPolicy}
          onChange={handleChange}
          placeholder="Privacy Policy URL"
        />
        <input
          type="text"
          name="termsOfService"
          value={footer.termsOfService}
          onChange={handleChange}
          placeholder="Terms of Service URL"
        />
      </div>
      <div className="box">
        <span>Social Media Links</span>
        <input
          type="text"
          name="facebook"
          value={footer.facebook}
          onChange={handleChange}
          placeholder="Facebook URL"
        />
        <input
          type="text"
          name="youtube"
          value={footer.youtube}
          onChange={handleChange}
          placeholder="YouTube URL"
        />
        <input
          type="text"
          name="instagram"
          value={footer.instagram}
          onChange={handleChange}
          placeholder="Instagram URL"
        />
        <input
          type="text"
          name="whatsapp"
          value={footer.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp URL"
        />
      </div>
    </div>
  );
};

function Appearance() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('branding'); // State to track active tab
  const [branding, setBranding] = useState({
    primaryColor: '',
    brandName: '',
    brandLogo: '',
    fontFamily: '',
    brandFavicon: '',
    popupModalImage: '',
    popupModalLink: '',
    popupModalEnabled: false
  });
  const [components, setComponents] = useState({
    navigationType: ''
  });
  const [footer, setFooter] = useState({
    description: '',
    copyright: '',
    shippingPolicy: '',
    refundPolicy: '',
    privacyPolicy: '',
    termsOfService: '',
    facebook: '',
    youtube: '',
    instagram: '',
    whatsapp: ''
  });
  const navigate = useNavigate();
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'Hybrid'); // Load mode from localStorage or default to 'Hybrid'

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    console.log("User ID:", userId); // Log the userId to verify it
    if (userId) {
      fetchBranding(userId);
      fetchComponents(userId);
      fetchFooter(userId);
    } else {
      console.error("User ID not found in localStorage");
      alert("User ID not found. Please log in again.");
      navigate('/Login');
    }
  }, [navigate]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  const handleLogout = () => {
    navigate('/Login'); // Redirect to login page
  };

  const fetchBranding = (userId) => {
    fetch(`http://localhost:8081/api/branding/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setBranding(data);
        }
      })
      .catch(error => {
        console.error("Error fetching branding:", error);
        alert("Failed to fetch branding settings. Please try again later.");
      });
  };

  const fetchComponents = (userId) => {
    fetch(`http://localhost:8081/api/components/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setComponents(data);
        }
      })
      .catch(error => {
        console.error("Error fetching components:", error);
        alert("Failed to fetch component settings. Please try again later.");
      });
  };

  const fetchFooter = (userId) => {
    fetch(`http://localhost:8081/api/footer/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setFooter(data);
        }
      })
      .catch(error => {
        console.error("Error fetching footer:", error);
        alert("Failed to fetch footer settings. Please try again later.");
      });
  };

  const handleBrandingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBranding(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleComponentsChange = (e) => {
    const { name, value } = e.target;
    setComponents(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFooterChange = (updatedFooter) => {
    setFooter(updatedFooter);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    fetch('http://localhost:8081/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (type === 'brandLogo') {
        setBranding(prevState => ({
          ...prevState,
          brandLogo: data.filename
        }));
      } else if (type === 'brandFavicon') {
        setBranding(prevState => ({
          ...prevState,
          brandFavicon: data.filename
        }));
      } else if (type === 'popupModalImage') {
        setBranding(prevState => ({
          ...prevState,
          popupModalImage: data.filename
        }));
      }
    })
    .catch(error => {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again later.");
    });
  };

  const removeImage = (type) => {
    if (type === 'brandLogo') {
      setBranding(prevState => ({
        ...prevState,
        brandLogo: ''
      }));
    } else if (type === 'brandFavicon') {
      setBranding(prevState => ({
        ...prevState,
        brandFavicon: ''
      }));
    } else if (type === 'popupModalImage') {
      setBranding(prevState => ({
        ...prevState,
        popupModalImage: ''
      }));
    }
  };

  const saveBranding = () => {
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('primaryColor', branding.primaryColor);
    formData.append('brandName', branding.brandName);
    formData.append('fontFamily', branding.fontFamily);
    formData.append('popupModalEnabled', branding.popupModalEnabled);
    formData.append('popupModalLink', branding.popupModalLink);
    if (document.getElementById('brandLogo').files[0]) {
      formData.append('brandLogo', document.getElementById('brandLogo').files[0]);
    }
    if (document.getElementById('brandFavicon').files[0]) {
      formData.append('brandFavicon', document.getElementById('brandFavicon').files[0]);
    }
    if (document.getElementById('popupModalImage').files[0]) {
      formData.append('popupModalImage', document.getElementById('popupModalImage').files[0]);
    }
    fetch('http://localhost:8081/api/branding', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      fetchBranding(userId);
    })
    .catch(error => {
      console.error("Error saving branding:", error);
      alert("Failed to save branding settings. Please try again later.");
    });
  };

  const saveComponents = () => {
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    fetch('http://localhost:8081/api/components', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...components,
        userId
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      fetchComponents(userId);
    })
    .catch(error => {
      console.error("Error saving components:", error);
      alert("Failed to save component settings. Please try again later.");
    });
  };

  const saveFooter = () => {
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    fetch('http://localhost:8081/api/footer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...footer,
        userId
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      alert(data.message);
      fetchFooter(userId);
    })
    .catch(error => {
      console.error("Error saving footer:", error);
      alert("Failed to save footer settings. Please try again later.");
    });
  };

  const renderBrandingContent = () => (
    <div className="tab-content">
      <div className="box">
        <span>Primary Color</span>
        <select name="primaryColor" value={branding.primaryColor} onChange={handleBrandingChange}>
          <option value="">Select Color</option>
          <option value="darkgray">Dark Gray</option>
          <option value="red">Red</option>
          <option value="violet">Violet</option>
          <option value="indigo">Indigo</option>
          <option value="brown">Brown</option>
        </select>
      </div>
      <div className="box">
        <span>Brand Name</span>
        <input type="text" name="brandName" value={branding.brandName} onChange={handleBrandingChange} />
      </div>
      <div className="box">
        <span>Brand Logo</span>
        <input type="file" id="brandLogo" onChange={(e) => handleImageUpload(e, 'brandLogo')} />
        {branding.brandLogo && (
          <div>
            <img src={`/uploads/${branding.brandLogo}`} alt="Brand Logo" style={{ width: '100px', height: 'auto' }} />
            <button onClick={() => removeImage('brandLogo')}>Remove Image</button>
          </div>
        )}
      </div>
      <div className="box">
        <span>Font Family</span>
        <select name="fontFamily" value={branding.fontFamily} onChange={handleBrandingChange}>
          <option value="">Select Font</option>
          <option value="Montserrat">Montserrat</option>
          <option value="Arial">Arial</option>
          <option value="Roboto">Roboto</option>
        </select>
      </div>
      <div className="box">
        <span>Brand Favicon</span>
        <input type="file" id="brandFavicon" onChange={(e) => handleImageUpload(e, 'brandFavicon')} />
        {branding.brandFavicon && (
          <div>
            <img src={`/uploads/${branding.brandFavicon}`} alt="Brand Favicon" style={{ width: '32px', height: '32px' }} />
            <button onClick={() => removeImage('brandFavicon')}>Remove Image</button>
          </div>
        )}
      </div>
      <div className="box">
        <span>Popup Modal Enabled</span>
        <input type="checkbox" name="popupModalEnabled" checked={branding.popupModalEnabled} onChange={handleBrandingChange} />
      </div>
      {branding.popupModalEnabled && (
        <div className="box">
          <span>Popup Modal Image</span>
          <input type="file" id="popupModalImage" onChange={(e) => handleImageUpload(e, 'popupModalImage')} />
          {branding.popupModalImage && (
            <div>
              <img src={`/uploads/${branding.popupModalImage}`} alt="Popup Modal" style={{ width: '100px', height: 'auto' }} />
              <button onClick={() => removeImage('popupModalImage')}>Remove Image</button>
            </div>
          )}
          <span>Popup Modal Link</span>
          <input type="text" name="popupModalLink" value={branding.popupModalLink} onChange={handleBrandingChange} />
        </div>
      )}
      <button onClick={saveBranding}>Save Branding</button>
    </div>
  );

  const renderComponentsContent = () => (
    <div className="tab-content">
      <div className="box">
        <span>Navigation Type</span>
        <select name="navigationType" value={components.navigationType} onChange={handleComponentsChange}>
          <option value="">Select Navigation Type</option>
          <option value="basic">Navbar Basic</option>
          <option value="withCategories">Navbar with Categories</option>
          <option value="centeredLogo">Navbar Centered Logo</option>
        </select>
      </div>
      <button onClick={saveComponents}>Save Components</button>
    </div>
  );

  const renderFooterContent = () => (
    <div className="tab-content">
      <FooterEditor footer={footer} onFooterChange={handleFooterChange} />
      <button onClick={saveFooter}>Save Footer</button>
    </div>
  );

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
          <h1>Appearance</h1>
          {/* Tab Navigation */}
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'branding' ? 'active' : ''}`}
              onClick={() => setActiveTab('branding')}
            >
              Branding
            </button>
            <button
              className={`tab-button ${activeTab === 'components' ? 'active' : ''}`}
              onClick={() => setActiveTab('components')}
            >
              Components
            </button>
            <button
              className={`tab-button ${activeTab === 'footer' ? 'active' : ''}`}
              onClick={() => setActiveTab('footer')}
            >
              Footer
            </button>
          </div>
          {/* Render Content Based on Active Tab */}
          {activeTab === 'branding'
            ? renderBrandingContent()
            : activeTab === 'components'
            ? renderComponentsContent()
            : renderFooterContent()}
        </main>
      </div>
    </div>
  );
}

export default Appearance;