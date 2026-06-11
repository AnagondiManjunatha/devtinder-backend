const { successResponseHelper } = require('../utils/successResponseHelper');
const User = require('../models/user');
const logger = require('../utils/logger');

const signupController = async (req, res) => {
    try {
        const { firstName, lastName, email, password, roles } = req.body || {};
        logger.info('Signup attempt', { email });

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn('Signup failed: Email already exists', { email });
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await User.passwordHashing(password);
        const user = new User({ firstName, lastName, roles, email, password: hashedPassword });
        await user.save();
        logger.info('User registered successfully', { userId: user._id, email });
        const safeUser = user.toObject();
        delete safeUser.password;
        return successResponseHelper(res, 201, 'User registered successfully', safeUser);

    } catch (e) {
        logger.error('Signup error', { error: e.message, email: req.body?.email });
        if (e.code === 11000 || e.message === 'Email already exists') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        return res.status(500).json({ error: e.message || 'Internal Server Error' });
    }
};




module.exports = { signupController };





/**
 //Controller + handle the http requests | Read request data (req.body, req.params, req.query)
const user = await authService.signup(req.body);
return successResponseHelper(res, 201, 'User registered successfully', user);
 */