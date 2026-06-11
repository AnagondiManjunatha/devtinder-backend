const { successResponseHelper } = require('../utils/successResponseHelper');
const validator = require('validator');
const User = require('../models/user');
const logger = require('../utils/logger');

const changePasswordController = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {};
    const userId = req.user._id;
    logger.info('Password change attempt', { userId });

    if (!currentPassword || !newPassword) {
      logger.warn('Password change failed: Missing credentials', { userId });
      return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
    }

    if (!validator.isStrongPassword(newPassword, { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
      logger.warn('Password change failed: Weak password', { userId });
      return res.status(400).json({ error: 'New password must be at least 10 characters long and include uppercase, lowercase, number, and special character.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      logger.error('Password change failed: User not found', { userId });
      throw new Error('User not found');
    }

    const isMatch = await user.isPasswordValid(currentPassword);
    if (!isMatch) {
      logger.warn('Password change failed: Invalid current password', { userId });
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    user.password = await User.passwordHashing(newPassword);
    await user.save();
    logger.info('Password changed successfully', { userId });

    return successResponseHelper(res, 200, 'Password changed successfully');
  } catch (e) {
    if (e.message === 'User not found') {
      logger.error('Password change error: User not found', { error: e.message });
      return res.status(404).json({ error: `Password change failed - ${e.message}` });
    }

    logger.error('Password change error', { error: e.message, userId: req.user?._id });
    return res.status(500).json({ error: e.message || 'Internal Server Error' });
  }
};

module.exports = { changePasswordController };