const Connection = require('../models/connection.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');


/**
 * 🔹 Send Connection Request (Interested / Ignored)
 */
const handleConnectionRequest = async (req, res) => {

    try {

        const senderId = req.user._id;
        const { receiverId } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid receiverId'
            });
        }

        // Prevent self request
        if (senderId.toString() === receiverId) {
            return res.status(400).json({
                success: false,
                message: 'You cannot connect with yourself'
            });
        }

        // Check receiver exists
        const receiverUser = await User.findById(receiverId);

        if (!receiverUser) {
            return res.status(404).json({
                success: false,
                message: 'Receiver user not found'
            });
        }
// Validate status
        // Prevent duplicate request
        const existingConnection = await Connection.findOne({
            $or: [
                {
                    senderId,
                    receiverId
                },
                {
                    senderId: receiverId,
                    receiverId: senderId
                }
            ]
        });

        if (existingConnection) {
            return res.status(400).json({
                success: false,
                message: 'Connection already exists'
            });
        }

        // Create request
        const connection = await Connection.create({
            senderId,
            receiverId,
            status: 'pending'
        });

        return res.status(201).json({
            success: true,
            message: `${req.user.firstName} has sent a connection request`,
            data: connection
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

 /**
  * 🔹 Review Connection Request (Accept / Reject / Ignore)
 */
const handlereviewRequest = async (req, res) => {

    try {

        const loggedInUserId = req.user._id;

        const { connectionId, status } = req.params;

        // Allowed status
        const allowedStatus = ['accepted', 'rejected'];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        // Validate connectionId
        if (!mongoose.Types.ObjectId.isValid(connectionId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid connectionId'
            });
        }

        // Find request only for logged-in user
        const connection = await Connection.findOne({
            _id: connectionId,
            receiverId: loggedInUserId,
            status: 'pending'
        });

        if (!connection) {
            return res.status(404).json({
                success: false,
                message: 'Connection request not found'
            });
        }

        // Update status
        connection.status = status;

        await connection.save();

        return res.status(200).json({
            success: true,
            message: `Connection ${status} successfully`,
            data: connection
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};












const getInterestedConnections = async (req, res) => {

    try {

        const senderId = req.user._id;

        // ✅ Validate senderId
        if (!mongoose.Types.ObjectId.isValid(senderId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid senderId'
            });
        }

        // ✅ Fetch interested connections
        const connections = await Connection.find({
            senderId,
            status: 'interested'
        })
        .populate(
            'receiverId',
            'firstName lastName email profilePic'
        );

        return res.status(200).json({
            success: true,
            count: connections.length,
            data: connections
        });

    } catch (error) {

        console.error('Get Interested Connections Error:', error);

        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};


const getPendingRequests = async (req, res) => {

    try {

        const loggedInUserId = req.user._id;

        const requests = await Connection.find({
            receiverId: loggedInUserId,
            status: 'pending'
        })
        .populate('senderId', 'firstName lastName email');

        return res.status(200).json({
            success: true,
            count: requests.length,
            data: requests
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getAcceptedConnections = async (req, res) => {

    try {

        const loggedInUserId = req.user._id;

        const connections = await Connection.find({
            $or: [
                { senderId: loggedInUserId },
                { receiverId: loggedInUserId }
            ],
            status: 'accepted'
        })
        .populate('senderId', 'firstName lastName')
        .populate('receiverId', 'firstName lastName');

        return res.status(200).json({
            success: true,
            data: connections
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};



module.exports = {
    handleConnectionRequest,
    handlereviewRequest,
    getInterestedConnections,
    getPendingRequests,
    getAcceptedConnections
};