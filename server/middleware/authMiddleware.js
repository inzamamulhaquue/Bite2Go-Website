const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.authMiddleware = async (req, res, next) =>{
    const token = req.header('Authorization')?.replace('Bearer ', '').trim();
    console.log("Received Token:", token);

    if (!token) {
        console.log("No token provided");
        return res.status(401).json({ message: 'No token provided' });
    }

    try{ 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded.id) {
            console.log("Token is missing the 'id' field");
            return res.status(401).json({ message: 'Invalid token structure' });
        }
        req.user = await User.findById(decoded.id);

        if (!req.user) {
            console.log("User not found");
            return res.status(401).json({ message: 'Invalid token or user not found' });
        }
        
        console.log("✅ Token verified successfully, User ID:", req.user._id);
        next();

    } catch (err){
        if (err.name === 'TokenExpiredError') {
            console.warn("⚠️ Token expired. Generating a new one...");

           return res.status(401).json({ message: 'Token expired. Please refresh the token.' });
        } else {
            console.error("❌ Token verification failed:", err);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
};