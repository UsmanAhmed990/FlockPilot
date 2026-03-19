const express = require('express');
const router = express.Router();
const { getPendingSellers, approveSeller, rejectSeller, blockUser } = require('../controllers/adminController');
const { getAdminAllUsers } = require('../controllers/authController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

// All routes here require admin access
router.use(isAuthenticated);

// Allow View-only stats for sellers/chefs/admins
router.get('/pending-sellers', authorizeRoles('admin', 'seller', 'chef'), getPendingSellers);

// User Management (Admin Only)
router.get('/all-users', authorizeRoles('admin'), getAdminAllUsers);

// Restricted Admin Actions
router.put('/approve-seller/:id', authorizeRoles('admin'), approveSeller);
router.put('/reject-seller/:id', authorizeRoles('admin'), rejectSeller);
router.put('/block-user/:id', authorizeRoles('admin'), blockUser);

module.exports = router;
