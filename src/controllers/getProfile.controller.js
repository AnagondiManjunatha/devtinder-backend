const { successResponseHelper } = require('../utils/successResponseHelper');

const getProfileDataController = async (req, res) => {
    try {
        const safeUser = req.user?.toObject ? req.user.toObject() : { ...req.user };
        delete safeUser.password;
        return successResponseHelper(res, 200, 'User profile data fetched successfully', safeUser);
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }

}
module.exports = { getProfileDataController };
