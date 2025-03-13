import React, { useState, useEffect } from 'react';
import './Products.css';

function Products() {
  const [selectedTab, setSelectedTab] = useState('Active');
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Form Data State
  const [formData, setFormData] = useState({
    productName: '',
    category: '', 
    productDescription: '',
    productImages: [],
    variants: []
  });

  // Categories State
  const [categories, setCategories] = useState([]);

  // Variants and Sizes State
  const [variants, setVariants] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [variantCombinations, setVariantCombinations] = useState([]);

  // Fetch products and categories on component load
  useEffect(() => {
    fetch('http://localhost:8081/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));

    const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
    if (userId) {
      fetch(`http://localhost:8081/api/categories/${userId}`)
        .then(response => response.json())
        .then(data => setCategories(data))
        .catch(error => console.error('Error fetching categories:', error));
    }
  }, []);

  // Generate variant combinations
  useEffect(() => {
    const combinations = variants.flatMap(variant =>
      sizes.map(size => ({ variant, size }))
    );
    setVariantCombinations(combinations);
  }, [variants, sizes]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // Open modal
  const openModal = () => {
    setShowModal(true);
  };

  // Close modal
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

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, productImages: [...formData.productImages, ...files] });

    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...previews]);
  };

  // Add variant
  const addVariant = () => {
    const variantInput = document.getElementById('variantInput').value.trim();
    if (variantInput && !variants.includes(variantInput)) {
      setVariants([...variants, variantInput]);
      document.getElementById('variantInput').value = '';
    }
  };

  // Add size
  const addSize = () => {
    const sizeInput = document.getElementById('sizeInput').value.trim();
    if (sizeInput && !sizes.includes(sizeInput)) {
      setSizes([...sizes, sizeInput]);
      document.getElementById('sizeInput').value = '';
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const variantDetails = variantCombinations.map((combination, index) => ({
      variant: combination.variant,
      size: combination.size,
      crossedPrice: document.querySelectorAll('input[type="number"]')[index * 6]?.value || 0,
      sellingPrice: document.querySelectorAll('input[type="number"]')[index * 6 + 1]?.value || 0,
      costPrice: document.querySelectorAll('input[type="number"]')[index * 6 + 2]?.value || 0,
      weight: document.querySelectorAll('input[type="number"]')[index * 6 + 3]?.value || 0,
      quantity: document.querySelectorAll('input[type="number"]')[index * 6 + 4]?.value || 0,
      sku: document.querySelectorAll('input[type="text"]')[index]?.value || ''
    }));
  
    const formDataToSend = new FormData();
    formDataToSend.append('userId', localStorage.getItem('userId'));
    formDataToSend.append('productName', formData.productName);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('productDescription', formData.productDescription);
    formDataToSend.append('variants', JSON.stringify(variantDetails));
  
    // Append product images
    formData.productImages.forEach((file) => {
      formDataToSend.append('productImages', file);
    });
  
    try {
      const response = await fetch('http://localhost:8081/api/products', {
        method: 'POST',
        body: formDataToSend
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log(result.message);
      closeModal();
      alert("Product added successfully!");
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again later.");
    }
  };

  return (
    <div className="products-container">
      <h1>Products</h1>
      <div className="tabs">
        <button onClick={() => handleTabChange('Active')} className={selectedTab === 'Active' ? 'active' : ''}>Active</button>
        <button onClick={() => handleTabChange('Draft')} className={selectedTab === 'Draft' ? 'active' : ''}>Draft</button>
        <button onClick={() => handleTabChange('Archived')} className={selectedTab === 'Archived' ? 'active' : ''}>Archived</button>
      </div>
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button onClick={openModal}>+ Add Product</button>
      </div>
      <table className="product-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
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
                <td>{product.productName}</td>
                <td>{product.variants[0]?.sellingPrice || 'N/A'}</td>
                <td>{product.variants[0]?.quantity || 'N/A'}</td>
                <td><span className="status">{selectedTab}</span></td>
                <td>{new Date().toLocaleDateString()}</td>
                <td>...</td>
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
                        <td><input type="text" /></td>
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
  );
}

export default Products;