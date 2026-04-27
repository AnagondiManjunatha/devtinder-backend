const { successResponseHelper } = require('../utils/successResponseHelper');
const validator = require('validator');
const User = require('../models/user.model');
const updateController = async (req, res) => {
  try {
    // body | params | query
    //   "user":{
    //     "id":"64b8c9e5f1a2c9b1a2c3d4e",
    //     "firstName":"John",
    //     "lastName":"Doe",
    //     "email":"john.doe@example.com"
    //   }
    const userId = req.user._id;
    const updateData = { ...req.body };
    const updatePassword = req.body.password;

    if (updatePassword) {
      // Validate the raw password before hashing.
      if (!validator.isStrongPassword(updatePassword, { minLength: 10, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
        return res.status(400).json({ error: 'Password must be at least 10 characters long and include uppercase, lowercase, number, and special character.' });
      }

      updateData.password = await User.passwordHashing(updatePassword);
    }

    try {
      // updated document & run schema validation
      const existingUser = await User.findByIdAndUpdate(userId, updateData, { returnDocument: 'after', runValidators: true }).select('-password');

      if (!existingUser) {
        throw new Error('User not found');
      }

      return successResponseHelper(res, 200, 'User updated successfully', existingUser);
    } catch (e) {
      return res.status(400).json({ error: `User update failed -${e.message}` });
    }
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
};

module.exports = { updateController };
