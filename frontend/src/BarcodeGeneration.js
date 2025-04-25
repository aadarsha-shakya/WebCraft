import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './BarcodeGeneration.css';
import Logo from './assets/WebCraft.png';
import JsBarcode from 'jsbarcode';
import { BrowserQRCodeReader } from '@zxing/library'; // Import ZXing Web

function BarcodeGeneration() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [sku, setSku] = useState('');
  const [barcodeImage, setBarcodeImage] = useState(null);
  const [scannedSkus, setScannedSkus] = useState({});
  const navigate = useNavigate();
  const barcodeRef = useRef(null);
  const videoRef = useRef(null);
  const scannerRef = useRef(null);

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
  };

  const startScanner = async () => {
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
        }
      });
    } catch (error) {
      console.error("Error initializing barcode scanner:", error);
    }
  };

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.reset();
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.pause();
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
    }
  };

  const handleScan = (scannedSku) => {
    const updatedSkus = { ...scannedSkus };
    if (updatedSkus[scannedSku]) {
      updatedSkus[scannedSku]++;
    } else {
      updatedSkus[scannedSku] = 1;
    }
    setScannedSkus(updatedSkus);
  };

  const updateInventory = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/updateInventory', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scannedSkus }),
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

  useEffect(() => {
    if (isScannerModalOpen) {
      startScanner();
    } else {
      stopScanner();
    }
    return () => {
      stopScanner();
    };
  }, [isScannerModalOpen]);

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
                <video ref={videoRef} width="600" height="400" autoPlay></video>
                <ul>
                  {Object.entries(scannedSkus).map(([sku, quantity]) => (
                    <li key={sku}>
                      <span>{sku}</span>: {quantity}
                    </li>
                  ))}
                </ul>
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