import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Orders.css';
import Logo from './assets/WebCraft.png';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'Hybrid');

  // Local state for persisting dropdown selections
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const [orderStatuses, setOrderStatuses] = useState({});

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const loggedInUserId = localStorage.getItem('userId');
      if (!loggedInUserId) {
        alert('User not logged in. Redirecting to login...');
        window.location.href = '/login';
        return;
      }
      const response = await axios.get(
        `http://localhost:8081/api/orders/user/${loggedInUserId}?search=${searchQuery}`
      );
      const parsedOrders = response.data.map(order => ({
        ...order,
        cart_items: JSON.parse(order.cart_items)
      }));
      setOrders(parsedOrders);
      setLoading(false);

      // Initialize statuses
      const initialPaymentStatuses = {};
      const initialOrderStatuses = {};
      parsedOrders.forEach(order => {
        initialPaymentStatuses[order.id] = order.payment_status || 'unpaid';
        initialOrderStatuses[order.id] = order.order_status || 'pending';
      });
      setPaymentStatuses(initialPaymentStatuses);
      setOrderStatuses(initialOrderStatuses);

    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders.');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [searchQuery]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this order?');
      if (!confirmed) return;
      await axios.delete(`http://localhost:8081/api/orders/${orderId}`);
      fetchOrders(); // Refresh orders list
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Failed to delete order.');
    }
  };

  const handlePaymentStatusChange = (orderId, newStatus) => {
    setPaymentStatuses((prev) => ({
      ...prev,
      [orderId]: newStatus
    }));

    // Send update to backend
    axios.put(`http://localhost:8081/api/orders/${orderId}/payment-status`, { status: newStatus })
      .then(res => console.log('Payment status updated:', res.data))
      .catch(err => {
        console.error('Failed to update payment status:', err);
        alert('Failed to update payment status.');
        setPaymentStatuses(prev => ({
          ...prev,
          [orderId]: prev[orderId]
        }));
      });
  };

const handleOrderStatusChange = (orderId, newStatus) => {
    setOrderStatuses((prev) => ({
        ...prev,
        [orderId]: newStatus
    }));

    // Check if payment status is "Paid" and order status is "Dispatched"
    if (paymentStatuses[orderId] === "paid" && newStatus === "dispatched") {
        // Fetch the order details to get cart items
        axios.get(`http://localhost:8081/api/orders/${orderId}`)
            .then(response => {
                const order = response.data;
                const cartItems = JSON.parse(order.cart_items);

                // Make an API call to update inventory
                axios.post('http://localhost:8081/api/updateInventory', { scannedSkus: cartItems })
                    .then(inventoryResponse => {
                        console.log('Inventory updated successfully:', inventoryResponse.data);
                    })
                    .catch(inventoryError => {
                        console.error('Error updating inventory:', inventoryError);
                        alert('Failed to update inventory.');
                    });
            })
            .catch(error => {
                console.error('Error fetching order details:', error);
                alert('Failed to fetch order details.');
            });
    }

    // Send update to backend
    axios.put(`http://localhost:8081/api/orders/${orderId}/order-status`, { status: newStatus })
        .then(res => console.log('Order status updated:', res.data))
        .catch(err => {
            console.error('Failed to update order status:', err);
            alert('Failed to update order status.');
            setOrderStatuses(prev => ({
                ...prev,
                [orderId]: prev[orderId]
            }));
        });
};

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleLogout = () => {
    navigate('/Login');
  };

  const selectMode = (newMode) => {
    setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

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
      { name: 'Customization', type: 'header', className: 'customization-header' },
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
      { name: 'Customization', type: 'header', className: 'customization-header' },
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
          <div className="logo">
            <Link to="/dashboard">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
          <div className="header-icons">
            <Link to="/YourWeb" className="header-icon">
              <i className="fas fa-globe"></i>
            </Link>
            <div
              className={`header-icon w-icon ${isDropdownOpen ? 'open' : ''}`}
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
          <h1>Orders</h1>
          {/* Search Section */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-box"
            />
          </div>

          {/* Order Table */}
          <div className="order-table">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Customer Name</th>
                  <th>Phone Number</th>
                  <th>Products</th>
                  <th>Total Quantity</th>
                  <th>Total Amount</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>
                  <th>Payment Method</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11">Loading...</td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order, index) => {
                    const cartItems = Array.isArray(order.cart_items)
                      ? order.cart_items
                      : [];
                    const totalQuantity = cartItems.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    );
                    const productNames = cartItems
                      .map((item) => item.productName)
                      .join(", ");
                    return (
                      <tr key={order.id}>
                        <td>{index + 1}</td>
                        <td>{order.full_name}</td>
                        <td>{order.phone_number}</td>
                        <td>{productNames}</td>
                        <td>{totalQuantity}</td>
                        <td>Rs {order.total_price}</td>
                        <td>
                          <select
                            value={paymentStatuses[order.id] || "unpaid"}
                            onChange={(e) =>
                              handlePaymentStatusChange(
                                order.id,
                                e.target.value
                              )
                            }
                            className={`status-badge ${
                              paymentStatuses[order.id]?.toUpperCase() === "PAID"
                                ? "paid"
                                : paymentStatuses[order.id]?.toUpperCase() === "UNPAID"
                                ? "unpaid"
                                : "refunded"
                            }`}
                          >
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="refunded">Refunded</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={orderStatuses[order.id] || "pending"}
                            onChange={(e) =>
                              handleOrderStatusChange(
                                order.id,
                                e.target.value
                              )
                            }
                            className={`status-badge ${
                              orderStatuses[order.id]?.toUpperCase() === "PENDING"
                                ? "pending"
                                : orderStatuses[order.id]?.toUpperCase() === "PROCESSING"
                                ? "processing"
                                : orderStatuses[order.id]?.toUpperCase() === "DISPATCHED"
                                ? "dispatched"
                                : orderStatuses[order.id]?.toUpperCase() === "DELIVERED"
                                ? "delivered"
                                : orderStatuses[order.id]?.toUpperCase() === "CANCELLED"
                                ? "cancelled"
                                : "return"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="dispatched">Dispatched</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="return">Return</option>
                          </select>
                        </td>
                        <td>
                          {order.payment_method?.toUpperCase() || "N/A"}
                        </td>
                        <td>{new Date(order.created_at).toLocaleString()}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="delete-button"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="11">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Orders;