const express = require('express');
const router = express.Router();
const { getChefNotifications, markNotificationsRead } = require('../controllers/notificationController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, authorizeRoles('chef', 'seller', 'admin'), getChefNotifications);
router.put('/mark-as-read', isAuthenticated, authorizeRoles('chef', 'seller', 'admin'), markNotificationsRead);

module.exports = router;
