const express = require('express');

const routers = express.Router();

const {userAuth } = require('../middlewares/auth');
const { getProfileDataController } = require('../controllers/getProfile');
const { updateValidation } = require('../middlewares/userUpdate');
const { updateController } = require('../controllers/userUpdate');
const { changePasswordController } = require('../controllers/password');


routers.get('/profile/view', userAuth, getProfileDataController);

routers.patch('/profile/edit', userAuth, updateValidation, updateController);

routers.patch('/profile/password/change', userAuth, (req, res) => {
  changePasswordController(req, res);
});

module.exports = routers;