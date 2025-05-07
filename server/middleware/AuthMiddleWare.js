const jwt = require('jsonwebtoken');
const User = require('../model/User'); // Assuming this is your User model

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); 
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found.' });
        }

        req.user = { id: user._id, email: user.email }; // Attach the user info to the request
        next();
    } catch (err) {
        console.error('Authentication error:', err);
        res.status(401).json({ message: 'Unauthorized: Invalid token.' });
    }
};

module.exports = authenticate;