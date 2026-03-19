const mongoose = require('mongoose');

const adminNotificationSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['signup', 'login', 'product', 'order', 'feedback', 'review'],
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

module.exports = mongoose.model('AdminNotification', adminNotificationSchema);
