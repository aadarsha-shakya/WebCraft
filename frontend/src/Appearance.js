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
    imageRatio: '',
    popupModalMessage: ''
  });
  const [components, setComponents] = useState({
    topBarText: '',
    navigationType: '',
    footerContent: '',
    facebookUrl: '',
    instagramUrl: '',
    tiktokUrl: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage
    fetchBranding(userId);
    fetchComponents(userId);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clearing tokens)
    navigate('/Login'); // Redirect to login page
  };

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

  const handleBrandingChange = (e) => {
    const { name, value } = e.target;
    setBranding(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleComponentsChange = (e) => {
    const { name, value } = e.target;
    setComponents(prevState => ({
      ...prevState,
      [name]: value
    }));
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
    .then(response => response.json())
    .then(data => {
      alert(data.message);
    })
    .catch(error => console.error("Error saving branding:", error));
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
    .then(response => response.json())
    .then(data => {
      alert(data.message);
    })
    .catch(error => console.error("Error saving components:", error));
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
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
      }
    })
    .catch(error => console.error("Error uploading image:", error));
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
    }
  };

  const renderBrandingContent = () => (
    <div className="tab-content">
      <div className="box">
        <span>Primary Color</span>
        <select name="primaryColor" value={branding.primaryColor} onChange={handleBrandingChange}>
          <option value="">Select Color</option>
          <option value="red">Red</option>
          <option value="black">Black</option>
          <option value="blue">Blue</option>
          {/* Add more colors as needed */}
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
          {/* Add more fonts as needed */}
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
        <span>Image Ratio</span>
        <input type="text" name="imageRatio" value={branding.imageRatio} onChange={handleBrandingChange} />
      </div>
      <div className="box">
        <span>Popup Modal Message</span>
        <textarea name="popupModalMessage" value={branding.popupModalMessage} onChange={handleBrandingChange} />
      </div>
      <button onClick={saveBranding}>Save Branding</button>
    </div>
  );

  const renderComponentsContent = () => (
    <div className="tab-content">
      <div className="box">
        <span>Top Bar Text</span>
        <input type="text" name="topBarText" value={components.topBarText} onChange={handleComponentsChange} />
      </div>
      <div className="box">
        <span>Navigation Type</span>
        <select name="navigationType" value={components.navigationType} onChange={handleComponentsChange}>
          <option value="">Select Navigation Type</option>
          <option value="basic">Navbar Basic</option>
          <option value="withCategories">Navbar with Categories</option>
          <option value="centeredLogo">Navbar Centered Logo</option>
        </select>
      </div>
      <div className="box">
        <span>Footer Content</span>
        <textarea name="footerContent" value={components.footerContent} onChange={handleComponentsChange} />
      </div>
      <div className="box">
        <span>Facebook URL</span>
        <input type="text" name="facebookUrl" value={components.facebookUrl} onChange={handleComponentsChange} />
      </div>
      <div className="box">
        <span>Instagram URL</span>
        <input type="text" name="instagramUrl" value={components.instagramUrl} onChange={handleComponentsChange} />
      </div>
      <div className="box">
        <span>TikTok URL</span>
        <input type="text" name="tiktokUrl" value={components.tiktokUrl} onChange={handleComponentsChange} />
      </div>
      <button onClick={saveComponents}>Save Components</button>
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
        </main>
      </div>
    </div>
  );
}

export default Appearance;