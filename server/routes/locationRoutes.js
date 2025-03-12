const express = require('express');
const router = express.Router();

router.post('/',  async(req, res) => {
    const { latitude, longitude, address } = req.body;
    if (!latitude || !longitude || !address) {
        return res.status(400).json({ message: "Missing location data." });
    }

    // console.log("Location Data Received:", { latitude, longitude, address });
    res.status(200).json({ message: "Location data received successfully!" });
});
module.exports = router;
