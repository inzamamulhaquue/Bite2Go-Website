import React, { useContext, useState, useEffect } from "react";
import CartContext from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LocationSearch from "../components/LocationSearch";
import '../styles/Cart.css';

const Cart = () => {
    const { cart, updateCartItem } = useContext(CartContext);
    const [address, setAddress] = useState("");
    const navigate = useNavigate();
    const [showBreakdown, setShowBreakdown] = useState(false);
    const [showPaymentOptions, setShowPaymentOptions] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState("");

    const userId = localStorage.getItem("userId");

    // Calculate total item price before discount
    // const totalItemPrice = cart?.items?.reduce((sum, item) => {
    //     const itemPrice = Number(item.productId.price || 0);
    //     return sum + item.quantity * itemPrice;
    // }, 0) || 0;

    const totalItemPrice = cart?.items?.reduce((sum, item) => {
        if (!item?.productId || typeof item.productId.price !== "number") {
            return sum;
        }
        return sum + item.quantity * item.productId.price;
    }, 0) || 0;

    let discount = 0;
    let deliveryFee = 45;

    if (totalItemPrice >= 500) {
        discount = totalItemPrice * 0.10;
        deliveryFee = 0;
    }

    // final payable amounty
    const totalPayAmount = (totalItemPrice - discount) + deliveryFee;
    const deliveryTime = Math.floor(Math.random() * (15 - 5) + 6);

    //Ensure Razorpay key is loaded from env
    // const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

    // useEffect(() => {
    //     const script = document.createElement("script");
    //     script.src = "https://checkout.razorpay.com/v1/checkout.js";
    //     script.async = true;
    //     document.body.appendChild(script);
    // }, []);

    // // using razorpay payment methods
    // const handlePayment = async () => {
    //     try {
    //         const response = await axios.post("http://localhost:5000/api/payment/create-order", {
    //             amount: totalPayAmount,
    //             currency: "INR"
    //         });

    //         const { id: order_id, currency, amount } = response.data;

    //         const options = {
    //             key: "your_razorpay_key_id",
    //             amount,
    //             currency,
    //             name: "Bite2Go",
    //             description: "Order Payment",
    //             order_id,
    //             handler: function (response) {
    //                 alert("Payment Successful");
    //                 console.log(response);
    //             },
    //             prefill: {
    //                 name: "Customer Name",
    //                 email: "customer@example.com",
    //                 contact: "9999999999"
    //             }
    //         };

    //         const rzp = new window.Razorpay(options);
    //         rzp.open();
    //     } catch (error) {
    //         console.error("Payment failed:", error);
    //     }
    // };


    useEffect(() => {
        if (!userId) return;

        const fetchAddress = async () => {
            try {
                // const response = await axios.get(`http://localhost:5005/api/user/address/${userId}`);
                const response = await axios.get(`https://bite2go-website.onrender.com/api/user/address/${userId}`);
                
                if (response.data && response.data.address) {
                    setAddress(response.data.address);
                }
            } catch (error) {
                console.error("Error fetching address:", error.response?.data || error.message);
            }
        };
        fetchAddress();
    }, [userId]);

    const handleLocationSelect = (selectedLocation) => {
        setAddress(selectedLocation);
    };

    const handleCheckout = async () => {
        if (!userId) {
            console.log("User not logged in");
            return;
        }

        if (!address) {
            alert("Please select a delivery address.");
            return;
        }
        setShowPaymentOptions(true);
    };

    const handlePaymentMethod = async (method) => {
        setSelectedPayment(method);
        setShowPaymentOptions(false);

        try {
            // const response = await axios.post("http://localhost:5005/api/orders/create", {
            const response = await axios.post("https://bite2go-website.onrender.com/api/orders/create" , {
                userId,
                address,
                paymentMethod: method,
                discount: discount,
                deliveryFee: deliveryFee,
                totalAmount: totalPayAmount,
                items: cart.items.map((item) => ({
                    productId: item.productId._id,
                    name: item.productId.name,
                    quantity: item.quantity,
                    price: item.productId.price
                }))
            
            });
            if (response.data.success) {
                navigate("/order-success");
            } else {
                alert("Order failed. Please try again.");
            }
            // } else {
            // navigate("/payment", { state: { totalPayAmount, paymentMethod: method } });
            // }
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    useEffect(() => {
        const fetchDefaultAddress = async () => {
            if (address) return;
            try {
                const token = localStorage.getItem("token");
                // const response = await axios.get("http://localhost:5005/api/addresses/default", {
                const response = await axios.get("https://bite2go-website.onrender.com/api/addresses/default" , {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.data && response.data.address) {
                    setAddress(response.data.address);
                } else {
                    console.warn("No default address found.");
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    alert("Session expired. Please log in again.");
                    navigate("/login");  // Redirect to login page
                } else {
                    console.error("Error fetching default address:", error);
                    alert("Failed to fetch default address. Please try again.");
                }
            }
        };

        fetchDefaultAddress();
    }, [address]);


    return (
        <div className="cart-container">
            <h1>Shopping Cart</h1>
            {/* {!cart ? ( */}
            {!cart || !cart.items ? (
            <div className="empty-cart">
                <p>Your cart is empty</p>
                <button onClick={() => navigate("/")} className="go-home-button">
                    Go to Products
                </button>
            </div>
        ) : cart.items.length === 0 ? (
            <div className="empty-cart">
                <p>Your cart is empty</p>
                <button onClick={() => navigate("/")} className="go-home-button">
                    Go to Products
                </button>
            </div>
        ) : (
            <>
                    <p className="delivery-time">🚀 Delivery in {deliveryTime} mins</p>

                    {cart.items.map((item) =>
                        item?.productId ? (
                            <div key={item.productId._id}>
                                <p><strong>{item.productId.name}</strong></p>
                                <p>{item.productId.quantityType}</p>
                                <p>₹{(item.productId.price && item.quantity) ? (item.productId.price * item.quantity).toFixed(2) : "0.00"}</p>
                                <div className="quantity-controls">
                                    <button onClick={() => updateCartItem(item.productId._id, "decrease")}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateCartItem(item.productId._id, "increase")} disabled={item.quantity >= 10}
                                        >+</button>
                                </div>
                            </div>
                        ) : null
                    )}

                    <button onClick={() => navigate("/")} className="add-more-button">+ Add More Items</button>

                    <div className="address-section">
                        <h3>Delivery Address</h3>
                        <LocationSearch onLocationSelect={handleLocationSelect} />
                        {/* <p>{address || "No address selected"}</p> */}
                        <p>{address ? `${address.houseName}, ${address.street}, ${address.city}` : "No address selected"}</p>
                    </div>

                    <div className="total-pay">
                        <button
                            onClick={() => setShowBreakdown(!showBreakdown)}
                            className="expand-button"
                        >
                            {showBreakdown ? "Hide" : "Show"} Price Breakdown
                        </button>

                        {showBreakdown && (
                            <div className="price-breakdown">
                                <p>Item Price: ₹{totalItemPrice.toFixed(2)}</p>
                                {totalItemPrice >= 300 && <p>Offer 10% OFF: ₹{discount.toFixed(2)}</p>}
                                <p>Delivery Fee: ₹{deliveryFee.toFixed(2)}</p>
                                <hr />
                                <p><strong>Total Payable: ₹{totalPayAmount.toFixed(2)}</strong></p>
                            </div>
                        )}

                        <h3>To Pay: ₹{totalPayAmount.toFixed(2)}</h3>


                        {/* Conditionally render the checkout button only if an address is selected */}
                        {address && (
                            <button
                                onClick={handleCheckout}
                                disabled={!cart || cart.items.length === 0}
                                className="checkout-button"
                            >
                                Proceed to Payment
                            </button>
                        )}
                    </div>
                </>
            )}

            {showPaymentOptions && (
                <div className="payment-modal">
                    <h2>Select Payment Method</h2>
                    <button className="payment-option" onClick={() => handlePaymentMethod("COD")}>Cash on Delivery</button>
                    <button className="payment-option" onClick={() => handlePaymentMethod("UPI")}>UPI</button>
                    <button className="payment-option" onClick={() => handlePaymentMethod("Card")}>Debit/Credit Card</button>
                    <button className="close-modal" onClick={() => setShowPaymentOptions(false)}>Cancel</button>
                </div>
            )}
        </div>
    );
};

export default Cart;
