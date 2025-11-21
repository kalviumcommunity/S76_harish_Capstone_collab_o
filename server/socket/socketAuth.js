/**
 * Socket Authentication Middleware
 * Handles JWT verification for socket connections
 */

const jwt = require('jsonwebtoken');
const User = require('../model/User');

/**
 * Authenticate socket connection using JWT token
 * @param {Socket} socket - Socket.io socket instance
 * @param {Function} next - Next middleware function
 */
const socketAuthMiddleware = async (socket, next) => {
  try {
    // Extract token from handshake auth or headers
    const token =
      socket.handshake.auth?.token ||
      (socket.handshake.headers?.authorization || '').replace('Bearer ', '');

    console.log('[Socket Auth] Connection attempt from:', socket.handshake.address);
    console.log('[Socket Auth] Token present:', !!token);

    if (!token) {
      console.error('[Socket Auth] No token provided');
      return next(new Error('Unauthorized: No token provided'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('[Socket Auth] Token decoded for user ID:', decoded.id);
    
    // Find user in database
    const user = await User.findById(decoded.id).select('_id email username');
    
    if (!user) {
      console.error('[Socket Auth] User not found in database:', decoded.id);
      return next(new Error('Unauthorized: User not found'));
    }

    // Attach user info to socket for later use
    socket.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username || user.email,
    };

    console.log('[Socket Auth] Authentication successful for:', socket.user.username);
    next();
  } catch (err) {
    console.error('[Socket Auth] Authentication failed:', err.message);
    if (err.name === 'JsonWebTokenError') {
      next(new Error('Unauthorized: Invalid token'));
    } else if (err.name === 'TokenExpiredError') {
      next(new Error('Unauthorized: Token expired'));
    } else {
      next(new Error('Unauthorized: Invalid or expired token'));
    }
  }
};

module.exports = socketAuthMiddleware;
