import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Products.css';
import Logo from './assets/WebCraft.png';

function Products() {
  const [isHeaderDropdownOpen, setIsHeaderDropdownOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    category: '',
    productDescription: '',
    productImages: [],
    variants: []
  });
  const [categories, setCategories] = useState([]);
  const [variants, setVariants] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [variantCombinations, setVariantCombinations] = useState([]);
  const [productStatuses, setProductStatuses] = useState({});
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'Hybrid');
  const navigate = useNavigate();

  const toggleHeaderDropdown = () => {
    setIsHeaderDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    navigate('/Login');
  };

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:8081/api/products?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          setProducts(data);
          const initialStatuses = {};
          data.forEach(product => {
            initialStatuses[product.id] = product.status || 'Active';
          });
          setProductStatuses(initialStatuses);
        })
        .catch(error => console.error('Error fetching products:', error));

      fetch(`http://localhost:8081/api/categories/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(data => setCategories(data))
      .catch(error => {
        console.error("Error fetching categories:", error);
        alert("Error fetching categories. Please try again later.");
      });
    }
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentStep(1);
    setFormData({
      productName: '',
      category: '',
      productDescription: '',
      productImages: [],
      variants: []
    });
    setImagePreviews([]);
    setVariants([]);
    setSizes([]);
    setVariantCombinations([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, productImages: [...formData.productImages, ...files] });
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  const addVariant = () => {
    const variantInput = document.getElementById('variantInput').value.trim();
    if (variantInput && !variants.includes(variantInput)) {
      setVariants([...variants, variantInput]);
      document.getElementById('variantInput').value = '';
    }
  };

  const addSize = () => {
    const sizeInput = document.getElementById('sizeInput').value.trim();
    if (sizeInput && !sizes.includes(sizeInput)) {
      setSizes([...sizes, sizeInput]);
      document.getElementById('sizeInput').value = '';
    }
  };

  useEffect(() => {
    const combinations = variants.flatMap(variant =>
      sizes.map(size => ({ variant, size }))
    );
    setVariantCombinations(combinations);
  }, [variants, sizes]);

  const handleSubmit = async () => {
    const variantDetails = variantCombinations.map((combination, index) => ({
      variant: combination.variant,
      size: combination.size,
      crossedPrice: document.querySelectorAll('input[type="number"]')[index * 6]?.value || 0,
      sellingPrice: document.querySelectorAll('input[type="number"]')[index * 6 + 1]?.value || 0,
      costPrice: document.querySelectorAll('input[type="number"]')[index * 6 + 2]?.value || 0,
      weight: document.querySelectorAll('input[type="number"]')[index * 6 + 3]?.value || 0,
      quantity: document.querySelectorAll('input[type="number"]')[index * 6 + 4]?.value || 0,
      sku: document.getElementById(`sku-${index}`)?.value || ''
    }));

    const formDataToSend = new FormData();
    formDataToSend.append('userId', localStorage.getItem('userId'));
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('productDescription', formData.productDescription);
    formDataToSend.append('variants', JSON.stringify(variantDetails));
    formData.productImages.forEach((file) => {
      formDataToSend.append('productImages', file);
    });

    try {
      const response = await fetch('http://localhost:8081/api/products', {
        method: 'POST',
        body: formDataToSend
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result.message);
      closeModal();
      alert("Product added successfully!");
      const userId = localStorage.getItem('userId');
      if (userId) {
        fetch(`http://localhost:8081/api/products?userId=${userId}`)
          .then(response => response.json())
          .then(data => setProducts(data))
          .catch(error => console.error('Error fetching products:', error));
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.message);
    }
  };

  const handleStatusChange = (productId, status) => {
    setProductStatuses(prevStatuses => ({
      ...prevStatuses,
      [productId]: status
    }));
    fetch(`http://localhost:8081/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status })
    })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      return response.json();
    })
    .then(data => {
      console.log('Status updated:', data);
    })
    .catch(error => {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again later.');
      setProductStatuses(prevStatuses => ({
        ...prevStatuses,
        [productId]: prevStatuses[productId]
      }));
    });
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`http://localhost:8081/api/products/${productId}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
      })
      .then(() => {
        setProducts(products.filter(p => p.id !== productId));
        alert("Product deleted successfully!");
      })
      .catch(error => {
        console.error("Error deleting product:", error);
        alert("Failed to delete product. Please try again later.");
      });
    }
  };

  const selectMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

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
      { name: 'Customization', type: 'header', className: 'customization-header' },
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
      { name: 'Customization', type: 'header', className: 'customization-header' },
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

            <div
              className={`header-icon w-icon ${isHeaderDropdownOpen ? "open" : ""}`}
              onClick={toggleHeaderDropdown}
            >
              W
              {isHeaderDropdownOpen && (
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

        <main className="content">
          <div className="products-container">
            <h1>Products</h1>

            {/* ✅ Removed Search Bar - Only Add Product Button Left */}
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <button onClick={openModal}>+ Add Product</button>
            </div>

            <table className="product-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Variants</th>
                  <th>Inventory</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{product.product_name}</td>
                      <td>
                        {product.variants.map((variant, idx) => (
                          <div key={idx}>
                            {variant.variant_name} / {variant.size}
                          </div>
                        ))}
                      </td>
                      <td>
                        {product.variants.map((variant, idx) => (
                          <div key={idx}>
                            {variant.quantity}
                          </div>
                        ))}
                      </td>
                      <td>
                        <div className="status-dropdown">
                          <select
                            className="dropdown-button"
                            value={productStatuses[product.id] || 'Active'}
                            onChange={(e) => handleStatusChange(product.id, e.target.value)}
                          >
                            <option value="Active">Active</option>
                            <option value="Draft">Draft</option>
                            <option value="Archived">Archived</option>
                          </select>
                        </div>
                      </td>
                      <td>{new Date(product.created_at).toLocaleDateString()}</td>
                      <td>
                        <button className="delete" onClick={() => handleDeleteProduct(product.id)}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7">No records</td>
                  </tr>
                )}
              </tbody>
            </table>

            {showModal && (
              // Modal code remains unchanged
              <div className={`modal ${showModal ? 'show' : ''}`}>
                <div className="modal-content">
                  <h2>Add Product</h2>
                  <button className="close-button" onClick={closeModal}>X</button>
                  <div className="steps">
                    <div className={`step ${currentStep >= 1 ? 'completed' : ''}`}>
                      <span>1</span>
                      <p>General Information</p>
                    </div>
                    <div className={`step ${currentStep >= 2 ? 'completed' : ''}`}>
                      <span>2</span>
                      <p>Variants & Inventory</p>
                    </div>
                  </div>

                  {currentStep === 1 && (
                    <div>
                      <label htmlFor="productName">Product Name *</label>
                      <input
                        type="text"
                        id="productName"
                        name="productName"
                        value={formData.productName}
                        onChange={handleInputChange}
                        required
                      />
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="">Select a category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.category_name}>
                            {category.category_name}
                          </option>
                        ))}
                      </select>
                      <label htmlFor="productDescription">Product Description *</label>
                      <textarea
                        id="productDescription"
                        name="productDescription"
                        value={formData.productDescription}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                      <label htmlFor="productImages">Product Images *</label>
                      <input
                        type="file"
                        id="productImages"
                        name="productImages"
                        multiple
                        onChange={handleImageUpload}
                        required
                      />
                      <div>
                        {imagePreviews.map((preview, index) => (
                          <img key={index} src={preview} alt="Preview" width="50" />
                        ))}
                      </div>
                      <button onClick={() => setCurrentStep(2)}>Next: Variants & Inventory</button>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div>
                      <h3>Variants</h3>
                      <input type="text" id="variantInput" placeholder="Enter variant (e.g., Red)" />
                      <button onClick={addVariant}>Add Variant</button>
                      <ul>
                        {variants.map((variant, index) => (
                          <li key={index}>{variant}</li>
                        ))}
                      </ul>
                      <h3>Sizes</h3>
                      <input type="text" id="sizeInput" placeholder="Enter size (e.g., M)" />
                      <button onClick={addSize}>Add Size</button>
                      <ul>
                        {sizes.map((size, index) => (
                          <li key={index}>{size}</li>
                        ))}
                      </ul>
                      <h3>Variant Combinations</h3>
                      <table>
                        <thead>
                          <tr>
                            <th>Variant/Size</th>
                            <th>Crossed Price</th>
                            <th>Selling Price</th>
                            <th>Cost Price</th>
                            <th>Weight</th>
                            <th>Quantity</th>
                            <th>SKU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variantCombinations.map((combination, index) => (
                            <tr key={index}>
                              <td>{`${combination.variant}/${combination.size}`}</td>
                              <td><input type="number" /></td>
                              <td><input type="number" /></td>
                              <td><input type="number" /></td>
                              <td><input type="number" /></td>
                              <td><input type="number" /></td>
                              <td><input type="text" id={`sku-${index}`} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button onClick={handleSubmit}>Save Product</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Products;