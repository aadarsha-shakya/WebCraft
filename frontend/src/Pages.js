import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './Pages.css';
import Logo from './assets/WebCraft.png';

const SectionEditor = ({ section, onSave, onCancel, sectionTypes, categoryOptions }) => {
    const [formData, setFormData] = useState({
        type: section.type || '',
        image: section.image ? (Array.isArray(section.image) ? section.image : [section.image]) : [],
        title: section.title || '',
        description: section.description || '',
        link: section.link || '',
        button1_label: section.button1_label || '',
        button1_url: section.button1_url || '',
        button2_label: section.button2_label || '',
        button2_url: section.button2_url || '',
        questions: section.questions ? JSON.parse(section.questions) : [],
        categories: section.categories ? JSON.parse(section.categories) : [],
        images: section.images ? JSON.parse(section.images) : []
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const addQuestion = () => {
        setFormData({ ...formData, questions: [...formData.questions, { question: '', answer: '' }] });
    };

    const removeQuestion = (index) => {
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleCategoryChange = (e) => {
        const selectedCategories = Array.from(e.target.selectedOptions, option => option.value);
        setFormData({ ...formData, categories: selectedCategories });
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, image: files });
    };

    const removeImage = (index) => {
        const newImages = formData.image.filter((_, i) => i !== index);
        setFormData({ ...formData, image: newImages });
    };

    const handleSubmit = async () => {
        const userId = localStorage.getItem('userId');
        const formDataToSend = new FormData();
        formDataToSend.append('userId', userId);
        formDataToSend.append('type', formData.type);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('link', formData.link);
        formDataToSend.append('button1_label', formData.button1_label);
        formDataToSend.append('button1_url', formData.button1_url);
        formDataToSend.append('button2_label', formData.button2_label);
        formDataToSend.append('button2_url', formData.button2_url);
        formDataToSend.append('questions', JSON.stringify(formData.questions));
        formDataToSend.append('categories', JSON.stringify(formData.categories));
        formDataToSend.append('images', JSON.stringify(formData.images));
        if (formData.image.length > 0) {
            formData.image.forEach((img, index) => formDataToSend.append(`image[${index}]`, img));
        }
        const url = section.id ? `http://localhost:8081/api/sections/${section.id}` : 'http://localhost:8081/api/sections';
        const method = section.id ? 'PUT' : 'POST';
        try {
            const response = await fetch(url, {
                method: method,
                body: formDataToSend
            });
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            alert(data.message);
            onSave();
        } catch (error) {
            console.error("Error saving section:", error);
            alert("Failed to save section. Please try again later.");
        }
    };

    return (
        <div className="modal show">
            <div className="modal-content">
                <span className="close" onClick={onCancel}>&times;</span>
                <h2>{section.id ? 'Edit' : 'Add'} Section</h2>
                <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="">Select Section Type</option>
                    {sectionTypes.map((type) => (
                        <option key={type.id} value={type.type}>{type.title}</option>
                    ))}
                </select>
                {formData.type === 'Full Image' && (
                    <>
                        <input type="file" id="image" name="image" accept="image/*" onChange={handleImageUpload} />
                        {formData.image.length > 0 && formData.image.map((img, index) => (
                            <div key={index}>
                                {typeof img === 'string' ? (
                                    <img src={`/uploads/${img}`} alt={`Preview ${index}`} width="100" />
                                ) : (
                                    <img src={URL.createObjectURL(img)} alt={`Preview ${index}`} width="100" />
                                )}
                                <button onClick={() => removeImage(index)}>X</button>
                            </div>
                        ))}
                        <input type="text" id="link" name="link" placeholder="Link" value={formData.link} onChange={handleChange} />
                    </>
                )}
                {formData.type === 'Image with Content' && (
                    <>
                        <input type="file" id="image" name="image" accept="image/*" onChange={handleImageUpload} />
                        {formData.image.length > 0 && formData.image.map((img, index) => (
                            <div key={index}>
                                {typeof img === 'string' ? (
                                    <img src={`/uploads/${img}`} alt={`Preview ${index}`} width="100" />
                                ) : (
                                    <img src={URL.createObjectURL(img)} alt={`Preview ${index}`} width="100" />
                                )}
                                <button onClick={() => removeImage(index)}>X</button>
                            </div>
                        ))}
                        <input type="text" id="title" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
                        <textarea id="description" name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
                        <input type="text" id="button1_label" name="button1_label" placeholder="Button 1 Label" value={formData.button1_label} onChange={handleChange} />
                        <input type="text" id="button1_url" name="button1_url" placeholder="Button 1 URL" value={formData.button1_url} onChange={handleChange} />
                        <input type="text" id="button2_label" name="button2_label" placeholder="Button 2 Label" value={formData.button2_label} onChange={handleChange} />
                        <input type="text" id="button2_url" name="button2_url" placeholder="Button 2 URL" value={formData.button2_url} onChange={handleChange} />
                    </>
                )}
                {formData.type === 'FAQ' && (
                    <>
                        <input type="text" id="title" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
                        {formData.questions.map((question, index) => (
                            <div key={index}>
                                <input type="text" id={`question${index}`} name={`question${index}`} placeholder="Question" value={question.question} onChange={(e) => handleQuestionChange(index, 'question', e.target.value)} />
                                <textarea id={`answer${index}`} name={`answer${index}`} placeholder="Answer" value={question.answer} onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)} />
                                <button onClick={() => removeQuestion(index)}>X</button>
                            </div>
                        ))}
                        <button onClick={addQuestion}>Add Question</button>
                    </>
                )}
                {formData.type === 'Category Grid' && (
                    <>
                        <input type="text" id="title" name="title" placeholder="Title" value={formData.title} onChange={handleChange} />
                        <select multiple id="categories" name="categories" value={formData.categories} onChange={handleCategoryChange}>
                            {categoryOptions.map((option, index) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        <div className="selected-categories">
                            {formData.categories.map((category, index) => (
                                <div key={index} className="selected-category">
                                    <span>{category}</span>
                                    <button onClick={() => setFormData(prevState => ({
                                        ...prevState,
                                        categories: prevState.categories.filter(cat => cat !== category)
                                    }))}>X</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                {formData.type === 'Image Slider' && (
                    <>
                        <input type="file" id="images" name="images" accept="image/*" multiple onChange={handleImageUpload} />
                        <div className="image-previews">
                            {formData.image.length > 0 && formData.image.map((preview, index) => (
                                <div key={index} className="image-preview">
                                    {typeof preview === 'string' ? (
                                        <img src={`/uploads/${preview}`} alt={`Preview ${index}`} width="50" />
                                    ) : (
                                        <img src={URL.createObjectURL(preview)} alt={`Preview ${index}`} width="50" />
                                    )}
                                    <button onClick={() => removeImage(index)}>X</button>
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <button onClick={handleSubmit}>Save Changes</button>
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
};

function Pages() {
    const [sections, setSections] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSection, setEditingSection] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const sectionTypes = [
        { id: '1', type: 'Full Image', title: 'Full Image' },
        { id: '2', type: 'Image with Content', title: 'Image with Content' },
        { id: '3', type: 'FAQ', title: 'FAQ' },
        { id: '4', type: 'Category Grid', title: 'Category Grid' },
        { id: '6', type: 'Image Slider', title: 'Image Slider' },
    ];
    const navigate = useNavigate();

    const toggleDropdown = () => {
        setIsDropdownOpen((prevState) => !prevState);
    };

    const handleSectionAdd = () => {
        setEditingSection(null);
        setIsModalOpen(true);
    };

    const handleEditSection = (section) => {
        setEditingSection(section);
        setIsModalOpen(true);
    };

    const handleDeleteSection = async (sectionId) => {
        const confirmDelete = window.confirm("Delete this section?");
        if (confirmDelete) {
            try {
                const response = await fetch(`http://localhost:8081/api/sections/${sectionId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ userId: localStorage.getItem('userId') }),
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                alert(data.message);
                fetchSections();
            } catch (error) {
                console.error("Error deleting section:", error);
                alert("Failed to delete section. Please try again later.");
            }
        }
    };

    const handleLogout = () => {
        navigate('/Login');
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSection(null);
    };

    const fetchSections = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:8081/api/sections/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            setSections(data);
        } catch (error) {
            console.error('Error fetching sections:', error);
            alert("Failed to fetch sections. Please try again later.");
        }
    };

    const fetchCategories = async () => {
        const userId = localStorage.getItem('userId');
        try {
            const response = await fetch(`http://localhost:8081/api/categories/${userId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (Array.isArray(data)) {
                setCategoryOptions(data.map(category => category.category_name));
            } else {
                console.error("Invalid data received from server:", data);
                alert("Invalid data received from server. Please try again later.");
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            alert("Failed to fetch categories. Please try again later.");
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            fetchSections();
            fetchCategories();
        } else {
            console.error("User ID not found in localStorage");
            alert("User ID not found. Please log in again.");
            navigate('/Login');
        }
    }, [navigate]);

    const renderSection = (section) => (
        <div key={section.id} className="added-section">
            <span>{section.title || section.type}</span>
            <div className="buttons">
                <button onClick={() => handleEditSection(section)}>Edit</button>
                <button onClick={() => handleDeleteSection(section.id)}>Delete</button>
            </div>
        </div>
    );

    return (
        <div className="dashboard-container">
            {/* SIDEBAR */}
            <aside className="sidebar">
                <h2>Main Links</h2>
                <ul>
                    <li><Link to="/dashboard"><i className="fas fa-home"></i> Home</Link></li>
                    <li><Link to="/StoreUsers"><i className="fas fa-users"></i> Store Users</Link></li>
                    <li><Link to="/Categories"><i className="fas fa-th"></i> Categories</Link></li>
                    <li><Link to="/Products"><i className="fas fa-box"></i> Products</Link></li>
                    <li><Link to="/Customers"><i className="fas fa-user"></i> Customers</Link></li>
                    <li><Link to="/Orders"><i className="fas fa-shopping-cart"></i> Orders</Link></li>
                    <li><Link to="/Issues"><i className="fas fa-exclamation-circle"></i> Issues</Link></li>
                    <li><Link to="/BarcodeGeneration"><i className="fas fa-barcode"></i> Barcode Scanner</Link></li>
                    <li><Link to="/Settlement"><i className="fas fa-wallet"></i> Settlement</Link></li>
                    <li><Link to="/Analytics"><i className="fas fa-chart-line"></i> Analytics</Link></li>
                </ul>
                <h2>Customizations</h2>
                <ul>
                    <li><Link to="/Pages"><i className="fas fa-file"></i> Pages</Link></li>
                    <li><Link to="/Plugins"><i className="fas fa-plug"></i> Plugins</Link></li>
                    <li><Link to="/Appearance"><i className="fas fa-paint-brush"></i> Appearance</Link></li>
                    <li><Link to="/StoreSettings"><i className="fas fa-cog"></i> Store Setting</Link></li>
                    <li><Link to="/PaymentSettings"><i className="fas fa-credit-card"></i> Payment Setting</Link></li>
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
                        <Link to="/YourWeb" className="header-icon"><i className="fas fa-globe"></i></Link>
                        <div className={`header-icon w-icon ${isDropdownOpen ? "open" : ""}`} onClick={toggleDropdown}>
                            W
                            {isDropdownOpen && (
                                <div className="dropdown-menu">
                                    <Link to="/Accounts" className="dropdown-item"><i className="fas fa-user"></i> Accounts</Link>
                                    <Link to="/Subscription" className="dropdown-item"><i className="fas fa-dollar-sign"></i> Subscription</Link>
                                    <button className="dropdown-item logout" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>
                {/* CONTENT */}
                <main className="content">
                    <h1>Pages</h1>
                    <button className="add-section-button" onClick={handleSectionAdd}>+ Add Section</button>
                    <div className="sections-container">
                        {sections.map(renderSection)}
                    </div>
                </main>
            </div>
            {/* MODAL */}
            {isModalOpen && (
                <SectionEditor
                    section={editingSection || {}}
                    onSave={fetchSections}
                    onCancel={closeModal}
                    sectionTypes={sectionTypes}
                    categoryOptions={categoryOptions}
                />
            )}
        </div>
    );
}

export default Pages;