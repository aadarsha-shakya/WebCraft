const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(cors());
app.use(express.json());
const db = mysql.createConnection({
    host: "localhost", 
    user: "root",
    password: "",
    database: "webcraft_db"
});
db.connect(err => {
    if (err) {
        console.error("Database connection failed:", err.stack);
        return;
    }
    console.log("Connected to database.");
});
// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });
// Define the /api/upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: "error", message: "No file uploaded." });
    }
    res.json({ filename: req.file.filename });
});
// Existing signup route
app.post('/signup', (req, res) => {
    const sql = "INSERT INTO users(`name`, `email`, `password`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password
    ];
    db.query(sql, [values], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});
// Existing login route
app.post('/login', (req, res) => {
    const sql = "SELECT * FROM users WHERE `email`= ? AND `password`= ?";
    db.query(sql, [req.body.email, req.body.password], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        if (data.length > 0) {
            return res.json({ status: "success", userId: data[0].id });
        } else {
            return res.json("fail");
        }
    });
});
// Business registration routes
app.post('/api/businessregistration', (req, res) => {
    const { userId, registeredBusinessName, registeredAddress, businessPhoneNumber, panNumber, bankName, accountNumber, accountName, branchName } = req.body;
    const checkSql = "SELECT * FROM business_registration WHERE user_id = ?";
    db.query(checkSql, [userId], (err, data) => {
        if (err) {
            console.error("Error checking business registration:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        if (data.length > 0) {
            const updateSql = `
                UPDATE business_registration 
                SET registered_business_name = ?, registered_address = ?, business_phone_number = ?, pan_number = ?, 
                    bank_name = ?, account_number = ?, account_name = ?, branch_name = ?
                WHERE user_id = ?`;   
            db.query(updateSql, [registeredBusinessName, registeredAddress, businessPhoneNumber, panNumber, bankName, accountNumber, accountName, branchName, userId], (err, result) => {
                if (err) {
                    console.error("Error updating business registration:", err);
                    return res.status(500).json({ status: "error", message: "Failed to update business registration" });
                }
                return res.json({ status: "updated", message: "Business registration updated successfully" });
            });
        } else {
            const insertSql = `
                INSERT INTO business_registration(user_id, registered_business_name, registered_address, business_phone_number, pan_number, bank_name, account_number, account_name, branch_name)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            db.query(insertSql, [userId, registeredBusinessName, registeredAddress, businessPhoneNumber, panNumber, bankName, accountNumber, accountName, branchName], (err, result) => {
                if (err) {
                    console.error("Error inserting business registration:", err);
                    return res.status(500).json({ status: "error", message: "Failed to create business registration" });
                }
                return res.json({ status: "created", message: "Business registration created successfully" });
            });
        }
    });
});
// Delivery charges routes
app.post('/api/deliverycharges', (req, res) => {
    const { userId, insideValley, outsideValley } = req.body;
    const checkSql = "SELECT * FROM delivery_charges WHERE user_id = ?";
    db.query(checkSql, [userId], (err, data) => {
        if (err) return res.json("Error");
        if (data.length > 0) {
            const updateSql = "UPDATE delivery_charges SET inside_valley = ?, outside_valley = ? WHERE user_id = ?";
            db.query(updateSql, [insideValley, outsideValley, userId], (err, result) => {
                if (err) return res.json("Error");
                return res.json({ status: "updated" });
            });
        } else {
            const insertSql = "INSERT INTO delivery_charges(user_id, inside_valley, outside_valley) VALUES (?, ?, ?)";
            db.query(insertSql, [userId, insideValley, outsideValley], (err, result) => {
                if (err) return res.json("Error");
                return res.json({ status: "created" });
            });
        }
    });
});
// Domain settings routes
app.post('/api/domainsettings', (req, res) => {
    const { userId, subdomain, customDomain } = req.body;
    const checkSql = "SELECT * FROM domain_settings WHERE user_id = ?";
    db.query(checkSql, [userId], (err, data) => {
        if (err) return res.json("Error");
        if (data.length > 0) {
            const updateSql = "UPDATE domain_settings SET subdomain = ?, custom_domain = ? WHERE user_id = ?";
            db.query(updateSql, [subdomain, customDomain, userId], (err, result) => {
                if (err) return res.json("Error");
                return res.json({ status: "updated" });
            });
        } else {
            const insertSql = "INSERT INTO domain_settings(user_id, subdomain, custom_domain) VALUES (?, ?, ?)";
            db.query(insertSql, [userId, subdomain, customDomain], (err, result) => {
                if (err) return res.json("Error");
                return res.json({ status: "created" });
            });
        }
    });
});
// Social accounts routes
app.post('/api/socialaccounts', (req, res) => {
    const { userId, facebookUrl, instagramUrl, tiktokUrl, whatsappNumber } = req.body;
    const checkSql = "SELECT * FROM social_accounts WHERE user_id = ?";
    db.query(checkSql, [userId], (err, data) => {
        if (err) return res.json("Error");
        if (data.length > 0) {
            const updateSql = "UPDATE social_accounts SET facebook_url = ?, instagram_url = ?, tiktok_url = ?, whatsapp_number = ? WHERE user_id = ?";
            db.query(updateSql, [facebookUrl, instagramUrl, tiktokUrl, whatsappNumber, userId], (err, result) => {
                if (err) return res.json("Error");
                return res.json({ status: "updated" });
            });
        } else {
            const insertSql = "INSERT INTO social_accounts(user_id, facebook_url, instagram_url, tiktok_url, whatsapp_number) VALUES (?, ?, ?, ?, ?)";
            db.query(insertSql, [userId, facebookUrl, instagramUrl, tiktokUrl, whatsappNumber], (err, result) => {
                if (err) return res.json("Error");
                return res.json({ status: "created" });
            });
        }
    });
});
// Store details routes
app.post('/api/storedetails', (req, res) => {
    const { userId, storeName, businessCategory, contactNumber, storeAddress, contactEmail } = req.body;
    const checkSql = "SELECT * FROM store_details WHERE user_id = ?";
    db.query(checkSql, [userId], (err, data) => {
        if (err) {
            console.error("Error checking store details:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        if (data.length > 0) {
            const updateSql = "UPDATE store_details SET store_name = ?, business_category = ?, contact_number = ?, store_address = ?, contact_email = ? WHERE user_id = ?";
            db.query(updateSql, [storeName, businessCategory, contactNumber, storeAddress, contactEmail, userId], (err, result) => {
                if (err) {
                    console.error("Error updating store details:", err);
                    return res.status(500).json({ status: "error", message: "Failed to update store details" });
                }
                return res.json({ status: "updated", message: "Store details updated successfully" });
            });
        } else {
            const insertSql = "INSERT INTO store_details(user_id, store_name, business_category, contact_number, store_address, contact_email) VALUES (?, ?, ?, ?, ?, ?)";
            db.query(insertSql, [userId, storeName, businessCategory, contactNumber, storeAddress, contactEmail], (err, result) => {
                if (err) {
                    console.error("Error inserting store details:", err);
                    return res.status(500).json({ status: "error", message: "Failed to create store details" });
                }
                return res.json({ status: "created", message: "Store details created successfully" });
            });
        }
    });
});
// Category routes
app.post('/api/categories', upload.single('categoryImage'), (req, res) => {
    const { userId, categoryName } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!userId || !categoryName || !image) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    const checkSql = "SELECT * FROM categories WHERE user_id = ? AND category_name = ?";
    db.query(checkSql, [userId, categoryName], (err, data) => {
        if (err) {
            console.error("Error checking category:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        if (data.length > 0) {
            const updateSql = "UPDATE categories SET image = ? WHERE user_id = ? AND category_name = ?";
            db.query(updateSql, [image, userId, categoryName], (err, result) => {
                if (err) {
                    console.error("Error updating category:", err);
                    return res.status(500).json({ status: "error", message: "Failed to update category" });
                }
                return res.json({ status: "updated", message: "Category updated successfully" });
            });
        } else {
            const insertSql = "INSERT INTO categories (user_id, category_name, image) VALUES (?, ?, ?)";
            db.query(insertSql, [userId, categoryName, image], (err, result) => {
                if (err) {
                    console.error("Error inserting category:", err);
                    return res.status(500).json({ status: "error", message: "Failed to create category" });
                }
                return res.json({ status: "created", message: "Category created successfully" });
            });
        }
    });
});
app.get('/api/categories/:userId', (req, res) => {
    const sql = "SELECT * FROM categories WHERE user_id = ?";
    db.query(sql, [req.params.userId], (err, data) => {
        if (err) {
            console.error("Error fetching categories:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data);
    });
});
app.delete('/api/categories/:id', (req, res) => {
    const sql = "DELETE FROM categories WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting category:", err);
            return res.status(500).json({ status: "error", message: "Failed to delete category" });
        }
        return res.json({ status: "deleted", message: "Category deleted successfully" });
    });
});
// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Create uploads directory if it doesn't exist
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}
// Product routes
app.get('/api/products', (req, res) => {
    const userId = req.query.userId;
    const sql = `
        SELECT p.*, v.* 
        FROM products p
        LEFT JOIN variants v ON p.id = v.product_id
        WHERE p.user_id = ?
    `;
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: "Database error" });
        }
        return res.json(data);
    });
});
app.post('/api/products', upload.array('productImages'), (req, res) => {
    const { userId, productName, category, productDescription, variants } = req.body;
    const productImages = req.files.map(file => file.filename);
    const productSql = `
        INSERT INTO products(user_id, product_name, category_name, product_description, product_images)
        VALUES (?, ?, ?, ?, ?)
    `;
    db.query(productSql, [userId, productName, category, productDescription, JSON.stringify(productImages)], (err, result) => {
        if (err) {
            console.error("Error adding product:", err);
            return res.status(500).json({ error: "Failed to add product" });
        }
        const productId = result.insertId;
        const parsedVariants = JSON.parse(variants);
        const variantSql = `
            INSERT INTO variants(product_id, user_id, variant_name, size, crossed_price, selling_price, cost_price, weight, quantity, sku)
            VALUES ?
        `;
        const variantValues = parsedVariants.map(variant => [
            productId,
            userId,
            variant.variant,
            variant.size,
            variant.crossedPrice,
            variant.sellingPrice,
            variant.costPrice,
            variant.weight,
            variant.quantity,
            variant.sku
        ]);
        db.query(variantSql, [variantValues], (err) => {
            if (err) {
                console.error("Error adding variants:", err);
                return res.status(500).json({ error: "Failed to add variants" });
            }
            return res.json({ status: "created", message: "Product added successfully" });
        });
    });
});
// Appearance routes
app.post('/api/branding', upload.any(), (req, res) => {
    const { userId, primaryColor, brandName, fontFamily, popupModalEnabled, popupModalLink } = req.body;
    const brandLogo = req.files.find(file => file.fieldname === 'brandLogo')?.filename || null;
    const brandFavicon = req.files.find(file => file.fieldname === 'brandFavicon')?.filename || null;
    const popupModalImage = req.files.find(file => file.fieldname === 'popupModalImage')?.filename || null;
    const checkSql = "SELECT * FROM branding WHERE user_id = ?";
    db.query(checkSql, [userId], (err, data) => {
        if (err) {
            console.error("Error checking branding:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        if (data.length > 0) {
            const updateSql = `
                UPDATE branding 
                SET primary_color = ?, brand_name = ?, brand_logo = ?, font_family = ?, brand_favicon = ?, 
                    popup_modal_image = ?, popup_modal_link = ?, popup_modal_enabled = ?
                WHERE user_id = ?
            `;
            db.query(updateSql, [primaryColor, brandName, brandLogo, fontFamily, brandFavicon, popupModalImage, popupModalLink, popupModalEnabled, userId], (err, result) => {
                if (err) {
                    console.error("Error updating branding:", err);
                    return res.status(500).json({ status: "error", message: "Failed to update branding" });
                }
                return res.json({ status: "updated", message: "Branding updated successfully" });
            });
        } else {
            const insertSql = `
                INSERT INTO branding(user_id, primary_color, brand_name, brand_logo, font_family, brand_favicon, popup_modal_image, popup_modal_link, popup_modal_enabled)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            db.query(insertSql, [userId, primaryColor, brandName, brandLogo, fontFamily, brandFavicon, popupModalImage, popupModalLink, popupModalEnabled], (err, result) => {
                if (err) {
                    console.error("Error inserting branding:", err);
                    return res.status(500).json({ status: "error", message: "Failed to create branding" });
                }
                return res.json({ status: "created", message: "Branding created successfully" });
            });
        }
    });
});
app.get('/api/branding/:userId', (req, res) => {
    const sql = "SELECT * FROM branding WHERE user_id = ?";
    db.query(sql, [req.params.userId], (err, data) => {
        if (err) {
            console.error("Error fetching branding:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data[0] || {});
    });
});
app.post('/api/components', (req, res) => {
    const { userId, navigationType } = req.body;
    const checkSql = "SELECT * FROM components WHERE user_id = ?";
    db.query(checkSql, [userId], (err, data) => {
        if (err) {
            console.error("Error checking components:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        if (data.length > 0) {
            const updateSql = "UPDATE components SET navigation_type = ? WHERE user_id = ?";
            db.query(updateSql, [navigationType, userId], (err, result) => {
                if (err) {
                    console.error("Error updating components:", err);
                    return res.status(500).json({ status: "error", message: "Failed to update components" });
                }
                return res.json({ status: "updated", message: "Components updated successfully" });
            });
        } else {
            const insertSql = "INSERT INTO components(user_id, navigation_type) VALUES (?, ?)";
            db.query(insertSql, [userId, navigationType], (err, result) => {
                if (err) {
                    console.error("Error inserting components:", err);
                    return res.status(500).json({ status: "error", message: "Failed to create components" });
                }
                return res.json({ status: "created", message: "Components created successfully" });
            });
        }
    });
});
app.get('/api/components/:userId', (req, res) => {
    const sql = "SELECT * FROM components WHERE user_id = ?";
    db.query(sql, [req.params.userId], (err, data) => {
        if (err) {
            console.error("Error fetching components:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data[0] || {});
    });
});
// Fetch Footer
app.get('/api/footer/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT * FROM footer WHERE userId = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching footer:', err);
            res.status(500).send('Error fetching footer');
            return;
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.json({});
        }
    });
});
// Save Footer
app.post('/api/footer', (req, res) => {
    const userId = req.body.userId;
    const footerData = {
        description: req.body.description,
        copyright: req.body.copyright,
        shippingPolicy: req.body.shippingPolicy,
        refundPolicy: req.body.refundPolicy,
        privacyPolicy: req.body.privacyPolicy,
        termsOfService: req.body.termsOfService,
        facebook: req.body.facebook,
        youtube: req.body.youtube,
        instagram: req.body.instagram,
        whatsapp: req.body.whatsapp
    };
    // Check if footer already exists for the user
    const checkQuery = 'SELECT * FROM footer WHERE userId = ?';
    db.query(checkQuery, [userId], (err, results) => {
        if (err) {
            console.error('Error checking footer:', err);
            res.status(500).send('Error checking footer');
            return;
        }
        if (results.length > 0) {
            // Update existing footer
            const updateQuery = 'UPDATE footer SET ? WHERE userId = ?';
            db.query(updateQuery, [footerData, userId], (err, updateResults) => {
                if (err) {
                    console.error('Error updating footer:', err);
                    res.status(500).send('Error updating footer');
                    return;
                }
                res.json({ message: 'Footer updated successfully' });
            });
        } else {
            // Insert new footer
            const insertQuery = 'INSERT INTO footer SET ?';
            db.query(insertQuery, { ...footerData, userId }, (err, insertResults) => {
                if (err) {
                    console.error('Error inserting footer:', err);
                    res.status(500).send('Error inserting footer');
                    return;
                }
                res.json({ message: 'Footer saved successfully' });
            });
        }
    });
});
// Get all issues for a specific user
app.get('/api/issues/:userId', (req, res) => {
    const sql = "SELECT * FROM issues WHERE user_id = ?";
    db.query(sql, [req.params.userId], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});
// Create a new issue for a specific user
app.post('/api/issues', (req, res) => {
    const sql = "INSERT INTO issues (`user_id`, `text`, `status`) VALUES (?, ?, ?)";
    const values = [
        req.body.user_id,
        req.body.text,
        req.body.status || 'created'
    ];
    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});
// Update an issue's status
app.put('/api/issues/:id', (req, res) => {
    const sql = "UPDATE issues SET `status` = ? WHERE `id` = ?";
    const values = [
        req.body.status,
        req.params.id
    ];
    db.query(sql, values, (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});
// Delete an issue
app.delete('/api/issues/:id', (req, res) => {
    const sql = "DELETE FROM issues WHERE `id` = ?";
    db.query(sql, [req.params.id], (err, data) => {
        if (err) {
            return res.json("Error");
        }
        return res.json(data);
    });
});
// Sections routes
app.get('/api/sections', (req, res) => {
    const userId = req.query.userId;
    const sql = `
        SELECT id, user_id, NULL AS title, NULL AS description, link, created_at, 'Full Image' AS type, image AS data
        FROM full_image
        WHERE user_id = ?
        UNION ALL
        SELECT id, user_id, title, description, link, created_at, 'Image with Content' AS type, 
               CONCAT(button1_label, ',', button1_url, ',', button2_label, ',', button2_url) AS data
        FROM image_with_content
        WHERE user_id = ?
        UNION ALL
        SELECT id, user_id, title, NULL AS description, NULL AS link, created_at, 'FAQ' AS type, questions AS data
        FROM faq
        WHERE user_id = ?
        UNION ALL
        SELECT id, user_id, title, NULL AS description, NULL AS link, created_at, 'Category Grid' AS type, categories AS data
        FROM category_grid
        WHERE user_id = ?
        UNION ALL
        SELECT id, user_id, NULL AS title, NULL AS description, NULL AS link, created_at, 'Image Slider' AS type, images AS data
        FROM image_slider
        WHERE user_id = ?
    `;
    db.query(sql, [userId, userId, userId, userId, userId], (err, data) => {
        if (err) {
            console.error("Error fetching sections:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data);
    });
});
app.post('/api/sections', upload.any(), (req, res) => {
    const { userId, type, title, description, link, actionButtons, questions, categories, price } = req.body;
    const images = req.files.map(file => file.filename);
    const formData = {
        user_id: userId,
        title: title || null,
        description: description || null,
        link: link || null,
        actionButtons: actionButtons ? JSON.stringify(JSON.parse(actionButtons)) : null,
        questions: questions ? JSON.stringify(JSON.parse(questions)) : null,
        categories: categories ? JSON.stringify(JSON.parse(categories)) : null,
        price: price || null,
        images: images.length > 0 ? JSON.stringify(images) : null,
    };
    let sql;
    let values;
    switch (type) {
        case 'Full Image':
            sql = `
                INSERT INTO full_image (user_id, image, link)
                VALUES (?, ?, ?)
            `;
            values = [formData.user_id, formData.images ? JSON.parse(formData.images)[0] : null, formData.link];
            break;
        case 'Image with Content':
            sql = `
                INSERT INTO image_with_content (user_id, image, title, description, button1_label, button1_url, button2_label, button2_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            values = [
                formData.user_id,
                formData.images ? JSON.parse(formData.images)[0] : null,
                formData.title,
                formData.description,
                formData.actionButtons ? JSON.parse(formData.actionButtons)[0].label : null,
                formData.actionButtons ? JSON.parse(formData.actionButtons)[0].url : null,
                formData.actionButtons ? JSON.parse(formData.actionButtons)[1].label : null,
                formData.actionButtons ? JSON.parse(formData.actionButtons)[1].url : null,
            ];
            break;
        case 'FAQ':
            sql = `
                INSERT INTO faq (user_id, title, questions)
                VALUES (?, ?, ?)
            `;
            values = [formData.user_id, formData.title, formData.questions];
            break;
        case 'Category Grid':
            sql = `
                INSERT INTO category_grid (user_id, title, categories)
                VALUES (?, ?, ?)
            `;
            values = [formData.user_id, formData.title, formData.categories];
            break;
        case 'Image Slider':
            sql = `
                INSERT INTO image_slider (user_id, images)
                VALUES (?, ?)
            `;
            values = [formData.user_id, formData.images];
            break;
        default:
            return res.status(400).json({ status: "error", message: "Invalid section type" });
    }
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error adding section:", err.sqlMessage || err.message, "SQL Query:", sql);
            return res.status(500).json({ status: "error", message: "Failed to add section" });
        }
        return res.json({ status: "created", message: "Section added successfully", id: result.insertId });
    });
});
app.put('/api/sections/:id', upload.any(), (req, res) => {
    const { userId, type, title, description, link, actionButtons, questions, categories, price } = req.body;
    const images = req.files.map(file => file.filename);
    const formData = {
        user_id: userId,
        title: title || null,
        description: description || null,
        link: link || null,
        actionButtons: actionButtons ? JSON.stringify(JSON.parse(actionButtons)) : null,
        questions: questions ? JSON.stringify(JSON.parse(questions)) : null,
        categories: categories ? JSON.stringify(JSON.parse(categories)) : null,
        price: price || null,
        images: images.length > 0 ? JSON.stringify(images) : null,
    };
    let sql;
    let values;
    switch (type) {
        case 'Full Image':
            sql = `
                UPDATE full_image 
                SET image = ?, link = ?
                WHERE id = ? AND user_id = ?
            `;
            values = [formData.images ? JSON.parse(formData.images)[0] : null, formData.link, req.params.id, formData.user_id];
            break;
        case 'Image with Content':
            sql = `
                UPDATE image_with_content 
                SET image = ?, title = ?, description = ?, button1_label = ?, button1_url = ?, button2_label = ?, button2_url = ?
                WHERE id = ? AND user_id = ?
            `;
            values = [
                formData.images ? JSON.parse(formData.images)[0] : null,
                formData.title,
                formData.description,
                formData.actionButtons ? JSON.parse(formData.actionButtons)[0].label : null,
                formData.actionButtons ? JSON.parse(formData.actionButtons)[0].url : null,
                formData.actionButtons ? JSON.parse(formData.actionButtons)[1].label : null,
                formData.actionButtons ? JSON.parse(formData.actionButtons)[1].url : null,
                req.params.id,
                formData.user_id,
            ];
            break;
        case 'FAQ':
            sql = `
                UPDATE faq 
                SET title = ?, questions = ?
                WHERE id = ? AND user_id = ?
            `;
            values = [formData.title, formData.questions, req.params.id, formData.user_id];
            break;
        case 'Category Grid':
            sql = `
                UPDATE category_grid 
                SET title = ?, categories = ?
                WHERE id = ? AND user_id = ?
            `;
            values = [formData.title, formData.categories, req.params.id, formData.user_id];
            break;
        case 'Image Slider':
            sql = `
                UPDATE image_slider 
                SET images = ?
                WHERE id = ? AND user_id = ?
            `;
            values = [formData.images, req.params.id, formData.user_id];
            break;
        default:
            return res.status(400).json({ status: "error", message: "Invalid section type" });
    }
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating section:", err.sqlMessage || err.message, "SQL Query:", sql);
            return res.status(500).json({ status: "error", message: "Failed to update section" });
        }
        return res.json({ status: "updated", message: "Section updated successfully" });
    });
});
app.delete('/api/sections/:id', (req, res) => {
    const { userId, type } = req.body;
    let sql;
    let values;
    switch (type) {
        case 'Full Image':
            sql = "DELETE FROM full_image WHERE id = ? AND user_id = ?";
            values = [req.params.id, userId];
            break;
        case 'Image with Content':
            sql = "DELETE FROM image_with_content WHERE id = ? AND user_id = ?";
            values = [req.params.id, userId];
            break;
        case 'FAQ':
            sql = "DELETE FROM faq WHERE id = ? AND user_id = ?";
            values = [req.params.id, userId];
            break;
        case 'Category Grid':
            sql = "DELETE FROM category_grid WHERE id = ? AND user_id = ?";
            values = [req.params.id, userId];
            break;
        case 'Image Slider':
            sql = "DELETE FROM image_slider WHERE id = ? AND user_id = ?";
            values = [req.params.id, userId];
            break;
        default:
            return res.status(400).json({ status: "error", message: "Invalid section type" });
    }
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error deleting section:", err.sqlMessage || err.message, "SQL Query:", sql);
            return res.status(500).json({ status: "error", message: "Failed to delete section" });
        }
        return res.json({ status: "deleted", message: "Section deleted successfully" });
    });
});
app.put('/api/sections/order', (req, res) => {
    const { userId, sections } = req.body;
    // Implement logic to update the order of sections if needed
    // For now, we'll just acknowledge the request
    return res.json({ status: "updated", message: "Section order updated successfully" });
});
app.listen(8081, () => {
    console.log("Listening on port 8081");
});