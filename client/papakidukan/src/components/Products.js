import React, { useEffect, useState } from 'react';
import "../styles/Products.css";

const Products = () => {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');

    // Categories for filtering
    const categories = ['All', 'Fruits & Vegetables', 'Dairy & ', 'Grocery & Kitchen', 'Sweets & Chocalate', 'Snaks & Drinks'];

    // Fetching products when the component mounts
    useEffect(() => {
        fetch('http://localhost:5005/api/products')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(err => console.error('Error fetching products:', err));
    }, []);

    // Handle category change
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
    };

    // Filter products category
    const filteredProducts = selectedCategory === 'All'
        ? products
        : products.filter(product => product.category.trim().toLowerCase().includes(selectedCategory.trim().toLowerCase()));

    return (
        <div>
            <h1>Products</h1>

            {/* Category Buttons */}
            <div className="categories">
                {categories.map(category => (
                    <button key={category} onClick={() => handleCategoryChange(category)}>
                        {category}
                    </button>
                ))}
            </div>

            {/* Product List */}
            <div className="products-list">
                {filteredProducts.map(product => (
                    <div key={product.id} className="product-card">
                        <img src={`http://localhost:5005/uploads/${product.imageUrl}`} alt={product.name} />
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                        <p>Price: ₹{product.price}</p>
                        <p>Category: {product.category}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Products;