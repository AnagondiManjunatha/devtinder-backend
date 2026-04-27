const Connection = require('../models/connection.model');
const User = require('../models/user.model');
// const validdator = require('validatordator');
const handleConnectionRequest = async (req, res) => {
    // Logic to handle connection request based on the status (pending, accepted, rejected) 
    // Logic to send a connection request from the authenticated user to the receiver

    try {
        const { status, receiverId } = req.params || {};
        const validStatuses = ['pending', 'accepted', 'rejected']


        // Validate status parameter
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status parameter' });
        }

        const senderId = req.user._id; // Assuming the authenticated user's ID is available in req.user._id
        const receiverObjectId = receiverId; // Convert receiverId to ObjectId if necessary
        const connection = new Connection({
            senderId,
            receiverId: receiverObjectId,
            status
        });

        // Validate that the receiver exists
        const receiverUser = await User.findById(receiverId);
        if (!receiverUser) {
            return res.status(404).json({ error: "Receiver not found" });
        }

        // Prevent users from sending connection requests to themselves
        if (senderId.equals(receiverObjectId)) {
            return res.status(400).json({ error: 'You cannot send a connection request to yourself' });
        }


        // Check if a connection request already exists between the sender and receiver
        const existingConnection = await Connection.findOne({
            $or: [
                { senderId, receiverId: receiverObjectId },
                { senderId: receiverObjectId, receiverId: senderId }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({ error: 'A connection request already exists between these users' });
        }

        await connection.save()
        res.json({ message: `${req.user.firstName} has sent a connection request`, connection });

    } catch (e) {
        res.status(400).json({ error: e.message || 'Internal Server Error' });
    }

};

module.exports = { handleConnectionRequest };