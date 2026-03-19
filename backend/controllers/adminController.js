const User = require('../models/User');
const Approval = require('../models/Approval');
const sendEmail = require('../utils/sendEmail');

// Get all pending sellers
exports.getPendingSellers = async (req, res) => {
    try {
        const sellers = await User.find({
            role: { $in: ['seller', 'chef'] },
            verificationStatus: 'pending'
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            sellers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve seller
exports.approveSeller = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isVerified = true;
        user.verificationStatus = 'approved';
        await user.save();

        // Log to Approval history
        await Approval.create({
            seller: user._id,
            status: 'approved',
            adminActionBy: req.user.email || 'Admin'
        });

        // Notify client via Socket.io (if implemented in route)
        const io = req.app.get('socketio');
        if (io) {
            io.to(user._id.toString()).emit('verificationStatusUpdate', {
                isVerified: true,
                verificationStatus: 'approved'
            });
        }

        res.status(200).json({
            success: true,
            message: `Seller ${user.name} approved successfully`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reject seller
exports.rejectSeller = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isVerified = false;
        user.verificationStatus = 'rejected';
        await user.save();

        // Log to Approval history
        await Approval.create({
            seller: user._id,
            status: 'rejected',
            adminActionBy: req.user.email || 'Admin'
        });

        // Notify client via Socket.io
        const io = req.app.get('socketio');
        if (io) {
            io.to(user._id.toString()).emit('verificationStatusUpdate', {
                isVerified: false,
                verificationStatus: 'rejected'
            });
        }

        res.status(200).json({
            success: true,
            message: `Seller ${user.name} rejected`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Block User
exports.blockUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.isVerified = false;
        user.verificationStatus = 'rejected';
        await user.save();

        // Send Blocked Email
        try {
            await sendEmail({
                email: user.email,
                subject: 'Account Blocked - FlockPilot',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                        <h2 style="color: #d32f2f;">Account Restricted</h2>
                        <p>Hi <b>${user.name || 'User'}</b>,</p>
                        <p>We regret to inform you that your account on <b>FlockPilot</b> has been blocked by the administrator.</p>
                        <p>If you believe this is a mistake, please contact our support team.</p>
                        <br/>
                        <p>Best regards,<br/>FlockPilot Team</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error('Failed to send block email:', emailError);
        }

        res.status(200).json({
            success: true,
            message: `User ${user.email} has been blocked and notified.`
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
