import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Categories.css';
import Logo from './assets/WebCraft.png';
import axios from 'axios';

function Categories() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'Hybrid'); // Load mode from localStorage or default to 'Hybrid'
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clearing tokens)
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

  const [categories, setCategories] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const loggedInUserId = localStorage.getItem('userId');
    if (!loggedInUserId) {
      alert('User not logged in. Redirecting to login...');
      window.location.href = '/login';
    } else {
      setUserId(loggedInUserId);
      fetchCategories(loggedInUserId);
    }
  }, []);

  const fetchCategories = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8081/api/categories/${userId}`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('An error occurred while fetching categories.');
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName || !categoryImage) {
      alert('Please fill in all required fields.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('categoryName', categoryName);
    formData.append('categoryImage', categoryImage);

    try {
      const response = await axios.post('http://localhost:8081/api/categories', formData);
      if (response.data.status === 'created') {
        alert('Category added successfully!');
        fetchCategories(userId);
        setShowAddForm(false);
        setCategoryName('');
        setCategoryImage(null);
      } else {
        alert('Category creation failed.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
      alert('An error occurred while adding the category.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    const confirmation = window.confirm('Are you sure you want to delete this category?');
    if (!confirmation) return;
    try {
      const response = await axios.delete(`http://localhost:8081/api/categories/${categoryId}`);
      if (response.data.status === 'deleted') {
        alert('Category deleted successfully!');
        fetchCategories(userId);
      } else {
        alert('Failed to delete category.');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred while deleting the category.');
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

          {/* Header Icons */}
          <div className="header-icons">
            <Link to="/YourWeb" className="header-icon">
              <i className="fas fa-globe"></i>
            </Link>

            {/* W Icon with Dropdown */}
            <div
              className={`header-icon w-icon ${isDropdownOpen ? 'open' : ''}`}
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
          <div className="categories-container">
            <div className="categories-header">
              <h1>Store Categories</h1>
              <button onClick={() => setShowAddForm(!showAddForm)}>
                Add Category
              </button>
            </div>

            {showAddForm && (
              <form onSubmit={handleAddCategory} className="add-category-form">
                <input
                  type="text"
                  placeholder="Category Name *"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  required
                />
                <input
                  type="file"
                  onChange={(e) => setCategoryImage(e.target.files[0])}
                  required
                />
                <button type="submit">Save Category</button>
              </form>
            )}

            <table className="categories-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.id}>
                    <td>{index + 1}</td>
                    <td>{category.category_name}</td>
                    <td>
                      <img
                        src={`http://localhost:8081/uploads/${category.image}`}
                        alt={category.category_name}
                        width="50"
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Categories;