const express = require("express");
const router = express.Router();
const { createOrder, getUserOrders, getOrderById } = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/create", createOrder);
// router.get("/", authMiddleware, getUserOrders);
router.get("/:userId", authMiddleware, getUserOrders);
router.get("/:orderId", authMiddleware, getOrderById);

module.exports = router;
