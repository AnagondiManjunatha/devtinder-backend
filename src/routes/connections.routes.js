const express = require('express');
const routers = express.Router();

const { userAuth } = require('../middlewares/auth.middleware');
const   { handleConnectionRequest } = require('../middlewares/connections.middleware');

routers.post('/:status/:receiverId', userAuth, handleConnectionRequest);

     
// routers.post('/:status/:requestId', userAuth, (req, res) => {
//     // Logic to accept a connection request for the authenticated user
//     res.json({ message: `${req.user.firstName} has accepted the connection request` });
// });

// routers.post('/:status/:requestId', userAuth, (req, res) => {
//     // Logic to reject a connection request for the authenticated user
//     res.json({ message: `${req.user.firstName} has rejected the connection request` });
// });

module.exports = routers;