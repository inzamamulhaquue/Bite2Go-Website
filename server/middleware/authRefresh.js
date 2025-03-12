const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/refresh-token', async (req, res) => {
    const oldToken = req.header('Authorization')?.replace('Bearer ', '').trim();

    try {
        const decoded = jwt.decode(oldToken);

        if (!decoded || !decoded.id) {
            return res.status(401).json({ message: 'Invalid expired token' });
        }

        const newToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.setHeader('Authorization', `Bearer ${newToken}`);
        res.json({ token: newToken });
    } catch (error) {
        res.status(401).json({ message: 'Token refresh failed' });
    }
});

module.exports = router;
