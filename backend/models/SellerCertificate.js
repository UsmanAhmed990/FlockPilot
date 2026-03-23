const mongoose = require('mongoose');

const sellerCertificateSchema = new mongoose.Schema({
    sellerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: { type: String, required: true },
    username: { type: String, required: true },
    address: { type: String, required: true },
    certificateUrl: { type: String, required: true }, // Local path like /uploads/certificates/filename
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SellerCertificate', sellerCertificateSchema, 'SellerCertificates');
