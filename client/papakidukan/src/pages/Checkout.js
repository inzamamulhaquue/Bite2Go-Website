import React , {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";


const Checkout = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userAddress, setUserAddress] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("COD");

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
                quantity: item.quantity,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
            })),
            totalAmount: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
            address: userAddress,
            paymentMethod,
        };
        console.log("Sending Order Data:", orderData);

        try {
            // const response = await fetch("http://localhost:5005/api/orders/create", {
            const response = await fetch("https://bite2go-website.onrender.com/api/orders/create" , {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();
            console.log("Order API Response:", data);

            if (data.success) {
                localStorage.removeItem("cart");

                if (paymentMethod === "COD") {
                    alert("✅ Order Successful! Redirecting to Orders...");
                    navigate("/profile/orders");
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
            <h2>Checkout</h2>{/* Payment Method Selection */}
            <div className="payment-method">
                <label>
                    <input
                        type="radio"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                    />
                    Cash on Delivery (COD)
                </label>

                <label>
                    <input
                        type="radio"
                        value="UPI"
                        checked={paymentMethod === "UPI"}
                        onChange={() => setPaymentMethod("UPI")}
                    />
                    UPI
                </label>

                <label>
                    <input
                        type="radio"
                        value="Card"
                        checked={paymentMethod === "Card"}
                        onChange={() => setPaymentMethod("Card")}
                    />
                    Debit/Credit Card
                </label>
            </div>

            {/* Order Summary */}
            <div className="order-summary">
                <h3>Order Summary</h3>
                <ul>
                    {cartItems.map((item) => (
                        <li key={item.productId}>
                            {item.name} - {item.quantity} x ₹{item.price}
                        </li>
                    ))}
                </ul>
                <p><strong>Total Amount:</strong> ₹{cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}</p>
            </div>

            {/* Place Order Button */}
            <button onClick={placeOrder} disabled={cartItems.length === 0}>
                Place Order
            </button>
        </div>
    );
};

export default Checkout;
