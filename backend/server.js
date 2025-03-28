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

// Full Image Section Routes
app.get('/api/full_image', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM full_image WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching full_image sections:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data);
    });
});

app.post('/api/full_image', upload.single('image'), (req, res) => {
    const { userId, link } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!userId || !image || !link) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    const insertSql = "INSERT INTO full_image (user_id, image, link) VALUES (?, ?, ?)";
    db.query(insertSql, [userId, image, link], (err, result) => {
        if (err) {
            console.error("Error inserting full_image section:", err);
            return res.status(500).json({ status: "error", message: "Failed to create full_image section" });
        }
        return res.json({ status: "created", message: "Full Image section created successfully", id: result.insertId });
    });
});

app.put('/api/full_image/:id', upload.single('image'), (req, res) => {
    const { userId, link } = req.body;
    const image = req.file ? req.file.filename : null;
    const id = req.params.id;
    if (!userId || !id || !link) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    console.log("Updating full_image section with userId:", userId, "and id:", id);
    console.log("Received image:", image);
    console.log("Received link:", link);
    const updateSql = "UPDATE full_image SET image = ?, link = ? WHERE id = ? AND user_id = ?";
    db.query(updateSql, [image, link, id, userId], (err, result) => {
        if (err) {
            console.error("Error updating full_image section:", err);
            return res.status(500).json({ status: "error", message: "Failed to update full_image section" });
        }
        return res.json({ status: "updated", message: "Full Image section updated successfully" });
    });
});

app.delete('/api/full_image/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const deleteSql = "DELETE FROM full_image WHERE id = ? AND user_id = ?";
    db.query(deleteSql, [id, userId], (err, result) => {
        if (err) {
            console.error("Error deleting full_image section:", err);
            return res.status(500).json({ status: "error", message: "Failed to delete full_image section" });
        }
        return res.json({ status: "deleted", message: "Full Image section deleted successfully" });
    });
});

// Image with Content Section Routes
app.get('/api/image_with_content', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM image_with_content WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching image_with_content sections:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data);
    });
});

app.post('/api/image_with_content', upload.single('image'), (req, res) => {
    const { userId, title, description, button1Label, button1Url, button2Label, button2Url } = req.body;
    const image = req.file ? req.file.filename : null;
    if (!userId || !image || !title || !description || !button1Label || !button1Url || !button2Label || !button2Url) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    const insertSql = "INSERT INTO image_with_content (user_id, image, title, description, button1_label, button1_url, button2_label, button2_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(insertSql, [userId, image, title, description, button1Label, button1Url, button2Label, button2Url], (err, result) => {
        if (err) {
            console.error("Error inserting image_with_content section:", err);
            return res.status(500).json({ status: "error", message: "Failed to create image_with_content section" });
        }
        return res.json({ status: "created", message: "Image with Content section created successfully", id: result.insertId });
    });
});

app.put('/api/image_with_content/:id', upload.single('image'), (req, res) => {
    const { userId, title, description, button1Label, button1Url, button2Label, button2Url } = req.body;
    const image = req.file ? req.file.filename : null;
    const id = req.params.id;
    if (!userId || !id || !title || !description || !button1Label || !button1Url || !button2Label || !button2Url) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    console.log("Updating image_with_content section with userId:", userId, "and id:", id);
    console.log("Received image:", image);
    console.log("Received title:", title);
    console.log("Received description:", description);
    console.log("Received button1Label:", button1Label);
    console.log("Received button1Url:", button1Url);
    console.log("Received button2Label:", button2Label);
    console.log("Received button2Url:", button2Url);
    const updateSql = "UPDATE image_with_content SET image = ?, title = ?, description = ?, button1_label = ?, button1_url = ?, button2_label = ?, button2_url = ? WHERE id = ? AND user_id = ?";
    db.query(updateSql, [image, title, description, button1Label, button1Url, button2Label, button2Url, id, userId], (err, result) => {
        if (err) {
            console.error("Error updating image_with_content section:", err);
            return res.status(500).json({ status: "error", message: "Failed to update image_with_content section" });
        }
        return res.json({ status: "updated", message: "Image with Content section updated successfully" });
    });
});

app.delete('/api/image_with_content/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const deleteSql = "DELETE FROM image_with_content WHERE id = ? AND user_id = ?";
    db.query(deleteSql, [id, userId], (err, result) => {
        if (err) {
            console.error("Error deleting image_with_content section:", err);
            return res.status(500).json({ status: "error", message: "Failed to delete image_with_content section" });
        }
        return res.json({ status: "deleted", message: "Image with Content section deleted successfully" });
    });
});

// Image Slider Section Routes
app.get('/api/image_slider', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM image_slider WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching image_slider sections:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data);
    });
});

app.post('/api/image_slider', upload.array('images'), (req, res) => {
    const { userId } = req.body;
    const images = req.files.map(file => file.filename);
    if (!userId || !images) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    const insertSql = "INSERT INTO image_slider (user_id, images) VALUES (?, ?)";
    db.query(insertSql, [userId, JSON.stringify(images)], (err, result) => {
        if (err) {
            console.error("Error inserting image_slider section:", err);
            return res.status(500).json({ status: "error", message: "Failed to create image_slider section" });
        }
        return res.json({ status: "created", message: "Image Slider section created successfully", id: result.insertId });
    });
});

app.put('/api/image_slider/:id', upload.array('images'), (req, res) => {
    const { userId } = req.body;
    const images = req.files.map(file => file.filename);
    const id = req.params.id;
    if (!userId || !id || !images) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    console.log("Updating image_slider section with userId:", userId, "and id:", id);
    console.log("Received images:", images);
    const updateSql = "UPDATE image_slider SET images = ? WHERE id = ? AND user_id = ?";
    db.query(updateSql, [JSON.stringify(images), id, userId], (err, result) => {
        if (err) {
            console.error("Error updating image_slider section:", err);
            return res.status(500).json({ status: "error", message: "Failed to update image_slider section" });
        }
        return res.json({ status: "updated", message: "Image Slider section updated successfully" });
    });
});

app.delete('/api/image_slider/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const deleteSql = "DELETE FROM image_slider WHERE id = ? AND user_id = ?";
    db.query(deleteSql, [id, userId], (err, result) => {
        if (err) {
            console.error("Error deleting image_slider section:", err);
            return res.status(500).json({ status: "error", message: "Failed to delete image_slider section" });
        }
        return res.json({ status: "deleted", message: "Image Slider section deleted successfully" });
    });
});

// Category Grid Section Routes
app.get('/api/category_grid', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM category_grid WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching category_grid sections:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data);
    });
});

app.post('/api/category_grid', (req, res) => {
    const { userId, title, categories } = req.body;
    if (!userId || !title || !categories) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    const insertSql = "INSERT INTO category_grid (user_id, title, categories) VALUES (?, ?, ?)";
    db.query(insertSql, [userId, title, JSON.stringify(categories)], (err, result) => {
        if (err) {
            console.error("Error inserting category_grid section:", err);
            return res.status(500).json({ status: "error", message: "Failed to create category_grid section" });
        }
        return res.json({ status: "created", message: "Category Grid section created successfully", id: result.insertId });
    });
});

app.put('/api/category_grid/:id', (req, res) => {
    const { userId, title, categories } = req.body;
    const id = req.params.id;
    if (!userId || !id || !title || !categories) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    console.log("Updating category_grid section with userId:", userId, "and id:", id);
    console.log("Received title:", title);
    console.log("Received categories:", categories);
    const updateSql = "UPDATE category_grid SET title = ?, categories = ? WHERE id = ? AND user_id = ?";
    db.query(updateSql, [title, JSON.stringify(categories), id, userId], (err, result) => {
        if (err) {
            console.error("Error updating category_grid section:", err);
            return res.status(500).json({ status: "error", message: "Failed to update category_grid section" });
        }
        return res.json({ status: "updated", message: "Category Grid section updated successfully" });
    });
});

app.delete('/api/category_grid/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const deleteSql = "DELETE FROM category_grid WHERE id = ? AND user_id = ?";
    db.query(deleteSql, [id, userId], (err, result) => {
        if (err) {
            console.error("Error deleting category_grid section:", err);
            return res.status(500).json({ status: "error", message: "Failed to delete category_grid section" });
        }
        return res.json({ status: "deleted", message: "Category Grid section deleted successfully" });
    });
});

// FAQ Section Routes
app.get('/api/faq', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM faq WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching faq sections:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data);
    });
});

app.post('/api/faq', (req, res) => {
    const { userId, title, questions } = req.body;
    if (!userId || !title || !questions) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    const insertSql = "INSERT INTO faq (user_id, title, questions) VALUES (?, ?, ?)";
    db.query(insertSql, [userId, title, JSON.stringify(questions)], (err, result) => {
        if (err) {
            console.error("Error inserting faq section:", err);
            return res.status(500).json({ status: "error", message: "Failed to create faq section" });
        }
        return res.json({ status: "created", message: "FAQ section created successfully", id: result.insertId });
    });
});

app.put('/api/faq/:id', (req, res) => {
    const { userId, title, questions } = req.body;
    const id = req.params.id;
    if (!userId || !id || !title || !questions) {
        return res.status(400).json({ status: "error", message: "Missing required fields." });
    }
    console.log("Updating faq section with userId:", userId, "and id:", id);
    console.log("Received title:", title);
    console.log("Received questions:", questions);
    const updateSql = "UPDATE faq SET title = ?, questions = ? WHERE id = ? AND user_id = ?";
    db.query(updateSql, [title, JSON.stringify(questions), id, userId], (err, result) => {
        if (err) {
            console.error("Error updating faq section:", err);
            return res.status(500).json({ status: "error", message: "Failed to update faq section" });
        }
        return res.json({ status: "updated", message: "FAQ section updated successfully" });
    });
});

app.delete('/api/faq/:id', (req, res) => {
    const id = req.params.id;
    const userId = req.body.userId;
    const deleteSql = "DELETE FROM faq WHERE id = ? AND user_id = ?";
    db.query(deleteSql, [id, userId], (err, result) => {
        if (err) {
            console.error("Error deleting faq section:", err);
            return res.status(500).json({ status: "error", message: "Failed to delete faq section" });
        }
        return res.json({ status: "deleted", message: "FAQ section deleted successfully" });
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Server is running on port 8081");
});