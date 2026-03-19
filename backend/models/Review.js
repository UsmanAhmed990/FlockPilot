const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Or Chef ID
    email: { type: String, required: true },
    comment: { type: String, default: '' },
    rating: { type: Number, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now }
}, { collection: 'feedbacks' }); // Explicitly map to the collection shown in USER's screenshot

module.exports = mongoose.model('Review', reviewSchema);
