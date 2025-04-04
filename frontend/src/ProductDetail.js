import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './ProductDetail.css';

function ProductDetail() {
    const [product, setProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [quantity, setQuantity] = useState(1);

    // Get productId from URL params
    const { productId } = useParams();
    const userId = localStorage.getItem('userId'); // Assume userId is stored in localStorage

    // Fetch product details based on productId
    useEffect(() => {
        if (productId && userId) {
            axios.get(`http://localhost:8081/api/products/${productId}?userId=${userId}`)
                .then(response => {
                    setProduct(response.data);
                })
                .catch(error => {
                    console.error("Error fetching product details:", error);
                });
        }
    }, [productId, userId]);

    // Handle variant selection
    const handleVariantChange = (variantId) => {
        const selected = product.variants.find(variant => variant.id === variantId);
        setSelectedVariant(selected);
    };

    // Handle quantity change
    const handleQuantityChange = (action) => {
        if (action === 'increment') {
            setQuantity(quantity + 1);
        } else if (action === 'decrement') {
            setQuantity(Math.max(1, quantity - 1)); // Ensure quantity doesn't go below 1
        }
    };

    // Add to Cart functionality
    const addToCart = () => {
        if (!selectedVariant) {
            alert("Please select a variant.");
            return;
        }

        const cartItem = {
            productId: product.id,
            variantId: selectedVariant.id,
            quantity,
            productName: product.product_name,
            sellingPrice: selectedVariant.selling_price,
            crossedPrice: selectedVariant.crossed_price,
            variantName: selectedVariant.variant_name,
            size: selectedVariant.size,
            imageUrl: product.product_images[0], // Main image
        };

        // Simulate adding to cart (you can replace this with actual cart logic)
        console.log("Adding to cart:", cartItem);
        alert("Added to cart!");
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div className="product-detail-container">
            {/* Product Image */}
            <div className="product-image">
                <img src={`/uploads/${product.product_images[0]}`} alt={product.product_name} />
            </div>

            {/* Product Info */}
            <div className="product-info">
                <h1>{product.product_name}</h1>
                <div className="price-container">
                    <p className="crossed-price">Rs {product.variants[0].crossed_price}</p>
                    <p className="selling-price">Rs {product.variants[0].selling_price}</p>
                    <span className="discount-badge">20% OFF</span>
                </div>
                <p>Shipping is calculated at checkout</p>

                {/* Variant Selection */}
                <div className="variant-selector">
                    <label>Choose Variant</label>
                    <select
                        value={selectedVariant?.id || ''}
                        onChange={(e) => handleVariantChange(e.target.value)}
                    >
                        <option value="">Select a variant</option>
                        {product.variants.map(variant => (
                            <option key={variant.id} value={variant.id}>
                                {variant.variant_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Size Selection */}
                <div className="size-selector">
                    <label>Choose Size</label>
                    <select
                        value={selectedVariant?.size || ''}
                        disabled={!selectedVariant}
                    >
                        <option value="">Select a size</option>
                        {product.variants.map(variant => (
                            <option key={variant.id} value={variant.size}>
                                {variant.size}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quantity Selector */}
                <div className="quantity-selector">
                    <button onClick={() => handleQuantityChange('decrement')}>-</button>
                    <input type="number" value={quantity} readOnly />
                    <button onClick={() => handleQuantityChange('increment')}>+</button>
                </div>

                {/* Add to Cart Button */}
                <button className="add-to-cart" onClick={addToCart}>
                    ADD TO CART
                </button>
            </div>

            {/* Description */}
            <div className="description">
                <h2>Description</h2>
                <p>{product.product_description}</p>
            </div>
        </div>
    );
}

export default ProductDetail;