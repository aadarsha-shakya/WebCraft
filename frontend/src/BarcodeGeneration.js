import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './BarcodeGeneration.css';
import Logo from './assets/WebCraft.png';
import JsBarcode from 'jsbarcode';
import { BrowserQRCodeReader, QRCodeReader, CanvasImage } from '@zxing/library'; // Import ZXing Web

function BarcodeGeneration() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [sku, setSku] = useState('');
  const [barcodeImage, setBarcodeImage] = useState(null);
  const [scannedSkus, setScannedSkus] = useState({});
  const [manualEntries, setManualEntries] = useState([]);
  const [manualSku, setManualSku] = useState('');
  const [manualQuantity, setManualQuantity] = useState('');
  const [sellFormData, setSellFormData] = useState({
    fullName: '',
    phoneNumber: '',
    orderNote: '',
    address: '',
    paymentMethod: 'Cash',
    selectedProduct: null,
  });
  const [products, setProducts] = useState([]); // Initialize as empty array
  const [variants, setVariants] = useState([]); // Initialize as empty array
  const navigate = useNavigate();
  const barcodeRef = useRef(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const fileInputRef = useRef(null); // Reference for the file input

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  const handleLogout = () => {
    navigate('/Login'); // Redirect to login page
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSku('');
    setBarcodeImage(null);
  };

  const handleSkuChange = (e) => {
    setSku(e.target.value);
  };

  const generateBarcode = () => {
    if (!sku) {
      alert('Please enter a SKU.');
      return;
    }
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, sku, {
      format: 'CODE128',
      displayValue: true,
    });
    setBarcodeImage(canvas.toDataURL('image/png'));
  };

  const downloadBarcode = () => {
    if (!barcodeImage) {
      alert('No barcode to download.');
      return;
    }
    const link = document.createElement('a');
    link.href = barcodeImage;
    link.download = `barcode_${sku}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openScannerModal = () => {
    setIsScannerModalOpen(true);
  };

  const closeScannerModal = () => {
    setIsScannerModalOpen(false);
    stopScanner();
    setScannedSkus({});
    setManualEntries([]);
  };

  const handleScan = useCallback((scannedSku) => {
    const updatedSkus = { ...scannedSkus };
    if (updatedSkus[scannedSku]) {
      updatedSkus[scannedSku]++;
    } else {
      updatedSkus[scannedSku] = 1;
    }
    setScannedSkus(updatedSkus);
  }, [scannedSkus]);

  const updateInventory = async () => {
    try {
      const combinedSkus = { ...scannedSkus };
      manualEntries.forEach(entry => {
        if (combinedSkus[entry.sku]) {
          combinedSkus[entry.sku] += entry.quantity;
        } else {
          combinedSkus[entry.sku] = entry.quantity;
        }
      });
      const response = await fetch('http://localhost:8081/api/updateInventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scannedSkus: combinedSkus }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Inventory updated successfully!');
        closeScannerModal();
      } else {
        alert('Failed to update inventory.');
      }
    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('An error occurred while updating inventory.');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imgData = e.target.result; // Base64 string of the image
      // Create a temporary canvas to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      // Load the image from the base64 string
      const img = new Image();
      img.src = imgData;
      img.onload = () => {
        // Set canvas dimensions to match the image size
        canvas.width = img.width;
        canvas.height = img.height;
        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);
        // Get the ImageData from the canvas
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        // Decode the barcode from the ImageData
        decodeBarcodeFromImage(imageData);
      };
    };
    reader.readAsDataURL(file);
  };

  const decodeBarcodeFromImage = async (imageData) => {
    try {
      // Create a CanvasImage instance from the ImageData
      const canvasImage = new CanvasImage(imageData);
      // Decode the barcode
      const qrCodeReader = new QRCodeReader();
      const result = await qrCodeReader.decode(canvasImage);
      console.log("Scanned SKU from image:", result.text);
      handleScan(result.text);
    } catch (error) {
      console.error("Error decoding barcode from image:", error);
      alert("Failed to scan barcode from image.");
    }
  };

  const startScanner = useCallback(async () => {
    if (!videoRef.current) {
      console.error("Video element not found");
      return;
    }
    try {
      const scanner = new BrowserQRCodeReader();
      scannerRef.current = scanner;
      await scanner.getVideoInputDevices().then((devices) => {
        if (devices && devices.length > 0) {
          scanner.decodeFromVideoDevice(devices[0].deviceId, videoRef.current, (result, err) => {
            if (result) {
              console.log("Scanned SKU:", result.text);
              handleScan(result.text);
            }
            if (err) {
              console.error("Error scanning barcode:", err);
            }
          });
        } else {
          console.error("No video input devices found");
        }
      });
    } catch (error) {
      console.error("Error initializing barcode scanner:", error);
    }
  }, [handleScan]);

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.reset();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.pause();
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const addManualEntry = () => {
    if (!manualSku || !manualQuantity) {
      alert('Please enter both SKU and quantity.');
      return;
    }
    setManualEntries([...manualEntries, { sku: manualSku, quantity: parseInt(manualQuantity, 10) }]);
    setManualSku('');
    setManualQuantity('');
  };

  const removeManualEntry = (index) => {
    const newEntries = manualEntries.filter((_, i) => i !== index);
    setManualEntries(newEntries);
  };

  const openSellModal = () => {
    setIsSellModalOpen(true);
  };

  const closeSellModal = () => {
    setIsSellModalOpen(false);
    setSellFormData({
      fullName: '',
      phoneNumber: '',
      orderNote: '',
      address: '',
      paymentMethod: 'Cash',
      selectedProduct: null,
    });
  };

  const handleSellInputChange = (e) => {
    const { name, value } = e.target;
    setSellFormData({
      ...sellFormData,
      [name]: value,
    });
  };

  const handleSelectProduct = (product) => {
    setSellFormData({
      ...sellFormData,
      selectedProduct: product,
    });
  };

  const handleScanProduct = useCallback(async (scannedSku) => {
    try {
      const response = await fetch(`http://localhost:8081/api/variant/${scannedSku}`);
      const data = await response.json();
      if (data.variant) {
        handleSelectProduct(data.variant);
      } else {
        alert('Product not found.');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Failed to fetch product.');
    }
  }, []);

  const handleSell = async () => {
    if (!sellFormData.fullName || !sellFormData.phoneNumber || !sellFormData.selectedProduct) {
      alert('Please fill in all required fields and select a product.');
      return;
    }
    try {
      const response = await fetch('http://localhost:8081/api/sellProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: sellFormData.fullName,
          phoneNumber: sellFormData.phoneNumber,
          orderNote: sellFormData.orderNote,
          address: sellFormData.address,
          paymentMethod: sellFormData.paymentMethod,
          product: sellFormData.selectedProduct,
        }),
      });
      const data = await response.json();
      if (data.status === 'success') {
        alert('Product sold successfully!');
        closeSellModal();
        // Decrease inventory
        const updatedVariant = {
          ...sellFormData.selectedProduct,
          quantity: sellFormData.selectedProduct.quantity - 1,
        };
        await fetch(`http://localhost:8081/api/updateVariant/${updatedVariant.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedVariant),
        });
      } else {
        alert('Failed to sell product.');
      }
    } catch (error) {
      console.error('Error selling product:', error);
      alert('An error occurred while selling the product.');
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/products');
        const data = await response.json();
        if (data.products) {
          setProducts(data.products);
        } else {
          console.error('Unexpected response format for products:', data);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    const fetchVariants = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/variants');
        const data = await response.json();
        if (data.variants) {
          setVariants(data.variants);
        } else {
          console.error('Unexpected response format for variants:', data);
        }
      } catch (error) {
        console.error('Error fetching variants:', error);
      }
    };

    fetchProducts();
    fetchVariants();
  }, []);

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
          <h1>Barcode Generation</h1>
          <p>This is a barcode page</p>
          {/* Generate Barcode Button */}
          <button className="generate-barcode-btn" onClick={openModal}>
            Generate Barcode
          </button>
          {/* Add Product Button */}
          <button className="add-product-btn" onClick={openScannerModal}>
            Add Product (Inventory Restocking)
          </button>
          {/* Sell Product In-Store Button */}
          <button className="sell-product-btn" onClick={openSellModal}>
            Sell Product In-Store
          </button>
          {/* Modal for Barcode Generation */}
          {isModalOpen && (
            <div className="modal show">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <h2>Generate Barcode</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="sku">Enter Product SKU:</label>
                  <input
                    type="text"
                    id="sku"
                    value={sku}
                    onChange={handleSkuChange}
                    required
                  />
                  <button type="button" onClick={generateBarcode}>
                    Generate
                  </button>
                </form>
                {barcodeImage && (
                  <div>
                    <canvas ref={barcodeRef} style={{ display: 'none' }}></canvas>
                    <img src={barcodeImage} alt="Generated Barcode" />
                    <button onClick={downloadBarcode}>Download Barcode</button>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Modal for Barcode Scanning */}
          {isScannerModalOpen && (
            <div className="modal show">
              <div className="modal-content">
                <span className="close" onClick={closeScannerModal}>
                  &times;
                </span>
                <h2>Inventory Restocking</h2>
                {/* Camera Scanning */}
                <div>
                  <h3>Camera Scanning</h3>
                  <video ref={videoRef} width="600" height="400" autoPlay></video>
                </div>
                {/* Image Scanning */}
                <div>
                  <h3>Image Scanning</h3>
                  <label htmlFor="fileInput">Upload Barcode Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                  />
                </div>
                {/* Manual Restocking */}
                <div>
                  <h3>Manual Restocking</h3>
                  <form onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="manualSku">Enter SKU:</label>
                    <input
                      type="text"
                      id="manualSku"
                      value={manualSku}
                      onChange={(e) => setManualSku(e.target.value)}
                      required
                    />
                    <label htmlFor="manualQuantity">Enter Quantity:</label>
                    <input
                      type="number"
                      id="manualQuantity"
                      value={manualQuantity}
                      onChange={(e) => setManualQuantity(e.target.value)}
                      required
                    />
                    <button type="button" onClick={addManualEntry}>
                      Add Entry
                    </button>
                  </form>
                  <ul>
                    {manualEntries.map((entry, index) => (
                      <li key={index}>
                        <span>{entry.sku}</span>: {entry.quantity}
                        <button onClick={() => removeManualEntry(index)}>Remove</button>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Combined Scanned and Manual Entries */}
                <div>
                  <h3>Scanned and Manual Entries</h3>
                  <ul>
                    {[...Object.entries(scannedSkus)].map(([sku, quantity], index) => (
                      <li key={index}>
                        <span>{sku}</span>: {quantity}
                      </li>
                    ))}
                    {manualEntries.map((entry, index) => (
                      <li key={`manual-${index}`}>
                        <span>{entry.sku}</span>: {entry.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
                <button onClick={updateInventory}>Update Inventory</button>
              </div>
            </div>
          )}
          {/* Modal for Selling Product */}
          {isSellModalOpen && (
            <div className="modal show">
              <div className="modal-content">
                <span className="close" onClick={closeSellModal}>
                  &times;
                </span>
                <h2>Sell Product In-Store</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                  <label htmlFor="fullName">Full Name:</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={sellFormData.fullName}
                    onChange={handleSellInputChange}
                    required
                  />
                  <label htmlFor="phoneNumber">Phone Number:</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={sellFormData.phoneNumber}
                    onChange={handleSellInputChange}
                    required
                  />
                  <label htmlFor="orderNote">Order Note:</label>
                  <textarea
                    id="orderNote"
                    name="orderNote"
                    value={sellFormData.orderNote}
                    onChange={handleSellInputChange}
                  ></textarea>
                  <label htmlFor="address">Address:</label>
                  <textarea
                    id="address"
                    name="address"
                    value={sellFormData.address}
                    onChange={handleSellInputChange}
                  ></textarea>
                  <label htmlFor="paymentMethod">Payment Method:</label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={sellFormData.paymentMethod}
                    onChange={handleSellInputChange}
                  >
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                    <option value="PhonePay">PhonePay</option>
                  </select>
                  <div>
                    <h3>Product Selector</h3>
                    <div>
                      <button type="button" onClick={openScannerModal}>
                        Scan Barcode
                      </button>
                      <select
                        value={sellFormData.selectedProduct ? sellFormData.selectedProduct.sku : ''}
                        onChange={(e) => {
                          const selectedSku = e.target.value;
                          const selectedProduct = variants.find(variant => variant.sku === selectedSku);
                          if (selectedProduct) {
                            handleSelectProduct(selectedProduct);
                          }
                        }}
                      >
                        <option value="">Select Product</option>
                        {products.map(product => (
                          <optgroup key={product.id} label={product.name}>
                            {product.variants.map(variant => (
                              <option key={variant.id} value={variant.sku}>
                                {variant.sku} - {variant.size} - ${variant.price}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  </div>
                  {sellFormData.selectedProduct && (
                    <div>
                      <h3>Selected Product Details</h3>
                      <p><strong>Name:</strong> {sellFormData.selectedProduct.productName}</p>
                      <p><strong>Size:</strong> {sellFormData.selectedProduct.size}</p>
                      <p><strong>Price:</strong> ${sellFormData.selectedProduct.price}</p>
                    </div>
                  )}
                  <button type="button" onClick={handleSell}>
                    Sell
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default BarcodeGeneration;