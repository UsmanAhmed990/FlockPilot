const express = require('express');
const router = express.Router();
const { createOrder, getMyOrders, getChefOrders, updateOrderStatus, verifyPayment, rejectPayment, getAdminAllOrders } = require('../controllers/orderController');
const { isAuthenticated, authorizeRoles } = require('../middleware/authMiddleware');
const { upload } = require('../utils/upload');

router.post('/new', upload.single('paymentScreenshot'), createOrder);
router.get('/me', isAuthenticated, getMyOrders);
router.get('/chef', isAuthenticated, authorizeRoles('seller', 'chef'), getChefOrders);
router.get('/admin/all', isAuthenticated, authorizeRoles('admin'), getAdminAllOrders);
router.put('/:id', isAuthenticated, authorizeRoles('chef', 'seller', 'admin'), updateOrderStatus);
router.put('/verify/:id', isAuthenticated, authorizeRoles('admin'), verifyPayment);
router.put('/reject/:id', isAuthenticated, authorizeRoles('admin'), rejectPayment);

module.exports = router;
