import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  Filler,
} from 'chart.js';
import './Dashboard.css';
import Logo from './assets/WebCraft.png';

// Register necessary components and scales
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  Filler
);

function Analytics() {
  const [orders, setOrders] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'Hybrid'); // Load mode from localStorage or default to 'Hybrid'

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const loggedInUserId = localStorage.getItem('userId');
      if (!loggedInUserId) {
        alert('User not logged in. Redirecting to login...');
        window.location.href = '/login';
        return;
      }
      const response = await axios.get(
        `http://localhost:8081/api/orders/user/${loggedInUserId}`
      );
      // Parse cart_items JSON string
      const parsedOrders = response.data.map((order) => ({
        ...order,
        cart_items: JSON.parse(order.cart_items),
      }));
      setOrders(parsedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculate revenue, orders, average order value, etc.
  const calculateStatistics = () => {
    let totalRevenue = 0;
    let totalOrders = 0;
    let totalQuantity = 0;
    orders.forEach((order) => {
      totalRevenue += order.total_price;
      totalOrders++;
      const cartItems = Array.isArray(order.cart_items) ? order.cart_items : [];
      totalQuantity += cartItems.reduce((sum, item) => sum + item.quantity, 0);
    });
    const averageOrderValue = totalRevenue / totalOrders || 0;
    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalQuantity,
    };
  };

  const { totalRevenue, totalOrders, averageOrderValue } = calculateStatistics();

  // Prepare data for Hourly Order Statistics
  const hourlyOrderData = orders.reduce((acc, order) => {
    const createdAt = new Date(order.created_at);
    const hour = createdAt.getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const hourlyLabels = Array.from({ length: 24 }, (_, i) => i); // Hours of the day
  const hourlyData = hourlyLabels.map((hour) => hourlyOrderData[hour] || 0);

  // Prepare data for Weekly Sales Statistics
  const weeklySalesData = orders.reduce((acc, order) => {
    const createdAt = new Date(order.created_at);
    const dayOfWeek = createdAt.getDay(); // 0 (Sunday) to 6 (Saturday)
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + order.total_price;
    return acc;
  }, {});

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklySales = weekDays.map((day) => weeklySalesData[weekDays.indexOf(day)] || 0);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  // Handle logout
  const handleLogout = () => {
    navigate('/Login'); // Redirect to login page
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
          {/* Dashboard Stats */}
          <div className="dashboard-stats">
            <div className="stat-box">
              <h3>Revenue</h3>
              <p>₹{totalRevenue.toFixed(2)}</p>
            </div>
            <div className="stat-box">
              <h3>Orders</h3>
              <p>{totalOrders}</p>
            </div>
            <div className="stat-box">
              <h3>Average Order Value</h3>
              <p>₹{averageOrderValue.toFixed(2)}</p>
            </div>
          </div>
          {/* Charts */}
          <div className="dashboard-charts">
            <div className="chart-box">
              <h3>Hourly Order Statistics</h3>
              <Line
                data={{
                  labels: hourlyLabels,
                  datasets: [
                    {
                      label: 'Orders',
                      data: hourlyData,
                      borderColor: '#6a1b9a', // Deep purple
                      backgroundColor: 'rgba(106, 27, 154, 0.2)', // Light purple
                      fill: true,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      type: 'category',
                      title: {
                        display: true,
                        text: 'Hour of the Day',
                        color: '#555',
                      },
                      ticks: {
                        color: '#555',
                      },
                    },
                    y: {
                      type: 'linear',
                      title: {
                        display: true,
                        text: 'Number of Orders',
                        color: '#555',
                      },
                      beginAtZero: true,
                      ticks: {
                        color: '#555',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#555',
                      },
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                      bodyColor: '#fff',
                      backgroundColor: '#333',
                      titleColor: '#fff',
                    },
                  },
                  animation: {
                    duration: 2000,
                    easing: 'easeInOutQuad',
                  },
                }}
                style={{ maxHeight: '400px' }} // Constrain chart height
              />
            </div>
            <div className="chart-box">
              <h3>Weekly Sales Statistics</h3>
              <Bar
                data={{
                  labels: weekDays,
                  datasets: [
                    {
                      label: 'Sales',
                      data: weeklySales,
                      borderColor: '#2196f3', // Blue
                      backgroundColor: 'rgba(33, 150, 243, 0.2)', // Light blue
                      borderWidth: 2,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      type: 'category',
                      title: {
                        display: true,
                        text: 'Day of the Week',
                        color: '#555',
                      },
                      ticks: {
                        color: '#555',
                      },
                    },
                    y: {
                      type: 'linear',
                      title: {
                        display: true,
                        text: 'Total Sales (₹)',
                        color: '#555',
                      },
                      beginAtZero: true,
                      ticks: {
                        color: '#555',
                      },
                    },
                  },
                  plugins: {
                    legend: {
                      position: 'top',
                      labels: {
                        color: '#555',
                      },
                    },
                    tooltip: {
                      mode: 'index',
                      intersect: false,
                      bodyColor: '#fff',
                      backgroundColor: '#333',
                      titleColor: '#fff',
                    },
                  },
                  animation: {
                    duration: 2000,
                    easing: 'easeInOutQuad',
                  },
                }}
                style={{ maxHeight: '400px' }} // Constrain chart height
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Analytics;