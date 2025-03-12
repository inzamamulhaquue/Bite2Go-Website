import React, { useContext, useEffect, useState } from "react";
import "../styles/Home.css";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import LocationSearch from "../components/LocationSearch";
import { useNavigate } from "react-router-dom";
import { LogOut, LogIn, UserCircle } from 'lucide-react';
import AuthContext from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import { fetchProducts } from "../services/productService";
import CartContext from "../context/CartContext";

const Home = () => {
    const [userLocation, setUserLocation] = useState("");
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [cartItems, setCartItems] = useState({});
    const [searchTerm, setSearchTerm] = useState("");


    // Fetch products from backend
    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchProducts();
            setProducts(data);
            setFilteredProducts(data);
            setLoading(false);
        };
        loadProducts();
    }, []);

    // items rotate in search bar every few seconds in placeholder
    const items = ["Banana", "Potato", "Tomato", "Apples", "Milk", "Onions", "Rice", "Ghee", "Ice-Cream", "Coldrink",
        "Apple", "Daal", "Maggie", "Chipps", "Sugar", "VegeTables", "Fruits", "Soap", "Water", "Cake"];
    const [currentItemIndex, setCurrentItemIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        // change the place holder every second
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setCurrentItemIndex((PrvIndex) => (PrvIndex + 1) % items.length);
                setFade(true);
            }, 500);
        }, 1500);
        return () => clearInterval(interval);
    }, [items.length]);

    useEffect(() => {
        let updatedProducts = products;
        if (selectedCategory) {
            updatedProducts = updatedProducts.filter(product =>
                product.category.toLowerCase() === selectedCategory.trim().toLowerCase()
            );
        }
        if (searchTerm.trim() !== "") {
            updatedProducts = updatedProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        setFilteredProducts(updatedProducts);
    }, [selectedCategory, products, searchTerm]);

    const handleProfileClick = () => {
        setDropdownOpen(!dropdownOpen);
    };


    const handleAddToCart = (product) => {
        setCartItems(prevItems => {
            const currentQuantity = prevItems[product._id] || 0;
            if (currentQuantity < 10) { // Max limit is 10
                return {
                    ...prevItems,
                    [product._id]: currentQuantity + 1
                };
            }
            return prevItems;
        });
    };

    const handleRemoveFromCart = (product) => {
        setCartItems(prevItems => {
            const newItems = { ...prevItems };
            if (newItems[product._id] > 1) {
                newItems[product._id] -= 1;
            } else {
                delete newItems[product._id];
            }
            return newItems;
        });
    };


    // refersh every time Bite2Go app
    const handleNavigation = () => {
        if (window.location.pathname === "/") {
            // Force reloading the page
            window.location.reload();
        } else {
            navigate("/");
        }
    };


    return (
        <div className="home-container">
            {/* header likes */}
            <header className="top-nav">
                <h1 className="logo" onClick={handleNavigation} style={{ cursor: "pointer" }}>
                    BiTe2Go
                </h1>


                {/* Location Selection for delivery */}
                <LocationSearch onLocationSelect={setUserLocation} />


                {/* Search Bar always show*/}
                <div className="search-bar">
                    <FaSearch className="icon" />
                    <input
                        type="text"
                        // placeholder="Search for products..."
                        placeholder={searchTerm ? "" : `Search for "${items[currentItemIndex]}"`}
                        className={fade ? "fade-in" : "fade-out"}
                        value ={ searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Login & Cart */}
                <div className="user-actions">
                    {user ? (
                        <div className="profile-container">
                            <button onClick={handleProfileClick} className="profile-button">
                                <UserCircle className="icon" /> {user.name}
                            </button>

                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    <p><strong>{user.name}</strong></p>
                                    <p>{user.phone}</p>
                                    <hr />
                                    <button onClick={() => navigate("/profile")}>Profile</button>
                                    <button onClick={logout}><LogOut className="icon" /> Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <button onClick={() => navigate("/login")} className="login-link">
                            <LogIn className="icon" /> Login
                        </button>
                    )}

                    <a href="/cart" className="cart-link">
                        <FaShoppingCart className="icon" /> Cart ({Object.values(cartItems).reduce((a, b) => a + b, 0)})
                    </a>
                </div>
            </header>

            {/* Hero Section , Immediately Below Header*/}
            <section className="hero">
                <h2>Fresh Groceries Delivered in 10 Minutes .. Like Fresh fruits Chocolate & More</h2>
                <button className="cta-button" onClick={() => navigate('/cart')}>Order Now</button>
            </section>

            <section className="category-section">
                {/* <h2>Shop by Category</h2> */}
                <div className="categories">
                    {['All Items', 'Fruits & Vegetables', 'Dairy Products', 'Grocery & Kitchen', 'Sweets & Chocalate', 'Snaks & Drinks'].map(category => (
                        <button
                            key={category}
                            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category === "All Items" ? "" : category)}

                        >
                            {category}
                        </button>
                    ))}
                </div>
            </section>



            {/* Products Section */}
            <section className="products-section">
                <h2 className="products-title">{selectedCategory ? `${selectedCategory} Products` : 'All Products'}</h2>
                {loading ? (
                    <div className="loading-message">Loading products...</div>
                ) : (
                    <div className="products-grid">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                onAddToCart={handleAddToCart}
                                onRemoveFromCart={handleRemoveFromCart}
                                quantity={cartItems[product._id] || 0}
                            />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;