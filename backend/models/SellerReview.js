const mongoose = require('mongoose');

const sellerReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    chef: { type: mongoose.Schema.Types.ObjectId, ref: 'Chef', required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    comment: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SellerReview', sellerReviewSchema);
