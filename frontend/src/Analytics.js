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

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    navigate('/Login');
  };

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

  const hourlyOrderData = orders.reduce((acc, order) => {
    const createdAt = new Date(order.created_at);
    const hour = createdAt.getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {});

  const hourlyLabels = Array.from({ length: 24 }, (_, i) => i);
  const hourlyData = hourlyLabels.map((hour) => hourlyOrderData[hour] || 0);

  const weeklySalesData = orders.reduce((acc, order) => {
    const createdAt = new Date(order.created_at);
    const dayOfWeek = createdAt.getDay();
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + order.total_price;
    return acc;
  }, {});

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklySales = weekDays.map((day) => weeklySalesData[weekDays.indexOf(day)] || 0);

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
                      borderColor: '#6a1b9a',
                      backgroundColor: 'rgba(106, 27, 154, 0.2)',
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
                style={{ maxHeight: '400px' }}
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
                      borderColor: '#2196f3',
                      backgroundColor: 'rgba(33, 150, 243, 0.2)',
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
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Analytics;