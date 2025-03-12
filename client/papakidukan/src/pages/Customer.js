import React, { useState } from "react";
import "../styles/Customer.css";

const Customer = () => {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]);
    const [email, setEmail] = useState("");
    const [emailMessage, setEmailMessage] = useState("");

    const sendMessage = () => {
        if (message.trim() !== "") {
            setChat([...chat, { text: message, sender: "user" }]);
            setMessage("");
            setTimeout(() => {
                setChat([...chat, { text: message, sender: "user" }, { text: "We will get back to you soon!", sender: "support" }]);
            }, 1000);
        }
    };

    const sendEmail = (e) => {
        e.preventDefault();
        alert(`Email Sent successfully!`);
        setEmail("");
        setEmailMessage("");
    };

    return (
        <div className="customer-container">
            <h2>Customer Support</h2>

            <div className="chat-section">
                <h3>Bite2Go Chat Support</h3>
                <div className="chat-box">
                    {chat.map((msg, index) => (
                        <div key={index} className={`chat-message ${msg.sender}`}>
                            {msg.text}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
            </div>

            {/* Email Contact Form */}
            <div className="email-section">
                <h3>Bite2Go Email Support</h3>
                <form onSubmit={sendEmail}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your Email"
                        required
                    />
                    <textarea
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        placeholder="Enter your query"
                        required
                    ></textarea>
                    <button type="submit">Send Email</button>
                </form>
            </div>
        </div>
    );
};

export default Customer;
