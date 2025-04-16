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