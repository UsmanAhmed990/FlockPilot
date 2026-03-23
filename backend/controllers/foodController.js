const Food = require('../models/Food');
const User = require('../models/User');
const { createAdminNotification } = require('./adminNotificationController');

// Add Food Item
exports.addFood = async (req, res) => {
    try {
        const { userId } = req.body; // Frontend can send userId in body as requested
        const user = req.user; // Populated by isAuthenticated middleware

        // 1. Simple Validation (Role must be seller)
        if (user.role !== 'seller' && user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Only sellers can add products.' });
        }

        // 2. Verification Check (Approved by Admin)
        if (user.role === 'seller' && !user.isVerified) {
            return res.status(403).json({ message: 'Access denied. Your merchant account is pending admin verification.' });
        }

        // 3. Create Product linked directly to User
        const food = await Food.create({
            ...req.body,
            seller: user._id === 'guest_admin' ? userId : user._id
        });

        // Optional: Admin Notification
        const sellerInfo = `${user.name || 'Seller'} (${user.email})`;
        await createAdminNotification(req, 'product', `New product added: ${food.name} by ${sellerInfo}`);

        res.status(201).json({ success: true, food });
    } catch (error) {
        console.error("Add Food Error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Update Food Item
exports.updateFood = async (req, res) => {
    try {
        let food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Ownership check
        if (req.user.role !== 'admin' && food.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this food' });
        }

        food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, food });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete Food Item
exports.deleteFood = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id);
        if (!food) {
            return res.status(404).json({ message: 'Food item not found' });
        }

        // Ownership check
        if (req.user.role !== 'admin' && food.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this food' });
        }

        await food.deleteOne();
        res.status(200).json({ success: true, message: 'Food item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Foods
exports.getAllFoods = async (req, res) => {
    try {
        const { keyword, category } = req.query;
        let query = { available: true };

        if (keyword) {
            query.name = { $regex: keyword, $options: 'i' };
        }
        if (category) {
            query.category = category;
        }

        const foods = await Food.find(query).populate('seller', 'name email phone');
        res.status(200).json({ success: true, foods });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Single Food
exports.getFoodDetails = async (req, res) => {
    try {
        const food = await Food.findById(req.params.id).populate('seller', 'name email phone');
        if (!food) {
            return res.status(404).json({ message: 'Food not found' });
        }
        res.status(200).json({ success: true, food });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Seller's Products (Directly by User ID)
exports.getSellerFoods = async (req, res) => {
    try {
        const userId = req.user._id;
        const foods = await Food.find({ seller: userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            foods
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
