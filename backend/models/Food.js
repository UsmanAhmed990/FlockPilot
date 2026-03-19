const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [String],
    category: { type: String, required: true }, // e.g., 'Breakfast', 'Lunch', 'Dinner'
    dietType: { type: String, enum: ['Regular', 'Keto', 'Diabetic', 'Vegan', 'Desi'], default: 'Regular' },
    available: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Food', foodSchema);
