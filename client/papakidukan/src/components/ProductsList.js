import React, { useEffect, useState, useMemo, useRef  } from 'react';
import ProductCard from './ProductCard';
import { fetchProducts } from "../services/productService";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const loadProducts = async () => {
      try{
      const data = await fetchProducts();
        console.log("Fetched products:", data);
      setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!searchTerm.trim()) return products;
    return products.filter((product) =>
      product.category?.toLowerCase().includes(searchTerm.trim().toLowerCase())
    );
  }, [products, searchTerm]);

  // Handle Enter key press remove all words
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setSearchTerm("");
      inputRef.current.blur();
    }
  };

  return (
    <div>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search by category (e.g., Fruits)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyDown={handleKeyDown} // Detect Enter key
        className="search-bar"
      />
      <div className="product-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>No products found</p>
        )};
    </div>
    </div>
  );
};

export default ProductsList;
