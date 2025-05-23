const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const axios = require('axios'); // Import axios for making HTTP requests
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To support URL-encoded bodies
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

// Existing SIGNUP route
app.post('/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    const sql = "INSERT INTO users (`name`, `email`, `password`, `role`) VALUES (?, ?, ?, ?)";
    const values = [
        name,
        email,
        password,
        role || 'vendor' // Default to 'vendor' if role is not provided
    ];
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Error signing up user:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ status: "error", message: "Email already exists. Please use a different email." });
            }
            return res.status(500).json({ status: "error", message: "Server error" });
        }
        return res.json({ status: "created", message: "User created successfully", userId: data.insertId, userRole: role || 'vendor' });
    });
});

// Existing LOGIN route
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

// STORE SETTINGS PAGE
// BUSINESS REGISTRATION routes
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

// DELIVERY CHARGES routes
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

// DOMAIN SETTINGS routes
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

// SOCIAL ACCOUNTS routes
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

// STORE DETAILS routes
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

app.get('/api/storedetails', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM store_details WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching store details:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data[0] || {});
    });
});

app.get('/api/socialaccounts', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM social_accounts WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching social accounts:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data[0] || {});
    });
});

app.get('/api/deliverycharges', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM delivery_charges WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching delivery charges:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data[0] || {});
    });
});

app.get('/api/domainsettings', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM domain_settings WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching domain settings:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data[0] || {});
    });
});

app.get('/api/businessregistration', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT * FROM business_registration WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching business registration:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data[0] || {});
    });
});

// CATEGORIES PAGE 
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
        SELECT p.id AS product_id, p.user_id, p.product_name, p.category_name, p.product_description, p.product_images, p.status, p.created_at,
               v.id AS variant_id, v.product_id AS variant_product_id, v.user_id AS variant_user_id, v.variant_name, v.size, v.crossed_price, v.selling_price, v.cost_price, v.weight, v.quantity, v.sku
        FROM products p
        LEFT JOIN variants v ON p.id = v.product_id
        WHERE p.user_id = ?
    `;
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching products:", err);
            return res.status(500).json({ error: "Database error" });
        }
        // Group variants by product
        const productsMap = {};
        data.forEach(row => {
            const productId = row.product_id;
            if (!productsMap[productId]) {
                productsMap[productId] = {
                    id: productId,
                    user_id: row.user_id,
                    product_name: row.product_name,
                    category_name: row.category_name,
                    product_description: row.product_description,
                    product_images: JSON.parse(row.product_images),
                    status: row.status || 'Active',
                    created_at: row.created_at,
                    variants: []
                };
            }
            if (row.variant_id) {
                productsMap[productId].variants.push({
                    id: row.variant_id,
                    product_id: row.variant_product_id,
                    user_id: row.variant_user_id,
                    variant_name: row.variant_name,
                    size: row.size,
                    crossed_price: row.crossed_price,
                    selling_price: row.selling_price,
                    cost_price: row.cost_price,
                    weight: row.weight,
                    quantity: row.quantity,
                    sku: row.sku
                });
            }
        });
        const products = Object.values(productsMap);
        return res.json(products);
    });
});

app.post('/api/products', upload.array('productImages'), (req, res) => {
    const { userId, productName, category, productDescription, variants } = req.body;
    const productImages = req.files.map(file => file.filename);
    const productSql = `
        INSERT INTO products(user_id, product_name, category_name, product_description, product_images, status)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(productSql, [userId, productName, category, productDescription, JSON.stringify(productImages), 'Active'], (err, result) => {
        if (err) {
            console.error("Error adding product:", err);
            return res.status(500).json({ error: "Failed to add product" });
        }
        const productId = result.insertId;
        const parsedVariants = JSON.parse(variants);
        console.log("Parsed Variants:", parsedVariants); // Log to verify SKU values
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
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: "SKU already exists. Please use a unique SKU." });
                }
                console.error("Error adding variants:", err);
                return res.status(500).json({ error: "Failed to add variants" });
            }
            return res.json({ status: "created", message: "Product added successfully" });
        });
    });
});

app.put('/api/products/:productId', (req, res) => {
    const { productId } = req.params;
    const { status } = req.body;
    const sql = "UPDATE products SET status = ? WHERE id = ?";
    db.query(sql, [status, productId], (err, result) => {
        if (err) {
            console.error("Error updating product status:", err);
            return res.status(500).json({ error: "Failed to update product status" });
        }
        return res.json({ status: "updated", message: "Product status updated successfully" });
    });
});

app.delete('/api/products/:productId', (req, res) => {
    const { productId } = req.params;
    const deleteVariantsSql = "DELETE FROM variants WHERE product_id = ?";
    const deleteProductSql = "DELETE FROM products WHERE id = ?";
    // First, delete the variants associated with the product
    db.query(deleteVariantsSql, [productId], (err, variantResult) => {
        if (err) {
            console.error("Error deleting variants:", err.stack);
            return res.status(500).json({ status: "error", message: "Failed to delete variants" });
        }
        // Then, delete the product itself
        db.query(deleteProductSql, [productId], (err, productResult) => {
            if (err) {
                console.error("Error deleting product:", err.stack);
                return res.status(500).json({ status: "error", message: "Failed to delete product" });
            }
            if (productResult.affectedRows > 0) {
                res.json({ status: "deleted", message: "Product and variants deleted successfully" });
            } else {
                res.status(404).json({ status: "error", message: "Product not found" });
            }
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

// Fetch a single product by ID
app.get('/api/products/:productId', (req, res) => {
    const userId = req.query.userId;
    const productId = req.params.productId;
    const sql = `
        SELECT p.*, v.*
        FROM products p
        LEFT JOIN variants v ON p.id = v.product_id
        WHERE p.user_id = ? AND p.id = ?
    `;
    db.query(sql, [userId, productId], (err, data) => {
        if (err) {
            console.error("Error fetching product details:", err);
            return res.status(500).json({ error: "Database error" });
        }
        // Check if any data was found
        if (data.length === 0) {
            return res.status(404).json({ error: "Product not found" });
        }
        // Group variants by product
        const productsMap = {};
        data.forEach(row => {
            if (!productsMap[row.id]) {
                productsMap[row.id] = {
                    id: row.id,
                    user_id: row.user_id,
                    product_name: row.product_name,
                    category_name: row.category_name,
                    product_description: row.product_description,
                    product_images: JSON.parse(row.product_images),
                    variants: []
                };
            }
            if (row.variant_name) {
                productsMap[row.id].variants.push({
                    id: row.id,
                    product_id: row.product_id,
                    user_id: row.user_id,
                    variant_name: row.variant_name,
                    size: row.size,
                    crossed_price: row.crossed_price,
                    selling_price: row.selling_price,
                    cost_price: row.cost_price,
                    weight: row.weight,
                    quantity: row.quantity,
                    sku: row.sku
                });
            }
        });
        const product = Object.values(productsMap)[0];
        // Add sizes to each variant
        product.variants.forEach(variant => {
            variant.sizes = [variant.size]; // Convert size to an array
        });
        
        return res.json(product);
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

app.post('/api/sections', upload.any(), async (req, res) => {
    const { userId, type, title, description, link, button1_label, button1_url, button2_label, button2_url, questions, categories, images } = req.body;
    const sectionImages = req.files.map(file => file.filename);

    let sql;
    let values;

    switch (type) {
        case 'Full Image':
            sql = `
                INSERT INTO full_image (user_id, image, link)
                VALUES (?, ?, ?)
            `;
            values = [userId, sectionImages[0], link];
            break;
        case 'Image with Content':
            sql = `
                INSERT INTO image_with_content (user_id, image, title, description, button1_label, button1_url, button2_label, button2_url)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            values = [userId, sectionImages[0], title, description, button1_label, button1_url, button2_label, button2_url];
            break;
        case 'FAQ':
            sql = `
                INSERT INTO faq (user_id, title, questions)
                VALUES (?, ?, ?)
            `;
            values = [userId, title, questions];
            break;
        case 'Category Grid':
            sql = `
                INSERT INTO category_grid (user_id, title, categories)
                VALUES (?, ?, ?)
            `;
            values = [userId, title, categories];
            break;
        case 'Image Slider':
            sql = `
                INSERT INTO image_slider (user_id, images)
                VALUES (?, ?)
            `;
            values = [userId, JSON.stringify(sectionImages)];
            break;
        default:
            return res.status(400).json({ status: "error", message: "Invalid section type" });
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error inserting section:", err);
            return res.status(500).json({ status: "error", message: "Failed to create section" });
        }
        res.json({ status: "created", message: "Section created successfully" });
    });
});

app.put('/api/sections/:id', upload.any(), async (req, res) => {
    const { id } = req.params;
    const { userId, type, title, description, link, button1_label, button1_url, button2_label, button2_url, questions, categories, images } = req.body;
    const sectionImages = req.files.map(file => file.filename);

    let sql;
    let values;

    switch (type) {
        case 'Full Image':
            sql = `
                UPDATE full_image
                SET user_id = ?, image = ?, link = ?
                WHERE id = ?
            `;
            values = [userId, sectionImages[0] || req.body.image, link, id];
            break;
        case 'Image with Content':
            sql = `
                UPDATE image_with_content
                SET user_id = ?, image = ?, title = ?, description = ?, button1_label = ?, button1_url = ?, button2_label = ?, button2_url = ?
                WHERE id = ?
            `;
            values = [userId, sectionImages[0] || req.body.image, title, description, button1_label, button1_url, button2_label, button2_url, id];
            break;
        case 'FAQ':
            sql = `
                UPDATE faq
                SET user_id = ?, title = ?, questions = ?
                WHERE id = ?
            `;
            values = [userId, title, questions, id];
            break;
        case 'Category Grid':
            sql = `
                UPDATE category_grid
                SET user_id = ?, title = ?, categories = ?
                WHERE id = ?
            `;
            values = [userId, title, categories, id];
            break;
        case 'Image Slider':
            sql = `
                UPDATE image_slider
                SET user_id = ?, images = ?
                WHERE id = ?
            `;
            values = [userId, JSON.stringify(sectionImages) || req.body.images, id];
            break;
        default:
            return res.status(400).json({ status: "error", message: "Invalid section type" });
    }

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error updating section:", err);
            return res.status(500).json({ status: "error", message: "Failed to update section" });
        }
        res.json({ status: "updated", message: "Section updated successfully" });
    });
});

app.delete('/api/sections/:id', (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;

    const sql = `
        DELETE FROM full_image WHERE id = ? AND user_id = ?
        UNION ALL
        DELETE FROM image_with_content WHERE id = ? AND user_id = ?
        UNION ALL
        DELETE FROM faq WHERE id = ? AND user_id = ?
        UNION ALL
        DELETE FROM category_grid WHERE id = ? AND user_id = ?
        UNION ALL
        DELETE FROM image_slider WHERE id = ? AND user_id = ?
    `;
    const values = [id, userId, id, userId, id, userId, id, userId, id, userId];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Error deleting section:", err);
            return res.status(500).json({ status: "error", message: "Failed to delete section" });
        }
        if (result.affectedRows > 0) {
            res.json({ status: "deleted", message: "Section deleted successfully" });
        } else {
            res.status(404).json({ status: "error", message: "Section not found" });
        }
    });
});

app.get('/api/sections/:userId', (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT id, type, user_id, image, title, description, link, button1_label, button1_url, button2_label, button2_url, questions, categories, images
        FROM (
            SELECT id, 'Full Image' AS type, user_id, image, NULL AS title, NULL AS description, link, NULL AS button1_label, NULL AS button1_url, NULL AS button2_label, NULL AS button2_url, NULL AS questions, NULL AS categories, NULL AS images FROM full_image
            UNION ALL
            SELECT id, 'Image with Content' AS type, user_id, image, title, description, NULL AS link, button1_label, button1_url, button2_label, button2_url, NULL AS questions, NULL AS categories, NULL AS images FROM image_with_content
            UNION ALL
            SELECT id, 'FAQ' AS type, user_id, NULL AS image, title, NULL AS description, NULL AS link, NULL AS button1_label, NULL AS button1_url, NULL AS button2_label, NULL AS button2_url, questions, NULL AS categories, NULL AS images FROM faq
            UNION ALL
            SELECT id, 'Category Grid' AS type, user_id, NULL AS image, title, NULL AS description, NULL AS link, NULL AS button1_label, NULL AS button1_url, NULL AS button2_label, NULL AS button2_url, NULL AS questions, categories, NULL AS images FROM category_grid
            UNION ALL
            SELECT id, 'Image Slider' AS type, user_id, NULL AS image, NULL AS title, NULL AS description, NULL AS link, NULL AS button1_label, NULL AS button1_url, NULL AS button2_label, NULL AS button2_url, NULL AS questions, NULL AS categories, images FROM image_slider
        ) AS combined_sections
        WHERE user_id = ?
        ORDER BY id DESC
    `;

    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching sections:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        res.json(data);
    });
});

app.get('/api/categories/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT category_name FROM categories WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching categories:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        res.json(data);
    });
});

// Endpoint to save Khalti keys
app.post('/api/saveKhaltiKeys', (req, res) => {
    const { secretKey, publicKey, userId } = req.body; // Ensure userId is passed in the request body
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const query = `
        INSERT INTO khalti_keys (user_id, secret_key, public_key)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE secret_key = VALUES(secret_key), public_key = VALUES(public_key)
    `;

    db.query(query, [userId, secretKey, publicKey], (err, result) => {
        if (err) {
            console.error('Error saving Khalti keys:', err);
            return res.status(500).json({ message: 'Failed to save Khalti keys' });
        }

        res.status(200).json({ 
            message: 'Khalti keys saved successfully', 
            status: result.affectedRows === 2 ? 'updated' : 'created' 
        });
    });
});

// Endpoint to fetch Khalti keys
app.get('/api/khalti_keys/:userId', (req, res) => {
    const userId = req.params.userId;
    const query = 'SELECT * FROM khalti_keys WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching Khalti keys:', err);
            return res.status(500).json({ message: 'Failed to fetch Khalti keys' });
        }
        if (results.length > 0) {
            res.json(results);
        } else {
            res.json([]);
        }
    });
});

// Endpoint to handle order placement
app.post('/api/orders', (req, res) => {
    const orderDetails = req.body;
    const {
        fullName,
        email,
        phoneNumber,
        orderNote,
        cityDistrict,
        address,
        landmark,
        paymentMethod,
        transactionId,
        transactionAmount,
        transactionState,
        purchaseOrderId,
        totalPrice,
        cartItems,
        userId // Ensure userId is passed in the request body
    } = orderDetails;

    // Ensure cartItems is an array and has product_name
    if (!Array.isArray(cartItems)) {
        return res.status(400).json({ error: 'Invalid cart items format' });
    }

    // Map cartItems to include only necessary fields
    const processedCartItems = cartItems.map(item => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        productName: item.productName,
        sellingPrice: item.sellingPrice,
        crossedPrice: item.crossedPrice,
        variantName: item.variantName,
        size: item.size,
        imageUrl: item.imageUrl
    }));

    const query = `
        INSERT INTO orders (
            user_id, full_name, email, phone_number, order_note, city_district, address, landmark, 
            payment_method, transaction_id, transaction_amount, transaction_state, purchase_order_id, total_price, cart_items
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
        userId, // Include userId in the query
        fullName,
        email,
        phoneNumber,
        orderNote,
        cityDistrict,
        address,
        landmark,
        paymentMethod,
        transactionId || null,
        transactionAmount || null,
        transactionState || null,
        purchaseOrderId,
        totalPrice,
        JSON.stringify(processedCartItems)
    ], (err, result) => {
        if (err) {
            console.error('Error inserting order:', err);
            return res.status(500).json({ error: 'Failed to place the order' });
        }
        res.status(200).json({ message: 'Order placed successfully' });
    });
});

// Update Payment Status
app.put('/api/orders/:id/payment-status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const sql = 'UPDATE orders SET payment_status = ? WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error('Error updating payment status:', err);
        return res.status(500).json({ error: 'Failed to update payment status' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json({ message: 'Payment status updated successfully' });
    });
  });
  
  // Update Order Status
  app.put('/api/orders/:id/order-status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
  
    const sql = 'UPDATE orders SET order_status = ? WHERE id = ?';
    db.query(sql, [status, id], (err, result) => {
      if (err) {
        console.error('Error updating order status:', err);
        return res.status(500).json({ error: 'Failed to update order status' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json({ message: 'Order status updated successfully' });
    });
  });

// Endpoint to handle Khalti payment initiation
app.post('/api/orders/initiate-payment', async (req, res) => {
    const { return_url, website_url, amount, purchase_order_id, purchase_order_name, customer_info, userId } = req.body;
    if (!userId) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    // Fetch Khalti keys from the database
    try {
        const response = await axios.get(`http://localhost:8081/api/khalti_keys/${userId}`);
        if (response.data && response.data.length > 0) {
            const { secret_key, public_key } = response.data[0];
            // Prepare the payment request payload
            const paymentConfig = {
                return_url,
                website_url,
                amount,
                purchase_order_id,
                purchase_order_name,
                customer_info
            };
            // Send payment initiation request to Khalti API
            const khaltiResponse = await axios.post(
                'https://dev.khalti.com/api/v2/epayment/initiate/', // Use 'https://khalti.com/api/v2/epayment/initiate/' for production
                paymentConfig,
                {
                    headers: {
                        'Authorization': `Key ${secret_key}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            // Return the payment URL to the frontend
            res.json({ payment_url: khaltiResponse.data.payment_url });
        } else {
            return res.status(401).json({ message: 'Khalti keys not found for the user' });
        }
    } catch (error) {
        console.error('Error initiating Khalti payment:', error);
        return res.status(500).json({ message: 'Failed to initiate payment' });
    }
});

// Endpoint to handle Khalti callback
app.get('/api/orders/callback', async (req, res) => {
    const {
        status,
        transaction_id,
        amount,
        mobile,
        purchase_order_id,
        purchase_order_name,
        total_amount
    } = req.query;
    if (status === 'Completed') {
        // Lookup the payment to verify
        try {
            const lookupResponse = await axios.post(
                'https://dev.khalti.com/api/v2/epayment/lookup/ ', // Use 'https://khalti.com/api/v2/epayment/lookup/ ' for production
                { pidx: req.query.idx },
                {
                    headers: {
                        'Authorization': 'Key 5b5794044ba94d23914eb0f19ad3ff28', // Use your live secret key for production
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (lookupResponse.data.status === 'Completed') {
                // Extract userId from the session or request context
                // For demonstration, assuming userId is stored in session or can be derived
                const userId = req.session.userId || 1; // Replace with actual user retrieval logic
                // Store the order details in the database
                const orderDetails = {
                    fullName: purchase_order_name, // You might need to map this to the actual customer info
                    email: '', // You might need to map this to the actual customer info
                    phoneNumber: mobile,
                    orderNote: '',
                    cityDistrict: '', // You might need to map this to the actual customer info
                    address: '', // You might need to map this to the actual customer info
                    landmark: '', // You might need to map this to the actual customer info
                    paymentMethod: 'khalti',
                    transactionId: transaction_id,
                    transactionAmount: total_amount / 100,
                    transactionState: status,
                    purchaseOrderId: purchase_order_id,
                    totalPrice: total_amount / 100,
                    cartItems: [], // You might need to map this to the actual cart items
                    userId: userId // Include userId in the order details
                };
                const query = `
                    INSERT INTO orders (
                        user_id, full_name, email, phone_number, order_note, city_district, address, landmark, 
                        payment_method, transaction_id, transaction_amount, transaction_state, purchase_order_id, total_price, cart_items
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `;
                db.query(query, [
                    orderDetails.userId,
                    orderDetails.fullName,
                    orderDetails.email,
                    orderDetails.phoneNumber,
                    orderDetails.orderNote,
                    orderDetails.cityDistrict,
                    orderDetails.address,
                    orderDetails.landmark,
                    orderDetails.paymentMethod,
                    orderDetails.transactionId,
                    orderDetails.transactionAmount,
                    orderDetails.transactionState,
                    orderDetails.purchaseOrderId,
                    orderDetails.totalPrice,
                    JSON.stringify(orderDetails.cartItems)
                ], (err, result) => {
                    if (err) {
                        console.error('Error inserting order:', err);
                        return res.status(500).json({ error: 'Failed to place the order' });
                    }
                    // Redirect the user to the frontend success page
                    res.redirect(`${process.env.FRONTEND_URL}/payment-success?orderId=${result.insertId}`);
                });
            } else {
                res.status(400).send('Payment verification failed');
            }
        } catch (error) {
            console.error('Error initiating Khalti payment:', error);
            res.status(500).send('Failed to initiate payment');
        }
    } else {
        res.status(400).send('Payment failed');
    }
});

// Endpoint to get orders for a specific user
app.get('/api/orders/user/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { search, status } = req.query;

    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const values = [userId];

    if (search) {
        query += ' AND full_name LIKE ?';
        values.push(`%${search}%`);
    }

    if (status) {
        query += ' AND payment_status = ?';
        values.push(status);
    }

    db.query(query, values, (err, data) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data);
    });
});

app.delete('/api/orders/:id', (req, res) => {
    const sql = "DELETE FROM orders WHERE id = ?";
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Error deleting order:", err);
            return res.status(500).json({ status: "error", message: "Failed to delete order" });
        }
        return res.json({ status: "deleted", message: "Order deleted successfully" });
    });
});

// Endpoint to update inventory based on scanned SKUs
app.post('/api/updateInventory', (req, res) => {
    const { scannedSkus } = req.body;
    if (!scannedSkus || typeof scannedSkus !== 'object') {
        return res.status(400).json({ status: "error", message: "Invalid scanned SKUs" });
    }

    const updatePromises = Object.entries(scannedSkus).map(([sku, quantity]) => {
        return new Promise((resolve, reject) => {
            const sql = `
                UPDATE variants
                SET quantity = quantity + ?
                WHERE sku = ?
            `;
            db.query(sql, [quantity, sku], (err, result) => {
                if (err) {
                    console.error("Error updating inventory for SKU:", sku, err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });

    Promise.all(updatePromises)
        .then(() => {
            res.json({ status: "success", message: "Inventory updated successfully" });
        })
        .catch((err) => {
            res.status(500).json({ status: "error", message: "Failed to update inventory", error: err.message });
        });
});

// Endpoint to handle in-store sales
app.post('/api/instore', (req, res) => {
    const orderDetails = req.body;
    const {
        fullName,
        phoneNumber,
        orderNote,
        address,
        paymentMethod,
        productId,
        variantId,
        productName,
        variantName,
        size,
        sellingPrice,
        quantity,
        userId // Ensure userId is passed in the request body
    } = orderDetails;

    // Ensure quantity is a number
    const quantityToSell = parseInt(quantity, 10);
    if (isNaN(quantityToSell) || quantityToSell <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Start a transaction to ensure data integrity
    db.beginTransaction((err) => {
        if (err) {
            console.error('Error starting transaction:', err);
            return res.status(500).json({ error: 'Failed to start transaction' });
        }

        // Insert the in-store sale record
        const insertInstoreQuery = `
            INSERT INTO instore (
                user_id, full_name, phone_number, order_note, address, payment_method, 
                product_id, variant_id, product_name, variant_name, size, selling_price, quantity
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertInstoreQuery, [
            userId,
            fullName,
            phoneNumber,
            orderNote,
            address,
            paymentMethod,
            productId,
            variantId,
            productName,
            variantName,
            size,
            sellingPrice,
            quantityToSell
        ], (insertErr, insertResult) => {
            if (insertErr) {
                console.error('Error inserting in-store sale:', insertErr);
                return db.rollback(() => {
                    res.status(500).json({ error: 'Failed to insert in-store sale' });
                });
            }

            // Decrease the inventory of the selected product variant by the sold quantity
            const updateInventoryQuery = `
                UPDATE variants
                SET quantity = quantity - ?
                WHERE id = ?
            `;
            db.query(updateInventoryQuery, [quantityToSell, variantId], (updateErr, updateResult) => {
                if (updateErr) {
                    console.error('Error updating inventory:', updateErr);
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Failed to update inventory' });
                    });
                }

                // Commit the transaction
                db.commit((commitErr) => {
                    if (commitErr) {
                        console.error('Error committing transaction:', commitErr);
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Failed to commit transaction' });
                        });
                    }

                    res.status(200).json({ message: 'In-store sale recorded successfully' });
                });
            });
        });
    });
});

// Endpoint to fetch in-store sales for a specific user
app.get('/api/instore/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = "SELECT * FROM instore WHERE user_id = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error('Error fetching in-store sales:', err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data);
    });
});

// Endpoint to fetch settlement records for a specific date
app.get('/api/settlement', (req, res) => {
    const date = req.query.date;
    if (!date) {
        return res.status(400).json({ status: "error", message: "Date parameter is required" });
    }
    const startOfDay = new Date(date);
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);
    const sql = `
        SELECT 
            full_name, 
            address, 
            order_note, 
            payment_method, 
            phone_number, 
            product_name, 
            variant_name, 
            size
        FROM instore
        WHERE created_at >= ? AND created_at < ?
        UNION ALL
        SELECT 
            full_name, 
            address, 
            order_note, 
            payment_method, 
            phone_number, 
            JSON_UNQUOTE(JSON_EXTRACT(cart_items, '$[0].productName')) AS product_name, 
            JSON_UNQUOTE(JSON_EXTRACT(cart_items, '$[0].variantName')) AS variant_name, 
            JSON_UNQUOTE(JSON_EXTRACT(cart_items, '$[0].size')) AS size
        FROM orders
        WHERE created_at >= ? AND created_at < ?
    `;
    db.query(sql, [startOfDay, endOfDay, startOfDay, endOfDay], (err, data) => {
        if (err) {
            console.error("Error fetching settlement records:", err);
            return res.status(500).json({ status: "error", message: "Database error", details: err.message });
        }
        console.log("Settlement records fetched successfully:", data); // Debugging line
        return res.json(data);
    });
});

// New endpoint to create staff account
app.post('/api/createStaff', (req, res) => {
    const { name, email, password, createdBy } = req.body;
    const role = 'staff'; // Role is always 'staff' for this endpoint
    const sql = "INSERT INTO users (`name`, `email`, `password`, `role`, `created_by`) VALUES (?, ?, ?, ?, ?)";
    const values = [name, email, password, role, createdBy];
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error("Error creating staff account:", err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ status: "error", message: "Email already exists. Please use a different email." });
            }
            return res.status(500).json({ status: "error", message: "Server error" });
        }
        return res.json({ status: "created", message: "Staff account created successfully", userId: data.insertId });
    });
});

// New endpoint to list staff accounts
app.get('/api/listStaff', (req, res) => {
    const userId = req.query.userId;
    const sql = "SELECT id, name, email, role FROM users WHERE role = 'staff' AND created_by = ?";
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error fetching staff accounts:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        return res.json(data);
    });
});

// New endpoint to delete staff account
app.delete('/api/deleteStaff/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.query.userId; // Assuming userId is passed as a query parameter
    const sql = "DELETE FROM users WHERE id = ? AND role = 'staff' AND created_by = ?";
    db.query(sql, [id, userId], (err, data) => {
        if (err) {
            console.error("Error deleting staff account:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }
        if (data.affectedRows === 0) {
            return res.status(404).json({ status: "error", message: "Staff account not found or you do not have permission to delete it" });
        }
        return res.json({ status: "deleted", message: "Staff account deleted successfully" });
    });
});

// Forgot Password Route
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;
    console.log("Received forgot-password request for email:", email);

    if (!email) {
        return res.status(400).json({ status: "error", message: "Email is required" });
    }

    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, data) => {
        if (err) {
            console.error("Error checking user:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }

        if (data.length === 0) {
            return res.status(404).json({ status: "error", message: "No user found with that email." });
        }

        const token = crypto.randomBytes(20).toString('hex');
        const tokenExpiry = Date.now() + 3600000;

        const updateSql = "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?";
        db.query(updateSql, [token, tokenExpiry, email], (updateErr) => {
            if (updateErr) {
                console.error("Error updating user with reset token:", updateErr);
                return res.status(500).json({ status: "error", message: "Server error" });
            }

            // Log token to terminal
            console.log("Generated Reset Token:", token);

            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: 'np03cs4a220351@heraldcollege.edu.np',
                    pass: 'yttbtmviookmymlI'
                }
            });

            const mailOptions = {
                from: '"Your Company" <np03cs4a220351@heraldcollege.edu.np>',
                to: email,
                subject: 'Password Reset',
                text: `You requested a password reset.\n\nClick this link to reset your password:\nhttp://localhost:3000/reset-password/${token}\n\nIf you didn't request this, ignore this email.`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending email:', error);
                    return res.status(500).json({ status: "error", message: "Error sending email." });
                }
                console.log('Reset email sent:', info.response);
                res.json({ status: "success", message: "A password reset link has been sent to your email." });
            });
        });
    });
});

app.post('/reset-password/:token', (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    console.log("Received reset-password request with token:", token);

    const sql = "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?";
    db.query(sql, [token, Date.now()], (err, data) => {
        if (err) {
            console.error("Error checking reset token:", err);
            return res.status(500).json({ status: "error", message: "Database error" });
        }

        if (data.length === 0) {
            return res.status(400).json({ status: "error", message: "Invalid or expired token." });
        }

        const user = data[0];
        const updateSql = "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?";
        db.query(updateSql, [password, user.id], (updateErr) => {
            if (updateErr) {
                console.error("Error updating password:", updateErr);
                return res.status(500).json({ status: "error", message: "Server error" });
            }

            res.json({ status: "success", message: "Your password has been updated successfully." });
        });
    });
});

app.get('/test', (req, res) => {
    res.json({ status: "ok", message: "Server is working!" });
});

app.listen(8081, () => {
    console.log("Listening on port 8081");
});