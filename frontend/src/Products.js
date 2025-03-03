import React, { useState, useEffect } from 'react';
import './Products.css';

function Products() {
  const [selectedTab, setSelectedTab] = useState('Active');
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: '',
    categories: '',
    productDescription: '',
    productImages: [],
    variants: [],
    customFields: []
  });

  useEffect(() => {
    // Example: Fetch products from an API
    fetch('/api/products')
      .then(response => response.json())
      .then(data => setProducts(data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setCurrentStep(1);
    setFormData({
      productName: '',
      categories: '',
      productDescription: '',
      productImages: [],
      variants: [],
      customFields: []
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, productImages: [...formData.productImages, ...files] });
  };

  const handleAddVariant = () => {
    const variant = {
      variantName: '',
      crossedPrice: 0,
      sellingPrice: 0,
      costPrice: 0,
      weight: 0,
      quantity: 0,
      sku: ''
    };
    setFormData({ ...formData, variants: [...formData.variants, variant] });
  };

  const handleAddCustomField = () => {
    const customField = {
      type: '',
      label: '',
      placeholder: '',
      required: false
    };
    setFormData({ ...formData, customFields: [...formData.customFields, customField] });
  };

  const handleSubmit = () => {
    // Add logic to submit the form data
    console.log(formData);
    closeModal();
    // Example: Add product to the list
    setProducts([...products, formData]);
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
        <button onClick={openModal}>+ Add Products</button>
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
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.inventory}</td>
                <td><span className="status">{product.status}</span></td>
                <td>{product.created}</td>
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
      <div className="pagination">
        <button>.</button>
        <button>1</button>
        <button>.</button>
      </div>

      {showModal && (
        <div className="modal">
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
              <div className={`step ${currentStep >= 3 ? 'completed' : ''}`}>
                <span>3</span>
                <p>Custom Fields</p>
              </div>
            </div>
            {currentStep === 1 && (
              <div>
                <label htmlFor="productName">Product Name *</label>
                <input type="text" id="productName" name="productName" value={formData.productName} onChange={handleInputChange} />

                <label htmlFor="categories">Categories</label>
                <input type="text" id="categories" name="categories" value={formData.categories} onChange={handleInputChange} />

                <label htmlFor="productDescription">Product Description *</label>
                <textarea id="productDescription" name="productDescription" value={formData.productDescription} onChange={handleInputChange}></textarea>

                <label htmlFor="productImages">Product Images *</label>
                <input type="file" id="productImages" name="productImages" multiple onChange={handleImageUpload} />

                <button onClick={() => setCurrentStep(2)}>Next: Variants & Inventory</button>
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <label htmlFor="enableVariants">Enable Product Variants</label>
                <input type="checkbox" id="enableVariants" name="enableVariants" checked={true} readOnly />

                <label htmlFor="chooseVariant">Choose Variant</label>
                <input type="text" id="chooseVariant" name="chooseVariant" />

                <label htmlFor="chooseSize">Choose Size</label>
                <input type="text" id="chooseSize" name="chooseSize" />

                <table>
                  <thead>
                    <tr>
                      <th>VARIANT</th>
                      <th>CROSSED PRICE</th>
                      <th>SELLING PRICE</th>
                      <th>COST PRICE</th>
                      <th>WEIGHT</th>
                      <th>QUANTITY</th>
                      <th>SKU</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.variants.map((variant, index) => (
                      <tr key={index}>
                        <td>{variant.variantName}</td>
                        <td><input type="number" value={variant.crossedPrice} /></td>
                        <td><input type="number" value={variant.sellingPrice} /></td>
                        <td><input type="number" value={variant.costPrice} /></td>
                        <td><input type="number" value={variant.weight} /></td>
                        <td><input type="number" value={variant.quantity} /></td>
                        <td><input type="text" value={variant.sku} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button onClick={handleAddVariant}>Add Variant</button>

                <button onClick={() => setCurrentStep(1)}>Previous: General Information</button>
                <button onClick={() => setCurrentStep(3)}>Next: Custom Fields</button>
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <label htmlFor="enableCustomFields">Enable Custom Fields?</label>
                <input type="checkbox" id="enableCustomFields" name="enableCustomFields" checked={true} readOnly />

                <table>
                  <thead>
                    <tr>
                      <th>SN</th>
                      <th>Type</th>
                      <th>Label</th>
                      <th>Placeholder</th>
                      <th>Required</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.customFields.map((customField, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td><select value={customField.type}><option value="text">Text</option></select></td>
                        <td><input type="text" value={customField.label} /></td>
                        <td><input type="text" value={customField.placeholder} /></td>
                        <td><input type="checkbox" checked={customField.required} /></td>
                        <td><button>Delete</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button onClick={handleAddCustomField}>Add Custom Field</button>

                <button onClick={() => setCurrentStep(2)}>Previous: Variants & Inventory</button>
                <button onClick={handleSubmit}>Confirm Add Product</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;