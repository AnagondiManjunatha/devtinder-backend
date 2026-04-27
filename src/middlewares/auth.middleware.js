const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const userAuth = async (req, res, next) => {
  const token = req.cookies?.token;

  try {
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const decodedMessage = jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret key
    const user = await User.findById(decodedMessage.userId).select('-password -__v');// Exclude password from the response

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Attach user to request
    req.user = user;
    next();

  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

module.exports = { userAuth };