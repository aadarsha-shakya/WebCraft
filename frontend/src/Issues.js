import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Issues.css';
import Logo from './assets/WebCraft.png';

function Issues() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [issues, setIssues] = useState({
    created: [],
    inProgress: [],
    review: [],
    resolved: []
  });
  const [newIssueText, setNewIssueText] = useState({
    created: '',
    inProgress: '',
    review: '',
    resolved: ''
  });
  const [userId, setUserId] = useState(null);
  const [mode, setMode] = useState(localStorage.getItem('mode') || 'Hybrid'); // Load mode from localStorage or default to 'Hybrid'
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState); // Toggle state on each click
  };

  const handleLogout = () => {
    // Perform logout actions if needed (e.g., clearing tokens)
    navigate('/Login'); // Redirect to login page
  };

  useEffect(() => {
    // Simulate fetching user ID from local storage or context
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      fetchIssues(storedUserId);
    } else {
      alert('User not logged in. Redirecting to login...');
      window.location.href = '/login';
    }
  }, []);

  const fetchIssues = (userId) => {
    fetch(`http://localhost:8081/api/issues/${userId}`)
      .then(response => response.json())
      .then(data => {
        const newIssues = {
          created: [],
          inProgress: [],
          review: [],
          resolved: []
        };
        data.forEach(issue => {
          newIssues[issue.status].push(issue);
        });
        setIssues(newIssues);
      })
      .catch(error => console.error("Error fetching issues:", error));
  };

  const handleDragStart = (event, id) => {
    event.dataTransfer.setData('text/plain', JSON.stringify({ id }));
  };

  const handleDrop = (event, target) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData('text/plain'));
    const { id } = data;
    // Update the issue status in the database
    fetch(`http://localhost:8081/api/issues/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: target })
    })
    .then(response => response.json())
    .then(data => {
      if (data) {
        fetchIssues(userId); // Refresh the issues after updating
      }
    })
    .catch(error => console.error("Error updating issue:", error));
  };

  const handleAddItem = (section) => {
    const text = newIssueText[section];
    if (!text.trim()) {
      alert("Please enter a description for the issue.");
      return;
    }
    fetch('http://localhost:8081/api/issues', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: userId, text, status: section })
    })
    .then(response => response.json())
    .then(data => {
      if (data) {
        fetchIssues(userId); // Refresh the issues after adding
        setNewIssueText(prevState => ({
          ...prevState,
          [section]: '' // Clear the input field for the specific section
        }));
      }
    })
    .catch(error => console.error("Error adding issue:", error));
  };

  const handleInputChange = (event, section) => {
    setNewIssueText(prevState => ({
      ...prevState,
      [section]: event.target.value
    }));
  };

  const handleDeleteIssue = (id) => {
    fetch(`http://localhost:8081/api/issues/${id}`, {
      method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
      if (data) {
        fetchIssues(userId); // Refresh the issues after deleting
      }
    })
    .catch(error => console.error("Error deleting issue:", error));
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
          <h1>Issues</h1>
          <div className="issues-container">
            <div className="issue-section" onDrop={(e) => handleDrop(e, 'created')} onDragOver={(e) => e.preventDefault()}>
              <h2>Created</h2>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Enter description"
                  value={newIssueText.created}
                  onChange={(e) => handleInputChange(e, 'created')}
                />
                <button onClick={() => handleAddItem('created')}>+</button>
              </div>
              <div className="items">
                {issues.created.map(issue => (
                  <div key={issue.id} className="item" draggable onDragStart={(e) => handleDragStart(e, issue.id)}>
                    {issue.text}
                    <i className="fas fa-trash-alt delete-icon" onClick={() => handleDeleteIssue(issue.id)}></i>
                  </div>
                ))}
              </div>
            </div>
            <div className="issue-section" onDrop={(e) => handleDrop(e, 'inProgress')} onDragOver={(e) => e.preventDefault()}>
              <h2>In Progress</h2>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Enter description"
                  value={newIssueText.inProgress}
                  onChange={(e) => handleInputChange(e, 'inProgress')}
                />
                <button onClick={() => handleAddItem('inProgress')}>+</button>
              </div>
              <div className="items">
                {issues.inProgress.map(issue => (
                  <div key={issue.id} className="item" draggable onDragStart={(e) => handleDragStart(e, issue.id)}>
                    {issue.text}
                    <i className="fas fa-trash-alt delete-icon" onClick={() => handleDeleteIssue(issue.id)}></i>
                  </div>
                ))}
              </div>
            </div>
            <div className="issue-section" onDrop={(e) => handleDrop(e, 'review')} onDragOver={(e) => e.preventDefault()}>
              <h2>Review</h2>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Enter description"
                  value={newIssueText.review}
                  onChange={(e) => handleInputChange(e, 'review')}
                />
                <button onClick={() => handleAddItem('review')}>+</button>
              </div>
              <div className="items">
                {issues.review.map(issue => (
                  <div key={issue.id} className="item" draggable onDragStart={(e) => handleDragStart(e, issue.id)}>
                    {issue.text}
                    <i className="fas fa-trash-alt delete-icon" onClick={() => handleDeleteIssue(issue.id)}></i>
                  </div>
                ))}
              </div>
            </div>
            <div className="issue-section" onDrop={(e) => handleDrop(e, 'resolved')} onDragOver={(e) => e.preventDefault()}>
              <h2>Resolved</h2>
              <div className="input-container">
                <input
                  type="text"
                  placeholder="Enter description"
                  value={newIssueText.resolved}
                  onChange={(e) => handleInputChange(e, 'resolved')}
                />
                <button onClick={() => handleAddItem('resolved')}>+</button>
              </div>
              <div className="items">
                {issues.resolved.map(issue => (
                  <div key={issue.id} className="item" draggable onDragStart={(e) => handleDragStart(e, issue.id)}>
                    {issue.text}
                    <i className="fas fa-trash-alt delete-icon" onClick={() => handleDeleteIssue(issue.id)}></i>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Issues;