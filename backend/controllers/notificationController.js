const OrderNotification = require('../models/Notification');

// Get notifications for logged in chef
exports.getChefNotifications = async (req, res) => {
    try {
        let query = {};

        // Handle Admin/Guest Admin bypass - Admins see ALL notifications
        if (req.user.role === 'admin' || req.user.id === 'guest_admin') {
            console.log('Notification Fetch: Admin/Guest Admin detected, fetching all.');
            query = {}; // Empty query finds everything
        } else {
            // Use req.user.id directly as the sellerId
            query = { sellerId: req.user.id };
            console.log('Notification Fetch: Seller detected. User ID:', req.user.id, 'Query:', JSON.stringify(query));
        }

        const notifications = await OrderNotification.find(query)
            .sort({ createdAt: -1 })
            .limit(20);

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark all notifications as read for logged in user
exports.markNotificationsRead = async (req, res) => {
    try {
        let query = {};

        if (req.user.role === 'admin' || req.user.id === 'guest_admin') {
            query = { isRead: false };
        } else {
            // Use req.user.id directly
            query = { sellerId: req.user.id, isRead: false };
        }

        await OrderNotification.updateMany(query, { isRead: true });

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Helper to create notification (internal use)
exports.createNotification = async (req, sellerId, type, message) => {
    try {
        const notification = await OrderNotification.create({
            sellerId,
            type,
            message
        });

        // Real-time Update via Socket.io
        const io = req.app.get('socketio');
        if (io) {
            if (sellerId) {
                io.to(sellerId.toString()).emit('notification', notification);
            } else {
                // Platform-wide notification
                io.emit('notification', notification);
            }
        }
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
    }
};
