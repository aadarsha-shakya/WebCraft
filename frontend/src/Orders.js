import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import the CSS file for styling
import './Orders.css'; // Import the CSS file for styling
import Logo from './assets/WebCraft.png';

function Orders() {
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState(''); // For filtering payment status
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch orders from the backend
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const loggedInUserId = localStorage.getItem('userId'); // Ensure userId is available
            if (!loggedInUserId) {
                alert('User not logged in. Redirecting to login...');
                window.location.href = '/login';
                return;
            }
            const response = await axios.get(
                `http://localhost:8081/api/orders/user/${loggedInUserId}?search=${searchQuery}&status=${filterStatus}`
            );
            // Parse cart_items JSON string
            const parsedOrders = response.data.map(order => ({
                ...order,
                cart_items: JSON.parse(order.cart_items)
            }));
            setOrders(parsedOrders);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Failed to fetch orders.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [searchQuery, filterStatus]);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    // Handle filter status change
    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    // Handle delete order
    const handleDeleteOrder = async (orderId) => {
        try {
            const confirmed = window.confirm('Are you sure you want to delete this order?');
            if (!confirmed) return;
            await axios.delete(`http://localhost:8081/api/orders/${orderId}`);
            fetchOrders(); // Refresh the orders list
        } catch (error) {
            console.error('Error deleting order:', error);
            setError('Failed to delete order.');
        }
    };

    // Handle payment status change
    const handlePaymentStatusChange = (orderId, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? { ...order, payment_status: newStatus } : order
            )
        );
    };

    // Handle order status change
    const handleOrderStatusChange = (orderId, newStatus) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === orderId ? { ...order, order_status: newStatus } : order
            )
        );
    };

    // Toggle dropdown
    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
    };

    // Handle logout
    const handleLogout = () => {
        // Perform logout actions if needed (e.g., clearing tokens)
        navigate('/Login'); // Redirect to login page
    };

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
                    <h1>Orders</h1>
                    {/* Search and Filter Section */}
                    <div className="filters">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="search-box"
                        />
                        <select value={filterStatus} onChange={handleFilterChange} className="filter-select">
                            <option value="">Filter Status</option>
                            <option value="paid">Paid</option>
                            <option value="unpaid">Unpaid</option>
                            <option value="refunded">Refunded</option>
                        </select>
                    </div>
                    {/* Order Table */}
                    <div className="order-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Customer Name</th>
                                    <th>Phone Number</th>
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
                                        <td colSpan="9">Loading...</td>
                                    </tr>
                                ) : orders.length > 0 ? (
                                    orders.map((order, index) => {
                                        // Ensure cart_items is an array
                                        const cartItems = Array.isArray(order.cart_items) ? order.cart_items : [];
                                        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
                                        return (
                                            <tr key={order.id}>
                                                <td>{index + 1}</td>
                                                <td>{order.full_name}</td>
                                                <td>{order.phone_number}</td>
                                                <td>{totalQuantity}</td>
                                                <td>Rs {order.total_price}</td>
                                                <td>
                                                    <select
                                                        value={order.payment_status || ''}
                                                        onChange={(e) => handlePaymentStatusChange(order.id, e.target.value)}
                                                        className={`status-badge ${
                                                            order.payment_status?.toUpperCase() === 'PAID'
                                                                ? 'paid'
                                                                : order.payment_status?.toUpperCase() === 'UNPAID'
                                                                ? 'unpaid'
                                                                : 'refunded'
                                                        }`}
                                                    >
                                                        <option value="paid">Paid</option>
                                                        <option value="unpaid">Unpaid</option>
                                                        <option value="refunded">Refunded</option>
                                                    </select>
                                                </td>
                                                <td>
                                                    <select
                                                        value={order.order_status || ''}
                                                        onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                                                        className={`status-badge ${
                                                            order.order_status?.toUpperCase() === 'PENDING'
                                                                ? 'pending'
                                                                : order.order_status?.toUpperCase() === 'PROCESSING'
                                                                ? 'processing'
                                                                : order.order_status?.toUpperCase() === 'DISPATCHED'
                                                                ? 'dispatched'
                                                                : order.order_status?.toUpperCase() === 'DELIVERED'
                                                                ? 'delivered'
                                                                : order.order_status?.toUpperCase() === 'CANCELLED'
                                                                ? 'cancelled'
                                                                : 'return'
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
                                                <td>{order.payment_method?.toUpperCase() || 'N/A'}</td>
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
                                        <td colSpan="9">No orders found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="pagination">
                        {/* Add pagination logic here */}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Orders;