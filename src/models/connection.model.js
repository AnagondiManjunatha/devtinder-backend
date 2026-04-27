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
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    }
}, 

{ timestamps: true });

connectionSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

connectionSchema.pre('save', function (next) {
      const connections = this;
    console.log('pre-save hook triggered');
    if (connections.senderId.equals(connections.receiverId)) {
        return new Error('Cannot send request to yourself--!');
    }
    // next();
});

const Connection = mongoose.model('ConnectionRequests', connectionSchema);

module.exports = Connection;