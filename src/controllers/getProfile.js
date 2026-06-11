const { successResponseHelper } = require('../utils/successResponseHelper');
const logger = require('../utils/logger');

const getProfileDataController = async (req, res) => {
    try {
        logger.info('Fetching user profile', { userId: req.user?._id });
        const safeUser = req.user?.toObject ? req.user.toObject() : { ...req.user };
        delete safeUser.password;
        logger.info('User profile fetched successfully', { userId: req.user?._id });
        return successResponseHelper(res, 200, 'User profile data fetched successfully', safeUser);
    } catch (e) {
        logger.error('Error fetching profile', { error: e.message, userId: req.user?._id });
        return res.status(400).json({ error: e.message });
    }

}
module.exports = { getProfileDataController };
