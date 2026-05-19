const express = require('express');
const routers = express.Router();

const { userAuth } = require('../middlewares/auth.middleware');
const   { handleConnectionRequest,handlereviewRequest, getInterestedConnections,getPendingRequests,
    getAcceptedConnections } = require('../middlewares/connections.middleware');


routers.post('/send/:receiverId', userAuth, handleConnectionRequest);
routers.post('/review/:connectionId/:status', userAuth, handlereviewRequest);


routers.get('/getConnectionslist/:senderId', userAuth, getInterestedConnections);

routers.get('/getPendingRequests', userAuth, getPendingRequests);

routers.get('/getAcceptedConnections', userAuth, getAcceptedConnections);


     
// routers.post('/:status/:requestId', userAuth, (req, res) => {
//     // Logic to accept a connection request for the authenticated user
//     res.json({ message: `${req.user.firstName} has accepted the connection request` });
// });

// routers.post('/:status/:requestId', userAuth, (req, res) => {
//     // Logic to reject a connection request for the authenticated user
//     res.json({ message: `${req.user.firstName} has rejected the connection request` });
// });

module.exports = routers;