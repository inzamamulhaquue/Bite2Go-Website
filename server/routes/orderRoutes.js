const express = require("express");
const Order = require("../models/OrderModel");

const router = express.Router();

// Create an order
router.post("/create", async (req, res) => {
    try {
        console.log("Received Order Data:", req.body); // Debugging Log
        const { userId, items, totalAmount, address, paymentMethod } = req.body;

        if (!userId || !items || items.length === 0 || !totalAmount || !address || !paymentMethod) {
            console.log("❌ Missing required fields",  { userId, items, totalAmount, address, paymentMethod }); //debug
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        console.log("✅ Creating order with Payment Method:", paymentMethod); //debug

        const newOrder = new Order({
            userId,
            items,
            totalAmount,
            address,
            paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "Pending" : "Paid",
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: "Order placed successfully", order: newOrder });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;
