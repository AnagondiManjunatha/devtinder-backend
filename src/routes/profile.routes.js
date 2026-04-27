const express = require('express');

const routers = express.Router();

const {userAuth } = require('../middlewares/auth.middleware');
const { getProfileDataController } = require('../controllers/getProfile.controller');
const { updateValidation } = require('../middlewares/userUpdate.middleware');
const { updateController } = require('../controllers/userUpdate.controller');
const { changePasswordController } = require('../controllers/password.controller');


routers.get('/profile/view', userAuth, getProfileDataController);

routers.patch('/profile/edit', userAuth, updateValidation, updateController);

routers.patch('/profile/password/change', userAuth, (req, res) => {
  // Logic to change user's password
  // res.json({ message: `${req.user.firstName} has changed their password` });
  changePasswordController(req, res);
});


routers.get('/connection-requests', userAuth, (req, res) => {
  // Logic to fetch connection requests for the authenticated user
  res.json({ message: `${req.user.firstName} has sent a connection request` });
});

module.exports = routers;