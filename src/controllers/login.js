const { successResponseHelper } = require('../utils/successResponseHelper');
const User = require('../models/user');
const logger = require('../utils/logger');

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    logger.info('Login attempt', { email });

    if (!email || !password) {
      logger.warn('Login failed: Missing credentials', { email });
      throw new Error('Email and password are required');
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      logger.warn('Login failed: User not found', { email });
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await existingUser.isPasswordValid(password);
    if (!isPasswordValid) {
      logger.warn('Login failed: Invalid password', { email });
      throw new Error('Invalid credentials');
    }

    const token = await existingUser.getJWT();
    res.cookie('token', token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    const safeUser = {
      id: existingUser._id,
      firstName: existingUser.firstName,
      lastName: existingUser.lastName,
      email: existingUser.email,
      roles: existingUser.roles
    };

    logger.info('User logged in successfully', { userId: existingUser._id, email });
    return successResponseHelper(res, 200, 'User logged in successfully', safeUser);
  } catch (e) {
    logger.error('Login error', { error: e.message, email: req.body?.email });
    return res.status(400).json({ error: e.message });
  }
};

module.exports = { loginController };
