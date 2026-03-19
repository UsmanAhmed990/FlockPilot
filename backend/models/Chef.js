const mongoose = require('mongoose');

const chefSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bio: String,
    specialties: [String],
    isApproved: { type: Boolean, default: false }, // Admin approval
    image: String, // Profile image URL
    earnings: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chef', chefSchema);
