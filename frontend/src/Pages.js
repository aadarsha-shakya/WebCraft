import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Pages.css';
import Logo from './assets/WebCraft.png';

function Pages() {
  const [sections, setSections] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // For the W icon dropdown
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false); // For the section selection modal
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [modalIndex, setModalIndex] = useState(null);
  const [modalData, setModalData] = useState({
    image: '',
    title: '',
    description: '',
    link: '',
    actionButtons: [{ label: '', url: '' }, { label: '', url: '' }],
    questions: [],
    categories: [],
    price: '',
  });
  const sectionTypes = [
    { id: '1', type: 'Full Image', image: '/path/to/full-image.png', title: 'Full Image' },
    { id: '2', type: 'Image with Content', image: '/path/to/image-with-content.png', title: 'Image with Content' },
    { id: '3', type: 'FAQ', image: '/path/to/faq.png', title: 'FAQ' },
    { id: '4', type: 'Category Grid', image: '/path/to/category-grid.png', title: 'Category Grid' },
    { id: '5', type: 'Single Product View', image: '/path/to/single-product.png', title: 'Single Product View' },
    { id: '6', type: 'Image Slider', image: '/path/to/image-slider.png', title: 'Image Slider' },
  ];
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleSectionAdd = (selectedSection) => {
    const confirmAdd = window.confirm(`Add ${selectedSection.title}?`);
    if (confirmAdd) {
      setSections([...sections, { ...selectedSection, id: Date.now().toString() }]);
      setIsSectionModalOpen(false); // Close the section selection modal after adding a section
    }
  };

  const handleEditSection = (index) => {
    if (sections[index]) {
      setModalType(sections[index].type);
      setModalIndex(index);
      setModalData({
        ...sections[index],
        actionButtons: sections[index].actionButtons || [{ label: '', url: '' }, { label: '', url: '' }],
        questions: sections[index].questions || [],
        categories: sections[index].categories || [],
      });
    } else {
      console.error("Section is undefined at index:", index);
    }
  };

  const handleDeleteSection = (index) => {
    const confirmDelete = window.confirm(`Delete ${sections[index].title}?`);
    if (confirmDelete) {
      const newSections = sections.filter((_, i) => i !== index);
      setSections(newSections);
      deleteSectionFromServer(sections[index].id);
    }
  };

  const handleLogout = () => {
    navigate('/Login');
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null) return;
    const newSections = [...sections];
    const [removed] = newSections.splice(draggedIndex, 1);
    newSections.splice(index, 0, removed);
    setSections(newSections);
    setDraggedIndex(null);
    updateSectionOrderOnServer(newSections);
  };

  const closeModal = () => {
    setModalType(null);
    setModalIndex(null);
    setModalData({
      image: '',
      title: '',
      description: '',
      link: '',
      actionButtons: [{ label: '', url: '' }, { label: '', url: '' }],
      questions: [],
      categories: [],
      price: '',
    });
  };

  const handleSaveChanges = () => {
    const newSections = [...sections];
    newSections[modalIndex] = { ...newSections[modalIndex], ...modalData };
    setSections(newSections);
    closeModal();
    if (modalIndex === null) {
      addSectionToServer(modalData);
    } else {
      updateSectionOnServer(modalData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setModalData({ ...modalData, [name]: value });
  };

  const handleActionChange = (index, field, value) => {
    const newActionButtons = [...modalData.actionButtons];
    newActionButtons[index][field] = value;
    setModalData({ ...modalData, actionButtons: newActionButtons });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...modalData.questions];
    newQuestions[index][field] = value;
    setModalData({ ...modalData, questions: newQuestions });
  };

  const addQuestion = () => {
    setModalData({ ...modalData, questions: [...modalData.questions, { question: '', answer: '' }] });
  };

  const removeQuestion = (index) => {
    const newQuestions = modalData.questions.filter((_, i) => i !== index);
    setModalData({ ...modalData, questions: newQuestions });
  };

  const handleCategoryChange = (e) => {
    const { value } = e.target;
    const newCategories = [...modalData.categories];
    if (newCategories.includes(value)) {
      newCategories.splice(newCategories.indexOf(value), 1);
    } else {
      newCategories.push(value);
    }
    setModalData({ ...modalData, categories: newCategories });
  };

  const categoryOptions = [
    'Category 1',
    'Category 2',
    'Category 3',
    'Category 4',
    'Category 5',
    'Category 6',
    'Category 7',
    'Category 8',
  ];

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:8081/api/pages?userId=${userId}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSections(data);
            localStorage.setItem('sections', JSON.stringify(data));
          } else {
            console.error("Invalid data received from server:", data);
          }
        })
        .catch(error => {
          console.error('Error fetching pages:', error);
          // Fallback to local storage if server fetch fails
          const storedSections = JSON.parse(localStorage.getItem('sections')) || [];
          setSections(storedSections);
        });
    }
  }, []);

  useEffect(() => {
    // Save sections to local storage whenever they change
    localStorage.setItem('sections', JSON.stringify(sections));
  }, [sections]);

  const addSectionToServer = (section) => {
    const userId = localStorage.getItem('userId');
    fetch('http://localhost:8081/api/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...section, userId }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error adding section:', error));
  };

  const updateSectionOnServer = (section) => {
    fetch(`http://localhost:8081/api/pages/${section.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(section),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error updating section:', error));
  };

  const deleteSectionFromServer = (sectionId) => {
    fetch(`http://localhost:8081/api/pages/${sectionId}`, {
      method: 'DELETE',
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error deleting section:', error));
  };

  const updateSectionOrderOnServer = (sections) => {
    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:8081/api/pages/order?userId=${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sections }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error updating section order:', error));
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
          <li>
            <Link to="/Inventory">
              <i className="fas fa-warehouse"></i> Inventory
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
          <div className="logo">
            <Link to="/dashboard">
              <img src={Logo} alt="Logo" />
            </Link>
          </div>
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
        <main className="content">
          <h1>Pages</h1>
          {/* Button to Add Page */}
          <button className="add-section-button" onClick={() => setIsSectionModalOpen(true)}>
            + Add Section
          </button>
          {/* Dropdown for selecting section types */}
          {isSectionModalOpen && (
            <div className="section-modal">
              <h3>Select a section to add:</h3>
              <div className="section-grid">
                {sectionTypes.map((section, index) => (
                  <div key={index} className="section-grid-item" onClick={() => handleSectionAdd(section)}>
                    <img src={section.image} alt={section.title} />
                    <span>{section.title}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Render added sections with drag-and-drop */}
          <div className="sections-container">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className="added-section"
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(index)}
              >
                <img src={section.image} alt={section.title} />
                <span>{section.title}</span>
                <button onClick={() => handleEditSection(index)}>Edit</button>
                <button onClick={() => handleDeleteSection(index)}>Delete</button>
              </div>
            ))}
          </div>
        </main>
      </div>
      {/* MODALS */}
      {modalType === 'Full Image' && (
        <div className={`modal ${modalType ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Edit Full Image</h2>
            <input
              type="file"
              id="fullImageInput"
              name="fullImageInput"
              accept="image/*"
              onChange={(e) => setModalData({ ...modalData, image: URL.createObjectURL(e.target.files[0]) })}
            />
            <input
              type="text"
              id="link"
              name="link"
              placeholder="Link"
              value={modalData.link}
              onChange={handleInputChange}
            />
            <button onClick={handleSaveChanges}>Save Changes</button>
          </div>
        </div>
      )}
      {modalType === 'Image with Content' && (
        <div className={`modal ${modalType ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Edit Image with Content</h2>
            <input
              type="file"
              id="imageWithContentInput"
              name="imageWithContentInput"
              accept="image/*"
              onChange={(e) => setModalData({ ...modalData, image: URL.createObjectURL(e.target.files[0]) })}
            />
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Title"
              value={modalData.title}
              onChange={handleInputChange}
            />
            <textarea
              id="description"
              name="description"
              placeholder="Description"
              value={modalData.description}
              onChange={handleInputChange}
            />
            <div>
              <input
                type="text"
                id="button1Label"
                name="button1Label"
                placeholder="Button 1 Label"
                value={modalData.actionButtons[0].label}
                onChange={(e) => handleActionChange(0, 'label', e.target.value)}
              />
              <input
                type="text"
                id="button1Url"
                name="button1Url"
                placeholder="Button 1 URL"
                value={modalData.actionButtons[0].url}
                onChange={(e) => handleActionChange(0, 'url', e.target.value)}
              />
            </div>
            <div>
              <input
                type="text"
                id="button2Label"
                name="button2Label"
                placeholder="Button 2 Label"
                value={modalData.actionButtons[1].label}
                onChange={(e) => handleActionChange(1, 'label', e.target.value)}
              />
              <input
                type="text"
                id="button2Url"
                name="button2Url"
                placeholder="Button 2 URL"
                value={modalData.actionButtons[1].url}
                onChange={(e) => handleActionChange(1, 'url', e.target.value)}
              />
            </div>
            <button onClick={handleSaveChanges}>Save Changes</button>
          </div>
        </div>
      )}
      {modalType === 'FAQ' && (
        <div className={`modal ${modalType ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Edit FAQ</h2>
            <input
              type="text"
              id="faqTitle"
              name="faqTitle"
              placeholder="Title"
              value={modalData.title}
              onChange={handleInputChange}
            />
            {modalData.questions.map((question, index) => (
              <div key={index}>
                <input
                  type="text"
                  id={`question${index}`}
                  name={`question${index}`}
                  placeholder="Question"
                  value={question.question}
                  onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                />
                <textarea
                  id={`answer${index}`}
                  name={`answer${index}`}
                  placeholder="Answer"
                  value={question.answer}
                  onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
                />
                <button onClick={() => removeQuestion(index)}>Remove</button>
              </div>
            ))}
            <button onClick={addQuestion}>Add Question</button>
            <button onClick={handleSaveChanges}>Save Changes</button>
          </div>
        </div>
      )}
      {modalType === 'Category Grid' && (
        <div className={`modal ${modalType ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Edit Category Grid</h2>
            <input
              type="text"
              id="categoryGridTitle"
              name="categoryGridTitle"
              placeholder="Title"
              value={modalData.title}
              onChange={handleInputChange}
            />
            <select multiple id="categories" name="categories" onChange={handleCategoryChange}>
              {categoryOptions.map((option, index) => (
                <option key={index} value={option} selected={modalData.categories.includes(option)}>
                  {option}
                </option>
              ))}
            </select>
            <button onClick={handleSaveChanges}>Save Changes</button>
          </div>
        </div>
      )}
      {modalType === 'Single Product View' && (
        <div className={`modal ${modalType ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Edit Single Product View</h2>
            <input
              type="file"
              id="singleProductViewInput"
              name="singleProductViewInput"
              accept="image/*"
              onChange={(e) => setModalData({ ...modalData, image: URL.createObjectURL(e.target.files[0]) })}
            />
            <input
              type="text"
              id="singleProductTitle"
              name="singleProductTitle"
              placeholder="Title"
              value={modalData.title}
              onChange={handleInputChange}
            />
            <textarea
              id="singleProductDescription"
              name="singleProductDescription"
              placeholder="Description"
              value={modalData.description}
              onChange={handleInputChange}
            />
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Price"
              value={modalData.price}
              onChange={handleInputChange}
            />
            <button onClick={handleSaveChanges}>Save Changes</button>
          </div>
        </div>
      )}
      {modalType === 'Image Slider' && (
        <div className={`modal ${modalType ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>Edit Image Slider</h2>
            <input
              type="file"
              id="imageSliderInput"
              name="imageSliderInput"
              accept="image/*"
              multiple
              onChange={(e) => setModalData({ ...modalData, image: Array.from(e.target.files).map(file => URL.createObjectURL(file)) })}
            />
            <button onClick={handleSaveChanges}>Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Pages;