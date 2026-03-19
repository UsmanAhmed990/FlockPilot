const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminActionBy: {
        type: String, // Can be admin email or ID
        default: 'System'
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Approval', approvalSchema, 'approvalsSystems');
