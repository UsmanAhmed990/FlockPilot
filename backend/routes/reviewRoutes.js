const express = require('express');
const router = express.Router();
const { addRating, addReview, submitSellerReview, getRecentSellerReviews, submitFeedback } = require('../controllers/reviewController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/ratings', addRating); // Star rating endpoint (no auth required for flexibility)
router.post('/', submitFeedback); // Handles POST to /api/reviews
router.post('/reviews', submitFeedback); // Handles POST to /api/review/reviews (if called that way)
router.post('/submit', submitFeedback); // Extra fallback
router.post('/reviews/old', isAuthenticated, addReview);

// Seller Reviews
router.post('/seller', isAuthenticated, submitSellerReview);
router.get('/seller/recent', getRecentSellerReviews);

module.exports = router;
