const express = require('express');
const routers = express.Router();

const { userAuth } = require('../middlewares/auth.middleware');
const   { handleConnectionRequest,handlereviewRequest, getInterestedConnections } = require('../middlewares/connections.middleware');


routers.post('/connections/:status/:receiverId', userAuth, handleConnectionRequest);

routers.get('/getConnectionslist/:senderId', userAuth, getInterestedConnections);

routers.post('/review/:status/:receiverId', userAuth, handlereviewRequest);

     
// routers.post('/:status/:requestId', userAuth, (req, res) => {
//     // Logic to accept a connection request for the authenticated user
//     res.json({ message: `${req.user.firstName} has accepted the connection request` });
// });

// routers.post('/:status/:requestId', userAuth, (req, res) => {
//     // Logic to reject a connection request for the authenticated user
//     res.json({ message: `${req.user.firstName} has rejected the connection request` });
// });

module.exports = routers;