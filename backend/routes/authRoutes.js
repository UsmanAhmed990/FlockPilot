const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile, getAdminAllUsers, forgotPassword, verifyOtp, resetPassword, verifyAdmin } = require('../controllers/authController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');
const { upload } = require('../utils/upload');

router.post('/register', upload.single('certificate'), registerUser);
router.post('/login', loginUser);
router.get('/logout', logoutUser);
router.post('/verify-admin', verifyAdmin);
router.get('/me', isAuthenticated, getUserProfile);
router.get('/admin/all', isAuthenticated, authorizeRoles('admin', 'seller', 'chef'), getAdminAllUsers);

// Password Reset Flow
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
