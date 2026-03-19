const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for platform-wide notifications
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['order_created', 'order_cancelled', 'review', 'feedback', 'system'],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
