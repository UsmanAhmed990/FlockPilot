const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    email: { type: String, required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Feedback', feedbackSchema);
