const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: { type: String }, // Now optional (Seller only or default)
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['buyer', 'seller', 'customer', 'admin', 'chef'], default: 'buyer' },
    address: { type: String },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chef' }],
    resetOtp: { type: String },
    resetOtpExpiry: { type: Date },
    resetOtpAttempts: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    verificationStatus: { 
        type: String, 
        enum: ['pending', 'approved', 'rejected'], 
        default: 'pending' 
    },
    createdAt: { type: Date, default: Date.now }
});

// Password Hashing & Email Normalization Middleware
userSchema.pre('save', async function () {
    if (this.email) {
        this.email = this.email.toLowerCase();
    }

    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
