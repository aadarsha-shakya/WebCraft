import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import './Pages.css';
import Logo from './assets/WebCraft.png';

function Pages() {
  const [sections, setSections] = useState([
    { id: '1', type: 'Full Image', image: '/path/to/full-image.png', title: 'Full Image' },
    { id: '2', type: 'Image with Content', image: '/path/to/image-with-content.png', title: 'Image with Content' },
    { id: '3', type: 'FAQ', image: '/path/to/faq.png', title: 'FAQ' },
    { id: '4', type: 'Category Grid', image: '/path/to/category-grid.png', title: 'Category Grid' },
    { id: '5', type: 'Product Grid', image: '/path/to/product-grid.png', title: 'Product Grid' },
    { id: '6', type: 'Single Product View', image: '/path/to/single-product.png', title: 'Single Product View' },
    { id: '7', type: 'Image Slider', image: '/path/to/image-slider.png', title: 'Image Slider' },
  ]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);

  const sectionTypes = [
    { id: '1', type: 'Full Image', image: '/path/to/full-image.png', title: 'Full Image' },
    { id: '2', type: 'Image with Content', image: '/path/to/image-with-content.png', title: 'Image with Content' },
    { id: '3', type: 'FAQ', image: '/path/to/faq.png', title: 'FAQ' },
    { id: '4', type: 'Category Grid', image: '/path/to/category-grid.png', title: 'Category Grid' },
    { id: '5', type: 'Product Grid', image: '/path/to/product-grid.png', title: 'Product Grid' },
    { id: '6', type: 'Single Product View', image: '/path/to/single-product.png', title: 'Single Product View' },
    { id: '7', type: 'Image Slider', image: '/path/to/image-slider.png', title: 'Image Slider' },
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleSectionAdd = (selectedSection) => {
    // Show confirmation alert
    const confirmAdd = window.confirm(`Add ${selectedSection.title}?`);
    if (confirmAdd) {
      setSections([...sections, selectedSection]);
      setIsDropdownOpen(false);
    }
  };

  const handleEditSection = (index) => {
    // Placeholder for edit functionality
    alert(`Edit ${sections[index].title}`);
  };

  const handleDeleteSection = (index) => {
    // Confirm deletion
    const confirmDelete = window.confirm(`Delete ${sections[index].title}?`);
    if (confirmDelete) {
      const newSections = sections.filter((_, i) => i !== index);
      setSections(newSections);
    }
  };

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clearing tokens)
    alert('Logging out...');
    // Redirect to login page or perform other actions
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null) return;

    const newSections = [...sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, removed);

    setSections(newSections);
    setDraggedIndex(null);
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

        <main className="content">
          <h1>Pages</h1>
          {/* Button to Add Page */}
          <button className="add-section-button" onClick={toggleDropdown}>
            + Add Section
          </button>

          {/* Dropdown for selecting section types */}
          {isDropdownOpen && (
            <div className="dropdown">
              <h3>Select a section to add:</h3>
              <div className="dropdown-grid">
                {sectionTypes.map((section, index) => (
                  <div key={index} className="dropdown-grid-item" onClick={() => handleSectionAdd(section)}>
                    <img src={section.image} alt={section.title} />
                    <span>{section.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Render added sections with drag-and-drop */}
          <div className="sections-container">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="added-section"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <img src={section.image} alt={section.title} />
                <span>{section.title}</span>
                <button onClick={() => handleEditSection(index)}>Edit</button>
                <button onClick={() => handleDeleteSection(index)}>Delete</button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Pages;