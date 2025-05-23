import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './BarcodeGeneration.css';
import Logo from './assets/WebCraft.png';
import JsBarcode from 'jsbarcode';
import { BrowserQRCodeReader, QRCodeReader, CanvasImage } from '@zxing/library';

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
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'Hybrid');

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    navigate('/Login');
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
      const imgData = e.target.result;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.src = imgData;
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        decodeBarcodeFromImage(imageData);
      };
    };
    reader.readAsDataURL(file);
  };

  const decodeBarcodeFromImage = async (imageData) => {
    try {
      const canvasImage = new CanvasImage(imageData);
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
    if (!videoRef.current) return;
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
        }
      });
    } catch (error) {
      console.error("Error initializing barcode scanner:", error);
    }
  }, [handleScan]);

  const stopScanner = () => {
    if (scannerRef.current) scannerRef.current.reset();
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

  const selectMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

  const getLinks = () => {
    switch (mode) {
      case 'Hybrid':
        return [
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
      case 'Online':
        return [
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
      case 'Instore':
        return [
          { name: 'Home', icon: 'fa-home', path: '/dashboard' },
          { name: 'Issues', icon: 'fa-exclamation-circle', path: '/Issues' },
          { name: 'Barcode Scanner', icon: 'fa-barcode', path: '/BarcodeGeneration' },
          { name: 'Instore', icon: 'fa-store', path: '/Instore' },
          { name: 'Settlement', icon: 'fa-wallet', path: '/Settlement' },
          { name: 'Analytics', icon: 'fa-chart-line', path: '/Analytics' },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2>Main Links</h2>
        <ul>
          {getLinks().map((link) =>
            link.type === 'header' ? (
              <li key={link.name}>
                <h3 className={link.className}>{link.name}</h3>
              </li>
            ) : (
              <li key={link.name}>
                <Link to={link.path}>
                  <i className={`fas ${link.icon}`}></i> {link.name}
                </Link>
              </li>
            )
          )}
        </ul>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        {/* HEADER PANEL */}
        <header className="dashboard-header">
          {/* Logo */}
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

            {/* W Icon Dropdown */}
            <div className={`header-icon w-icon ${isDropdownOpen ? "open" : ""}`} onClick={toggleDropdown}>
              W
              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/Accounts" className="dropdown-item">
                    <i className="fas fa-user"></i> Accounts
                  </Link>
                  <Link to="/Subscription" className="dropdown-item">
                    <i className="fas fa-dollar-sign"></i> Subscription
                  </Link>
                  <button className="dropdown-item logout" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mode Toggle Button */}
            <div className="mode-toggle">
              <div className="toggle-container">
                <button className={`toggle-button ${mode === 'Instore' ? 'active' : ''}`} onClick={() => selectMode('Instore')}>
                  <i className="fas fa-store"></i>
                </button>
                <button className={`toggle-button ${mode === 'Hybrid' ? 'active' : ''}`} onClick={() => selectMode('Hybrid')}>
                  <i className="fas fa-code-branch"></i>
                </button>
                <button className={`toggle-button ${mode === 'Online' ? 'active' : ''}`} onClick={() => selectMode('Online')}>
                  <i className="fas fa-globe"></i>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="content">
          <h1>Barcode Generation</h1>

          {/* Buttons Container */}
          <div className="button-container">
            <button className="generate-barcode-btn" onClick={openModal}>
              Generate<br />Barcode
            </button>
            <button className="add-product-btn" onClick={openScannerModal}>
              Add Product<br />(Restocking)
            </button>
          </div>

          {/* Modal for Barcode Generation */}
          {isModalOpen && (
            <div className="modal show">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
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
                  <button type="button" onClick={generateBarcode}>Generate</button>
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
                <span className="close" onClick={closeScannerModal}>&times;</span>
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
                    <button type="button" onClick={addManualEntry}>Add Entry</button>
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