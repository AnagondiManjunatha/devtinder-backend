const Connection = require('../models/connection.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

/**
 * 🔹 Send Connection Request - interested/Ignored
 */
const handleConnectionRequest = async (req, res) => {
    try {
        const { status, receiverId } = req.params;

        const validStatuses = ['interested', 'ignored'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status parameter' });
        }

        // ✅ Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ error: 'Invalid receiverId format' });
        }

        const senderId = req.user._id;

        // ✅ Prevent self request
        if (senderId.toString() === receiverId) {
            return res.status(400).json({error: 'You cannot send a connection request to yourself'});
        }

        // ✅ Check receiver exists
        const receiverUser = await User.findById(receiverId);
        if (!receiverUser) {
            return res.status(404).json({ error: 'Receiver not found' });
        }

        // ✅ Prevent duplicate connection
        const existingConnection = await Connection.findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({error: 'Connection already exists between users' });
        }

        // ✅ Create connection
        const connection = new Connection({
            senderId,
            receiverId,
            status
        });

        await connection.save();

        return res.status(201).json({
            message: `${req.user.firstName} sent a connection request`,
            data: connection
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: error.message || 'Internal Server Error'
        });
    }
};

// intreasted 

/**
 * 🔹 Review Connection Request (Accept / Reject / Ignore)
 */
const handlereviewRequest = async (req, res) => {

    try {

        const { status, receiverId } = req.params;

        const allowedStatus = ['accepted', 'rejected', 'ignored'];

        // Validate status parameter
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Validate receiverId format
        const receiverObjectId = receiverId; // Convert to ObjectId if necessary
        if(!mongoose.Types.ObjectId.isValid(receiverObjectId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid receiverId format'
            });
        }
     
        // Find the connection request with status 'interested' for the given receiverId
        const findingConnection = await Connection.findOne({
            receiverId: receiverObjectId,
            status: 'interested'
        });
        console.log('Finding connection:', findingConnection);

        if (!findingConnection) {
            return res.status(404).json({
                success: false,
                message: 'Connection request not found'
            });
        }

        findingConnection.status = status;
        const connection = await findingConnection.save();

    
        res.status(200).json({
            success: true,
            message: `Connection ${status} successfully`,
            // data: connection
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getInterestedConnections = async (req, res) => {
    try {

        const { senderId } = req.params;
        console.log('Fetching interested connections for senderId:', senderId);

        const connections = await Connection.find({
            senderId: senderId,
            status: 'interested'
        })
        .populate('receiverId'); // fetch receiver user details

        res.status(200).json({
            success: true,
            data: connections
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    handleConnectionRequest,
    handlereviewRequest,
    getInterestedConnections
};