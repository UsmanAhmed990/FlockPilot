const Review = require('../models/Review');
const Food = require('../models/Food');
const SellerReview = require('../models/SellerReview');
const Chef = require('../models/Chef');
const Order = require('../models/Order');
const Feedback = require('../models/Feedback');
const { createAdminNotification } = require('./adminNotificationController');
const { createNotification } = require('./notificationController');

// Add Star Rating (Real-Time)
exports.addRating = async (req, res) => {
    try {
        const { rating, comment, sellerId } = req.body;
        const email = req.user ? req.user.email : (req.body.email || 'guest@flockpilot.com');
        const userId = req.user ? req.user.id : null;
        const senderName = req.body.name || (req.user ? req.user.name : 'A Guest');

        const hasValidRating = rating >= 1 && rating <= 5;
        const hasComment = comment && comment.trim().length > 0;

        if (!hasValidRating && !hasComment) {
            return res.status(400).json({ message: 'Please provide either a star rating or a written comment.' });
        }

        const finalRating = hasValidRating ? rating : undefined;

        const review = await Review.create({
            userId,
            sellerId,
            email,
            comment: comment || '',
            rating: finalRating
        });

        // Build notification message
        const stars = hasValidRating ? '⭐'.repeat(finalRating) : '';
        const ratingText = hasValidRating ? ` ${finalRating}-star rating` : ' feedback';
        const commentText = hasComment ? `: "${comment}"` : '';
        const adminMsg = `${stars} New${ratingText} from ${senderName}${commentText}`.trim();

        // Notify Admin in real-time
        await createAdminNotification(req, 'review', adminMsg);

        // Notify Seller if applicable
        if (sellerId) {
            await createNotification(req, sellerId, 'review', `${stars} You received new${ratingText}${commentText}`.trim());
        }

        // Emit real-time rating event for UI updates
        const io = req.app.get('socketio');
        if (io) {
            io.emit('sellerRating', { rating: finalRating, buyerName: senderName, comment, createdAt: new Date() });
        }

        res.status(201).json({ success: true, review });
    } catch (error) {
        console.error("ADD RATING ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};

// Add Review (Remarks)
exports.addReview = async (req, res) => {
    try {
        const { foodId, review: comment } = req.body;
        let review = await Review.findOne({ user: req.user.id, food: foodId });
        if (review) {
            review.comment = comment;
            await review.save();
        } else {
            review = await Review.create({
                user: req.user.id,
                food: foodId,
                comment
            });
        }
        res.status(200).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add/Submit Seller Review
exports.submitSellerReview = async (req, res) => {
    try {
        const { orderId, chefId, comment } = req.body;

        const order = await Order.findOne({ _id: orderId, user: req.user.id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status !== 'Delivered') {
            return res.status(400).json({ message: 'Can only review delivered orders' });
        }

        if (order.isReviewed) {
            return res.status(400).json({ message: 'Order already reviewed' });
        }

        const review = await SellerReview.create({
            user: req.user.id,
            chef: chefId,
            order: orderId,
            comment
        });

        order.isReviewed = true;
        await order.save();

        await createAdminNotification(req, 'review', `New seller feedback from ${req.user.name}: "${comment}"`);

        res.status(201).json({ success: true, review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch Recent Seller Reviews
exports.getRecentSellerReviews = async (req, res) => {
    try {
        const reviews = await SellerReview.find()
            .populate('user', 'name')
            .populate('chef', 'businessName image')
            .sort({ createdAt: -1 })
            .limit(10);

        res.status(200).json({ success: true, reviews });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// General Feedback/Review
exports.submitFeedback = async (req, res) => {
    try {
        const { comment, sellerId } = req.body;
        const email = req.user ? req.user.email : req.body.email;
        const userId = req.user ? req.user.id : null;

        if (!email || !comment) {
            return res.status(400).json({ message: 'Email and comment are required' });
        }

        const feedback = await Review.create({
            userId,
            sellerId,
            email,
            comment
        });

        const senderName = req.body.name || (req.user ? req.user.name : 'A Buyer');
        
        await createAdminNotification(req, 'feedback', `Feedback from ${senderName}: "${comment}"`);

        if (sellerId) {
            await createNotification(req, sellerId, 'review', `New Feedback: "${comment}"`);
        }

        res.status(201).json({ success: true, feedback });
    } catch (error) {
        console.error("SUBMIT FEEDBACK ERROR:", error);
        res.status(500).json({ message: error.message });
    }
};
