const jwt = require('jsonwebtoken');
const User = require('../model/User');

const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: Token missing or malformed.' });
        }

        const token = authHeader.replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select('_id email');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found.' });
        }

        req.user = { id: user._id, email: user.email }; 
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(401).json({ message: 'Unauthorized: Invalid or expired token.' });
    }
};

module.exports = authenticate;