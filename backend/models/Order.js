const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customerName: { type: String },
    customerEmail: { type: String },
    customerPhone: { type: String },
    isGuest: { type: Boolean, default: false },
    items: [{
        food: { type: String },
        name: { type: String }, // Storing name for history
        quantity: { type: Number, default: 1 },
        price: Number
    }],
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Delivered', 'Cancelled'], default: 'Pending' },
    paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'COD' },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Pending Online Verification', 'BILL PAID ONLINE', 'PAYMENT REJECTED', 'COD'],
        default: 'Pending'
    },
    paymentScreenshot: { type: String }, // Path to local file
    paidAmount: { type: Number },
    paymentVerifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    deliveryAddress: {
        street: String,
        city: String,
        zip: String
    },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    isReviewed: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
