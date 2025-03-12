import React from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userAddress, setUserAddress] = useState("");

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
        const storedAddress = localStorage.getItem("userAddress") || "Not Provided";

        setUserId(storedUserId);
        setCartItems(storedCart);
        setUserAddress(storedAddress);

        console.log("User ID:", storedUserId);
        console.log("Cart Items:", storedCart);
        console.log("User Address:", storedAddress);
    }, []);

    const placeOrder = async () => {
        if (!userId) {
            alert("❌ Order failed: User not logged in.");
            return;
        }
        if (cartItems.length === 0) {
            alert("❌ Order failed: No items in cart.");
            return;
        }

        const orderData = {
            userId,
            items: cartItems.map((item) => ({
                productId: item.productId,
                quantity: item.quantity
            })),
            totalAmount: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
            address: userAddress,
            paymentMethod: "COD" // or "Online"
        };
        console.log("Sending Order Data:", orderData);

        try {
            const response = await fetch("http://localhost:5005/api/orders/create", {
                method: "POST",
                body: JSON.stringify(orderData),
                headers: { "Content-Type": "application/json" }
            });

            console.log("Raw Response:", response);

            const data = await response.json();
            console.log("Order API Response:", data); // Debug

            if (data.success) {
                localStorage.removeItem("cart");

                if (orderData.paymentMethod === "COD") {
                    navigate("/order-success");
                } else {
                    navigate("/payment", { state: { orderData } });
                }
            } else {
                alert("❌ Order failed: " + data.message);
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("⚠ Network error. Please try again.");
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            <button onClick={placeOrder} disabled={cartItems.length === 0}>
                Place Order</button>
        </div>
    );
};

export default Checkout;
