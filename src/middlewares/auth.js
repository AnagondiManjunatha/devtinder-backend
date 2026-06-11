const jwt = require('jsonwebtoken');
const User = require('../models/user');
const logger = require('../utils/logger');

const userAuth = async (req, res, next) => {
  const token = req.cookies?.token;

  try {
    if (!token) {
      logger.warn('Authorization failed: No token provided', { ip: req.ip });
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedMessage.userId).select('-password -__v');

    if (!user) {
      logger.warn('Authorization failed: User not found', { userId: decodedMessage.userId });
      return res.status(404).json({ error: 'User not found' });
    }
    logger.info('User authorized', { userId: user._id });
    req.user = user;
    next();

  } catch (e) {
    logger.warn('Authorization failed: Invalid token', { error: e.message });
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

module.exports = { userAuth };