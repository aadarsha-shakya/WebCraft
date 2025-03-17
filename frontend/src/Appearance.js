import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Appearance.css';
import Logo from './assets/WebCraft.png';

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
  const [footerSettings, setFooterSettings] = useState({
    footerStyle: '',
    useThemeColor: true,
    backgroundColor: '',
    textColor: '',
    logo: '',
    detailText: '',
    links: []
  });
  const [showFooterModal, setShowFooterModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    console.log("User ID:", userId); // Log the userId to verify it
    if (userId) {
      fetchBranding(userId);
      fetchComponents(userId);
      fetchFooterSettings(userId);
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
    // Perform logout actions if needed (e.g., clearing tokens)
    navigate('/Login'); // Redirect to login page
  };

  const fetchBranding = (userId) => {
    fetch(`/api/branding/${userId}`)
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
    fetch(`/api/components/${userId}`)
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

  const fetchFooterSettings = (userId) => {
    fetch(`/api/footer/${userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data) {
          setFooterSettings(data);
        }
      })
      .catch(error => {
        console.error("Error fetching footer settings:", error);
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

  const handleFooterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFooterSettings(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFooterLinksChange = (index, field, value) => {
    setFooterSettings(prevState => {
      const newLinks = [...prevState.links];
      newLinks[index][field] = value;
      return {
        ...prevState,
        links: newLinks
      };
    });
  };

  const addFooterLink = () => {
    setFooterSettings(prevState => ({
      ...prevState,
      links: [...prevState.links, { label: '', url: '' }]
    }));
  };

  const removeFooterLink = (index) => {
    setFooterSettings(prevState => {
      const newLinks = [...prevState.links];
      newLinks.splice(index, 1);
      return {
        ...prevState,
        links: newLinks
      };
    });
  };

  const saveBranding = () => {
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    fetch('/api/branding', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...branding,
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
      fetchBranding(userId);
    })
    .catch(error => {
      console.error("Error saving branding:", error);
      alert("Failed to save branding settings. Please try again later.");
    });
  };

  const saveComponents = () => {
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    fetch('/api/components', {
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

  const saveFooterSettings = () => {
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    fetch('/api/footer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...footerSettings,
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
      fetchFooterSettings(userId);
      setShowFooterModal(false);
    })
    .catch(error => {
      console.error("Error saving footer settings:", error);
      alert("Failed to save footer settings. Please try again later.");
    });
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    fetch('/api/upload', {
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
      } else if (type === 'footerLogo') {
        setFooterSettings(prevState => ({
          ...prevState,
          logo: data.filename
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
    } else if (type === 'footerLogo') {
      setFooterSettings(prevState => ({
        ...prevState,
        logo: ''
      }));
    }
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
        <input type="file" onChange={(e) => handleImageUpload(e, 'brandLogo')} />
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
        <input type="file" onChange={(e) => handleImageUpload(e, 'brandFavicon')} />
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
          <input type="file" onChange={(e) => handleImageUpload(e, 'popupModalImage')} />
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
      <button onClick={() => setShowFooterModal(true)}>Footer Settings</button>
    </div>
  );

  const renderFooterModal = () => (
    <div className="modal" style={{ display: showFooterModal ? 'block' : 'none' }}>
      <div className="modal-content">
        <span className="close" onClick={() => setShowFooterModal(false)}>&times;</span>
        <h2>Footer Settings</h2>
        <div className="box">
          <span>Style Selection</span>
          <select name="footerStyle" value={footerSettings.footerStyle} onChange={handleFooterChange}>
            <option value="">Select Footer Style</option>
            <option value="style1">Style 1</option>
            <option value="style2">Style 2</option>
            <option value="style3">Style 3</option>
          </select>
        </div>
        <div className="box">
          <span>Color Customization</span>
          <label>
            <input type="checkbox" name="useThemeColor" checked={footerSettings.useThemeColor} onChange={handleFooterChange} />
            Use theme color as background
          </label>
          {!footerSettings.useThemeColor && (
            <>
              <input type="color" name="backgroundColor" value={footerSettings.backgroundColor} onChange={handleFooterChange} />
              <input type="color" name="textColor" value={footerSettings.textColor} onChange={handleFooterChange} />
            </>
          )}
        </div>
        <div className="box">
          <span>Logo Customization</span>
          <input type="file" onChange={(e) => handleImageUpload(e, 'footerLogo')} />
          {footerSettings.logo && (
            <div>
              <img src={`/uploads/${footerSettings.logo}`} alt="Footer Logo" style={{ width: '100px', height: 'auto' }} />
              <button onClick={() => removeImage('footerLogo')}>Remove Image</button>
            </div>
          )}
        </div>
        <div className="box">
          <span>Detail Text Adjustment</span>
          <textarea name="detailText" value={footerSettings.detailText} onChange={handleFooterChange} />
        </div>
        <div className="box">
          <span>Link Management</span>
          {footerSettings.links.map((link, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Label"
                value={link.label}
                onChange={(e) => handleFooterLinksChange(index, 'label', e.target.value)}
              />
              <input
                type="text"
                placeholder="URL"
                value={link.url}
                onChange={(e) => handleFooterLinksChange(index, 'url', e.target.value)}
              />
              <button onClick={() => removeFooterLink(index)}>Remove</button>
            </div>
          ))}
          <button onClick={addFooterLink}>Add Link</button>
        </div>
        <button onClick={saveFooterSettings}>Save Changes</button>
      </div>
    </div>
  );

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
          <li>
            <Link to="/Inventory">
              <i className="fas fa-warehouse"></i> Inventory
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
          </div>
          {/* Render Content Based on Active Tab */}
          {activeTab === 'branding' ? renderBrandingContent() : renderComponentsContent()}
          {renderFooterModal()}
        </main>
      </div>
    </div>
  );
}

export default Appearance;