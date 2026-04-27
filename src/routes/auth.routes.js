const express = require('express');
const routers = express.Router();

const { validateSignup } = require('../middlewares/signup.middleware');
const { loginValidation } = require('../middlewares/login.middleware');

const { signupController } = require('../controllers/signup.controller');
const { loginController } = require('../controllers/login.controller');
const { logout } = require('../middlewares/logout.middleware');


// Authentication Routes
routers.post('/signup', validateSignup, signupController);

routers.post('/login', loginValidation, loginController);

routers.post('/logout', logout);

module.exports = routers;