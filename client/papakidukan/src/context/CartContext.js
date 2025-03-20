import { createContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

const API_URL = "https://bite2go-website-back1.onrender.com/api";

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ items: [], totalAmount: 0 });
    const [userId, setUserId] = useState(null);

    // Fetch user ID dynamically
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    // Fetch cart only when `userId` is available
    useEffect(() => {
        if (userId) {
            fetchCart();
        }
    }, [userId]);

    // Fetch Cart Data
    const fetchCart = async () => {
        if (!userId) return;
        try {
            // const response = await axios.get(`http://localhost:5005/api/cart/${userId}`);
            const response = await axios.get(`${API_URL}/cart/${userId}`);
            setCart(response.data || { items: [], totalAmount: 0});
        } catch (error) {
            console.error("Error fetching cart:", error);
            setCart({ items: [], totalAmount: 0 }); 
        }
    };

    // Add to Cart
    const addToCart = async (product) => {
        if (!userId) {
            console.log("User ID not found. Please log in again");
            return;
        }

        try {
            // const response = await axios.post(`http://localhost:5005/api/cart/add`, {
            const response = await axios.post(`${API_URL}/cart/add`, {
                userId,
                productId: product._id,
                price: product.price
            });

            if (response.data.success) {
                console.log("Item Added Successfully:", response.data);
                fetchCart();
            } else {
                alert(response.data.message || "Failed to add to cart.");
            }
        } catch (error) {
            console.error("Error adding to cart:", error.response?.data || error.message);
            alert(error.response?.data?.error || "Something went wrong!");
        }
    };

    // Update Cart Item
    const updateCartItem = async (productId, action) => {
        if (!userId) {
            console.log("User ID not found. Please log in");
            return;
        }
        try {
            const response = await axios.put("http://localhost:5005/api/cart/update", {
                userId,
                productId,
                action
            });

            if (response.data.success) {
                if (response.data.emptyCart) {
                    setCart({ items: [], totalAmount: 0 });
                } else {
                    await fetchCart();
                }
            } else {
                alert(response.data.message || "Failed to update cart.");
            }
        } catch (error) {
            console.error("Error updating cart:", error.response?.data || error.message);

            if (error.response?.data?.error === 'Maximum limit reached (10 items)') {
                alert("You can only add up to 10 items in the cart.");
            } else {
                alert("Failed to update cart. Please try again.");
            }
        }
    };
    // Delete From Cart
    const deleteFromCart = async (productId) => {
        if (!userId) {
            console.log("User ID not found. Please log in");
            return;
        }

        try {
            const response = await axios.delete(`http://localhost:5005/api/cart/remove`, {
                data: { userId, productId }
            });

            if (response.data.emptyCart) {
                window.location.href = "/"; // Redirect to homepage if cart is empty
            } else {
                setCart(response.data.updatedCart || { items: [], totalAmount: 0 });
            }
        } catch (error) {
            console.error("Error removing cart item:", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, updateCartItem, deleteFromCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;




// import { createContext, useState, useEffect } from "react";
// import axios from "axios";
// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//     const [cart, setCart] = useState({ items: [], totalAmount: 0 });
//     const [userId, setUserId] = useState(null);

//     // fetch user ID dynamically (from localStorage, auth anywhere etc)
//     useEffect(() => {
//         const storedUserId = localStorage.getItem("userId");
//         if (storedUserId) {
//             setUserId(storedUserId);
//         }
//     }, []);

//     // fetch cart only when `userId` is available
//     useEffect(() => {
//         if (userId) {
//             fetchCart();
//         }
//     }, [userId]);



//     const fetchCart = async () => {
//         if (!userId) return;
//         try {
//             const response = await axios.get(`http://localhost:5005/api/cart/${userId}`);
//             setCart(response.data || { items: [], totalAmount: 0 });
//         } catch (error) {
//             console.error("Error fetching cart:", error);
//             setCart({ items: [], totalAmount: 0 });
//         }
//     };

//     const addToCart = async (product) => {
//         const userId = localStorage.getItem("userId");
//         if (!userId) {
//             console.log('User ID not found. Please log in again');
//             return;
//         }
//         try {
//             const response = await axios.post(`http://localhost:5005/api/cart/add`, {
//                 userId: userId,
//                 productId: product._id,
//                 price: product.price
//             });

//             if (response.data.success) {
//                 console.log("Item Added Successfully:", response.data);
//                 fetchCart(); //cart update quickly
//             } else {
//                 alert(response.data.message || "Failed to add to cart.");
//             }
//         } catch (error) {
//             console.error("Error adding to cart:", error.response?.data || error.message);
//             alert(error.response?.data?.error || "Something went wrong!");
//         }
//     };

//     const updateCartItem = async (productId, action) => {
//         if (!userId) {
//             console.log('User ID not found. Please log in');
//             return;
//         }
//         const item = cart.items.find((item) => item?.productId?._id === productId);
//         if (!item || !item.productId) return;
//         let newQuantity = item.quantity;

//         if (action === "increase") {
//             if (newQuantity < 10) {
//                 newQuantity += 1;
//             } else {
//                 alert("Maximum limit reached (10 items)");
//                 return;
//             }
//         } else if (action === "decrease") {
//             if (newQuantity > 1) {
//                 newQuantity -= 1;
//             } else {
//                 await deleteFromCart(productId);
//                 return;
//             }
//         }

//         try {
//             await axios.put("http://localhost:5005/api/cart/update", {
//                 userId,
//                 productId,
//                 action,
//             });

//             fetchCart();
//         } catch (error) {
//             console.error("Error updating cart:", error);
//         }
//     };


//     const deleteFromCart = async (productId) => {
//         if (!userId) {
//             console.log('User ID not found. Please log in');
//             return;
//         }
//         try {
//             const response = await axios.delete(`http://localhost:5005/api/cart/remove`, {
//                 data: { userId, productId }
//             });

//             if (response.data.emptyCart) {
//                 window.location.href = "/"; // Redirect to homepage if cart is empty
//             } else {
//                 fetchCart();
//             }
//             fetchCart();
//         } catch (error) {
//             console.error("Error removing cart item:", error);
//         }
//     };

//     return (
//         <CartContext.Provider value={{ cart, addToCart, updateCartItem, deleteFromCart }}>
//             {children}
//         </CartContext.Provider>
//     );
// };

// export default CartContext;
