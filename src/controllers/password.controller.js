const { successResponseHelper } = require('../utils/successResponseHelper');
const User = require('../models/user.model');

const changePasswordController = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body || {};
        const userId = req.user._id;

        //✔️Business Logic Check (User-friendly error)
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await user.isPasswordValid(currentPassword);
        if (!isMatch) {
            throw new Error('Current password is incorrect');
        }

        const hashedNewPassword = await User.passwordHashing(newPassword);
        user.password = hashedNewPassword;
        await user.save();

        return successResponseHelper(res, 200, 'Password changed successfully');

    } catch (e) {
        if (e.message === 'User not found' || e.message === 'Current password is incorrect') {
            return res.status(400).json({ error: `Password change failed - ${e.message}` });
        }
        res.status(400).json({ error: e.message || 'Internal Server Error' });
    }
};

module.exports = { changePasswordController };