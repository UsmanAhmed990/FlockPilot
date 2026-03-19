const express = require('express');
const router = express.Router();
const { getAdminNotifications, markAdminNotificationsRead } = require('../controllers/adminNotificationController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, authorizeRoles('admin'), getAdminNotifications);
router.put('/mark-as-read', isAuthenticated, authorizeRoles('admin'), markAdminNotificationsRead);

module.exports = router;
