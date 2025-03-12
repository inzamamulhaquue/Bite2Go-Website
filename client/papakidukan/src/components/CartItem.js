import React, { useContext } from 'react';
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import CartContext from '../context/CartContext';
import "../styles/CartItem.css";

const CartItem = ({ item }) => {
    const { deleteFromCart, updateCartItem } = useContext(CartContext);

    return (
        <div className="cart-item">
            <img src={item.productId.imageUrl} alt={item.productId.name} className="cart-item-image" />
            <div className="cart-item-details">
                <h4>{item.productId.name}</h4>
                <p>₹{item.productId.price} x {item.quantity}</p>
            </div>

            <div className="cart-item-actions">
                <button onClick={() => updateCartItem(item.productId._id, "decrease")} className="minus-button">
                    <FaMinus />
                </button>
                <span className="quantity">{item.quantity}</span>
                <button onClick={() => updateCartItem(item.productId._id, "increase")} className="plus-button">
                    <FaPlus />
                </button>
                <button onClick={() => deleteFromCart(item.productId._id)} className="delete-button">
                    <FaTrash />
                </button>
            </div>
        </div>
    );
};

export default CartItem;
