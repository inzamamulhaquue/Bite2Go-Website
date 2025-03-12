const express = require("express");
const router = express.Router();
const Address = require('../models/Address');
const { authMiddleware } = require("../middleware/authMiddleware");

router.use(authMiddleware);


// GET /api/addresses for current user
router.get("/", authMiddleware,  async (req, res) => {
    try {
        const userId = req.user.id;
        const userAddresses = await Address.find({ user: userId });
        console.log("Fetching addresses for user:", userAddresses);
        res.status(200).json({ addresses: userAddresses });
    } catch (err) {
        console.error("Error fetching addresses:", err);
        res.status(500).json({ message: "Server error" });
    }
});


// post api address - save new address for cyrrent user
router.post("/", async (req, res) => {
    try {
        console.log("Received request to add address:", req.body);
        const { houseName, street, locality, city, state, zip } = req.body;

        if (!houseName || !street || !locality || !city || !state || !zip) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const newAddress = new Address({
            user: req.user.id,
            houseName,
            locality,
            street,
            city,
            state,
            zip
        });

        await newAddress.save();
        console.log("Address saved successfully:", newAddress);
        res.status(201).json({ message: "Address saved successfully" });
    } catch (err) {
        console.error("Error saving address:", err);
        res.status(500).json({ message: "Error adding address" });
    }
});

// PUT /api/addresses/:id - Update an existing address
router.put("/:id", async (req, res) => {
    // const { houseName, street, locality, city, state, zip } = req.body;
    const { id } = req.params;

    try {
        const userId = req.user.id;

        // Mark all addresses as non-default first
        await Address.updateMany({ user: userId }, { isDefault: false });

        const updatedAddress = await Address.findOneAndUpdate(
            { _id: id, user: userId },
            { isDefault: true},
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json({ message: "Default Address updated successfully", address: updatedAddress });
    } catch (err) {
        console.error("Error setting default address:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE /api/addresses/:id - Delete an address
router.delete("/:id", async (req, res) => {
    try {
        const deletedAddress = await Address.findOneAndDelete(
            { _id: req.params.id, user: req.user.id });

        if (!deletedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json({ message: "Address deleted successfully" });
    } catch (err) {
        console.error("Error deleting address:", err);
        res.status(500).json({ message: "Server error" });
    }
});


router.get("/default", async (req, res) => {
    try {
        const defaultAddress = await Address.findOne({ user: req.user.id, isDefault: true });

        if (!defaultAddress) {
            return res.status(404).json({ message: "No default address found." });
        }

        res.json({ address: defaultAddress });
    } catch (error) {
        console.error("Error fetching default address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
