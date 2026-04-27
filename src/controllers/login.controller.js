const { successResponseHelper } = require('../utils/successResponseHelper');
const User = require('../models/user.model');
const loginController = async (req, res) => {

    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            throw new Error('Invalid credentials');
        }

        const isPasswordValid = await existingUser.isPasswordValid(password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = await existingUser.getJWT();
        // set token in HTTP-only cookie 1000 × 60 × 60 = 3,600,000 ms = 1 hour
        res.cookie('token', token, { expires: new Date(Date.now() + 3600000), httpOnly: true, secure: true });

        const safeUser = {
            // id: existingUser._id,
            // firstName: existingUser.firstName,
            // lastName: existingUser.lastName,
            // email: existingUser.email,
            // roles: existingUser.roles
        };
        return successResponseHelper(res, 200, 'User logged in successfully');
    } catch (e) {
        return res.status(400).json({ error: e.message });
    }
};

module.exports = { loginController };
