const OrderModel = require("../models/OrderModel");

exports.createOrder = async (req, res) => {
    const { userId, items, paymentMethod, address } = req.body;

    console.log("Received Order Data:", req.body);

    if (!userId || !items || items.length === 0 || !address) {
        console.log("❌ Missing data fields");
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // ✅ Correct totalAmount calculation
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Calculate delivery fee and offer discount
    let deliveryFee = totalAmount >= 500 ? 0 : 50;
    let offerDiscount = totalAmount >= 500 ? totalAmount * 0.10 : 0;

    const toPay = totalAmount + deliveryFee - offerDiscount;

    try {
        const newOrder = new OrderModel({
            userId,
            items,
            totalAmount,
            offerDiscount,
            deliveryFee,
            toPay,
            paymentMethod,
            status: paymentMethod === "COD" ? "Processing" : "Pending",
            address,
        });

        await newOrder.save();

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            order: newOrder,
        });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Order creation failed. Please try again." });
    } finally {
        console.log("✅ Order creation attempt finished.");
    }
};

exports.getUserOrders = async (req, res) => {
    const { userId } = req.params;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required." });
    }

    try {
        const orders = await OrderModel.find({ userId })
            .populate("items.productId", "name price")
            .sort({ createdAt: -1 });

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found." });
        }

        // ✅ Correct totalAmount calculation
        const updatedOrders = orders.map((order) => {
            const totalAmount = order.items.reduce(
                (sum, item) => sum + (item.productId.price * item.quantity),
                0
            );

            const deliveryFee = totalAmount >= 500 ? 0 : 50;
            const offerDiscount = totalAmount >= 500 ? totalAmount * 0.10 : 0;
            const toPay = totalAmount + deliveryFee - offerDiscount;

            return {
                ...order.toObject(),
                totalAmount,
                deliveryFee,
                offerDiscount,
                toPay,
            };
        });

        res.json({ orders: updatedOrders });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Error retrieving orders. Please try again." });
    } finally {
        console.log("✅ Orders retrieval attempt finished.");
    }
};




exports.getOrderById = async (req, res) => {
    const { orderId } = req.params;

    try {
        const order = await OrderModel.findById(orderId).populate("items.productId", "name price");

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        res.json({ order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ message: "Failed to retrieve order details." });
    } finally {
        console.log(`✅ Order retrieval attempt finished for Order ID: ${orderId}`);
    }
};
