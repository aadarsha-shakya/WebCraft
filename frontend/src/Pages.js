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
        image: [],
        title: '',
        description: '',
        link: '',
        actionButtons: [{ label: '', url: '' }, { label: '', url: '' }],
        questions: [],
        categories: [],
        price: '',
    });
    const sectionTypes = [
        { id: '1', type: 'Full Image', title: 'Full Image' },
        { id: '2', type: 'Image with Content', title: 'Image with Content' },
        { id: '3', type: 'FAQ', title: 'FAQ' },
        { id: '4', type: 'Category Grid', title: 'Category Grid' },
        { id: '6', type: 'Image Slider', title: 'Image Slider' },
    ];
    const [categoryOptions, setCategoryOptions] = useState([]);
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const handleSectionAdd = (selectedSection) => {
        const confirmAdd = window.confirm(`Add ${selectedSection.title}?`);
        if (confirmAdd) {
            setSections([...sections, { ...selectedSection, id: Date.now().toString(), image: [], actionButtons: [{ label: '', url: '' }, { label: '', url: '' }], questions: [], categories: [] }]);
            setIsSectionModalOpen(false); // Close the section selection modal after adding a section
        }
    };

    const handleEditSection = (section) => {
        const index = sections.findIndex(sec => sec.id === section.id);
        if (index !== -1) {
            setModalType(section.type);
            setModalIndex(index);
            setModalData({
                ...section,
                actionButtons: section.actionButtons || [{ label: '', url: '' }, { label: '', url: '' }],
                questions: section.questions || [],
                categories: section.categories || [],
                image: section.image || [],
            });
        } else {
            console.error("Section is undefined at id:", section.id);
        }
    };

    const handleDeleteSection = (sectionId, sectionType) => {
        const confirmDelete = window.confirm(`Delete ${sectionType}?`);
        if (confirmDelete) {
            const newSections = sections.filter((section) => section.id !== sectionId);
            setSections(newSections);
            deleteSectionFromServer(sectionId, sectionType);
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
        // No need to update order on server as there's no order-specific table
    };

    const closeModal = () => {
        setModalType(null);
        setModalIndex(null);
        setModalData({
            image: [],
            title: '',
            description: '',
            link: '',
            actionButtons: [{ label: '', url: '' }, { label: '', url: '' }],
            questions: [],
            categories: [],
            price: '',
        });
    };

    const handleSaveChanges = async () => {
        const newSections = [...sections];
        if (modalIndex !== null) {
            newSections[modalIndex] = { ...newSections[modalIndex], ...modalData };
            setSections(newSections);
        }
        closeModal();
        if (modalIndex === null) {
            await addSectionToServer(modalData);
        } else {
            await updateSectionOnServer(modalData);
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
        const selectedCategories = Array.from(e.target.selectedOptions, option => option.value);
        setModalData({ ...modalData, categories: selectedCategories });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setModalData({ ...modalData, image: files });
    };

    const removeImage = (index) => {
        const newImages = modalData.image.filter((_, i) => i !== index);
        setModalData({ ...modalData, image: newImages });
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchSections(userId);
            fetchCategories(userId);
        }
    }, []);

    useEffect(() => {
        // Save sections to local storage whenever they change
        localStorage.setItem('sections', JSON.stringify(sections));
    }, [sections]);

    const fetchSections = (userId) => {
        Promise.all([
            fetch(`http://localhost:8081/api/full_image?userId=${userId}`),
            fetch(`http://localhost:8081/api/image_with_content?userId=${userId}`),
            fetch(`http://localhost:8081/api/image_slider?userId=${userId}`),
            fetch(`http://localhost:8081/api/category_grid?userId=${userId}`),
            fetch(`http://localhost:8081/api/faq?userId=${userId}`)
        ])
        .then(responses => Promise.all(responses.map(res => res.json())))
        .then(data => {
            const allSections = [
                ...data[0].map(item => ({ ...item, type: 'Full Image' })),
                ...data[1].map(item => ({ ...item, type: 'Image with Content' })),
                ...data[2].map(item => ({ ...item, type: 'Image Slider' })),
                ...data[3].map(item => ({ ...item, type: 'Category Grid' })),
                ...data[4].map(item => ({ ...item, type: 'FAQ' }))
            ];
            setSections(allSections);
            localStorage.setItem('sections', JSON.stringify(allSections));
        })
        .catch(error => {
            console.error('Error fetching sections:', error);
            // Fallback to local storage if server fetch fails
            const storedSections = JSON.parse(localStorage.getItem('sections')) || [];
            setSections(storedSections);
            alert("Failed to fetch sections. Using cached data.");
        });
    };

    const fetchCategories = (userId) => {
        fetch(`http://localhost:8081/api/categories/${userId}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategoryOptions(data.map(category => category.category_name));
                } else {
                    console.error("Invalid data received from server:", data);
                    alert("Invalid data received from server. Please try again later.");
                }
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                alert("Failed to fetch categories. Please try again later.");
            });
    };

    const addSectionToServer = async (section) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID is not available.");
            return;
        }
        let formData = new FormData();
        let url = '';
        switch (section.type) {
            case 'Full Image':
                url = 'http://localhost:8081/api/full_image';
                formData.append('user_id', userId);
                if (section.image.length > 0) formData.append('image', section.image[0]);
                formData.append('link', section.link);
                break;
            case 'Image with Content':
                url = 'http://localhost:8081/api/image_with_content';
                formData.append('user_id', userId);
                if (section.image.length > 0) formData.append('image', section.image[0]);
                formData.append('title', section.title);
                formData.append('description', section.description);
                formData.append('button1_label', section.actionButtons[0].label);
                formData.append('button1_url', section.actionButtons[0].url);
                formData.append('button2_label', section.actionButtons[1].label);
                formData.append('button2_url', section.actionButtons[1].url);
                break;
            case 'FAQ':
                url = 'http://localhost:8081/api/faq';
                formData.append('user_id', userId);
                formData.append('title', section.title);
                formData.append('questions', JSON.stringify(section.questions));
                break;
            case 'Category Grid':
                url = 'http://localhost:8081/api/category_grid';
                formData.append('user_id', userId);
                formData.append('title', section.title);
                formData.append('categories', JSON.stringify(section.categories));
                break;
            case 'Image Slider':
                url = 'http://localhost:8081/api/image_slider';
                section.image.forEach((img, index) => formData.append(`images[${index}]`, img));
                formData.append('user_id', userId);
                break;
            default:
                console.error('Unknown section type:', section.type);
                return;
        }
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const result = await response.json();
            console.log(result.message);
            alert("Section added successfully!");
            fetchSections(userId);
        } catch (error) {
            console.error("Error adding section:", error);
            alert("Failed to add section. Please try again later.");
        }
    };

    const updateSectionOnServer = async (section) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error("User ID is not available.");
        return;
    }
    let formData = new FormData();
    let url = '';
    switch (section.type) {
        case 'Full Image':
            url = `http://localhost:8081/api/full_image/${section.id}`;
            formData.append('user_id', userId);
            if (section.image.length > 0) {
                formData.append('image', section.image[0]);
            } else {
                console.error("Image is missing or empty.");
                alert("Image is required.");
                return;
            }
            formData.append('link', section.link);
            break;
        case 'Image with Content':
            url = `http://localhost:8081/api/image_with_content/${section.id}`;
            formData.append('user_id', userId);
            if (section.image.length > 0) {
                formData.append('image', section.image[0]);
            } else {
                console.error("Image is missing or empty.");
                alert("Image is required.");
                return;
            }
            formData.append('title', section.title);
            formData.append('description', section.description);
            formData.append('button1_label', section.actionButtons[0].label);
            formData.append('button1_url', section.actionButtons[0].url);
            formData.append('button2_label', section.actionButtons[1].label);
            formData.append('button2_url', section.actionButtons[1].url);
            break;
        case 'FAQ':
            url = `http://localhost:8081/api/faq/${section.id}`;
            formData.append('user_id', userId);
            formData.append('title', section.title);
            formData.append('questions', JSON.stringify(section.questions));
            break;
        case 'Category Grid':
            url = `http://localhost:8081/api/category_grid/${section.id}`;
            formData.append('user_id', userId);
            formData.append('title', section.title);
            formData.append('categories', JSON.stringify(section.categories));
            break;
        case 'Image Slider':
            url = `http://localhost:8081/api/image_slider/${section.id}`;
            section.image.forEach((img, index) => formData.append(`images[${index}]`, img));
            formData.append('user_id', userId);
            break;
        default:
            console.error('Unknown section type:', section.type);
            return;
    }
    console.log("Sending update request to:", url);
    console.log("FormData:", Object.fromEntries(formData.entries()));
    try {
        const response = await fetch(url, {
            method: 'PUT',
            body: formData
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Response error:", errorText);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        console.log(result.message);
        alert("Section updated successfully!");
        fetchSections(userId);
    } catch (error) {
        console.error("Error updating section:", error);
        alert("Failed to update section. Please try again later.");
    }
};

    const deleteSectionFromServer = (sectionId, sectionType) => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID is not available.");
            return;
        }
        let url = '';
        switch (sectionType) {
            case 'Full Image':
                url = `http://localhost:8081/api/full_image/${sectionId}`;
                break;
            case 'Image with Content':
                url = `http://localhost:8081/api/image_with_content/${sectionId}`;
                break;
            case 'FAQ':
                url = `http://localhost:8081/api/faq/${sectionId}`;
                break;
            case 'Category Grid':
                url = `http://localhost:8081/api/category_grid/${sectionId}`;
                break;
            case 'Image Slider':
                url = `http://localhost:8081/api/image_slider/${sectionId}`;
                break;
            default:
                console.error('Unknown section type:', sectionType);
                return;
        }
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userId }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            alert("Section deleted successfully!");
            fetchSections(userId);
        })
        .catch(error => {
            console.error("Error deleting section:", error);
            alert("Failed to delete section. Please try again later.");
        });
    };

    const renderSection = (section) => {
        return (
            <div key={section.id} className="added-section" draggable onDragStart={() => handleDragStart(sections.findIndex(sec => sec.id === section.id))} onDragOver={handleDragOver} onDrop={() => handleDrop(sections.findIndex(sec => sec.id === section.id))}>
                <span>{section.title || section.type}</span>
                <div className="buttons">
                    <button onClick={() => handleEditSection(section)}>Edit</button>
                    <button onClick={() => handleDeleteSection(section.id, section.type)}>Delete</button>
                </div>
            </div>
        );
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
                    <button
                        className="add-section-button"
                        onClick={() => setIsSectionModalOpen(true)}
                    >
                        + Add Section
                    </button>
                    {/* Dropdown for selecting section types */}
                    {isSectionModalOpen && (
                        <div className="section-modal">
                            <div className="modal-content">
                                <span
                                    className="close"
                                    onClick={() => setIsSectionModalOpen(false)}
                                >
                                    &times;
                                </span>
                                <h2>Select a section to add:</h2>
                                <div className="section-list">
                                    {sectionTypes.map((section, index) => (
                                        <div key={index} className="section-item" onClick={() => handleSectionAdd(section)}>
                                            <span>{section.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Render added sections with drag-and-drop */}
                    <div className="sections-container">
                        {sections.map(renderSection)}
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
                            onChange={(e) => handleImageUpload(e)}
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
                            onChange={(e) => handleImageUpload(e)}
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
                                <button onClick={() => removeQuestion(index)}>X</button>
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
                        <select multiple id="categories" name="categories" value={modalData.categories} onChange={handleCategoryChange}>
                            {categoryOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <div className="selected-categories">
                            {modalData.categories.map((category, index) => (
                                <div key={index} className="selected-category">
                                    <span>{category}</span>
                                    <button onClick={() => setModalData(prevState => ({
                                        ...prevState,
                                        categories: prevState.categories.filter(cat => cat !== category)
                                    }))}>X</button>
                                </div>
                            ))}
                        </div>
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
                            onChange={(e) => handleImageUpload(e)}
                        />
                        <div className="image-previews">
                            {modalData.image.map((preview, index) => (
                                <div key={index} className="image-preview">
                                    <img src={URL.createObjectURL(preview)} alt={`Preview ${index}`} width="50" />
                                    <button onClick={() => removeImage(index)}>X</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleSaveChanges}>Save Changes</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Pages;