const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected','interested', 'ignored'],
        default: 'pending'
    }
}, 

{ timestamps: true });

connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const Connection = mongoose.model('ConnectionRequests', connectionSchema);

module.exports = Connection;