const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Ensure the correct path
const mongoose = require('mongoose'); // Import mongoose if needed

// Fetch user address
router.get('/address/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await User.findById(userId).select('address');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ address: user.address });
    } catch (error) {
        console.error("Error fetching address:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
