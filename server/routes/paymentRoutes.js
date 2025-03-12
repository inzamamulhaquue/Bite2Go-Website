// const express = require("express");
// const Razorpay = require("razorpay");
// const dotenv = require("dotenv");

// dotenv.config();
// const router = express.Router();

// const razorpay = new Razorpay({
//     // key_id: process.env.RAZORPAY_KEY_ID,
//     // key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// // Create Order Route
// router.post("/create-order", async (req, res) => {
//     try {
//         const { amount, currency } = req.body;

//         const options = {
//             amount: amount * 100, // Amount in paisa
//             currency: currency || "INR",
//             receipt: `order_rcptid_${Math.random()}`
//         };

//         const order = await razorpay.orders.create(options);
//         res.json(order);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error creating Razorpay order");
//     }
// });

// module.exports = router;
