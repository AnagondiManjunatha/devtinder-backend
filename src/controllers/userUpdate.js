const { successResponseHelper } = require('../utils/successResponseHelper');
const validator = require('validator');
const User = require('../models/user');
const logger = require('../utils/logger');
const updateController = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };
    const updatePassword = req.body.password;
    logger.info('User update attempt', { userId, fields: Object.keys(updateData) });

    if (updatePassword) {
      if (!validator.isStrongPassword(updatePassword, { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        logger.warn('User update failed: Weak password', { userId });
        return res.status(400).json({ error: 'Password must be at least 10 characters long and include uppercase, lowercase, number, and special character.' });
      }

      updateData.password = await User.passwordHashing(updatePassword);
    }

    try {
      const existingUser = await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after', runValidators: true }).select('-password');

      if (!existingUser) {
        logger.error('User update failed: User not found', { userId });
        throw new Error('User not found');
      }

      logger.info('User updated successfully', { userId, fields: Object.keys(updateData) });
      return successResponseHelper(res, 200, 'User updated successfully', existingUser);
    } catch (e) {
      logger.error('User update error', { userId, error: e.message });
      return res.status(400).json({ error: `User update failed -${e.message}` });
    }
  } catch (e) {
    logger.error('User update error', { error: e.message, userId: req.user?._id });
    return res.status(400).json({ error: e.message });
  }
};

module.exports = { updateController };
