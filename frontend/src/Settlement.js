import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Settlement.css';
import Logo from './assets/WebCraft.png';

function Settlement() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'Hybrid'); // Load mode from localStorage or default to 'Hybrid'

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  const handleLogout = () => {
    navigate('/Login'); // Redirect to login page
  };

  const navigateToPreviousMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1));
  };

  const navigateToNextMonth = () => {
    setCurrentDate(prevDate => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1));
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const calendarDays = [];

    // Fill in leading empty days
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="empty-day"></div>);
    }

    // Fill in actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendarDays.push(
        <div 
          key={day} 
          className="calendar-day"
          onClick={() => handleDateClick(date)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={navigateToPreviousMonth}>⇐</button>
          <span>{new Date(year, month).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          <button onClick={navigateToNextMonth}>⇒</button>
        </div>
        <div className="days-of-week">
          {daysOfWeek.map(day => (
            <div key={day} className="day-of-week">{day}</div>
          ))}
        </div>
        <div className="calendar-body">
          {calendarDays}
        </div>
      </div>
    );
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    fetchRecordsForDate(date);
    setModalVisible(true);
  };

  const fetchRecordsForDate = async (date) => {
    const formattedDate = date.toISOString().split('T')[0];
    try {
      const response = await fetch(`http://localhost:8081/api/settlement?date=${formattedDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (!response.ok) {
        const text = await response.text(); // Read the response as text
        console.error("HTTP error! Status:", response.status, "Response:", text);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error("Error fetching records:", error);
      alert("Failed to fetch records. Please try again later.");
    }
  };

  const closeModal = () => {
    setModalVisible(false);
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

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not logged in. Redirecting to login...');
      window.location.href = '/login';
    }
  }, []);

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
          <h1>Settlement</h1>
          <div className="calendar-container">
            {renderCalendar()}
          </div>
        </main>
      </div>

      {/* MODAL */}
      {modalVisible && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Records for {selectedDate?.toLocaleDateString()}</h2>
            <button className="close-modal" onClick={closeModal}>X</button>
            <div className="records-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Note</th>
                    <th>Payment Method</th>
                    <th>Phone Number</th>
                    <th>Product Name</th>
                    <th>Variant</th>
                    <th>Size</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index}>
                      <td>{record.full_name}</td>
                      <td>{record.address}</td>
                      <td>{record.order_note}</td>
                      <td>{record.payment_method}</td>
                      <td>{record.phone_number}</td>
                      <td>{record.product_name}</td>
                      <td>{record.variant_name}</td>
                      <td>{record.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settlement;