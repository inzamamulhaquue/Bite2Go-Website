const jwt = require("jsonwebtoken");

function isAdmin(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        // Check if the user is an admin
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'You are not authorized to access this route' });
        }

        req.user = decoded;
        next();
    });
}

module.exports = isAdmin;