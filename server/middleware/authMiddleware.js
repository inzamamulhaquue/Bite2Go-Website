const jwt = require('jsonwebtoken');
const User = require('../models/User');


exports.authMiddleware = async (req, res, next) =>{
    const token = req.header('Authorization')?.replace('Bearer', '');

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try{ 
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err){
        res.status(401).json({ message: 'Invalid token' });
    }
};