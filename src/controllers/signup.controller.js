const { successResponseHelper } = require('../utils/successResponseHelper');
const User = require('../models/user.model');

const signupController = async (req, res) => {
    try {
        const { firstName, lastName, email, password, roles } = req.body || {};

        //✔️Business Logic Check (User-friendly error)
        const existingUser = await User.findOne({ email }, { returnDocument: 'after' }, { runValidators: true })

        if (existingUser) {
            throw new Error('Email already exists');
        }

        const bycryptpassword = await User.passwordHashing(password);
        const user = new User({ firstName, lastName, roles, email, password: bycryptpassword });
        await user.save();
        const safeUser = user.toObject();
        delete safeUser.password;
        return successResponseHelper(res, 201, 'User registered successfully', safeUser);

    } catch (e) {
        if (e.message === 'Email already exists') {
            return res.status(400).json({ error: `Signup failed - ${e.message}` });
        }
        res.status(400).json({ error: e.message || 'Internal Server Error' });
    }
};




module.exports = { signupController };





/**
 //Controller + handle the http requests | Read request data (req.body, req.params, req.query)
const user = await authService.signup(req.body);
return successResponseHelper(res, 201, 'User registered successfully', user);
 */