const express = require('express');
const routers = express.Router();

const { validateSignup } = require('../middlewares/signup');
const { loginValidation } = require('../middlewares/login');

const { signupController } = require('../controllers/signup');
const { loginController } = require('../controllers/login');
const { logout } = require('../middlewares/logout');


// Authentication Routes
routers.post('/signup', validateSignup, signupController);

routers.post('/login', loginValidation, loginController);

routers.post('/logout', logout);

module.exports = routers;