import React, { useContext } from 'react';
import { FaPlus, FaMinus } from "react-icons/fa";
import "../styles/ProductCard.css";
import CartContext from '../context/CartContext';

const ProductCard = ({ product }) => {
     const { addToCart, removeFromCart, cart } = useContext(CartContext);
     if (!product) return null;
    
    // const { addToCart, removeFromCart, cart } = useContext(CartContext);
    const quantity = cart?.items?.find(item => item.productId === product._id)?.quantity || 0;

    const handleAddToCart = () => {
        if (!product._id) {
            console.error("Product ID is missing:", product);
            return;
        }
        addToCart(product);
    };

    const handleRemoveFromCart = () => {
        removeFromCart(product);
    };

    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} style={{ width: "100px", height: "100px" }} />
            <h3 className="product-name">{product.name}</h3>
            <p className="product-quantity"> Quantity -- {product.quantity}</p>   
            <p className="product-price">₹{product.price}</p>

            <div className="cart-actions">
                {quantity > 0 ? (
                    <div className="counter-container">
                        <button onClick={handleRemoveFromCart} className="remove-button">
                            <FaMinus />
                        </button>
                        <span className="quantity">{quantity}</span>
                        <button onClick={handleAddToCart} className="add-button">
                            <FaPlus />
                        </button>
                    </div>
                ) : (
                    <button onClick={() => handleAddToCart(product)}>
                        Add to Cart
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
