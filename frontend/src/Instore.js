import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './InStore.css'; // Ensure you have the correct path to your CSS file
import Logo from './assets/WebCraft.png';

function InStore() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    orderNote: '',
    address: '',
    paymentMethod: 'Cash',
    productId: '',
    variantId: ''
  });
  const [soldProducts, setSoldProducts] = useState([]);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
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
        })
        .catch(error => console.error('Error fetching products:', error));

      fetch(`http://localhost:8081/api/instore/user/${userId}`)
        .then(response => response.json())
        .then(data => {
          setSoldProducts(data);
        })
        .catch(error => console.error('Error fetching sold products:', error));
    }
  }, []);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      fullName: '',
      phoneNumber: '',
      orderNote: '',
      address: '',
      paymentMethod: 'Cash',
      productId: '',
      variantId: ''
    });
    setSelectedProduct(null);
    setSelectedVariant(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductChange = (e) => {
    const productId = e.target.value;
    const product = products.find(p => p.id === parseInt(productId));
    setSelectedProduct(product);
    setSelectedVariant(null); // Reset variant when product changes
    setFormData({ ...formData, productId, variantId: '' }); // Clear variantId when product changes
  };

  const handleVariantChange = (e) => {
    const variantId = e.target.value;
    const variant = selectedProduct.variants.find(v => v.id === parseInt(variantId));
    setSelectedVariant(variant);
    setFormData({ ...formData, variantId });
  };

  const handleSubmit = async () => {
    if (!selectedProduct || !selectedVariant) {
      alert('Please select a product and variant.');
      return;
    }
    const orderDetails = {
      ...formData,
      userId: localStorage.getItem('userId'),
      productId: selectedProduct.id,
      variantId: selectedVariant.id,
      productName: selectedProduct.product_name,
      variantName: selectedVariant.variant_name,
      size: selectedVariant.size,
      sellingPrice: selectedVariant.selling_price,
      quantity: 1
    };
    try {
      const response = await fetch('http://localhost:8081/api/instore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderDetails)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log(result.message);
      closeModal();
      alert("Product sold successfully!");
      // Refresh sold products list
      fetch(`http://localhost:8081/api/instore/user/${localStorage.getItem('userId')}`)
        .then(response => response.json())
        .then(data => setSoldProducts(data))
        .catch(error => console.error('Error fetching sold products:', error));
    } catch (error) {
      console.error("Error selling product:", error);
      alert(error.message);
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
          <h1>InStore</h1>
          <button onClick={openModal} className="sell-button">Sell Product In-Store</button>
          <table className="categories-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Full Name</th>
                <th>Phone Number</th>
                <th>Order Note</th>
                <th>Address</th>
                <th>Payment Method</th>
                <th>Product Details</th>
              </tr>
            </thead>
            <tbody>
              {soldProducts.length > 0 ? (
                soldProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{product.full_name}</td>
                    <td>{product.phone_number}</td>
                    <td>{product.order_note}</td>
                    <td>{product.address}</td>
                    <td>{product.payment_method}</td>
                    <td>
                      {product.product_name} / {product.variant_name} / {product.size} / {product.selling_price}
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
        </main>
        {/* MODAL */}
        {showModal && (
          <div className={`modal ${showModal ? 'show' : ''}`}>
            <div className="modal-content">
              <h2>Sell Product In-Store</h2>
              <button className="close-button" onClick={closeModal}>X</button>
              <form onSubmit={handleSubmit}>
                <label htmlFor="fullName">Full Name *</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="phoneNumber">Phone Number *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="orderNote">Order Note</label>
                <textarea
                  id="orderNote"
                  name="orderNote"
                  value={formData.orderNote}
                  onChange={handleInputChange}
                ></textarea>
                <label htmlFor="address">Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="paymentMethod">Payment Method *</label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="PhonePay">PhonePay</option>
                </select>
                <label htmlFor="product">Product *</label>
                <select
                  id="product"
                  name="productId"
                  value={formData.productId}
                  onChange={handleProductChange}
                  required
                >
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.product_name}
                    </option>
                  ))}
                </select>
                {selectedProduct && (
                  <>
                    <label htmlFor="variant">Variant *</label>
                    <select
                      id="variant"
                      name="variantId"
                      value={formData.variantId}
                      onChange={handleVariantChange}
                      required
                    >
                      <option value="">Select a variant</option>
                      {selectedProduct.variants.map((variant) => (
                        <option key={variant.id} value={variant.id}>
                          {variant.variant_name} / {variant.size}
                        </option>
                      ))}
                    </select>
                    {selectedVariant && (
                      <div>
                        <p>Product Details:</p>
                        <p>Name: {selectedProduct.product_name}</p>
                        <p>Size: {selectedVariant.size}</p>
                        <p>Price: {selectedVariant.selling_price}</p>
                      </div>
                    )}
                  </>
                )}
                <button type="submit">Sell</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InStore;