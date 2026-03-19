const AdminNotification = require('../models/AdminNotification');

// Get all admin notifications
exports.getAdminNotifications = async (req, res) => {
    try {
        const notifications = await AdminNotification.find()
            .sort({ createdAt: -1 })
            .limit(30);

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mark all as read
exports.markAdminNotificationsRead = async (req, res) => {
    try {
        await AdminNotification.updateMany({ isRead: false }, { isRead: true });

        // Emit event to reset badges everywhere
        const io = req.app.get('socketio');
        if (io) {
            io.emit('adminNotificationsRead');
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Helper function to create admin notification (internal use)
exports.createAdminNotification = async (req, type, message) => {
    try {
        const notification = await AdminNotification.create({ type, message });

        // Real-time Socket.io Update
        const io = req?.app?.get('socketio');
        if (io) {
            io.emit('adminNotification', notification);
        }

        console.log(`Admin Notification Created & Emitted: [${type}] ${message}`);
    } catch (error) {
        console.error('Error creating admin notification:', error);
    }
};
