import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Categories.css';
import Logo from './assets/WebCraft.png';
import axios from 'axios';

function Categories() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clearing tokens)
    navigate('/Login'); // Redirect to login page
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