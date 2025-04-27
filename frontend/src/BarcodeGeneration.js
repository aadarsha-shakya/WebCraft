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
  const [sku, setSku] = useState('');
  const [barcodeImage, setBarcodeImage] = useState(null);
  const [scannedSkus, setScannedSkus] = useState({});
  const [manualEntries, setManualEntries] = useState([]);
  const [manualSku, setManualSku] = useState('');
  const [manualQuantity, setManualQuantity] = useState('');
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

  useEffect(() => {
    if (isScannerModalOpen) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isScannerModalOpen, startScanner]);

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
  <h1>Barcode Generation</h1>
  {/* Generate Barcode Button */}
  <button className="generate-barcode-btn" onClick={openModal}>
    Generate Barcode
  </button>
  {/* Add Product Button */}
  <button className="add-product-btn" onClick={openScannerModal}>
    Add Product (Inventory Restocking)
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
</main>
      </div>
    </div>
  );
}

export default BarcodeGeneration;